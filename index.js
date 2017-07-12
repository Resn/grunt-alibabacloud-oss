/**
 * Created by Emlyn on 6/6/2017.
 */
const oss = require('ali-oss').Wrapper;
const upload = require('./lib/object_upload');
const queue = require('./lib/queue');

module.exports = function( config ) {
	
	const store = oss(config);
	
	return {
		upload: upload( store ),
		queue: queue( store )
	};
}