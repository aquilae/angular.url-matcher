
MODULE('util', [], function () {
    "use strict";

    var rxUrlTrim = /^\/+|\/+$/g,
        rxUrlRepl = /\/+/g,
        rxRxQuote = /([\.\?\*\+\^\$\[\]\\\(\)\{\}\|\-])/g;

    return {
        url: {
            normalize: function normalize(url) {
                return '/' + url.replace(rxUrlTrim, '').replace(rxUrlRepl, '/');
            }
        },
        rx: {
            quote: function quote(str) {
                return str.replace(rxRxQuote, '\\$1');
            }
        }
    }
});
