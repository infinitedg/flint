module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    jshint: {

      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        } // globals
      }, // options
      
      core: {
        src: ["core/{client,common,public,server}/**/*.js"]
      }, // core
      
      cards: {
        src: ["cards/*/{client,common,public,server}/**/*.js", "!cards/template/**"]
      }, // cards
      
      themes: {
        src: ["themes/*/js/**/*.js"]
      } // themes
      
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
      
      core: {
        files: ['core/{client,common,public,server}/**'],
        tasks: ['jshint:core', 'clean:core', 'coffee:core', 'copy:core'],
      }, // core
      
      cards: {
        files: ['cards/*/{client,common,public,server}/**'],
        tasks: ['jshint:cards', 'clean:cards', 'coffee:cards', 'copy:cards'],
      }, // cards
      
      themes: {
        files: ['themes/*/{coffee,js,less,css}/**'],
        tasks: ['jshint:themes', 'clean:themes', 'coffee:themes', 'less:themes', 'concat:themes'],
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
  grunt.registerTask('default', ['jshint', 'clean', 'coffee', 'less', 'copy', 'concat', 'watch']);
};
