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
//  Project   : lissajous                                                     //
//  Date      : 14 Dec, 21                                                    //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2021                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//


//----------------------------------------------------------------------------//
// Constants                                                                  //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
__SOURCES = [
    "/modules/demolib/modules/external/chroma.js",
    "/modules/demolib/modules/external/gif.js/gif.js",

    "/modules/demolib/source/demolib.js",
];

const background_color = "black";

function calc_max_size(w, h, pn) {
    const aspect_ratio = (w / h);
    const max_size     = Math.sqrt(pn * aspect_ratio);

    const w_new = Math.min(max_size, w);
    const h_new = Math.min(max_size / aspect_ratio, h);

    return [to_int(w_new), to_int(h_new)];
}

class Demo_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        //
        // Fire
        this._fire_pixels  = null;
        this._fire_palette = null;

        const pixels_count = 320*320;
        const max_size     = calc_max_size(get_canvas_width(), get_canvas_height(), pixels_count);

        this.fire_width  = max_size[0];
        this.fire_height = max_size[1];

        this._setup_fire();
    }

    //------------------------------------------------------------------------//
    // Events                                                                 //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    on_update(dt)
    {
        const fire_width  = this.fire_width;
        const fire_height = this.fire_height;
        const ctx         = get_main_canvas_context();

        //
        // Do Fire
        for(let x = 0; x < fire_width; ++x) {
            for(let y = 1; y < fire_height; ++y) {
                const from = (y * fire_width + x);
                const rand = Math.round(Math.random() * 3.0) & 3;
                const to   = from - fire_width - rand + 1 ;

                this._fire_pixels[to] = this._fire_pixels[from] - (rand & 1);
            }
        }

        //
        // Blit to canvas
        const image_data = ctx.getImageData(0, 0, fire_width, fire_height);
        for(let y = 0; y < fire_height; ++y) {
            for(let x = 0; x < fire_width; ++x) {
                const fire_index    = (y * fire_width + x);
                const fire_value    = this._fire_pixels [fire_index];
                const palette_index = (fire_value > 0) ? fire_value : 0;
                const rgb           = this._fire_palette[palette_index];

                const image_data_index = (fire_index) * 4;
                image_data.data[image_data_index + 0] = rgb.r;
                image_data.data[image_data_index + 1] = rgb.g;
                image_data.data[image_data_index + 2] = rgb.b;
                image_data.data[image_data_index + 3] = 255;
            }
        }
        ctx.putImageData(image_data, 0, 0);
    }
    //--------------------------------------------------------------------------
    _setup_fire()
    {
        // Create the palette.
        this._fire_palette = [
            { r: 0x07, g: 0x07, b: 0x07 },
            { r: 0x1F, g: 0x07, b: 0x07 },
            { r: 0x2F, g: 0x0F, b: 0x07 },
            { r: 0x47, g: 0x0F, b: 0x07 },
            { r: 0x57, g: 0x17, b: 0x07 },
            { r: 0x67, g: 0x1F, b: 0x07 },
            { r: 0x77, g: 0x1F, b: 0x07 },
            { r: 0x8F, g: 0x27, b: 0x07 },
            { r: 0x9F, g: 0x2F, b: 0x07 },
            { r: 0xAF, g: 0x3F, b: 0x07 },
            { r: 0xBF, g: 0x47, b: 0x07 },
            { r: 0xC7, g: 0x47, b: 0x07 },
            { r: 0xDF, g: 0x4F, b: 0x07 },
            { r: 0xDF, g: 0x57, b: 0x07 },
            { r: 0xDF, g: 0x57, b: 0x07 },
            { r: 0xD7, g: 0x5F, b: 0x07 },
            { r: 0xD7, g: 0x5F, b: 0x07 },
            { r: 0xD7, g: 0x67, b: 0x0F },
            { r: 0xCF, g: 0x6F, b: 0x0F },
            { r: 0xCF, g: 0x77, b: 0x0F },
            { r: 0xCF, g: 0x7F, b: 0x0F },
            { r: 0xCF, g: 0x87, b: 0x17 },
            { r: 0xC7, g: 0x87, b: 0x17 },
            { r: 0xC7, g: 0x8F, b: 0x17 },
            { r: 0xC7, g: 0x97, b: 0x1F },
            { r: 0xBF, g: 0x9F, b: 0x1F },
            { r: 0xBF, g: 0x9F, b: 0x1F },
            { r: 0xBF, g: 0xA7, b: 0x27 },
            { r: 0xBF, g: 0xA7, b: 0x27 },
            { r: 0xBF, g: 0xAF, b: 0x2F },
            { r: 0xB7, g: 0xAF, b: 0x2F },
            { r: 0xB7, g: 0xB7, b: 0x2F },
            { r: 0xB7, g: 0xB7, b: 0x37 },
            { r: 0xCF, g: 0xCF, b: 0x6F },
            { r: 0xDF, g: 0xDF, b: 0x9F },
            { r: 0xEF, g: 0xEF, b: 0xC7 },
            { r: 0xFF, g: 0xFF, b: 0xFF }
        ];

        // Create the array that represents the fire with palette colors.
        const fire_width   = this.fire_width;
        const fire_height  = this.fire_height
        const pixels_count = (fire_width * fire_height);

        this._fire_pixels = [];
        for(let i = 0; i < pixels_count; ++i) {
            this._fire_pixels[i] = 0;
        }

        for(let i = 0; i < fire_width; ++i) {
            const index = (fire_height -1) * fire_width + i;
            this._fire_pixels[index] = (this._fire_palette.length -1);
        }
    }
}

//----------------------------------------------------------------------------//
// Variables                                                                  //
//----------------------------------------------------------------------------//
let demo = null;

//----------------------------------------------------------------------------//
// Setup / Draw                                                               //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function setup_standalone_mode()
{
    return new Promise((resolve, reject)=>{
        demolib_load_all_scripts(__SOURCES).then(()=> { // Download all needed scripts.
            // Create the standalone canvas.
            const canvas = document.createElement("canvas");

            canvas.width            = window.innerWidth;
            canvas.height           = window.innerHeight;
            canvas.style.position   = "fixed";
            canvas.style.left       = "0px";
            canvas.style.top        = "0px";
            canvas.style.zIndex     = "-100";

            document.body.appendChild(canvas);

            // Setup the listener for gif recording.
            gif_setup_listeners();

            resolve(canvas);
        });
    });
}

//------------------------------------------------------------------------------
function setup_common(canvas)
{
    set_random_seed();
    set_main_canvas(canvas);

    demo = new Demo_Scene();

    start_draw_loop(draw);
}



//------------------------------------------------------------------------------
function demo_main(user_canvas)
{
    if(!user_canvas) {
        setup_standalone_mode().then((canvas)=>{
            setup_common(canvas);
        });
    } else {
        canvas = user_canvas;
        setup_common();
    }

}

//------------------------------------------------------------------------------
function draw(dt)
{
    begin_draw();
        clear_canvas(background_color);
        demo.on_update(dt);
    end_draw();
}
