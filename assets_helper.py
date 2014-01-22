import db
import queries
import datetime
import logging

logging.basicConfig(level=logging.DEBUG,
                    filename='/tmp/screenly_assets_helper.log',
                    format='%(asctime)s %(message)s',
                    datefmt='%a, %d %b %Y %H:%M:%S')

FIELDS = ["asset_id", "name", "uri", "start_date",
          "end_date", "duration", "mimetype", "is_enabled", "nocache", "play_order", "channel"]

create_assets_table = 'CREATE TABLE IF NOT EXISTS screenly_assets(asset_id varchar(255) primary key, name varchar(255), uri varchar(500), md5 varchar(255), start_date timestamp, end_date timestamp, duration varchar(255), mimetype varchar(255), is_enabled integer default 0, nocache integer default 0, play_order integer default 0, channel varchar(255))'

get_time = datetime.datetime.utcnow


def is_active(asset, at_time=None):
    """Accepts an asset dictionary and determines if it
    is active at the given time. If no time is specified, 'now' is used.

    >>> asset = {'asset_id': u'4c8dbce552edb5812d3a866cfe5f159d', 'mimetype': u'web', 'name': u'WireLoad', 'end_date': datetime.datetime(2013, 1, 19, 23, 59), 'uri': u'http://www.wireload.net', 'duration': u'5', 'is_enabled': True, 'nocache': 0, 'play_order': 1, 'start_date': datetime.datetime(2013, 1, 16, 0, 0)};
    >>> is_active(asset, datetime.datetime(2013, 1, 16, 12, 00))
    True
    >>> is_active(asset, datetime.datetime(2014, 1, 1))
    False

    >>> asset['is_enabled'] = False
    >>> is_active(asset, datetime.datetime(2013, 1, 16, 12, 00))
    False

    """

    if asset['is_enabled'] and asset['start_date'] and asset['end_date']:
        at = at_time or get_time()
        return asset['start_date'] < at and asset['end_date'] > at
    return False


def get_playlist(conn):
    """Returns all currently active assets."""
    return filter(is_active, read(conn))


def mkdict(keys):
    """Returns a function that creates a dict from a database record."""
    return lambda row: dict([(keys[ki], v) for ki, v in enumerate(row)])


def create(conn, asset):
    """
    Create a database record for an asset.
    Returns the asset.
    Asset's is_active field is updated before returning.
    """
    if 'is_active' in asset:
        asset.pop('is_active')
    with db.commit(conn) as c:
        query = queries.create(asset.keys()), asset.values()
        logging.debug('[mysql query] %s', query)
        c.execute(query)
    asset.update({'is_active': is_active(asset)})
    return asset


def read(conn, asset_id=None, keys=FIELDS):
    """
    Fetch one or more assets from the database.
    Returns a list of dicts or one dict.
    Assets' is_active field is updated before returning.
    """
    assets = []
    mk = mkdict(keys)
    with db.cursor(conn) as c:
        if asset_id is None:
            c.execute(queries.read_all(keys))
        else:
            c.execute(queries.read(keys), [asset_id])
        assets = [mk(asset) for asset in c.fetchall()]
    [asset.update({'is_active': is_active(asset)}) for asset in assets]
    if asset_id and len(assets):
        return assets[0]
    return assets


def update(conn, asset_id, asset):
    """
    Update an asset in the database.
    Returns the asset.
    Asset's asset_id and is_active field is updated before returning.
    """
    del asset['asset_id']
    if 'is_active' in asset:
        asset.pop('is_active')
    with db.commit(conn) as c:
        c.execute(queries.update(asset.keys()), asset.values() + [asset_id])
    asset.update({'asset_id': asset_id})
    if 'start_date' in asset:
        asset.update({'is_active': is_active(asset)})
    return asset


def delete(conn, asset_id):
    """Remove an asset from the database."""
    with db.commit(conn) as c:
        c.execute(queries.remove, [asset_id])
