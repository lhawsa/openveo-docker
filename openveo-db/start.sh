#!/bin/bash

sleep 2 && tail -F /var/log/mongodb/mongodb.log &
mongod -f /etc/mongod.conf

