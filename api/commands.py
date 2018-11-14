import asyncio
import click

from flask.cli import with_appcontext

from api.feeds.constants import CLEANUP_DAYS_BACK
from api.feeds.utils import (
    cleanup_old_feed_items,
    process_feeds,
)


@click.command('update_feeds')
@with_appcontext
def update_feeds():
    asyncio.run(process_feeds())


@click.command('cleanup_feed_items')
@click.argument('days_back', default=CLEANUP_DAYS_BACK, type=click.INT)
@with_appcontext
def cleanup_feed_items(days_back):
    cleanup_old_feed_items(days_back)


commands = [
    update_feeds,
    cleanup_feed_items,
]
