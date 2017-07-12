/**
 * Created by Emlyn on 6/21/2017.
 */
module.exports = function( grunt ) {
	
	const config = require('./test/config.json');
	
	grunt.initConfig({
		"aliyun_oss": {
			"default": {
				"options": Object.assign({
					"bucket": '',
					"region": ''
				},config.auth),
				"files": [{
					"src": ["**/*"],
					"cwd": "test/test-files",
					"dest": "/test/"
				}]
			}
		}
	});
	
	grunt.loadTasks('tasks');
	
	grunt.registerTask("default","aliyun_oss");
	
};
