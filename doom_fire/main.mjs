

import { luna } from "../libs/ark_luna/luna/luna.mjs";

import { Demo_Scene } from "./scenes/demo_scene.mjs";


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
    await luna.RES.load_resources_with_info({
        resources_to_load: [
            // RESOURCES_TEXTURES_LOGO,
            // "resources/fonts/ARCO.ttf"
        ]
    });
}

//------------------------------------------------------------------------------
luna.App.init = ()=> {
    // Editor Gui.
    luna.GUI.init();

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
    const element   = document.documentElement;
    const container = luna.make_size(element.clientWidth, element.clientHeight);
    const target    = luna.App.get_size();
    const policy    = luna.Scale_Utils.POLICY_EXACT_FIT;

    const scaled_rect = luna.Scale_Utils.get_scaled_rect(container, target, policy);
    return scaled_rect;
}


//----------------------------------------------------------------------------//
// Start                                                                      //
//----------------------------------------------------------------------------//
luna.App.display_hello();
luna.App.set_config({
    title:       "doom_fire",
    version:     "0.0.1",
    target_fps:  60,
    design_size: null
});
luna.App.start();