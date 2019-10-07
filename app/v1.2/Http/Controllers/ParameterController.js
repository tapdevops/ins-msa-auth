/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Libraries
	const Libraries = {
		Helper: require( _directory_base + '/app/v1.1/Http/Libraries/Helper.js' )
	}

 	// Models
	const Models = {
		Parameter: require( _directory_base + '/app/v1.1/Http/Models/ParameterModel.js' )
	}

/*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Find
	 * Untuk mengambil data Parameter.
	 * --------------------------------------------------------------------------
	 */
		exports.find = ( req, res ) => {

			url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;

			Models.Parameter.find( url_query ).sort( { NO_URUT: 'asc' } )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found 2',
						data: {}
					} );
				}
				res.send( {
					status: true,
					message: 'Success',
					data: data
				} );
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'Data not found 1',
						data: {}
					} );
				}
				return res.send( {
					status: false,
					message: 'Error retrieving data',
					data: {}
				} );
			} );
		};

		exports.time_track_find_one = ( req, res ) => {
			Models.Parameter.findOne( {
				PARAMETER_GROUP: "TIME_TRACK"
			} )
			.select( {
				_id: 0,
				INSERT_TIME: 0,
				INSERT_USER: 0,
				DELETE_TIME: 0,
				DELETE_USER: 0,
				UPDATE_TIME: 0,
				UPDATE_USER: 0,
				__v: 0
			} )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: config.app.error_message.find_404,
						data: {}
					} );
				}
				res.send( {
					status: true,
					message: config.app.error_message.find_200,
					data: data
				} );
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.app.error_message.find_500,
					data: {}
				} );
			} );
		};	