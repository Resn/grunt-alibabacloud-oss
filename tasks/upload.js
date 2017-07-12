/**
 * Created by Emlyn on 6/21/2017.
 */
module.exports = function( grunt ) {
	
	const Kefir = require('kefir');
	const path = require('path');
	const fs = require('fs');
	const lib = require('../index');
	
	grunt.registerMultiTask("alibabacloud_oss","Upload files to Alibaba Cloud OSS",function() {
		
		const done = this.async();
		const options = this.options();
		
		const ossUpload = lib(options);
		
		const uploadFiles$ = Kefir.constant(this.files);
		
		//# Convert files into flat array of upload src/dest objects
		const uploadObjects$ = uploadFiles$
			.map( files => files.reduce( (files,file) => {
				return files.concat( file.src.reduce( (files,src) => {
					
					const filePath = path.resolve(src);
					const stat = fs.statSync(filePath);
					
					//# Ignore non-files, ie directories
					if( stat.isFile() && stat.size > 0 ) {
						files.push( {
							src: filePath,
							dest: file.dest
						} );
					}
					
					return files;
				},[] ) );
			},[] ) );
		
		//# Pass upload objects to OSS upload queue
		const uploading$ = uploadObjects$
			.flatMap( uploads => ossUpload.queue.uploadQueue( uploads ) );


		//# Track the upload progress with a completed counter
		const progress$ = Kefir.combine([
			uploadObjects$
				.map( objects => objects.length ),
			uploading$
				.filter( result => result.type === ossUpload.queue.TYPES.COMPLETE )
				.scan( (prev,next) => {
					return {
						count: prev.count + 1,
						upload: next
					};
				},{ count: 0, last: {} } )
				.skip(1)
		] )
		.map(([total, running]) => ({
			total,
			upload: running.upload.result,
			count: running.count
		}) )
		.toProperty();
		
		//# Upload Info output
		uploading$
			.filter( result => result.type === ossUpload.queue.TYPES.INFO )
			.observe( info => {
				grunt.verbose.debug(info.message);
			});
		
		//# Upload error output
		uploading$
			.filter( result => result.type === ossUpload.queue.TYPES.ERROR )
			.observe( err => {
				grunt.verbose.error(err.error);
			});

		//# Upload progress ouput
		progress$
			.observe({
				value( {upload,count,total} ) {
					grunt.verbose.ok(`Uploaded: ${upload.name} - ${count}/${total}`);
				},
				error( err ) {
					grunt.fail.fatal(err);
				},
				end() {
					progress$.observe( ({upload,count,total}) => {
						grunt.log.ok(`Finished uploading: ${count}/${total} files`);
						done();
					});
				}
			});

	});
	
};
