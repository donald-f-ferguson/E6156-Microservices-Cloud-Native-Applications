import threading
from threading import current_thread
import DataAccess.DataAdaptor as data_adaptor

threadlocal = threading.local()

# TODO: We should read this information from the environment.
default_connect_info =  {
    "host" :'localhost',
    "user": 'dbuser',
    "password": 'dbuserdbuser',
    "db": "lahman2019raw",
    "charset": 'utf8mb4'
}


def t1():

    current_thread().default_connect_info  = default_connect_info
    data_adaptor.get_connection()

t1()
