
# Import functions and objects the microservice needs.
# - Flask is the top-level application. You implement the application by adding methods to it.
# - Response enables creating well-formed HTTP/REST responses.
# - requests enables accessing the elements of an incoming HTTP/REST request.
#
import json
# Setup and use the simple, common Python logging framework. Send log messages to the console.
# The application should get the log level out of the context. We will change later.
#
import logging
from datetime import datetime

from flask import Flask, Response, request

from Projects.EB.Context.Context import Context
from Projects.EB.Services.CustomerInfo.Users import UsersService as UserService
from Projects.EB.Services.RegisterLogin.RegisterLogin import RegisterLoginSvc as RegisterLoginSvc
import Projects.EB.Middleware.security as security
from Projects.EB.Middleware.middleware import SimpleMiddleWare as SimpleM
from Projects.EB.Middleware.middleware import MWResponse as MWResponse
from functools import wraps
from flask import g, request, redirect, url_for

import Projects.EB.Middleware.notification as notification_middleware
import Projects.EB.Middleware.security as security_middleware



def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        print("\nDecorator was called!!!!. Request = ", request)
        return f(*args, **kwargs)
    return decorated_function

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

###################################################################################################################
#
# AWS put most of this in the default application template.
#
# AWS puts this function in the default started application
# print a nice greeting.
def say_hello(username = "World"):
    return '<p>Hello %s!</p>\n' % username

# AWS put this here.
# some bits of text for the page.
header_text = '''
    <html>\n<head> <title>EB Flask Test</title> </head>\n<body>'''
instructions = '''
    <p><em>Hint</em>: This is a RESTful web service! Append a username
    to the URL (for example: <code>/Thelonious</code>) to say hello to
    someone specific.</p>\n'''
home_link = '<p><a href="/">Back</a></p>\n'
footer_text = '</body>\n</html>'


from Projects.EB.Middleware.middleware import SimpleMiddleWare as SimpleM

# EB looks for an 'application' callable by default.
# This is the top-level application that receives and routes requests.
application = Flask(__name__)

# Middleware
application.wsgi_app = SimpleM(application.wsgi_app)


@application.before_request
def before_decorator():
    print(".... In before decorator ...")


@application.after_request
def after_decorator(rsp):
    print("... In after decorator ...")
    return rsp


# add a rule for the index page. (Put here by AWS in the sample)
application.add_url_rule('/', 'index', (lambda: header_text +
    say_hello() + instructions + footer_text))


# add a rule when the page is accessed with a name appended to the site
# URL. Put here by AWS in the sample
application.add_url_rule('/<username>', 'hello', (lambda username:
    header_text + say_hello(username) + home_link + footer_text))

##################################################################################################################
# The stuff I added begins here.

_default_context = None
_user_service = None
_registration_service = None


def _get_default_context():

    global _default_context

    if _default_context is None:
        _default_context = Context.get_default_context()

    return _default_context


def _get_user_service():
    global _user_service

    if _user_service is None:
        _user_service = UserService(_get_default_context())

    return _user_service


def _get_registration_service():
    global _registration_service

    if _registration_service is None:
        _registration_service = RegisterLoginSvc()

    return _registration_service


def init():

    global _default_context, _user_service

    _default_context = Context.get_default_context()
    _user_service = UserService(_default_context)
    _registration_service = RegisterLoginSvc()

    logger.debug("_user_service = " + str(_user_service))


# 1. Extract the input information from the requests object.
# 2. Log the information
# 3. Return extracted information.
#
def log_and_extract_input(method, path_params=None):

    path = request.path
    args = dict(request.args)
    data = None
    headers = dict(request.headers)
    method = request.method

    try:
        if request.data is not None:
            data = request.json
        else:
            data = None
    except Exception as e:
        # This would fail the request in a more real solution.
        data = "You sent something but I could not get JSON out of it."

    log_message = str(datetime.now()) + ": Method " + method

    inputs =  {
        "path": path,
        "method": method,
        "path_params": path_params,
        "query_params": args,
        "headers": headers,
        "body": data
        }

    log_message += " received: \n" + json.dumps(inputs, indent=2)
    logger.debug(log_message)

    return inputs


def log_response(method, status, data, txt):

    msg = {
        "method": method,
        "status": status,
        "txt": txt,
        "data": data
    }

    logger.debug(str(datetime.now()) + ": \n" + json.dumps(msg, indent=2, default=str))


# This function performs a basic health check. We will flesh this out.
@application.route("/health", methods=["GET"])
@login_required
def health_check():

    rsp_data = { "status": "healthy", "time": str(datetime.now()) }
    rsp_str = json.dumps(rsp_data)
    rsp = MWResponse(rsp_str, status=200, content_type="application/json")
    return rsp


@application.route("/demo/<parameter>", methods=["GET", "POST"])
def demo(parameter):

    inputs = log_and_extract_input(demo, { "parameter": parameter })

    msg = {
        "/demo received the following inputs" : inputs
    }

    rsp = Response(json.dumps(msg), status=200, content_type="application/json")
    return rsp


@application.route("/api/user/<email>", methods=["GET", "PUT", "DELETE"])
def user_email(email):

    global _user_service

    inputs = log_and_extract_input(demo, {"parameters": email})

    rsp_data = None
    rsp_status = None
    rsp_txt = None

    try:

        user_service = _get_user_service()

        logger.error("/email: _user_service = " + str(user_service))

        if inputs["method"] == "GET":

            rsp = user_service.get_by_email(email)

            if rsp is not None:
                rsp_data = rsp
                rsp_status = 200
                rsp_txt = "OK"
            else:
                rsp_data = None
                rsp_status = 404
                rsp_txt = "NOT FOUND"
        else:
            rsp_data = None
            rsp_status = 501
            rsp_txt = "NOT IMPLEMENTED"

        if rsp_data is not None:
            full_rsp = Response(json.dumps(rsp_data, default=str),
                                status=rsp_status, content_type="application/json")
        else:
            full_rsp = Response(rsp_txt, status=rsp_status, content_type="text/plain")

    except Exception as e:
        log_msg = "/email: Exception = " + str(e)
        logger.error(log_msg)
        rsp_status = 500
        rsp_txt = "INTERNAL SERVER ERROR. Please take COMSE6156 -- Cloud Native Applications."
        full_rsp = Response(rsp_txt, status=rsp_status, content_type="text/plain")

    log_response("/email", rsp_status, rsp_data, rsp_txt)

    return full_rsp


@application.route("/api/registration", methods=["POST"])
def registration():

    inputs = log_and_extract_input(demo, {"parameters": None})
    rsp_data = None
    rsp_status = None
    rsp_txt = None

    try:

        r_svc = _get_registration_service()

        logger.error("/api/registration: _r_svc = " + str(r_svc))

        if inputs["method"] == "POST":

            rsp = r_svc.register(inputs['body'])

            if rsp is not None:
                rsp_data = rsp
                rsp_status = 201
                rsp_txt = "CREATED"
                link = rsp_data[0]
                auth = rsp_data[1]
            else:
                rsp_data = None
                rsp_status = 404
                rsp_txt = "NOT FOUND"
        else:
            rsp_data = None
            rsp_status = 501
            rsp_txt = "NOT IMPLEMENTED"

        if rsp_data is not None:
            # TODO Generalize generating links
            headers = {"Location": "/api/users/" + link}
            headers["Authorization"] =  auth
            full_rsp = Response(rsp_txt, headers=headers,
                                status=rsp_status, content_type="text/plain")
        else:
            full_rsp = Response(rsp_txt, status=rsp_status, content_type="text/plain")

    except Exception as e:
        log_msg = "/api/registration: Exception = " + str(e)
        logger.error(log_msg)
        rsp_status = 500
        rsp_txt = "INTERNAL SERVER ERROR. Please take COMSE6156 -- Cloud Native Applications."
        full_rsp = Response(rsp_txt, status=rsp_status, content_type="text/plain")

    log_response("/api/registration", rsp_status, rsp_data, rsp_txt)

    return full_rsp


@application.route("/api/login", methods=["POST"])
def login():

    inputs = log_and_extract_input(demo, {"parameters": None})
    rsp_data = None
    rsp_status = None
    rsp_txt = None

    try:

        r_svc = _get_registration_service()

        logger.error("/api/login: _r_svc = " + str(r_svc))

        if inputs["method"] == "POST":

            rsp = r_svc.login(inputs['body'])

            if rsp is not None:
                rsp_data = "OK"
                rsp_status = 201
                rsp_txt = "CREATED"
            else:
                rsp_data = None
                rsp_status = 403
                rsp_txt = "NOT AUTHORIZED"
        else:
            rsp_data = None
            rsp_status = 501
            rsp_txt = "NOT IMPLEMENTED"

        if rsp_data is not None:
            # TODO Generalize generating links
            headers = {"Authorization": rsp}
            full_rsp = Response(json.dumps(rsp_data, default=str), headers=headers,
                                status=rsp_status, content_type="application/json")
        else:
            full_rsp = Response(rsp_txt, status=rsp_status, content_type="text/plain")

    except Exception as e:
        log_msg = "/api/registration: Exception = " + str(e)
        logger.error(log_msg)
        rsp_status = 500
        rsp_txt = "INTERNAL SERVER ERROR. Please take COMSE6156 -- Cloud Native Applications."
        full_rsp = Response(rsp_txt, status=rsp_status, content_type="text/plain")

    log_response("/api/registration", rsp_status, rsp_data, rsp_txt)

    return full_rsp


@application.route("/api/test_middleware/<parameter>", methods=["GET", "PUT", "DELETE", "POST"])
def test_middleware(parameter):

    security_middleware.authorize(request.url, request.method,
                                  request.headers.get("Authorization", None))
    logger.debug("/api/user/<email>" + json.dumps(request, default=str))

    # Other middleware goes here ...


    # Now do the application functions.


    # And now do the functions for post processing the request.
    logger.debug("/api/user/<email>" + json.dumps(request, default=str))
    if request.method in ('POST', 'PUT', 'DELETE'):
        notification_middleware.publish_change_event(request.url, request.json)

    # More stuff goes here.

    return "something"


def do_something_before():
    print("\n")
    print("***************** Do something before got ... **************", request)
    print("\n")


def do_something_after(rsp):
    print("\n")
    print("***************** Do something AFTER got ... **************", request)
    print("\n")
    return rsp



logger.debug("__name__ = " + str(__name__))


# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output. This line should be
    # removed before deploying a production app.


    logger.debug("Starting Project EB at time: " + str(datetime.now()))
    init()

    application.debug = True
    application.before_request(do_something_before)
    application.after_request(do_something_after)
    application.run(port=5033)