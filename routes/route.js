const jwt = require( 'jsonwebtoken' );
const config = require( '../config/config.js' );
const uuid = require( 'uuid' );
const nJwt = require( 'njwt' );
const jwtDecode = require( 'jwt-decode' );

module.exports = ( app ) => {

	// Declare Controllers
	//const auth = require( '../app/controllers/auth.js' );
	
	const microserviceMasterdata = require( '../app/controllers/microserviceMasterdata.js' );
	const microserviceImages = require( '../app/controllers/microserviceImages.js' );
	const microserviceFinding = require( '../app/controllers/microserviceFinding.js' );
	const employeeHRIS = require( '../app/controllers/employeeHRIS.js' );
	const employeeSAP = require( '../app/controllers/employeeSAP.js' );
	const pjs = require( '../app/controllers/pjs.js' );
	const pjsLog = require( '../app/controllers/pjsLog.js' );
	const loginLog = require( '../app/controllers/loginLog.js' );
	const syncDBLog = require( '../app/controllers/syncDBLog.js' );
	const modules = require( '../app/controllers/modules.js' );
	const content = require( '../app/controllers/content.js' );
	const contentLabel = require( '../app/controllers/contentLabel.js' );
	const parameter = require( '../app/controllers/parameter.js' );
	const userAuthorization = require( '../app/controllers/userAuthorization.js' );
	const userSearch = require( '../app/controllers/userSearch.js' );
	const contacts = require( '../app/controllers/contacts.js' );
	const category = require( '../app/controllers/category.js' );
	const login = require( '../app/controllers/login.js' );
	const mobileSync = require( '../app/controllers/mobileSync.js' );
	const kriteria = require( '../app/controllers/kriteria.js' );
	const configSSH = require( '../app/controllers/configSSH.js' );
	const user = require( '../app/controllers/user.js' );
	const webReport = require( '../app/controllers/webReport.js' );


	// Routing: Auth
	//app.post( '/api/login', auth.login );
	//app.get( '/api/test', verifyToken, auth.test );

	// ROUTE - INSPECTION
	//app.get( '/api/inspection', verifyToken, microserviceInspection.find );

	/*══════════════════════════════════════════════════════════════════════════════╗
	║                                                                               ║
	║ Route      : Inspeksi                                                         ║
	║ Keterangan :                                                                  ║
	║                                                                               ║
	╠═══════════════════════════════════════════════════════════════════════════════╣
	║ Untuk mengambil, menyimpan, menampilkan, dan menghapus data dari MSA Inspeksi ║
	╟──────────────────────────╥────────────────────────────────────────────────────╢
	║ Function                 ║ Keterangan                                         ║
	╟──────────────────────────╫────────────────────────────────────────────────────╢
	║ createH                  ║ Untuk membuat data inspeksi header                 ║
	╟──────────────────────────╫────────────────────────────────────────────────────╢
	║ findH                    ║ Untuk menampilkan data Inspeksi                    ║
	╟──────────────────────────╫────────────────────────────────────────────────────╢
	║ findOneH                 ║ Untuk menampilkan data Inspeksi berdasarkan ID     ║
	╟──────────────────────────╫────────────────────────────────────────────────────╢
	║ updateH                  ║ Untuk mengupdate data inspeksi header              ║
	╟──────────────────────────╫────────────────────────────────────────────────────╢
	║ createH                  ║ Untuk membuat data inspeksi header                 ║
	╟──────────────────────────╫────────────────────────────────────────────────────╢
	║ createH                  ║ Untuk membuat data inspeksi header                 ║
	╟──────────────────────────╫────────────────────────────────────────────────────╢
	║ findH                    ║ Untuk menampilkan data Inspeksi                    ║
	╚══════════════════════════╩═══════════════════════════════════════════════════*/

	const microserviceInspection = require( '../app/controllers/microserviceInspection.js' );

	app.post( '/api/inspection', verifyToken, microserviceInspection.create );
	app.post( '/api/inspection-header', verifyToken, microserviceInspection.createH );
	app.get( '/api/inspection-header', verifyToken, microserviceInspection.findH );
	app.get( '/api/inspection-header/:id', verifyToken, microserviceInspection.findOneH );
	app.put( '/api/inspection-header/:id', verifyToken, microserviceInspection.updateH );
	app.delete( '/api/inspection-header/:id', verifyToken, microserviceInspection.deleteH );
	app.post( '/api/inspection-detail', verifyToken, microserviceInspection.createD );
	app.get( '/api/inspection-detail', verifyToken, microserviceInspection.findD );
	app.get( '/api/inspection-detail/:id', verifyToken, microserviceInspection.findOneD );
	app.put( '/api/inspection-detail/:id', verifyToken, microserviceInspection.updateD );
	app.delete( '/api/inspection-detail/:id', verifyToken, microserviceInspection.deleteD );
	app.post( '/api/inspection-tracking', verifyToken, microserviceInspection.createTracking );



	// ROUTE - MASTERDATA BLOCK
	app.get( '/api/hectare-statement/block', verifyToken, microserviceMasterdata.blockFind );
	app.get( '/api/hectare-statement/block/:id', verifyToken, microserviceMasterdata.blockFindOne );
	app.post( '/api/hectare-statement/block', verifyToken, microserviceMasterdata.blockCreate );
	app.put( '/api/hectare-statement/block/:id', verifyToken, microserviceMasterdata.blockUpdate );
	app.delete( '/api/hectare-statement/block/:id', verifyToken, microserviceMasterdata.blockDelete );
	
	// ROUTE - MASTERDATA AFDELING
	app.get( '/api/hectare-statement/afdeling', verifyToken, microserviceMasterdata.afdelingFind );
	app.get( '/api/hectare-statement/afdeling/:id', verifyToken, microserviceMasterdata.afdelingFindOne );
	app.post( '/api/hectare-statement/afdeling', verifyToken, microserviceMasterdata.afdelingCreate );
	app.put( '/api/hectare-statement/afdeling/:id', verifyToken, microserviceMasterdata.afdelingUpdate );
	app.delete( '/api/hectare-statement/afdeling/:id', verifyToken, microserviceMasterdata.afdelingDelete );

	// ROUTE - MASTERDATA FINDING
	app.get( '/api/finding', verifyToken, microserviceFinding.find );
	app.get( '/api/finding-history', verifyToken, microserviceFinding.findByTokenAuthCode );
	app.get( '/api/finding/:id', verifyToken, microserviceFinding.findOne );
	app.post( '/api/finding', verifyToken, microserviceFinding.create );
	app.put( '/api/finding/:id', verifyToken, microserviceFinding.update );
	app.delete( '/api/finding/:id', verifyToken, microserviceFinding.delete );

	// ROUTE GEOM SKM DESGIN
	app.get( '/api/geom/design/block/:id', token_verify, microserviceMasterdata.findSKMDesignBlockGeoJSON );

	// ROUTE - IMAGES
	app.post( '/api/image/description', token_verify, microserviceImages.create  );
	
	// ROUTE - EMPLOYEE HRIS
	app.post( '/sync/employee-hris', employeeHRIS.createOrUpdate );
	app.get( '/api/employee-hris', verifyToken, employeeHRIS.find );

	// ROUTE - EMPLOYEE SAP
	app.post( '/sync/employee-sap', employeeSAP.createOrUpdate );

	// ROUTE - PJS
	app.post( '/api/pjs/', verifyToken, pjs.create );

	// ROUTE - PJS Log
	app.post( '/api/pjs-log', verifyToken, pjsLog.create );

	// ROUTE - Login Log
	app.post( '/api/login-log', verifyToken, loginLog.create );

	// ROUTE - Sync DB Log
	app.post( '/api/sync-db-log', syncDBLog.create );

	// ROUTE - Web Menu
	app.get( '/api/modules/by-job', token_verify, modules.findByJob );
	app.get( '/api/modules/by-job/:id', token_verify, modules.findByJob );
	app.post( '/api/modules', token_verify, modules.createOrUpdate );
	app.get( '/api/modules', verifyToken, modules.find );
	app.get( '/api/modules/:id', verifyToken, modules.findOne );
	app.put( '/api/modules/:id', verifyToken, modules.update );
	app.delete( '/api/modules/:id', verifyToken, modules.delete );

	// ROUTE - Content
	app.get( '/api/content', token_verify, content.find );
	app.get( '/api/content/:id', token_verify, content.findOne );
	app.post( '/api/content', token_verify, content.create );
	app.put( '/api/content/:id', token_verify, content.update );
	app.delete( '/api/content/:id', token_verify, content.delete );

	// ROUTE - Content
	app.get( '/api/content-label', token_verify, contentLabel.find );
	app.get( '/api/content-label/:id', token_verify, contentLabel.findOne );
	app.post( '/api/content-label', token_verify, contentLabel.create );
	app.put( '/api/content-label/:id', token_verify, contentLabel.update );
	app.delete( '/api/content-label/:id', token_verify, contentLabel.delete );

	// ROUTE - Parameter
	app.post( '/api/parameter', token_verify, parameter.create );
	app.get( '/api/parameter', token_verify, parameter.find );
	app.get( '/api/parameter/track', token_verify, parameter.findOneTimeTrack );
	

	// ROUTE - Contacts
	app.get( '/api/contacts', token_verify, contacts.find );

	// ROUTE - Login
	app.get( '/api/login', verifyToken, login.find );

	// ROUTE - USER AUTHORIZATION
	app.post( '/api/user-authorization', token_verify, userAuthorization.createOrUpdate );
	app.get( '/api/user-authorization', verifyToken, userAuthorization.find );

	// ROUTE - USER AUTHORIZATION
	//app.post( '/api/user-search', verifyToken, userSearch.createOrUpdate );
	app.get( '/api/user-search', token_verify, userSearch.findAtHRISSAP ); // Delete
	app.get( '/api/user-search/hris-sap', token_verify, userSearch.findAtHRISSAP );
	app.get( '/api/user-search/user-auth', token_verify, userSearch.findAtUserAuth );


	// ROUTE - CATEGORY
	app.post( '/api/category', token_verify, category.create );
	app.get( '/api/category', verifyToken, category.find );

	// ROUTE - MOBILE SYNC
	app.get( '/api/mobile-sync', verifyToken, mobileSync.find );
	app.post( '/api/mobile-sync', token_verify, mobileSync.create );
	app.post( '/api/mobile-sync/reset', token_verify, mobileSync.status );
	app.get( '/api/mobile-sync/finding', token_verify, mobileSync.findFinding );
	app.get( '/api/mobile-sync/finding-images', token_verify, mobileSync.findFindingImages );
	app.get( '/api/mobile-sync/hectare-statement/region', token_verify, mobileSync.findRegion );
	app.get( '/api/mobile-sync/hectare-statement/comp', token_verify, mobileSync.findComp );
	app.get( '/api/mobile-sync/hectare-statement/est', token_verify, mobileSync.findEst );
	app.get( '/api/mobile-sync/hectare-statement/afdeling', token_verify, mobileSync.findAfd );
	app.get( '/api/mobile-sync/hectare-statement/block', token_verify, mobileSync.findBlock );
	app.get( '/api/mobile-sync/hectare-statement/land-use', token_verify, mobileSync.findLandUse );

	app.get( '/api/mobile-sync/auth/kriteria', token_verify, mobileSync.findKriteria );





	app.get( '/api/mobile-sync/auth/contact', token_verify, mobileSync.findContact );

	// Config SSH
	app.get( '/init', configSSH.init );

	// User
	app.get( '/api/user', token_verify, user.find );
	app.get( '/api/user/:id', token_verify, user.findOne );
	app.put( '/api/user/:id', token_verify, user.update );
	app.post( '/api/user', token_verify, user.create );

	// REPORT - FINDING
	app.get( '/api/web-report/finding', token_verify, webReport.findingFindReport );
	app.get( '/api/web-report/inspection', token_verify, webReport.findingInspectionReport );
	app.get( '/api/web-report/inspection/content-code', token_verify, webReport.findInspectionContent );
	app.get( '/api/web-report/inspection/kriteria/:id', token_verify, webReport.findInspectionKriteria );

	//app.get( '/api/mobile-sync/hectare-statement/test', verifyToken, mobileSync.findTest );

	// ROUTE - KRITERIA
	app.post( '/api/kriteria', token_verify, kriteria.create );
	app.get( '/api/kriteria', token_verify, kriteria.find );

	const test = require( '../app/controllers/test.js' );
	app.get( '/test', test.test );

}

function verifyToken( req, res, next ) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];

	if ( typeof bearerHeader !== 'undefined' ) {
		const bearer = bearerHeader.split( ' ' );
		const bearerToken = bearer[1];

		req.token = bearerToken;
		next();
	}
	else {
		// Forbidden
		res.sendStatus( 403 );
	}
}

function token_verify( req, res, next ) {
	// Get auth header value
	const bearerHeader = req.headers['authorization'];

	if ( typeof bearerHeader !== 'undefined' ) {
		const bearer = bearerHeader.split( ' ' );
		const bearer_token = bearer[1];

		req.token = bearer_token;

		nJwt.verify( bearer_token, config.secret_key, config.token_algorithm, ( err, authData ) => {
			if ( err ) {
				res.send({
					status: false,
					message: "Invalid Token",
					data: []
				} );
			}
			else {
				req.auth = jwtDecode( req.token );
				req.auth.LOCATION_CODE_GROUP = req.auth.LOCATION_CODE.split( ',' );
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
