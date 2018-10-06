import datetime

from abc import abstractmethod
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


class Serializable:

    @property
    @abstractmethod
    def __public__(self):
        """
        """

    def _get_field(self, field_name, **kwargs):
        field = getattr(self, field_name)
        if callable(field):
            return field(**kwargs)

        return field

    def to_dict(self, **kwargs):
        ignore = kwargs.get('ignore', [])
        return {
            field_name: self._get_field(field_name, **kwargs)
            for field_name in self.__public__
            if field_name not in ignore
        }
