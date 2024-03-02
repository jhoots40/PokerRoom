import json, logging
from channels.generic.websocket import WebsocketConsumer

logger = logging.getLogger("django")

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        self.send(text_data=json.dumps({
            'message': 'Hello World'
        }))

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        logger.info('client sent:')
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        self.send(text_data=json.dumps({
            'message': message
        }))