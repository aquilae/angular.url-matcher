
MODULE('patternParser', ['util'], function ($u) {
    "use strict";

    var rxToken = /(.*?)\{(.+?)\}/g;
    return function patternParser(pattern) {
        var match, build,
            floating = pattern.floating,
            prefix = pattern.prefix,
            suffix = pattern.suffix,
            body = pattern.body,
            regexps = [],
            tokens = [],
            token = {},
            tokenCount,
            m,
            tprefix = '',
            tbody = '',
            pos = 0,
            regexp;

        if (body) {
            while (m = rxToken.exec(body)) {
                tprefix = m[1] || '';
                tbody = m[2];

                if (!tbody) {
                    throw 'empty token in pattern "' + body + '"';
                }

                pos = tbody.indexOf('=');
                if (pos < 0) {
                    token = { prefix: tprefix, name: tbody, optional: false };
                    regexps.push('(' + $u.rx.quote(tprefix) + '(.+?))');
                }
                else {
                    token = {
                        prefix: tprefix,
                        name: tbody.substr(0, pos),
                        optional: tbody.substr(pos + 1)
                    };
                    regexps.push('(' + $u.rx.quote(tprefix) + '(.+?))?');
                }

                tokens.push(token);
            }

            tokenCount = tokens.length;

            regexp = new RegExp(
                (floating ? '' : '^')
                    + $u.rx.quote(prefix)
                    + regexps.join('')
                    + $u.rx.quote(suffix)
                    + '(/|$)',
                'i'
            );

            match = function match(url) {
                var match = regexp.exec(url);
                if (!match) { return false; }

                var values = {};
                for (var i = 0, ii = tokenCount, j = 2; i < ii; ++i, j += 2) {
                    var token = tokens[i],
                        name = token.name,
                        optional = token.optional,
                        value = match[j];

                    if (optional === false) {
                        if (value) {
                            values[name] = value;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        values[name] = value || optional;
                    }
                }
                return values;
            };

            build = function (values) {
                return (
                    prefix + tokens.map(function (token) {
                        return (
                            token.prefix +
                            values[token.name] ||
                                token.optional || ''
                        );
                    }).join('') + suffix
                );
            };
        }
        else {
            build = function build() { return prefix; };
            match = (floating
                ? function match(url) { return url.indexOf(prefix) < 0 ? false : {}; }
                : function match(url) { return url.indexOf(prefix) === 0 ? {}: false; }
            );
        }
        return { match: match, build: build };
    };
});
