
# Uses the Flask runtime and framework.
# https://flask.palletsprojects.com/en/1.0.x/
from flask import request, Response
from flask import Flask


# Flask-Plus is a tool for annotating a Flask application and automatically
# generating and Open API Specification document
# https://flask-restplus.readthedocs.io/en/stable/index.html
from flask_restplus import Api, Resource, fields

# The validation service
from AddressValidation.ValidatorService import ValidatorService

# Service for getting context information.
import AddressValidation.Context as Context

import json

# Create the application instances
app = Flask(__name__)

################################################################################################
#
# This section defines some base information for the application.
#
#
api = Api(app,
          version='0.5',
          title='Address Verification Service',
            description= 'A service for verifying that an address is valid, and suggesting alternatives ' + \
                'if it is not. Also returns information zipcodes given information about city and state.'
)

# A NameSpace is a top level collection of paths. The only namespace in this applicaton is Addresses
ns = api.namespace('Addresses', description='APIs for validating and obtaining maling address info.')

# Models are schema definitions for JSON objects passed into and out of operations in bodies.
# There are two approaches to defining a model. 1) api.model, 2) JSON Schema.
# https://json-schema.org/

# Data returned in the body of a verification check.
address = api.model('Address', {
    'delivery_point_parcode': fields.Integer(required=True, description='Barcode number identifying mail point'),
    'street': fields.String(required=True, description='Street name'),
    'city': fields.String(required=True, description='City name'),
    'state': fields.String(required=True, description='State name'),
    'zipcode':  fields.String(required=True, description='State name'),
    'more fields': fields.String(required=True, description='Blah, blah ...')
})

# Information about an individual zipcode returns in a zipcode lookup.
zipcode_info = api.model('ZipCodeInfo', {
    'county_fips': fields.String(readOnly=True, description='US FIPS code for county'),
    'county_name': fields.String(required=True, description='Name of county'),
    'default_city': fields.String(required=True, description='Default city name.'),
    'latitude': fields.Float(required=True, description='Latitude'),
    'longitude': fields.Float(required=True, description='Longitude'),
    'zipcode_precision':  fields.String(required=True, description='Precision of the zipcode'),
    'state':  fields.String(required=True, description='Full name of state'),
    'state_abbreviation':  fields.String(required=True, description='Standard abbreviation for state'),
    'zipcode': fields.String(required=True, description='Zipcode'),
    'zipcode_type': fields.String(required=True, description='Not sure what this is.'),
})

# Information about a city returns in a zipcode lookup.
zipcity = api.model('ZipCity', {
    'city': fields.String(readOnly=True, description='One of the names for the city.'),
    'mailable': fields.Boolean(required=True, description='Can mail to this town. Name usable in address.'),
    'state':  fields.String(required=True, description='Full name of state'),
    'state_abbreviation':  fields.String(required=True, description='Standard abbreviation for state'),
})

# Format of the response to a zipcode lookup.
zipcode_response = api.model('ZipcodeResponse',
                             { 'cities': fields.List(fields.Nested(zipcity)),
                               'zipcode': fields.List(fields.Nested(zipcode_info))})

# The previous definitions use the classes in api.model and fields.
# This approach uses JSON Schema.
address_response = api.schema_model('AddressResponse',
                             {
                                 "properties": {
                                     "primary_number": {
                                         "type": "string"
                                     },
                                     "street_name": {
                                         "type": "string"
                                     },
                                     "street_postdirection": {
                                         "type": "string"
                                     },
                                     "street_suffix": {
                                         "type": "string"
                                     },
                                     "city_name": {
                                         "type": "string"
                                     },
                                     "default_city_name": {
                                         "type": "string"
                                     },
                                     "state_abbreviation": {
                                         "type": "string"
                                     },
                                     "zipcode": {
                                         "type": "string"
                                     },
                                     "plus4_code": {
                                         "type": "string"
                                     },
                                     "delivery_point": {
                                         "type": "string"
                                     },
                                     "delivery_point_check_digit": {
                                         "type": "string"
                                     },
                                     "deliver_point_barcode": {
                                         "type": "string"
                                     }
                                 },
                                 "required": [
                                     "primary_number",
                                     "street_name",
                                     "street_postdirection",
                                     "street_suffix",
                                     "city_name",
                                     "default_city_name",
                                     "state_abbreviation",
                                     "zipcode",
                                     "plus4_code",
                                     "delivery_point",
                                     "delivery_point_check_digit",
                                     "deliver_point_barcode"
                                 ]
                             })

# Get the context information. We will inject this into services we create.
ctx = Context.get_context()

# Create an instance of the AddressValidation service
v_service = ValidatorService(ctx)



@ns.route('/zipcodes')
class Zipcodes(Resource):
    # Given a city and state, will return scads of information about the zipcode.
    @ns.doc('Get info about zipcodes.',
            # Query parameters.
            params={'city': 'City name', 'state': 'State name'})

    # I only document the success response. As we learn more about REST, we can document and understand
    # the other responses.
    @ns.response(code=200, description="List of common city names for city and relevant zipcodes.",
                                       model=zipcode_response)
    def get(self):
        params = request.args
        t_info = {
            "city": params['city'],
            "state": params['state']
        }

        t_answer = v_service.get_zip_code(t_info)

        return Response(json.dumps(t_answer), status=200, content_type="application/json")


@ns.route('/addresses')
class Addresses(Resource):

    @ns.doc('Validate that an address exists and is valid',
        params= {"street": "Street address", "city": "City name", "state": "State name",
                 "zipcode": "You guessed it."})
    @ns.response(code=200, description="List of common city names for city and relevant zipcodes.",
                                       model=address_response)
    def get(self):
        address = request.args

        args={}
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
            args['zipcode'] = zipcode

        t_answer = v_service.validate_address(address)

        return Response(json.dumps(t_answer), status=200, content_type="application/json")


if __name__ == "__main__":
    app.run(port=5021)