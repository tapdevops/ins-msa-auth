/*
 |--------------------------------------------------------------------------
 | Models - Content Label
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const ContentLabelSchema = Mongoose.Schema( {
		CONTENT_LABEL_CODE: String,
		CONTENT_CODE: String,
		LABEL_NAME: String,
		LABEL_ICON: String,
		URUTAN_LABEL: String,
		LABEL_SCORE: {
			type: Number,
			default: function() {
				return 0;
			}
		},
		INSERT_USER: String,
		INSERT_TIME: {
			type: Number,
			get: v => Math.round( v ),
			set: v => Math.round( v ),
			alias: 'i'
		},
		UPDATE_USER: String,
		UPDATE_TIME: {
			type: Number,
			get: v => Math.round( v ),
			set: v => Math.round( v ),
			alias: 'i'
		},
		DELETE_USER: String,
		DELETE_TIME: {
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
	module.exports = Mongoose.model( 'ContentLabel_v_1_1', ContentLabelSchema, 'TM_CONTENT_LABEL' );