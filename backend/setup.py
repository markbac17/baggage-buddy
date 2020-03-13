import os
from app import run
from data import schema, seed

schema()
seed()
DBFILENAME = "baggage-buddy"

run()