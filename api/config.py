import datetime


class BaseConfig:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(hours=1)
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']

    MODULES = [
        'api.userdata',
        'api.feeds',
    ]


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    SECRET_KEY = 'a5ba2a3e234af6b169bca647f3e2d6cb32078e6f9f982e42'
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost/trough_db'
