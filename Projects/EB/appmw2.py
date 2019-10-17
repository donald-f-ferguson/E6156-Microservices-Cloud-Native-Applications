import json
import logging
from datetime import datetime
from flask import Flask, Response, request
from functools import wraps
from flask import g, request, redirect, url_for
from flask import Response
from werkzeug.wrappers import Response as wResponse
from functools import wraps
from flask import g, request, redirect, url_for


# EB looks for an 'application' callable by default.
# This is the top-level application that receives and routes requests.
application = Flask(__name__)


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print("\nDecorator was called!!!!. Request = ", request)
        return f(*args, **kwargs)
    return decorated_function


@application.before_request
def before_decorator():
    print(".... In before decorator ...")


@application.after_request
def after_decorator(rsp):
    print("... In after decorator ...")
    return rsp


class SimpleMiddleWare(object):

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        print ("\n\nSimpleMiddlewareObject: something you want done in every http request")
        return self.app(environ, start_response)


class MWResponse(wResponse):

    def __init__(self, response=None, status=None, headers=None,
                 mimetype=None, content_type=None, direct_passthrough=None):
        super().__init__(response, status, headers, mimetype, content_type, direct_passthrough)
        print("\nMWResponse was used in place of just response!")


# Middleware
application.wsgi_app = SimpleMiddleWare(application.wsgi_app)



# This function performs a basic health check. We will flesh this out.
@application.route("/health", methods=["GET"])
@login_required
def health_check():

    rsp_data = { "status": "healthy", "time": str(datetime.now()) }
    rsp_str = json.dumps(rsp_data)
    print("\nHealth is returning ...", rsp_str, "\n")
    rsp = MWResponse(rsp_str, status=200, content_type="application/json")
    return rsp


def do_something_before():
    print("\n")
    print("***************** Do something before got ... **************", request)
    print("\n")


def do_something_after(rsp):
    print("\n")
    print("***************** Do something AFTER got ... **************", request)
    print("\n")
    return rsp


# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.

    application.debug = False
    application.before_request(do_something_before)
    application.after_request(do_something_after)
    application.run(port=5034)