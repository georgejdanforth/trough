import asyncio
import click

from flask.cli import with_appcontext

from api.feeds.utils import process_feeds


@click.command('update_feeds')
@with_appcontext
def update_feeds():
    asyncio.run(process_feeds())


commands = [
    update_feeds,
]
