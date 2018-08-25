from flask import (
    Blueprint,
    jsonify,
    request
)

from api.utils import receives_json


userdata = Blueprint('userdata', __name__, url_prefix='/userdata')


@userdata.route('/signup', methods=['POST'])
@receives_json
def create_user():
    return jsonify(request.json_data)
