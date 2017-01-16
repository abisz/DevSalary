'use strict'

const fs = require('fs')
const serveStatic = require('serve-static')

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      watch: {
        files: {
          './dist/app.js': ['./src/app.js']
        },
        options: {
          transform: ['babelify']
        }
      },
      dist: {
        files: {
          './dist/app.js': ['./src/app.js']
        },
        options: {
          transform: ['babelify', 'uglifyify']
        }
      },
      options: {
        browserifyOptions: {
          debug: true
        }
      }
    },

    concat: {
      dist: {
        src: ['src/*.css'],
        dest: 'dist/style.css',
      },
    },

    clean: {
      dist: ['./dist']
    },

    connect: {
      server: {
        options: {
          base: './dist',
          hostname: '0.0.0.0',
          livereload: true,
          open: true,
          port: 3000
        }
      }
    },

    copy: {
      data: {
        expand: true,
        cwd: 'data',
        src: ['*.csv', '*.json'],
        dest: './dist/data'
      },
      dist: {
        expand: true,
        cwd: 'src',
        src: '*.html',
        dest: './dist/'
      }
    },

    watch: {
      js: {
        files: ['./src/**/*.js'],
        tasks: ['browserify:watch'],
        options: {
          livereload: true
        }
      },

      html: {
        files: ['./src/index.html', './src/*.css'],
        tasks: ['default'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('default', ['clean', 'copy', 'concat', 'browserify:dist'])
  grunt.registerTask('start', ['default', 'connect', 'watch'])

};
