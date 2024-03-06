import json, logging
from channels.generic.websocket import AsyncWebsocketConsumer
from urllib.parse import parse_qs
import asyncio
from asgiref.sync import sync_to_async
from .models import CustomUser, Room

logger = logging.getLogger("django")

lock = asyncio.Lock()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['entry_code']
        self.room_group_name = 'chat_%s' % self.room_name

        username = self.scope['query_string'].decode('utf-8')
        username = parse_qs(username).get('username', [None])[0]
        self.username = username
        logger.info(f"Socket Got Username: {self.username}")

        user = await sync_to_async(CustomUser.objects.get)(username=username)
        user.room = await sync_to_async(Room.objects.get)(entry_code=self.room_name)

        await sync_to_async(user.save)()

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        user = await sync_to_async(CustomUser.objects.get)(username=self.username)
        user.room = None
        await sync_to_async(user.save)()

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
        message = text_data_json['message']

        async with lock:
            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message,
                    'username': username
                }
            )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        username = event['username']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'username': username
        }))