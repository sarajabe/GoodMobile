#!/bin/sh

set -e

printf "\n\n\n\n\n\n"
printf "\033[0;36m************************************************************************\033[0m\n"
printf "\033[0;36m***************************** Build Info *******************************\033[0m\n"
printf "\033[0;36m************************************************************************\033[0m\n"
printf "\n\n\n\n\n\n"

export BUILD_NAME=${1}
export BITBUCKET_BUILD_NUMBER="${2}"
export BITBUCKET_COMMIT="${3}"
export COMMIT_MESSAGE="${4}" # use this variable in this pattern "${COMMIT_MESSAGE}"
export ENDPOINT_URL=''

printf "\033[0;36m Build Name:\033[0;35m %s \033[0m\n" "${BUILD_NAME}"
printf "\033[0;36m BITBUCKET BUILD NUMBER:\033[0;35m %s \033[0m\n" "${BITBUCKET_BUILD_NUMBER}"
printf "\033[0;36m BITBUCKET COMMIT:\033[0;35m %s \033[0m\n" "${BITBUCKET_COMMIT}"
printf "\033[0;36m COMMIT MESSAGE:\033[0;35m %s \033[0m\n" "${COMMIT_MESSAGE}"


printf "\n\n\n\n\n\n"
printf "\033[1;33m************************************************************************\033[0m\n"
printf "\033[1;33m******************************* Build APP ******************************\033[0m\n"
printf "\033[1;33m************************************************************************\033[0m\n"
printf "\n\n\n\n\n\n"

npm run $BUILD_NAME

set +e
