import importlib
import os

from flask import Flask

from api.config import DevelopmentConfig
from api.extensions import extensions


def import_models():
    for finder, name, ispkg in pkgutil.iter_modules([os.getcwd()]):
        if ispkg and os.path.isfile(os.path.join(finder.path, name, 'models.py')):
            importlib.import_module(f'{name}.models')


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

    for module in app.config['MODULES']:
        importlib.import_module(f'{module}.models')

    from api.userdata.views import userdata
    app.register_blueprint(userdata)

    return app
