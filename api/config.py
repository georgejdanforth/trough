import datetime


class BaseConfig:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    MODULES = [
        'api.userdata',
    ]

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost/trough_db'
