import itertools
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
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import NoResultFound

from api.extensions import db
from api.feeds import constants
from api.feeds.models import (
    custom_topic_feed,
    CustomTopic,
    Feed,
    FeedItem
)
from api.feeds.utils import (
    FeedParser,
    get_or_create_feed
)
from api.userdata.models import (
    User,
    user_feed,
    user_saved_feed_item
)
from api.utils import (
    Responses,
    flatten,
    receives_json,
    receives_query_params
)


feeds = Blueprint('feeds', __name__, url_prefix='/feeds')


@feeds.route('/feeds', methods=['GET'])
@cross_origin()
@jwt_required
@receives_query_params
def get_feeds():
    for_topic = request.query_params.get('for_topic')
    if for_topic:
        topic_feeds = (
            db.session
            .query(custom_topic_feed)
            .filter(custom_topic_feed.c.custom_topic_id == for_topic)
            .subquery()
        )

        return Responses.json_response((
            {'added': bool(topic_id), **feed.to_dict()} for feed, topic_id in (
                db.session
                .query(Feed, topic_feeds.c.custom_topic_id)
                .join(user_feed, user_feed.c.feed_id == Feed.id)
                .filter(user_feed.c.user_id == get_jwt_identity())
                .outerjoin(topic_feeds, topic_feeds.c.feed_id == Feed.id)
                .all()
            )
        ))

    return Responses.json_response(
        map(methodcaller('to_dict'), Feed.for_user(get_jwt_identity()).all())
    )


@feeds.route('/feeditems/<int:page>', methods=['GET'])
@cross_origin()
@jwt_required
@receives_query_params
def get_feed_items(page):
    user = User.query.filter_by(id=get_jwt_identity()).one()

    if 'saved' in request.query_params:
        return Responses.json_response((
            feed_item.to_dict(user=user)
            for feed_item in sorted(
                user.saved_feed_items,
                key=lambda fi: fi.pubdate,
                reverse=True
            )
        ))

    elif 'topic_id' in request.query_params:
        topic_id = request.query_params['topic_id']
        return Responses.json_response((
            feed_item.to_dict(user=user)
            for feed_item in (
                FeedItem
                .query
                .join(Feed, Feed.id == FeedItem.feed_id)
                .join(custom_topic_feed, Feed.id == custom_topic_feed.c.feed_id)
                .filter(custom_topic_feed.c.custom_topic_id == topic_id)
                .order_by(FeedItem.pubdate.desc())
                .paginate(page=page, per_page=constants.MAX_ITEMS_PER_PAGE)
                .items
            )
        ))

    else:
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


@feeds.route('/save/<int:feed_item_id>', methods=['POST'])
@cross_origin()
@jwt_required
def save_feed_item(feed_item_id):
    try:
        db.session.execute(
            user_saved_feed_item.insert().values(
                user_id=get_jwt_identity(),
                feed_item_id=feed_item_id
            )
        )

        db.session.commit()
    except IntegrityError:
        pass

    return Responses.ok()


@feeds.route('/unsave/<int:feed_item_id>', methods=['DELETE'])
@cross_origin()
@jwt_required
def remove_saved_feed_item(feed_item_id):
    db.session.execute(
        user_saved_feed_item
        .delete()
        .where(user_saved_feed_item.c.user_id == get_jwt_identity())
        .where(user_saved_feed_item.c.feed_item_id == feed_item_id)
    )

    db.session.commit()

    return Responses.ok()


@feeds.route('/topics', methods=['GET'])
@cross_origin()
@jwt_required
@receives_query_params
def get_custom_topics():
    for_feed = request.query_params.get('for_feed')
    if for_feed:
        topic_feeds = (
            db.session
            .query(custom_topic_feed)
            .filter(custom_topic_feed.c.feed_id == for_feed)
            .subquery()
        )

        return Responses.json_response((
            {'added': bool(feed_id), **topic.to_dict()} for topic, feed_id in (
                db.session
                .query(CustomTopic, topic_feeds.c.feed_id)
                .filter(CustomTopic.user_id == get_jwt_identity())
                .outerjoin(topic_feeds, topic_feeds.c.custom_topic_id == CustomTopic.id)
                .all()
            )
        ))

    return Responses.json_response((
        map(methodcaller('to_dict'), CustomTopic.for_user(get_jwt_identity()).all())
    ))


@feeds.route('/topics/add', methods=['POST'])
@cross_origin()
@jwt_required
@receives_json
def add_custom_topic():
    # noinspection PyArgumentList
    topic = CustomTopic(
        name=request.json_data.get('name'),
        user_id=get_jwt_identity()
    )

    db.session.add(topic)
    db.session.commit()

    return Responses.ok()


@feeds.route('/topics/manage', methods=['POST'])
@cross_origin()
@jwt_required
@receives_json
def manage_custom_topics():

    user_id = get_jwt_identity()

    custom_topic_ids = flatten(
        CustomTopic.for_user(user_id)
        .filter(CustomTopic.id.in_(request.json_data.get('topic_ids', [])))
        .with_entities(CustomTopic.id)
        .all()
    )

    feed_ids = flatten(
        Feed.for_user(user_id)
        .filter(Feed.id.in_(request.json_data.get('feed_ids', [])))
        .with_entities(Feed.id)
        .all()
    )

    existing = db.session.query(custom_topic_feed).filter(
        custom_topic_feed.c.custom_topic_id.in_(custom_topic_ids),
        custom_topic_feed.c.feed_id.in_(feed_ids),
    ).all()

    to_add = list(set(itertools.product(custom_topic_ids, feed_ids)) - set(existing))

    if existing:
        try:
            custom_topic_ids, feed_ids = zip(*existing)
            db.session.execute(
                custom_topic_feed
                .delete()
                .where(custom_topic_feed.c.custom_topic_id.in_(custom_topic_ids))
                .where(custom_topic_feed.c.feed_id.in_(feed_ids))
            )
            db.session.commit()
        except IntegrityError:
            pass

    if to_add:
        try:
            db.session.execute(custom_topic_feed.insert().values(to_add))
            db.session.commit()
        except IntegrityError:
            pass

    return Responses.ok()
