/**
 * Created by Emlyn on 6/6/2017.
 */
const Kefir = require('kefir');
const fs = require('fs');

module.exports = function ( oss ) {
	
	return {
		
		/**
		 * Upload a single file
		 * @param srcFilePath Path to local file
		 * @param destKeyPath Remote path where file will be uploaded
		 * @param options (See https://github.com/ali-sdk/ali-oss#putname-file-options)
		 */
		put( srcFilePath, destKeyPath, options = {} ) {
			
			return Kefir.fromPromise(
				oss.put( destKeyPath, srcFilePath, options )
			);
			
		},
		
		/**
		 * Upload a single file (multi-part)
		 * @param srcFilePath Path to local file
		 * @param destKeyPath Remote path where file will be uploaded
		 * @param options (See https://github.com/ali-sdk/ali-oss#multipartuploadname-file-options)
		 */
		putLarge( srcFilePath, destKeyPath, options = {} ) {
			
			return Kefir.fromPromise(
				oss.multipartUpload( destKeyPath, srcFilePath, options )
			);
			
		}
		
	}
	
};