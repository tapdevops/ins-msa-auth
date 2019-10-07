/*
 |--------------------------------------------------------------------------
 | Models - Content
 |--------------------------------------------------------------------------
 */	
	const Mongoose = require( 'mongoose' );
	const ContentSchema = Mongoose.Schema( {

		CONTENT_CODE: String,
		GROUP_CATEGORY: String,
		CATEGORY: String,
		CONTENT_NAME: String,
		CONTENT_TYPE: String,
		UOM: String,
		FLAG_TYPE: String,
		BOBOT: {
			type: Number,
			default: function() {
				return 0;
			}
		},
		URUTAN: String,
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
		TBM0: String,
		TBM1: String,
		TBM2: String,
		TBM3: String,
		TM: String
	});
/*
 |--------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------
 */
	module.exports = Mongoose.model( 'Content_v_1_2', ContentSchema, 'TM_CONTENT' );