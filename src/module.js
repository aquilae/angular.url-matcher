
var MODULE = function MODULE(name, expects, body) {
    return function (injections, exports) {
        var args = [];
        for (var i = 0, len = expects.length; i < len; ++i) {
            var injection = expects[i];
            if (!injections.hasOwnProperty(injection)) {
                throw '[' + name + '] No injection supplied: ' + injection;
            }
            args.push(injections[injection]);
        }
        args.push(exports);
        var result = body.apply(this, args);
        if (typeof (result) !== 'undefined') {
            injections[name] = result;
        }
        return result;
    };
};
