/*
 |--------------------------------------------------------------------------
 | Models - Login Log
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );

	const LoginLogSchema = Mongoose.Schema( {
		USER_AUTH_CODE: String,
		ACCESS_TOKEN: String,
		EMPLOYEE_NIK: String,
		USERNAME: String,
		IMEI: String,
		DATE_LOGIN: {
			type: Number,
			get: v => Math.floor( v ),
			set: v => Math.floor( v ),
			alias: 'i',
			default: function() {
				return 0;
			}
		}
	} );

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
	module.exports = Mongoose.model( 'LoginLog_v_1_1', LoginLogSchema, 'T_LOG_LOGIN' );