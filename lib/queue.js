/**
 * Created by Emlyn on 6/6/2017.
 */

const Kefir = require('kefir');

module.exports = function( oss ) {
	
	const objectUpload = require('./object_upload')( oss );
	
	const TYPES = {
		COMPLETE:	'COMPLETE',
		INFO:		'INFO',
		ERROR:		'ERROR'
	};
	
	return {
		
		TYPES,
		
		/**
		 * Upload a queue of files to OSS bucket
		 * @param uploads Object containing upload src and dest
		 * @param options.concurrent How many files to upload a once
		 * @param options.retry How many retry attempts to make when a file fails to upload.
		 */
		uploadQueue( uploads, { concurrent = 4, retry = 4 } = {} ) {
			
			return Kefir.sequentially(0, uploads)
				.flatMapConcurLimit(upload => {
					
					let complete = false;
					
					return Kefir.repeat( i => {
						if( !complete && i < retry ) {
							
							//# Info stream for messaging
							const info$ = Kefir.constant({
								type: TYPES.INFO,
								message: `Uploading attempt ${i+1}/${retry}: ${upload.dest}`
							});
							
							//# Upload file via OSS
							const uploading$ = objectUpload
								.putLarge( upload.src, upload.dest, upload.options );
							
							//# Completed upload stream
							const uploadComplete$ = uploading$
								.ignoreErrors()
								.map( result => {
									complete = true;
									return {
										type: TYPES.COMPLETE,
										result
									};
								});
							
							//# Map upload errors to error value objects
							const uploadingErrors$ = uploading$
								.ignoreValues()
								.flatMapErrors( error => {
									return Kefir.constant({
										type: TYPES.ERROR,
										error
									});
								});
							
							return Kefir.merge([
								info$,
								uploadComplete$,
								uploadingErrors$
							]);
							
							
						} else {
							
							if( i === retry ) {
								return Kefir.constantError(`"Failed to upload file ${upload.src}`);
							} else {
								return false;
							}
						}
						
					})
				},concurrent);
			
		}
	}
};