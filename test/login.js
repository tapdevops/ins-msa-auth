/**
 * --------------------------------------------------
 * SETUP VARIABLE
 * --------------------------------------------------
 */
// Libraries
const request = require( 'supertest' );
const app = require( '../app.js' );
const expect = require( 'chai' ).expect;

// Setup Testing
const testing_name = "Login";
const url = {
	login: 'http://149.129.242.205:3001/api/login'
}
const data_dummy = {
	"data_user_login": [
		{
			"username":"uat1",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat2",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat3",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat4",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat5",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat6",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat7",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat8",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat9",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat10",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat11",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat12",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat13",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat14",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat15",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat16",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat17",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat18",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat19",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat20",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat21",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat22",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat23",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat24",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat25",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat26",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat27",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat28",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat29",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat30",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat31",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat32",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat33",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat34",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat35",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat36",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat37",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat38",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat39",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat40",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat41",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat42",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat43",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat44",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat45",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat46",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat47",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat48",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat49",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat50",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat51",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat52",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat53",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat54",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat55",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat56",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat57",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat58",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat59",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat60",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat61",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat62",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat63",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat64",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat65",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat66",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat67",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat68",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat69",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat70",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat71",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat72",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat73",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat74",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat75",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat76",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat77",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat78",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat79",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat80",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat81",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat82",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat83",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat84",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat85",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat86",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat87",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat88",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat89",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat90",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat91",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat92",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat93",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat94",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat95",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat96",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat97",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat98",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat99",
			"password":"uat123",
			"imei":"TEST"
		}, {
			"username":"uat100",
			"password":"uat123",
			"imei":"TEST"
		}
	]
};

/**
 * --------------------------------------------------
 * BEGIN TESTING
 * --------------------------------------------------
 */
describe( testing_name, function() {

	var i = 1;
	var dummy = data_dummy.data_user_login;

	dummy.forEach( function( result ) {
		it ( i + ' - Login dengan username ' + result.username, function( done ) {
			this.timeout( 25000 );
			request( app )
				.post( '/api/login' )
				.set( 'Accept', 'application/json' )
				.set( 'Content-Type', 'application/json' )
				.send( { username: result.username, password: result.password, imei: result.imei } )
				.expect( 200 )
				.expect( 'Content-Type', /json/ )
				.end( done );
		} );

		i++;
	} );

} );

