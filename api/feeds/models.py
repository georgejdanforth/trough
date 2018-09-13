from sqlalchemy.dialects.postgresql import TEXT

from api.extensions import db
from api.models import BaseModel


class Feed(BaseModel):

    feed_url = db.Column(TEXT, nullable=False)
    site_url = db.Column(TEXT)
    title = db.Column(TEXT, nullable=False)
    feed_type = db.Column(db.Integer, nullable=False)
    last_processed = db.Column(db.DateTime)