"use strict";

const os = require("os");

const fs = require("fs");
const execAsync = require("./execAsync");

function throwNotSupportedError() {
    throw new Error("Platform not supported");
}

const svgToImage = (content, path, options = {}) => {
    if (!content) throw "No content specified";
    if (typeof content !== "string") throw "Invalid content name";

    const args = [];

    if (content) {
        args.push("--content=" + content);
    }

    if (path) {
        args.push("--path=" + path);
    }

    console.log(args.toString());

    if (os.platform() === "win32") {
        return execAsync("svgToImage-win.exe ", args);
    } else if(os.platform() === "darwin") {
        return execAsync("svgToImage-macos ", args);
    } else {
        throwNotSupportedError()
    }
}

module.exports = svgToImage;