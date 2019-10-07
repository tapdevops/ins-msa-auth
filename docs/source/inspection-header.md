# Group Inspection Header

Untuk mengirimkan hasil inspeksi header. Berikut list table yang digunakan :

No | Database Schema | Table
--:| ---- | -----------
 1 | S_INSPEKSI  | TR_BLOCK_INSPECTION_H
 2 | S_INSPEKSI  | T_LOG_BLOCK_INSPECTION_H

## Inspection Header Collections [/api/inspection-header]

### Post [POST]

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Request (application/json)
	{
		"BLOCK_INSPECTION_CODE": "TESTING",
		"WERKS": "4121",
		"AFD_CODE": "H",
		"BLOCK_CODE": "001",
		"INSPECTION_DATE": "2018-10-26 01:01:01",
		"INSPECTION_RESULT": "A",
		"STATUS_SYNC": "SYNC",
		"SYNC_TIME": "2018-10-26 01:01:01",
		"START_INSPECTION": "2018-10-26 01:01:01",
		"END_INSPECTION": "2018-10-26 01:01:01",
		"LAT_START_INSPECTION": "-1.3225216667",
		"LONG_START_INSPECTION": "116.3819266667",
		"LAT_END_INSPECTION": "-1.4225216667",
		"LONG_END_INSPECTION": "117.3819266667"
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