import os


_context = {}

_context['smarty_streets_id'] = os.environ.get('smarty_id')
_context['smarty_streets_token'] = os.environ.get('smarty_token')

v_location = os.environ['address_validator_url']

_context['address_validator_url']=v_location

if v_location == "local":

    # The general best practice is to put imports at the beginning of a file and not
    # inside functions, classes, etc. In general, this is the best approach. I would not
    # use the approach here in practice.
    from AddressValidation.ValidatorService import ValidatorService
    _context["address_validator"] = ValidatorService
else:
    from AddressValidation.ValidatorClient import ValidatorClient
    _context['address_validator'] = ValidatorClient


def get_context():
    return _context