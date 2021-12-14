//----------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                       | |    | |               | | | |                     //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//                                                                            //
//  File      : main.mjs                                                      //
//  Project   : doom_fire                                                     //
//  Date      : 14 Dec, 21                                                    //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2021                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//

//----------------------------------------------------------------------------//
// Imports                                                                    //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
import { luna         } from "../libs/ark_luna/luna/luna.mjs";
import { Demo_Options } from "./demo_options.mjs"
import { Demo_Scene   } from "./scenes/demo_scene.mjs";


//----------------------------------------------------------------------------//
// App Callbacks                                                              //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
luna.App.pre_init = ()=> {

}

//------------------------------------------------------------------------------
luna.App.pre_load = async ()=> {
    luna.RES.init();
}

//------------------------------------------------------------------------------
luna.App.init = ()=> {
    // Editor Gui.
    // luna.GUI.init();

    // Scenes.
    luna.Scene_Manager.init();
    luna.Scene_Manager.register_scene   (Demo_Scene);
    luna.Scene_Manager.set_default_scene(Demo_Scene);

    // Start up ;D
    const params = luna.Utils.get_url_params();
    luna.Scene_Manager.run_with(params);
}

//------------------------------------------------------------------------------
luna.App.loop = ()=> {

}

//------------------------------------------------------------------------------
luna.App.resize = ()=> {
    const element     = _get_canvas_div();
    const container   = luna.make_size(element.clientWidth, element.clientHeight);
    const target      = Demo_Options.DESIGN_SIZE;
    const policy      = Demo_Options.scale_policy;
    const scaled_rect = luna.Scale_Utils.get_scaled_rect(container, target, policy);

    return scaled_rect;
}

//----------------------------------------------------------------------------//
// Private Functions                                                          //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function _get_canvas_div()
{
    return document.getElementById("canvas_div");
}


//----------------------------------------------------------------------------//
// Start                                                                      //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
luna.App.display_hello();
luna.App.set_config({
    title:       "doom_fire",
    version:     "0.0.1",
    target_fps:  60,
    design_size: Demo_Options.DESIGN_SIZE,
    append_to:   _get_canvas_div()
});
luna.App.start();