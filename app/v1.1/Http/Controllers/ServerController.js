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
		ServiceList: require( _directory_base + '/app/v1.1/Http/Models/ServiceListModel.js' ),
		APKVersion: require(_directory_base + '/app/v1.1/Http/Models/APKVersionModel.js' ),
		Parameter: require( _directory_base + '/app/v1.1/Http/Models/ParameterModel.js' )
	}

 /*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Service List
	 * Untuk menampilkan data API yang digunakan pada mobile dengan versi tertentu.
	 * --------------------------------------------------------------------------
	 */
		exports.service_list = async ( req, res ) => {
   			if ( !req.query.v ) {
   				return res.json( {
					status: true,
					message: "Versi mobile belum ditentukan.",
					data: []
				} );
			}
			

   			var get_version = req.query.v;
   			var env = config.app.env;
   			var config_url = config.app.url[env];
			var data = await Models.ServiceList.aggregate( [
				{
					"$project": {
						"_id": 0,
						"MOBILE_VERSION": 1,
						"API_NAME": 1,
						"METHOD": 1,
						"BODY": 1,
						"KETERANGAN": 1,
						"API_URL": {
							$switch: {
								branches: [
									{
										case: { $eq: [ "$MICROSERVICE", "AUTH" ] }, 
										then: {
											"$concat": [ config_url.microservice_auth, "$API_URL_PARAMETER" ]
										}
									},
									{
										case: { $eq: [ "$MICROSERVICE", "EBCC VALIDATION" ] }, 
										then: {
											"$concat": [ config_url.microservice_ebcc_validation, "$API_URL_PARAMETER" ]
										}
									},
									{
										case: { $eq: [ "$MICROSERVICE", "FINDING" ] }, 
										then: {
											"$concat": [ config_url.microservice_finding, "$API_URL_PARAMETER" ]
										}
									},
									{
										case: { $eq: [ "$MICROSERVICE", "HECTARE STATEMENT" ] }, 
										then: {
											"$concat": [ config_url.microservice_hectare_statement, "$API_URL_PARAMETER" ]
										}
									},
									{
										case: { $eq: [ "$MICROSERVICE", "IMAGES" ] }, 
										then: {
											"$concat": [ config_url.microservice_images, "$API_URL_PARAMETER" ]
										}
									},
									{
										case: { $eq: [ "$MICROSERVICE", "INSPECTION" ] }, 
										then: {
											"$concat": [ config_url.microservice_inspection, "$API_URL_PARAMETER" ]
										}
									}
								],
								default: ""
							}
						}
					}
				},
				{
					"$match": {
						"MOBILE_VERSION": get_version
					}
				}
			] );

			if ( data.length > 0 ) {
				return res.json( {
					status: true,
					message: "Success!",
					data: data
				} );
			}
			else {
				return res.json( {
					status: false,
					message: "Versi mobile tersebut tidak tersedia",
					data: []
				} );
			}
		};

 	/**
	 * Time
	 * Untuk menampilkan data jam server
	 * --------------------------------------------------------------------------
	 */
		exports.time = ( req, res ) => {
			return res.json({
				status: true,
				message: "Success!",
				data: {
					time: Libraries.Helper.date_format( 'now', 'YYYY-MM-DD hh:mm:ss' )
				}
			})
		}

	/**
	 * APKVersion
	 * Untuk menyimpan data versi APK
	 * --------------------------------------------------------------------------
	 */

		exports.apk_version = async ( req, res ) => {
			const set = new Models.APKVersion( {
				INSERT_USER: req.body.INSERT_USER,
				APK_VERSION: req.body.APK_VERSION ,
				IMEI: req.body.IMEI,
				INSERT_TIME: Libraries.Helper.date_format( req.body.INSERT_TIME, 'YYYYMMDDhhmmss'),
			});
			set.save()
			.then( async data => {
				if( !data ){
					return res.send( {
						status: false,
						message: 'Data error',
						data: {}
					})
				}

				var limit_version = await Models.Parameter.findOne( {
					PARAMETER_GROUP: "APK",
					PARAMETER_NAME: "VERSION_LIMIT" //di database permitted_version
				} );
				var check_version = await Models.APKVersion.aggregate( [
						{
							$group : {
								_id: {
									APK_VERSION : "$APK_VERSION"
								},
								count: { $sum: 1 }
							}
						},
						{
							$project: {
								_id: 0,
								APK_VERSION: "$_id.APK_VERSION"
							}
						},
						{
							$sort: {
								APK_VERSION: -1
							}
						},
						{
							$limit: parseInt( limit_version.DESC )
						}
					] );
					var found = false;
					console.log( check_version );
					for( var i = 0; i < check_version.length; i++){
						if( check_version[i].APK_VERSION == req.body.APK_VERSION ) {
							found = true;
							break;
						}
					}
					return res.send( {
						status: true,
						message: config.app.error_message.find_200,
						force_update: found == true ? false : true,
						data: {}
					} );
			}). catch( err => {
				if(err.kind === 'ObjectId' ){
					return res.send( {
						status: false,
						message: 'ObjectId error',
						data: {}
					});
				}
				return res.send( {
					status: false,
					message: 'Error retrieving data',
					data: {}
				})
			});
		}

	/**
	 * APK Version
	 * Untuk mengirim versi APK 
	 * --------------------------------------------------------------------------
	 */
		exports.current_apk_version = async (req, res) => {
			var data = await Models.APKVersion.aggregate( [
				// {
				// 	$group: {
				// 		_id: {
				// 			INSERT_USER: "$INSERT_USER"
				// 		},
				// 		APK_VERSION: {
				// 			$first: "$APK_VERSION"
				// 		},
				// 		IMEI: {
				// 			$first: "$IMEI"
				// 		}
				// 	}
				// },
				// {
				// 	$project: {
				// 		_id: 0,
				// 		INSERT_USER: "$_id.INSERT_USER",
				// 		APK_VERSION: 1,
				// 		IMEI: 1
				// 	}
				// },
				// {
				// 	$match: {
				// 		INSERT_USER: req.params.id
				// 	}
				// },
				// {
				// 	$sort: {
				// 		INSERT_TIME: -1
				// 	}
				// }
				{
					$project: {
						_id: 0,
						INSERT_USER: 1,
						APK_VERSION: 1,
						IMEI: 1
					}
				},
				{
					$match: {
						INSERT_USER: req.params.id
					}
				},
				{
					$sort: {
						APK_VERSION: -1 
					}
				},
				{
					$limit: 1
				}
			] );
			return res.send( {
				status: true,
				message: config.app.error_message.find_200,
				apk_version: ( data.length > 0 ? data[0].APK_VERSION : 0 )
			} )
		};
	