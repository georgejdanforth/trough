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
from api.feeds import constants
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


@feeds.route('/feeditems/<int:page>', methods=['GET'])
@cross_origin()
@jwt_required
def get_feed_items(page):
    return Responses.json_response(
        map(
            methodcaller('to_dict'),
            FeedItem
            .query
            .join(Feed, Feed.id == FeedItem.feed_id)
            .join(user_feed, Feed.id == user_feed.c.feed_id)
            .filter(user_feed.c.user_id == get_jwt_identity())
            .order_by(FeedItem.pubdate.desc())
            .paginate(page=page, per_page=constants.MAX_ITEMS_PER_PAGE)
            .items
        )
    )
