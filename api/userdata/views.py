from flask import (
    Blueprint,
    jsonify,
    request
)

from api.extensions import db
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
