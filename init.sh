#!/bin/bash

docker-compose down

docker system prune -a -f
docker volume prune -f
docker image prune -f
docker container prune -f

docker-compose up -d --build