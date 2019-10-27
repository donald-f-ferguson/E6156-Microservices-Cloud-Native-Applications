import json
import logging
from datetime import datetime
from flask import Flask, Response, request


# EB looks for an 'application' callable by default.
# This is the top-level application that receives and routes requests.
application = Flask(__name__)


# This function performs a basic health check. We will flesh this out.
@application.route("/health", methods=["GET"])
def health_check():

    rsp_data = { "status": "healthy", "time": str(datetime.now()) }
    rsp_str = json.dumps(rsp_data)
    print("\nHealth is returning ...", rsp_str, "\n")
    rsp = Response(rsp_str, status=200, content_type="application/json")
    return rsp


# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.

    application.debug = False
    application.run(port=5030)