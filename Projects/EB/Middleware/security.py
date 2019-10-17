import jwt
from Projects.EB.Context.Context import Context
from time import time

_context = Context.get_default_context()


def hash_password(pwd):
    global _context
    h = jwt.encode(pwd, key=_context.get_context("JWT_SECRET"))
    h = str(h)
    return h


def generate_token(info):

    info["timestamp"] =  time()
    email = info['email']

    if email == 'dff9@columbia.edu':
        info['role']='admin'
    else:
        info['role']='student'

    info['created'] = str(info['created'])

    h = jwt.encode(info, key=_context.get_context("JWT_SECRET"))
    h = str(h)

    return h


def authorize(url, method, token):
    pass



