#!/bin/sh

#set -e
export NPM_USERNAME="${1}"
export NPM_PASSWORD="${2}"
export NPM_EMAIL="rasheed.rabata@capella.io"

printf "\n\n\n\n\n\n"
printf "\033[1;33m************************************************************************\033[0m\n"
printf "\033[1;33m****************************** Install packages ************************\033[0m\n"
printf "\033[1;33m************************************************************************\033[0m\n"
printf "\n\n\n\n\n\n"

npm-cli-login -u $NPM_USERNAME -p $NPM_PASSWORD -e $NPM_EMAIL
#npm cache clean --force 
yarn install

printf "\n\n\n\n\n\n"
printf "\033[1;33m************************************************************************\033[0m\n"
printf "\033[1;33m******************************* Test APP ******************************\033[0m\n"
printf "\033[1;33m************************************************************************\033[0m\n"
printf "\n\n\n\n\n\n"
# npm run test 
#set +e
