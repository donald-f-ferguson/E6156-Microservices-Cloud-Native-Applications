from Projects.EB.Context.Context import Context
import json

def t1():

    ctx = Context.get_default_context()

    db_info = ctx.get_context('db_connect_info')
    print("DB Connect Info = \n", json.dumps(db_info, indent=2))

t1()