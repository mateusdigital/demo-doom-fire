##----------------------------------------------------------------------------##
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
##  File      : build-demo.ps1                                                ##
##  Project   : doom_fire                                                     ##
##  Date      : 2025-05-14                                                    ##
##  License   : See project's COPYING.TXT for full info.                      ##
##  Author    : mateus.digital <hello@mateus.digital>                         ##
##  Copyright : mateus.digital - 2025                                         ##
##                                                                            ##
##  Description :                                                             ##
##                                                                            ##
##----------------------------------------------------------------------------##

## -----------------------------------------------------------------------------
$ErrorActionPreference = "Stop"

## -----------------------------------------------------------------------------
$OUTPUT_DIR_PATH  = "./_build/web-release";
$BUMP_VERSION_EXE = "./scripts/bump-version.ps1";




## -----------------------------------------------------------------------------
& $BUMP_VERSION_EXE -BumpBuild;

$DEMO_NAME    = "DOOM FIRE!"; ## @TODO(md): Get from package.json
$DEMO_TAGS    = @(
    "doom",
    "javascript",
    "canvas",
    "retro",
    "demo",
    "demoscene",
    "creative-coding",
    "mateus.digital"
);

$DEMO_VERSION = (& $BUMP_VERSION_EXE -ShowVersion);
$DEMO_BUILD   = (& $BUMP_VERSION_EXE -ShowBuild);

Write-Host "==> Building for Web";
Write-Host "DEMO VERSION: ${DEMO_VERSION}";



##------------------------------------------------------------------------------
Remove-Item -Recurse -Force "${OUTPUT_DIR_PATH}" -ErrorAction SilentlyContinue;
New-Item -Type Directory "${OUTPUT_DIR_PATH}" -Force;

## Sources
Copy-Item -Recurse "./source/*" "${OUTPUT_DIR_PATH}";
(Get-Content "${OUTPUT_DIR_PATH}/index.html")     `
    -replace "__DEMO_NAME__",    "${DEMO_NAME}" `
    -replace "__DEMO_TAGS__",    "${DEMO_TAGS}" `
    -replace "__DEMO_VERSION__", "${DEMO_VERSION}" `
    -replace "__DEMO_BUILD__",   "${DEMO_BUILD}"   `
    -replace "__DEMO_DATE__",    (Get-Date -Format "yyyy-MM-dd") `
| Set-Content "${OUTPUT_DIR_PATH}/index.html"

## Libs
Copy-Item -Recurse "./modules" "${OUTPUT_DIR_PATH}/modules";

## Resources
Copy-Item -Recurse "./resources/*" "${OUTPUT_DIR_PATH}";


## -----------------------------------------------------------------------------
Write-Output "==> done...";
