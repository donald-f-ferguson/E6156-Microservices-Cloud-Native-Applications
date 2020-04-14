
import threading
from threading import Thread

from threading import current_thread
from random import random
from time import sleep, time, localtime
from datetime import datetime


threadlocal = threading.local()



def run_it(do_sleep=None):

    ns = 0
    for i in range(5):
        if do_sleep:
            sleep(2)
        ns += 1
        s = "\nThread: " + str(threading.current_thread().name) + ", value = " + str(ns) + \
            ", at " + str(datetime.now()) + "\n"
        print(s)


def t1():

    start_t = time()
    run_it(2)
    run_it(2)
    elapsed_time = time() - start_t
    print("\\nElapsed time = ", elapsed_time)

def t2():
    start_t = time()
    t1 = Thread(target=run_it, name="Bob", kwargs=dict(do_sleep=2))
    t2 = Thread(target=run_it, name="Larry", kwargs=dict(do_sleep=2))
    t1.start()
    t2.start()
    t1.join()
    t2.join()
    elapsed_time = time() - start_t
    print("\nElapsed time = ", elapsed_time)

#t1()
t2()
