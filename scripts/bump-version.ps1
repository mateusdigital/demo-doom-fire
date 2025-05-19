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
##  File      : bump-version.ps1                                              ##
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
param (
  [object]$Path = "package.json",
  [switch]$BumpMajor,
  [switch]$BumpMinor,
  [switch]$BumpPatch,
  [switch]$BumpBuild,
  [switch]$ShowVersion,
  [switch]$ShowVersionFull,
  [switch]$ShowMajor,
  [switch]$ShowMinor,
  [switch]$ShowPatch,
  [switch]$ShowBuild,
  [switch]$Version,
  [switch]$Help,
  [switch]$Update
)

## -----------------------------------------------------------------------------
$BUMP_VERSION = "1.0.0";



##
## Help And Version
##

## -----------------------------------------------------------------------------
if ($PSBoundParameters.ContainsKey("Help")) {
  Write-Output "Usage: bump-version.ps1 [options]";
  Write-Output "Options:";
  Write-Output "  -Help                   Show this help message";
  Write-Output "  -Version                Show copyright and version information";
  Write-Output "  -Update                 Auto Update the script...";
  Write-Output "";
  Write-Output "  -Path <path>            Path to the package.json file (default: package.json)";
  Write-Output "";
  Write-Output "  -BumpMajor <number>     Major version number";
  Write-Output "  -BumpMinor <number>     Minor version number";
  Write-Output "  -BumpPatch <number>     Patch version number";
  Write-Output "  -BumpBuild <number>     Build version number";
  Write-Output "";
  Write-Output "  -ShowVersion            Show the current version";
  Write-Output "  -ShowVersionFull        Show the full version (including build number)";
  Write-Output "  -ShowMajor              Show the major version";
  Write-Output "  -ShowMinor              Show the minor version";
  Write-Output "  -ShowPatch              Show the patch version";
  Write-Output "  -ShowBuild              Show the build number";
  exit;
}

## -----------------------------------------------------------------------------
if ($PSBoundParameters.ContainsKey("Version")) {
  Write-Output "bump-version.ps1 ${BUMP_VERSION}";
  Write-Output "Copyright (c) 2025 mateus.digital";
  exit;
}

##
## Update Script
##

## -----------------------------------------------------------------------------
if($PSBoundParameters.ContainsKey("Update")) {
  $script_path = $MyInvocation.MyCommand.Path;
  $script_dir  = Split-Path $script_path -Parent;
  $script_name = Split-Path $script_path -Leaf;

  Write-Output "Updating script...";
  Write-Output "Script path: $script_path";
  Write-Output "Script dir:  $script_dir";
  Write-Output "Script name: $script_name";

  exit;
}



##
## Resolve path and read file
##

## -----------------------------------------------------------------------------
if ((Test-Path $Path) -and (Get-Item $Path).PSIsContainer) {
  $Path = (Join-Path $Path "package.json");
}

if (-not (Test-Path $Path)) {
  Write-Error "File not found: $Path";
  exit 1
}

$json          = (Get-Content $Path | ConvertFrom-Json);
$version_parts = ($json.version -split '\.').ForEach({ [int]$_ });
$build_number  = [int]$json.build;


##
## Show Arguments
##

## -----------------------------------------------------------------------------
if ($ShowVersion) {
  Write-Output "$($version_parts[0]).$($version_parts[1]).$($version_parts[2])";
  exit;
}
if ($ShowVersionFull) {
  Write-Output "$($version_parts[0]).$($version_parts[1]).$($version_parts[2]).$build_number";
  exit;
}

if ($ShowMajor) { Write-Output $version_parts[0]; exit; }
if ($ShowMinor) { Write-Output $version_parts[1]; exit; }
if ($ShowPatch) { Write-Output $version_parts[2]; exit; }
if ($ShowBuild) { Write-Output $build_number;     exit; }


##
## Bump Arguments
##

## -----------------------------------------------------------------------------
if ($PSBoundParameters.ContainsKey("BumpMajor")) {
  $version_parts[0] += 1;
  $version_parts[1]  = 0;
  $version_parts[2]  = 0;
}
elseif ($PSBoundParameters.ContainsKey("BumpMinor")) {
  $version_parts[1] += 1;
  $version_parts[2]  = 0;
}
elseif ($PSBoundParameters.ContainsKey("BumpPatch")) {
  $version_parts[2] = +1;
}
elseif ($PSBoundParameters.ContainsKey("BumpBuild")) {
  $build_number += 1;
}

# Save
$json.version = "$($version_parts -join '.')"
$json.build   = $build_number;

$json | ConvertTo-Json -Depth 10 | Set-Content -Encoding UTF8 $Path;

# Output
$json.version;
