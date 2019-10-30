import json
import jwt.jwt.api_jwt as apij
import logging
import sys
import os


# There has to be a better way than this.
sys.path.append("./")
sys.path.append("./requests")
import requests


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
    secret = "secret"

    body = event["body"]

    if body is not None and body != {}:
        enc = apij.encode(body, secret)
        enc = str(enc)
    else:
        enc = None

    ip_address = event["headers"]["X-Forwarded-For"]
    ip_address = ip_address.split(",")
    ip_address = ip_address[0]

    ip_address_key = os.environ['ip_address_key']

    ip_lookup_url = "http://api.ipstack.com/" \
        + ip_address + "?access_key=" + ip_address_key + "&format=1"
    rsp = requests.get(ip_lookup_url)
    if rsp.status_code == 200:
        req_data = rsp.json()
    else:
        req_data = {"status_code": rsp.status_code}

    rsp_body = {
        "encoded_message": enc,
        "ip_address_lookup_info": req_data
    }

    response = respond(None, rsp_body)
    return response

