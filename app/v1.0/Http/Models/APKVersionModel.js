/*
 |--------------------------------------------------------------------------
 | Models - Category
 |--------------------------------------------------------------------------
 */
const Mongoose = require( 'mongoose' );
const APKVersionSchema = Mongoose.Schema( {
    INSERT_USER: String,
    APK_VERSION: {
        type: Number,
        get: v => Math.floor( v ),
        set: v => Math.floor( v ),
        alias: 'i',
        default: function() {
            return 0;
        }
    },
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
module.exports = Mongoose.model( 'APKVersion', APKVersionSchema, 'TR_APK_VERSION' );