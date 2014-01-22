#import sqlite3
#import MySQLdb as mdb
import mysql.connector as mdb
from contextlib import contextmanager

import queries

#conn = lambda db: sqlite3.connect(db, detect_types=sqlite3.PARSE_DECLTYPES)
conn = lambda dbhost,dbuser,dbpass,dbdatabase: mdb.connect(host=dbhost, user=dbuser, password=dbpass, database=dbdatabase)

@contextmanager
def cursor(connection):
    cur = connection.cursor()
    yield cur
    cur.close()


@contextmanager
def commit(connection):
    cur = connection.cursor()
    yield cur
    connection.commit()
    cur.close()
