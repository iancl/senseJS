module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			build: ['Grunfile.js', 'src/**/*.js']
		},
		uglify: {
			options: {
				banner: '//smskip:validation\n/*\n * <%= pkg.name %>\n * version: <%= pkg.version %>\n * build date: <%= grunt.template.today("yyyy-mm-dd") %>\n */\n'
			},
			build: {
				files: {
					'dist/js/sense.min.js' : ['src/js/sense.js']
				}
			}
		}
	});

	  grunt.loadNpmTasks('grunt-contrib-jshint');
	  grunt.loadNpmTasks('grunt-contrib-uglify');

	  grunt.registerTask('default', ['jshint', 'uglify']);

};