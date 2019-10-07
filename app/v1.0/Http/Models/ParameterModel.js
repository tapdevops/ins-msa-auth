/*
 |--------------------------------------------------------------------------
 | Models - Parameter
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const ParameterSchema = Mongoose.Schema( {
		PARAMETER_GROUP: String,
		PARAMETER_NAME: String,
		DESC: String,
		NO_URUT: Number,
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
	module.exports = Mongoose.model( 'Parameter', ParameterSchema, 'TM_PARAMETER' );