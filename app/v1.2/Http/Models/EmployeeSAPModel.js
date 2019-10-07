/*
 |--------------------------------------------------------------------------
 | Models - Employee HRIS
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const EmployeeSAPSchema = Mongoose.Schema( {
		NIK: String,
		EMPLOYEE_NAME: String,
		JOB_CODE: String,
		START_VALID: {
			type: Number,
			get: v => Math.round( v ),
			set: v => Math.round( v ),
			alias: 'i'
		},
		END_VALID: {
			type: Number,
			get: v => Math.round( v ),
			set: v => Math.round( v ),
			alias: 'i'
		},
		INSERT_TIME_DW: {
			type: Number,
			get: v => Math.round( v ),
			set: v => Math.round( v ),
			alias: 'i'
		},
		UPDATE_TIME_DW: {
			type: Number,
			get: v => Math.round( v ),
			set: v => Math.round( v ),
			alias: 'i'
		},
		LAST_UPDATE: {
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
	module.exports = Mongoose.model( 'EmployeeSAP_v_1_2', EmployeeSAPSchema, 'TM_EMPLOYEE_SAP' );