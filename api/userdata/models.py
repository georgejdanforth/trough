from api.extensions import (
    bcrypt,
    db
)
from api.models import BaseModel


user_feed = db.Table(
    'user_feed',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('feed_id', db.Integer, db.ForeignKey('feed.id'), primary_key=True)
)


user_saved_feed_item = db.Table(
    'user_saved_feed_item',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('feed_item_id', db.Integer, db.ForeignKey('feeditem.id'), primary_key=True),
    db.UniqueConstraint('user_id', 'feed_item_id')
)


class User(BaseModel):

    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(30), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), default=True)
    last_login_at = db.Column(db.DateTime())
    current_login_at = db.Column(db.DateTime())
    last_login_ip = db.Column(db.String(45))
    current_login_ip = db.Column(db.String(45))
    login_count = db.Column(db.Integer(), nullable=False, default=0)

    feeds = db.relationship(
        'Feed',
        secondary=user_feed,
        lazy='dynamic',
        backref=db.backref('users', lazy='dynamic')
    )

    saved_feed_items = db.relationship('FeedItem', secondary=user_saved_feed_item)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.password = (
            bcrypt
            .generate_password_hash(self.password)
            .decode('utf-8')
        )


class JsonWebToken(BaseModel):

    jti = db.Column(db.String(36), nullable=False)
    token_type = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    blacklisted = db.Column(db.Boolean, nullable=False, default=False)
    expires = db.Column(db.DateTime, nullable=False)
