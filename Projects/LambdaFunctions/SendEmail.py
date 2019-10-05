import json
import jwt

jwt.e
import boto3
from botocore.exceptions import ClientError

# Replace sender@example.com with your "From" address.
# This address must be verified with Amazon SES.
# SENDER = "Donald F. Ferguson <dff@cs.columbia.edu>"
SENDER = "Info <info@dff-cu.org>"

# Replace recipient@example.com with a "To" address. If your account
# is still in the sandbox, this address must be verified.
RECIPIENT = "dff@cs.columbia.edu"

# Specify a configuration set. If you do not want to use a configuration
# set, comment the following variable, and the
# ConfigurationSetName=CONFIGURATION_SET argument below.
CONFIGURATION_SET = "ConfigSet"

# If necessary, replace us-west-2 with the AWS Region you're using for Amazon SES.
AWS_REGION = "us-east-1"

# The subject line for the email.
SUBJECT = "Cool message from Don!!!"

# The email body for recipients with non-HTML email clients.
BODY_TEXT = ("Amazon SES Test (Python)\r\n"
             "This email was sent with Amazon SES using the "
             "AWS SDK for Python (Boto)."
             )

# The HTML body of the email.
BODY_HTML = """<html>
<head></head>
<body>
  <h1>Amazon SES Test (SDK for Python)</h1>
  <p>This email was sent with
    <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
    <a href='https://aws.amazon.com/sdk-for-python/'>
      AWS SDK for Python (Boto)</a>.</p>
      <form action="http://google.com">
        <input type="submit" value="Go to Google" />
    </form>
    <p>A really cool verification link would look like:{}
</body>
</html>
            """

# The character encoding for the email.
CHARSET = "UTF-8"

# Create a new SES resource and specify a region.
client = boto3.client('ses', region_name=AWS_REGION)


# Try to send the email.
def send_email(em):
    try:
        print("em = ", em)
        # Provide the contents of the email.
        response = client.send_email(
            Destination={
                'ToAddresses': [
                    em
                ],
            },
            Message={
                'Body': {
                    'Html': {
                        'Charset': CHARSET,
                        'Data': BODY_HTML,
                    },
                    'Text': {
                        'Charset': CHARSET,
                        'Data': BODY_TEXT,
                    },
                },
                'Subject': {
                    'Charset': CHARSET,
                    'Data': SUBJECT,
                },
            },
            Source=SENDER
            # If you are not using a configuration set, comment or delete the
            # following line
            # ConfigurationSetName=CONFIGURATION_SET,
        )
    # Display an error if something goes wrong.
    except ClientError as e:
        print(e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:"),
        print(response['MessageId'])


def handle_sns_event(records):
    sns_event = records[0]['Sns']
    topic_arn = sns_event.get("TopicArn", None)
    topic_subject = sns_event.get("Subject", None)
    topic_msg = sns_event.get("Message", None)

    print("SNS Subject = ", topic_subject)
    if topic_msg:
        json_msg = None
        try:
            json_msg = json.loads(topic_msg)
            print("Message = ", json.dumps(json_msg, indent=2))
        except:
            print("Could not parse message.")

        em = json_msg["customers_email"]
        send_email(em)


def lambda_handler(event, context):
    print("Event = ", json.dumps(event, indent=2))

    records = event.get("Records", None)
    print("Records = ", json.dumps(records, indent=2))

    if records:
        handle_sns_event(records)
    else:
        p = event.get("path", None)
        if p is not None:
            print("Got a gateway event!")
        else:
            print("Doing a simple test.")
            em = event.get("customers_email", None)
            if em is not None:
                send_email(em)
            else:
                print("Nothing to do.")


    # TODO implement
    return {
        "statusCode": 200,
        "body": json.dumps('Hello from Lambda!')
    }

