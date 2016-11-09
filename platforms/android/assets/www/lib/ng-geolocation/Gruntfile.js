// Generated on 2015-09-24 using generator-angular 0.11.1
"use strict";

// # Globbing
// for performance reasons we"re only matching one level down:
// "test/spec/{,*/}*.js"
// use this if you want to recursively match all subfolders:
// "test/spec/**/*.js"

module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-protractor-runner");
    grunt.loadNpmTasks("grunt-release");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-ng-annotate");
    // Load grunt tasks automatically
    require("load-grunt-tasks")(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require("time-grunt")(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            src: {
                src: [
                    "src/**/!(*.spec).js"
                ],
                options: {
                    jshintrc: "node_modules/jw-code-style/jshint/.src.jshintrc"
                }
            },
            test: {
                src: [
                    "src/**/*.spec.js",
                ],
                options: {
                    jshintrc: "node_modules/jw-code-style/jshint/.test.jshintrc"
                }
            },
            build: {
                src: ["Gruntfile.js"],
                options: {
                    jshintrc: "node_modules/jw-code-style/jshint/.build.jshintrc"
                }
            }
        },
        jscs: {
            src: [
                "{src}/**/*.js",
                "Gruntfile.js"
            ],
            options: {
                config: "node_modules/jw-code-style/jscs/.jscs.json"
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        "dist/{,*/}*"
                    ]
                }]
            },
            tmp: {
                files: [{
                    dot: true,
                    src: [
                        "tmp/{,*/}*"
                    ]
                }]
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: "tmp",
                    dest: "dist",
                    src: [
                        "**/*.js",
                    ]
                }]
            }
        },

        concat: {
            js: {
                src: [
                    "src/**/*Module.js",
                    "src/**/*.js",
                    "!src/**/*spec.js"
                ],
                dest: "dist/jw-ng-geolocation.js"
            }
        },

        uglify: {
            js: {
                files: {
                    "tmp/jw-ng-geolocation.min.js": ["tmp/jw-ng-geolocation.js"]
                }
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: "karma.conf.js",
                singleRun: true
            }
        },

        ngAnnotate: {
            js: {
                files: {
                    "tmp/jw-ng-geolocation.js": [
                        "src/**/*Module.js",
                        "src/**/*.js",
                        "!src/test/**/*.js"
                    ]
                }
            }
        }
    });

    grunt.registerTask("test", [
        "karma"
    ]);

    grunt.registerTask("build", [
        "clean",
        "jshint",
        "jscs",
        "test",
        "ngAnnotate",
        "uglify:js",
        "copy:dist"
    ]);

    grunt.registerTask("default", [
        "build"
    ]);
};
