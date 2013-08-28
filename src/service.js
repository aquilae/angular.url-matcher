
MODULE(
    'service',
    ['patternExploder', 'patternParser'],
    function (patternExploder, patternParser) {
        "use strict";

        return function $urlMatcherService($injector, $document, $rootScope) {
            this._document = $document[0];
            this._map = [];
            this._lastUrl = '';
            this.map = function map(pattern, success, fail, config) {
                var exploded = patternExploder(pattern),
                    parsed = patternParser(exploded),
                    item = { _match: parsed.match, build: parsed.build, success: success, fail: fail };

                if (typeof (config) === 'function') {
                    config(item);
                }

                this._map.push(item);
                this.rematch();
                return this;
            };
            this.rematch = function rematch() {
                $rootScope.$evalAsync(function () {
                    this._match(this._url());
                }.bind(this));
            };
            this._url = function _url() {
                var a = this._document.createElement('A');
                a.href = this._document.URL;
                if (typeof (a.hash) === 'string') {
                    if (a.length > 2 && a[1] === '/') {
                        return a.hash.substr(1);
                    }
                    if (a.length > 3 && a[1] === '!' && a[2] === '#') {
                        return a.hash.substr(2);
                    }
                }
                return a.pathname + a.search;
            };
            this._match = function _match(url) {
                if (url === this._lastUrl) { return; }
                this._lastUrl = url;

                var fns = [];
                for (var i = 0, ii = this._map.length; i < ii; ++i) {
                    var item = this._map[i],
                        values = item._match(url);

                    if (values) {
                        if (item.success) {
                            (function (values, build, success) {
                                fns.push(function () {
                                    $injector.invoke(success, this, {'$tokens': values, '$build': build});
                                });
                            })(values, item.build, item.success);
                        }
                    }
                    else if (item.fail) {
                        (function (build, fail) {
                            fns.push(function () {
                                $injector.invoke(fail, this, {'$build': build});
                            });
                        })(item.build, item.fail);
                    }
                }
                if (fns.length > 0) {
                    var invoke = function (scope, fns, url, $url) {
                        scope.$evalAsync(function () {
                            if ($url().indexOf(url) === 0) {
                                var fn = fns.pop();
                                if (fn) {
                                    invoke(scope, fns, url, $url);
                                    fn();
                                }
                            }
                        });
                    };
                    invoke($rootScope, fns, url, this._url.bind(this));
                }
            };
        };
    }
);
