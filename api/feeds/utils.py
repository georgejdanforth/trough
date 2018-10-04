import asyncio
import aiohttp
import dateparser
import datetime
import re
import requests

from io import StringIO
from pattern.web import plaintext
from sqlalchemy.orm.exc import NoResultFound
from xml.etree import ElementTree

from api.extensions import db
from api.feeds import constants
from api.feeds.models import (
    Feed,
    FeedItem
)
from api.feeds.types import FeedType


class FeedParser:

    _metadata_paths = {
        FeedType.rss.value: {
            'site_url': './channel/link',
            'title': './channel/title'
        },
        FeedType.atom.value: {
            'site_url': './link',
            'title': './title'
        }
    }

    _item_paths = {
        FeedType.rss.value: {
            'item': './channel/item',
            'url': './link',
            'title': './title',
            'pubdate': './pubDate',
            'description': './description',
            'content': '',
            'enclosure': './enclosure'
        },
        FeedType.atom.value: {
            'item': './entry',
            'title': './title',
            'url': './id',
            'pubdate': './updated',
            'description': './summary',
            'content': './content',
            'enclosure': ''
        }
    }

    def __init__(
        self,
        feed_url,
        response_content,
        parse_metadata=False,
        parse_items=False
    ):

        self.feed_url = self.clean_url(feed_url)
        self.feed_element = self._clean_namespaces(response_content.decode('utf-8'))
        self.feed_type = self._classify_feed_type()

        self._metadata = self._parse_metadata() if parse_metadata else None
        self._items = self._parse_items() if parse_items else None

    @staticmethod
    def clean_url(url):
        return url.split('?', maxsplit=1)[0]

    @staticmethod
    def _clean_namespaces(xml):
        iterable_element = ElementTree.iterparse(StringIO(xml))
        for _, element in iterable_element:
            element.tag = re.sub(r'^\{.*\}', '', element.tag)

        return iterable_element.root

    @property
    def metadata(self):
        if not self._metadata:
            self._metadata = self._parse_metadata()

        return {
            **self._metadata,
            **{'feed_url': self.feed_url, 'feed_type': self.feed_type}
        }

    @property
    def items(self):
        if not self._items:
            self._items = self._parse_items()

        return self._items

    def _classify_feed_type(self):
        if self.feed_element.tag == 'rss':
            return FeedType.rss.value
        elif self.feed_element.tag == 'feed':
            return FeedType.atom.value
        else:
            raise ValueError('Unable to classify feed type.')

    def _parse_metadata(self):

        title_element = self.feed_element.find(
            self._metadata_paths[self.feed_type]['title']
        )

        if title_element is not None:
            title = title_element.text.strip()
        else:
            title = None

        site_url_element = self.feed_element.find(
            self._metadata_paths[self.feed_type]['site_url']
        )

        if site_url_element is not None:
            if self.feed_type == FeedType.rss.value:
                site_url = site_url_element.text.strip()
            else:
                site_url = site_url_element.get('href').strip()
        else:
            site_url = None

        return {'title': title, 'site_url': site_url}

    def _parse_items(self):
        return [
            self._parse_item(item_element)
            for item_element in self.feed_element.findall(
                self._item_paths[self.feed_type]['item']
            )
        ]

    def _parse_item(self, item_element):
        item = {}
        for element_name in ['title', 'url', 'description', 'content']:
            element = item_element.find(self._item_paths[self.feed_type][element_name])
            if element is not None and element.text is not None:
                item[element_name] = plaintext(element.text)
            else:
                item[element_name] = None

        pubdate_element = item_element.find(self._item_paths[self.feed_type]['pubdate'])
        if pubdate_element is not None:
            item['pubdate'] = dateparser.parse(pubdate_element.text)
        else:
            item['pubdate'] = None

        enclosure_element = item_element.find(self._item_paths[self.feed_type]['enclosure'])
        if enclosure_element is not None:
            item['enclosure'] = enclosure_element.attrib
        else:
            item['enclosure'] = None

        return item


def get_or_create_feed(feed_url):
    feed_response = requests.get(feed_url)
    if not feed_response.ok:
        raise ValueError(
            f'Bad response {feed_response.status_code} for URL: {feed_url}'
        )

    feed_parser = FeedParser(feed_url, feed_response.content)

    try:
        return Feed.query.filter_by(feed_url=feed_parser.feed_url).one()
    except NoResultFound:
        feed = Feed(**feed_parser.metadata)
        db.session.add(feed)
        db.session.commit()
        return feed


def get_or_create_feed_item(feed, item_data):
    try:
        feed_item = (
            FeedItem
            .query
            .filter_by(feed_id=feed.id, url=item_data['url'])
            .one()
        )
        return feed_item, False
    except NoResultFound:
        feed_item = FeedItem(feed_id=feed.id, **item_data)
        return feed_item, True


async def get_feed_content(semaphore, session, feed):
    async with semaphore:
        async with session.get(feed.feed_url) as response:
            return feed, await response.read()


async def process_feeds():
    semaphore = asyncio.Semaphore(constants.MAX_ASYNC_REQUESTS)
    async with aiohttp.ClientSession() as session:
        tasks = [
            asyncio.ensure_future(get_feed_content(semaphore, session, feed))
            for feed in Feed.query.all()
        ]

        results = await asyncio.gather(*tasks)
        now = datetime.datetime.utcnow()
        for feed, result in results:
            feed.last_processed = now
            db.session.add(feed)
            for item_data in FeedParser(feed.feed_url, result).items:
                feed_item, created = get_or_create_feed_item(feed, item_data)
                if created:
                    db.session.add(feed_item)

        db.session.commit()
