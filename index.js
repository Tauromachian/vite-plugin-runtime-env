"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = runtimeEnv;
function runtimeEnv(config) {
    var _a, _b, _c;
    config = {
        jsFileName: (_a = config === null || config === void 0 ? void 0 : config.jsFileName) !== null && _a !== void 0 ? _a : "env",
        globalObjectName: (_b = config === null || config === void 0 ? void 0 : config.globalObjectName) !== null && _b !== void 0 ? _b : "env",
        injectScript: (_c = config === null || config === void 0 ? void 0 : config.injectScript) !== null && _c !== void 0 ? _c : true,
    };
    return {
        name: "runtime-env",
        transform: function (code) {
            var newCode = code.replace(/import\.meta\.env/g, "window.".concat(config.globalObjectName));
            return newCode;
        },
        transformIndexHtml: function () {
            if (!config.injectScript)
                return;
            var script = "import envVars from '\"".concat(config.jsFileName, ".js\"; window.").concat(config.globalObjectName, " = { ...window.").concat(config.globalObjectName, ", ...envVars }");
            return [
                {
                    tag: "script",
                    attrs: {
                        type: "module",
                    },
                    children: script,
                    injectTo: "head",
                },
            ];
        },
    };
}
