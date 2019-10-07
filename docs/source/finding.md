# Group Finding

Untuk mengirimkan hasil finding. Berikut list table yang digunakan :

No | Database Schema | Table
--:| ---- | -----------
 1 | S_FINDING  | TR_FINDING
 2 | S_FINDING  | TR_LOG_FINDING

## Finding List [/api/finding]

+ Create Finding
+ Get Finding

### Create Finding [POST]

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Request (application/json)
	{
		"FINDING_CODE": "F0000002weR",
		"WERKS": "4121",
		"AFD_CODE": "A",
		"BLOCK_CODE": "001",
		"FINDING_CATEGORY": "BLOK",
		"FINDING_DESC": "BERANTAKAN",
		"FINDING_PRIORITY": "HIGH",
		"DUE_DATE": "2018-11-07 00:00:00",
		"ASSIGN_TO": "0000002",
		"PROGRESS": "0",
		"LAT_FINDING": "-1.3225216667",
		"LONG_FINDING": "116.3819266667",
		"REFFERENCE_INS_CODE": "null"
	}

+ Response 200 (application/json)
	{
		"status": true,
		"message": "Success! ",
		"data": {}
	}
+ Response 403 (text/plain)
	Forbidden

+ Response 404 (application/json)
	{
		"status": false,
		"message": "Error! Data gagal diproses",
		"data": {}
	}

+ Response 500 (application/json)
	{
		"status": false,
		"message": "Error! Terjadi kesalahan dalam pembuatan data",
		"data": {}
	}

### Get Finding [GET]

Menampilkan seluruh data finding berdasarkan **USER_AUTH_CODE** dan **ASSIGN_TO**.

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Response 200 (application/json)
	{
		"status": true,
		"message": "Success! ",
		"data": [
			{
				"FINDING_CODE": "F0000002weR",
				"WERKS": "4121",
				"AFD_CODE": "A",
				"BLOCK_CODE": "001",
				"FINDING_CATEGORY": "BLOK",
				"FINDING_DESC": "BERANTAKAN",
				"FINDING_PRIORITY": "HIGH",
				"DUE_DATE": 20181227014044,
				"ASSIGN_TO": "0000002",
				"PROGRESS": "0",
				"LAT_FINDING": "-1.3225216667",
				"LONG_FINDING": "116.3819266667",
				"REFFERENCE_INS_CODE": "null"
			}
		]
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

## Get By ID [/api/finding/{FINDING_CODE}]

Untuk menampilkan data detail, mengubah data, dan menghapus data.

+ Parameters
	+ FINDING_CODE: `F0000002weR` (required, string) - Finding Code

### Get by ID [GET]

Untuk mengambil data finding berdasarkan **FINDING_CODE**

::: warning
#### <i class="fa fa-warning"></i> Caution
Data tidak akan ditampilkan `FINDING_CODE` sudah dihapus.
:::

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Response 200 (application/json)
	{
		"status": true,
		"message": "Success! ",
		"data": [
			{
				"FINDING_CODE": "F0000002weR",
				"WERKS": "4121",
				"AFD_CODE": "A",
				"BLOCK_CODE": "001",
				"FINDING_CATEGORY": "BLOK",
				"FINDING_DESC": "BERANTAKAN",
				"FINDING_PRIORITY": "HIGH",
				"DUE_DATE": 20181227014044,
				"ASSIGN_TO": "0000002",
				"PROGRESS": "0",
				"LAT_FINDING": "-1.3225216667",
				"LONG_FINDING": "116.3819266667",
				"REFFERENCE_INS_CODE": "null"
			}
		]
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