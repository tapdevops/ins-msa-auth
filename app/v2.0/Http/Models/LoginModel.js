/*
 |--------------------------------------------------------------------------
 | Models - Login
 |--------------------------------------------------------------------------
 */
const Mongoose = require('mongoose');
const LoginSchema = Mongoose.Schema({
	USER_AUTH_CODE: String,
	EMPLOYEE_NIK: String,
	USERNAME: String,
	ACCESS_TOKEN: String,
	LAST_LOGIN: String,
	LOG_LOGIN: String,
	DEVICE_ID: String,
	INSERT_TIME: {
		type: Number,
		get: v => Math.floor(v),
		set: v => Math.floor(v),
		alias: 'i',
		default: function () {
			return 0;
		}
	}
});

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
module.exports = Mongoose.model('Login_v_2_0', LoginSchema, 'TM_LOGIN');
