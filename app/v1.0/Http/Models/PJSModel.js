/*
 |--------------------------------------------------------------------------
 | Models - View User Auth
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const PJSSchema = Mongoose.Schema( {
		EMPLOYEE_NIK: String,
		USERNAME: String,
		NAMA_LENGKAP: String,
		JOB_CODE: String,
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
	module.exports = Mongoose.model( 'PJS', PJSSchema, 'TM_PJS' );