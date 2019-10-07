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
		Kriteria: require( _directory_base + '/app/v1.1/Http/Models/KriteriaModel.js' ),
		ViewContentInspeksi: require( _directory_base + '/app/v1.1/Http/Models/ViewContentInspeksiModel.js' )
	}

/*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
	/**
	 * Inspection - Content Code
	 * --------------------------------------------------------------------------
	 */
	 	exports.inspection_content_find = async( req, res ) => {
			Models.ViewContentInspeksi.find({})
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

	/**
	 * Inspection - Content Code
	 * --------------------------------------------------------------------------
	 */
	 	exports.inspection_kriteria_find = async( req, res ) => {
	 		if ( req.params.id ) {
				Models.Kriteria.findOne({
					BATAS_ATAS: {
						$gte: parseFloat( req.params.id )
					},
					BATAS_BAWAH: {
						$lte: parseFloat( req.params.id )
					}
				})
				.select({
					_id: 0,
					KRITERIA_CODE: 1,
					COLOR: 1,
					GRADE: 1,
					BATAS_ATAS: 1,
					BATAS_BAWAH: 1,
					KONVERSI_ANGKA: 1
					
				})
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
			}
			else {
				res.send( {
					status: false,
					message: config.app.error_message.find_404,
					data: {}
				} );
			}
	 	};