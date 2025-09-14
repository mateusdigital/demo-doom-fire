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
##  File      : build-clean.ps1                                               ##
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
& ./scripts/build-clean.ps1;
& ./scripts/build-game.ps1;
& ./scripts/build-project-web-page.ps1;
& ./scripts/generate-release-zip.ps1;
& ./scripts/deploy-project.ps1