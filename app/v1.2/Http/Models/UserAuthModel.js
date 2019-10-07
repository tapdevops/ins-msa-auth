/*
 |--------------------------------------------------------------------------
 | Models - User Auth
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const UserAuthSchema = Mongoose.Schema( {
		USER_AUTH_CODE: String,
		EMPLOYEE_NIK: String,
		USER_ROLE: String,
		REF_ROLE: String,
		LOCATION_CODE: String,
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
	module.exports = Mongoose.model( 'UserAuth_v_1_2', UserAuthSchema, 'TM_USER_AUTH' );