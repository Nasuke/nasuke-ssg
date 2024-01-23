"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
// 版本号 
const version = require("../../package.json").version;
const cli = (0, cac_1.cac)("nasuke").version(version).help();
cli
    .command("[root]", "start dev server")
    .alias("dev")
    .action(async (root) => {
    console.log("dev", root);
});
cli
    .command("build [root]", "build for production")
    .action(async (root) => {
    console.log("build", root);
});
cli.parse();
