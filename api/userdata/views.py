from flask import (
    Blueprint,
    jsonify,
    request
)
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token
)
from http import HTTPStatus

from api.extensions import (
    bcrypt,
    db
)
from api.userdata.models import User
from api.utils import (
    receives_json,
    Responses
)


userdata = Blueprint('userdata', __name__, url_prefix='/userdata')


@userdata.route('/signup', methods=['POST'])
@receives_json
def create_user():
    user = User(**request.json_data)
    db.session.add(user)
    db.session.commit()

    return Responses.ok()


@userdata.route('/login', methods=['POST'])
@receives_json
def login():
    email = request.json_data.get('email')
    password = request.json_data.get('password')

    user = User.query.filter_by(email=email).first()

    if not user:
        return Responses.error(
            f'User not found with email: {email}',
            HTTPStatus.UNAUTHORIZED.value
        )

    if not bcrypt.check_password_hash(user.password, password):
        return Responses.error(
            f'Invalid password for user with email: {email}',
            HTTPStatus.UNAUTHORIZED.value
        )

    access_token = create_access_token(user)
    refresh_token = create_refresh_token(user)

    return Responses.json_response(
        {'access_token': access_token, 'refresh_token': refresh_token},
        HTTPStatus.OK.value
    )
