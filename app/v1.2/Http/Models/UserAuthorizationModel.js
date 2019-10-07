/*
 |--------------------------------------------------------------------------
 | Models - View User Auth
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const UserAuthorizationSchema = Mongoose.Schema( {
		MODULE_CODE: String,
		PARAMETER_NAME: String,
		STATUS: Number,
		INSERT_USER: String,
		INSERT_TIME: {
			type: Date,
			default: function() {
				return null;
			}
		},
		UPDATE_USER: String,
		UPDATE_TIME: {
			type: Date,
			default: function() {
				return null;
			}
		},
		DELETE_USER: String,
		DELETE_TIME: {
			type: Date,
			default: function() {
				return null;
			}
		}
	});

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
	module.exports = Mongoose.model( 'UserAuthorization_v_1_2', UserAuthorizationSchema, 'T_USER_AUTHORIZATION' );