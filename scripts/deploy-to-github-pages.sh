#!/usr/bin/env bash

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)";
readonly ROOT_DIR="$(dirname "$SCRIPT_DIR")";


git checkout publish;



## clean dir.
rm -rf   "${ROOT_DIR}/docs/";
mkdir -p "${ROOT_DIR}/docs/";

## copy things.
cp -R "${ROOT_DIR}/index.html" \
      "${ROOT_DIR}/source"     \
      "${ROOT_DIR}/modules"    \
    "${ROOT_DIR}/docs/"

## remove git repos from docs/
find "$ROOT_DIR/docs" -iname "*.git*" -type d | xargs rm -rf;

## retrive build and version.
readonly VERSION="$(git describe --abbrev=0 --tags)";
readonly CURR_BUILD="$(cat "${ROOT_DIR}/.buildno")";
readonly NEXT_BUILD="$(( CURR_BUILD + 1 ))";
readonly DATE="$(date +'%H:%M:%S %d-%m-%Y - %Z')";

## update the files.
cat "${ROOT_DIR}/docs/index.html"         \
    | sed s/"_version_"/"${VERSION}"/g    \
    | sed s/"_build_"/"${NEXT_BUILD}"/g   \
    | sed s/"_date_"/"${DATE}"/g          \
    > "${ROOT_DIR}/docs/index.html.tmp"   \
    && mv                                 \
        "${ROOT_DIR}/docs/index.html.tmp" \
        "${ROOT_DIR}/docs/index.html"     \
    ;

echo "${NEXT_BUILD}" > "${ROOT_DIR}/.buildno";


git add docs/;
git commit -m "$0 - build: $NEXT_BUILD - $DATE";
