import importlib
import os

from flask import (
    Blueprint,
    Flask
)

from api.commands import commands
from api.config import DevelopmentConfig
from api.extensions import extensions
from api.userdata import utils


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


def register_blueprints(app):
    for module_name in app.config['MODULES']:
        module = importlib.import_module(f'{module_name}.views')
        for item in (getattr(module, attr) for attr in dir(module)):
            if isinstance(item, Blueprint):
                app.register_blueprint(item)


def add_commands(app):
    for command in commands:
        app.cli.add_command(command)


def create_app():

    app = Flask(__name__)

    initialize_config(app)
    initialize_extensions(app)

    for module_name in app.config['MODULES']:
        importlib.import_module(f'{module_name}.models')

    register_blueprints(app)
    add_commands(app)

    return app
