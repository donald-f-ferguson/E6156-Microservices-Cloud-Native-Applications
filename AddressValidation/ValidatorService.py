from AddressValidation.Validator import Validator
import os

# This is an example of using a provided SDK. This wraps URLs, verbs, JSON formats, etc.
# to make the API look like a local Python package and set of classes.
from smartystreets_python_sdk import StaticCredentials, exceptions, ClientBuilder
from smartystreets_python_sdk.us_zipcode import Lookup

# I will use requests to show "raw" usage of an HTTP API.
import requests


class ValidatorService(Validator):

    def __init__(self, context):
        self._context = context
        self._auth_id = context['smarty_streets_id']
        self._auth_token = context['smarty_streets_token']

        # This set up the credentials for the SDK
        self._credentials = StaticCredentials(self._auth_id, self._auth_token)

        # We will use the SDK for looking up zipcodes.
        self._zip_client = ClientBuilder(self._credentials).build_us_zipcode_api_client()

        # I am going to use the "raw" rest API for address lookup to provide a comparison of
        # the two API approaches. Also, I should be getting the URL for the context.
        self._address_lookup_url = "https://us-street.api.smartystreets.com/street-address"

    def validate_address(self, address):

        url = self._address_lookup_url
        params = {}
        params['auth-id'] = self._auth_id
        params['auth-token'] = self._auth_token
        params['street'] = address['street']

        state = address.get('state', None)
        if state is not None:
            params['state'] = state

        city = address.get('city', None)
        if city is not None:
            params['city'] = city

        zipcode = address.get('zipcode', None)
        if zipcode is not None:
            params['zipcode'] = zipcode

        result = requests.get(url, params=params)

        # We need to handle the various status codes. We will learn this when we study REST.
        if result.status_code == 200:
            # If we got more than one address, then there was something wrong and the address into is imprecise
            j_data = result.json()

            if len(j_data) > 1:
                rsp = None
            else:
                rsp = j_data[0]['components']
                rsp['deliver_point_barcode']=j_data[0]['delivery_point_barcode']
        else:
            rsp = None

        return rsp


    def _zip_lookup_to_json(self, lookup):

        result = {}
        cities = []
        zipcodes = []

        for c in lookup.result.cities:
            new_c = {
                "city": c.city,
                "mailable": c.mailable_city,
                "state": c.state,
                "state_abbreviation": c.state_abbreviation
            }
            cities.append(new_c)

        for z in lookup.result.zipcodes:
            new_z = {
                "country_fips": z.county_fips,
                "name": z.county_name,
                "default_city": z.default_city,
                "latitude": z.latitude,
                "longitude": z.longitude,
                "precision": z.precision,
                "state": z.state,
                "state_abbreviation": z.state_abbreviation,
                "zipcode": z.zipcode,
                "zipcode_type": z.zipcode_type
            }
            zipcodes.append(new_z)

        result = {
            "city": cities,
            "zipcodes": zipcodes
        }
        return result

    def get_zip_code(self, town_info):

        lookup = Lookup()
        lookup.input_id = "dfc33cb6-829e-4fea-aa1b-b6d6580f0817"
        lookup.city = town_info["city"]
        lookup.state = town_info["state"]

        try:
            self._zip_client.send_lookup(lookup)
        except exceptions.SmartyException as err:
            print(err)
            return

        result_json = self._zip_lookup_to_json(lookup)
        result = result_json
        return result
