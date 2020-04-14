import jwt

_secret = "secret"


def encode_password(pw):

    d = { "password": pw }
    result = jwt.encode(d, _secret)
    return result


def check_password(pw, hashed_pw):

    d = {"password": pw}
    d_pw = jwt.decode(hashed_pw, _secret)

    if d_pw['password'] == pw:
        return True
    else:
        return False