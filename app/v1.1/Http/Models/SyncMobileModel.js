/*
 |--------------------------------------------------------------------------
 | Models - Mobile Sync
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const SyncMobileSchema = Mongoose.Schema( {
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
	module.exports = Mongoose.model( 'SyncMobile_v_1_1', SyncMobileSchema, 'T_MOBILE_SYNC' );