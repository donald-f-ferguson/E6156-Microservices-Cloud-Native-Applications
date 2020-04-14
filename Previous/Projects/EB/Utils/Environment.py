import os
import logging

_logger = None

def get_config_prop(p_name):
    result = os.environ.get(p_name)
    return result

def get_logger():
    global _logger

    if _logger is None:
        log_level = get_config_prop("LOGGING_LEVEL")
        log_level = getattr(logging, log_level)
        logging.basicConfig(level=log_level)
        _logger = logging.getLogger()
        _logger.setLevel(level=log_level)

    return _logger

