/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | Untuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
 	// Models
	const categoryModel = require( '../models/category.js' );

	// Node Modules
	const querystring = require( 'querystring' );
	const url = require( 'url' );
	const jwt = require( 'jsonwebtoken' );
	const uuid = require( 'uuid' );
	const nJwt = require( 'njwt' );
	const jwtDecode = require( 'jwt-decode' );
	const Client = require( 'node-rest-client' ).Client; 
	const moment_pure = require( 'moment' );
	const moment = require( 'moment-timezone' );
	const fServer = require( 'fs' );

	// Libraries
	const config = require( '../../config/config.js' );
	const date = require( '../libraries/date.js' );

/**
 * Find
 * Untuk menampilkan data kriteria
 * --------------------------------------------------------------------------
 */
	exports.find = async ( req, res ) => {
		var auth = req.auth;
		var url_query = req.query;
		var url_query_length = Object.keys( url_query ).length;
			url_query.DELETE_USER = "";
		var query = await categoryModel
			.find()
			.select( {
				_id: 0,
				INSERT_TIME: 0,
				INSERT_USER: 0,
				DELETE_TIME: 0,
				DELETE_USER: 0,
				UPDATE_TIME: 0,
				UPDATE_USER: 0,
				__v: 0
			} );

		if ( query.length > 0 ) {

			var results = [];
			if ( config.app_env == 'production' ) {
				var path_global = req.protocol + '://' + req.get( 'host' ) + '/' + config.path_production + '/';
			}
			else {
				var path_global = req.protocol + '://' + req.get( 'host' ) + '/' + config.path_development ;
			}

			
			query.forEach( function( result ) {
				var path = 'files/images/category/' + result.ICON;
				results.push( {
					CATEGORY_CODE: result.CATEGORY_CODE,
					CATEGORY_NAME: result.CATEGORY_NAME,
					ICON: result.ICON,
					ICON_URL: path_global + path
				} );
			} );

			if ( results.length > 0 ) {
				res.send( {
					status: true,
					message: config.error_message.find_200,
					data: results
				} );
			}
			else {
				res.send( {
					status: true,
					message: config.error_message.find_404 + ' 2',
					data: {}
				} );
			}
		}
		else {
			res.send( {
				status: true,
				message: config.error_message.find_404,
				data: {}
			} );
		}
	};

/**
 * create
 * Untuk membuat dan menyimpan data kriteria baru
 * --------------------------------------------------------------------------
 */
	exports.create = ( req, res ) => {
		
		var auth = req.auth;
		const set_data = new categoryModel( {
			CATEGORY_CODE: req.body.CATEGORY_CODE || "",
			CATEGORY_NAME: req.body.CATEGORY_NAME || "",
			ICON: req.body.ICON || "",
			INSERT_USER: auth.USER_AUTH_CODE,
			INSERT_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
			UPDATE_USER: auth.USER_AUTH_CODE,
			UPDATE_TIME: date.convert( 'now', 'YYYYMMDDhhmmss' ),
			DELETE_USER: "",
			DELETE_TIME: 0
		} );

		set_data.save()
		.then( data => {
			if ( !data ) {
				return res.send( {
					status: false,
					message: config.error_message.create_404,
					data: {}
				} );
			}
			
			res.send( {
				status: true,
				message: config.error_message.create_200,
				data: {}
			} );
		} ).catch( err => {
			res.send( {
				status: false,
				message: config.error_message.create_500,
				data: {}
			} );
		} );
		
	};