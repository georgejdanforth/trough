from flask import (
    Blueprint,
    request
)
from flask_cors import cross_origin
from flask_jwt_extended import (
    get_jwt_identity,
    jwt_required
)
from operator import methodcaller

from api.extensions import db
from api.feeds.models import (
    Feed,
    FeedItem
)
from api.userdata.models import user_feed
from api.utils import Responses


feeds = Blueprint('feeds', __name__, url_prefix='/feeds')


@feeds.route('/feeds', methods=['GET'])
@cross_origin()
@jwt_required
def get_feeds():
    return Responses.json_response(
        map(
            methodcaller('to_dict'),
            Feed
            .query
            .join(user_feed, user_feed.c.feed_id == Feed.id)
            .filter(user_feed.c.user_id == get_jwt_identity())
            .all()
        )
    )
