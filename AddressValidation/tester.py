import json
import AddressValidation.Context as ctx
from AddressValidation.Validator import Validator

def t1():


    context = ctx.get_context()
    context["address_validator"] =     v_class = context['address_validator']
    v = v_class(context)

    town_info = {
        "city": "Ashland",
        "state": "New Hampshire"
    }

    lu_result = v.get_zip_code(town_info)

    print("Result = ", json.dumps(lu_result, indent=2))

def t2():

    context = ctx.get_context()
    context["address_validator"] =     v_class = context['address_validator']
    v = v_class(context)

    address_info = {
        "city": "Washington",
        "state": "dc",
        "street": "1600 Pensylvania Ave"
    }

    lu_result = v.validate_address(address_info)

    print("Result = ", json.dumps(lu_result, indent=2))

t1()
t2()






