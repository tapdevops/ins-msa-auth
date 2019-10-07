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
		Kriteria: require( _directory_base + '/app/v1.1/Http/Models/KriteriaModel.js' )
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
	 * Untuk menampilkan data kriteria
	 * --------------------------------------------------------------------------
	 */
		exports.find = ( req, res ) => {
			Models.Kriteria.find({})
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