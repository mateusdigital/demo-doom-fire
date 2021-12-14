//----------------------------------------------------------------------------//
//                        _      _                 _   _                      //
//                       | |    | |               | | | |                     //
//                    ___| |_ __| |_ __ ___   __ _| |_| |_                    //
//                   / __| __/ _` | '_ ` _ \ / _` | __| __|                   //
//                   \__ \ || (_| | | | | | | (_| | |_| |_                    //
//                   |___/\__\__,_|_| |_| |_|\__,_|\__|\__|                   //
//                                                                            //
//                                                                            //
//  File      : demo_scene.mjs                                                //
//  Project   : doom_fire                                                     //
//  Date      : 13 Dec, 21                                                    //
//  License   : GPLv3                                                         //
//  Author    : stdmatt <stdmatt@pixelwizards.io>                             //
//  Copyright : stdmatt - 2021                                                //
//                                                                            //
//  Description :                                                             //
//                                                                            //
//---------------------------------------------------------------------------~//
import { luna } from "../../libs/ark_luna/luna/luna.mjs";
import * as Demo_Options from "../demo_options.mjs"

//----------------------------------------------------------------------------//
// Demo_Scene                                                                 //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
export class Demo_Scene
    extends luna.Base_Scene
{
    //--------------------------------------------------------------------------
    constructor()
    {
        super();

        //
        //
        this._fire_pixels  = null;
        this._fire_palette = null;

        this._setup_fire();

        //
        // Graphics.
        this._buffer_canvas  = null;
        this._buffer_context = null;
        this._sprite         = null;

        this._setup_graphics();
    }

    //------------------------------------------------------------------------//
    // Events                                                                 //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    on_update(dt)
    {
        const fire_width  = Demo_Options.FIRE_WIDTH;
        const fire_height = Demo_Options.FIRE_HEIGHT;
        const ctx         = this._buffer_context;

        this.do_fire();

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
        this._sprite.texture.update();
    }

    //--------------------------------------------------------------------------
    on_resize()
    {
        luna.log_verbose(luna.App.get_size());
    }

    spread_fire(from)
    {
        var rand = Math.round(Math.random() * 3.0) & 3;
        var to = from - Demo_Options.FIRE_WIDTH - rand + 1 ;
        this._fire_pixels[to] = this._fire_pixels[from] - (rand & 1);
    }

    do_fire()
    {
        const fire_width  = Demo_Options.FIRE_WIDTH;
        const fire_height = Demo_Options.FIRE_HEIGHT;

        for(let x = 0; x < fire_width; ++x) {
            for(let y = 1; y < fire_height; ++y) {
                this.spread_fire(y * fire_width + x);
            }
        }

        // let ss = "";
        // for(let y = 0; y < fire_height; ++y) {
        //     for(let x = 0; x < fire_width; ++x) {
        //         const src_index = (y       * fire_width) + x;
        //         ss += this._fire_pixels[src_index] + " ";
        //     }
        //     ss += "\n"
        // }

        // ss += "\n"
        // ss += "\n"
        // console.log(ss);

        //     for(let y = fire_height -1; y >= 0; --y) {
        // for(let x = 0; x < fire_width; ++x) {
        //     for(let y = fire_height -1; y >= 0; --y) {
        //         const src_index = (y       * fire_width) + x;
        //         const dst_index = ((y - 1) * fire_width) + x;

        //         var rand = Math.round(Math.random() * 3.0) & 3;

        //         const src_value = this._fire_pixels[src_index];
        //         const dst_value = src_value - (rand & 1);
        //         this._fire_pixels[dst_index] = (dst_value >= 0) ? dst_value : 0;
        //     }
        // }
    }



    //------------------------------------------------------------------------//
    // Helpers                                                                //
    //------------------------------------------------------------------------//
    //--------------------------------------------------------------------------
    _setup_graphics()
    {
        // Create the canvas that we gonna draw...
        this._buffer_canvas = document.createElement("canvas");
        this._buffer_canvas.width  = Demo_Options.FIRE_WIDTH;
        this._buffer_canvas.height = Demo_Options.FIRE_HEIGHT;

        this._buffer_context = this._buffer_canvas.getContext("2d");

        // Create a sprite that we can render...
        const texture = PIXI.Texture.from(this._buffer_canvas);
        this._sprite = luna.RES.create_sprite_with_texture(texture);
        this._sprite.cacheAsBitmap = false;

        luna.Layout.add_to_parent(this, this._sprite);

        this._sprite.width  = luna.App.get_size().width;
        this._sprite.height = luna.App.get_size().height;
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
        const fire_width   = Demo_Options.FIRE_WIDTH;
        const fire_height  = Demo_Options.FIRE_HEIGHT
        const pixels_count = (fire_width * fire_height);

        this._fire_pixels = [];
        for(let i = 0; i < pixels_count; ++i) {
            this._fire_pixels[i] = 0;
        }

        for(let i = 0; i < fire_width; ++i) {
            const index = (fire_height -1) *  fire_width + i;
            this._fire_pixels[index] = (this._fire_palette.length -2);
        }
    }
}