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
		Helper: require( _directory_base + '/app/v1.0/Http/Libraries/Helper.js' )
	}

 	// Models
	const Models = {
		EmployeeHRIS: require( _directory_base + '/app/v1.0/Http/Models/EmployeeHRISModel.js' ),
		EmployeeSAP: require( _directory_base + '/app/v1.0/Http/Models/EmployeeSAPModel.js' ),
		PJS: require( _directory_base + '/app/v1.0/Http/Models/PJSModel.js' ),
		UserAuth: require( _directory_base + '/app/v1.0/Http/Models/UserAuthModel.js' ),
		UserAuthorization: require( _directory_base + '/app/v1.0/Http/Models/UserAuthorizationModel.js' ),
		ViewUserAuth: require( _directory_base + '/app/v1.0/Http/Models/ViewUserAuthModel.js' )
	}

/*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Create
	 * Untuk membuat data user baru yang belum dibuat sebelumnya.
	 * --------------------------------------------------------------------------
	 */
		exports.create = async ( req, res ) => {

			var auth = req.auth;
			var create_pjs = false;
			var split = String( req.body.EMPLOYEE_NIK ).split( '-' );
			var TYPE = split[0];
			var NIK = split[1];
			var USER_AUTH_CODE = NIK;

			var query_data_hris = await Models.EmployeeHRIS.find( {
				EMPLOYEE_NIK: NIK
			} );

			var query_data_sap = await Models.EmployeeSAP.find( {
					NIK: NIK
				} )
				.select( {
					_id: 0,
					NIK: 1,
					EMPLOYEE_NAME: 1,
					JOB_CODE: 1
				} );

			var query_data_auth = await Models.ViewUserAuth.find( {
				$or: [
					{ EMPLOYEE_NIK: NIK },
					{ USER_AUTH_CODE: USER_AUTH_CODE }
				]
			} );

			if ( query_data_auth.length > 0 ) {
				return res.send( {
					status: false,
					message: "Error! User gagal dibuat, tidak dapat memasukkan USER_AUTH_CODE/NIK yang sama",
					data: []
				} );
			}
			else {
				
				var last_user = await Models.UserAuth.findOne().select( { _id:0, USER_AUTH_CODE:1 } ).sort( { _id:-1 } ).limit( 1 );
				var new_user_auth_code = parseInt( ( last_user.USER_AUTH_CODE.substr( 0, 1 ) == "0" ? last_user.USER_AUTH_CODE.substr( 1, 3 ): last_user.USER_AUTH_CODE.substr( 0, 4 ) ) ) + 1;
				var generate_auth_code = ( new_user_auth_code.toString().length == 3 ? "0" + new_user_auth_code.toString() : new_user_auth_code.toString() );
				
				if ( query_data_hris.length > 0 ) {
					data_user_auth = {
						USER_AUTH_CODE: generate_auth_code,
						EMPLOYEE_NIK: NIK,
						USER_ROLE: String( req.body.USER_ROLE ),
						LOCATION_CODE: String( req.body.LOCATION_CODE ),
						REF_ROLE: String( req.body.REF_ROLE ),
						INSERT_USER: auth.USER_AUTH_CODE,
						INSERT_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
						UPDATE_USER: auth.USER_AUTH_CODE,
						UPDATE_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
						DELETE_USER: "",
						DELETE_TIME: 0
					}

					const set_data = new Models.UserAuth( data_user_auth );

					set_data.save()
					.then( data => {
						if ( !data ) {
							return res.send( {
								status: false,
								message: config.app.error_message.create_404,
								data: {}
							} );
						}
						
						res.send( {
							status: true,
							message: config.app.error_message.create_200,
							data: {}
						} );
					} ).catch( err => {
						res.send( {
							status: false,
							message: config.app.error_message.create_500,
							data: {}
						} );
					} );
				}
				// Create PJS
				else {
					data_user_auth = {
						USER_AUTH_CODE: generate_auth_code,
						EMPLOYEE_NIK: String( query_data_sap[0].NIK ),
						USER_ROLE: String( req.body.USER_ROLE ),
						LOCATION_CODE: String( req.body.LOCATION_CODE ),
						REF_ROLE: String( req.body.REF_ROLE ),

						INSERT_USER: auth.USER_AUTH_CODE,
						INSERT_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
						UPDATE_USER: auth.USER_AUTH_CODE,
						UPDATE_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
						DELETE_USER: "",
						DELETE_TIME: 0
					}
					
					data_pjs = {
						EMPLOYEE_NIK: String( query_data_sap[0].NIK ),
						USERNAME: req.body.USERNAME,
						NAMA_LENGKAP: String( query_data_sap[0].EMPLOYEE_NAME ),
						JOB_CODE: String( query_data_sap[0].JOB_CODE ),

						INSERT_USER: auth.USER_AUTH_CODE,
						INSERT_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
						UPDATE_USER: auth.USER_AUTH_CODE,
						UPDATE_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
						DELETE_USER: "",
						DELETE_TIME: 0
					}

					const set_pjs = new Models.PJS( data_pjs );
					const set_data = new Models.UserAuth( data_user_auth );

					set_data.save()
					.then( data => {
						if ( !data ) {
							return res.send( {
								status: false,
								message: config.app.error_message.create_404,
								data: {}
							} );
						}
						
						set_pjs.save()
						.then( data => {
							if ( !data ) {
								return res.send( {
									status: false,
									message: config.app.error_message.create_404,
									data: {}
								} );
							}
							
							res.send( {
								status: true,
								message: config.app.error_message.create_200,
								data: {}
							} );
						} ).catch( err => {
							res.send( {
								status: false,
								message: config.app.error_message.create_500,
								data: {}
							} );
						} );

					} ).catch( err => {
						res.send( {
							status: false,
							message: config.app.error_message.create_500,
							data: {}
						} );
					} );
				}
			}
		};

	/**
	 * Find
	 * Untuk mengambil seluruh data user yang aktif.
	 * --------------------------------------------------------------------------
	 */
		exports.find = ( req, res ) => {

			url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;

			Models.ViewUserAuth.find( url_query )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: config.error_message.find_404,
						data: {}
					} );
				}

				var results = [];
				data.forEach( function( result ) {
					var result = Object.keys(result).map(function(k) {
						return [+k, result[k]];
					});
					result = result[3][1];

					var JOB = ( !result.PJS_JOB ) ? result.HRIS_JOB : result.PJS_JOB;
					var FULLNAME = ( !result.PJS_FULLNAME ) ? result.HRIS_FULLNAME : result.PJS_FULLNAME
					if ( JOB != '' && FULLNAME != '' ) {
						results.push( {
							USER_AUTH_CODE: result.USER_AUTH_CODE,
							EMPLOYEE_NIK: result.EMPLOYEE_NIK,
							USER_ROLE: result.USER_ROLE,
							LOCATION_CODE: result.LOCATION_CODE,
							REF_ROLE: result.REF_ROLE,
							JOB: JOB,
							FULLNAME: FULLNAME
						} );
					}
				} );

				return res.send( {
					status: true,
					message: config.app.error_message.find_200,
					data: results
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
	 * Untuk mengambil data user berdasarkan User Auth Code.
	 * --------------------------------------------------------------------------
	 */
	 	exports.find_one = async ( req, res ) => {
	 		Models.ViewUserAuth.find( {
				USER_AUTH_CODE: req.params.id
			} )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: config.app.error_message.find_404,
						data: {}
					} );
				}

				var results = [];
				data.forEach( function( result ) {
					var result = Object.keys(result).map(function(k) {
						return [+k, result[k]];
					});
					result = result[3][1];
					var JOB = ( !result.PJS_JOB ) ? result.HRIS_JOB : result.PJS_JOB;
					var FULLNAME = ( !result.PJS_FULLNAME ) ? result.HRIS_FULLNAME : result.PJS_FULLNAME
					if ( JOB != '' && FULLNAME != '' ) {
						results.push( {
							USER_AUTH_CODE: result.USER_AUTH_CODE,
							EMPLOYEE_NIK: result.EMPLOYEE_NIK,
							USER_ROLE: result.USER_ROLE,
							LOCATION_CODE: result.LOCATION_CODE,
							REF_ROLE: result.REF_ROLE,
							JOB: JOB,
							FULLNAME: FULLNAME
						} );
					}
				} );

				res.send( {
					status: true,
					message: config.app.error_message.find_200,
					data: results[0]
				} );
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.app.error_message.find_500,
					data: {}
				} );
			} );
	 	}

	/**
	 * Search At HRIS & SAP
	 * Untuk mencari data user dari tabel TM_EMPLOYEE_HRIS dan TM_EMPLOYEE_SAP
	 * --------------------------------------------------------------------------
	 */
		exports.hris_sap_search = async ( req, res ) => {

			// Check parameter, jika tidak ada parameter query maka proses di stop. 
			if ( !req.query.q ) {
				return res.send({
					status: false,
					message: 'Invalid parameter',
					data: {}
				});
			}

			var results = [];
			var data_hris = await Models.EmployeeHRIS.find( { 
				EMPLOYEE_USERNAME: {
					$exists: true
				},
				EMPLOYEE_NIK: {
					$exists: true
				},
				$and: [
					{
						$or: [
							{
								EMPLOYEE_NIK: { 
									$regex: new RegExp( '^' + req.query.q.toUpperCase() )
								}
							},
							{
								EMPLOYEE_FULLNAME: {
									$regex: new RegExp( '^' + req.query.q.toUpperCase() )
								}
							}
						]
					}
				]
			} )
			.sort( {
				EMPLOYEE_NAME : 1
			} )
			.select( {
				_id: 0,
				EMPLOYEE_NIK: 1,
				EMPLOYEE_FULLNAME: 1,
				EMPLOYEE_POSITION: 1
			} )
			.limit( 20 );
			var data_sap = await Models.EmployeeSAP.find( { 
				EMPLOYEE_NAME: {
					$exists: true
				},
				$and: [
					{
						$or: [
							{
								NIK: { 
									$regex: new RegExp( decodeURIComponent( req.query.q ) )
								}
							},
							{
								EMPLOYEE_NAME: {
									$regex: new RegExp( '^' + req.query.q.toUpperCase() )
								}
							}
						]
					}
				]
				
			} )
			.sort( {
				EMPLOYEE_NAME: 1
			} )
			.select( {
				_id: 0,
				NIK: 1,
				EMPLOYEE_NIK: 1,
				EMPLOYEE_NAME: 1,
				JOB_CODE: 1,
			} )
			.limit( 20 );

			// Loop Data HRIS
			if ( data_hris.length > 0 ) {
				data_hris.forEach( function( result ) {
					var result = Object.keys( result ).map( function( k ) {
						return [+k, result[k]];
					});
					result = result[3][1];
					if ( result.EMPLOYEE_NIK != null ) {
						results.push( {
							NIK: 'HRIS-' + result.EMPLOYEE_NIK,
							NAMA_LENGKAP: result.EMPLOYEE_FULLNAME,
							JOB_CODE: result.EMPLOYEE_POSITION
						} );
					}
				} );
			}
			
			// Loop Data SAP
			if ( data_sap.length > 0 ) {
				data_sap.forEach( function( result ) {
					var result = Object.keys(result).map(function(k) {
						return [+k, result[k]];
					});
					result = result[3][1];
					if ( result.NIK != null ) {
						results.push( {
							NIK: 'SAP-' + result.NIK,
							NAMA_LENGKAP: result.EMPLOYEE_NAME,
							JOB_CODE: result.JOB_CODE
						} );
					}
				} );
			}

			res.send( {
				status: true,
				message: config.app.error_message.find_200,
				data: results
			} );
		};

	/**
	 * User - Update
	 * Untuk mengupdate data user yang ada di TM_USER_AUTH
	 * --------------------------------------------------------------------------
	 */
		exports.update = ( req, res ) => {
			var auth = req.auth;

			Models.UserAuth.findOneAndUpdate( { 
				USER_AUTH_CODE : req.params.id 
			}, {
				USER_ROLE: req.body.USER_ROLE,
				REF_ROLE: req.body.REF_ROLE,
				LOCATION_CODE: req.body.LOCATION_CODE,
				UPDATE_USER: auth.USER_AUTH_CODE,
				UPDATE_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
				DELETE_USER: "",
				DELETE_TIME: 0
			}, { new: true } )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: config.app.error_message.put_404,
						data: {}
					} );
				}
				return res.send( {
					status: true,
					message: config.app.error_message.put_200,
					data: {}
				} );

			}).catch( err => {
				return res.send( {
					status: false,
					message: config.app.error_message.put_500,
					data: {}
				} );
			});
		}

	/**
	 * User Authorization - Create Or Update
	 * Untuk membuat User Authorization yang akan digunakan di website atau
	 * mengupdate data yang sudah ada berdasarkan User Auth Code.
	 * --------------------------------------------------------------------------
	 */
		exports.user_authorization_create_or_update = async ( req, res ) => {

			/*═════════════════════════════════════════════════════════════════╗
			║ Validasi Input                                                   ║
			╠══════════════════════════════════════════════════════════════════╣
			║ MODULE_CODE	   												   ║
			║ MODULE_NAME	     											   ║
			╚═════════════════════════════════════════════════════════════════*/
			if ( !req.body.MODULE_CODE ) { res.json( { status: false, message: config.error_message.invalid_request + "Module Code.", data: [] } ) }
			if ( !req.body.PARAMETER_NAME ) { res.json( { status: false, message: config.error_message.invalid_request + "Parameter Name.", data: [] } ) }

			/*═════════════════════════════════════════════════════════════════╗
			║ Set Variabel           										   ║
			╚═════════════════════════════════════════════════════════════════*/
			var auth = req.auth;

			/*═════════════════════════════════════════════════════════════════╗
			║ Set Variabel           										   ║
			╚═════════════════════════════════════════════════════════════════*/
			Models.UserAuthorization.findOne( { 
				PARAMETER_NAME: req.body.PARAMETER_NAME,
				MODULE_CODE: req.body.MODULE_CODE
			} ).then( data => {
				if( !data ) {
					const set = new Models.UserAuthorization( {
						MODULE_CODE: req.body.MODULE_CODE,
						PARAMETER_NAME: req.body.PARAMETER_NAME,
						STATUS: 1,
						INSERT_USER: auth.USER_AUTH_CODE,
						INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
						UPDATE_USER: auth.USER_AUTH_CODE,
						UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
						DELETE_USER: "",
						DELETE_TIME: 0
					} );
					
					set.save()
					.then( data => {
						if ( !data ) {
							return res.send( {
								status: false,
								message: config.app.error_message.create_404,
								data: {}
							} );
						}
						
						res.send( {
							status: true,
							message: config.app.error_message.create_200 + 'Insert.',
							data: {}
						} );
					} ).catch( err => {
						res.send( {
							status: false,
							message: config.app.error_message.create_500,
							data: {}
						} );
					} );
				}
				else {
					/*═════════════════════════════════════════════════════════════════╗
					║ Ganti data status. Jika 0 maka akan menjadi 1, dan sebaliknya.   ║
					╚═════════════════════════════════════════════════════════════════*/
					
					var change_status_to = 0;
					if ( data.STATUS == 0 ) {
						change_status_to = 1;
					}
					
					Models.UserAuthorization.findOneAndUpdate( { 
						PARAMETER_NAME: req.body.PARAMETER_NAME,
						MODULE_CODE: req.body.MODULE_CODE
					}, {
						STATUS: change_status_to,
						UPDATE_USER: auth.USER_AUTH_CODE,
						UPDATE_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
					}, { new: true } )
					.then( dataUpdate => {
						if ( !data ) {
							return res.send( {
								status: false,
								message: config.app.error_message.put_404,
								data: {}
							} );
						}
						
						res.send( {
							status: true,
							message: config.app.error_message.put_200 + 'Update.',
							data: {}
						} );
					} ).catch( err => {
						res.send( {
							status: false,
							message: config.app.error_message.put_500,
							data: {}
						} );
					} );
					
				}
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.app.error_message.put_500,
					data: {}
				} );
			} );
		}

	/**
	 * User Authorization - Find 
	 * Untuk membuat User Authorization yang akan digunakan di website.
	 * Fungsi untuk mengambil data.
	 * 
	 * Contoh :
	 * 1. api-url/ 		Mengambil seluruh data
	 * 2. api-ulr?AB=C 	Mengambil data berdasarkan parameter
	 * --------------------------------------------------------------------------
	 */
		exports.user_authorization_find = ( req, res ) => {

			url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;

			Models.UserAuthorization.find( url_query )
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