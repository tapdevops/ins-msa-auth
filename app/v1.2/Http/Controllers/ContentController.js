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
		Content: require( _directory_base + '/app/v1.1/Http/Models/ContentModel.js' ),
		ContentLabel: require( _directory_base + '/app/v1.1/Http/Models/ContentLabelModel.js' )
	}

	//Libraries
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
	 * Untuk menampilkan data content
	 * --------------------------------------------------------------------------
	 */
		exports.find = ( req, res ) => {		
			var auth = req.token;
			var url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;
				url_query.DELETE_USER = "";
			
			Models.Content.find( url_query )
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

	/**
	 * Find One
	 * Untuk menampilkan satu data content berdasar CONTENT_CODE
	 * --------------------------------------------------------------------------
	 */
		exports.find_one = ( req, res ) => {
			Models.Content.findOne( {
				DELETE_USER: "",
				CONTENT_CODE: req.params.id
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

	/**
	 * Label Find
	 * Untuk menampilkan data content label
	 * --------------------------------------------------------------------------
	 */
		exports.label_find = ( req, res ) => {
			Models.ContentLabel.find( req.query )
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
				console.log(data);
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

	/**
	 * Label Find One
	 * Untuk menampilkan satu data content berdasar CONTENT_LABEL_CODE
	 * --------------------------------------------------------------------------
	 */
		exports.label_find_one = ( req, res ) => {
			console.log({
				DELETE_USER: "",
				CONTENT_LABEL_CODE: req.params.id
			});
			Models.ContentLabel.findOne()
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
				console.log(data);
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
		
		Models.Content.find( 
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
			CONTENT_CODE: 1,
			GROUP_CATEGORY: 1,
			CATEGORY: 1,
			CONTENT_NAME: 1,
			CONTENT_TYPE: 1,
			UOM: 1,
			FLAG_TYPE: 1,
			BOBOT: 1,
			URUTAN: 1,
			INSERT_USER:1,
			INSERT_TIME: 1,
			UPDATE_USER: 1,
			UPDATE_TIME: 1,
			DELETE_USER: 1,
			DELETE_TIME: 1,
			TBM0: 1,
			TBM1: 1,
			TBM2: 1,
			TBM3: 1,
			TM: 1
		} )
		.then( data_insert => {
			var temp_insert = [];
			var temp_update = [];
			var temp_delete = [];
			console.log( data_insert );
			data_insert.forEach( function( data ) {
				if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
					temp_delete.push( {
						CONTENT_CODE: data.CONTENT_CODE,
						GROUP_CATEGORY: data.GROUP_CATEGORY,
						CATEGORY: data.CATEGORY,
						CONTENT_NAME: data.CONTENT_NAME,
						CONTENT_TYPE: data.CONTENT_TYPE,
						UOM: data.UON,
						FLAG_TYPE: data.FLAG_TYPE,
						BOBOT: data.BOBOT,
						URUTAN: data.URUTAN,
						INSERT_USER: data.INSERT_USER,
						INSERT_TIME: Libraries.Helper.date_format(data.INSERT_TIME, 'YYYY-MM-DD hh:mm:ss' ),
						UPDATE_USER: data.UPDATE_USER,
						UPDATE_TIME: Libraries.Helper.date_format(data.UPDATE_TIME, 'YYYY-MM-DD hh:mm:ss' ),
						DELETE_USER: data.DELETE_USER,
						DELETE_TIME: Libraries.Helper.date_format(data.DELETE_TIME, 'YYYY-MM-DD hh:mm:ss' ),
						TBM0: data.TBM0,
						TBM1: data.TBM1,
						TBM2: data.TBM2,
						TBM3: data.TBM3,
						TM: data.TM
					} );
				}

				if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
					temp_insert.push( {
						CONTENT_CODE: data.CONTENT_CODE,
						GROUP_CATEGORY: data.GROUP_CATEGORY,
						CATEGORY: data.CATEGORY,
						CONTENT_NAME: data.CONTENT_NAME,
						CONTENT_TYPE: data.CONTENT_TYPE,
						UOM: data.UON,
						FLAG_TYPE: data.FLAG_TYPE,
						BOBOT: data.BOBOT,
						URUTAN: data.URUTAN,
						INSERT_USER: data.INSERT_USER,
						INSERT_TIME: Libraries.Helper.date_format(data.INSERT_TIME, 'YYYY-MM-DD hh:mm:ss' ),
						UPDATE_USER: data.UPDATE_USER,
						UPDATE_TIME: Libraries.Helper.date_format(data.UPDATE_TIME, 'YYYY-MM-DD hh:mm:ss' ),
						DELETE_USER: data.DELETE_USER,
						DELETE_TIME: Libraries.Helper.date_format(data.DELETE_TIME, 'YYYY-MM-DD hh:mm:ss' ),
						TBM0: data.TBM0,
						TBM1: data.TBM1,
						TBM2: data.TBM2,
						TBM3: data.TBM3,
						TM: data.TM
					} );
				}
				if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
					temp_update.push( {
						CONTENT_CODE: data.CONTENT_CODE,
						GROUP_CATEGORY: data.GROUP_CATEGORY,
						CATEGORY: data.CATEGORY,
						CONTENT_NAME: data.CONTENT_NAME,
						CONTENT_TYPE: data.CONTENT_TYPE,
						UOM: data.UON,
						FLAG_TYPE: data.FLAG_TYPE,
						BOBOT: data.BOBOT,
						URUTAN: data.URUTAN,
						INSERT_USER: data.INSERT_USER,
						INSERT_TIME: Libraries.Helper.date_format(data.INSERT_TIME, 'YYYY-MM-DD hh:mm:ss' ),
						UPDATE_USER: data.UPDATE_USER,
						UPDATE_TIME: Libraries.Helper.date_format(data.UPDATE_TIME, 'YYYY-MM-DD hh:mm:ss' ),
						DELETE_USER: data.DELETE_USER,
						DELETE_TIME: Libraries.Helper.date_format(data.DELETE_TIME, 'YYYY-MM-DD hh:mm:ss' ),
						TBM0: data.TBM0,
						TBM1: data.TBM1,
						TBM2: data.TBM2,
						TBM3: data.TBM3,
						TM: data.TM
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