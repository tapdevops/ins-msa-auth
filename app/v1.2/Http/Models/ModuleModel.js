/*
 |--------------------------------------------------------------------------
 | Models - Module
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const ModulesSchema = Mongoose.Schema( {
		MODULE_CODE: String,
		MODULE_NAME: String,
		PARENT_MODULE: String,
		ITEM_NAME: String,
		ICON: String,
		STATUS: String,
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
		},
	});

/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
	module.exports = Mongoose.model( 'Modules_v_1_2', ModulesSchema, 'T_MODULE' );