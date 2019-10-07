/*
 |--------------------------------------------------------------------------
 | Models - Category
 |--------------------------------------------------------------------------
 */
	const Mongoose = require( 'mongoose' );
	const CategorySchema = Mongoose.Schema( {
		CATEGORY_CODE: String,
		CATEGORY_NAME: String,
		ICON: String,
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
	module.exports = Mongoose.model( 'Category_v_1_2', CategorySchema, 'TM_CATEGORY' );