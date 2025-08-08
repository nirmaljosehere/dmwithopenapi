function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}
const WID_L = "1200";
const WID_M = "600";
const WID_S = "400";
const WID_XS = "300";
const WID_XXS = "200";
const WID_XXXS = "100";

const SMARTCROP_SQUARE = ":11square";
const SMARTCROP_16_9 = ":169banner";
const SMARTCROP_5_4 = ":54vert";
const SMARTCROP_NONE = "";
const LOGO =
    "&layer=1&src=WKND-TRVL-travel-license-plate-euro-style&sizen=0.2,0.2&originn=0.5,-0.5&posn=0.48,-0.48";

const RESET = {
    type: "square",
    presets: {
        default: `fmt=jpeg&qlt=80&op_sharpen=1&resMode=sharp2`,
        bw: `fmt=jpeg,gray&qlt=80&op_sharpen=1&resMode=sharp2`,
        sepia: `fmt=jpeg&qlt=80&op_sharpen=1&resMode=sharp2&op_colorize=704214`,
    },
    preset: "default",
    background:
        ' background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://adobe.scene7.com/is/image/ADBE/lavabg?wid=2400");',
    width: WID_S,
    smartcrop: SMARTCROP_NONE,
    showlogo: false,
};

// clone the RESET object
const config = JSON.parse(JSON.stringify(RESET));

// function to store a config object in local storage
function storeConfig(config) {
    localStorage.setItem("config", JSON.stringify(config));
    // Reload the page
    location.reload();
}

// function to retrieve a config object from local storage
function getConfig() {
    return JSON.parse(localStorage.getItem("config"));
}

// function to remove a config object from local storage
function removeConfig() {
    localStorage.removeItem("config");
}

// function to check if a config object exists in local storage
function hasConfig() {
    return !!localStorage.getItem("config");
}

function applyPreset(url, preset) {
    // get the preset from the config object
    let queryString = `${config.presets[config.preset]}`;
    if (config.smartcrop === SMARTCROP_NONE) {
        queryString = queryString.concat(`&wid=${config.width}`);
    }
    if (config.showlogo) {
        queryString = queryString.concat(LOGO);
    }
    //  queryString = `${config.presets[config.preset]}&wid=${config.width}`;
    const urlObj = new URL(url);
    // set the search params of the URL object to include the preset

    urlObj.pathname = urlObj.pathname.concat(config.smartcrop);
    urlObj.search = queryString;

    // Select the element
    const element = document.querySelector(".grid-container");
    element.style.gridTemplateColumns = `repeat(auto-fill, minmax(${config.width}px, 1fr))`;
    document.body.style.background = config.background;

    return urlObj.toString();
}

export default function decorate(block) {
    // check if a config object exists in local storage
    if (hasConfig()) {
        // if it does, retrieve the config object
        const storedConfig = getConfig();
        // merge the stored config object with the default config object's properties
        Object.assign(config, storedConfig);
    } else {
        // if a config object does not exist, store the default config object in local storage
        storeConfig(config);
    }

    function addButton(text, clickHandler) {
        const button = document.createElement("button");
        // add an id to the button
        button.id = `gallery-button-${text}`;
        button.classList.add("gallery-button");
        button.textContent = text;
        button.addEventListener("click", clickHandler);
        controls.appendChild(button);
    }

    function setPreset(preset) {
        // change the preset
        config.preset = preset;
        // store the updated config object in local storage
        storeConfig(config);
    }

    const cols = [...block.firstElementChild.children];
    // block.classList.add(`columns-${cols.length}-cols`);

    // controls
    const controls = document.createElement("div");
    controls.classList.add("controls");
    block.appendChild(controls);
    // // add a button to the controls
    // const button = document.createElement("button");
    // button.textContent = "bw";
    // button.addEventListener("click", () => {
    //   // change the preset
    //   config.preset = "bw";
    //   // store the updated config object in local storage
    //   storeConfig(config);
    //   // // apply the preset to the images
    //   // applyPreset(block, config.preset);
    // });
    // // append the button to the controls
    // controls.appendChild(button);


    addButton("S", () => {
        config.width = WID_S;
        storeConfig(config);
    });
    addButton("M", () => {
        config.width = WID_M;
        storeConfig(config);
    });
    addButton("L", () => {
        config.width = WID_L;
        storeConfig(config);
    });
    addButton("square", () => {
        config.smartcrop = SMARTCROP_SQUARE;
        storeConfig(config);
    });
    addButton("landscape", () => {
        config.smartcrop = SMARTCROP_16_9;
        storeConfig(config);
    });
    addButton("portrait", () => {
        config.smartcrop = SMARTCROP_5_4;
        storeConfig(config);
    });
    addButton("crop: off", () => {
        config.smartcrop = SMARTCROP_NONE;
        storeConfig(config);
    });

    addButton("color", () => {
        config.preset = "default";
        storeConfig(config);
    });
    addButton("b/w", () => {
        config.preset = "bw";
        storeConfig(config);
    });
    addButton("sepia", () => {
        config.preset = "sepia";
        storeConfig(config);
    });
    addButton("black", () => {
        config.background = "black";
        storeConfig(config);
    });
    addButton("white", () => {
        config.background = "white";
        storeConfig(config);
    });
    addButton("gray", () => {
        config.background = "gray";
        storeConfig(config);
    });
    addButton("RESET", () => {
        storeConfig(RESET);
    });
    addButton("logo", () => {
        config.showlogo = !config.showlogo;
        storeConfig(config);
    });

    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid-container");
    block.appendChild(gridContainer);

    // setup image columns
    [...block.children].forEach((row) => {
        [...row.children].forEach((col) => {
            let urlStr = col.textContent.trim();
            if (isValidURL(urlStr)) {
                const picWrapper = col.closest("div");
                if (picWrapper && picWrapper.children.length === 0) {
                    col.textContent = "";
                    // picture is only content in column
                    // append img to picWrapper
                    // Create a new img element
                    picWrapper.classList.add("grid-item");
                    const imgElement = document.createElement("img");
                    imgElement.id = "gallery-img";

                    // Set the src attribute to the desired image URL

                    imgElement.src = applyPreset(urlStr, config.preset);

                    // Optionally, set other attributes like width, height, alt text, etc.
                    imgElement.alt = "Dynamic Image";
                    imgElement.title = imgElement.src;
                    // imgElement.width = 600; // Set the width of the image
                    // imgElement.height = 400; // Set the height of the image
                    col.appendChild(imgElement);

                    picWrapper.appendChild(imgElement);
                    gridContainer.appendChild(picWrapper);
                    // picWrapper.classList.add("grid-item");
                }
            }
        });
    });
}