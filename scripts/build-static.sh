#!/usr/bin/env bash
##~---------------------------------------------------------------------------##
##                               *       +                                    ##
##                         '                  |                               ##
##                     ()    .-.,="``"=.    - o -                             ##
##                           '=/_       \     |                               ##
##                        *   |  '=._    |                                    ##
##                             \     `=./`,        '                          ##
##                          .   '=.__.=' `='      *                           ##
##                 +                         +                                ##
##                      O      *        '       .                             ##
##                                                                            ##
##  File      : build-static.sh                                               ##
##  Project   : doom_fire                                                     ##
##  Date      : 2023-08-09                                                    ##
##  License   : GPLv3                                                         ##
##  Author    : mateus.digital <hello@mateus.digital>                         ##
##  Copyright : mateus.digital - 2023                                         ##
##                                                                            ##
##  Description :                                                             ##
##    Builds the website for the project.                                     ##
##---------------------------------------------------------------------------~##

set -e; ## break on errors.

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)";
readonly ROOT_DIR="$(dirname "$SCRIPT_DIR")";

echo "$0 ==> Building static...";

## retrive build and version.
touch "${ROOT_DIR}/.buildno"; ## in case that it doesn't exists.

readonly VERSION="$(git describe --abbrev=0 --tags)";
readonly CURR_BUILD="$(cat "${ROOT_DIR}/.buildno")";
readonly NEXT_BUILD="$(( CURR_BUILD + 1 ))";
readonly DATE="$(date +'%H:%M:%S %d-%m-%Y - %Z')";

## clean dir.
rm -rf   "${ROOT_DIR}/out/";
mkdir -p "${ROOT_DIR}/out/";

## copy things.
cp -vR "${ROOT_DIR}/index.html"  "${ROOT_DIR}/out/";
cp -vR "${ROOT_DIR}/source"      "${ROOT_DIR}/out/";
cp -vR "${ROOT_DIR}/modules"     "${ROOT_DIR}/out/";

## remove git repos from out/
find "$ROOT_DIR/out" -iname "*.git*" -type d | xargs rm -rf;

## update the index with version and build number.
cat "${ROOT_DIR}/out/index.html"          \
    | sed s/"_version_"/"${VERSION}"/g    \
    | sed s/"_build_"/"${NEXT_BUILD}"/g   \
    | sed s/"_date_"/"${DATE}"/g          \
    > "${ROOT_DIR}/out/index.html.tmp"    \
    && mv                                 \
        "${ROOT_DIR}/out/index.html.tmp"  \
        "${ROOT_DIR}/out/index.html"      \
    ;

echo "${NEXT_BUILD}" > "${ROOT_DIR}/.buildno"; ## update build no.

echo "$0 ==> done...";