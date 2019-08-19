from AddressValidation.Validator import Validator

import requests


class ValidatorClient(Validator):

    def __init__(self, context):
        self._context = context

    def validate_address(self, address):
        base_url = self._context['address_validator_url']
        url = base_url + "/addresses"

        args = {}

        city = address.get('city, None')
        if city is not None:
            args['city'] = city

        state = address.get('state, None')
        if state is not None:
            args['state'] = state

        street = address.get('street, None')
        if street is not None:
            args['street'] = street

        zipcode = address.get('zipcode, None')
        if zipcode is not None:
            args['zipcode'] = street

        result = requests.get(url=url, params=args)
        result = result.json()

    def get_zip_code(self, town_info):
        base_url = self._context['address_validator_url']
        url = base_url + "/zipcodes"
        args = {"city": town_info["city"], "state": town_info["state"]}
        result = requests.get(url=url, params=args)
        result = result.json()

        return result




