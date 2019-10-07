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
		Content: require( _directory_base + '/app/v1.0/Http/Models/ContentModel.js' ),
		ContentLabel: require( _directory_base + '/app/v1.0/Http/Models/ContentLabelModel.js' )
	}

 /*
 |--------------------------------------------------------------------------
 | Versi 1.0
 |--------------------------------------------------------------------------
 */
 	/**
	 * Find
	 * Untuk menampilkan data content
	 * --------------------------------------------------------------------------
	 */
		exports.find = ( req, res ) => {		
			var auth = req.token;
			var url_query = req.query;
			var url_query_length = Object.keys( url_query ).length;
				url_query.DELETE_USER = "";
			
			Models.Content.find( url_query )
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
	 * Find One
	 * Untuk menampilkan satu data content berdasar CONTENT_CODE
	 * --------------------------------------------------------------------------
	 */
		exports.find_one = ( req, res ) => {
			Models.Content.findOne( {
				DELETE_USER: "",
				CONTENT_CODE: req.params.id
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
	 * Label Find
	 * Untuk menampilkan data content label
	 * --------------------------------------------------------------------------
	 */
		exports.label_find = ( req, res ) => {
			Models.ContentLabel.find( req.query )
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
				console.log(data);
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
	 * Label Find One
	 * Untuk menampilkan satu data content berdasar CONTENT_LABEL_CODE
	 * --------------------------------------------------------------------------
	 */
		exports.label_find_one = ( req, res ) => {
			console.log({
				DELETE_USER: "",
				CONTENT_LABEL_CODE: req.params.id
			});
			Models.ContentLabel.findOne()
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
				console.log(data);
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