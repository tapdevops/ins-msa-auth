/*
|--------------------------------------------------------------------------
| Variable
|--------------------------------------------------------------------------
*/
	// Controllers
	const Controllers = {
		v_1_2: {
			Auth: require( _directory_base + '/app/v1.2/Http/Controllers/AuthController.js' ),
			Category: require( _directory_base + '/app/v1.2/Http/Controllers/CategoryController.js' ),
			Content: require( _directory_base + '/app/v1.2/Http/Controllers/ContentController.js' ),
			Kriteria: require( _directory_base + '/app/v1.2/Http/Controllers/KriteriaController.js' ),
			Module: require( _directory_base + '/app/v1.2/Http/Controllers/ModuleController.js' ),
			Parameter: require( _directory_base + '/app/v1.2/Http/Controllers/ParameterController.js' ),
			SyncMobile: require( _directory_base + '/app/v1.2/Http/Controllers/SyncMobileController.js' ),
			SyncTAP: require( _directory_base + '/app/v1.2/Http/Controllers/SyncTAPController.js' ),
			Server: require( _directory_base + '/app/v1.2/Http/Controllers/ServerController.js' ),
			User: require( _directory_base + '/app/v1.2/Http/Controllers/UserController.js' ),
			WebReport: require( _directory_base + '/app/v1.2/Http/Controllers/WebReportController.js' )
		},
		v_1_1: {
			Auth: require( _directory_base + '/app/v1.1/Http/Controllers/AuthController.js' ),
			Category: require( _directory_base + '/app/v1.1/Http/Controllers/CategoryController.js' ),
			Content: require( _directory_base + '/app/v1.1/Http/Controllers/ContentController.js' ),
			Kriteria: require( _directory_base + '/app/v1.1/Http/Controllers/KriteriaController.js' ),
			Module: require( _directory_base + '/app/v1.1/Http/Controllers/ModuleController.js' ),
			Parameter: require( _directory_base + '/app/v1.1/Http/Controllers/ParameterController.js' ),
			SyncMobile: require( _directory_base + '/app/v1.1/Http/Controllers/SyncMobileController.js' ),
			SyncTAP: require( _directory_base + '/app/v1.1/Http/Controllers/SyncTAPController.js' ),
			Server: require( _directory_base + '/app/v1.1/Http/Controllers/ServerController.js' ),
			User: require( _directory_base + '/app/v1.1/Http/Controllers/UserController.js' ),
			WebReport: require( _directory_base + '/app/v1.1/Http/Controllers/WebReportController.js' ),
			ExportKafka: require( _directory_base + '/app/v1.1/Http/Controllers/ExportKafkaController.js' )
		},
		v_1_0: {
			Auth: require( _directory_base + '/app/v1.0/Http/Controllers/AuthController.js' ),
			Category: require( _directory_base + '/app/v1.0/Http/Controllers/CategoryController.js' ),
			Content: require( _directory_base + '/app/v1.0/Http/Controllers/ContentController.js' ),
			Kriteria: require( _directory_base + '/app/v1.0/Http/Controllers/KriteriaController.js' ),
			Module: require( _directory_base + '/app/v1.0/Http/Controllers/ModuleController.js' ),
			Parameter: require( _directory_base + '/app/v1.0/Http/Controllers/ParameterController.js' ),
			SyncMobile: require( _directory_base + '/app/v1.0/Http/Controllers/SyncMobileController.js' ),
			SyncTAP: require( _directory_base + '/app/v1.0/Http/Controllers/SyncTAPController.js' ),
			Server: require( _directory_base + '/app/v1.0/Http/Controllers/ServerController.js' ),
			User: require( _directory_base + '/app/v1.0/Http/Controllers/UserController.js' ),
			WebReport: require( _directory_base + '/app/v1.0/Http/Controllers/WebReportController.js' )
		}
	}

	// Middleware
	const Middleware = {
		v_1_2: {
			VerifyToken: require( _directory_base + '/app/v1.2/Http/Middleware/VerifyToken.js' )
		},
		v_1_1: {
			VerifyToken: require( _directory_base + '/app/v1.1/Http/Middleware/VerifyToken.js' )
		},
		v_1_0: {
			VerifyToken: require( _directory_base + '/app/v1.0/Http/Middleware/VerifyToken.js' )
		}
	}

/*
 |--------------------------------------------------------------------------
 | Routing
 |--------------------------------------------------------------------------
 */
	module.exports = ( app ) => {
		/*
		 |--------------------------------------------------------------------------
		 | Welcome Message
		 |--------------------------------------------------------------------------
		 */
			app.get( '/', ( req, res ) => {
				res.json( { 
					application: {
						name : config.app.name,
						port : config.app.port[config.app.env],
						env : config.app.env
					} 
				} )
			} );

		/*
		 |--------------------------------------------------------------------------
		 | API Versi 1.2
		 |--------------------------------------------------------------------------
		 */
			// Auth
			app.post( '/api/v1.2/auth/login', Controllers.v_1_2.Auth.login );
			app.get( '/api/v1.2/auth/contacts', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Auth.contacts );
			app.get( '/api/v1.2/auth/generate/token', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Auth.generate_token );

			// Category
			app.get( '/api/v1.2/category', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Category.find );
			app.get( '/api/v1.2/category/:start_date/:end_date', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Category.sync_mobile );

			// Content
			app.get( '/api/v1.2/content', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Content.find );
			app.get( '/api/v1.2/content/:id', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Content.find_one );
			app.get( '/api/v1.2/content/:start_date/:end_date', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Content.sync_mobile );
			app.get( '/api/v1.2/content-label', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Content.label_find );
			app.get( '/api/v1.2/content-label/:id', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Content.label_find_one );

			// Kriteria
			app.get( '/api/v1.2/kriteria', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Kriteria.find );
			app.get( '/api/v1.2/kriteria/:start_date/:end_date', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Kriteria.sync_mobile );

			// Parameter
			app.get( '/api/v1.2/parameter', Middleware.v_1_2.VerifyToken,  Controllers.v_1_2.Parameter.find );
			app.get( '/api/v1.2/parameter/track', Middleware.v_1_2.VerifyToken,  Controllers.v_1_2.Parameter.time_track_find_one );

			// Sync Mobile 
			app.post( '/api/v1.2/sync/mobile', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.create );
			app.post( '/api/v1.2/sync/mobile/reset', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.reset );
			app.get( '/api/v1.2/mobile-sync/finding-images', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.finding_images_find );
			app.get( '/api/v1.2/mobile-sync/auth/contact', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.contact_find );
			app.get( '/api/v1.2/mobile-sync/finding', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.finding_find );
			app.get( '/api/v1.2/mobile-sync/auth/kriteria', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.kriteria_find );
			app.get( '/api/v1.2/mobile-sync/auth/category', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.category_find );
			app.get( '/api/v1.2/mobile-sync/ebcc/kualitas', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.ebcc_kualitas_find );
			app.get( '/api/v1.2/mobile-sync/auth/content', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.content_find );
			app.get( '/api/v1.2/mobile-sync/auth/content-label', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.content_label_find );
			app.get( '/api/v1.2/mobile-sync/hectare-statement/afdeling', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.hs_afdeling_find );
			app.get( '/api/v1.2/mobile-sync/hectare-statement/block', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.hs_block_find );
			app.get( '/api/v1.2/mobile-sync/hectare-statement/comp', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.hs_comp_find );
			app.get( '/api/v1.2/mobile-sync/hectare-statement/est', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.hs_est_find );
			app.get( '/api/v1.2/mobile-sync/hectare-statement/land-use', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.hs_land_use_find );
			app.get( '/api/v1.2/mobile-sync/hectare-statement/region', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncMobile.hs_region_find );

			// Sync TAP
			app.post( '/api/v1.2/sync/tap/employee-hris', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncTAP.sync_employee_hris );
			app.post( '/api/v1.2/sync/tap/employee-sap', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.SyncTAP.sync_employee_sap );

			// Server
			app.get( '/api/v1.2/server/service-list', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Server.service_list );
			app.get( '/api/v1.2/server/time', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Server.time );
			app.post( '/api/v1.2/server/apk-version', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Server.apk_version );
			app.get( '/api/v1.2/server/apk-version/:id', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.Server.current_apk_version ); 
			
			// User
			app.get( '/api/v1.2/user/data', Middleware.v_1_2.VerifyToken, Controllers.v_1_2.User.user_data );

			
		/*
		 |--------------------------------------------------------------------------
		 | API Versi 1.1
		 |--------------------------------------------------------------------------
		 */
			// Auth
			app.post( '/api/v1.1/auth/login', Controllers.v_1_1.Auth.login );
			app.get( '/api/v1.1/auth/contacts', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Auth.contacts );
			app.get( '/api/v1.1/auth/generate/token', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Auth.generate_token );

			// Category
			app.get( '/api/v1.1/category', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Category.find );
			app.get( '/api/v1.1/category/:start_date/:end_date', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Category.sync_mobile );

			// Content
			app.get( '/api/v1.1/content', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Content.find );
			app.get( '/api/v1.1/content/:id', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Content.find_one );
			app.get( '/api/v1.1/content/:start_date/:end_date', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Content.sync_mobile );
			app.get( '/api/v1.1/content-label', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Content.label_find );
			app.get( '/api/v1.1/content-label/:id', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Content.label_find_one );

			// Kriteria
			app.get( '/api/v1.1/kriteria', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Kriteria.find );
			app.get( '/api/v1.1/kriteria/:start_date/:end_date', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Kriteria.sync_mobile );

			// Parameter
			app.get( '/api/v1.1/parameter', Middleware.v_1_1.VerifyToken,  Controllers.v_1_1.Parameter.find );
			app.get( '/api/v1.1/parameter/track', Middleware.v_1_1.VerifyToken,  Controllers.v_1_1.Parameter.time_track_find_one );

			// Sync Mobile 
			app.post( '/api/v1.1/sync/mobile', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.create );
			app.post( '/api/v1.1/sync/mobile/reset', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.reset );
			app.get( '/api/v1.1/mobile-sync/finding-images', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.finding_images_find );
			app.get( '/api/v1.1/mobile-sync/auth/contact', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.contact_find );
			app.get( '/api/v1.1/mobile-sync/finding', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.finding_find );
			app.get( '/api/v1.1/mobile-sync/auth/kriteria', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.kriteria_find );
			app.get( '/api/v1.1/mobile-sync/auth/category', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.category_find );
			app.get( '/api/v1.1/mobile-sync/ebcc/kualitas', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.ebcc_kualitas_find );
			app.get( '/api/v1.1/mobile-sync/auth/content', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.content_find );
			app.get( '/api/v1.1/mobile-sync/auth/content-label', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.content_label_find );
			app.get( '/api/v1.1/mobile-sync/hectare-statement/afdeling', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.hs_afdeling_find );
			app.get( '/api/v1.1/mobile-sync/hectare-statement/block', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.hs_block_find );
			app.get( '/api/v1.1/mobile-sync/hectare-statement/comp', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.hs_comp_find );
			app.get( '/api/v1.1/mobile-sync/hectare-statement/est', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.hs_est_find );
			app.get( '/api/v1.1/mobile-sync/hectare-statement/land-use', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.hs_land_use_find );
			app.get( '/api/v1.1/mobile-sync/hectare-statement/region', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncMobile.hs_region_find );

			// Sync TAP
			app.post( '/api/v1.1/sync/tap/employee-hris', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncTAP.sync_employee_hris );
			app.post( '/api/v1.1/sync/tap/employee-sap', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.SyncTAP.sync_employee_sap );
			
			// User
			app.post( '/api/v1.1/user/create', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.User.create );
			app.put( '/api/v1.1/user/update/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_1.User.update );

			// Server
			app.get( '/api/v1.1/server/service-list', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Server.service_list );
			app.get( '/api/v1.1/server/time', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Server.time );
			app.post( '/api/v1.1/server/apk-version', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Server.apk_version );
			app.get( '/api/v1.1/server/apk-version/:id', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.Server.current_apk_version ); 
			
			// User
			app.get( '/api/v1.1/user/data', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.User.user_data );

			//export kafka
			app.get( '/api/v1.1/export-kafka/export', Middleware.v_1_1.VerifyToken, Controllers.v_1_1.ExportKafka.export_kafka );

		/*
		 |--------------------------------------------------------------------------
		 | API Versi 1.0
		 |--------------------------------------------------------------------------
		 */
			// Auth
			app.post( '/api/v1.0/auth/login', Controllers.v_1_0.Auth.login );
			app.get( '/api/v1.0/auth/contacts', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Auth.contacts );
			app.get( '/api/v1.0/auth/generate/token', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Auth.generate_token );

			// Category
			app.get( '/api/v1.0/category', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Category.find );
			
			// Content
			app.get( '/api/v1.0/content', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.find );
			app.get( '/api/v1.0/content/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.find_one );
			app.get( '/api/v1.0/content-label', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.label_find );
			app.get( '/api/v1.0/content-label/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.label_find_one );

			// Kriteria
			app.get( '/api/v1.0/kriteria', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Kriteria.find );

			// Parameter
			app.get( '/api/v1.0/parameter', Middleware.v_1_0.VerifyToken,  Controllers.v_1_0.Parameter.find );
			app.get( '/api/v1.0/parameter/track', Middleware.v_1_0.VerifyToken,  Controllers.v_1_0.Parameter.time_track_find_one );

			// Sync Mobile 
			app.post( '/api/v1.0/sync/mobile', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.create );
			app.post( '/api/v1.0/sync/mobile/reset', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.reset );
			app.get( '/api/v1.0/mobile-sync/finding-images', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.finding_images_find );
			app.get( '/api/v1.0/mobile-sync/auth/contact', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.contact_find );
			app.get( '/api/v1.0/mobile-sync/finding', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.finding_find );
			app.get( '/api/v1.0/mobile-sync/auth/kriteria', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.kriteria_find );
			app.get( '/api/v1.0/mobile-sync/ebcc/kualitas', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.ebcc_kualitas_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/afdeling', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_afdeling_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/block', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_block_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/comp', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_comp_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/est', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_est_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/land-use', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_land_use_find );
			app.get( '/api/v1.0/mobile-sync/hectare-statement/region', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_region_find );

			// Sync TAP
			app.post( '/api/v1.0/sync/tap/employee-hris', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncTAP.sync_employee_hris );
			app.post( '/api/v1.0/sync/tap/employee-sap', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncTAP.sync_employee_sap );

			// Server
			app.get( '/api/v1.0/server/service-list', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Server.service_list );
			app.get( '/api/v1.0/server/time', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Server.time );
			app.post( '/api/v1.0/server/apk-version', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Server.apk_version );
			app.get( '/api/v1.0/server/apk-version/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Server.current_apk_version ); 
			
		/*
		 |--------------------------------------------------------------------------
		 | Old API
		 |--------------------------------------------------------------------------
		 */
			// Auth
			app.post( '/api/login', Controllers.v_1_0.Auth.login );
			app.get( '/api/contacts', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Auth.contacts );
			app.get( '/api/token/generate', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Auth.generate_token );

			// Category
			app.get( '/api/category', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Category.find );

			// Content
			app.get( '/api/content', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.find );
			app.get( '/api/content/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.find_one );
			app.get( '/api/content-label', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.label_find );
			app.get( '/api/content-label/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Content.label_find_one );

			// Kriteria
			app.get( '/api/kriteria', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Kriteria.find );

			// Module
			app.get( '/api/modules/by-job', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Module.find_by_job );
			app.get( '/api/modules/by-job/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Module.find_by_job );
			app.post( '/api/modules', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Module.create_or_update );
			app.get( '/api/modules', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Module.find );
			app.get( '/api/modules/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Module.find_one );

			// Sync Mobile
			app.post( '/api/mobile-sync', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.create );
			app.post( '/api/mobile-sync/reset', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.reset );
			app.get( '/api/mobile-sync/finding-images', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.finding_images_find );
			app.get( '/api/mobile-sync/auth/contact', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.contact_find );
			app.get( '/api/mobile-sync/finding', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.finding_find );
			app.get( '/api/mobile-sync/auth/kriteria', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.kriteria_find );
			app.get( '/api/mobile-sync/ebcc/kualitas', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.ebcc_kualitas_find );
			app.get( '/api/mobile-sync/hectare-statement/afdeling', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_afdeling_find );
			app.get( '/api/mobile-sync/hectare-statement/block', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_block_find );
			app.get( '/api/mobile-sync/hectare-statement/comp', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_comp_find );
			app.get( '/api/mobile-sync/hectare-statement/est', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_est_find );
			app.get( '/api/mobile-sync/hectare-statement/land-use', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_land_use_find );
			app.get( '/api/mobile-sync/hectare-statement/region', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncMobile.hs_region_find );
			
			// TAP Sync
			app.post( '/sync/employee-hris', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncTAP.sync_employee_hris );
			app.post( '/sync/employee-sap', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.SyncTAP.sync_employee_sap );

			// Parameter
			app.get( '/api/parameter', Middleware.v_1_0.VerifyToken,  Controllers.v_1_0.Parameter.find );
			app.get( '/api/parameter/track', Middleware.v_1_0.VerifyToken,  Controllers.v_1_0.Parameter.time_track_find_one );

			// Server
			app.get( '/api/server/service-list', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Server.service_list );
			app.get( '/api/server/time', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.Server.time );

			// User
			app.post( '/api/user-authorization', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.user_authorization_create_or_update );
			app.get( '/api/user-authorization', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.user_authorization_find );
			app.get( '/api/user', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.find );
			app.get( '/api/user/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.find_one );
			app.put( '/api/user/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.update );
			app.post( '/api/user', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.create );
			app.get( '/api/user-search', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.hris_sap_search ); // Delete
			app.get( '/api/user-search/hris-sap', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.hris_sap_search );
			app.get( '/api/user-search/user-auth', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.User.hris_sap_search );

			// Web Report
			app.get( '/api/web-report/inspection/content-code', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.WebReport.inspection_content_find );
			app.get( '/api/web-report/inspection/kriteria/:id', Middleware.v_1_0.VerifyToken, Controllers.v_1_0.WebReport.inspection_kriteria_find );
	}