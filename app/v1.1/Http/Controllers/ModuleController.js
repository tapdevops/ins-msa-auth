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
		Module: require( _directory_base + '/app/v1.1/Http/Models/ModuleModel.js' ),
		UserAuthorization: require( _directory_base + '/app/v1.1/Http/Models/UserAuthorizationModel.js' ),
	}

 /*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Create Or Update
	 * Fungsi untuk mengupdate data lama atau menambahkan data baru jika ID 
	 * sudah ada.
	 * --------------------------------------------------------------------------
	 */
		exports.create_or_update = async ( req, res ) => {

			/*═════════════════════════════════════════════════════════════════╗
			║ Validasi Input                                                   ║
			╠══════════════════════════════════════════════════════════════════╣
			║ MODULE_CODE	   												   ║
			║ MODULE_NAME	          										   ║
			║ ITEM_NAME	        											   ║
			╚═════════════════════════════════════════════════════════════════*/
			if ( !req.body.MODULE_CODE ) { res.json( { status: false, message: config.error_message.invalid_request + "Module Code.", data: [] } ) }
			if ( !req.body.MODULE_NAME ) { res.json( { status: false, message: config.error_message.invalid_request + "Module Name.", data: [] } ) }
			if ( !req.body.ITEM_NAME ) { res.json( { status: false, message: config.error_message.invalid_request + "Item Name.", data: [] } ) }

			/*═════════════════════════════════════════════════════════════════╗
			║ Check Parent Module                                              ║
			╠══════════════════════════════════════════════════════════════════╣
			║ Jika value parent module tidak kosong, maka akan di check. 	   ║
			║ Jika tidak ada maka akan di keluarkan notif error.               ║
			╚═════════════════════════════════════════════════════════════════*/
			if ( req.body.PARENT_MODULE != '' ) {
				var check_parent_code = await Models.Module.findOne( {
					MODULE_CODE: req.body.PARENT_MODULE,
					DELETE_USER: ""
				} ).count();
				if ( check_parent_code == 0 ) {
					res.json( {
						status: false,
						message: config.error_message.create_404 + "Parent Module tidak ditemukan.",
						data: []
					} )
				}
			}

			/*═════════════════════════════════════════════════════════════════╗
			║ Set Variabel           										   ║
			╚═════════════════════════════════════════════════════════════════*/
			var auth = req.auth;
			var check_module_code = await Models.Module.findOne( {
				MODULE_CODE: req.body.MODULE_CODE,
				DELETE_USER: ""
			} ).count();

			/*═════════════════════════════════════════════════════════════════╗
			║ Jika Module Code yang diinputkan belum ada di database, maka 	   ║
			║ akan di create. Jika belum maka akan dibuat data baru.       	   ║
			╚═════════════════════════════════════════════════════════════════*/
			if ( check_module_code == 0 ) {
				const set = new Models.Module({
					MODULE_CODE: req.body.MODULE_CODE,
					MODULE_NAME: req.body.MODULE_NAME,
					PARENT_MODULE: req.body.PARENT_MODULE,
					ITEM_NAME: req.body.ITEM_NAME,
					ICON: req.body.ICON,
					STATUS: req.body.STATUS,
					INSERT_USER: auth.USER_AUTH_CODE,
					INSERT_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
					UPDATE_USER: auth.USER_AUTH_CODE,
					UPDATE_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' ),
					DELETE_USER: "",
					DELETE_TIME: 0
				});

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
				Models.Module.findOneAndUpdate( { 
					MODULE_CODE: req.body.MODULE_CODE
				}, {
					MODULE_NAME: req.body.MODULE_NAME,
					PARENT_MODULE: req.body.PARENT_MODULE,
					ITEM_NAME: req.body.ITEM_NAME,
					ICON: req.body.ICON,
					STATUS: req.body.STATUS,
					UPDATE_USER: auth.USER_AUTH_CODE,
					UPDATE_TIME: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' )
				}, { new: true } )
				.then( data => {
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
		}

	/**
	 * Find
	 * Untuk menampilkan seluruh data-data module atau yang telah didefinisikan
	 * dalam URL query.
	 * --------------------------------------------------------------------------
	 */
		exports.find = async ( req, res ) => {
			url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;
			
			url_query.DELETE_USER = "";
			url_query.DELETE_TIME = "";

			modulesModel.find( url_query )
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

	/**
	 * Find One
	 * Untuk menampilkan satu data module berdasarkan parameter id.
	 * --------------------------------------------------------------------------
	 */
		exports.find_one = async ( req, res ) => {
			Models.Module.findOne( { 
				MODULE_CODE : req.params.id,
				DELETE_USER: "",
				DELETE_TIME: ""
			} ).then( data => {
				if( !data ) {
					return res.send({
						status: false,
						message: "Data not found 2 with id " + req.params.id,
						data: data,
					});
				}
				return res.send( {
					status: true,
					message: 'Success',
					data: data
				} );
			} ).catch( err => {
				if( err.kind === 'ObjectId' ) {
					return res.send({
						status: false,
						message: "Data not found 1 with id " + req.params.id,
						data: {}
					});
				}
				return res.send({
					status: false,
					message: "Error retrieving Data with id " + req.params.id,
					data: {}
				} );
			} );
		};

 	/**
	 * Find By Job
	 * Untuk mencari data Module berdasarkan Job, contohnya :
	 * - ASISTEN_LAPANGAN
	 * - CEO
	 * - EM
	 * - KEPALA_KEBUN
	 * - Dan sebagainya
	 * --------------------------------------------------------------------------
	 */
		exports.find_by_job = async ( req, res ) => {
			/*═════════════════════════════════════════════════════════════════╗
			║ Set Variabel           										   ║
			╚═════════════════════════════════════════════════════════════════*/
			var auth = req.auth;
			var job = auth.USER_ROLE;

			/*═════════════════════════════════════════════════════════════════╗
			║ Check Params 													   ║
			║ Jika ada Params ID, maka akan mencari berdasakan Params ID 	   ║
			╚═════════════════════════════════════════════════════════════════*/
			if ( req.params.id ) {
				job = req.params.id;
			}

			/*═════════════════════════════════════════════════════════════════╗
			║ Query 	               										   ║
			╚═════════════════════════════════════════════════════════════════*/
			Models.UserAuthorization.aggregate( [
				{
					"$lookup": {
						"from": "T_MODULE",
						"localField": "MODULE_CODE",
						"foreignField": "MODULE_CODE",
						"as": "MODULE"
					}
				},
				{
					"$addFields": {
						"MODULE_NAME": {
							"$arrayElemAt": [
								"$MODULE.MODULE_NAME",
								0
							]
						},
						"PARENT_MODULE": {
							"$arrayElemAt": [
								"$MODULE.PARENT_MODULE",
								0
							]
						},
						"ITEM_NAME": {
							"$arrayElemAt": [
								"$MODULE.ITEM_NAME",
								0
							]
						},
						"ICON": {
							"$arrayElemAt": [
								"$MODULE.ICON",
								0
							]
						},
					}
				},
				{
					"$match": {
						"PARAMETER_NAME": job,
						"STATUS": 1,
						"DELETE_USER": ""
					}
				},
				{
					"$project": {
						"_id": 0,
						"PARAMETER_NAME": 1,
						"STATUS": 1,
						"MODULE_CODE": 1,
						"MODULE_NAME": 1,
						"PARENT_MODULE": 1,
						"ITEM_NAME": 1,
						"ICON": 1
					}
				},
			] )
			.then( data => {
				if( !data ) {
					return res.send( {
						status: false,
						message: config.app.error_message.find_404,
						data: {}
					} );
				}
				res.send( {
					status: true,
					message: config.app.error_message.find_200,
					data: data
				} );
			} ).catch( err => {
				res.send( {
					status: false,
					message: config.app.error_message.find_500,
					data: {}
				} );
			} );
		};