
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadTasks('grunt-tasks');

    grunt.renameTask('build-modules', 'modules');

    grunt.registerTask('build', ['modules', 'concat', 'uglify']);
    grunt.registerTask('default', ['build']);

    grunt.initConfig({
        'modules': {
            all: {
                options: {
                    path: 'src',
                    modules: [
                        'angular.js',
                        'util.js',
                        'pattern_exploder.js',
                        'pattern_parser.js',
                        'service.js',
                        'provider.js'
                    ],
                    target: 'build/modules.js'
                }
            }
        },
        'concat': {
            all: {
                files: {
                    'dist/angular.url_matcher.js': [
                        'src/prefix.js',
                        'src/module.js',
                        '<%= modules.all.options.target %>',
                        'src/suffix.js'
                    ]
                }
            }
        },
        'uglify': {
            all: {
                files: {
                    'dist/angular.url_matcher.min.js': [
                        'dist/angular.url_matcher.js'
                    ]
                }
            }
        },
        'watch': {
            all: {
                files: ['src/*.js', 'Gruntfile.js'],
                tasks: ['build'],
                options: {
                    interrupt: true
                }
            }
        }
    });
};
