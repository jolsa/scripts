/**
 * @license parsers.js 1.0.0 Copyright (c) 2015, Johnny Olsa
 * Created: 10/19/2015
 * Various parsers (date, time, numerics) and filledArray.
 * Feel free to download and share!
 * Comments and critique to johnny@johnnyolsa.com
*/
define("parsers", ["dates"], function ()
{
	"use strict";

	function filledArray(elements, value)
	{
		///	<summary>
		///		Creates an array with a length of "elements", each filled with "value"&#10;
		///		(e.g. filledArray(3, "x") returns ["x", "x", "x"]
		///	</summary>
		///	<param name="elements" type="Number" integer="true">
		///		Number of elements to create
		///	</param>
		///	<param name="value" optional="true">
		///		The value to put in each element (default is undefined)
		///	</param>
		///	<returns type="Array"></returns>
		return Array.apply(null, Array(elements)).map(function () { return value; });
	}
	function numParser(string)
	{
		///	<summary>
		///		Parses the string and returns an array of numbers&#10;
		///		(e.g. numParser("10-12,14 18") returns [10, 12, 14, 18]
		///	</summary>
		///	<param name="string" type="String">
		///		String with numerics (i.e. "10, 20, 30")
		///	</param>
		///	<returns type="Array"></returns>
		if (!string || typeof string !== typeof "") return [];
		var m = string.match(/\d+/g);
		if (!m || m.length === 0) return [];
		return m.map(function (e) { return +e; });
	}
	function dateParser(string)
	{
		///	<summary>
		///		Parses the string and returns a Date&#10;
		///		A single digit will assume a day entry for current month, so if today is 12/3/1985 "12" will return a date of "12/12/1985".&#10;
		///		Two digits assume month/day of current year, so 8.5 will return 8/5/1985.&#10;
		///		Two-digit years will assume current century unless greater than 20 years from current date (then previous century is assumed).&#10;
		///		Any non-numeric character is assumed to be a delimiter.
		///	</summary>
		///	<param name="string" type="String">
		///		String with delimited values (i.e. "10/1", "8.5", "6-15-84")
		///	</param>
		///	<returns type="Date"></returns>
		if (!string) return NaN;
		var nums = numParser(string);
		var now = new Date();
		var y = now.getFullYear();
		var m = now.getMonth();
		var d = now.getDate();
		var n = nums.length;
		var year = y;
		var c = Math.floor(y / 100) * 100;

		if (n === 1)
			d = nums[0]
		else if (n > 1)
		{
			m = nums[0] - 1;
			d = nums[1];
			if (n > 2) y = nums[2];
		}
		//	validate inputs (if someone enters 4/31 it will return 5/1... I chose not to validate that)
		if (m > 12 || d > 31)
			return NaN;

		if (y < 100)
		{
			y += c;
			//	If a 2 digit year is more than 20 years ahead, assume last century was intended
			if (y > year + 20) y -= 100;
		}

		return new Date(y, m, d);
	}
	function numDigits(num)
	{
		///	<summary>
		///		Returns the number of digits in an integer.
		///	</summary>
		///	<param name="num" type="Number">
		///		Number to check
		///	</param>
		///	<returns type="Number"></returns>
		return Math.max(Math.floor(Math.log10(Math.abs(num))), 0) + 1;
	}
	function timeParser(string)
	{
		///	<summary>
		///		Parses the string and returns a Date object with 1/1/1900 plus the time.&#10;
		///		A single digit will assume hour (0-24), so "13" will return a date of "1/1/1900 13:00".&#10;
		///		Two digits assume hour and minute, etc.&#10;
		///		Any non-numeric character is assumed to be a delimiter and will be excluded (except am/pm which will be considered for time parsing).
		///	</summary>
		///	<param name="string" type="String">
		///		String with delimited values (i.e. "10:30", "8.5", "14 32 14.587")
		///	</param>
		///	<returns type="Date"></returns>
		if (!string) return NaN;
		var nums = numParser(string);
		var pm = /pm/i.test(string);
		var a = nums.concat(filledArray(4, 0).slice(nums.length));
		if (pm)
			a[0] += 12;

		//	Make sure milliseconds is 3 digits or less
		if (numDigits(a[3]) > 3)
			a[3] *= Math.pow(10, 3 - numDigits(a[3]));
		//	validate inputs
		if (a[0] > 23 || a[1] > 59 || a[2] > 59 || a[3] > 999)
			return NaN;

		var i = 0;
		a[1] += new Date(0).getTimezoneOffset();
		var ms = a[i++] * 60 * 60 * 1000 + a[i++] * 60 * 1000 + a[i++] * 1000 + a[i++];

		return new Date(ms);
	}

	var lib 
	return lib = 
	{
		filledArray: filledArray,
		numDigits: numDigits,
		numParser: numParser,
		dateParser: dateParser,
		timeParser: timeParser
	};
});