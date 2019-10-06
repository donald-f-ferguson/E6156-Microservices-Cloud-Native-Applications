import boto3
import json
import base64
from botocore.exceptions import ClientError
import os

import logging

logger = logging.getLogger()

_default_logging_level = logging.INFO

def configure_logging():
    """
    Configure the logging level. This function is for Lambda functions and logs to the console,
    which automatically goes to CloudWatch.
    :return:
    """
    global logger

    level = os.environ.get("LOGGING_LEVEL", None)

    if level == "DEBUG":
        level = logging.DEBUG
    elif level == "INFO":
        level = logging.INFO
    elif level == "WARN":
        level = logging.WARN
    else:
        level = logging.ERROR

    # The logging level to use should be an environment variable, not hard coded.
    logging.basicConfig(level=level)
    logger.setLevel(level)

    logger.info("Logging level = " + str(level))


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


def get_secret():
    """
    Secrets are "sensitive." You should never hard code them in source code. Sometimes you can put them
    in environment variables, but this make sharing secrets between applications difficult. So, this is a
    simple example of using the AWS Secrets Manager (
    https://us-east-1.console.aws.amazon.com/secretsmanager/home?region=us-east-1#/home).

    You do not need to do this for your projects. This is FYI only.
    :return:
    """
    logger.info("In get_secret()")

    # These should probably be in an environment variables
    secret_name = "JWT"
    region_name = "us-east-1"

    secret = None

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    # In this sample we only handle the specific exceptions for the 'GetSecretValue' API.
    # See https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    # We rethrow the exception by default.

    # NOTE: I just coped the sample code below and made some minor changes.

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
        logger.info("get secret response = " + str(get_secret_value_response))
    except ClientError as e:
        logger.error("In ClientError, e = " + str(e))
        if e.response['Error']['Code'] == 'DecryptionFailureException':
            # Secrets Manager can't decrypt the protected secret text using the provided KMS key.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InternalServiceErrorException':
            # An error occurred on the server side.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidParameterException':
            # You provided an invalid value for a parameter.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'InvalidRequestException':
            # You provided a parameter value that is not valid for the current state of the resource.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
        elif e.response['Error']['Code'] == 'ResourceNotFoundException':
            # We can't find the resource that you asked for.
            # Deal with the exception here, and/or rethrow at your discretion.
            raise e
    except Exception as e:
        logger.error("Unknow exception e = " + str(e))
    else:
        # Decrypts secret using the associated KMS CMK.
        # Depending on whether the secret is a string or binary, one of these fields will be populated.
        if 'SecretString' in get_secret_value_response:
            secret = get_secret_value_response['SecretString']
        else:
            decoded_binary_secret = base64.b64decode(get_secret_value_response['SecretBinary'])
            secret = decoded_binary_secret

    # Your code goes here.

    logger.info("Returning secret = " + secret)
    return secret