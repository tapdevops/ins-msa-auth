/*
 |--------------------------------------------------------------------------
 | App Setup
 |--------------------------------------------------------------------------
 |
 | aUntuk menghandle models, libraries, helper, node modules, dan lain-lain
 |
 */
    const Terminal = require( 'child_process' ).execSync;
    const csvToJson = require( 'csvtojson' );
    const Helper = require( _directory_base + '/app/v1.2/Http/Libraries/Helper.js' );
    const Client = require( 'node-rest-client' ).Client;
    const client = new Client();
    const jsonfile = require( 'jsonfile' );
    const fs = require( 'fs' );
    const ebccServiceUrl = config.app.url[config.app.env].microservice_ebcc_validation;
    const findingServiceUrl = config.app.url[config.app.env].microservice_finding;
    const inspectionServiceUrl = config.app.url[config.app.env].microservice_inspection;
    const imageServiceUrl = config.app.url[config.app.env].microservice_images;
 /*
 |--------------------------------------------------------------------------
 | Versi 1.1
 |--------------------------------------------------------------------------
 */

 /*
 |---------------------------------------------------------------------------------------------
 | Fungsi read_database digunakan untuk membaca file json berisi data transaksi
 | ( finding, ebcc detail, ebcc header, inspection header, inspection detail, inspection track, 
 | inspection genba, dan image) yang diupload melalui web. Data-data tersebut kemudian ditambahkan 
 | ke mongodb
 |---------------------------------------------------------------------------------------------
 */
    exports.read_database = async ( req, res ) => {
        if ( !req.files ) {
            return res.send( {
                status: false,
                message: 'Tentukan file .json terlebih dahulu!',
                data: []
            } );
        }

        let file = req.files.JSON;
        let filename = file.name;
        if ( file.name.endsWith( '.json' ) && file.mimetype === 'application/json' ) {
            let directory;
            try {
                directory = _directory_base + '/public/tmp/import-db-json/' + filename;
                try {
                    await file.mv( directory );
                } catch ( error ) {
                    console.log( error );
                }
                let results;
                fs.readFile( directory, 'utf8', function ( err, data ) {
                    if (err) throw err;
                    results = JSON.parse( data );
                    results.forEach( function ( result ) {
                        if (result['TABLE_NAME'] === 'TR_FINDING') {
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach(function ( rs ) {
                                    rs.DUE_DATE = rs.DUE_DATE === "" ? 0 : parseInt( Helper.date_format( rs.DUE_DATE, 'YYYYMMDDhhmmss' ) );
                                    rs.PROGRESS = parseInt( rs.PROGRESS );
                                    rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                    rs.UPDATE_TIME = rs.UPDATE_TIME === "" ? 0 : parseInt( Helper.date_format( rs.UPDATE_TIME, 'YYYYMMDDhhmmss' ) );
                                    rs.END_TIME = rs.END_TIME === "" ? 0 : parseInt( Helper.date_format( rs.END_TIME, 'YYYYMMDDhhmmss' ) );
                                    rs.RATING_VALUE = parseInt( rs.RATING_VALUE );
                                    rs.SYNC_IMAGE = undefined;
                                    rs.STATUS_SYNC = undefined;
                                    rs.STATUS = undefined;
                                    rs.syncImage = undefined;
                                    rs.DELETE_USER = "";
                                    rs.DELETE_TIME = 0;
                                    
                                    let args = {
                                        data: rs ,
                                        headers: { 
                                            "Content-Type": "application/json", 
                                            "Authorization": req.headers.authorization
                                        }
                                    }
                                    let request = client.post( findingServiceUrl + '/api/v1.2/finding', args, function ( data, response ) {
                                        console.log( 'sukses simpan finding' );
                                    } );
                                    request.on( 'error', ( err ) => {
                                        console.log( `FINDING ${err.message}` );
                                    } );
                                } );
                            } );
                        } else if ( result['TABLE_NAME'] ===  'TM_INSPECTION_TRACK' ) {
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach( function ( rs ) {
                                    rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                    rs.DATE_TRACK = parseInt( Helper.date_format( rs.DATE_TRACK, 'YYYYMMDDhhmmss' ) );
                                    rs.SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                    rs.STATUS_SYNC = undefined;
                                    rs.UPDATE_TIME = 0;
                                    rs.UPDATE_USER = "";
                                    rs.DELETE_TIME = 0;
                                    rs.DELETE_USER = "";
                                    rs.STATUS_TRACK = 1;

                                    let args = {
                                        data: rs,
                                        headers: { 
                                            "Content-Type": "application/json", 
                                            "Authorization": req.headers.authorization
                                        }
                                    }
                                    let request = client.post( inspectionServiceUrl + '/api/v1.2/tracking', args, function ( data, response ) {
                                        console.log( 'sukses simpan inspection track' );
                                    } );
                                    request.on( 'error', ( err ) => {
                                        console.log( `INSPECTION TRACK: ${err.message}` );
                                    } );
                                } );
                            } );     
                        } else if ( result['TABLE_NAME'] === "TR_H_EBCC_VALIDATION" ) {
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach( function ( rs ) {
                                    rs.TOTAL_JANJANG = undefined;
                                    rs.SYNC_IMAGE = undefined;
                                    rs.SYNC_DETAIL = undefined;
                                    rs.STATUS_SYNC = "Y",
                                    rs.SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                    rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                    rs.UPDATE_TIME = 0;
                                    rs.UPDATE_USER = "";
                                    rs.DELETE_TIME = 0;
                                    rs.DELETE_USER = "";
                                    rs.syncImage = undefined,
                                    rs.syncDetail = undefined
                                    
                                    let args = {
                                        data: rs ,
                                        headers: { 
                                            "Content-Type": "application/json", 
                                            "Authorization": req.headers.authorization
                                        }
                                    }
                                    let request = client.post( ebccServiceUrl + '/api/v1.2/ebcc/validation/header', args, function ( data, response ) {
                                        console.log( 'sukses simpan ebcc header' );
                                    } );
                                    request.on( 'error', ( err ) => {
                                        console.log( `EBCC HEADER ${err.message}` );
                                    } );
                                } );
                            } );
                        } else if ( result['TABLE_NAME'] === 'TR_D_EBCC_VALIDATION' ) {
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach( function ( rs ) {
                                    rs.JUMLAH = parseInt( rs.JUMLAH );
                                    rs.EBCC_VALIDATION_CODE_D = undefined;
                                    rs.UOM = undefined;
                                    rs.GROUP_KUALITAS = undefined;
                                    rs.NAMA_KUALITAS = undefined;
                                    rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                    rs.SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                    rs.STATUS_SYNC = "Y";
                                
                                    let args = {
                                        data: rs ,
                                        headers: { 
                                            "Content-Type": "application/json", 
                                            "Authorization": req.headers.authorization
                                        }
                                    }
                                    let request = client.post( ebccServiceUrl + '/api/v1.2/ebcc/validation/detail', args, function ( data, response ) {
                                        console.log( 'sukses simpan ebcc detail' );
                                    } );
                                    request.on( 'error', ( err ) => {
                                        console.log( `EBCC DETAIL ${err.message}` );
                                    } );
                                } );
                            } );
                        } else if ( result['TABLE_NAME'] === 'TR_BLOCK_INSPECTION_D' ) { 
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach( function ( rs ) {
                                    rs.AREAL = undefined;
                                    rs.STATUS_SYNC = "Y";
                                    rs.SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                    rs.UPDATE_TIME = 0;
                                    rs.UPDATE_USER = "";
                                    rs.DELETE_TIME = 0;
                                    rs.DELETE_USER = "";
                                    rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                    
                                    let args = {
                                        data: rs ,
                                        headers: { 
                                            "Content-Type": "application/json", 
                                            "Authorization": req.headers.authorization
                                        }
                                    }
                                    let request = client.post( inspectionServiceUrl + '/api/v1.2/detail', args, function ( data, response ) {
                                        console.log( 'sukses simpan inspection detail' );
                                    } );
                                    request.on( 'error', ( err ) => {
                                        console.log( `INSPECTION DETAIL ${err.message}` );
                                    } );
                                } );
                            } );
                        } else if ( result['TABLE_NAME'] === 'TR_BLOCK_INSPECTION_H' ) {  
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                dt.forEach( function ( rs ) {
                                    rs.ID_INSPECTION = undefined;
                                    rs.INSPECTION_DATE = parseInt( Helper.date_format( rs.INSPECTION_DATE, 'YYYYMMDDhhmmss' ) );
                                    rs.INSPECTION_SCORE = parseInt( Helper.date_format( rs.INSPECTION_SCORE, 'YYYYMMDDhhmmss' ) );
                                    rs.STATUS_SYNC = "Y",
                                    rs.INSERT_TIME = parseInt( Helper.date_format( rs.INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                    rs.SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                    rs.START_INSPECTION = parseInt( Helper.date_format( rs.START_INSPECTION, 'YYYYMMDDhhmmss' ) );
                                    rs.END_INSPECTION = parseInt( Helper.date_format( rs.END_INSPECTION, 'YYYYMMDDhhmmss' ) );
                                    rs.UPDATE_TIME = 0;
                                    rs.DELETE_TIME = 0;
                                    rs.UPDATE_USER = "";
                                    rs.DELETE_USER = "";
                                    rs.DISTANCE = undefined;
                                    rs.TIME = undefined;
                                    rs.inspectionType = undefined;
                                    
                                    let args = {
                                        data: rs ,
                                        headers: { 
                                            "Content-Type": "application/json", 
                                            "Authorization": req.headers.authorization
                                        }
                                    }
                                    let request = client.post( inspectionServiceUrl + '/api/v1.2/header', args, function ( data, response ) {
                                        console.log( 'sukses simpan inspection header' );
                                    } );
                                    request.on( 'error', ( err ) => {
                                        console.log( `INSPECTION HEADER ${err.message}` );
                                    } );
                                } );
                            } );
                        } else if ( result['TABLE_NAME'] === 'TR_GENBA_INSPECTION' ) {   
                            let data = realmListToArrayObject( result['DATA'] );
                            data.then( function ( dt ) {
                                if ( dt ) {
                                    dt.forEach( function ( result ) {
                                        let resultDataGenba = [];
                                        let genbaUser = realmListToArrayObject( result.GENBA_USER );
                                        if ( genbaUser ) {
                                            let userAuthCode = [];
                                            genbaUser.then( function ( rs ) {
                                                rs.forEach( function ( r ) {
                                                    userAuthCode.push( r.USER_AUTH_CODE );
                                                } );
                                                resultDataGenba.push( {
                                                    BLOCK_INSPECTION_CODE: result.BLOCK_INSPECTION_CODE,
                                                    GENBA_USER: userAuthCode
                                                } );
                                                resultDataGenba = resultDataGenba[0];
                                                let args = {
                                                    data: resultDataGenba,
                                                    headers: { 
                                                        "Content-Type": "application/json", 
                                                        "Authorization": req.headers.authorization
                                                    }
                                                }
                                                if ( userAuthCode.length > 0 ) {
                                                    let request = client.post( inspectionServiceUrl + '/api/v1.2/genba', args, function ( data, response ) {
                                                        console.log( 'sukses simpan inspection genba' );
                                                    } );
                                                    request.on( 'error', ( err ) => {
                                                        console.log( `INSPECTION GENBA ${err.message}` );
                                                    } );
                                                }
                                            } );
                                        }
                                    } );
                                }
                            } );
                        } else if( result['TABLE_NAME'] === 'TR_IMAGE' ) {
                            let results = realmListToArrayObject( result['DATA'] );
                            results.then( function ( data ) {
                                let dateNow = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                let dateSubstring = dateNow.toString().substring( 0, 8 );
                                const trCodeInitial = [ 'F', 'V', 'I' ];
                                const imagePath = [ 'image-finding/backup-' + dateSubstring, 
                                                    'image-ebcc/backup-' + dateSubstring,
                                                    'image-inspeksi/backup-' + dateSubstring ];
                                for ( let i = 0; i < data.length; i++ ) {
                                    for ( let j = 0; j < trCodeInitial.length; j++ ) {
                                        if ( data[i].TR_CODE.startsWith( trCodeInitial[j] ) ) {
                                            data[i].IMAGE_PATH = imagePath[j];
                                        }
                                    }
                                    data[i].MIME_TYPE = "image/jpeg";
                                    data[i].SYNC_TIME = dateNow
                                    data[i].INSERT_TIME = data[i].INSERT_TIME === "" ? "" : parseInt( Helper.date_format( data[i].INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                    data[i].UPDATE_TIME = 0;
                                    data[i].DELETE_TIME = 0;
                                    data[i].UPDATE_USER = "";
                                    data[i].DELETE_USER = "";
                                    data[i].STATUS_SYNC = "Y";
                                    data[i].IMAGE_URL = undefined;
        
                                    let dataResult = data[i];
                                    let args = {
                                        data: dataResult,
                                        headers: { 
                                            "Content-Type": "application/json", 
                                            "Authorization": req.headers.authorization
                                        }
                                    }
                                    let request = client.post( imageServiceUrl + '/api/v1.2/auth/upload/image/foto-transaksi', args, function ( data, response ) {
                                        console.log( 'sukses simpan image' );
                                    } );
                                    request.on( 'error', ( err ) => {
                                        console.log( `IMAGE ${err}` );
                                    } );
                                }
                            } );
                        } 
                    } );
                } );
                res.send( {
                    status: true,
                    message: 'Upload file success!',
                    data: []
                } );
            } catch ( err ) {
                res.send( {
                    status: false,
                    message: error.message,
                    data: []
                } );
            } finally {
                if ( directory ) {
                    fs.unlinkSync( directory );
                }
            }
        } else {
            return res.send( {
                status: false,
                message: 'Upload file dengan ekstensi .json',
                data: []
            } );
        }
    }
    async function realmListToArrayObject(object){
        let temp = Object.values(object);
        return temp;
    }
    /*exports.read_database_backup = async ( req, res ) => {
        if ( !req.files ) {
            return res.send( {
                status: false,
                message: config.error_message.invalid_input + ' REQUEST FILES.',
                data: {}
            } );
        }
        let file = req.files.JSON;
        let filename = file.name;
        if ( file.name.endsWith( '.json' ) ) {
            try {
                let directory = _directory_base + '/public/tmp/import-db-realm/' + filename;
                try {
                    await file.mv( directory );
                } catch ( error ) {

                }
            } catch ( err ) {
                console.log( err );
            }
        }
        let headers = {
            headersEBCCHeader : 'EBCC_VALIDATION_CODE,WERKS,AFD_CODE,BLOCK_CODE,NO_TPH,STATUS_TPH_SCAN,ALASAN_MANUAL,LAT_TPH,LON_TPH,DELIVERY_CODE,STATUS_DELIVERY_CODE,TOTAL_JANJANG,STATUS_SYNC,SYNC_TIME,INSERT_USER,INSERT_TIME,SYNC_IMAGE,SYNC_DETAIL\n',
            headersEBCCDetail : "EBCC_VALIDATION_CODE_D,EBCC_VALIDATION_CODE,GROUP_KUALITAS,UOM,ID_KUALITAS,NAMA_KUALITAS,JUMLAH,INSERT_TIME,INSERT_USER,STATUS_SYNC,SYNC_TIME\n",
            headersInspectionDetail : "BLOCK_INSPECTION_CODE_D,BLOCK_INSPECTION_CODE,ID_INSPECTION,CONTENT_INSPECTION_CODE,VALUE,AREAL,STATUS_SYNC,INSERT_USER,INSERT_TIME\n",
            headersInspectionHeader : "BLOCK_INSPECTION_CODE,ID_INSPECTION,WERKS,AFD_CODE,BLOCK_CODE,AREAL,INSPECTION_TYPE,STATUS_BLOCK,INSPECTION_DATE,INSPECTION_RESULT,INSPECTION_SCORE,STATUS_SYNC,SYNC_TIME,START_INSPECTION,END_INSPECTION,LAT_START_INSPECTION,LONG_START_INSPECTION,LAT_END_INSPECTION,LONG_END_INSPECTION,INSERT_USER,INSERT_TIME,TIME,DISTANCE,inspectionType\n",
            headersFinding : "FINDING_CODE,WERKS,AFD_CODE,BLOCK_CODE,FINDING_CATEGORY,FINDING_DESC,FINDING_PRIORITY,DUE_DATE,STATUS,ASSIGN_TO,PROGRESS,LAT_FINDING,LONG_FINDING,REFFERENCE_INS_CODE,INSERT_USER,INSERT_TIME,UPDATE_USER,UPDATE_TIME,STATUS_SYNC,RATING_VALUE,RATING_MESSAGE,END_TIME,SYNC_IMAGE\n",
            headersInspectionTrack : "TRACK_INSPECTION_CODE,BLOCK_INSPECTION_CODE,ID_INSPECTION,DATE_TRACK,LAT_TRACK,LONG_TRACK,INSERT_USER,INSERT_TIME,STATUS_SYNC\n",
            headerInspectionGenba : "BLOCK_INSPECTION_CODE,GENBA_USER,STATUS_SYNC\n",
            headerImage: "IMAGE_CODE,TR_CODE,IMAGE_NAME,IMAGE_PATH_LOCAL,IMAGE_URL,STATUS_IMAGE,STATUS_SYNC,INSERT_USER,INSERT_TIME\n"
        }
        let file = req.files.REALM;
        
        if ( file.name.endsWith( '.realm' ) ) {
            try {    
                let fixFileName = file.name.substring( 0, file.name.indexOf( '.' ) );
                file.name = req.auth.USER_AUTH_CODE + '-' + Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) + '.realm';
                let filename = file.name;
                let directory = _directory_base + '/public/tmp/import-db-realm/' + filename;
                try{
                    await file.mv( directory );
                } catch( error ) {
                }
                
                let options = {
                    encoding: 'utf8'
                };
                let tables = [ 'TR_H_EBCC_VALIDATION', 'TR_D_EBCC_VALIDATION', 'TR_BLOCK_INSPECTION_D', 'TR_BLOCK_INSPECTION_H', 'TR_FINDING', 'TM_INSPECTION_TRACK', 'TR_GENBA_INSPECTION', "TR_IMAGE" ];
                let headersName = ["headersEBCCHeader", "headersEBCCDetail", "headersInspectionDetail", "headersInspectionHeader", "headersFinding", "headersInspectionTrack", "headerInspectionGenba", "headerImage"];
                try {
                    for ( let i = 0; i < tables.length; i++ ) {
                        let newCsvFileName = './public/tmp/import-db-realm/' + req.auth.USER_AUTH_CODE + '-' + Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) + '-' + tables[i] + '.csv';
                        let cmd = "realm-exporter export " + directory + ' ' + tables[i] + ' > ' + newCsvFileName;
                        let result = [];
                        console.log( Terminal( cmd, options ) );
                        let currentHeaders = headers[ headersName[i] ];
                        let file = FileServer.readFileSync( newCsvFileName, 'utf8' )
                        let c = currentHeaders + file;
                        let table = tables[i];
                        await csvToJson().fromString( c )
                        .then( ( json ) => {
                            result = json;
                        } )
                        if ( tables[i] === 'TM_INSPECTION_TRACK' ) {
                            //EDIT FIELD TM_TRACK_INSPECTION
                            for ( let i = 0; i < result.length; i++ ) {
                                rs.INSERT_TIME = parseInt( Helper.date_format( result[i].INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                result[i].DATE_TRACK = parseInt( Helper.date_format( result[i].DATE_TRACK, 'YYYYMMDDhhmmss' ) );
                                result[i].SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                result[i].STATUS_SYNC = undefined;
                                result[i].UPDATE_TIME = 0;
                                result[i].UPDATE_USER = "";
                                result[i].DELETE_TIME = 0;
                                result[i].DELETE_USER = "";
                                result[i].STATUS_TRACK = 1;
                            }
                            for ( let index = 0; index < result.length; index++ ) {
                                let dataResult = result[index];
                                let args = {
                                    data: dataResult ,
                                    headers: { 
                                        "Content-Type": "application/json", 
                                        "Authorization": req.headers.authorization
                                    }
                                }
                                let request = client.post( inspectionServiceUrl + '/api/v1.2/tracking', args, function ( data, response ) {
                                    // console.log( 'sukses simpan inspection track' );
                                } );
                                request.on( 'error', ( err ) => {
                                    console.log( `INSPECTION TRACK: ${err.message}` );
                                } );
                            }
                        }
                        else if ( tables[i] === 'TR_H_EBCC_VALIDATION' ) {
                            //EDIT FIELD EBCC_VALIDATION_H
                            for ( let i = 0; i < result.length; i++ ) {
                                result[i].TOTAL_JANJANG = undefined;
                                result[i].SYNC_IMAGE = undefined;
                                result[i].SYNC_DETAIL = undefined;
                                result[i].STATUS_SYNC = "Y",
                                result[i].SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                result[i].INSERT_TIME = parseInt( Helper.date_format( result[i].INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                result[i].UPDATE_TIME = 0;
                                result[i].UPDATE_USER = "";
                                result[i].DELETE_TIME = 0;
                                result[i].DELETE_USER = "";
                            }
                            for ( let index = 0; index < result.length; index++ ) {
                                let dataResult = result[index];
                                let args = {
                                    data: dataResult ,
                                    headers: { 
                                        "Content-Type": "application/json", 
                                        "Authorization": req.headers.authorization
                                    }
                                }
                                let request = client.post( ebccServiceUrl + '/api/v1.2/ebcc/validation/header', args, function ( data, response ) {
                                    // console.log( 'sukses simpan ebcc header' );
                                } );
                                request.on( 'error', ( err ) => {
                                    console.log( `EBCC HEADER ${err.message}` );
                                } );
                            }
                        }
                        else if ( tables[i] === 'TR_D_EBCC_VALIDATION' ) {
                            //EDIT FIELD EBCC_VALIDATION_D
                            for ( let i = 0; i < result.length; i++ ) {
                                result[i].JUMLAH = parseInt( result[i].JUMLAH );
                                result[i].EBCC_VALIDATION_CODE_D = undefined;
                                result[i].UOM = undefined;
                                result[i].GROUP_KUALITAS = undefined;
                                result[i].NAMA_KUALITAS = undefined;
                                result[i].INSERT_TIME = parseInt( Helper.date_format( result[i].INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                result[i].SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                result[i].STATUS_SYNC = "Y";
                            }
                            for ( let index = 0; index < result.length; index++ ) {
                                let dataResult = result[index];
                                let args = {
                                    data: dataResult ,
                                    headers: { 
                                        "Content-Type": "application/json", 
                                        "Authorization": req.headers.authorization
                                    }
                                }
                                let request = client.post( ebccServiceUrl + '/api/v1.2/ebcc/validation/detail', args, function ( data, response ) {
                                    // console.log( 'sukses simpan ebcc detail' );
                                } );
                                request.on( 'error', ( err ) => {
                                    console.log( `EBCC DETAIL ${err.message}` );
                                } );
                            }
                        }
                        else if ( tables[i] === 'TR_FINDING' ) {
                            //EDIT FIELD FINDING
                            for ( let i = 0; i < result.length; i++ ) {
                                result[i].DUE_DATE = result[i].DUE_DATE === "" ? 0 : parseInt( Helper.date_format( result[i].DUE_DATE, 'YYYYMMDDhhmmss' ) );
                                result[i].PROGRESS = parseInt( result[i].PROGRESS );
                                result[i].INSERT_TIME = parseInt( Helper.date_format( result[i].INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                result[i].UPDATE_TIME = result[i].UPDATE_TIME === "" ? 0 : parseInt( Helper.date_format( result[i].UPDATE_TIME, 'YYYYMMDDhhmmss' ) );
                                result[i].END_TIME = 0;
                                result[i].RATING_VALUE = parseInt( result[i].RATING_VALUE );
                                result[i].SYNC_IMAGE = undefined;
                                result[i].STATUS_SYNC = undefined;
                                result[i].STATUS = undefined;
                                result[i].DELETE_USER = "";
                                result[i].DELETE_TIME = 0;
                            }
                            for ( let index = 0; index < result.length; index++ ) {
                                let dataResult = result[index];
                                let args = {
                                    data: dataResult ,
                                    headers: { 
                                        "Content-Type": "application/json", 
                                        "Authorization": req.headers.authorization
                                    }
                                }
                                let request = client.post( findingServiceUrl + '/api/v1.2/finding', args, function ( data, response ) {
                                    // console.log( 'sukses simpan finding' );
                                } );
                                request.on( 'error', ( err ) => {
                                    console.log( `FINDING ${err.message}` );
                                } );
                            }
                        }
                        else if ( tables[i] === 'TR_BLOCK_INSPECTION_D' ) {
                            // EDIT FIELD INSPECTION_BLOCK_D
                            for ( let i = 0; i < result.length; i++ ) {
                                result[i].AREAL = undefined;
                                result[i].STATUS_SYNC = "Y";
                                result[i].SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                result[i].UPDATE_TIME = 0;
                                result[i].UPDATE_USER = "";
                                result[i].DELETE_TIME = 0;
                                result[i].DELETE_USER = "";
                                result[i].INSERT_TIME = parseInt( Helper.date_format( result[i].INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                            }
                            for ( let index = 0; index < result.length; index++ ) {
                                let dataResult = result[index];
                                let args = {
                                    data: dataResult ,
                                    headers: { 
                                        "Content-Type": "application/json", 
                                        "Authorization": req.headers.authorization
                                    }
                                }
                                let request = client.post( inspectionServiceUrl + '/api/v1.2/detail', args, function ( data, response ) {
                                    // console.log( 'sukses simpan inspection detail' );
                                } );
                                request.on( 'error', ( err ) => {
                                    console.log( `INSPECTION DETAIL ${err.message}` );
                                } );
                            }
                        }
                        else if ( tables[i] === 'TR_BLOCK_INSPECTION_H' ) {
                            //EDIT FIELD INSPECTION_BLOCK_H
                            for ( let i = 0; i < result.length; i++ ) {
                                result[i].ID_INSPECTION = undefined;
                                result[i].INSPECTION_DATE = parseInt( Helper.date_format( result[i].INSPECTION_DATE, 'YYYYMMDDhhmmss' ) );
                                result[i].INSPECTION_SCORE = parseInt( Helper.date_format( result[i].INSPECTION_SCORE, 'YYYYMMDDhhmmss' ) );
                                result[i].STATUS_SYNC = "Y",
                                result[i].INSERT_TIME = parseInt( Helper.date_format( result[i].INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                result[i].SYNC_TIME = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                                result[i].START_INSPECTION = parseInt( Helper.date_format( result[i].START_INSPECTION, 'YYYYMMDDhhmmss' ) );
                                result[i].END_INSPECTION = parseInt( Helper.date_format( result[i].END_INSPECTION, 'YYYYMMDDhhmmss' ) );
                                result[i].UPDATE_TIME = 0;
                                result[i].DELETE_TIME = 0;
                                result[i].UPDATE_USER = "";
                                result[i].DELETE_USER = "";
                                result[i].DISTANCE = undefined;
                                result[i].TIME = undefined;
                                result[i].inspectionType = undefined;
                            }
                            for ( let index = 0; index < result.length; index++ ) {
                                let dataResult = result[index];
                                let args = {
                                    data: dataResult ,
                                    headers: { 
                                        "Content-Type": "application/json", 
                                        "Authorization": req.headers.authorization
                                    }
                                }
                                let request = client.post( inspectionServiceUrl + '/api/v1.2/header', args, function ( data, response ) {
                                    // console.log( 'sukses simpan inspection header' );
                                } );
                                request.on( 'error', ( err ) => {
                                    console.log( `INSPECTION HEADER ${err.message}` );
                                } );
                                
                            }
                        } else if ( tables[i] === 'TR_GENBA_INSPECTION' ) {
                            result = [];
                            try {
                                let realm = new Realm( { path: directory } );
                                let genbaObject = JSON.parse( JSON.stringify( realm.objects( 'TR_GENBA_INSPECTION' ) ) );
                                // console.log( genbaObject[ 11 ].GENBA_USER[ 0 ].USER_AUTH_CODE );
                                for ( let key in genbaObject ) {
                                    let blockInspectionCode = genbaObject[ key ].BLOCK_INSPECTION_CODE;
                                    if ( genbaObject[ key ].GENBA_USER[ '0' ] ) {
                                        for ( let keyGenbaUser in genbaObject[ key ].GENBA_USER ) {
                                            result.push( { 
                                                BLOCK_INSPECTION_CODE : blockInspectionCode,
                                                GENBA_USER: genbaObject[ key ].GENBA_USER[ keyGenbaUser ].USER_AUTH_CODE 
                                            } );
                                        }
                                    } else {
                                        result.push( { 
                                            BLOCK_INSPECTION_CODE: blockInspectionCode,
                                            GENBA_USER: "" 
                                        } );
                                    }
                                    
                                }
                                realm.close();
                            } catch ( error ) {
                                console.log( error );
                            }

                            for ( let index = 0; index < result.length; index++ ) {
                                let dataResult = result[index];
                                let args = {
                                    data: dataResult ,
                                    headers: { 
                                        "Content-Type": "application/json", 
                                        "Authorization": req.headers.authorization
                                    }
                                }
                                result[index].GENBA_USER = [ result[index].GENBA_USER ];
                                if ( result[index].GENBA_USER[0] !== "" ) {
                                    let request = client.post( inspectionServiceUrl + '/api/v1.2/genba', args, function ( data, response ) {
                                        console.log( 'sukses simpan inspection genba', result[index].GENBA_USER );
                                    } );
                                    request.on( 'error', ( err ) => {
                                        console.log( `INSPECTION GENBA ${err.message}` );
                                    } );
                                }
                            }
                            // for( let i = 0; i < result.length; i++ ) {
                            //     result[i].STATUS_SYNC = undefined;
                            //     result[i].GENBA_USER = genbaUser[i];
                            // }
                        } else if ( tables[i] === 'TR_IMAGE' ) {
                            let dateNow = parseInt( Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) );
                            let dateSubstring = dateNow.toString().substring( 0, 8 );
                            const trCodeInitial = [ 'F', 'V', 'I' ];
                            const imagePath = [ 'image-finding/backup-' + dateSubstring, 
                                                'image-ebcc/backup-' + dateSubstring,
                                                'image-inspeksi/backup-' + dateSubstring ];
                            for ( let i = 0; i < result.length; i++ ) {
                                for ( let j = 0; j < trCodeInitial.length; j++ ) {
                                    if ( result[i].TR_CODE.startsWith( trCodeInitial[j] ) ) {
                                        result[i].IMAGE_PATH = imagePath[j];
                                    }
                                }
                                result[i].MIME_TYPE = "image/jpeg";
                                result[i].SYNC_TIME = dateNow
                                result[i].INSERT_TIME = result[i].INSERT_TIME === "" ? "" : parseInt( Helper.date_format( result[i].INSERT_TIME, 'YYYYMMDDhhmmss' ) );
                                result[i].UPDATE_TIME = 0;
                                result[i].DELETE_TIME = 0;
                                result[i].UPDATE_USER = "";
                                result[i].DELETE_USER = "";
                                result[i].STATUS_SYNC = "Y";
                                result[i].IMAGE_URL = undefined;
                            }
                            for ( let index = 0; index < result.length; index++ ) {
                                let dataResult = result[index];
                                let args = {
                                    data: dataResult,
                                    headers: { 
                                        "Content-Type": "application/json", 
                                        "Authorization": req.headers.authorization
                                    }
                                }
                                let request = client.post( imageServiceUrl + '/api/v1.2/auth/upload/image/foto-transaksi', args, function ( data, response ) {
                                    // console.log( 'sukses simpan image' );
                                } );
                                request.on( 'error', ( err ) => {
                                    console.log( `IMAGE ${err}` );
                                } );
                            }
                        }
                        // let jsonFilePath = './public/tmp/import-db-realm/' + fixFileName + '-'  + Helper.date_format( 'now', 'YYYYMMDDhhmmss' ) + '-' + req.auth.USER_AUTH_CODE +  '-' + tables[i] + '.json';
                        // jsonfile.writeFileSync(jsonFilePath, result ) 
                        FileServer.unlinkSync( newCsvFileName );
                    }
                    FileServer.unlinkSync( directory );
                    // FileServer.unlinkSync( directory + '.management' );
                    FileServer.rmdir( directory + '.management', function(err) {
                        if (err) {
                          throw err
                        } else {
                          console.log("Successfully removed the empty directory!")
                        } 
                    } );
                        
                    FileServer.unlinkSync( directory + '.lock' );
                    res.send( {
                        status: true,
                        message: 'Success!',
                        data: []
                    } );
                } catch ( err ) {
                    console.log( err );
                    res.send( {
                        status: false,
                        message: err,
                        data: []
                    } )
                }
            } catch ( error ) {
                res.send( {
                    status: false,
                    message: error.message,
                    data: []
                } )
            }
        } else {
            res.send( {
                status: false,
                message: 'Upload file dengan ekstensi .realm',
                data: []
            } )
        }
    }*/