from flask import Flask


def create_app():
    app = Flask(__name__)

    from api.userdata.views import userdata
    app.register_blueprint(userdata)

    return app
