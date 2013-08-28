
MODULE('provider', ['angular', 'service'], function (angular, $urlMatcherService) {
    "use strict";

    var module = angular.module('aq.urlMatcher', []);

    module.provider('$urlMatcher', function $urlMatcherProvider() {
        var rematchOn = ['$locationChangeSuccess'];
        this.rematchOn = {
            add: function add(eventName) { rematchOn.push(eventName); },
            view: function view() { return [].concat(rematchOn); }
        };
        this.$get = [
            '$injector', '$document', '$rootScope',
            function $get($injector, $document, $rootScope) {
                var service = new $urlMatcherService($injector, $document, $rootScope);
                rematchOn.forEach(function (eventName) {
                    $rootScope.$on(eventName, service.rematch.bind(service));
                });
                return service;
            }
        ];
    });
});
