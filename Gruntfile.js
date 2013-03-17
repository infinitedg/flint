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
        
        // Conventions created for Flint
        
        // Environment
        devel: true
      }, // options
      
      client: {
        options: { 
          browser: true,
          jquery: true,
          nonstandard: true
        },
        src: [
          "core/client/**/*.js", "!core/client/lib/**",
          "cards/*/client/**/*.js",
          "themes/*/js/**/*.js"
        ]
      }, // client
      
      common: {
        options: { 
          browser: true,
          node: true,
          jquery: true,
          nonstandard: true
        },
        src: [
          "core/common/**/*.js", "!core/common/lib/**",
          "cards/*/common/**/*.js"
        ]
      }, // common
      
      server: {
        options: { 
          node: true
        },
        src: [
          "core/server/**/*.js", "!core/server/lib/**",
          "cards/*/server/**/*.js"
        ]
      } // server
      
    }, // jshint
    
    clean: {
      
      core: {
        src: [
          "tmp/core",
          "app/{client,common,public,server}/*",
          "!app/{client,common,public,server}/cards",
          "!app/public/themes"
        ] // files
      }, // core
      
      cards: {
        src: [
          "tmp/cards",
          "app/{client,common,public,server}/cards"
        ] // files
      }, // cards
      
      themes: {
        src: [
          "tmp/themes",
          "app/public/themes"
        ] // files
      } // themes
      
    }, // clean
    
    coffee: {
      
      core: {
        files: [
          {
            expand: true,
            cwd: 'core/',
            src: ['{client,common,public,server}/**.coffee'],
            dest: 'tmp/core/',
            ext: '.js'
          }
        ] // files
      }, // core
      
      cards: {
        files: [
          {
            expand: true,
            cwd: 'cards/',
            src: ['*/{client,common,public,server}/**.coffee'],
            dest: 'tmp/cards/',
            ext: '.js'
          }
        ] // files
      }, // cards
      
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
            src: ['{client,common,public,server}/**', '!{client,common,public,server}/**.coffee'],
            dest: 'app/'
          },
          {
            expand: true,
            cwd: 'tmp/core/',
            src: ['{client,common,public,server}/**'],
            dest: 'app/'
          }
        ] // files
      }, // core
      
      cards: {
        files: [
          {
            expand: true,
            cwd: 'cards/',
            src: ['*/{client,common,public,server}/**', '!template/**', '!*/{client,common,public,server}/**.coffee'],
            rename: function(dst, src) {
              // transform "card/subfolder/**" to "subfolder/cards/card/**"
              var path = src.split("/");
              return "app/" + path[1] + "/cards/" + path[0] + "/" + path.slice(2).join('/');
            }
          },
          {
            expand: true,
            cwd: 'tmp/cards/',
            src: ['*/{client,common,public,server}/**', '!template/**'],
            rename: function(dst, src) {
              // transform "card/subfolder/**" to "app/subfolder/cards/card/**"
              var path = src.split("/");
              return "app/" + path[1] + "/cards/" + path[0] + "/" + path.slice(2).join('/');
            }
          }
        ] // files
      } // cards
      
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
        files: ['core/{client,common,public,server}/**'],
        tasks: ['jshint', 'clean:core', 'coffee:core', 'copy:core', 'meteorite'],
      }, // core
      
      cards: {
        files: ['cards/*/{client,common,public,server}/**'],
        tasks: ['jshint', 'clean:cards', 'coffee:cards', 'copy:cards', 'meteorite'],
      }, // cards
      
      themes: {
        files: ['themes/*/{coffee,js,less,css}/**'],
        tasks: ['jshint', 'clean:themes', 'coffee:themes', 'less:themes', 'concat:themes', 'meteorite'],
      } // themes
      
    } // watch
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');

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
