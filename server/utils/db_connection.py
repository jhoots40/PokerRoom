from pymongo import MongoClient

class MongoDBConnection:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.client = MongoClient('mongodb://localhost:27017/')
            cls._instance.db = cls._instance.client['PokerRoom']
        return cls._instance

    def get_database(self):
        return self.db

# Usage example:

# Create an instance of MongoDBConnection
mongo_connection = MongoDBConnection()

# Get the database
db = mongo_connection.get_database()