
MODULE('patternExploder', ['util'], function ($u) {
    "use strict";

    return function patternExploder(pattern) {
        var floating = pattern[0] === '*';
        pattern = $u.url.normalize(floating ? pattern.substr(1) : pattern);

        var pos = {},
            plen = pattern.length,
            op = pattern.indexOf('{');

        if (op < 0) {
            pos = { pp: plen, sp: plen };
        }
        else {
            var pp = pattern.lastIndexOf('/', op) + 1,
                cp = pattern.lastIndexOf('{'),
                sp = pattern.indexOf(cp, '/');

            pos = { pp: pp, sp: sp < 0 ? plen : sp };
        }

        return {
            floating: floating,
            prefix: pattern.substr(0, pos.pp),
            suffix: pattern.substr(pos.sp),
            body: pattern.substring(pos.pp, pos.sp)
        };
    };
});
