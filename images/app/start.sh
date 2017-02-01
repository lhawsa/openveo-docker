#!/bin/bash

NODEJS="/usr/local/bin/nodejs"
OPENVEO_CORE_DIR="/home/openveo/openveo/node_modules/@openveo/core"

export NODE_ENV=production

hostinfo
cd $OPENVEO_CORE_DIR
. /start-vars.sh
$NODEJS createSuperAdmin.js \
    --name=${APP_SUPER_ADMIN_NAME} --email=${APP_SUPER_ADMIN_EMAIL} --password=${APP_SUPER_ADMIN_PASSWD}
$NODEJS server.js &
$NODEJS server.js -ws
