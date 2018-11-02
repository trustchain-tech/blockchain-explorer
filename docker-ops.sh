#!/bin/bash

function inside_start() {
    #Redirecting console.log to log file.
    #Please visit ./logs/app to view the application logs and visit the ./logs/db to view the Database logs and visit the ./log/console for the console.log
    # Log rotating for every 7 days.
    
    mkdir -p ./logs/{app,db,console}
    find ./logs/app -mtime +7 -type f -delete && find ./logs/db -mtime +7 -type f -delete && find ./logs/console -mtime +7 -type f -delete
    
    node syncData.js >> logs/console/console1.log-"$(date +%Y-%m-%d)" 2>&1 &
    
    sleep 5s
    
    node main.js | tee logs/console/console.log-"$(date +%Y-%m-%d)" 2>&1
}

function inside_stop() {
    pkill node
}

function outside_up() {
    docker-compose up -d postgresql
    sleep 5s
    docker-compose up -d explorer
}

function outside_down() {
    docker-compose down
}

function outside_initdb() {
    docker exec -it postgresql bash -c "psql -d tendermintexplorer -a -f tendermintpg.sql"
    docker exec -it postgresql bash -c "psql -d tendermintexplorer -a -f tenderupdatepg.sql"
}

function outside_deploy() {
    docker-compose up -d postgresql
    sleep 5s
    outside_initdb
    docker-compose up -d explorer
}

function outside_cleardb() {
    docker stop explorer
    docker exec -it postgresql bash -c "psql -d tendermintexplorer -a -f cleardb.sql"
    docker start explorer
}

if [ "$1" == "deploy" ]; then
    outside_deploy
elif [ "$1" == "up" ]; then
    outside_up
elif [ "$1" == "down" ]; then
    outside_down
elif [ "$1" == "start" ]; then
    inside_start
elif [ "$1" == "initdb" ]; then
    outside_initdb
elif [ "$1" == "cleardb" ]; then
    outside_cleardb
fi
