"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HTML_PATH = exports.PACKAGE_ROOT = void 0;
const path_1 = require("path");
// 根路径
exports.PACKAGE_ROOT = (0, path_1.join)(__dirname, "..", "..", "..");
// 模版
exports.DEFAULT_HTML_PATH = (0, path_1.join)(exports.PACKAGE_ROOT, "template.html");
