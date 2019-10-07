# Group Contacts

Menampilkan data-data kategori dan source image dalam bentuk **base64**. Berikut list table yang digunakan :

No | Database Schema | Table
--:| ---- | -----------
 1 | S_AUTH  | TM_CATEGORY

## Contacts Collections [/api/category]

### Get [GET]

+ Headers
	Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJVU0VSTkFNRSI6ImZlcmRpbmFuZCIsIlVTRVJfQVVUSF9DT0RFIjoiVEFDMDAwMDQiLCJVU0VSX1JPTEUiOiJBU0lTVEVOX0xBUEFOR0FOIiwiTE9DQVRJT05fQ09ERSI6IjQxMjFBLDUxMjFBLDMxMjFBIiwiUkVGRkVSRU5DRV9ST0xFIjoiQUZEX0NPREUiLCJFTVBMT1lFRV9OSUsiOiIxMjM0MzIiLCJJTUVJIjoiMzU1NDEwMDkwMDg4NTQ1IiwianRpIjoiMTk3NzgzNjgtODEzZi00OWZhLWIxMzMtYTkyOTFkYzBhMzc5IiwiaWF0IjoxNTQ1NjUyNTA3LCJleHAiOjE1NDYyNTczMDd9.YjCWBNHoaidEC_EzAvZbPoEArucChO3LTEY72fG0jdU

+ Response 200 (application/json)
	{
		"status": true,
		"message": "Success! ",
		"data": [
			{
				"USER_AUTH_CODE": "TAC00002",
				"EMPLOYEE_NIK": "00000795",
				"USER_ROLE": "ASISTEN_LAPANGAN",
				"LOCATION_CODE": "4121A",
				"REF_ROLE": "AFD_CODE",
				"JOB": "ENTERPRISE SOLUTION SECTION HEAD",
				"FULLNAME": "NICHOLAS BUDIHARDJA"
			},
			{
				"USER_AUTH_CODE": "TAC00003",
				"EMPLOYEE_NIK": "00001164",
				"USER_ROLE": "ASISTEN_KEPALA",
				"LOCATION_CODE": "4121",
				"REF_ROLE": "BA_CODE",
				"JOB": "SENIOR BUSINESS ANALYST",
				"FULLNAME": "RIZKY OCTARINA PUSPITASARI"
			},
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