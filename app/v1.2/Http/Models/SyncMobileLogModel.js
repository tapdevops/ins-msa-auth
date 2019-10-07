/*
 |--------------------------------------------------------------------------
 | Models - Mobile Sync Log
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const SyncMobileLogSchema = Mongoose.Schema( {
		TGL_MOBILE_SYNC: {
			type: Number,
			get: v => Math.floor( v ),
			set: v => Math.floor( v ),
			alias: 'i'
		},
		TABEL_UPDATE: String,
		IMEI: String,
		INSERT_USER: String,
		INSERT_TIME: {
			type: Number,
			get: v => Math.round( v ),
			set: v => Math.round( v ),
			alias: 'i'
		}
	});
	
/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
	module.exports = Mongoose.model( 'SyncMobileLog_v_1_2', SyncMobileLogSchema, 'T_MOBILE_SYNC_LOG' );