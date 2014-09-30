/**
 * @license strings.js 1.1.0 Copyright (c) 2011-2014, Johnny Olsa
 * Created: 8/30/2011
 * Extends the String type
 * Feel free to download and share!
 * Comments and critique to johnny@johnnyolsa.com
*/
"use strict";

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

