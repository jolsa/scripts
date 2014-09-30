/**
 * @license strings.js 1.1.0 Copyright (c) 2011-2014, Johnny Olsa
 * Created: 8/30/2011
 * Extends the String type
 * Feel free to download and share!
 * Comments and critique to johnny@johnnyolsa.com
*/
"use strict";

//	Note: Date is not a "typeof" type in Javascript, but it gets special processing in "sorts" and "distinct"
if (typeof typeofType === "undefined")
	var typeofType = { Undefined: "undefined", Boolean: "boolean", Number: "number", String: "string", Symbol: "symbol", Function: "function", Object: "object", Date: "date" };
String.prototype.repeat = function (num)
{ return new Array(num + 1).join(this); };
//	Replace normal characters with extended:	“”‘’… – —
String.prototype.fancify = function ()
{
	var text = this;
	text = text.replace(/(\s|^)"/g, "$1“").replace(/"/g, "”");
	text = text.replace(/(\s|^)'/g, "$1‘").replace(/'/g, "’");
	text = text.replace(/\.\.\.\.*/g, "…");
	text = text.replace(/(\s)-(\s)/g, "$1–$2");
	text = text.replace(/([^-\s])--([^-\s])/g, "$1—$2");
	//	Leading space
	text = text.replace(/(\n|^)[ \t]+/g, "$1");
	return text;
}
String.prototype.in = function ()
{
	///	<signature>
	///	<summary>Returns true if the value equals any of the passed values (type and value)<br/>
	///	If a boolean (ignoreCase) is passed first, true is case insensitive, false is not.
	///	<example>
	///	<code><br/>
	///	<br/>var x = "Hello";
	///	<br/>x.in("Hello", "World", "It's me"); // returns true
	///	<br/>!x.in("Hello", "World", "It's me"); // returns false
	///	<br/>x.in(true, "hello", "world", "it's me"); // returns true
	///	<br/>x.in(false, "hello", "world", "it's me"); // returns false
	///	<br/>x.in("hello", "world", "it's me"); // returns false
	///	</code>
	///	</example>
	///	</summary>
	///	</signature>
	///	<signature>
	///	<param name="ignoreCase" type="boolean" optional="true">Ignore case - false by default</param>
	///	<param name="arguments" optional="false">List of items to be compared</param>
	///	</signature>
	///	<returns>Boolean</returns>
	var vals = Array.apply(null, arguments);
	if (!vals || vals.length === 0)
		return false;
	var caseFlag = typeof vals[0] === typeofType.Boolean;
	var ignoreCase = caseFlag ? vals[0] : false;
	if (caseFlag)
	{
		vals = vals.slice(1);
		if (!vals || vals.length === 0)
			return false;
	}
	var v = this.valueOf();
	return vals.some(function (e)
	{
		return ignoreCase ? typeof e === typeofType.String && e.toLowerCase() === v : e === v;
	});
}
