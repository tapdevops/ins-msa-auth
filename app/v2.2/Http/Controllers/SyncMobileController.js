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
		Helper: require( _directory_base + '/app/v2.0/Http/Libraries/Helper.js' )
	}

 	// Models
	const Models = {
		Kriteria: require( _directory_base + '/app/v2.0/Http/Models/KriteriaModel.js' ),
		Content: require( _directory_base + '/app/v2.0/Http/Models/ContentModel.js' ),
		Category: require( _directory_base + '/app/v2.0/Http/Models/CategoryModel.js' ),
		ContentLabel: require( _directory_base + '/app/v2.0/Http/Models/ContentLabelModel.js' ),
		SyncMobile: require( _directory_base + '/app/v2.0/Http/Models/SyncMobileModel.js' ),
		SyncMobileLog: require( _directory_base + '/app/v2.0/Http/Models/SyncMobileLogModel.js' ),
		UserAuth: require( _directory_base + '/app/v2.0/Http/Models/UserAuthModel.js' ),
		ViewUserAuth: require( _directory_base + '/app/v2.0/Http/Models/ViewUserAuthModel.js' )
	}

	// Node Module
	var Client = require('node-rest-client').Client;
	var client = new Client();
	const axios = require('axios');

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
					message: err.message, //'Error retrieving data',
					data: {}
				} );
			} );
		};
	/**
	 * Notification Find
	 * Untuk sync data notification.
	 * --------------------------------------------------------------------------
	 */

	exports.notificationFind = async ( req, res ) => {
		let auth = req.auth;
		var findingServiceUrl = config.app.url[config.app.env].microservice_finding;
		Models.SyncMobile.findOne( {
			INSERT_USER: auth.USER_AUTH_CODE,
			IMEI: auth.IMEI,
			TABEL_UPDATE: 'notification'
		} )
		.sort( { 
			TGL_MOBILE_SYNC: -1 
		} )
		.limit( 1 )
		.then( async (dataSync) => {
			let startDate = 0;
			let endDate = 99991231235959;
			if(dataSync) {
				startDate = dataSync.TGL_MOBILE_SYNC;
				endDate = parseInt(Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ));
			}
			axios.defaults.headers.common['Authorization'] = req.headers.authorization;
			// axios.get(findingServiceUrl + '/api/v2.1/notification', {
			axios.get(`${findingServiceUrl}/api/v2.1/notification/${startDate}/${endDate}`)
			.then(function (response) {
				return res.send({
					status: true,
					message: 'Success',
					data: response.data.data
				});
			})
			.catch(function (error) {
				console.log(error);
				return res.send({
					status: false,
					message: 'Internal server error',
					data: {}
				} );
			});
		})
		.catch(err => {
			console.log(err);
			return res.send({
				status: false,
				message: 'Internal server error',
				data: {}
			} );
		});
	}
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
			
			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'auth/contact'
			} )
			.sort( { 
				TGL_MOBILE_SYNC: -1 
			} )
			.limit( 1 )
			.then( data_sync => {
				var query_aggregate = {};
				if ( data_sync.length != 0 ) {
					var start_date = data_sync[0].TGL_MOBILE_SYNC;
					var end_date = parseInt(Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ));
					query_aggregate = {
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
					};
				}
				Models.ViewUserAuth.find( query_aggregate ).select( {
					_id: 1,
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
					DELETE_TIME: 1,
					__v: 1
				} )
				.then( data_insert => {
					var temp_insert = [];
					var temp_update = [];
					var temp_delete = [];
					
					data_insert.forEach( function( data ) { 
						if ( start_date && end_date  ) {
							if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
								temp_delete.push( {
									USER_AUTH_CODE: data.USER_AUTH_CODE,
									EMPLOYEE_NIK: data.EMPLOYEE_NIK,
									USER_ROLE: data.USER_ROLE,
									LOCATION_CODE: String( data.LOCATION_CODE ),
									REF_ROLE: data.REF_ROLE,
									JOB:  data.HRIS_JOB ? data.HRIS_JOB : data.PJS_JOB ? data.PJS_JOB : ""  ,
									FULLNAME:  data.HRIS_FULLNAME ? data.HRIS_FULLNAME : data.PJS_FULLNAME ?  data.PJS_FULLNAME : ""  
								} );
							}
							if ( data.INSERT_TIME >= start_date && data.INSERT_TIME <= end_date ) {
								temp_insert.push( {
									USER_AUTH_CODE: data.USER_AUTH_CODE,
									EMPLOYEE_NIK: data.EMPLOYEE_NIK,
									USER_ROLE: data.USER_ROLE,
									LOCATION_CODE: String( data.LOCATION_CODE ),
									REF_ROLE: data.REF_ROLE,
									JOB:  data.HRIS_JOB ? data.HRIS_JOB : data.PJS_JOB ? data.PJS_JOB : ""  ,
									FULLNAME:  data.HRIS_FULLNAME ? data.HRIS_FULLNAME : data.PJS_FULLNAME ?  data.PJS_FULLNAME : ""  
								} );								
							}
							if ( data.UPDATE_TIME >= start_date && data.UPDATE_TIME <= end_date ) {
								temp_update.push( {
									USER_AUTH_CODE: data.USER_AUTH_CODE,
									EMPLOYEE_NIK: data.EMPLOYEE_NIK,
									USER_ROLE: data.USER_ROLE,
									LOCATION_CODE: String( data.LOCATION_CODE ),
									REF_ROLE: data.REF_ROLE,
									JOB:  data.HRIS_JOB ? data.HRIS_JOB : data.PJS_JOB ? data.PJS_JOB : ""  ,
									FULLNAME:  data.HRIS_FULLNAME ? data.HRIS_FULLNAME : data.PJS_FULLNAME ?  data.PJS_FULLNAME : ""  
								} );
							}
						}
						else {
							temp_insert.push( {
								USER_AUTH_CODE: data.USER_AUTH_CODE,
								EMPLOYEE_NIK: data.EMPLOYEE_NIK,
								USER_ROLE: data.USER_ROLE,
								LOCATION_CODE: String( data.LOCATION_CODE ),
								REF_ROLE: data.REF_ROLE,
								JOB:  data.HRIS_JOB ? data.HRIS_JOB : data.PJS_JOB ? data.PJS_JOB : ""  ,
								FULLNAME:  data.HRIS_FULLNAME ? data.HRIS_FULLNAME : data.PJS_FULLNAME ?  data.PJS_FULLNAME : ""  
							} );
						}
					} );
					let message_first_sync = "First time sync";
					res.json( {
						status: true,
						message: !start_date ? message_first_sync : 'Data Sync tanggal ' + Libraries.Helper.date_format( start_date, 'YYYY-MM-DD' ) + ' s/d ' + Libraries.Helper.date_format( end_date, 'YYYY-MM-DD' ),
						data: {
							"hapus": temp_delete,
							"simpan": temp_insert,
							"ubah": temp_update
						}
					} );
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

			} );
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
					var url = service_url + '/api/v2.0/ebcc/kualitas';
					var args = {
						headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
					};
					client.get( url, args, function ( data, response ) {
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
					
					client.get( url, args, function ( data, response ) {
						res.json( {
							status: data.status,
							message: data.message,
							data: data.data
						} );
					});
				}
			} ).catch( err => {
				console.log( err );
				if( err.kind === 'ObjectId' ) {
					return res.send( {
						status: false,
						message: 'ObjectId Error',
						data: {}
					} );
				}
				return res.send( {
					status: false,
					message: err.message,
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
				console.log(data);
				if ( data.length == 0 ) {
					var url = service_url + '/api/v2.0/finding';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};
					console.log(url);
					let request = client.get( url, args, function ( data, response ) {
						var insert = [];
						if(data.data) {
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
						} else {
							return res.send({
								status:false,
								message: "periksa url: " + url,
								data:[]
							});
						}
					});
					request.on('requestTimeout', function (req) {
						console.log('request has expired');
						req.abort();
					});
					 
					request.on('responseTimeout', function (res) {
						console.log('response has expired');
					 
					});
					 
					//it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
					request.on('error', function (err) {
						console.log('request error', err);
						return res.send({
							status: false,
							message: err.message,
							data: []
						})
					});
				}
				else {
					var dt = data[0];
					var start_date = Libraries.Helper.date_format( dt.TGL_MOBILE_SYNC.toString(), 'YYYYMMDDhhmmss' );
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDD' );
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};
					var urlFindingWithDate = service_url + '/api/v2.0/sync-mobile/finding/' + start_date + '/' + end_date;
					console.log(urlFindingWithDate);
					let request = client.get( urlFindingWithDate, args, function ( data, response ) {
						if(data.data) {
							res.json( {
								status: data.status,
								message: data.message,
								data: data.data
							} );
						} else {
							return res.send({
								status: false,
								message: 'Periksa service ' + urlFindingWithDate,
								data: []
							});
						}
						
					});
					request.on('requestTimeout', function (req) {
						console.log('request has expired');
						req.abort();
					});
					 
					request.on('responseTimeout', function (res) {
						console.log('response has expired');
					});
					 
					//it's usefull to handle request errors to avoid, for example, socket hang up errors on request timeouts
					request.on('error', function (err) {
						console.log('request error', err);
						return res.send({
							status: false,
							message: err,
							data: []
						})
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
				console.log(err);
				return res.send( {
					status: false,
					message: err.message,//'Error retrieving data',
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
				TABEL_UPDATE: 'finding-image'
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
					var start_date = Libraries.Helper.date_format( dt.TGL_MOBILE_SYNC.toString(), 'YYYYMMDDhhmmss' );
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
				
				client.get( url, args, function ( data, response ) {
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
						client.post( finding_images_url, finding_images_args, function( data, response ) {
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
					message: err.message,
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

					client.get( url, args, function ( data, response ) {
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

					client.get( url, args, function ( data, response ) {
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
					message: err.message,
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
					var url = service_url + '/api/v2.1/block';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};

					client.get( url, args, function ( data, response ) {
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
					var end_date = Libraries.Helper.date_format( 'now', 'YYYYMMDD' ).substr( 0, 8 ) + '235959';
					var args = {
						headers: {
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						}
					};
					var url = service_url + '/api/v2.2/sync-mobile/block/' + start_date + '/' + end_date;

					client.get( url, args, function ( data, response ) {
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
					message: err.message,
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

					client.get( url, args, function ( data, response ) {
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

					client.get( url, args, function ( data, response ) {
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
					message: err.message,
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

					client.get( url, args, function ( data, response ) {
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

					client.get( url, args, function ( data, response ) {
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
					message: err.message,
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

					client.get( url, args, function ( data, response ) {
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

					client.get( url, args, function ( data, response ) {
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
					message: err.message,
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

					client.get( url, args, function ( data, response ) {
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

					client.get( url, args, function ( data, response ) {
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
					message: err.message,
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
				var query_aggregate = {}
				if( data_sync.length != 0 ){
					var start_date = data_sync[0].TGL_MOBILE_SYNC;
					var end_date = parseInt(Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ));
					query_aggregate = {
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
					};
				}
				Models.Content.find( query_aggregate ).select( {
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
					data_insert.forEach( function( data ) {
						if( start_date && end_date ){
							if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
								temp_delete.push( {
									CONTENT_CODE: data.CONTENT_CODE,
									GROUP_CATEGORY: data.GROUP_CATEGORY,
									CATEGORY: data.CATEGORY,
									CONTENT_NAME: data.CONTENT_NAME,
									CONTENT_TYPE: data.CONTENT_TYPE,
									UOM: data.UOM,
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
									UOM: data.UOM,
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
									UOM: data.UOM,
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
						}
						else {
							temp_insert.push( {
								CONTENT_CODE: data.CONTENT_CODE,
								GROUP_CATEGORY: data.GROUP_CATEGORY,
								CATEGORY: data.CATEGORY,
								CONTENT_NAME: data.CONTENT_NAME,
								CONTENT_TYPE: data.CONTENT_TYPE,
								UOM: data.UOM,
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
					let message_first_sync = "First time sync";
					res.json({
						status: true,
						message: !start_date ? message_first_sync : 'Data Sync tanggal ' + Libraries.Helper.date_format( start_date, 'YYYY-MM-DD' ) + ' s/d ' + Libraries.Helper.date_format( end_date, 'YYYY-MM-DD' ),
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

			} );
		};

	/**
	 * Content Label Find
	 * Mengambil data Content.
	 * --------------------------------------------------------------------------
	 */
		exports.content_label_find = ( req, res ) => {

			var auth = req.auth;

			Models.SyncMobile.find( {
				INSERT_USER: auth.USER_AUTH_CODE,
				IMEI: auth.IMEI,
				TABEL_UPDATE: 'auth/content-label'
			} )
			.sort( { TGL_MOBILE_SYNC: -1 } )
			.limit( 1 )
			.then( data_sync => {

				console.log(data_sync);

				if ( data_sync.length == 0 ) {

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
						console.log(err);
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
					message: err.message,
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
				if ( data_sync.length == 0 ) {
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
					var end_date = parseInt(Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ));

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
						var temp_insert = [];
						var temp_update = [];
						var temp_delete = [];
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
					message: err.message,
					data: {}
				} );
			} );
			
		};
	
		/**
	 * Category Find
	 * Mengambil data Category
	 * --------------------------------------------------------------------------
	 */
	exports.category_find = ( req, res ) => {
			
		var auth = req.auth;
		Models.SyncMobile.find( {
			INSERT_USER: auth.USER_AUTH_CODE,
			IMEI: auth.IMEI,
			TABEL_UPDATE: 'auth/category'
		} )
		.sort( { TGL_MOBILE_SYNC: -1 } )
		.limit( 1 )
		.then( data_sync => {
			if ( data_sync.length == 0 ) {
				Models.Category.find( {
					DELETE_TIME: 0
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
					if ( config.app.env == 'prod' ) {
						var path_global = req.protocol + '://' + req.get( 'host' ) + '/' + config.app.path.prod + '/';
					}
					else if ( config.app.env == 'qa' ) {
						var path_global = req.protocol + '://' + req.get( 'host' ) + '/' + config.app.path.qa + '/';
					}
					else if ( config.app.env == 'dev' ) {
						var path_global = req.protocol + '://' + req.get( 'host' ) + '/' + config.app.path.dev + '/' ;
					}
					let temp_insert_first = [];
					data_first_sync.forEach( function( data_category ) {
						var path = 'files/images/category/' + data_category.ICON;
						temp_insert_first.push( {
							CATEGORY_CODE: data_category.CATEGORY_CODE,
							CATEGORY_NAME: data_category.CATEGORY_NAME,
							ICON: data_category.ICON,
							ICON_URL: path_global + path
						} ) ;
					} )
					

					return res.json( { 
						"status": true,
						"message": "First time sync",
						"data": {
							hapus: [],
							simpan: temp_insert_first,
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
				var end_date = parseInt( Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );

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
					DELETE_TIME: 1,
					__v: 1
				} )
				.then( data_insert => {
					console.log(data_insert);
					var temp_insert = [];
					var temp_update = [];
					var temp_delete = [];
					if ( config.app.env == 'prod' ) {
						var path_global = req.protocol + '://' + req.get( 'host' ) + '/' + config.app.path.prod + '/';
					}
					else if ( config.app.env == 'qa' ) {
						var path_global = req.protocol + '://' + req.get( 'host' ) + '/' + config.app.path.qa + '/';
					}
					else if ( config.app.env == 'dev' ) {
						var path_global = req.protocol + '://' + req.get( 'host' ) + '/' + config.app.path.dev + '/' ;
					}
					data_insert.forEach( function( data ) {

						
					var path = 'files/images/category/' + data.ICON;

						if ( data.DELETE_TIME >= start_date && data.DELETE_TIME <= end_date ) {
							temp_delete.push( {
								CATEGORY_CODE: data.CATEGORY_CODE,
								CATEGORY_NAME: data.CATEGORY_NAME,
								ICON: data.ICON,
								ICON_URL: path_global + path,
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
								ICON_URL: path_global + path,
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
								ICON_URL: path_global + path,
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
				message: err.message,
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
				Models.SyncMobile.deleteMany( { 
					INSERT_USER : auth.USER_AUTH_CODE,
					IMEI: auth.IMEI, 
					TABEL_UPDATE: { $ne: "notification" } //history sync notification tidak dihapus
				 } )
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
					message: err.message,
					data: {}
				} );
			}
		};

