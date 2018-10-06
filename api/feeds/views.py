import requests

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
from sqlalchemy.orm.exc import NoResultFound

from api.extensions import db
from api.feeds import constants
from api.feeds.models import (
    Feed,
    FeedItem
)
from api.feeds.utils import (
    FeedParser,
    get_or_create_feed
)
from api.userdata.models import (
    User,
    user_feed
)
from api.utils import (
    Responses,
    receives_json,
    receives_query_params
)


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
@receives_query_params
def get_feed_items(page):
    user = User.query.filter_by(id=get_jwt_identity()).one()
    return Responses.json_response((
        feed_item.to_dict(user=user)
        for feed_item in (
            FeedItem
            .query
            .join(Feed, Feed.id == FeedItem.feed_id)
            .join(user_feed, Feed.id == user_feed.c.feed_id)
            .filter(user_feed.c.user_id == user.id)
            .filter_by(**request.query_params)
            .order_by(FeedItem.pubdate.desc())
            .paginate(page=page, per_page=constants.MAX_ITEMS_PER_PAGE)
            .items
        )
    ))


@feeds.route('/isvalid', methods=['GET'])
@cross_origin()
@jwt_required
@receives_query_params
def is_valid_feed():
    is_valid = False
    feed_url = request.query_params.get('url')

    if feed_url:
        try:
            Feed.query.filter_by(feed_url=FeedParser.clean_url(feed_url)).one()
            is_valid = True
        except NoResultFound:
            feed_response = requests.get(feed_url)
            if feed_response.ok:
                try:
                    FeedParser(feed_url, feed_response.content, parse_metadata=True)
                    is_valid = True
                except ValueError:
                    pass

    return Responses.json_response({'is_valid': is_valid})


@feeds.route('/add', methods=['POST'])
@cross_origin()
@jwt_required
@receives_json
def add_feed():
    feed_url = request.json_data.get('feed_url')
    feed = get_or_create_feed(feed_url)
    user = User.query.filter_by(id=get_jwt_identity()).one()
    user.feeds.append(feed)
    db.session.commit()

    return Responses.ok()
