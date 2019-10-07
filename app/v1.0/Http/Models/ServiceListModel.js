/*
 |--------------------------------------------------------------------------
 | Models - Category
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const ServiceListSchema = Mongoose.Schema( {
		MOBILE_VERSION: String,
		API_NAME: String,
		API_BASE_URL: String,
		PORT: String,
		API_URL_PARAMETER: String,
		KETERANGAN: String,
		METHOD: String,
		INSERT_USER: String,
		INSERT_TIME: {
			type: Number,
			get: v => Math.floor( v ),
			set: v => Math.floor( v ),
			alias: 'i',
			default: function() {
				return 0;
			}
		},
		UPDATE_USER: String,
		UPDATE_TIME: {
			type: Number,
			get: v => Math.floor( v ),
			set: v => Math.floor( v ),
			alias: 'i',
			default: function() {
				return 0;
			}
		},
		DELETE_USER: String,
		DELETE_TIME: {
			type: Number,
			get: v => Math.floor( v ),
			set: v => Math.floor( v ),
			alias: 'i',
			default: function() {
				return 0;
			}
		}
	});

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
	module.exports = Mongoose.model( 'ServiceList', ServiceListSchema, 'TM_SERVICE_LIST' );