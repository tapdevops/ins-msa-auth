/*
 |--------------------------------------------------------------------------
 | Models - Employee HRIS
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const EmployeeHRISSchema = Mongoose.Schema( {
		EMPLOYEE_NIK: String,
		EMPLOYEE_USERNAME: String,
		EMPLOYEE_FULLNAME: String,
		EMPLOYEE_POSITIONCODE: String,
		EMPLOYEE_POSITION: String,
		EMPLOYEE_EMAIL: String,
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
		DELETE_TIME_DW: {
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
	module.exports = Mongoose.model( 'EmployeeHRIS_v_1_1', EmployeeHRISSchema, 'TM_EMPLOYEE_HRIS' );
