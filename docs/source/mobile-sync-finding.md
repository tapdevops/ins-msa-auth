# Group Mobile Sync Finding

Untuk menampilkan data finding yang perlu di sync berdasarkan field **ASSIGN_TO**. Berikut list table yang digunakan :

No | Database Schema | Table
--:| ---- | -----------
 1 | S_FINDING  | TR_FINDING
 2 | S_FINDING  | TR_LOG_FINDING

## Mobile Sync Finding List [/api/mobile-sync/finding/]

### Get Mobile Sync Finding [GET]

::: note
#### <i class="fa fa-info"></i> Info
Hanya menampilkan `ASSIGN_TO` yang sesuai dengan  `USER_AUTH_CODE` (Didapat dari token).
:::

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Response 200 (application/json)
	{
		"status": true,
		"message": "Data Sync tanggal 2018-12-04 00:00:05 s/d 2018-12-31 00:00:05",
		"data": {
			"hapus": [
				{
					"FINDING_CODE": "F0000006weR",
					"WERKS": "4121",
					"AFD_CODE": "A",
					"BLOCK_CODE": "006",
					"FINDING_CATEGORY": "BLOK",
					"FINDING_DESC": "BERANTAKAN",
					"FINDING_PRIORITY": "HIGH",
					"DUE_DATE": "2018-12-10 00:00:00",
					"ASSIGN_TO": "B1122368",
					"PROGRESS": "0",
					"LAT_FINDING": "-1.3225216667",
					"LONG_FINDING": "116.3819266667",
					"REFFERENCE_INS_CODE": "null"
				},
				{
					"FINDING_CODE": "F0000007weR",
					"WERKS": "4121",
					"AFD_CODE": "A",
					"BLOCK_CODE": "006",
					"FINDING_CATEGORY": "BLOK",
					"FINDING_DESC": "BERANTAKAN",
					"FINDING_PRIORITY": "HIGH",
					"DUE_DATE": "2018-12-10 00:00:00",
					"ASSIGN_TO": "B1122368",
					"PROGRESS": "0",
					"LAT_FINDING": "-1.3225216667",
					"LONG_FINDING": "116.3819266667",
					"REFFERENCE_INS_CODE": "null"
				}
			],
			"simpan": [
				{
					"FINDING_CODE": "F0000006weR",
					"WERKS": "4121",
					"AFD_CODE": "A",
					"BLOCK_CODE": "006",
					"FINDING_CATEGORY": "BLOK",
					"FINDING_DESC": "BERANTAKAN",
					"FINDING_PRIORITY": "HIGH",
					"DUE_DATE": "2018-12-10 00:00:00",
					"ASSIGN_TO": "B1122368",
					"PROGRESS": "0",
					"LAT_FINDING": "-1.3225216667",
					"LONG_FINDING": "116.3819266667",
					"REFFERENCE_INS_CODE": "null"
				},
				{
					"FINDING_CODE": "F0000007weR",
					"WERKS": "4121",
					"AFD_CODE": "A",
					"BLOCK_CODE": "006",
					"FINDING_CATEGORY": "BLOK",
					"FINDING_DESC": "BERANTAKAN",
					"FINDING_PRIORITY": "HIGH",
					"DUE_DATE": "2018-12-10 00:00:00",
					"ASSIGN_TO": "B1122368",
					"PROGRESS": "0",
					"LAT_FINDING": "-1.3225216667",
					"LONG_FINDING": "116.3819266667",
					"REFFERENCE_INS_CODE": "null"
				}
			],
			"ubah": [
				{
					"FINDING_CODE": "F0000006weR",
					"WERKS": "4121",
					"AFD_CODE": "A",
					"BLOCK_CODE": "006",
					"FINDING_CATEGORY": "BLOK",
					"FINDING_DESC": "BERANTAKAN",
					"FINDING_PRIORITY": "HIGH",
					"DUE_DATE": "2018-12-10 00:00:00",
					"ASSIGN_TO": "B1122368",
					"PROGRESS": "0",
					"LAT_FINDING": "-1.3225216667",
					"LONG_FINDING": "116.3819266667",
					"REFFERENCE_INS_CODE": "null"
				},
				{
					"FINDING_CODE": "F0000007weR",
					"WERKS": "4121",
					"AFD_CODE": "A",
					"BLOCK_CODE": "006",
					"FINDING_CATEGORY": "BLOK",
					"FINDING_DESC": "BERANTAKAN",
					"FINDING_PRIORITY": "HIGH",
					"DUE_DATE": "2018-12-10 00:00:00",
					"ASSIGN_TO": "B1122368",
					"PROGRESS": "0",
					"LAT_FINDING": "-1.3225216667",
					"LONG_FINDING": "116.3819266667",
					"REFFERENCE_INS_CODE": "null"
				}
			]
		}
	}

+ Response 403 (text/plain)
	Forbidden

+ Response 404 (application/json)
	{
		"status": false,
		"message": "Error! Tidak ada data yang ditemukan ",
		"data": {}
	}

+ Response 500 (application/json)
	{
		"status": false,
		"message": "Error! Terjadi kesalahan dalam penampilan data ",
		"data": {}
	}