/**
 * Project runner - handles automated tasks for running, linting, and compilation
 * @exports grunt/flint
 */
module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    jshint: {

      options: {
        // Conventions borrowed from Meteor
        //camelcase: true,
        curly: false,
        eqeqeq: true,
        indent: 2,
        //trailing: true,
        //maxlen: 80,
        asi: false,
        expr: true,
        
        // Conventions created for Flint
        
        // Environment
        devel: true
      }, // options
      
      core: {
        src: [
          "core/*/**.js", "!core/*/lib/**"
        ]
      }, // core
      
      cards: {
        src: [
          "cards/*/**.js", "!cards/*/lib/**"
        ]
      } // cards
      
    }, // jshint
    
    clean: {
      
      packages: {
        src: "app/packages/*"
      }, // packages
      
      themes: {
        src: [
          "tmp/themes",
          "app/public/themes"
        ] // files
      }, // themes
      
      fixtures: {
        src: [
          "app/server/fixtures"
        ] // files
      } // fixtures
      
    }, // clean
    
    coffee: {
      
      themes: {
        files: [
          {
            expand: true,
            cwd: 'themes/',
            src: ['*/coffee/**.coffee'],
            dest: 'tmp/themes/',
            ext: '.js'
          }
        ] // files
      } // themes
      
    }, // coffee
    
    less: {
      
      themes: {
        files: [
          {
            expand: true,
            cwd: 'themes/',
            src: ['*/less/*.less'],
            dest: 'tmp/themes/',
            ext: '.css'
          }
        ] // files
      } // themes
    
    }, // less
    
    copy: {
      
      core: {
        files: [
          {
            expand: true,
            cwd: 'core/',
            src: '**',
            dest: 'app/packages/'
          }
        ]
      }, // core
      
      layouts: {
        files: [
          {
            expand: true,
            cwd: 'layouts/',
            src: '*/**',
            // Add a layout- prefix.
            rename: function(dst, src) {
              return "app/packages/layout-" + src;
            }
          }
        ]
      }, // layouts
      
      cards: {
        files: [
          {
            expand: true,
            cwd: 'cards/',
            src: '*/**',
            // Add a card- prefix.
            rename: function(dst, src) {
              return "app/packages/card-" + src;
            }
          }
        ]
      }, // cards
      
      models: {
        files: [
          {
            expand: true,
            cwd: 'models/',
            src: '*/**',
            // Add a card- prefix.
            rename: function(dst, src) {
              return "app/packages/model-" + src;
            }
          }
        ]
      }, // models
      
      themes: {
        files: [{
          expand: true,
          cwd: 'themes/',
          src: '*/public/**',
          rename: function(dst, src) {
            var string = "app/public/themes/" + src;
            console.log(string);
            return string;
          }
        }]
      } // themes
    }, // copy
    
    concat: {
      
      themes: {
        files: [
          {
            expand: true,
            cwd: '/',
            src: ['themes/*/js/*.js', 'tmp/themes/*/coffee/**.js'],
            rename: function(dst, src) {
              var path = src.split("/");
              var theme = (path[0] === "themes") ? path[1] : path[2];
              return "app/public/themes/" + theme + ".js";
            }
          },
          {
            expand: true,
            src: ['themes/*/css/*.css', 'tmp/themes/*/less/*.css'],
            rename: function(dst, src) {
              var path = src.split("/");
              var theme = (path[0] === "themes") ? path[1] : path[2];
              return "app/public/themes/" + theme + ".css";
            }
          }
        ] // files
      } // themes
      
    }, // concat
    
    watch: {
      options: {
        nospawn: true
      }, // options
      
      core: {
        files: ['core/**'],
        tasks: ['jshint', 'clean:packages', 'copy:core', 'copy:layouts', 'meteorite'],
      }, // core
      
      cards: {
        files: ['cards/**'],
        tasks: ['jshint', 'clean:packages', 'copy:cards', 'meteorite'],
      }, // cards
      
      models: {
        files: ['models/**'],
        tasks: ['jshint', 'clean:packages', 'copy:models', 'meteorite']
      }, // models
      
      themes: {
        files: ['themes/*/{coffee,js,less,css}/**'],
        tasks: ['jshint', 'clean:themes', 'coffee:themes', 'less:themes', 'concat:themes', 'meteorite'],
      }, // themes
      
      fixtures: {
        files: ['fixtures/**'],
        tasks: ['jshint', 'clean:fixtures', 'copy:fixtures', 'meteorite']
      } // fixtures
      
    }, // watch
    
    jsdoc: {
      dist: {
        src: ['README.md', 'app'],
        
        options: {
          destination: 'docs',
          recurse: true,
          configure: "jsdoc.json"
        }
      }
    } // jsdoc
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-jsdoc');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'clean', 'coffee', 'less', 'copy', 'concat']);
  grunt.registerTask('run', ['default', 'meteorite', 'watch']);
  
  var meteorite = null;
  grunt.registerTask('meteorite', function() {
    var self = this;
    var spawn = function spawn() {
      meteorite = require('child_process').exec('mrt', { cwd: 'app' });
      meteorite.stdout.on('data', function(data) {
        var prefix = "mrt: ";
        process.stdout.write(data
          .replace(/$[^\n]/, prefix)
          .replace(/\r\n/g, "\r\n" + prefix)
          .replace(/\n/g, "\n" + prefix)
          .replace(/\r[^\n]/g, "\r" + prefix)
        );
      });
      meteorite.stderr.on('data', function(data) {
        var prefix = "mrt: ";
        process.stderr.write(data
          .replace(/$[^\n]/, prefix)
          .replace(/\r\n/g, "\r\n" + prefix)
          .replace(/\n/g, "\n" + prefix)
          .replace(/\r[^\n]/g, "\r" + prefix)
        );
      });
      meteorite.on('exit', function(code) {
        meteorite = null;
      });
    }
    
    if (meteorite) {
      var done = this.async();
      meteorite.once('exit', function() {
        grunt.log.ok('Meteorite finished. Restarting...');
        spawn();
        grunt.log.ok('Meteorite restarted.');
        done();
      });
      grunt.log.ok('Waiting for Meteorite to finish...');
      meteorite.kill();
    } else {
      grunt.log.ok('Starting Meteorite...');
      spawn();
      grunt.log.ok('Meteorite Started.');
    }
  });
};
