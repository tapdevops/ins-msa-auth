/*
 |--------------------------------------------------------------------------
 | Models - Category
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const SchemaTypes = Mongoose.Schema.Types;

	require( 'mongoose-double')(Mongoose);
	const APKVersionSchema = Mongoose.Schema( {
		INSERT_USER: String,
		APK_VERSION: SchemaTypes.Double,
		IMEI: String,
		INSERT_TIME: {
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
	module.exports = Mongoose.model( 'APKVersion_v_1_2', APKVersionSchema, 'TR_APK_VERSION' );