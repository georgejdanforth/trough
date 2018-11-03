from sqlalchemy.dialects.postgresql import (
    JSON,
    TEXT
)

from api.extensions import db
from api.models import (
    BaseModel,
    Serializable
)
from api.userdata.models import (
    User,
    user_feed
)


custom_topic_feed = db.Table(
    'custom_topic_feed',
    db.Column('custom_topic_id', db.Integer, db.ForeignKey('customtopic.id'), primary_key=True),
    db.Column('feed_id', db.Integer, db.ForeignKey('feed.id'), primary_key=True),
    db.UniqueConstraint('custom_topic_id', 'feed_id')
)


class Feed(BaseModel, Serializable):

    __public__ = ['id', 'feed_url', 'site_url', 'title', 'feed_type']

    feed_url = db.Column(TEXT, nullable=False)
    site_url = db.Column(TEXT)
    title = db.Column(TEXT, nullable=False)
    feed_type = db.Column(db.Integer, nullable=False)
    last_processed = db.Column(db.DateTime)

    @classmethod
    def for_user(cls, user):
        user_id = user.id if isinstance(user, User) else user
        return (
            cls.query
            .join(user_feed, user_feed.c.feed_id == cls.id)
            .filter(user_feed.c.user_id == user_id)
        )


class FeedItem(BaseModel, Serializable):

    __public__ = [
        'id',
        'title',
        'url',
        'pubdate',
        'description',
        'content',
        'enclosure',
        'feed_info',
        'is_saved'
    ]

    title = db.Column(TEXT, nullable=False)
    url = db.Column(TEXT, nullable=False)
    pubdate = db.Column(db.DateTime)
    description = db.Column(TEXT)
    content = db.Column(TEXT)
    enclosure = db.Column(JSON)

    saved = db.Column(db.Boolean, default=False)

    feed_id = db.Column(db.Integer, db.ForeignKey('feed.id'), nullable=False)
    feed = db.relationship('Feed', backref='feed_items', lazy='subquery')

    @property
    def feed_info(self):
        return self.feed.to_dict()

    def is_saved(self, user):
        return self in user.saved_feed_items


class CustomTopic(BaseModel, Serializable):

    __public__ = [
        'id',
        'name'
    ]

    name = db.Column(TEXT, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    feeds = db.relationship('Feed', secondary=custom_topic_feed)

    @classmethod
    def for_user(cls, user):
        return cls.query.filter(
            cls.user_id == (user.id if isinstance(user, User) else user)
        )
