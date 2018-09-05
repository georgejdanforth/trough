import enum


class FeedType(enum.IntEnum):
    rss = 1
    atom = 2
    scrapeable = 3
