#!/bin/bash

# This script used in Travis CI to Build Production Image using Docker and Upload it to Docker Bub with appopriate tags.

# Bulding, Tagging and Pushing only happen for direct merges in master and release branches. 
# "$TRAVIS_PULL_REQUEST = false" explicitly make sure anything don't get executed (even if this script executed) for intermediate pull request for those branches. 
# (We can also just disable all pull request build from Travis CI settings.)

# Building Production Build Image & Loggin In.
if ([ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]) ||  ([ "$TRAVIS_BRANCH" == "release" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ])
then
   echo "Production Docker Image Built Is Started for Branch $TRAVIS_BRANCH";
   docker-compose -f docker-compose.yml -f docker-compose.production.yml build;
   docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD";
else
   echo "Production Docker Image Built Is Skipped. (Because not a master or release branch build)";
fi


# Tagging with appopriate tags and push them into docker hub. 
if [ "$TRAVIS_BRANCH" == "master" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]
then
  docker tag json-patch-api-image-prod sandunwebdev/json-patch-api-image-prod:master;

  docker push sandunwebdev/json-patch-api-image-prod:master;
elif [ "$TRAVIS_BRANCH" == "release" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ]
then
  docker tag json-patch-api-image-prod sandunwebdev/json-patch-api-image-prod:release;
  docker tag json-patch-api-image-prod sandunwebdev/json-patch-api-image-prod:latest;

  docker push sandunwebdev/json-patch-api-image-prod:release;
  docker push sandunwebdev/json-patch-api-image-prod:latest;
fi
