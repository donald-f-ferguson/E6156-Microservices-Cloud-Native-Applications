from abc import ABC, abstractmethod
from Context.Context import Context
from DataAccess.DataObject import UsersRDB as UsersRDB

# The base classes would not be IN the project. They would be in a separate included package.
# They would also do some things.

class BaseService():

    def __init__(self):
        pass


class UsersService(BaseService):

    def __init__(self, ctx=None):

        if ctx is None:
            ctx = Context.get_default_context()

        self._ctx = ctx


    @classmethod
    def get_by_email(cls, email):

        result = UsersRDB.get_by_email(email)
        return result



