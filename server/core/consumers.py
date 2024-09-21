import json, logging
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
import asyncio
from asgiref.sync import sync_to_async
from .models import CustomUser, Room
from django.core.cache import cache
from pokerkit import NoLimitTexasHoldem
from .pokerLogic import *

logger = logging.getLogger("django")

lock = asyncio.Lock()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Get the room name and username from the URL
        self.room_name = self.scope['url_route']['kwargs']['entry_code']
        self.room_group_name = 'chat_%s' % self.room_name
        username = self.scope['query_string'].decode('utf-8')
        self.username = parse_qs(username).get('username', [None])[0]
        logger.info(f"Socket Got Username: {self.username}")

        # Get the user and room from the database
        user = await sync_to_async(CustomUser.objects.get)(username=self.username)

        # add the user to the room
        user.room = await sync_to_async(Room.objects.get)(entry_code=self.room_name)

        # if no room close connection
        if user.room is None:
            self.close()
            return

        # save the user now that he is in the room
        await sync_to_async(user.save)()

        # add the user to the room in the cache
        room_info = cache.get(self.room_name)
        if room_info is not None:
            new_player = {
                "username": self.username,
                "ready": False
            }
            logger.info(new_player)
            room_info['players'].append(new_player)
        cache.set(self.room_name, room_info)

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        # notify the room that somebody has joined
        await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'room_update',
                    'message': f"{self.username} has just joined the room",
                    'room_info': room_info
                }
            )

        await self.accept()

    async def disconnect(self, close_code):
        user = await sync_to_async(CustomUser.objects.get)(username=self.username)
        user.room = None
        await sync_to_async(user.save)()

        room_info = cache.get(self.room_name)
        players = room_info['players']
        for i in range(len(players)):
            player = players[i]
            logger.info(player)
            if player['username'] == self.username:
                del players[i]
                break
        cache.set(self.room_name, room_info)
        

        # notify the room that somebody has left
        await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'room_update',
                    'message': f"{self.username} has just joined the room",
                    'room_info': room_info
                }
            )

        room = await sync_to_async(Room.objects.get)(entry_code=self.room_name)
        user_count = await sync_to_async(room.users.count)()
        logger.info(f"User count: {user_count}")
        if user_count == 0:
            await sync_to_async(room.delete)()

        
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        username = self.username

        type = text_data_json['type']

        if type == 'ready':
            logger.info("Received ready message")

            room_info = cache.get(self.room_name)

            players = room_info['players']
            for player in players:
                if player['username'] == self.username:
                    logger.info("FOUND PLAYER")
                    player['ready'] = not player['ready']

            cache.set(self.room_name, room_info)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'ready_update',
                    'message': f"{self.username} is ready",
                    'room_info': room_info
                }
            )

            """ # generate new game state
            if generate_game_state(self.room_name):
                logger.info(f"Generated game state for room {self.room_name}")
            else:
                logger.error(f"Failed to generate game state for room {self.room_name}")
                self.close()
                return
            
            # starting actions for the hand
            status = await automate_animations(self.channel_layer, self.room_name)

            # error handling
            if status:
                logger.info("Ready!!")
            else:
                logger.error("Something went wrong in the ready action") """
        elif type == 'chat_message':
            logger.info("Received chat message")

            message = text_data_json['message']
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': username
                }
            )
        elif type == 'game_update':
            logger.info("Received game update message")
        else:
            logger.error("Received unknown message type")
            return
        

       

        #async with lock:

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': message,
            'username': username
        }))

    async def game_update(self, event):
        message = event['message']
        room_info = event['room_info']
        # Send the message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'game_update',
            'gameUpdate': message,
            'roomInfo': room_info,
        }))

    async def room_update(self, event):
        message = event['message']
        room_info = event['room_info']
        await self.send(text_data=json.dumps({
            'type': 'room_update',
            'gameUpdate': message,
            'roomInfo': room_info,
        }))

    async def ready_update(self, event):
        message = event['message']
        room_info = event['room_info']
        await self.send(text_data=json.dumps({
            'type': 'ready_update',
            'gameUpdate': message,
            'roomInfo': room_info,
        }))

