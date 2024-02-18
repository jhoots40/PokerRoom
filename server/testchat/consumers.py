import json
from channels.generic.websocket import WebsocketConsumer

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(text_data=json.dumps({
            'message': 'Hello World'
        }))

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        print("made it here")
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        print('message:', message)

        self.send(text_data=json.dumps({
            'message': message
        }))