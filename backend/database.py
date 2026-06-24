from pymongo import MongoClient
from config import Config

client = None
db = None

def init_db():
    global client, db
    try:
        # Connect to MongoDB client with a timeout of 5 seconds
        client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
        # The ping command is cheap and does not require auth
        client.admin.command('ping')
        
        db = client.get_default_database(default=Config.MONGO_DB_NAME)
        print(f"Connected to MongoDB database: '{db.name}' successfully.")
        return db
    except Exception as e:
        print(f"FATAL: Database connection failed! {e}")
        # We don't crash here so that offline development or port errors don't stop execution immediately,
        # but we raise so callers know.
        raise e

def get_db():
    global db
    if db is None:
        db = init_db()
    return db

def serialize_doc(doc):
    """Convert MongoDB ObjectId in document to string for JSON serialization."""
    if doc is None:
        return None
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

def serialize_docs(docs):
    """Serialize a list of MongoDB documents."""
    return [serialize_doc(doc) for doc in docs]
