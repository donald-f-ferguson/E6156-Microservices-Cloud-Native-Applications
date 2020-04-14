import json
import boto3
from botocore.exceptions import ClientError


import lambda_utils as lutils

import logging
logger = logging.getLogger()


def lambda_handler(event, context):
    # Event is the event passed to  lambda function, essentially the input.
    # I hardly ever use the context, but you can see what is in it at this URL
    # https://docs.aws.amazon.com/lambda/latest/dg/python-context-object.html

    # The code in configure_logging shows how to access environment variables.
    # When testing locally, you can set by editing the run configuration in PyCharm.
    # You can set using the Lambda function configuration panel on AWS.
    lutils.configure_logging()

    logger.info("\nEvent = " + json.dumps(event, indent=2) + "\n")


    # Some introspection of event allows figuring out where it came from.
    records = event.get("Records", None)
    if records is not None:
        logger.info("I got an SNS event.")
        logger.info("Records = " + json.dumps(records))

    method = event.get("httpMethod", None)
    if method is not None:
        logger.info("I got an API GW proxy event.")
        logger.info("\nhttpMethod = " + method + "\n")

    response = lutils.respond(None, {"cool": "example"})
    return response

