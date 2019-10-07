# Group Content Label

Untuk CRUD Content. Berikut list table yang digunakan :

No | Database Schema | Table
--:| --------------- | ----------------
 1 | S_AUTH          | TM_CONTENT_LABEL

## Content Label List [/api/content-label]

+ Create Content Label
+ Get Content Label

### Create [POST]

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Request (application/json)
	{
		"CONTENT_LABEL_CODE": "CLC0001",
		"CONTENT_CODE": "CC0003",
		"LABEL_NAME": "BAIK",
		"LABEL_ICON": "null",
		"URUTAN_LABEL": "1",
		"LABEL_SCORE": 2,
		"WARNA_LABEL": "#ffffff"
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
				"CONTENT_LABEL_CODE": "CLC0001",
				"CONTENT_CODE": "CC0003",
				"LABEL_NAME": "BAIK",
				"LABEL_ICON": "null",
				"URUTAN_LABEL": "1",
				"LABEL_SCORE": 2
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

## Content Label [/api/content-label/{CONTENT_LABEL_CODE}]

+ Parameters
	+ CONTENT_LABEL_CODE: `CLC0001` (required, string) - Content Label Code

### Get by ID [GET]

Untuk mengambil data content berdasarkan **CONTENT_LABEL_CODE**.

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Response 200 (application/json)
	{
		"status": true,
		"message": "Success! ",
		"data": {
			"CONTENT_LABEL_CODE": "CLC0001",
			"CONTENT_CODE": "CC0003",
			"LABEL_NAME": "BAIK",
			"LABEL_ICON": "null",
			"URUTAN_LABEL": "1",
			"LABEL_SCORE": 2
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

Untuk menghapus data Content Label berdasarkan **CONTENT_LABEL_CODE**.

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

Untuk mengupdate data Content Label berdasarkan **CONTENT_LABEL_CODE**.

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Request (application/json)
	{
		"CONTENT_CODE": "CC0003",
		"LABEL_NAME": "BAIK",
		"LABEL_ICON": "null",
		"URUTAN_LABEL": "1",
		"LABEL_SCORE": 2,
		"WARNA_LABEL": "#ffffff"
	}

+ Request Update LABEL_NAME (application/json)
	+ Body
		{
			"LABEL_NAME": "SIAP",
			"LABEL_ICON": "null",
			"URUTAN_LABEL": "1",
			"LABEL_SCORE": 2,
			"WARNA_LABEL": "#ffffff"
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