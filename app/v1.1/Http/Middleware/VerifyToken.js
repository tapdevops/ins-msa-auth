/*
|--------------------------------------------------------------------------
| Variable
|--------------------------------------------------------------------------
*/
	// Node Modules
	const NJWT = require( 'njwt' );
	const JWTDecode = require( 'jwt-decode' );

/*
|--------------------------------------------------------------------------
| Verify Token Middleware
|--------------------------------------------------------------------------
|
| When they present the JWT, you want to check the token to ensure that 
| it's valid. This library does the following checks when you call the verify 
| method: It was created by you (by verifying the signature, using the secret 
| signing key)
|
*/
	module.exports = function( req, res, next ) {
		const bearer_header = req.headers['authorization'];
		if ( typeof bearer_header !== 'undefined' ) {
			const bearer = bearer_header.split( ' ' );
			const bearer_token = bearer[1];
			req.token = bearer_token;
			NJWT.verify( bearer_token, config.app.secret_key, config.app.token_algorithm, ( err, authData ) => {
				if ( err ) {
					res.send({
						status: false,
						message: "Invalid Token",
						data: []
					} );
				}
				else {
					req.auth = JWTDecode( req.token );
					//cek apakah LOCATION_CODE lebih dari satu element
					req.auth.LOCATION_CODE_GROUP = null;
					let adaKoma = req.auth.LOCATION_CODE.indexOf( ',', 0 );
					if ( adaKoma !== -1 ) {
						req.auth.LOCATION_CODE_GROUP = req.auth.LOCATION_CODE.split( ',' );
					}
					console.log( req.auth.LOCATION_CODE_GROUP );
					req.config = config;
					next();
				}
			} );
		}
		else {
			// Forbidden
			res.sendStatus( 403 );
		}
	}