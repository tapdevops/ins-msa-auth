const mobileSyncModel = require( '../models/mobileSync.js' );
const mobileSyncLogModel = require( '../models/mobileSyncLog.js' );
const viewUserAuthModel = require( '../models/viewUserAuth.js' );
const kriteriaModel = require( '../models/kriteria.js' );

const querystring = require('querystring');
const url = require( 'url' );
const jwt = require( 'jsonwebtoken' );
const config = require( '../../config/config.js' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const jwtDecode = require( 'jwt-decode' );
const Client = require('node-rest-client').Client; 
const moment_pure = require( 'moment' );
const moment = require( 'moment-timezone' );
const date = require( '../libraries/date.js' );

// Find Contact
exports.findContact = async ( req, res ) => {

	var auth = req.auth;
	var mobileSync = await mobileSyncModel
		.find( {
			INSERT_USER: auth.USER_AUTH_CODE,
			IMEI: auth.IMEI,
			TABEL_UPDATE: 'auth/contact'
		} )
		.sort( { TGL_MOBILE_SYNC: -1 } )
		.limit( 1 );

	if ( mobileSync.length > 0 ) {
		
		var start_date = date.convert( String( mobileSync.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
		var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' );
		var query = await viewUserAuthModel
			.find({
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
			})
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
	else {
		var start_date = 0;
		var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' );
		var query = await viewUserAuthModel
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
	} );
	
	if ( mobileSync.length > 0 ) {
		res.json( {
			status: true,
			message: "Data Sync",
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

// Find Region
exports.findEBCCKualitas = ( req, res ) => {
	
	var auth = req.auth;

	mobileSyncModel.find( {
		INSERT_USER: auth.USER_AUTH_CODE,
		IMEI: auth.IMEI,
		TABEL_UPDATE: 'ebcc/kualitas'
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
			var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' ).substr( 0, 8 );
			var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' ).substr( 0, 8 );
			var client = new Client();
			var args = {
				headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
			};
			var url = config.url.microservices.ebcc_validation + '/sync-mobile/kualitas/';
			var url_final = url + start_date + '/' + end_date;
			
			client.get( url_final, args, function ( data, response ) {
				res.json( {
					status: data.status,
					message: data.message,
					data: data.data
				} );
			});
		}
		else {
			var url = config.url.microservices.ebcc_validation + '/ebcc/kualitas';
			var client = new Client();
			var args = {
				headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
			};

			client.get( url, args, function ( data, response ) {
				var insert = [];
				if ( data.data.length > 0 ) {
					insert = data.data;
				}
				
				res.json( { 
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

// Find Region
exports.findRegion = ( req, res ) => {
	
	var auth = req.auth;

	mobileSyncModel.find( {
		INSERT_USER: auth.USER_AUTH_CODE,
		IMEI: auth.IMEI,
		TABEL_UPDATE: 'hectare-statement/region'
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

		console.log( data );
		if ( data.length > 0 ) {
			// Terdapat data di T_MOBILE_SYNC dengan USER_AUTH_CODE dan IMEI
			var dt = data[0];
			var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' );
			var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' );
			
			// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
			var client = new Client();
			var args = {
				headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
			};
			var parent_ms = 'hectare-statement';
			var target_ms = 'region';
			var url = config.url.microservices.hectare_statement + '/sync-mobile/' + target_ms + '/';
			var url_final = url + start_date + '/' + end_date;
			console.log(url_final)
			client.get( url_final, args, function ( data, response ) {
				res.json( {
					status: data.status,
					message: data.message,
					data: data.data
				} );
			});
		}
		else {
			// Tidak ada data yang ditemukan, baru pertama kali sync
			var url = config.url.microservices.hectare_statement + '/region';
			console.log(url);
			//var url = config.url.microservices.masterdata_region;
			var client = new Client();
			var args = {
				headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
			};

			client.get( url, args, function (data, response) {
				// parsed response body as js object
				var insert = [];
				if ( data.data.length > 0 ) {
					insert = data.data;
				}
				
				res.json( { 
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

// Find 
exports.find = ( req, res ) => {
	nJwt.verify( req.token, config.secret_key, config.token_algorithm, ( err, authData ) => {
		if ( err ) {
			res.send({
				status: false,
				message: "Invalid Token",
				data: {}
			} );
		}
		else {
			var auth = jwtDecode( req.token );

			mobileSyncModel.find( {
				INSERT_USER: auth.USER_AUTH_CODE
			})
			.select( {
				_id: 0,
				TGL_MOBILE_SYNC: 1,
				TABEL_UPDATE: 1,
				IMEI: 1
			} )
			.then( data => {
				if ( !data ) {
					return res.send( {
						status: false,
						message: 'Data error',
						data: {}
					} );
				}

				var response = [];

				data.forEach( function( result ) {
					response.push( {
						TGL_MOBILE_SYNC: date.convert( String( result.TGL_MOBILE_SYNC ), 'YYYY-MM-DD hh-mm-ss' ),
						TABEL_UPDATE: result.TABEL_UPDATE,
						IMEI: result.IMEI,
					} );
				} );

				res.send( {
					status: true,
					message: "Success",
					data: response
				} )
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
		}
	} );
};

// Create
exports.create = ( req, res ) => {

	if ( !req.body.TGL_MOBILE_SYNC || !req.body.TABEL_UPDATE ) {
		return res.send({
			status: false,
			message: 'Invalid input',
			data: {}
		});
	}

	var auth = req.auth;
	const set = new mobileSyncModel({
		TGL_MOBILE_SYNC: date.convert( req.body.TGL_MOBILE_SYNC, 'YYYYMMDDhhmmss' ),
		TABEL_UPDATE: req.body.TABEL_UPDATE || "",
		IMEI: auth.IMEI,
		INSERT_USER: auth.USER_AUTH_CODE,
		INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
	});

	set.save()
	.then( data => {
		if ( !data ) {
			return res.send( {
				status: false,
				message: 'Data error',
				data: {}
			} );
		}

		const set_log = new mobileSyncLogModel({
			TGL_MOBILE_SYNC: date.convert( req.body.TGL_MOBILE_SYNC, 'YYYYMMDDhhmmss' ),
			TABEL_UPDATE: req.body.TABEL_UPDATE || "",
			IMEI: auth.IMEI,
			INSERT_USER: auth.USER_AUTH_CODE,
			INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
		});

		set_log.save()
		.then( data_log => {
			res.send({
				status: true,
				message: config.error_message.find_200,
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

// Status
exports.status = ( req, res ) => {

	if ( !req.body ) {
		return res.send({
			status: false,
			message: 'Invalid inputz',
			data: {}
		});
	}

	var auth = req.auth;
	if ( req.body.RESET_SYNC == 1 ) {
		mobileSyncModel.deleteMany( { INSERT_USER : auth.USER_AUTH_CODE } )
		.then( data => {
			if( !data ) {
				return res.status( 404 ).send( {
					status: false,
					message: "Data not found 2 with id " + req.params.id,
					data: {}
				} );
			}
			res.send( {
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
		res.send( {
			status: true,
			message: 'Success! Sync tidak direset',
			data: {}
		} );
	}

};

/*
|--------------------------------------------------------------------------
| Clear Function
|--------------------------------------------------------------------------
*/
	// Find Finding
	exports.findFindingImages = async ( req, res ) => {
		console.log(req.auth);
		
		var auth = req.auth;
		
		mobileSyncModel.find( {
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
				// Terdapat data di T_MOBILE_SYNC dengan USER_AUTH_CODE dan IMEI
				var dt = data[0];
				//var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' );
				var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
			}
			else {
				var start_date = 0;
			}
			
			var end_date = date.convert( 'now', 'YYYYMMDD' ) + '235959';
				
			// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
			var client = new Client();
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
			var parent_ms = 'finding';
			var target_ms = '';
			var url = config.url.microservices.finding + '/sync-mobile/finding-images/';
			var url_final = url + start_date + '/' + end_date;
			
			console.log(url_final);

			client.get( url_final, args, function ( data, response ) {
				
				console.log(data);
				if ( data.data.length > 0 ) {
					var trcode = [];
					for ( i = 0; i <= ( data.data.length - 1 ); i++ ) {
						trcode.push( String( data.data[i] ) );
					}

					var finding_images = new Client();
					var finding_images_url = config.url.microservices.images + '/sync-mobile/images';
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
					console.log( finding_images_args );
					finding_images.post( finding_images_url, finding_images_args, function( data, response ) {
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
				//res.json({
				//	data: data.data
				//})
				var dt = data.data;
				var results = [];
				//dt.foreach( function( result ) {
				//	console.log( result );
				//} );
				/*
				if ( data.data.length == 0 ) {
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
				else {
					var results = [];
					var data_response = data.data;

					res.json({
						d: data_response
					})
					/*
					data_response.forEach( function( result ) {
						results.push( result );
						console.log(result);
					} );

					var finding_images = new Client();
					var finding_images_url = config.url.microservices.images + '/sync-mobile/images';
					var finding_images_args = {
						data: {
							"TR_CODE": results
						},
						headers: { 
							"Content-Type": "application/json", 
							"Authorization": req.headers.authorization
						},
						requestConfig: {
							timeout: 500, //request timeout in milliseconds
							noDelay: true, //Enable/disable the Nagle algorithm
							keepAlive: true, //Enable/disable keep-alive functionalityidle socket
						},
						responseConfig: {
							timeout: 500
						}
					};

					finding_images.post( finding_images_url, finding_images_args, function( data, response ) {
						res.json( {
							"status": data.status,
							"message": data.message,
							"data": {
								hapus: [],
								simpan: data.data,
								ubah: []
							}
						} );
					} )
					.on( 'requestTimeout', function ( req ) {
						//req.abort();
						res.send( {
							status: false,
							message: 'Request Timeout',
							data: {}
						} );
					} )
					.on( 'responseTimeout', function ( res ) {
						res.send( {
							status: false,
							message: 'Response Timeout',
							data: {}
						} );
					} )
					.on( 'error', function ( err ) {
						res.send( {
							status: false,
							message: 'Error Login!',
							data: {}
						} );
					} );
					*/
				//}

			})
			.on( 'error', function ( err ) {
				res.send( {
					status: false,
					message: 'Error!',
					data: {}
				} );
			} );
			
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

	// Find Finding
	exports.findFinding = ( req, res ) => {
		
		var auth = req.auth;

		mobileSyncModel.find( {
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
				// Terdapat data di T_MOBILE_SYNC dengan USER_AUTH_CODE dan IMEI
				var dt = data[0];
				var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
				var end_date = date.convert( 'now', 'YYYYMMDD' ).substr( 0, 8 ) + '235959';

				console.log( 'Start date: ' + start_date )
				console.log( String( dt.TGL_MOBILE_SYNC ).substr(0,8) )
				console.log( 'End Date: ' + end_date );
				
				// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};
				var parent_ms = 'finding';
				var target_ms = '';
				var url = config.url.microservices.finding + '/sync-mobile/finding' + target_ms + '/';
				var url_final = url + start_date + '/' + end_date;

				console.log( url_final );

				client.get( url_final, args, function ( data, response ) {
					res.json( {
						status: data.status,
						message: data.message,
						data: data.data
					} );
				});
			}
			else {
				// Tidak ada data yang ditemukan, baru pertama kali sync
				var url = config.url.microservices.finding + '/finding';
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};
				console.log(url);
				client.get( url, args, function (data, response) {
					// parsed response body as js object
					var insert = [];
					
					res.json( { 
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

	// Find Region
	exports.findEst = ( req, res ) => {
		
		var auth = req.auth;
		
		mobileSyncModel.find( {
			INSERT_USER: auth.USER_AUTH_CODE,
			IMEI: auth.IMEI,
			TABEL_UPDATE: 'hectare-statement/est'
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

				// Terdapat data di T_MOBILE_SYNC dengan USER_AUTH_CODE dan IMEI
				var dt = data[0];
				var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
				//var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' );
				var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' );
				
				// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};
				var parent_ms = 'hectare-statement';
				var target_ms = 'est';
				var url = config.url.microservices.hectare_statement + '/sync-mobile/' + target_ms + '/';
				var url_final = url + start_date + '/' + end_date;

				client.get( url_final, args, function ( data, response ) {
					res.json( {
						status: data.status,
						message: data.message,
						data: data.data
					} );
				});
			}
			else {
				// Tidak ada data yang ditemukan, baru pertama kali sync
				
				var url = config.url.microservices.hectare_statement + '/est';
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};

				client.get( url, args, function (data, response) {
					// parsed response body as js object
					var insert = [];
					if ( data.data.length > 0 ) {
						insert = data.data;
					}
					res.json( { 
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

	// Find Afdeling
	exports.findAfd = ( req, res ) => {
		
		var auth = req.auth;
		
		mobileSyncModel.find( {
			INSERT_USER: auth.USER_AUTH_CODE,
			IMEI: auth.IMEI,
			TABEL_UPDATE: 'hectare-statement/afdeling'
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

				// Terdapat data di T_MOBILE_SYNC dengan USER_AUTH_CODE dan IMEI
				var dt = data[0];
				var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
				//var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' );
				var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' );
				
				// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};
				var parent_ms = 'hectare-statement';
				var target_ms = 'afdeling';
				var url = config.url.microservices.hectare_statement + '/sync-mobile/' + target_ms + '/';
				var url_final = url + start_date + '/' + end_date;

				client.get( url_final, args, function ( data, response ) {
					res.json( {
						status: data.status,
						message: data.message,
						data: data.data
					} );
				});
			}

			else {
				// Tidak ada data yang ditemukan, baru pertama kali sync
				
				var url = config.url.microservices.hectare_statement + '/afdeling';
				console.log( url );
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};

				client.get( url, args, function (data, response) {
					// parsed response body as js object
					var insert = [];
					if ( data.data.length > 0 ) {
						insert = data.data;
					}
					res.json( { 
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

	// Find Block
	exports.findBlock = ( req, res ) => {
		
		var auth = req.auth;
		
		mobileSyncModel.find( {
			INSERT_USER: auth.USER_AUTH_CODE,
			IMEI: auth.IMEI,
			TABEL_UPDATE: 'hectare-statement/block'
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

				// Terdapat data di T_MOBILE_SYNC dengan USER_AUTH_CODE dan IMEI
				var dt = data[0];
				var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
				//var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' );
				var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' );
				
				// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};
				var parent_ms = 'hectare-statement';
				var target_ms = 'block';
				var url = config.url.microservices.hectare_statement + '/sync-mobile/' + target_ms + '/';
				var url_final = url + start_date + '/' + end_date;

				client.get( url_final, args, function ( data, response ) {
					res.json( {
						status: data.status,
						message: data.message,
						data: data.data
					} );
				});
			}
			else {
				// Tidak ada data yang ditemukan, baru pertama kali sync
				
				var url = config.url.microservices.hectare_statement + '/block';
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};

				client.get( url, args, function (data, response) {
					// parsed response body as js object
					var insert = [];
					if ( data.data.length > 0 ) {
						insert = data.data;
					}
					res.json( { 
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

	// Find Afdeling
	exports.findComp = ( req, res ) => {
		
		var auth = req.auth;
		
		mobileSyncModel.find( {
			INSERT_USER: auth.USER_AUTH_CODE,
			IMEI: auth.IMEI,
			TABEL_UPDATE: 'hectare-statement/comp'
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

				// Terdapat data di T_MOBILE_SYNC dengan USER_AUTH_CODE dan IMEI
				var dt = data[0];
				var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
				//var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' );
				var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' );
				
				// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};
				var parent_ms = 'hectare-statement';
				var target_ms = 'comp';
				var url = config.url.microservices.hectare_statement + '/sync-mobile/' + target_ms + '/';
				var url_final = url + start_date + '/' + end_date;
				console.log( url_final );
				client.get( url_final, args, function ( data, response ) {
					res.json( {
						status: data.status,
						message: data.message,
						data: data.data
					} );
				});
			}

			else {
				// Tidak ada data yang ditemukan, baru pertama kali sync
				
				var url = config.url.microservices.hectare_statement + '/comp';
				console.log( url );
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};

				client.get( url, args, function (data, response) {
					// parsed response body as js object
					var insert = [];
					if ( data.data.length > 0 ) {
						insert = data.data;
					}
					res.json( { 
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

	// Find Land Use
	exports.findLandUse = ( req, res ) => {
		
		var auth = req.auth;
		
		mobileSyncModel.find( {
			INSERT_USER: auth.USER_AUTH_CODE,
			IMEI: auth.IMEI,
			TABEL_UPDATE: 'hectare-statement/land-use'
		} )
		.sort( { TGL_MOBILE_SYNC: -1 } )
		.limit( 1 )
		.then( data => {

			console.log(data);
			if ( !data ) {
				return res.send( {
					status: false,
					message: 'Data not found 2',
					data: {}
				} );
			}

			if ( data.length > 0 ) {

				// Terdapat data di T_MOBILE_SYNC dengan USER_AUTH_CODE dan IMEI
				var dt = data[0];
				//var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ), 'YYYYMMDDhhmmss' );
				var start_date = date.convert( String( dt.TGL_MOBILE_SYNC ).substr( 0, 8 ) + '000000', 'YYYYMMDDhhmmss' );
				var end_date = date.convert( 'now', 'YYYYMMDDhhmmss' );
				
				// Jika tanggal terakhir sync dan hari ini berbeda, maka akan dilakukan pengecekan ke database
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};
				var parent_ms = 'hectare-statement';
				var target_ms = 'land-use';
				var url = config.url.microservices.hectare_statement + '/sync-mobile/' + target_ms + '/';
				var url_final = url + start_date + '/' + end_date;

				client.get( url_final, args, function ( data, response ) {
					res.json( {
						status: data.status,
						message: data.message,
						data: data.data
					} );
				});
			}

			else {
				// Tidak ada data yang ditemukan, baru pertama kali sync
				
				var url = config.url.microservices.hectare_statement + '/land-use';
				console.log( url );
				var client = new Client();
				var args = {
					headers: { "Content-Type": "application/json", "Authorization": req.headers.authorization }
				};

				client.get( url, args, function (data, response) {
					// parsed response body as js object
					res.json( { 
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

	// Find Block
	exports.findKriteria = ( req, res ) => {
		
		var auth = req.auth;
		
		mobileSyncModel.find( {
			INSERT_USER: auth.USER_AUTH_CODE,
			IMEI: auth.IMEI,
			TABEL_UPDATE: 'auth/kriteria'
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
				kriteriaModel.find( {
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
				.then( data => {
					if( !data ) {
						return res.send( {
							status: false,
							message: config.error_message.find_404,
							data: {}
						} );
					}

					res.json( { 
						"status": true,
						"message": "First time sync",
						"data": {
							hapus: [],
							simpan: data,
							ubah: []
						}
					} );
				} ).catch( err => {
					res.send( {
						status: false,
						message: config.error_message.find_500,
						data: {}
					} );
				} );
			}
			else {
				kriteriaModel.find( {
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
				.then( data => {
					if( !data ) {
						return res.send( {
							status: false,
							message: config.error_message.find_404,
							data: {}
						} );
					}

					res.json( { 
						"status": true,
						"message": "First time sync",
						"data": {
							hapus: [],
							simpan: data,
							ubah: []
						}
					} );
				} ).catch( err => {
					res.send( {
						status: false,
						message: config.error_message.find_500,
						data: {}
					} );
				} );
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