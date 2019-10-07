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
		Category: require( _directory_base + '/app/v1.1/Http/Models/CategoryModel.js' )
	}

	// Libraries
	const Libraries = {
		Helper: require( _directory_base + '/app/v1.1/Http/Libraries/Helper.js' )
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

	/**
	 * Find All
	 * ...
	 * --------------------------------------------------------------------------
	 */

		// exports.find_all = ( req, res ) => {
		// 	var url_query = req.query;
		// 	var url_query_length = Object.keys( url_query ).length;
		// 	url_query.END_VALID = 99991231;

		// 	Models.Category.find( url_query )
		// 	.select( {
		// 		_id: 0,
		// 		CATEGORY_CODE: 1,
		// 		CATEGORY_NAME: 1,
		// 		ICON: 1,
		// 		INSERT_USER: 1,
		// 		INSERT_TIME: 1,
		// 		UPDATE_USER: 1,
		// 		UPDATE_TIME: 1,
		// 		DELETE_USER: 1,
		// 		DELETE_TIME: 1
		// 	} )
		// 	// .sort( {
		// 	// 	WERKS: 1,
		// 	// 	AFD_CODE: 1,
		// 	// 	BLOCK_NAME: 1
		// 	// } )
		// 	.then( data => {
		// 		if( !data ) {
		// 			return res.send( {
		// 				status: false,
		// 				message: 'Data not found 2',
		// 				data: {}
		// 			} );
		// 		}
		// 		var results = [];
		// 		if ( data.length > 0 ) {
		// 			data.forEach( function ( dt ) {
		// 				results.push( {
		// 					"CATEGORY_CODE": dt.CATEGORY_CODE,
		// 					"CATEGORY_NAME": dt.CATEGORY_NAME,
		// 					"ICON": dt.ICON,
		// 					"INSERT_USER": dt.INSERT_USER,
		// 					"INSERT_TIME": dt.INSERT_TIME,
		// 					"UPDATE_USER": dt.UPDATE_USER,
		// 					"UPDATE_TIME": dt.UPDATE_TIME,
		// 					"DELETE_USER": dt.DELETE_USER,
		// 					"DELETE_TIME": dt.DELETE_TIME
		// 				} );
		// 			} );
		// 		}
		// 		return res.send( {
		// 			status: true,
		// 			message: 'Success',
		// 			data: results
		// 		} );
		// 	} ).catch( err => {
		// 		if( err.kind === 'ObjectId' ) {
		// 			return res.send( {
		// 				status: false,
		// 				message: 'Data not found 1',
		// 				data: {}
		// 			} );
		// 		}
		// 		return res.send( {
		// 			status: false,
		// 			message: 'Error retrieving data',
		// 			data: {}
		// 		} );
		// 	} );
		// }

	/**
	 * Sync Mobile
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.sync_mobile = ( req, res ) => {

			var auth = req.auth;
			var start_date = Libraries.Helper.date_format( req.params.start_date, 'YYYYMMDDhhmmss' );
			var end_date = Libraries.Helper.date_format( req.params.end_date, 'YYYYMMDDhhmmss' );
			var location_code_group = auth.LOCATION_CODE.split( ',' );
			var ref_role = auth.REFFERENCE_ROLE;
			var location_code_final = [];
			var key = [];
			var query = {};
				query["END_VALID"] = 99991231;
			
			Models.Category.find( 
				{
					$and: [
						{
							$or: [
								{
									INSERT_TIME: {
										$gte: start_date,
										$lte: end_date
									}
								},
								{
									UPDATE_TIME: {
										$gte: start_date,
										$lte: end_date
									}
								},
								{
									DELETE_TIME: {
										$gte: start_date,
										$lte: end_date
									}
								}
							]
						}
					]
				}
				
			).select( {
				_id: 0,
				CATEGORY_CODE: 1,
				CATEGORY_NAME: 1,
				ICON: 1,
				INSERT_USER: 1,
				INSERT_TIME: 1,
				UPDATE_USER: 1,
				UPDATE_TIME: 1,
				DELETE_USER: 1,
				DELETE_TIME: 1
			} )
			.then( data_insert => {
				var temp_insert = [];
				var temp_update = [];
				var temp_delete = [];
				console.log( data_insert );
				data_insert.forEach( function( data ) {
					if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
						temp_delete.push( {
							CATEGORY_CODE: data.CATEGORY_CODE,
							CATEGORY_NAME: data.CATEGORY_NAME,
							ICON: data.ICON,
							INSERT_USER: data.INSERT_USER,
							INSERT_TIME: Libraries.Helper.date_format(data.INSERT_TIME, 'YYYY-MM-DD hh:mm:ss' ),
							UPDATE_USER: data.UPDATE_USER,
							UPDATE_TIME: Libraries.Helper.date_format(data.UPDATE_TIME, 'YYYY-MM-DD hh:mm:ss' ),
							DELETE_USER: data.DELETE_USER,
							DELETE_TIME: Libraries.Helper.date_format(data.DELETE_TIME, 'YYYY-MM-DD hh:mm:ss' )
						} );
					}

					if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
						temp_insert.push( {
							CATEGORY_CODE: data.CATEGORY_CODE,
							CATEGORY_NAME: data.CATEGORY_NAME,
							ICON: data.ICON,
							INSERT_USER: data.INSERT_USER,
							INSERT_TIME: Libraries.Helper.date_format(data.INSERT_TIME, 'YYYY-MM-DD hh:mm:ss' ),
							UPDATE_USER: data.UPDATE_USER,
							UPDATE_TIME: Libraries.Helper.date_format(data.UPDATE_TIME, 'YYYY-MM-DD hh:mm:ss' ),
							DELETE_USER: data.DELETE_USER,
							DELETE_TIME: Libraries.Helper.date_format(data.DELETE_TIME, 'YYYY-MM-DD hh:mm:ss' )
						} );
					}
					if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
						temp_update.push( {
							CATEGORY_CODE: data.CATEGORY_CODE,
							CATEGORY_NAME: data.CATEGORY_NAME,
							ICON: data.ICON,
							INSERT_USER: data.INSERT_USER,
							INSERT_TIME: Libraries.Helper.date_format(data.INSERT_TIME, 'YYYY-MM-DD hh:mm:ss' ),
							UPDATE_USER: data.UPDATE_USER,
							UPDATE_TIME: Libraries.Helper.date_format(data.UPDATE_TIME, 'YYYY-MM-DD hh:mm:ss' ),
							DELETE_USER: data.DELETE_USER,
							DELETE_TIME: Libraries.Helper.date_format(data.DELETE_TIME, 'YYYY-MM-DD hh:mm:ss' )
						} );
					}
				} );
				res.json({
					status: true,
					message: 'Data Sync tanggal ' + Libraries.Helper.date_format( req.params.start_date, 'YYYY-MM-DD' ) + ' s/d ' + Libraries.Helper.date_format( req.params.end_date, 'YYYY-MM-DD' ),
					data: {
						"hapus": temp_delete,
						"simpan": temp_insert,
						"ubah": temp_update
					}
				});
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send({
						status: false,
						message: "ObjectId Error",
						data: {}
					});
				}

				return res.send({
					status: false,
					message: err.message,//"Error",
					data: {}
				} );
			});
		}