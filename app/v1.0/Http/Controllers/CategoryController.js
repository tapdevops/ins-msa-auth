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
		Category: require( _directory_base + '/app/v1.0/Http/Models/CategoryModel.js' )
	}

 /*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Find
	 * Untuk menampilkan data category
	 * --------------------------------------------------------------------------
	 */
	 	exports.find = async ( req, res ) => {
			var query = await Models.Category
				.find()
				.select( {
					_id: 0,
					INSERT_TIME: 0,
					INSERT_USER: 0,
					DELETE_TIME: 0,
					DELETE_USER: 0,
					UPDATE_TIME: 0,
					UPDATE_USER: 0,
					__v: 0
				} );

			if ( query.length > 0 ) {

				var results = [];
				if ( config.app.env == 'prod' ) {
					var path_global = req.protocol + '://' + req.get( 'host' ) + '/' + config.app.path.prod + '/';
				}
				else if ( config.app.env == 'qa' ) {
					var path_global = req.protocol + '://' + req.get( 'host' ) + '/' + config.app.path.qa + '/';
				}
				else if ( config.app.env == 'dev' ) {
					var path_global = req.protocol + '://' + req.get( 'host' ) + '/' + config.app.path.dev + '/' ;
				}

				query.forEach( function( result ) {
					var path = 'files/images/category/' + result.ICON;
					results.push( {
						CATEGORY_CODE: result.CATEGORY_CODE,
						CATEGORY_NAME: result.CATEGORY_NAME,
						ICON: result.ICON,
						ICON_URL: path_global + path
					} );
				} );

				if ( results.length > 0 ) {
					return res.send( {
						status: true,
						message: config.app.error_message.find_200,
						data: results
					} );
				}
				else {
					return res.send( {
						status: true,
						message: config.app.error_message.find_404 + ' 2',
						data: {}
					} );
				}
			}
			else {
				return res.send( {
					status: true,
					message: config.app.error_message.find_404,
					data: {}
				} );
			}
		};