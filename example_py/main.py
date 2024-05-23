#!/usr/bin/env python

import sys
from server import start_server

# Define default config
config = {
    'port': 80,  # client port to connect to
    'host': 'localhost',  # client url to connect to
    'id': 'PythonExample',  # robot id
}

# Process the arguments
args = sys.argv[1:]
for i, val in enumerate(args):
    if val in ('-p', '--port'):
        config['port'] = int(args[i + 1])
    elif val in ('-h', '--host'):
        config['host'] = args[i + 1]

# Start the server
start_server(config)
