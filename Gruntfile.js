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
      // Your Jasmine spec files
      specs : 'specs/**/*spec.js',
      // Your spec helper files
      helpers : 'specs/helpers/*.js'
    }
  });


  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task(s).
  grunt.registerTask('default', ['jasmine']);

};
