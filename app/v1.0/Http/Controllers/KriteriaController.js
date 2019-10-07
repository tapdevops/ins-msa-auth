/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
	const Models = {
		Kriteria: require( _directory_base + '/app/v1.0/Http/Models/KriteriaModel.js' )
	}

/*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Find
	 * Untuk menampilkan data kriteria
	 * --------------------------------------------------------------------------
	 */
		exports.find = ( req, res ) => {
			Models.Kriteria.find({})
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
				return res.send( {
					status: true,
					message: config.app.error_message.find_200,
					data: data
				} );
			} ).catch( err => {
				return res.send( {
					status: false,
					message: config.app.error_message.find_500,
					data: {}
				} );
			} );
		};