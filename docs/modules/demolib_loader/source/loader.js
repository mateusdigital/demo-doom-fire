//------------------------------------------------------------------------------
function demolib_load_script(filename, path_prefix = "./") {
    const url = (path_prefix + filename).replace("//","/");

    return new Promise((resolve, reject)=> {
        const last_dot  = filename.lastIndexOf(".");
        const extension = filename.substring(last_dot);

        let elem = null;
        if(extension == ".js") {
            elem = document.createElement("script");
            elem.src = url;
        } else if(extension == ".css") {
            elem = document.createElement("link");
            elem.rel = "stylesheet";
            elem.href= url
        }

        elem.addEventListener("load", ()=> {
            console.log("Loaded:", url);
            resolve(true);
        });

        console.log("Loading:", url);
        document.head.appendChild(elem);
    });
}

//------------------------------------------------------------------------------
async function demolib_load_all_scripts(script_filenames, path_prefix) {
    const promises = [];
    for(let i = 0; i < script_filenames.length; ++i) {
        const filename = script_filenames[i];
        const promise  = demolib_load_script(filename, path_prefix);
        promises.push(promise);
    }

    const result = await Promise.all(promises);
    return result;
};
