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
	}

/*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Sync HRIS
	 * Untuk membuat data yang belum ada di tabel atau mengupdate data yang sudah
	 * ada di tabel.
	 * --------------------------------------------------------------------------
	 */
	exports.sync_employee_hris = ( req, res ) => {
		if( !req.body.EMPLOYEE_NIK ) {
			return res.send( {
				status: false,
				message: 'Invalid input',
				data: {}
			} );
		}
		console.log(Libraries.Helper.date_format( 'now', 'YYYYMMDD' ));
		Models.EmployeeHRIS.findOne( { 
			EMPLOYEE_NIK: req.body.EMPLOYEE_NIK
		} ).then( data => {
			// Kondisi belum ada data, create baru dan insert ke Sync List
			if ( data == null ) {
				const empHRIS = new Models.EmployeeHRIS( {
					EMPLOYEE_NIK: req.body.EMPLOYEE_NIK,
					EMPLOYEE_USERNAME: req.body.EMPLOYEE_USERNAME,
					EMPLOYEE_FULLNAME: req.body.EMPLOYEE_FULLNAME,
					EMPLOYEE_POSITIONCODE: req.body.EMPLOYEE_POSITIONCODE,
					EMPLOYEE_POSITION: req.body.EMPLOYEE_POSITION,
					EMPLOYEE_EMAIL: req.body.EMPLOYEE_EMAIL,
					INSERT_TIME_DW: Libraries.Helper.date_format( req.body.INSERT_TIME_DW, 'YYYYMMDDhhmmss' ) || 0,
					UPDATE_TIME_DW: Libraries.Helper.date_format( req.body.UPDATE_TIME_DW, 'YYYYMMDDhhmmss' ) || 0,
					DELETE_TIME_DW: Libraries.Helper.date_format( req.body.DELETE_TIME_DW, 'YYYYMMDDhhmmss' ) || 0,
					LAST_UPDATE: Libraries.Helper.date_format( 'now', 'YYYYMMDD' ).substr( 0, 8 )
				} );
				
				empHRIS.save()
				.then( data => {
					return res.send({
						status: true,
						message: 'Success!',
						data: {}
					} );
				} ).catch( err => {
					return res.send( {
						status: false,
						message: 'Some error occurred while creating data',
						data: {}
					} );
				} );
			}
			// Kondisi data sudah ada, check value, jika sama tidak diupdate, jika beda diupdate dan dimasukkan ke Sync List
			else {
				if ( data.EMPLOYEE_FULLNAME != req.body.EMPLOYEE_FULLNAME || data.EMPLOYEE_USERNAME != req.body.EMPLOYEE_USERNAME ) {
					Models.EmployeeHRIS.findOneAndUpdate( { 
						EMPLOYEE_NIK: req.body.EMPLOYEE_NIK
					}, {
						EMPLOYEE_USERNAME: req.body.EMPLOYEE_USERNAME,
						EMPLOYEE_FULLNAME: req.body.EMPLOYEE_FULLNAME,
						EMPLOYEE_POSITIONCODE: req.body.EMPLOYEE_POSITIONCODE,
						EMPLOYEE_POSITION: req.body.EMPLOYEE_POSITION,
						EMPLOYEE_EMAIL: req.body.EMPLOYEE_EMAIL,
						INSERT_TIME_DW: Libraries.Helper.date_format( req.body.INSERT_TIME_DW, 'YYYYMMDDhhmmss' ),
						UPDATE_TIME_DW: Libraries.Helper.date_format( req.body.UPDATE_TIME_DW, 'YYYYMMDDhhmmss' ),
						DELETE_TIME_DW: Libraries.Helper.date_format( req.body.DELETE_TIME_DW, 'YYYYMMDDhhmmss' ),
						LAST_UPDATE: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' )
					}, { new: true } )
					.then( data => {
						if( !data ) {
							return res.send( {
								status: false,
								message: "Data error updating 2",
								data: {}
							} );
						}
						else {
							return res.send( {
								status: true,
								message: 'Success',
								data: {}
							} );
						}
					} ).catch( err => {
						if( err.kind === 'ObjectId' ) {
							return res.send( {
								status: false,
								message: "Data not found 2",
								data: {}
							} );
						}
						return res.send( {
							status: false,
							message: "Data error updating",
							data: {}
						} );
					} );
				}
				else {
					return res.send( {
						status: true,
						message: 'Skip Update',
						data: {}
					} );
				}
			}
			
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send({
					status: false,
					message: "Data not found 1",
					data: {}
				});
			}
			return res.send({
				status: false,
				message: "Error retrieving Data",
				data: {}
			} );
		} );
	};

	/**
	 * Sync SAP
	 * Untuk membuat data yang belum ada di tabel atau mengupdate data yang sudah
	 * ada di tabel.
	 * --------------------------------------------------------------------------
	 */
	exports.sync_employee_sap = ( req, res ) => {
		console.log("SAP");
		if( !req.body.NIK ) {
			return res.send( {
				status: false,
				message: 'Invalid input',
				data: {}
			} );
		}

		Models.EmployeeSAP.findOne( { 
			NIK: req.body.NIK
		} ).then( data => {
			// Kondisi belum ada data, create baru dan insert ke Sync List
			if ( data == null ) {
				const empHRIS = new Models.EmployeeSAP( {
					NIK: req.body.NIK,
					EMPLOYEE_NAME: req.body.EMPLOYEE_NAME,
					JOB_CODE: req.body.JOB_CODE,
					END_VALID: Libraries.Helper.date_format( req.body.END_VALID, 'YYYYMMDDhhmmss' ).substr( 0, 8 ) || 0,
					START_VALID: Libraries.Helper.date_format( req.body.START_VALID, 'YYYYMMDDhhmmss' ).substr( 0, 8 ) || 0,
					INSERT_TIME_DW: Libraries.Helper.date_format( req.body.INSERT_TIME_DW, 'YYYYMMDDhhmmss' ) || 0,
					UPDATE_TIME_DW: Libraries.Helper.date_format( req.body.UPDATE_TIME_DW, 'YYYYMMDDhhmmss' ) || 0,
					LAST_UPDATE: Libraries.Helper.date_format( 'now', 'YYYYMMDD' ).substr( 0, 8 )
				} );
				
				empHRIS.save()
				.then( data => {
					return res.send({
						status: true,
						message: 'Success!',
						data: {}
					} );
				} ).catch( err => {
					return res.send( {
						status: false,
						message: 'Some error occurred while creating data',
						data: {}
					} );
				} );
			}
			// Kondisi data sudah ada, check value, jika sama tidak diupdate, jika beda diupdate dan dimasukkan ke Sync List
			else {
				if ( data.EMPLOYEE_NAME != req.body.EMPLOYEE_NAME || data.JOB_CODE != req.body.JOB_CODE || data.END_VALID != req.body.END_VALID ) {
					Models.EmployeeSAP.findOneAndUpdate( { 
						NIK: req.body.NIK
					}, {
						EMPLOYEE_NAME: req.body.EMPLOYEE_NAME,
						JOB_CODE: req.body.JOB_CODE,
						END_VALID: Libraries.Helper.date_format( req.body.END_VALID, 'YYYYMMDDhhmmss' ).substr( 0, 8 ) || 0,
						START_VALID: Libraries.Helper.date_format( req.body.START_VALID, 'YYYYMMDDhhmmss' ).substr( 0, 8 ) || 0,
						INSERT_TIME_DW: Libraries.Helper.date_format( req.body.INSERT_TIME_DW, 'YYYYMMDDhhmmss' ),
						UPDATE_TIME_DW: Libraries.Helper.date_format( req.body.UPDATE_TIME_DW, 'YYYYMMDDhhmmss' ),
						LAST_UPDATE: Libraries.Helper.date_format( 'now', 'YYYYMMDDhhmmss' )
					}, { new: true } )
					.then( data => {
						if( !data ) {
							return res.send( {
								status: false,
								message: "Data error updating 2",
								data: {}
							} );
						}
						else {
							return res.send( {
								status: true,
								message: 'Success',
								data: {}
							} );
						}
					} ).catch( err => {
						if( err.kind === 'ObjectId' ) {
							return res.send( {
								status: false,
								message: "Data not found 2",
								data: {}
							} );
						}
						return res.send( {
							status: false,
							message: "Data error updating",
							data: {}
						} );
					} );
				}
				else {
					return res.send( {
						status: true,
						message: 'Skip Update',
						data: {}
					} );
				}
			}
			
		} ).catch( err => {
			if( err.kind === 'ObjectId' ) {
				return res.send({
					status: false,
					message: "Data not found 1",
					data: {}
				});
			}
			return res.send({
				status: false,
				message: "Error retrieving Data",
				data: {}
			} );
		} );
	};