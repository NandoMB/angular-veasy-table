'use strict'

module.exports = function (grunt) {

  grunt.initConfig({

    /*
     * [clean]          Run all tasks below.
     * [clean:build]    Clean build directory.
     * [clean:target]   Clean target directory.
     */
    clean: {
      build: ['dist'],
      target: ['src/target']
    },

    /*
     * [html2js]        Generates a js file containing all templates in cache ($ templateCache).
     */
    html2js: {
      options: {
        base: 'app',
        module: 'veasyTable.templates',
        singleModule: true,
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        }
      },
      rename: {
        options: {
          rename: function (moduleName) {
            return moduleName.replace('../src/templates/', '');
          }
        },
        src: ['src/**/*.html'],
        dest: 'src/target/veasy-table-tpls.js'
      }
    },

    /*
     * ['uglify']         Run all tasks below.
     * ['uglify:tpls']    Uglify the directive's templates.
     * ['uglify:dist']    Uglify the directive.
     */
    uglify: {
      tpls: {
        files: {
          'src/target/veasy-table-tpls.min.js': ['src/target/veasy-table-tpls.js']
        }
      },
      dist: {
        files: {
          'src/target/veasy-table.min.js': ['src/veasy-table.js']
        }
      }
    },

    /*
     * [cssmin]           Minify all directives CSS.
     */
    cssmin: {
      target: {
        files: {
          'dist/css/veasy-table.min.css': ['src/css/veasy-table.css']
        }
      }
    },

    /*
     * ['copy']           Run all tasks below
     * ['copy:src']       Copy all source files to dist folder.
     * ['copy:min']       Copy all uglify files to dist folder.
     */
    copy: {
      src: {
        files: [
          { src: ['src/veasy-table.js'],              dest: 'dist/js/veasy-table.js' },
          { src: ['src/target/veasy-table-tpls.js'],  dest: 'dist/js/veasy-table-tpls.js' }
        ],
      },
      min: {
        files: [
          { src: ['src/target/veasy-table.min.js'],       dest: 'dist/js/veasy-table.min.js' },
          { src: ['src/target/veasy-table-tpls.min.js'],  dest: 'dist/js/veasy-table-tpls.min.js' }
        ],
      }
    }

  });

  // Plugins
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Tasks
  grunt.registerTask('dist', [
    'clean',
    'html2js',
    'uglify:tpls',
    'uglify:dist',
    'cssmin',
    'copy:min',
    'copy:src',
    'clean:target'
  ]);

};
