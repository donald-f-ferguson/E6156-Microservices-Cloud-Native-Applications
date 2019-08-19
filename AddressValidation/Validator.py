from abc import ABC, abstractmethod


class Validator(ABC):

    @abstractmethod
    def get_zip_code(self, town_info):
        pass

    @abstractmethod
    def validate_address(self, address):
        pass
