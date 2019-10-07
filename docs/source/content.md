# Group Content

Untuk CRUD Content. Berikut list table yang digunakan :

No | Database Schema | Table
--:| ---- | -----------
 1 | S_AUTH  | TM_CONTENT

## Content List [/api/content]

+ Create Content
+ Get Content

### Post [POST]

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Request (application/json)
	{
		"CONTENT_CODE": "CC0002",
		"GROUP_CATEGORY": "INSPEKSI",
		"CATEGORY": "PANEN",
		"CONTENT_NAME": "Pokok Panen",
		"CONTENT_TYPE": "BUTTON & INPUT TEXT",
		"UOM": "JJG",
		"FLAG_TYPE": "INDICATOR",
		"BOBOT": 0,
		"URUTAN": "1",		
		"TBM0": "YES",
		"TBM1": "YES",
		"TBM2": "YES",
		"TBM3": "YES",
		"TM": "YES"
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

### Get [GET]

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Response 200 (application/json)
	{
		"status": true,
		"message": "Success! ",
		"data": [
			{
				"CONTENT_CODE": "CC0002",
				"GROUP_CATEGORY": "INSPEKSI",
				"CATEGORY": "PANEN",
				"CONTENT_NAME": "Pokok Panen",
				"CONTENT_TYPE": "BUTTON & INPUT TEXT",
				"UOM": "JJG",
				"FLAG_TYPE": "INDICATOR",
				"BOBOT": 0,
				"URUTAN": "1",
				"TBM0": "YES",
				"TBM1": "YES",
				"TBM2": "YES",
				"TBM3": "YES",
				"TM": "YES"
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

## Content [/api/content/{CONTENT_CODE}]

+ Parameters
	+ CONTENT_CODE: `CC0002` (required, string) - Content Code

### Get by ID [GET]

Untuk mengambil data content berdasarkan **CONTENT_CODE**.

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Response 200 (application/json)
	{
		"status": true,
		"message": "Success! ",
		"data": {
			"CONTENT_CODE": "CC0002",
			"GROUP_CATEGORY": "FINDING",
			"CATEGORY": "FINDING",
			"CONTENT_NAME": "BATAS WAKTU PENYELESAIAN :",
			"CONTENT_TYPE": "DATE PICKER",
			"UOM": "",
			"FLAG_TYPE": "",
			"BOBOT": 0,
			"URUTAN": "4",
			"TBM0": "YES",
			"TBM1": "YES",
			"TBM2": "YES",
			"TBM3": "YES",
			"TM": "YES"
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

### Delete by ID [DELETE]

Untuk menghapus data content berdasarkan **CONTENT_CODE**.

::: warning
#### <i class="fa fa-warning"></i> Info
Data hanya akan diupdate pada kolom **DELETE_USER** dan **DELETE_TIME**.
:::

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

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
		"message": "Error! Data gagal dihapus ",
		"data": {}
	}

+ Response 500 (application/json)
	{
		"status": false,
		"message": "Error! Terjadi kesalahan dalam penghapusan data ",
		"data": {}
	}

### Update by ID [PUT]

Untuk mengupdate data content berdasarkan **CONTENT_CODE**.

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Request (application/json)
	{
		"GROUP_CATEGORY": "INSPEKSI",
		"CATEGORY": "PANEN",
		"CONTENT_NAME": "Pokok Panen",
		"CONTENT_TYPE": "BUTTON & INPUT TEXT",
		"UOM": "JJG",
		"FLAG_TYPE": "INDICATOR",
		"BOBOT": 0,
		"URUTAN": "1",		
		"TBM0": "YES",
		"TBM1": "YES",
		"TBM2": "YES",
		"TBM3": "YES",
		"TM": "YES"
	}

+ Request Update CONTENT_NAME (application/json)
	+ Body
		{
			"GROUP_CATEGORY": "INSPEKSI",
			"CATEGORY": "PANEN",
			"CONTENT_NAME": "Pokok Pupuk",
			"CONTENT_TYPE": "BUTTON & INPUT TEXT",
			"UOM": "JJG",
			"FLAG_TYPE": "INDICATOR",
			"BOBOT": 0,
			"URUTAN": "1",		
			"TBM0": "YES",
			"TBM1": "YES",
			"TBM2": "YES",
			"TBM3": "YES",
			"TM": "YES"
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
		"message": "Error! Data gagal diupdate ",
		"data": {}
	}

+ Response 500 (application/json)
	{
		"status": false,
		"message": "Error! Terjadi kesalahan dalam perubahan data ",
		"data": {}
	}