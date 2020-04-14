import Utils.Environment as env

import logging


def t1():
    result = env.get_config_prop("LOGGING_LEVEL")
    print("t1: result = ", result)
    l = getattr(logging, result)
    print("Logging level = ", l)
    print("Logging to DEBUG = ", logging.DEBUG)

def t2():

    logger = env.get_logger()
    print("Logger = ", str(logger))
    logger.debug("Writing debug message")

#t1()
t2()