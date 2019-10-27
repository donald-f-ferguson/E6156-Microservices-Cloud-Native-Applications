from Projects.EB.DataAccess.UsersDataObject import UsersRDB as UsersRDB
import json
from uuid import uuid4

def t0():
    info = UsersRDB.get_schema_info()
    print("Info = ", info)

    kcs = UsersRDB.get_primary_key_columns()
    print("KCS = ", json.dumps(kcs, indent=2))

def t1():
    d = {
        "email": "dff91@columbia.edu",
        "first_name": "Donald",
        "last_name": "Ferguson",
        "password": "boo",
        "id": "123"
    }
    r = UsersRDB.create_user(d)

    print("Result = \n", json.dumps(r, indent=2))



def t2():
     usr = {
         "last_name": "Baggins",
         "first_name": "Frodo",
         "id": str(uuid4()),
         "email": "fb@shire.gov",
         "status": "PENDING",
         "password": "goodidea"
     }
     res = UsersRDB.create_user(user_info=usr)
     print("Res = ", res)


def t3():
    usr = {
        "last_name": "Baggins",
        "first_name": "Frodo",
        "id": str(uuid4()),
        "email": "fb@shire.gov",
        "status": "PENDING",
        "password": "goodidea"
    }
    res = UsersRDB.insert(usr)
    print("Res = ", res)


def t4():
    tmp = {
        "last_name": "Baggins",
    }
    fields = ['last_name', 'first_name', 'id']
    res = UsersRDB.retrieve(template=tmp, fields=fields)
    print("Res = ", json.dumps(res, indent=2, default=str))


def t5():
    key_fields = [9]
    fields = ['last_name', 'first_name', 'id']
    res = UsersRDB.retrieve_by_key(key_fields=key_fields, fields=fields)
    print("Res = ", json.dumps(res, indent=2, default=str))

#t0()
#t1()
#t2()
#t3()
#t4()
t5()
