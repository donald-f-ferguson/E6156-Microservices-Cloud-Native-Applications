from flask import Response
from werkzeug.wrappers import Response as wResponse
import json
from flask import request
from functools import wraps
from flask import g, request, redirect, url_for


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


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if g.user is None:
            #return redirect(url_for('login', next=request.url))
            print("None.")
        return f(*args, **kwargs)
    return decorated_function



