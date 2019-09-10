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
		Kriteria: require( _directory_base + '/app/v1.1/Http/Models/KriteriaModel.js' ),
		Content: require( _directory_base + '/app/v1.1/Http/Models/ContentModel.js' ),
		ContentLabel: require( _directory_base + '/app/v1.1/Http/Models/ContentLabelModel.js' ),
		SyncMobile: require( _directory_base + '/app/v1.1/Http/Models/SyncMobileModel.js' ),
		SyncMobileLog: require( _directory_base + '/app/v1.1/Http/Models/SyncMobileLogModel.js' ),
		UserAuth: require( _directory_base + '/app/v1.1/Http/Models/UserAuthModel.js' ),
		ViewUserAuth: require( _directory_base + '/app/v1.1/Http/Models/ViewUserAuthModel.js' ),
	}

	// Node Module
	const NodeRestClient = require( 'node-rest-client' ).Client;

/*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Create
	 * Untuk membuat data mobile sync (pencatatan imei, apa yang di sync, dan 
	 * wakty sync).
	 * --------------------------------------------------------------------------
	 */
		exports.create = ( req, res ) => {

			if ( !req.body.TGL_MOBILE_SYNC || !req.body.TABEL_UPDATE ) {
				return res.send({
					status: false,
					message: 'Invalid input',
					data: {}
				});
			}

			var auth = req.auth;
			const set = new Models.SyncMobile( { 
				TGL_MOBILE_SYNC: Libraries.Helper.date_format( req.body.TGL_MOBILE_SYNC, 'YYYYMMDDhhmmss' ),
				TABEL_UPDATE: req.body.TABEL_UPDATE || "",
				IMEI: auth.IMEI,
				INSERT_USER: auth.USER_AUTH_CODE,
				INSERT_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
			} );

			set.save()
			.then( data => {
				if ( !data ) {
					return res.send( {
						status: false,
						message: 'Data error',
						data: {}
					} );
				}

				const set_log = new Models.SyncMobileLog( {
					TGL_MOBILE_SYNC: Libraries.Helper.date_format( req.body.TGL_MOBILE_SYNC, 'YYYYMMDDhhmmss' ),
					TABEL_UPDATE: req.body.TABEL_UPDATE || "",
					IMEI: auth.IMEI,
					INSERT_USER: auth.USER_AUTH_CODE,
					INSERT_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
				} );

				set_log.save()
				.then( data_log => {
					res.send({
						status: true,
						message: config.app.error_message.find_200,
						data: {}
					});
				} )
				.catch( err => {
					if( err.kind === 'ObjectId' ) {
						return res.send( {
							status: false,
							message: 'ObjectId error',
							data: {}
						} );
					}
					return res.send( {
						status: false,
						message: 'Error retrieving data',
						data: {}
					} );
				} );
				
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId error',
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

	/**
	 * Contact Find
	 * Untuk sync data contact.
	 * --------------------------------------------------------------------------
	 */
		exports.contact_find = async ( req, res ) => {

			// var query = await Models.UserAuth.aggregate( [
			// 	{
			// 		"$lookup": {
			// 			"from": "TM_EMPLOYEE_HRIS",
			// 			"localField": "EMPLOYEE_NIK",
			// 			"foreignField": "EMPLOYEE_NIK",
			// 			"as": "HRIS"
			// 		}
			// 	},
			// 	{
			// 		"$lookup": {
			// 			"from": "TM_PJS",
			// 			"localField": "EMPLOYEE_NIK",
			// 			"foreignField": "EMPLOYEE_NIK",
			// 			"as": "PJS"
			// 		}
			// 	},
			// 	{
			// 		"$project": {
			// 			USER_AUTH_CODE: 1,
			// 			EMPLOYEE_NIK: 1,
			// 			USER_ROLE: 1,
			// 			LOCATION_CODE: 1,
			// 			REF_ROLE: 1,
			// 			PJS_JOB: 1,
			// 			PJS_FULLNAME: 1,
			// 			HRIS_FULLNAME: 1,
			// 			INSERT_TIME: 1,
			// 			UPDATE_TIME: 1,
			// 			DELETE_TIME: 1,
			// 			HRIS_JOB: "$HRIS[0].EMPLOYEE_POSITION",
			// 			HRIS_FULLNAME: "$HRIS[0].EMPLOYEE_FULLNAME",
			// 			PJS_JOB: "$PJS[0].JOB_CODE",
			// 			PJS_JOB: "$PJS[0].NAMA_LENGKAP"
			// 		}
			// 	},
			// 	{
			// 		"$limit": 1
			// 	}
			// ] );
			// return res.json( {
			// 	query: query,
			// 	message: "OK"
			// } );

			var auth = req.auth;
			var sync_mobile = await Models.SyncMobile
				.findOne( {
					INSERT_USER: auth.USER_AUTH_CODE,
					IMEI: auth.IMEI,
					TABEL_UPDATE: 'auth/contact'
				} )
				.sort( { 
					TGL_MOBILE_SYNC: -1 
				} )
				.limit( 1 );
			console.log( "SYNC MOBILE: ", sync_mobile );
			if ( sync_mobile) {
				var start_date = Libraries.Helper.date_format( String( sync_mobile.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
				var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDD' ); //+ '235959';
				console.log( start_date );
				console.log( end_date );
				var query = await Models.ViewUserAuth.find(
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
						USER_AUTH_CODE: 1,
						EMPLOYEE_NIK: 1,
						USER_ROLE: 1,
						LOCATION_CODE: 1,
						REF_ROLE: 1,
						PJS_JOB: 1,
						PJS_FULLNAME: 1,
						HRIS_JOB: 1,
						HRIS_FULLNAME: 1,
						INSERT_TIME: 1,
						UPDATE_TIME: 1,
						DELETE_TIME: 1
					} );

					console.log( query );
			}
			else {
				var start_date = 0;
				var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' );
				var query = await Models.ViewUserAuth
					.find({})
					.select( {
						USER_AUTH_CODE: 1,
						EMPLOYEE_NIK: 1,
						USER_ROLE: 1,
						LOCATION_CODE: 1,
						REF_ROLE: 1,
						PJS_JOB: 1,
						PJS_FULLNAME: 1,
						HRIS_JOB: 1,
						HRIS_FULLNAME: 1,
						INSERT_TIME: 1,
						UPDATE_TIME: 1,
						DELETE_TIME: 1
					} );

			}

			var temp_insert = [];
			var temp_update = [];
			var temp_delete = [];
			query.forEach( function( result ) {

				// console.log(result);

				var result = Object.keys(result).map(function(k) {
					return [+k, result[k]];
				});
				var JOB = '';
				var FULLNAME = '';

				result = result[3][1];
				
				if ( result.PJS_JOB ) {
					JOB = result.PJS_JOB;
				}
				else if( result.HRIS_JOB ) {
					JOB = String( result.HRIS_JOB );
				}
				
				if ( result.PJS_FULLNAME ) {
					FULLNAME = result.PJS_FULLNAME;
				}
				else if( result.HRIS_FULLNAME ) {
					FULLNAME = result.HRIS_FULLNAME;
				}

				if ( FULLNAME != '' ) {
					if ( result.DELETE_TIME >= start_date && result.DELETE_TIME <= end_date ) {
						temp_delete.push( {
							USER_AUTH_CODE: result.USER_AUTH_CODE,
							EMPLOYEE_NIK: result.EMPLOYEE_NIK,
							USER_ROLE: result.USER_ROLE,
							LOCATION_CODE: String( result.LOCATION_CODE ),
							REF_ROLE: result.REF_ROLE,
							JOB: JOB,
							FULLNAME: FULLNAME
						} );
					}

					if ( result.INSERT_TIME >= start_date && result.INSERT_TIME <= end_date ) {
						temp_insert.push( {
							USER_AUTH_CODE: result.USER_AUTH_CODE,
							EMPLOYEE_NIK: result.EMPLOYEE_NIK,
							USER_ROLE: result.USER_ROLE,
							LOCATION_CODE: String( result.LOCATION_CODE ),
							REF_ROLE: result.REF_ROLE,
							JOB: JOB,
							FULLNAME: FULLNAME
						} );
					}

					if ( result.UPDATE_TIME >= start_date && result.UPDATE_TIME <= end_date ) {
						temp_update.push( {
							USER_AUTH_CODE: result.USER_AUTH_CODE,
							EMPLOYEE_NIK: result.EMPLOYEE_NIK,
							USER_ROLE: result.USER_ROLE,
							LOCATION_CODE: String( result.LOCATION_CODE ),
							REF_ROLE: result.REF_ROLE,
							JOB: JOB,
							FULLNAME: FULLNAME
						} );
					}
				}
			} );
			
			if ( sync_mobile ) {
				res.json( {
					status: true,
					message: "Sync",
					data: {
						"hapus": temp_delete,
						"simpan": temp_insert,
						"ubah": temp_update
					}
				} );
			}
			else {
				res.json( {
					status: true,
					message: "First time sync",
					data: {
						"hapus": [],
						"simpan": temp_insert,
						"ubah": []
					}
				} );
			}
		};

	/**
	 * EBCC Kualitas Find
	 * Mengambil data TM_KUALITAS dari service EBCC Validation.
	 * --------------------------------------------------------------------------
	 */
		exports.ebcc_kualitas_find = ( req, res ) => {
		
			var auth = req.auth;
			var service_url = config.app.url[config.app.env].microservice_ebcc_validation;
			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'ebcc/kualitas'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data => {
				if ( data.length == 0 ) {
					var url = service_url + '/ebcc/kualitas';
					var args = {
						headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
					};

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						var insert = [];
						if ( data.data.length > 0 ) {
							insert = data.data;
						}
						
						return res.json( { 
							"status": data.status,
							"message": "First time sync",
							"data": {
								hapus: [],
								simpan: data.data,
								ubah: []
							}
						} );
					});
				}
				else {
					var dt = data[0];
					var start_date = Libraries.Helper.date_format( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' ).substr( 0, 8 );
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ).substr( 0, 8 );
					var args = {
						headers: { 
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization 
						}
					};
					var url = service_url + '/sync-mobile/kualitas/' + start_date + '/' + end_date;
					
					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						res.json( {
							status: data.status,
							message: data.message,
							data: data.data
						} );
					});
				}
				
			} ).catch( err => {
				console.log(err);
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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

	/**
	 * Finding Find
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.finding_find = ( req, res ) => {
			
			var auth = req.auth;
			var service_url = config.app.url[config.app.env].microservice_finding;

			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'finding'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data => {
				if ( data.length == 0 ) {
					var url = service_url + '/api/v1.1/finding';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						var insert = [];
						if ( data.data.length > 0 ) {
							insert = data.data;
						}
						
						return res.json( { 
							"status": data.status,
							"message": "First time sync",
							"data": {
								hapus: [],
								simpan: data.data,
								ubah: []
							}
						} );
					});
				}
				else {
					var dt = data[0];
					var start_date = Libraries.Helper.date_format( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDD' ) + '235959';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};
					var url = service_url + '/api/v1.1/sync-mobile/finding/' + start_date + '/' + end_date;

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						res.json( {
							status: data.status,
							message: data.message,
							data: data.data
						} );
					});
				}
				
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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

	/**
	 * Finding Images Find
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.finding_images_find = async ( req, res ) => {

			var auth = req.auth;
			var service_url = config.app.url[config.app.env].microservice_finding;
			var service_url_images = config.app.url[config.app.env].microservice_images;
			
			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'finding'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data => {
				if ( !data ) {
					return res.send( {
						status: false,
						message: 'Data not found 2',
						data: {}
					} );
				}

				if ( data.length > 0 ) {
					var dt = data[0];
					var start_date = Libraries.Helper.date_format( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
				}
				else {
					var start_date = 0;
				}
				
				var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDD' ) + '235959';
					
				// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization },
					requestConfig: {
						timeout: 3000, //request timeout in milliseconds
						noDelay: true, //Enable/disable the Nagle algorithm
						keepAlive: true, //Enable/disable keep-alive functionalityidle socket
					},
					responseConfig: {
						timeout: 3000
					}
				};

				var url = service_url + '/sync-mobile/finding-images/' + start_date + '/' + end_date;
				
				( new NodeRestClient() ).get( url, args, function ( data, response ) {
					if ( data.data.length > 0 ) {
						var trcode = [];
						for ( i = 0; i <= ( data.data.length - 1 ); i++ ) {
							trcode.push( String( data.data[i] ) );
						}

						console.log(trcode);
						var finding_images_url = service_url_images + '/sync-mobile/images';
						var finding_images_args = {
							data: {
								"TR_CODE": trcode
							},
							headers: { 
								"Content-Type": "application/json", 
								"Authorization": req.headers.authorization
							},
							requestConfig: {
								timeout: 10000, //request timeout in milliseconds
								noDelay: true, //Enable/disable the Nagle algorithm
								keepAlive: true, //Enable/disable keep-alive functionalityidle socket
							},
							responseConfig: {
								timeout: 10000
							}
						};
						( new NodeRestClient() ).post( finding_images_url, finding_images_args, function( data, response ) {
							res.json( {
								"status": data.status,
								"message": data.message,
								"data": {
									hapus: [],
									simpan: data.data,
									ubah: []
								}
							} );
						} );
					}
					else {
						res.json({
							"status": true,
							"message": 'Tidak ada data',
							"data": {
								hapus: [],
								simpan: [],
								ubah: []
							}
						});
					}
				})
				.on( 'error', function ( err ) {
					res.send( {
						status: false,
						message: 'Error!',
						data: {}
					} );
				} );
				
			} ).catch( err => {
				console.log(err);
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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

	/**
	 * Hectare Statement (HS) - Afdeling
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.hs_afdeling_find = ( req, res ) => {
			
			var auth = req.auth;
			var service_url = config.app.url[config.app.env].microservice_hectare_statement;

			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'hectare-statement/afdeling'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data => {
				if ( data.length == 0 ) {
					var url = service_url + '/afdeling';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						var insert = [];
						if ( data.data.length > 0 ) {
							insert = data.data;
						}
						
						return res.json( { 
							"status": data.status,
							"message": "First time sync",
							"data": {
								hapus: [],
								simpan: data.data,
								ubah: []
							}
						} );
					});
				}
				else {
					var dt = data[0];
					var start_date = Libraries.Helper.date_format( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDD' ) + '235959';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};
					var url = service_url + '/sync-mobile/afdeling/' + start_date + '/' + end_date;

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						res.json( {
							status: data.status,
							message: data.message,
							data: data.data
						} );
					});
				}
				
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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

	/**
	 * Hectare Statement (HS) - Block
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.hs_block_find = ( req, res ) => {
			
			var auth = req.auth;
			var service_url = config.app.url[config.app.env].microservice_hectare_statement;

			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'hectare-statement/block'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data => {
				if ( data.length == 0 ) {
					var url = service_url + '/block';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						var insert = [];
						if ( data.data.length > 0 ) {
							insert = data.data;
						}
						
						return res.json( { 
							"status": data.status,
							"message": "First time sync",
							"data": {
								hapus: [],
								simpan: data.data,
								ubah: []
							}
						} );
					});
				}
				else {
					var dt = data[0];
					var start_date = Libraries.Helper.date_format( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDD' ) + '235959';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};
					var url = service_url + '/sync-mobile/block/' + start_date + '/' + end_date;

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						res.json( {
							status: data.status,
							message: data.message,
							data: data.data
						} );
					});
				}
				
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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

	/**
	 * Hectare Statement (HS) - Comp
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.hs_comp_find = ( req, res ) => {
			
			var auth = req.auth;
			var service_url = config.app.url[config.app.env].microservice_hectare_statement;

			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'hectare-statement/comp'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data => {
				if ( data.length == 0 ) {
					var url = service_url + '/comp';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						var insert = [];
						if ( data.data.length > 0 ) {
							insert = data.data;
						}
						console.log( "RES: ", res );
						return res.json( { 
							"status": data.status,
							"message": "First time sync",
							"data": {
								hapus: [],
								simpan: data.data,
								ubah: []
							}
						} );
					});
				}
				else {
					var dt = data[0];
					var start_date = Libraries.Helper.date_format( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDD' ) + '235959';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};
					var url = service_url + '/sync-mobile/comp/' + start_date + '/' + end_date;

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						console.log( "RES: ", res );
						res.json( {
							status: data.status,
							message: data.message,
							data: data.data
						} );
					});
				}
				
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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

	/**
	 * Hectare Statement (HS) - Estate
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.hs_est_find = ( req, res ) => {
			
			var auth = req.auth;
			var service_url = config.app.url[config.app.env].microservice_hectare_statement;

			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'hectare-statement/est'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data => {
				if ( data.length == 0 ) {
					var url = service_url + '/est';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						var insert = [];
						if ( data.data.length > 0 ) {
							insert = data.data;
						}
						
						return res.json( { 
							"status": data.status,
							"message": "First time sync",
							"data": {
								hapus: [],
								simpan: data.data,
								ubah: []
							}
						} );
					});
				}
				else {
					var dt = data[0];
					var start_date = Libraries.Helper.date_format( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDD' ) + '235959';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};
					var url = service_url + '/sync-mobile/est/' + start_date + '/' + end_date;

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						res.json( {
							status: data.status,
							message: data.message,
							data: data.data
						} );
					});
				}
				
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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

	/**
	 * Hectare Statement (HS) - Land Use
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.hs_land_use_find = ( req, res ) => {
			
			var auth = req.auth;
			var service_url = config.app.url[config.app.env].microservice_hectare_statement;
			
			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'hectare-statement/land-use'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data => {
				if ( data.length == 0 ) {
					var url = service_url + '/land-use';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						var insert = [];
						if ( data.data.length > 0 ) {
							insert = data.data;
						}
						
						return res.json( { 
							"status": data.status,
							"message": "First time sync",
							"data": {
								hapus: [],
								simpan: data.data,
								ubah: []
							}
						} );
					});
				}
				else {
					var dt = data[0];
					var start_date = Libraries.Helper.date_format( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDD' ) + '235959';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};
					var url = service_url + '/sync-mobile/land-use/' + start_date + '/' + end_date;

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						res.json( {
							status: data.status,
							message: data.message,
							data: data.data
						} );
					});
				}
				
			} ).catch( err => {
				console.log(err);
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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

	/**
	 * Hectare Statement (HS) - Region
	 * ...
	 * --------------------------------------------------------------------------
	 */
		exports.hs_region_find = ( req, res ) => {
			
			var auth = req.auth;
			var service_url = config.app.url[config.app.env].microservice_hectare_statement;

			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'hectare-statement/region'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data => {
				if ( data.length == 0 ) {
					var url = service_url + '/region';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						var insert = [];
						if ( data.data.length > 0 ) {
							insert = data.data;
						}
						
						return res.json( { 
							"status": data.status,
							"message": "First time sync",
							"data": {
								hapus: [],
								simpan: data.data,
								ubah: []
							}
						} );
					});
				}
				else {
					var dt = data[0];
					var start_date = Libraries.Helper.date_format( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDD' ) + '235959';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};
					var url = service_url + '/sync-mobile/region/' + start_date + '/' + end_date;

					( new NodeRestClient() ).get( url, args, function ( data, response ) {
						res.json( {
							status: data.status,
							message: data.message,
							data: data.data
						} );
					});
				}
				
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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


	/**
	 * Content Find
	 * Mengambil data Content.
	 * --------------------------------------------------------------------------
	 */
		exports.content_find = ( req, res ) => {
			
			var auth = req.auth;
			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'auth/content'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data_sync => {

				console.log(data_sync);

				if ( !data_sync ) {
					Models.Content.find( {
						DELETE_USER: ""
					} )
					.select( {
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
						TM: 1,
						__v: 0
					} )
					.then( data_first_sync => {
						if( !data_first_sync ) {
							return res.send( {
								status: false,
								message: config.app.error_message.find_404,
								data: {}
							} );
						}

						return res.json( { 
							"status": true,
							"message": "First time sync",
							"data": {
								hapus: [],
								simpan: data_first_sync,
								ubah: []
							}
						} );
					} ).catch( err => {
						res.send( {
							status: false,
							message: config.app.error_message.find_500,
							data: {}
						} );
					} );
				}
				else {
					var start_date = data_sync[0].TGL_MOBILE_SYNC;
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' );

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
							message: 'Data Sync tanggal ' + Libraries.Helper.date_format( start_date, 'YYYY-MM-DD' ) + ' s/d ' + Libraries.Helper.date_format( end_date, 'YYYY-MM-DD' ),
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
				
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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

	/**
	 * Content Label Find
	 * Mengambil data Content.
	 * --------------------------------------------------------------------------
	 */
		exports.content_label_find = ( req, res ) => {

			var auth = req.auth;

			console.log({
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'auth/content-label'
			});
			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'auth/content-label'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data_sync => {

				if ( !data_sync ) {

					Models.ContentLabel.find( {
						DELETE_USER: ""
					} )
					.select( {
						_id: 0,
						CONTENT_LABEL_CODE: 1,
						CONTENT_CODE: 1,
						LABEL_NAME: 1,
						LABEL_ICON: 1,
						URUTAN_LABEL: 1,
						LABEL_SCORE: 1,
						WARNA_LABEL: 1
					} )
					.then( data_first_sync => {
						console.log(data_first_sync);

						if( !data_first_sync ) {
							return res.send( {
								status: false,
								message: config.app.error_message.find_404,
								data: {}
							} );
						}

						return res.json( { 
							"status": true,
							"message": "First time sync",
							"data": {
								hapus: [],
								simpan: data_first_sync,
								ubah: []
							}
						} );
					} ).catch( err => {
						console.log(err);
						return res.send( {
							status: false,
							message: config.app.error_message.find_500,
							data: {}
						} );
					} );
				}
				else {
					var start_date = data_sync[0].TGL_MOBILE_SYNC;
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' );
					
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
						CONTENT_LABEL_CODE: 1,
						CONTENT_CODE: 1,
						LABEL_NAME: 1,
						LABEL_ICON: 1,
						URUTAN_LABEL: 1,
						LABEL_SCORE: 1,
						WARNA_LABEL: 1
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
									CONTENT_LABEL_CODE: data.CONTENT_LABEL_CODE,
									CONTENT_CODE: data.CONTENT_CODE,
									LABEL_NAME: data.LABEL_NAME,
									LABEL_ICON: data.LABEL_ICON,
									URUTAN_LABEL: data.URUTAN_LABEL,
									LABEL_SCORE: data.LABEL_SCORE,
									WARNA_LABEL: data.WARNA_LABEL
								} );
							}

							if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
								temp_insert.push( {
									CONTENT_CODE: data.CONTENT_CODE,
									CONTENT_LABEL_CODE: data.CONTENT_LABEL_CODE,
									CONTENT_CODE: data.CONTENT_CODE,
									LABEL_NAME: data.LABEL_NAME,
									LABEL_ICON: data.LABEL_ICON,
									URUTAN_LABEL: data.URUTAN_LABEL,
									LABEL_SCORE: data.LABEL_SCORE,
									WARNA_LABEL: data.WARNA_LABEL
								} );
							}
							if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
								temp_update.push( {
									CONTENT_CODE: data.CONTENT_CODE,
									CONTENT_LABEL_CODE: data.CONTENT_LABEL_CODE,
									CONTENT_CODE: data.CONTENT_CODE,
									LABEL_NAME: data.LABEL_NAME,
									LABEL_ICON: data.LABEL_ICON,
									URUTAN_LABEL: data.URUTAN_LABEL,
									LABEL_SCORE: data.LABEL_SCORE,
									WARNA_LABEL: data.WARNA_LABEL
								} );
							}
						} );
						res.json({
							status: true,
							message: 'Data Sync tanggal ' + Libraries.Helper.date_format( start_date, 'YYYY-MM-DD' ) + ' s/d ' + Libraries.Helper.date_format( end_date, 'YYYY-MM-DD' ),
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
							message: err.message,
							data: {}
						} );
					});
				}
				
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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


	/**
	 * Kriteria Find
	 * Mengambil data Kriteria.
	 * --------------------------------------------------------------------------
	 */
		exports.kriteria_find = ( req, res ) => {
			
			var auth = req.auth;
			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'auth/kriteria'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data_sync => {
				if ( !data_sync ) {
					Models.Kriteria.find( {
						DELETE_USER: ""
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
					.then( data_first_sync => {
						if( !data_first_sync ) {
							return res.send( {
								status: false,
								message: config.app.error_message.find_404,
								data: {}
							} );
						}

						return res.json( { 
							"status": true,
							"message": "First time sync",
							"data": {
								hapus: [],
								simpan: data_first_sync,
								ubah: []
							}
						} );
					} ).catch( err => {
						console.log( err );
						return res.send( {
							status: false,
							message: config.app.error_message.find_500,
							data: {}
						} );
					} );
				}
				else {
					var start_date = data_sync[0].TGL_MOBILE_SYNC;
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' );

					Models.Kriteria.find( 
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
						KRITERIA_CODE: 1,
						COLOR: 1,
						GRADE: 1,
						BATAS_ATAS: 1,
						BATAS_BAWAH: 1,
						KONVERSI_ANGKA: 1,
						INSERT_USER: 1,
						INSERT_TIME: 1,
						UPDATE_USER: 1,
						UPDATE_TIME: 1,
						DELETE_USER: 1,
						DELETE_TIME: 1
					} )
					.then( data_insert => {
						console.log(data_insert);


						var temp_insert = [];
						var temp_update = [];
						var temp_delete = [];
						console.log( data_insert );
						data_insert.forEach( function( data ) {
							if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
								temp_delete.push( {
									KRITERIA_CODE: data.KRITERIA_CODE,
									COLOR: data.COLOR,
									GRADE: data.GRADE,
									BATAS_ATAS: data.BATAS_ATAS,
									BATAS_BAWAH: data.BATAS_BAWAH,
									KONVERSI_ANGKA: data.KONVERSI_ANGKA,
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
									KRITERIA_CODE: data.KRITERIA_CODE,
									COLOR: data.COLOR,
									GRADE: data.GRADE,
									BATAS_ATAS: data.BATAS_ATAS,
									BATAS_BAWAH: data.BATAS_BAWAH,
									KONVERSI_ANGKA: data.KONVERSI_ANGKA,
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
									KRITERIA_CODE: data.KRITERIA_CODE,
									COLOR: data.COLOR,
									GRADE: data.GRADE,
									BATAS_ATAS: data.BATAS_ATAS,
									BATAS_BAWAH: data.BATAS_BAWAH,
									KONVERSI_ANGKA: data.KONVERSI_ANGKA,
									INSERT_USER: data.INSERT_USER,
									INSERT_TIME: Libraries.Helper.date_format(data.INSERT_TIME, 'YYYY-MM-DD hh:mm:ss' ),
									UPDATE_USER: data.UPDATE_USER,
									UPDATE_TIME: Libraries.Helper.date_format(data.UPDATE_TIME, 'YYYY-MM-DD hh:mm:ss' ),
									DELETE_USER: data.DELETE_USER,
									DELETE_TIME: Libraries.Helper.date_format(data.DELETE_TIME, 'YYYY-MM-DD hh:mm:ss' )
								} );
							}
						} );
						return res.json({
							status: true,
							message: 'Data Sync tanggal ' + Libraries.Helper.date_format( start_date, 'YYYY-MM-DD' ) + ' s/d ' + Libraries.Helper.date_format( end_date, 'YYYY-MM-DD' ),
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
							message: err.message,
							data: {}
						} );
					});
				}
				
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
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

	/**
	 * Reset
	 * Untuk mereset data user sesuai token di tabel TM_MOBILE_SYNC.
	 * --------------------------------------------------------------------------
	 */
		exports.reset = ( req, res ) => {

			if ( !req.body ) {
				return res.send({
					status: false,
					message: 'Invalid input',
					data: {}
				});
			}

			var auth = req.auth;
			if ( req.body.RESET_SYNC == 1 ) {
				Models.SyncMobile.deleteMany( { INSERT_USER : auth.USER_AUTH_CODE } )
				.then( data => {
					if( !data ) {
						return res.status( 404 ).send( {
							status: false,
							message: "Data not found 2 with id " + req.params.id,
							data: {}
						} );
					}
					return res.send( {
						status: true,
						message: 'Success! Sync berhasil direset',
						data: {}
					} );
				}).catch( err => {
					if( err.kind === 'ObjectId' || err.name === 'NotFound' ) {
						return res.status(404).send({
							status: false,
							message: "Data not found 1 with id " + req.params.id,
							data: {}
						} );
					}
					return res.status( 500 ).send( {
						status: false,
						message: "Could not delete data with id " + req.params.id,
						data: {}
					} );
				} );
			}
			else if ( req.body.RESET_SYNC == 0 ) {
				return res.send( {
					status: true,
					message: 'Success! Sync tidak direset',
					data: {}
				} );
			}
			else {
				return res.send( {
					status: false,
					message: 'Error! Kode salah.',
					data: {}
				} );
			}
		};

