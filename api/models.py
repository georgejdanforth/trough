import datetime

from sqlalchemy.ext.declarative import declared_attr

from api.extensions import db


class BaseModel(db.Model):

    __abstract__ = True

    @declared_attr
    def __tablename__(cls):
        return cls.__name__.lower()

    id = db.Column(db.Integer, primary_key=True)

    created = db.Column(
        db.DateTime,
        default=datetime.datetime.utcnow
    )
    updated = db.Column(
        db.DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )
