from abc import ABC, abstractmethod

class Bogdan():

    def __init__(self):

        self.iq = None
        self.name = None


class API2(ABC):


    @abstractmethod
    def m1(self, nn):
        pass

    @abstractmethod
    def m2(self):
        pass


p = Bogdan()
p.iq = 150
p.name = "foo"

y = p.x