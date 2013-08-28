
module.exports = function (grunt) {
    'use strict';

    var $path = require('path');
    grunt.registerMultiTask('build-modules', 'Builds modules into library', function () {
        var options = this.options({
                path: 'src',
                modules: [],
                target: 'dist/modules.js'
            }),
            path = options.path,
            modules = options.modules,
            target = options.target,
            texts = [];

        modules.forEach(function (module) {
            var text = grunt.file.read($path.join(path, module)).trim();
            if (text[text.length - 1] === ';') {
                text = text.substr(0, text.length - 1).trim();
            }
            texts.push(text + '(injections, exports);');
        });

        grunt.file.write(target, texts.join('\n\n'));
    });
};
