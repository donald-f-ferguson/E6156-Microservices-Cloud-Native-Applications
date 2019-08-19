
from DataAccess.DataObject import UsersRDB as UsersRDB
import json

def t1():

    r = UsersRDB.get_by_email('metus.vitae@nibhAliquamornare.edu')
    print("Result = \n", json.dumps(r, indent=2))

t1()