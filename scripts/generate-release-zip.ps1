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
##  File      : generate-release-zip.ps1                                      ##
##  Project   : doom_fire                                                     ##
##  Date      : 2025-05-14                                                    ##
##  License   : See project's COPYING.TXT for full info.                      ##
##  Author    : mateus.digital <hello@mateus.digital>                         ##
##  Copyright : mateus.digital - 2025                                         ##
##                                                                            ##
##  Description :                                                             ##
##                                                                            ##
##----------------------------------------------------------------------------##

$ErrorActionPreference = "Stop";

## -----------------------------------------------------------------------------
$PACKAGE = (Get-Content package.json | Out-String | ConvertFrom-Json)

$PROJECT_NAME      = $PACKAGE.name;
$PROJECT_VERSION   = $PACKAGE.version;
$FULL_PROJECT_NAME = "${PROJECT_NAME}-${PROJECT_VERSION}";

$DIST_DIR  = "./_dist";
$BUILD_DIR = "./_build";

## -----------------------------------------------------------------------------
foreach ($item in $(Get-ChildItem "${BUILD_DIR}/*")) {
    $build_name     = $item.BaseName;
    $build_platform = $build_name.Replace("build-", "");

    $output_name = "${FULL_PROJECT_NAME}-${build_platform}";
    $output_dir  = "${DIST_DIR}/${output_name}";

    Write-Host "==> Build directory:  $item";
    Write-Host "==> Output directory: $output_dir";

    ## Clean the output directory.
    Remove-Item -Path $output_dir -Recurse -Force -ErrorAction SilentlyContinue;
    New-Item -Path $output_dir -ItemType Directory -Force;

    ## Copy the build files.
    Copy-Item -Path $item/* -Destination $output_dir/
    ## Copy resource files.
    Copy-Item -Path "_project-resources/readme-release.txt" -Destination $output_dir;

    ## Make the zip
    $zip_fullpath = "${output_dir}.zip";

    Compress-Archive                      `
        -Path "$output_dir"               `
        -DestinationPath "$zip_fullpath"  `
        -Force;
}