import copy

import os
import json

class Context():

    def __init__(self, inital_ctx=None):

        self._context = inital_ctx


    def get_context(self, ctx_name):

        result = self._context.get(ctx_name, None)
        return result

    def set_context(self, ctx_name, ctx):

        self._context[ctx_name] = copy.deepcopy(ctx)

    @classmethod
    def get_default_context(cls):

        db_connect_info = os.environ['db_connect_info']
        db_connect_info = json.loads(db_connect_info)

        ctx = { "db_connect_info": db_connect_info }

        result = Context(ctx)
        return result
