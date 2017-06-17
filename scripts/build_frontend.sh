#!/bin/bash

if [ "$NODE_ENV" == "production" ]
then
        cd frontend && npm install --global yarn > /dev/null 2>&1 && yarn install && yarn build
fi
