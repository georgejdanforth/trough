from flask import (
    Blueprint,
    jsonify
)


userdata = Blueprint('userdata', __name__, url_prefix='/userdata')


@userdata.route('/', methods=['GET'])
def test():
    return jsonify({'a': 1, 'b': 2})
