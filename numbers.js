/**
 * @license stepTimer.js 1.0.0 Copyright (c) 2014, Johnny Olsa
 * Created: 9/27/2014
 * Extends the Number type
 * Feel free to download and share!
 * Comments and critique to johnny@johnnyolsa.com
*/
//	This provides a .in() method for numbers (e.g. x.in(5, 10, 15, 20))
//	This is NOT a module (AMD), but loads via Require.js so dependencies can
"use strict";

Number.prototype.in = function ()
{
	///	<summary>Returns true if the value equals any of the passed values (type and value)
	///	<example>
	///	<code><br/>
	///	<br/>var x = 5;
	///	<br/>x.in(5, 10, 15, 20); // returns true
	///	<br/>x.in("5", "10", "15"); // returns false
	///	<br/>!x.in(5, 10, 15); // returns false
	///	</code>
	///	</example>
	///	</summary>
	///	<returns>Boolean</returns>
	var nums = Array.apply(null, arguments);
	if (!nums || nums.length === 0)
		return false;
	var v = this.valueOf();
	return nums.some(function (e) { return e === v; });
}
