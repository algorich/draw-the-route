module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      build: {
        src: 'src/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },

    jasmine : {
      // Your project's source files
      src : 'src/**/*.js',
      options: {
        // Your Jasmine spec files
        specs : 'specs/**/*spec.js',
        
        // Your spec helper files
        helpers : 'specs/helpers/*.js',

        vendor: [
          'vendor/jquery.js',
          'vendor/jasmine-jquery.js',
          'http://maps.googleapis.com/maps/api/js?sensor=false'
        ]
      }
    }
  });


  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['jasmine']);

};
