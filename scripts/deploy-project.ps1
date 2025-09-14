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
##  File      : deploy.ps1                                                    ##
##  Project   : doom_fire                                                     ##
##  Date      : Aug 26, 2025                                                  ##
##  License   : GPLv3                                                         ##
##  Author    : mateus.digital <hello@mateus.digital>                         ##
##  Copyright : mateus.digital - 2025                                         ##
##                                                                            ##
##  Description :                                                             ##
##   Deploys the output of build to the remote server.                        ##
##   Requires SSH keys set up and rsync installed.                            ##
##---------------------------------------------------------------------------~##

param (
  [string]$Environment = "dev"  # use --production for prod
)

$ErrorActionPreference = "Stop"

# -------------------------------------------------------------------------
# Project Info
$PACKAGE_JSON = (Get-Content "./package.json" | ConvertFrom-Json);
$PROJECT_NAME    = $PACKAGE_JSON.name;
$PROJECT_VERSION = $PACKAGE_JSON.version;
$PROJECT_BUILD   = $PACKAGE_JSON.build;

$SOURCE_FOLDER   = "_dist/${PROJECT_NAME}-${PROJECT_VERSION}-web-release";


# -------------------------------------------------------------------------
# Remote settings
if ($Environment -eq "--production") {
  $REMOTE_USER   = "mateus"
  $REMOTE_HOST   = "mateus.digital"
  $REMOTE_FOLDER = "/var/www/mateus.digital/html/${PROJECT_NAME}";
}
else {
  $REMOTE_USER   = "mateusdigital"
  $REMOTE_HOST   = "$env:DEPLOY_HOST";
  $REMOTE_FOLDER = "/var/www/mateus.digital/html/${PROJECT_NAME}";
}

$REMOTE_SERVER = "$REMOTE_USER@$REMOTE_HOST";

# -------------------------------------------------------------------------
if (-Not (Test-Path $SOURCE_FOLDER)) {
  Write-Error "Source folder not found: $SOURCE_FOLDER";
  exit 1;
}

# -------------------------------------------------------------------------
Write-Host "Deploying files to ${REMOTE_SERVER}:${REMOTE_FOLDER}";
ssh "$REMOTE_SERVER" "mkdir -p $REMOTE_FOLDER";

if(-not $IsWindows) {
  rsync -avz -e ssh                     `
    "${SOURCE_FOLDER}/"                 `
    "${REMOTE_SERVER}:${REMOTE_FOLDER}" `
  ;
}
else {
  scp -r -C -p "$SOURCE_FOLDER/*" "${REMOTE_SERVER}:${REMOTE_FOLDER}/";
}
Write-Host "Deploy complete!"