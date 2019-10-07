/*
 |--------------------------------------------------------------------------
 | Models - View User Auth
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const ViewUserAuthSchema = Mongoose.Schema( {});

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
	module.exports = Mongoose.model( 'ViewUserAuth', ViewUserAuthSchema, 'VIEW_USER_AUTH' );