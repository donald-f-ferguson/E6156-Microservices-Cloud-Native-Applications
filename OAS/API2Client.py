from AddressValidation.Validator import API2
import requests
import json

url = "somewhere"

class API2Client(API2):

    def do_it(self, method_name, data):
        global url
        my_url = url + "/" + method_name
        data = json.dumps(data)
        res = requests.get(url=url, json=data)
        if res.status_code == 200:
            result = res.json()
        else:
            result = None

        return res.status_code, result


    def m1(self, something):

        return self.do_it("explode", something)

    def m2(self):
        pass