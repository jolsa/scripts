/**
 * @license noRequire.js 1.0.0 Copyright (c) 2015, Johnny Olsa
 * Created: 11/01/2015
 * provides AMD functionality when requireJS can't be used.
 * Feel free to download and share!
 * Comments and critique to johnny@johnnyolsa.com
*/

//	
//	Notes:
//	* It's not configurable
//	* It doesn't load the JS files
//	* JS scripts must be listed in dependency order AFTER noRequire.js
//	* amdList only serves as a "lookup" (i.e. var amd = amdList["MyModule"]

"use strict";

var amdList = [];
function define(name, deps, callback)
{
	///	<summary>
	///		Replaces RequireJS's define with similar functionality.&#10;
	///		AMD module will be loaded by name into amdList reference (e.g. amdList["dates"])
	///	</summary>
	///	<param name="name" type="String">
	///		Module name (required if not using RequireJS)
	///	</param>
	///	<param name="deps" type="Array" optional="true">
	///		Array of dependent modules
	///	</param>
	///	<param name="callback" type="Function">
	///		Callback function for AMD
	///	</param>

	//	Can't allow anonymous modules
	if (typeof name !== typeof "" || !name)
	{
		throw "name required when using noRequire.";
		return;
	}

	//	Name already loaded?
	if (amdList[name])
	{
		throw name + " already loaded.";
		return;
	}

	//	Allow for no dependencies
	if (!(deps instanceof Array))
	{
		callback = deps;
		deps = null;
	}

	//	If we have depencies, make sure they're loaded
	var depM;
	if (deps && deps.length)
	{
		if (deps.some(function (e) { return !amdList[e]; }))
		{
			throw name + " dependencies must be loaded first.";
			return;
		}
		depM = deps.map(function (e) { return amdList[e]; });
	}
	amdList[name] = depM ? callback.apply(null, depM) : callback();
	//	If AMD returns nothing (i.e. "dates" IIFE) set to true
	if (!amdList[name])
		amdList[name] = true;
}
