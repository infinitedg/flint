/**
* Automation-related functionality and classes
* @module Automation
*/

/**
* [GruntJS](http://gruntjs.com/) project runner - handles automated tasks for running, linting, and compilation.  
Accessible by running `grunt [command name]` from the project root. See README.md for more information.
* @class Grunt
*/
module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    
    /**
    Verify consistency of all javascript files
    @method jshint
    */
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
      
      /**
      Verify consistency of core files (excludes files in any `/lib` directory)
      @method jshint:core
      */
      core: {
        src: [
          "core/*/**.js", "!core/*/lib/**"
        ]
      }, // core
      
      /**
      Verify consistency of card files (excludes files in any `/lib` directory)
      @method jshint:cards
      */
      cards: {
        src: [
          "cards/*/**.js", "!cards/*/lib/**"
        ]
      } // cards
      
    }, // jshint
    
    /**
    Cleans all files from `app` and `tmp` files
    @method clean
    */
    clean: {
      
      /**
      Cleans the packages directory in the `app/packages`
      @method clean:packages
      */
      packages: {
        src: "app/packages/*"
      }, // packages
      
      /**
      Cleans the files in the `app/public/themes` and `tmp/themes` directories
      @method clean:themes
      */
      themes: {
        src: [
          "tmp/themes",
          "app/public/themes"
        ] // files
      }, // themes
      
      /**
      Cleans the files in the `app/server/fixtures` directory
      @method clean:fixtures
      */
      fixtures: {
        src: [
          "app/server/fixtures"
        ] // files
      } // fixtures
      
    }, // clean
    
    /**
    Compiles coffeescript files in the themes directory into `tmp/themes`
    @method coffee
    */
    coffee: {
      
      /**
      Compiles coffeescript files in the themes directory into `tmp/themes` javascript files
      @method coffee:themes
      */
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
    
    /**
    Compiles less files in the themes directory into `tmp/themes`
    @method less
    */
    less: {
      
      /**
      Compiles less files in the themes directory into `tmp/themes` css files
      @method less:themes
      */
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
    
    /**
    Compiles the application by copying project and compiled tmp files (themes) into the `/app` directory
    @method copy
    */
    copy: {
      
      /**
      Compiles just `core/` files into the `/app` directory
      @method copy:core
      */
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
      
      /**
      Compiles just layout files into the `/app` directory
      @method copy:layouts
      */
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
      
      /**
      Compiles just card files into the `/app` directory
      @method copy:cards
      */
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
      
      /**
      Compiles just fixture files into the `/app` directory
      @method copy:fixtures
      */
      fixtures: {
        files: [
          {
            expand: true,
            cwd: 'fixtures/',
            src: '*/**',
            // Add a card- prefix.
            rename: function(dst, src) {
              return "app/packages/model-" + src;
            }
          }
        ]
      }, // fixtures
      
      /**
      Compiles just themes files into the `/app` directory
      @method copy:themes
      */
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
    
    /**
    Combine files for production
    @method concat
    */
    concat: {
      
      /**
      Combine theme files for production
      @method concat:themes
      */
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
    
    /**
    Track changes to files and trigger a rebuild as appropriate
    @method watch
    */
    watch: {
      options: {
        nospawn: true
      }, // options
      
      /**
      Track core changes to files and trigger a rebuild as appropriate
      @method watch:core
      */
      core: {
        files: ['core/**'],
        tasks: ['jshint', 'clean:packages', 'copy:core', 'copy:layouts'],
      }, // core
      
      /**
      Track card changes to files and trigger a rebuild as appropriate
      @method watch:cards
      */
      cards: {
        files: ['cards/**'],
        tasks: ['jshint', 'clean:packages', 'copy:cards'],
      }, // cards
      
      /**
      Track fixture changes to files and trigger a rebuild as appropriate
      @method watch:fixtures
      */
      fixtures: {
        files: ['fixtures/**'],
        tasks: ['jshint', 'clean:packages', 'copy:fixtures']
      }, // fixtures
      
      /**
      Track theme changes to files and trigger a rebuild as appropriate
      @method watch:themes
      */
      themes: {
        files: ['themes/*/{coffee,js,less,css}/**'],
        tasks: ['jshint', 'clean:themes', 'coffee:themes', 'less:themes', 'concat:themes', 'meteorite'],
      }, // themes
      
      // Removed the following as it appears to be a duplicate
      // fixtures: {
      //   files: ['fixtures/**'],
      //   tasks: ['jshint', 'clean:fixtures', 'copy:fixtures', 'meteorite']
      // } // fixtures
      
    }, // watch
    
    /**
    Generate project documentation with YUIDoc
    @method yuidoc
    */
    yuidoc: {
      /**
      Generate project documentation
      @method yuidoc:compile
      */
      compile: grunt.file.readJSON('yuidoc.json')
    },
    
    /**
    Perform arbitrary commands. __This method should probably never be run by itself (e.g. `grunt exec`) as it will execute all subtasks.
    @method exec
    */
    exec: {
      /**
      Destroys the docs repository from the project.  
      Note that the docs directory is not a submodule and is completely ignored by the main flint project.
      @method exec:docs_destory
      */
      docs_destory: {
        cmd: 'rm -rf docs'
      },
      
      /**
      Clone the [flint-docs](http://www.bitbucket.org/spacecenter/flint-docs/) repository into the `docs/` directory.  
      __This command must be run prior to running `grunt exec:docs_publish` or `grunt docs`.__  
      If by mistake documentation is generated prior to running docs_init, run `grunt exec:fix_docs`.
      */
      docs_init: {
        cmd: 'git clone git@bitbucket.org:spacecenter/flint-docs.git docs'
      },
      
      /**
      Commit and publish the docs/ directory to its remote repository.  
      This method will only create a commit and push if there have been any changes.
      @method exec:docs_publish
      */
      docs_publish: {
        // If we have initialized the docs directory, and if have something to commit, then commit it with the current message and then push
        cmd: '[[ ! -d .git ]] && echo "Docs uninitialized. Run grunt docs_fix to prepare your environment." || git diff-index --quiet HEAD && echo "No changes to commit" || (git commit -a -m "Docs as of `date`" && git push)',
        cwd: 'docs/'
      },
      
      /**
      Does nothing unless we are not on the master branch in our code. Then it will exit with error code 1
      @method exec:docs_branchCheck
      */
      docs_branchCheck: {
        cmd: '[[ "$(git rev-parse --abbrev-ref HEAD)" == "master" ]] || exit 1'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-exec');
  
  /**
  Grunt task for compiling and publishing current documentation.  
  Will fail if `docs` directory missing or if user has not successfully run `grunt exec:docs_init` or if the flint repository is not on the master branch
  @method docs
  */
  grunt.registerTask('docs', ['exec:docs_branchCheck', 'yuidoc:compile', 'exec:docs_publish']);
  
  /**
  Grunt task for completely rebuilding documentation component of the project.
  Destroys the `docs` directory and re-clones it from master repository.
  @method fix_docs
  */
  grunt.registerTask('docs_fix', ['exec:docs_destory', 'exec:docs_init']);
  
  /**
  Grunt task for running automated tests. At the moment, only performs `jshint` testing
  @method test
  */
  grunt.registerTask('test', ['jshint']);
  
  /**
  Default tasks when only running `grunt` or `grunt default`.  
  Includes: `jshint`, `clean`, `coffee`, `less`, `copy`, `concat`
  @method default
  */
  grunt.registerTask('default', ['jshint', 'clean', 'coffee', 'less', 'copy', 'concat', 'yuidoc']);
  
  /**
  Task for running `default`, `meteorite`, and `watch`. Effectively the preferred mechanism for development - rebuilding the app as changes are made, and thus refreshing the browser.
  @method run
  */
  grunt.registerTask('run', ['default', 'meteorite', 'watch']);
  
  var meteorite = null;
  /**
  Task to spawn `mrt` instance in the `app/` directory
  @method meteorite
  */
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
