import json
import boto3
from botocore.exceptions import ClientError

import jwt.jwt.api_jwt as apij

import logging

# Note: The logging levels should come from a config/property file and not be hard coded.
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()
logger.setLevel(level=logging.DEBUG)

_secret = "secret"


def respond(err, res=None):
    """

    TODO: We need to flesh this out to handle other error conditions, and to
        return the necessary CORS headers for options.

    :param err: The error that occurred.
    :param res: The response body in JSON.
    :return: A properly formatted API Gateway response.
    """
    return {
        'statusCode': '400' if err else '200',
        'body': err.message if err else json.dumps(res),
        'headers': {
            'Content-Type': 'application/json',
        },
    }


def lambda_handler(event, context):

    logger.info("\nEvent = " + json.dumps(event, indent=2) + "\n")

    test_stuff = {"msg": "Message"}
    logger.info("Encoding " + json.dumps(test_stuff))
    tok = apij.encode(test_stuff, key=_secret)
    logger.info("Encoded = " + str(tok))
    dec = apij.decode(tok, key=_secret)
    logger.info("Decoded =  " + json.dumps(dec))

    # Some introspection of event allows figuring out where it came from.
    records = event.get("Records", None)
    method = event.get("httpMethod", None)

    if records is not None:
        logger.info("I got an SNS event.")
        logger.info("Records = " + json.dumps(records))
    elif method is not None:
        logger.info("I got an API GW proxy event.")
        logger.info("\nhttpMethod = " + method + "\n")
    else:
        logger.info("Not sure what I got.")

    response = respond(None, {"cool": "example"})
    return response

