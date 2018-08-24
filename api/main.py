import os

from flask import Flask

from api.config import DevelopmentConfig
from api.extensions import extensions


def initialize_config(app):
    app.config.from_object({
        'development': DevelopmentConfig
    }.get(os.environ.get('FLASK_ENV')))


def initialize_extensions(app):
    for extension_name, extension in extensions.items():
        if extension_name == 'migrate':
            extension.init_app(app, extensions['db'])
        else:
            extension.init_app(app)


def create_app():

    app = Flask(__name__)

    initialize_config(app)
    initialize_extensions(app)

    from api.userdata.views import userdata
    app.register_blueprint(userdata)

    return app
