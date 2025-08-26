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
##  Project   : mateus.digital                                                ##
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
$OUTPUT_DIR  = "./_build/web-release";

$PACKAGE_JSON = (Get-Content "./package.json" | ConvertFrom-Json);
$DEMO_NAME    = $PACKAGE_JSON.name;
$DEMO_TAGS    = $PACKAGE_JSON.keywords;
$DEMO_VERSION = $PACKAGE_JSON.version;
$DEMO_BUILD   = $PACKAGE_JSON.build;


Write-Host "==> Building for Web";
Write-Host "DEMO VERSION: ${DEMO_VERSION}(${DEMO_BUILD})";


## --- Bump the Version --------------------------------------------------------
if( -not $DEMO_BUILD ) {
  $DEMO_BUILD = 0;
}

$DEMO_BUILD = [int]$DEMO_BUILD + 1;

$PACKAGE_JSON.build = $DEMO_BUILD;
$PACKAGE_JSON | ConvertTo-Json -Depth 10 | Set-Content "./package.json";


## --- Clean Output directory --------------------------------------------------
Remove-Item                      `
  -Recurse -Force                `
  -ErrorAction SilentlyContinue  `
  "${OUTPUT_DIR}"           `
;

New-Item -Type Directory -Force  `
  "${OUTPUT_DIR}" | Out-Null
;


## --- Copy source files ------------------------------------------------------
Copy-Item -Recurse      `
  "./source/*"          `
  "${OUTPUT_DIR}";

(Get-Content "${OUTPUT_DIR}/index.html")                    `
    -replace "__DEMO_NAME__",    "${DEMO_NAME}"                  `
    -replace "__DEMO_TAGS__",    "${DEMO_TAGS}"                  `
    -replace "__DEMO_VERSION__", "${DEMO_VERSION}"               `
    -replace "__DEMO_BUILD__",   "${DEMO_BUILD}"                 `
    -replace "__DEMO_DATE__",    (Get-Date -Format "yyyy-MM-dd") `
| Set-Content "${OUTPUT_DIR}/index.html";

## --- Copy libs and resources -------------------------------------------------
Copy-Item -Recurse "./modules"     "${OUTPUT_DIR}/modules";
Copy-Item -Recurse "./resources/*" "${OUTPUT_DIR}";


## -----------------------------------------------------------------------------
Write-Output "==> done...";
