import asyncio
import click

from flask.cli import with_appcontext

from api.feeds.constants import CLEANUP_DAYS_BACK
from api.feeds.utils import (
    cleanup_old_feed_items,
    process_feeds,
)
from api.userdata.utils import cleanup_expired_tokens


@click.command('update_feeds')
@with_appcontext
def update_feeds():
    asyncio.run(process_feeds())


@click.command('cleanup_feed_items')
@click.argument('days_back', default=CLEANUP_DAYS_BACK, type=click.INT)
@with_appcontext
def cleanup_feed_items(days_back):
    cleanup_old_feed_items(days_back)


@click.command('cleanup_expired_jwts')
@with_appcontext
def cleanup_expired_jwts():
    cleanup_expired_tokens()


commands = [
    update_feeds,
    cleanup_feed_items,
    cleanup_expired_jwts,
]
