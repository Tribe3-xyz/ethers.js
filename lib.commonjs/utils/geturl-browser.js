"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrl = void 0;
const errors_js_1 = require("./errors.js");
// @TODO: timeout is completely ignored; start a Promise.any with a reject?
async function getUrl(req, _signal) {
    const protocol = req.url.split(":")[0].toLowerCase();
    (0, errors_js_1.assert)(protocol === "http" || protocol === "https", `unsupported protocol ${protocol}`, "UNSUPPORTED_OPERATION", {
        info: { protocol },
        operation: "request"
    });
    (0, errors_js_1.assert)(!req.credentials || req.allowInsecureAuthentication, "insecure authorized connections unsupported", "UNSUPPORTED_OPERATION", {
        operation: "request"
    });
    let signal = undefined;
    if (_signal) {
        const controller = new AbortController();
        signal = controller.signal;
        _signal.addListener(() => { controller.abort(); });
    }
    const init = {
        method: req.method,
        headers: new Headers(Array.from(req)),
        body: req.body || undefined,
        signal
    };
    const resp = await fetch(req.url, init);
    const headers = {};
    resp.headers.forEach((value, key) => {
        headers[key.toLowerCase()] = value;
    });
    const respBody = await resp.arrayBuffer();
    const body = (respBody == null) ? null : new Uint8Array(respBody);
    return {
        statusCode: resp.status,
        statusMessage: resp.statusText,
        headers, body
    };
}
exports.getUrl = getUrl;
//# sourceMappingURL=geturl-browser.js.map