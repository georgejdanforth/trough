import re
import requests

from io import StringIO
from sqlalchemy.orm.exc import NoResultFound
from xml.etree import ElementTree

from api.extensions import db
from api.feeds.models import Feed
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

    def __init__(self, feed_url, parse_metadata=False, parse_items=False):
        feed_response = requests.get(feed_url)
        if not feed_response.ok:
            raise ValueError(
                f'Bad response {feed_response.status_code} for URL: {feed_url}'
            )

        self.feed_url = feed_url
        self.clean_feed_url = self._clean_url(feed_url)
        self.feed_element = self._clean_namespaces(feed_response.content.decode('utf-8'))
        self.feed_type = self._classify_feed_type()

        self._metadata = self._parse_metadata() if parse_metadata else None
        self._items = self._parse_items() if parse_items else None

    @staticmethod
    def _clean_url(url):
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

        return self._metadata


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


def get_or_create_feed(url):
    feed_url = clean_url(url)
    try:
        return Feed.query.filter_by(feed_url=feed_url).one()
    except NoResultFound:
        feed = feed(**parse_feed(feed_url))
        db.session.add(feed)
        db.session.commit()
        return feed
