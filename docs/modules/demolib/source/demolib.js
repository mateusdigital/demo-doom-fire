
//----------------------------------------------------------------------------//
//                                                                            //
// Utils                                                                      //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function is_null_or_undefined(v)
{
    return (v === null || v === undefined);
}

function create_2d_array(rows, cols) {
    const arr = new Array(to_int(rows));
    for(let i = 0; i < rows; ++i) {
        arr[i] = new Array(to_int(cols));
    }
    return arr;
}

//
// Log
//

//------------------------------------------------------------------------------
const echo        = console.log; // Muscle Memory :)
const verbose_log = console.log; // @TODO: Make a way to remove this from dist...
const error_log   = (...args) => {
    console.error(...args); // @TODO: Make a way to remove this from dist...
    debugger;
}


//
// Min_Max
//

//------------------------------------------------------------------------------
class Min_Max
{
    static from_two_values(val1, val2)
    {
        return new Min_Max(Math.min(val1, val2), Math.max(val1, val2));
    }

    constructor(min, max)
    {
        this.min = min;
        this.max = max;
    }

    random_int  () { return random_int  (this.min, this.max); }
    random_float() { return random_float(this.min, this.max); }

    random_int_without(k = null)
    {
        let v = null;
        do { v = random_int(this.min, this.max); } while(v == k);
        return v;
    }

    random_float_without(k = null)
    {
        let v = null;
        do { v = random_float(this.min, this.max); } while(v == k);
        return v;
    }

    in_range(v) { return v >= this.min && v < this.max; }
}

//------------------------------------------------------------------------------
function make_min_max(min, max) { return new Min_Max(min, max); }


//----------------------------------------------------------------------------//
//                                                                            //
// Loop                                                                       //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const MIN_FRAME_RATE = (1.0 / 30.0);

//------------------------------------------------------------------------------
let __time_total = 0;
let __time_delta = 0;
let __time_prev  = 0;
let __time_now   = 0;

let __user_draw_func = null;

//------------------------------------------------------------------------------
function get_total_time() { return __time_total; }
function get_delta_time() { return __time_delta; }

//------------------------------------------------------------------------------
function start_draw_loop(user_draw_func)
{
    __user_draw_func = user_draw_func;
    canvas_render();
}


//----------------------------------------------------------------------------//
//                                                                            //
// Canvas Functions                                                           //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
let __canvas  = null;
let __context = null;

//------------------------------------------------------------------------------
function get_canvas_size()
{
    const w = get_canvas_width ();
    const h = get_canvas_height()

    const v = Min_Max.from_two_values(w, h);
    v.width  = w;
    v.height = h;

    return v;

}

function get_canvas_width (s = 1)  { return __canvas.width  * s; }
function get_canvas_height(s = 1)  { return __canvas.height * s; }
function get_context() { return __context; }

//------------------------------------------------------------------------------
function set_main_canvas(canvas) {
    __canvas  = canvas;
    __context = canvas.getContext("2d");
}

//------------------------------------------------------------------------------
function get_main_canvas        () { return __canvas;  }
function get_main_canvas_context() { return __context; }

//------------------------------------------------------------------------------
function begin_draw() { __context.save   (); }
function end_draw  () { __context.restore(); }

//------------------------------------------------------------------------------
function translate_canvas_to_center()
{
    __context.translate(
        __canvas.width  * 0.5,
        __canvas.height * 0.5
    );
}

//------------------------------------------------------------------------------
function translate_canvas(x, y)
{
    __context.translate(x, y);
}

//------------------------------------------------------------------------------
function clear_canvas(color)
{
    if(is_null_or_undefined(color)) {
        color = "black";
    }

    clear_canvas_rect(
        -__canvas.width,
        -__canvas.height,
        +__canvas.width  * 2,
        +__canvas.height * 2,
        color
    );
}

//------------------------------------------------------------------------------
function clear_canvas_rect(x, y, w, h, color)
{
    const fill_style = __context.fillStyle;

    __context.fillStyle = color;
    __context.fillRect(x, y, w, h);

    __context.fillStyle = fill_style;
}

//------------------------------------------------------------------------------
function set_canvas_fill      (color) { __context.fillStyle   = color; }
function set_canvas_stroke    (color) { __context.strokeStyle = color; }
function set_canvas_line_width(width) { __context.lineWidth   = width; }
function set_canvas_stroke_size(size) { __context.lineWidth = size; }


//
// Fill Functions
//

//------------------------------------------------------------------------------
function fill_circle(x, y, r)
{
    fill_arc(x, y, r, 0, MATH_2PI, true);
}

//------------------------------------------------------------------------------
function fill_arc(x, y, r, sa, ea, close)
{
    __context.beginPath();
        __context.arc(x, y, r, sa, ea);
        if(!is_null_or_undefined(close)) {
            __context.closePath();
        }
    __context.fill();
}

//------------------------------------------------------------------------------
function fill_rect(x, y, w, h)
{
    if(w <= 0 || h <= 0) {
        return;
    }

    __context.beginPath();
        __context.rect(x, y, w, h);
    __context.closePath();
    __context.fill();
}



//------------------------------------------------------------------------------
function canvas_render() // @todo: make private
{
    // Update timers...
    __time_now = Date.now();

    // Cap frame rate.
    let dt = ((__time_now - __time_prev) / 1000);
    if(dt > MIN_FRAME_RATE) {
        dt = MIN_FRAME_RATE;
    }

    __time_prev = __time_now;

    __time_total += dt;
    __time_delta  = dt;

    // Call user update.
    __user_draw_func(dt);

    // Add frames to gif.
    if(gif_is_recording()) {
        __gif.addFrame(
            __context,
            {   // @todo: This object can be cached???
                copy: true,
                delay: __gif_delay_ms
            }
        );

        __gif_duration_s -= dt;
        verbose_log(`Gif add frame - Remaining ${__gif_duration_s}`);

        if(__gif_duration_s <= 0) {
            gif_stop_record();
        }
    }

    // Continue the loop.
    window.requestAnimationFrame(canvas_render);
}

//
// Draw Functions
//

//------------------------------------------------------------------------------
function draw_point(x, y, size)
{
    __context.beginPath();
        __context.arc(x, y, size, 0, 2 * Math.PI, true);
    __context.closePath();
    __context.stroke();
    __context.fill();
}

//------------------------------------------------------------------------------
function draw_line(x1, y1, x2, y2)
{
    __context.beginPath();
        __context.moveTo(x1, y1);
        __context.lineTo(x2, y2);
    __context.closePath();
    __context.stroke();
}

//------------------------------------------------------------------------------
function draw_arc(x, y, r, sa, ea, close)
{
    __context.beginPath();
        __context.arc(x, y, r, sa, ea);
        if(close != undefined && close) {
            __context.closePath();
        }
    __context.stroke();
}





//----------------------------------------------------------------------------//
//                                                                            //
// Random                                                                     //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
let __rnd_gen = null;

//------------------------------------------------------------------------------
function set_random_seed(seed = null)
{
    if(is_null_or_undefined(seed)) {
        seed = Date.now();
    }

    verbose_log("random_seed:", seed);
    __rnd_gen = __mulberry32(seed);
}

//------------------------------------------------------------------------------
function random_float(min, max)
{
    if(is_null_or_undefined(min)) {
        min = 0;
        max = 1;
    } else if(is_null_or_undefined(max)) {
        max = min;
        min = 0;
    }

    const value = Math.random(); // @XXX use our random
    return min + (value * (max - min));
}

//------------------------------------------------------------------------------
function random_int(min, max)
{
    return Math.floor(random_float(min, max));
}

//------------------------------------------------------------------------------
function random_bool()
{
    return Math.random() > 0.5; // @XXX use our random
}

//------------------------------------------------------------------------------
function random_element(collection)
{
    const i = random_int(collection.length);
    return collection[i];
}

//------------------------------------------------------------------------------
function random_signed(v)
{
    return Math.abs(v) * (random_bool() ? -1 : 1);
}


//------------------------------------------------------------------------------
function __mulberry32(a)
{

    // Reference:
    //   https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}



//----------------------------------------------------------------------------//
//                                                                            //
// Noise                                                                      //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function set_noise_seed(seed)
{
    if(is_null_or_undefined(seed)) {
        seed = random_float();
    }

    verbose_log("noise_seed:", seed);
    noise.seed(Math.random());
}

//------------------------------------------------------------------------------
function perlin_noise(x, y = 0, z = 0)
{
    return Math.abs(noise.simplex3(x, y, z));
}




//----------------------------------------------------------------------------//
//                                                                            //
// Input                                                                      //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
let __mouse_pos          = null;
let __mouse_left_pressed = false;

let __mouse_wheel_x = 0;
let __mouse_wheel_y = 0;

//------------------------------------------------------------------------------
function get_mouse_pos() { return __mouse_pos;   }
function get_mouse_x  () { return __mouse_pos.x; }
function get_mouse_y  () { return __mouse_pos.y; }

function is_mouse_pressed(button_no) { return false; } // @todo

function get_mouse_wheel_x() { return __mouse_wheel_x; }
function get_mouse_wheel_y() { return __mouse_wheel_y; }


//------------------------------------------------------------------------------
function install_input_handlers(element, handlers)
{
    if(!element) {
        element = window;
    }

    // Move
    element.addEventListener("mousemove", (ev) =>  {
        const rect = element.getBoundingClientRect();
        if(is_null_or_undefined(__mouse_pos)) {
            __mouse_pos = make_vec2();
        }

        __mouse_pos.x = (ev.clientX - rect.left) / (rect.right  - rect.left) * element.width;
        __mouse_pos.y = (ev.clientY - rect.top ) / (rect.bottom - rect.top ) * element.height;

        if(handlers && handlers.on_mouse_move) {
            handlers.on_mouse_move(__mouse_pos.x, __mouse_pos.y, ev);
        }
    }, false);


    // Left Mouse Click
    element.addEventListener("click", (ev) =>  {
        if(handlers && handlers.on_mouse_left_click) {
            handlers.on_mouse_left_click(ev);
        }
    });

    // Right Mouse Click
    element.addEventListener('contextmenu', (ev) =>  {
        ev.preventDefault();
        if(handlers && handlers.on_mouse_right_click) {
            handlers.on_mouse_right_click(ev);
        }
    }, false);

    // Mouse Down
    element.addEventListener("mousedown", (ev) =>  {
        // @todo(stdmatt): Check the which button is down...
        // debugger;
        if(handlers && handlers.on_mouse_down) {
            handlers.on_mouse_down(0, ev);
        }
    });

    // Mouse Up
    element.addEventListener("mouseup", (ev) =>  {
        // @todo(stdmatt): Check the which button is down...
        // debugger;
        if(handlers && handlers.on_mouse_up) {
            handlers.on_mouse_up(0, ev);
        }
     });

    // Mouse Whell
    element.addEventListener("wheel", (ev) =>  {
        __mouse_wheel_x += ev.wheelDeltaX;
        __mouse_wheel_y += ev.wheelDeltaY;

        // @todo(stdmatt): Check the which button is down...
        // debugger;
        if(handlers && handlers.on_mouse_wheel) {
            handlers.on_mouse_wheel(__mouse_wheel_x, __mouse_wheel_y, ev);
        }
    });
}


//----------------------------------------------------------------------------//
//                                                                            //
// Math                                                                       //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
const MATH_PI  = Math.PI;
const MATH_2PI = MATH_PI * 2;

const HALF_PI =  Math.PI * 0.5;
const TWO_PI  =  Math.PI * 2.0;

const    to_int        = Math.trunc;
function int_mod(a, b) { return to_int(to_int(a) / to_int(b)) }

//------------------------------------------------------------------------------
function to_radians(degrees) { return degrees * (MATH_PI/180.0); }
function to_degrees(radians) { return radians * (180.0/MATH_PI); }


//------------------------------------------------------------------------------
function direction(x1, y1, x2, y2)
{
    return make_vec2(x2 - x1, y2 - y1);
}

//------------------------------------------------------------------------------
function direction_unit(x1, y1, x2, y2)
{
    return make_vec2_unit(direction(x1, y1, x2, y2));
}

//------------------------------------------------------------------------------
function distance(x1, y1, x2, y2)
{
    const x = (x2 - x1);
    const y = (y2 - y1);
    return Math.sqrt(x*x + y*y);
}

//------------------------------------------------------------------------------
function distance_sq(x1, y1, x2, y2)
{
    const x = (x2 - x1);
    const y = (y2 - y1);
    return (x*x) + (y*y);
}


//------------------------------------------------------------------------------
function normalize(value, min, max)
{
    const normalized = (value - min) / (max - min);
    return normalized;
}

//------------------------------------------------------------------------------
function denormalize(normalized, min, max)
{
    const denormalized = (normalized * (max - min) + min);
    return denormalized;
}

//------------------------------------------------------------------------------
function map_values(value, start1, end1, start2, end2)
{
    if(start1 == end1 || start2 == end2) {
        return end2;
    }

    const normalized   = normalize  (value,      start1, end1);
    const denormalized = denormalize(normalized, start2, end2);

    return clamp(
        denormalized,
        Math.min(start2, end2),
        Math.max(start2, end2)
    );
}


//------------------------------------------------------------------------------
function map_sin(value, start2, end2) { return map(value, -1, +1, start2, end2) };
function map_cos(value, start2, end2) { return map(value, -1, +1, start2, end2) };

//------------------------------------------------------------------------------
function lerp(t, v0, v1)
{
    return (1 - t) * v0 + t * v1;
}

//------------------------------------------------------------------------------
function clamp(value, min, max)
{
    if(value < min) return min;
    if(value > max) return max;
    return value;
}

//------------------------------------------------------------------------------
function wrap_around(value, min, max)
{
    if(is_null_or_undefined(max)) {
        max = min;
        min = 0;
    }
    if(value >= max) {
        return min;
    } else if(value < min) {
        return max - 1;
    }
    return value;
}

//----------------------------------------------------------------------------//
//                                                                            //
// Vector                                                                     //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function add_vec2(a, b)         { return make_vec2(a.x + b.x, a.y - b.y); }
function sub_vec2(a, b)         { return make_vec2(a.x - b.x, a.y - b.y); }
function mul_vec2(vec2, scalar) { return make_vec2(vec2.x * scalar, vec2.y * scalar); }

//------------------------------------------------------------------------------
function copy_vec2(vec2)
{
    return make_vec2(vec2.x, vec2.y);
}

//------------------------------------------------------------------------------
function is_vec2_equal(a, b)
{
    return (a.x == b.x) && (a.y == b.y);
}

//------------------------------------------------------------------------------
function distance_vec2(a, b)
{
    return distance(a.x, a.y, b.x, b.y);
}

//------------------------------------------------------------------------------
function magnitude_vec2(vec2)
{
    return Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
}

//------------------------------------------------------------------------------
function make_vec2(x, y)
{
    const v = {x:0, y:0}

    if(!is_null_or_undefined(x)) {
        v.x = x;
    }
    if(!is_null_or_undefined(y)) {
        v.y = y;
    }

    return v;
}

//------------------------------------------------------------------------------
function make_vec2_unit(vec2)
{
    const len = magnitude_vec2(vec2);
    if(len == 0) {
        return make_vec2();
    }

    return make_vec2(vec2.x / len, vec2.y / len);
}



//----------------------------------------------------------------------------//
//                                                                            //
// String                                                                     //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function str_cat(...args) { return str_join("", ...args); }

//------------------------------------------------------------------------------
function str_join(separator, ...args)
{
    // @perf(string cat): There's a better way to no produce so much garbage???
    let result = "";
    for(let i = 0; i < args.length -1; ++i) {
        result += (args[i] + separator);
    }

    result += args[args.length-1];
    return result;
}


//----------------------------------------------------------------------------//
//                                                                            //
// Easing                                                                     //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function easing_linear_none(k) { return k; }
//------------------------------------------------------------------------------
function easing_quadratic_in    (k) { return k * k;       }
function easing_quadratic_out   (k) { return k * (2 - k); }
function easing_quadratic_in_out(k) {
    if((k *= 2) < 1) { return 0.5 * k * k; }
    return - 0.5 * (--k * (k - 2) - 1);
}
//------------------------------------------------------------------------------
function easing_cubic_in    (k) { return k * k * k;       }
function easing_cubic_out   (k) { return --k * k * k + 1; }
function easing_cubic_in_out(k) {
    if((k *= 2) < 1) { return 0.5 * k * k * k; }
    return 0.5 * ((k -= 2) * k * k + 2);
}
//------------------------------------------------------------------------------
function easing_quartic_in    (k) { return k * k * k * k;         }
function easing_quartic_out   (k) { return 1 - (--k * k * k * k); }
function easing_quartic_in_out(k) {
    if((k *= 2) < 1) { return 0.5 * k * k * k * k; }
    return - 0.5 * ((k -= 2) * k * k * k - 2);
}
//------------------------------------------------------------------------------
function easing_quintic_in    (k) { return k * k * k * k * k;       }
function easing_quintic_out   (k) { return --k * k * k * k * k + 1; }
function easing_quintic_in_out(k) {
    if((k *= 2) < 1) { return 0.5 * k * k * k * k * k; }
    return 0.5 * ((k -= 2) * k * k * k * k + 2);
}
//------------------------------------------------------------------------------
function easing_sinusoidal_in    (k) { return 1 - Math.cos(k * Math.PI / 2);     }
function easing_sinusoidal_out   (k) { return Math.sin(k * Math.PI / 2);         }
function easing_sinusoidal_in_out(k) { return 0.5 * (1 - Math.cos(Math.PI * k)); }
//------------------------------------------------------------------------------
function easing_exponential_in    (k) { return k === 0 ? 0 : Math.pow(1024, k - 1);     }
function easing_exponential_out   (k) { return k === 1 ? 1 : 1 - Math.pow(2, - 10 * k); }
function easing_exponential_in_out(k) {
    if(k === 0) { return 0; }
    if(k === 1) { return 1; }
    if((k *= 2) < 1) { return 0.5 * Math.pow(1024, k - 1); }
    return 0.5 * (- Math.pow(2, - 10 * (k - 1)) + 2);
}
//------------------------------------------------------------------------------
function easing_circular_in    (k) { return 1 - Math.sqrt(1 - k * k); }
function easing_circular_out   (k) { return Math.sqrt(1 - (--k * k)); }
function easing_circular_in_out(k) {
    if((k *= 2) < 1) { return - 0.5 * (Math.sqrt(1 - k * k) - 1); }
    return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
}
//------------------------------------------------------------------------------
function easing_elastic_in(k) {
    if(k === 0) { return 0; }
    if(k === 1) { return 1; }
    return -Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI);
}
function easing_elastic_out(k) {
    if(k === 0) { return 0; }
    if(k === 1) { return 1; }
    return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * 5 * Math.PI) + 1;
}
function easing_elastic_in_out(k) {
    if(k === 0) { return 0; }
    if(k === 1) { return 1; }
    k *= 2;
    if(k < 1) { return -0.5 * Math.pow(2, 10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI); }
    return 0.5 * Math.pow(2, -10 * (k - 1)) * Math.sin((k - 1.1) * 5 * Math.PI) + 1;
}
//------------------------------------------------------------------------------
function easing_back_in(k) {
    var s = 1.70158;
    return k * k * ((s + 1) * k - s);
}
function easing_back_out(k) {
    var s = 1.70158;
    return --k * k * ((s + 1) * k + s) + 1;
}
function easing_back_in_out(k) {
    var s = 1.70158 * 1.525;
    if((k *= 2) < 1) { return 0.5 * (k * k * ((s + 1) * k - s)); }
    return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
}
//------------------------------------------------------------------------------
function easing_bounce_in (k) { return 1 - easing_bounce_out(1 - k); }
function easing_bounce_out(k) {
    if     (k < (1 / 2.75))   { return 7.5625 * k * k;                                }
    else if(k < (2 / 2.75))   { return 7.5625 * (k -= (1.5   / 2.75)) * k + 0.75;     }
    else if(k < (2.5 / 2.75)) { return 7.5625 * (k -= (2.25  / 2.75)) * k + 0.9375;   }
    else                      { return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375; }
}
function easing_bounce_in_out(k) {
    if(k < 0.5) { return easing_bounce_in(k * 2) * 0.5; }
    return easing_bounce_out(k * 2 - 1) * 0.5 + 0.5;
}


//------------------------------------------------------------------------------
const Easings = {
    linear: {
        none: easing_linear_none
    },
    quadratic: {
         in:     easing_quadratic_in,
         out:    easing_quadratic_out,
         in_out: easing_quadratic_in_out,
    },
    cubic: {
        in:     easing_cubic_in,
        out:    easing_cubic_out,
        in_out: easing_cubic_in_out,
    },
    quartic: {
        in:     easing_quartic_in,
        out:    easing_quartic_out,
        in_out: easing_quartic_in_out,
    },
    quintic: {
        in:     easing_quintic_in,
        out:    easing_quintic_out,
        in_out: easing_quintic_in_out,
    },
    sinusoidal: {
        in:     easing_sinusoidal_in,
        out:    easing_sinusoidal_out,
        in_out: easing_sinusoidal_in_out,
    },
    exponential: {
        in:     easing_exponential_in,
        out:    easing_exponential_out,
        in_out: easing_exponential_in_out,
    },
    circular: {
        in:     easing_circular_in,
        out:    easing_circular_out,
        in_out: easing_circular_in_out,
    },
    elastic: {
        in:    easing_elastic_in,
        out:   easing_elastic_out,
        inout: easing_elastic_in_out,
    },
    back: {
         in:     easing_back_in,
         out:    easing_back_out,
         in_out: easing_back_in_out,
    },
    bounce: {
        in:     easing_bounce_in,
        out:    easing_bounce_out,
        in_out: easing_bounce_in_out,
    },
}


//----------------------------------------------------------------------------//
//                                                                            //
// Tween                                                                      //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
function get_all_easings()
{
    const arr = [];

    const mode_keys = Object.keys(Easings);
    for(let i = 0; i < mode_keys.length; ++i) {
        const mode_key = mode_keys[i];
        const mode     = Easings[mode_key];

        const easing_keys = Object.keys(mode);
        for(let j = 0; j < easing_keys.length; ++j) {
            const easing_key = easing_keys[j];
            const easing     = mode[easing_key];
            arr.push(easing);
        }
    }

    return arr;
}

//--------------------------------------------------------------------------
function get_random_easing()
{
    const type = get_random_easing_type();
    const mode = get_random_easing_mode(type);
    return mode;
}

//--------------------------------------------------------------------------
function get_random_easing_type()
{
    const keys = Object.keys(Easings);
    const key  = random_element(keys);
    return Easings[key];
}

//--------------------------------------------------------------------------
function get_random_easing_mode(easing)
{
    const keys = Object.keys(easing);
    const key  = random_element(keys);
    return easing[key];
}


/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/tweenjs/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/tweenjs/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

//-----------------------------------------------------------------------------
class Tween_Group
{
    static _tagged_groups = new Map();
    static _default_group = null;

    //
    // Static Functions
    //

    //--------------------------------------------------------------------------
    static get_tagged_groups()
    {
        return Tween_Group._tagged_groups;
    }

    //--------------------------------------------------------------------------
    static get_group_with_tag(tag)
    {
        let group = Tween_Group._tagged_groups.get(tag);
        if(!group) {
            group = new Tween_Group(tag);
            Tween_Group._tagged_groups.set(tag, group);
        }
        return group;
    }

    //--------------------------------------------------------------------------
    static get_default_tween_group()
    {
        if(!Tween_Group._default_group) {
            Tween_Group._default_group = new Tween_Group("Tween_Group_Default_Group");
            Tween_Group._default_group._remove_on_completion = false;
            Tween_Group._tagged_groups.set(
                Tween_Group._default_group.group_name,
                Tween_Group._default_group
            );
        }

        return Tween_Group._default_group;
    }


    //
    // Constructor
    //

    //--------------------------------------------------------------------------
    constructor(name)
    {
        this.group_name = name;

        this._tweens               = [];
        this._on_complete_callback = null;
        this._started              = false;
        this._completed            = false;

        this._remove_on_completion = true;
    }

    //
    // Callbacks
    //

    //--------------------------------------------------------------------------
    on_complete(callback)
    {
        this._on_complete_callback = callback;
        return this;
    }

    //--------------------------------------------------------------------------
    is_completed() { return this._completed; }

    //--------------------------------------------------------------------------
    get_all() { return this._tweens; }

    //--------------------------------------------------------------------------
    remove_all () { this._tweens = []; }

    //--------------------------------------------------------------------------
    add(tween)
    {
        this._tweens.push(tween);
        this._started   = true;
        this._completed = false;
    }

    //--------------------------------------------------------------------------
    remove(tween)
    {
        const pred = (t)=> {
            return t.get_id() == tween.get_id();
        };

        // @XXX
        luna.Arr.remove_if(this._tweens, pred);
    }

    //--------------------------------------------------------------------------
    update(delta_time = get_delta_time())
    {
        if(this._completed) {
            return;
        }

        let any_tween_is_playing = false;
        for(let i = 0; i < this._tweens.length; ++i) {
            const tween = this._tweens[i];
            if(tween._is_playing) {
                tween.update(delta_time);
                any_tween_is_playing |= tween._is_playing;
            }
        }

        if(!any_tween_is_playing) {
            if(this._started) {
                this._completed = true;
                this._started   = false;

                this.remove_all();

                if(this._on_complete_callback != null) {
                    // debugger;
                    this._on_complete_callback();
                    this._on_complete_callback = null;
                }

                if(this._remove_on_completion && this.group_name) {
                    Tween_Group._tagged_groups.delete(this.group_name);
                }
            }
        }
    }
};

//------------------------------------------------------------------------------
class Tween
{
    //
    // Factory Functions
    //

    //--------------------------------------------------------------------------
    static create(duration, from = {v: 0}, to = {v: 1})
    {
        const tween = new Tween(duration);
        if(!is_null_or_undefined(from)) {
            tween.from(from);
        }
        if(!is_null_or_undefined(to)) {
            tween.to(to);
        }
        return tween;
    }

    //--------------------------------------------------------------------------
    static create_with_tag(duration, tag)
    {
        const group = Tween_Group.get_group_with_tag(tag);
        return Tween.create_with_group(duration, group);
    }

    //--------------------------------------------------------------------------
    static create_with_group(duration, group)
    {
        return new Tween(duration, group);
    }

    //--------------------------------------------------------------------------
    static _next_id()
    {
        if(this.s_next_id == undefined) {
            this.s_next_id = 0;
        }

        return this.s_next_id++;
    }


    //
    // Constructor
    //

    //--------------------------------------------------------------------------
    constructor(duration, group)
    {
        this._object       = null;
        this._ratio        = 0;
        this._values_start = {};
        this._values_end   = {};

        this._delay_time     = 0;
        this._elapsed        = 0;
        this._delay_to_start = 0;
        this._duration       = duration;

        this._repeat            = 0;
        this._repeat_delay_time = undefined;
        this._yoyo              = false;

        this._is_paused  = false;
        this._is_playing = false;
        this._reversed   = false;

        this._easing_function = easing_linear_none;

        this._chained_tweens = [];

        this._on_start_callback_fired = false;
        this._on_start_callback       = null;
        this._on_update_callback      = null;
        this._on_repeat_callback      = null;
        this._on_complete_callback    = null;
        this._on_stop_callback        = null;

        this._group = group || Tween_Group.get_default_tween_group();
        this._id    = Tween._next_id();
    };


    //
    // Getters
    //

    //--------------------------------------------------------------------------
    get_value  () { return this._object;     }
    get_ratio  () { return this._ratio       }
    get_id     () { return this._id;         }
    is_playing () { return this._is_playing; }
    is_paused  () { return this._is_paused;  }


    //
    // Setters
    //

    //--------------------------------------------------------------------------
    from(properties)
    {
        this._object       = properties;
        this._values_start = Object.create(properties);
        return this;
    }

    //--------------------------------------------------------------------------
    to(properties)
    {
        this._values_end = Object.create(properties);
        return this;
    }

    //--------------------------------------------------------------------------
    duration(d)
    {
        this._duration = d;
        return this;
    }

    //--------------------------------------------------------------------------
    group(group)
    {
        this._group = group;
        return this;
    }

    //--------------------------------------------------------------------------
    delay(amount)
    {
        this._delay_time     = amount;
        this._delay_to_start = amount;

        return this;
    }

    //--------------------------------------------------------------------------
    repeat(times)
    {
        this._repeat = times;
        return this;
    }

    //--------------------------------------------------------------------------
    repeat_delay(amount)
    {
        this._repeat_delay_time = amount;
        return this;
    }

    //--------------------------------------------------------------------------
    yoyo(yoyo)
    {
        this._yoyo = yoyo;
        return this;
    }

    //--------------------------------------------------------------------------
    easing(easing_function)
    {
        this._easing_function = easing_function;
        return this;
    }

    //--------------------------------------------------------------------------
    chain()
    {
        this._chained_tweens = arguments;
        return this;
    }

    //
    // Actions
    //

    //--------------------------------------------------------------------------
    start()
    {
        this._group.add(this);

        this._is_playing              = true;
        this._is_paused               = false;
        this._reversed                = false;
        this._on_start_callback_fired = false;
        this._elapsed                 = 0;

        for(var property in this._values_end) {
            // Check if an Array was provided as property value
            if(this._values_end[property] instanceof Array) {
                if(this._values_end[property].length === 0) {
                    continue;
                }
                // Create a local copy of the Array with the start value at the front
                this._values_end[property] = [this._object[property]].concat(this._values_end[property]);
            }
            // If `to()` specifies a property that doesn't exist in the source object,
            // we should not set that property in the object
            if(this._object[property] === undefined) {
                continue;
            }
            // Save the starting value, but only once.
            if(typeof(this._values_start[property]) === 'undefined') {
                this._values_start[property] = this._object[property];
            }
            if((this._values_start[property] instanceof Array) === false) {
                this._values_start[property] *= 1.0; // Ensures we're using numbers, not strings
            }
        }

        return this;
    }

    //--------------------------------------------------------------------------
    update(delta_time = get_delta_time())
    {
        if(!this._is_playing) {
            return;
        }

        this._delay_to_start -= delta_time;
        if(this._delay_to_start > 0) {
            return;
        }

        var property;
        var value;

        if(this._on_start_callback_fired === false) {
            if(this._on_start_callback !== null) {
                this._on_start_callback(this._object);
            }
            this._on_start_callback_fired = true;
        }

        this._elapsed += delta_time;
        this._ratio    = (this._elapsed / this._duration);

        let ratio_value = this._ratio;
        if(this._reversed) {
            ratio_value = 1 - this._ratio;
        }

        value = this._easing_function(ratio_value);
        for(property in this._values_end) {
            // Don't update properties that do not exist in the source object
            if(this._values_start[property] === undefined) {
                continue;
            }

            var start = this._values_start[property];
            var end   = this._values_end  [property];

            if(end instanceof Array) {
                this._object[property] = this._interpolation(end, value);
            } else {
                // Parses relative end values with start as base (e.g.: +10, -3)
                if(typeof (end) === 'string') {
                    if(end.charAt(0) === '+' || end.charAt(0) === '-') {
                        end = start + parseFloat(end);
                    } else {
                        end = parseFloat(end);
                    }
                }

                // Protect against non numeric properties.
                if(typeof (end) === 'number') {
                    this._object[property] = start + (end - start) * value;
                }
            }
        }

        if(this._on_update_callback !== null) {
            this._on_update_callback(this._object, delta_time);
        }

        if(this._ratio >= 1) {
            if(this._repeat > 0) {
                this._elapsed = 0;

                if(isFinite(this._repeat)) {
                    this._repeat--;
                }

                if(this._yoyo) {
                    this._reversed = !this._reversed;
                }

                if(this._repeat_delay_time !== undefined) {
                    this._delay_to_start = this._repeat_delay_time;
                } else {
                    this._delay_to_start = this._delay_time;
                }

                if(this._on_repeat_callback !== null) {
                    this._on_repeat_callback(this._object);
                }

                return;
            } else {

                if(this._on_complete_callback !== null) {
                    this._on_complete_callback(this._object);
                }

                this._is_playing = false;
                for(var i = 0, numChainedTweens = this._chained_tweens.length; i < numChainedTweens; i++) {
                    // Make the chained tweens start exactly at the time they should,
                    // even if the `update()` method was called way past the duration of the tween
                    this._chained_tweens[i].start(this._duration);
                }
                return;
            }
        }
        return;
    }

    //--------------------------------------------------------------------------
    stop()
    {
        if(!this._is_playing) {
            return this;
        }

        this._group.remove(this);

        this._is_playing = false;
        this._is_paused  = false;

        if(this._on_stop_callback !== null) {
            this._on_stop_callback(this._object);
        }

        this.stop_chained_tweens();
        return this;
    }

    //--------------------------------------------------------------------------
    end()
    {
        this.update(Infinity);
        return this;
    }

    //--------------------------------------------------------------------------
    stop_chained_tweens()
    {
       for(var i = 0, numChainedTweens = this._chained_tweens.length; i < numChainedTweens; i++) {
            this._chained_tweens[i].stop();
        }
    }


    //
    // Callbacks
    //

    //--------------------------------------------------------------------------
    on_group_completed(callback)
    {
        // @XXX(stdmatt): Hacky... 8/3/2021, 7:06:21 AM
        if(!this._group._on_complete_callback) {
            this._group._on_complete_callback =  callback;
        }
        return this;
    }

    //--------------------------------------------------------------------------
    on_start(callback)
    {
        this._on_start_callback = callback;
        return this;
    }

    //--------------------------------------------------------------------------
    on_update(callback)
    {
        this._on_update_callback = callback;
        return this;
    }

    //--------------------------------------------------------------------------
    on_repeat(callback)
    {
        this._on_repeat_callback = callback;
        return this;
    }

    //--------------------------------------------------------------------------
    on_complete(callback)
    {
        this._on_complete_callback = callback;
        return this;
    }

    //--------------------------------------------------------------------------
    on_stop(callback)
    {
        this._on_stop_callback = callback;
        return this;
    }

    //
    // Private
    //

    //--------------------------------------------------------------------------
	_interpolation(v, k)
    {
        const m = v.length - 1;
        const f = m * k;
        const i = Math.floor(f);
        const fn = lerp;

        if (k < 0) { return fn(v[0], v[1], f);         }
        if (k > 1) { return fn(v[m], v[m - 1], m - f); }
        return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
    }
}


//----------------------------------------------------------------------------//
//                                                                            //
// Gif                                                                        //
//                                                                            //
//----------------------------------------------------------------------------//
//------------------------------------------------------------------------------
let __gif              = null;
let __is_recording_gif = false;
let __gif_FPS          = 0;                     // in frames
let __gif_duration_s   = 0;                    // in seconds
let __gif_delay_ms     = 0;
//------------------------------------------------------------------------------
function gif_is_recording()
{
    return __gif && __is_recording_gif && __gif_duration_s > 0;
}

//------------------------------------------------------------------------------
function gif_setup_listeners()
{
    window.addEventListener('keydown', (event) => {
        if(event.shiftKey && event.code == "F1") {  // shift+F1
            gif_create();
        }
    });
}

//------------------------------------------------------------------------------
function gif_create()
{
    if(__gif) {
        error_log("Gif is already created");
    }

    __gif = new GIF({
        workers:      5,
        quality:      10,
        width:        get_canvas_width (),
        height:       get_canvas_height(),
        workerScript: "/modules/demolib/modules/external/gif.js/gif.worker.js",
    });

    {
        __gif.dom = document.createElement('div');
        __gif.dom.innerHTML = `
            <div class="gif-recorder-container">
                <div>
                    <span>Gif</span>
                </div>

                <div>
                    <span>Duration</span>
                    <input id="gifDuration" type="text" value="5" size="2"/>
                </div>

                <div>
                    <span>FPS</span>
                    <input id="gifFPS" type="text" value="60" size="2"/>
                </div>

                <div>
                    <button id="gifButton" onclick="gif_start_record()">Record</button>
                </div>
            </div>
        `;

        document.body.appendChild(__gif.dom);
    }
}

//------------------------------------------------------------------------------
function gif_start_record(duration, fps)
{
    if(!__gif) {
        error_log("Gif must be created");
    }

    // Get the values of the duration and fps from the inputs... (if available)
    if(!duration) {
        const input = document.getElementById("gifDuration");
        if(!input) {
            error_log("Missing gifDuration input");
        }

        duration = input.value;
    }

    if(!fps) {
        const input = document.getElementById("gifFPS");
        if(!input) {
            error_log("Missing gifFPS input");
        }

        fps = input.value;
    }

    // Change the Button
    const button = document.getElementById("gifButton");
    if(button) {
        button.innerHTML = "Recording...";
        button.disabled  = true;
    }

    //
    __is_recording_gif = true;
    __gif_FPS          = fps;
    __gif_duration_s   = duration;
    __gif_delay_ms     = (1 / __gif_FPS) * 1000; // in milliseconds
}

//------------------------------------------------------------------------------
function gif_stop_record()
{
    if(!__gif) {
        error_log("Gif must be created");
    }

    __is_recording_gif = false;


    // Change the Button
    const button = document.getElementById("gifButton");
    if(button) {
        button.innerHTML = "Export";
        button.disabled  = false;

        button.onclick = ()=> {
            button.innerHTML = "Exporting...";
            button.disabled  = false;

            gif_save();
        }
    }
}

//------------------------------------------------------------------------------
function gif_save()
{
    if(!__gif) {
        error_log("Gif must be created");
    }

    __gif.on("finished", function(blob) {
        verbose_log("Gif finished");
        window.open(URL.createObjectURL(blob));

        document.body.removeChild(__gif.dom);
        __gif = null;
    });

    __gif.render();
}

/*

//------------------------------------------------------------------------------
function Canvas_Resize(width, height)
{
    width  = Math_Int(width);
    height = Math_Int(height);

    __canvas.width  = width;
    __canvas.height = height;

    MainContext.width  = width;
    MainContext.height = height;

    Canvas_Width  = width;
    Canvas_Height = height;

    Canvas_Half_Width  = Math_Int(Canvas_Width  / 2);
    Canvas_Half_Height = Math_Int(Canvas_Height / 2);

    Canvas_Edge_Left    = -Canvas_Half_Width;
    Canvas_Edge_Right   = +Canvas_Half_Width;
    Canvas_Edge_Top     = -Canvas_Half_Height;
    Canvas_Edge_Bottom  = +Canvas_Half_Height;

    Canvas_Translate(Canvas_Half_Width, Canvas_Half_Height);
}

//------------------------------------------------------------------------------
function Canvas_CreateCanvas(width, height, parentElement)
{
    __canvas      = document.createElement("canvas");
    MainContext = __canvas.getContext('2d');
    Canvas_SetRenderTarget(MainContext);
    Canvas_Resize(width, height);

    if(!Utils_IsNullOrUndefined(parentElement)) {
        parentElement.appendChild(__canvas)
    } else {
        document.appendChild(__canvas)
    }
}

//------------------------------------------------------------------------------
function Canvas_GetFromHtml(canvasId)
{
    __canvas      = document.getElementById(canvasId);
    MainContext = __canvas.getContext('2d');

    Canvas_SetRenderTarget(MainContext);
    Canvas_Resize(__canvas.width, __canvas.height);
}


//------------------------------------------------------------------------------
function Canvas_SetRenderTarget(renderTarget)
{
    if(renderTarget == null) {
        renderTarget = MainContext;
    }

    __context = renderTarget;
}


//------------------------------------------------------------------------------
function Canvas_ClearWindow(color)
{
}


//------------------------------------------------------------------------------
function Canvas_Push()
{
    __context.save();
}

//------------------------------------------------------------------------------
function Canvas_Pop()
{
    __context.restore();
}

//------------------------------------------------------------------------------
function Canvas_SetOrigin(x, y)
{
    Canvas_Translate(x, y);
}

//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
function Canvas_Rotate(a)
{
    __context.rotate(a);
}

//------------------------------------------------------------------------------
function Canvas_Scale(x, y)
{
    if(y == undefined || y == null) {
        y = x;
    }
    __context.scale(x, y);
}


//------------------------------------------------------------------------------
function Canvas_SetFillStyle(style)
{
    __context.fillStyle = style;
}

//------------------------------------------------------------------------------
function Canvas_SetStrokeStyle(style)
{
    __context.strokeStyle = style;
}

function Canvas_SetStrokeSize(size)
{
    __context.lineWidth = size;
}






//------------------------------------------------------------------------------
function Canvas_FillShape(vertices, closed)
{
    __context.beginPath();
        __context.moveTo(vertices[0], vertices[1]);
        for(let i = 2; i < vertices.length-1; i += 2) {
            __context.lineTo(vertices[i], vertices[i+1]);
        }

        if(closed != undefined && closed) {
            __context.lineTo(vertices[0], vertices[1]);
        }
    __context.closePath();
    __context.fill();
}

//------------------------------------------------------------------------------
function Canvas_DrawTriangle(x1, y1, x2, y2, x3, y3)
{
    Canvas_DrawShape([x1, y1, x2, y2, x3, y3], true);
}

//------------------------------------------------------------------------------
function Canvas_DrawCircle(x, y, r)
{
    Canvas_DrawArc(x, y, r, 0, MATH_2PI);
}


//------------------------------------------------------------------------------
function Canvas_DrawShape(vertices, closed)
{
    __context.beginPath();
        __context.moveTo(vertices[0], vertices[1]);
        for(let i = 2; i < vertices.length-1; i += 2) {
            __context.lineTo(vertices[i], vertices[i+1]);
        }

        if(closed != undefined && closed) {
            __context.lineTo(vertices[0], vertices[1]);
        }
    __context.closePath();
    __context.stroke();
}

function Canvas_DrawRoundedRect(x, y, w, h, r)
{
    __context.beginPath();
        __context.moveTo(x + r, y);
        __context.lineTo(x + w - r, y);
        __context.quadraticCurveTo(x + w, y, x + w, y + r);
        __context.lineTo(x + w, y + h - r);
        __context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        __context.lineTo(x + r, y + h);
        __context.quadraticCurveTo(x, y + h, x, y + h - r);
        __context.lineTo(x, y + r);
        __context.quadraticCurveTo(x, y, x + r, y);
    __context.closePath();
    __context.stroke();
}

function Canvas_FillRoundedRect(x, y, w, h, r)
{
    __context.beginPath();
        __context.moveTo(x + r, y);
        __context.lineTo(x + w - r, y);
        __context.quadraticCurveTo(x + w, y, x + w, y + r);
        __context.lineTo(x + w, y + h - r);
        __context.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        __context.lineTo(x + r, y + h);
        __context.quadraticCurveTo(x, y + h, x, y + h - r);
        __context.lineTo(x, y + r);
        __context.quadraticCurveTo(x, y, x + r, y);
    __context.closePath();
    __context.fill();
}

//------------------------------------------------------------------------------
function Canvas_DrawRect(x, y, w, h)
{
    __context.beginPath();
        __context.rect(x, y, w, h);
    __context.closePath();
    __context.stroke();
}


//------------------------------------------------------------------------------
let _Canvas_ImageData = null;
function Canvas_LockPixels()
{
    if(_Canvas_ImageData != null) {
        return;
    }

    _Canvas_ImageData = __context.getImageData(0, 0, Canvas_Width, Canvas_Height);
}

//------------------------------------------------------------------------------
function Canvas_UnlockPixels()
{
    if(_Canvas_ImageData == null) {
        return;
    }

    __context.putImageData(_Canvas_ImageData, 0, 0);
    _Canvas_ImageData = null;
}

//------------------------------------------------------------------------------
function Canvas_SetColor(x, y, color)
{
    // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
    function get_pixel_index(x, y, width) {
        let red = y * (width * 4) + x * 4;
        return [red, red + 1, red + 2, red + 3];
    }

    let indices = get_pixel_index(x, y, Canvas_Width);

    _Canvas_ImageData.data[indices[0]] = color[0];
    _Canvas_ImageData.data[indices[1]] = color[1];
    _Canvas_ImageData.data[indices[2]] = color[2];
    _Canvas_ImageData.data[indices[3]] = color[3];
}

//------------------------------------------------------------------------------
function Canvas_RenderTextAt(x, y, str, fontSize, fontName, centered = false)
{
    // debugger;
    if(!Utils_IsNullOrUndefined(fontSize) &&
       !Utils_IsNullOrUndefined(fontName))
    {
        let name = String_Cat(fontSize, "px ", fontName)
        __context.font = name;
    }

    let width  = __context.measureText(str).width;
    let height = parseInt(__context.font);

    if(!centered) {
        // Canvas_SetFillStyle("red");
        // Canvas_FillRect(x, y, width, height);
        // Canvas_SetFillStyle("white");

        __context.fillText(str, x, y + height);
    } else {
        // Canvas_SetFillStyle("red");
        // Canvas_FillRect(
        //     x + width - width / 4,
        //     y + height / 4,
        //     width, height
        // );
        // Canvas_SetFillStyle("white");

        __context.fillText(
            str,
            x + width - width / 4,
            y + height + height / 4
        );
    }
        // x + width,
        // y + height);//x + (width / 2), y + (height / 2));
}
*/
