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
          port: 3000,
          // middleware: (connect, options) => {
          //   const middlewares = []
          //
          //   if (!Array.isArray(options.base)) {
          //     options.base = [options.base]
          //   }
          //
          //   options.base.forEach(function(base) {
          //     middlewares.push(serveStatic(base))
          //   })
          //
          //   // default: index.html
          //   middlewares.push((req, res) => {
          //     fs
          //       .createReadStream(`${options.base}/index.html`)
          //       .pipe(res)
          //   })
          //   return middlewares
          // }
        }
      }
    },

    copy: {
      css: {
        expand: true,
        cwd: 'src',
        src: '*.css',
        dest: './dist/'
      },
      data: {
        expand: true,
        cwd: 'data',
        src: '*.csv',
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

  grunt.registerTask('default', ['clean', 'copy', 'browserify:dist'])
  grunt.registerTask('start', ['default', 'connect', 'watch'])

};
