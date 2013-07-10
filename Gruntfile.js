module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= pkg.version %> | <%= pkg.author %> | <%= grunt.template.today("yyyy-mm-dd") %> | <%= pkg.license %> */\n'
            },
            build: {
                src: 'src/app.js',
                dest: 'bundles/app.min.js'
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['uglify']);

};