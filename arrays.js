/**
 * @license arrays.js 1.0.0 Copyright (c) 2014, Johnny Olsa
 * Created: 9/27/2014
 * Provided .NET LINQ-like methods for Javascript Arrays
 * Feel free to download and share!
 * Comments and critique to johnny@johnnyolsa.com
*/
"use strict";

//	Note: Date is not a "typeof" type in Javascript, but it gets special processing in "sorts" and "distinct"
if (typeof typeofType === "undefined")
	var typeofType = { Undefined: "undefined", Boolean: "boolean", Number: "number", String: "string", Symbol: "symbol", Function: "function", Object: "object", Date: "date" };
//	Thus, the "isDate" function
Date.prototype.isDate = true;

(function (undefined)
{
	Array.prototype.isArray = true;
	Array.prototype.sortByType = function (ignoreCase, desc)
	{
		///	<summary>Returns a sorted copy of the array by type, then by value.<br />
		///	By default, Javascript sorts everything as a string, so [1, 10, 2, 20, 5].sort() remains unchanged.<br />
		///	[1, 10, 2, 20, 5].sortByType() becomes [1, 2, 5, 10, 20]
		///	</summary>
		///	<param name="ignoreCase" type="boolean" optional="true">Ignore case (strings) - false by default</param>
		///	<param name="desc" type="boolean" optional="true">Descending - false by default</param>
		///	<returns type="Array"></returns>
		if (this.length === 0) return [];
		var max = new Array(16).join(desc ? " " : "~");
		var mult = desc ? -1 : 1;
		function compare(a, b)
		{
			//	Put nulls at the end (undefined will automatically be after everything else)
			var ta = a === null ? max : (a.isDate ? typeofType.Date : typeof a);
			var tb = b === null ? max : (b.isDate ? typeofType.Date : typeof b);

			//	If types are different, return type comparison
			if (ta !== tb)
				return (ta < tb ? -1 : 1) * mult;

			//	Compare values
			var x = a;
			var y = b;
			if (ignoreCase)
			{
				if (typeof x === typeofType.String) x = x.toLocaleLowerCase();
				if (typeof y === typeofType.String) y = y.toLocaleLowerCase();
			}
			return x === y ? 0 : ((x < y ? -1 : 1) * mult);
		};
		return this.slice().sort(compare);
	};

	Array.prototype.firstOrDefault = function (filter)
	{
		///	<signature>
		///	<summary>Returns the first item (if any) that meets the filter criteria.<br />
		///	If no filter is passed, the first item is returned. If there are no items or none match the filter, null is returned.
		///	</summary>
		///	</signature>
		///	<signature>
		///	<param name="filter" optional="true">a value to match</param>
		///	</signature>
		///	<signature>
		///	<param name="filter" type="function" optional="true">A callback function to check each element.<br />
		///	If function returns "true" (boolean), that element is returned.
		///	</param>
		///	</signature>
		var i, arr = this;
		if (!filter) return arr.length ? arr[0] : null;
		if (typeof filter === typeofType.Function)
		{
			for (i = 0; i < arr.length; i++)
			{
				var item = arr[i];
				//	Only pass if the function returns a boolean
				if (filter(item) === true)
					return item;
			}
			//	No match, return null
			return null;
		}

		//	Otherwise return the first match
		for (i = 0; i < arr.length; i++)
		{
			if (arr[i] === filter)
				return filter;
		}

		//	No match, return null
		return null;
	};

	Array.prototype.lastOrDefault = function (filter)
	{
		///	<signature>
		///	<summary>Returns the last item (if any) that meets the filter criteria.<br />
		///	If no filter is passed, the last item is returned. If there are no items or none match the filter, null is returned.
		///	</summary>
		///	</signature>
		///	<signature>
		///	<param name="filter" optional="true">a value to match</param>
		///	</signature>
		///	<signature>
		///	<param name="filter" type="function" optional="true">A callback function to check each element.<br />
		///	If function returns "true" (boolean), that element is returned.
		///	</param>
		///	</signature>
		var arr = this.slice().reverse();
		return arr.firstOrDefault(filter);
	};

	function minOrMax(arr, filter, isMin)
	{
		if (arr.length === 0) return null;

		if (typeof filter === typeofType.Function)
			arr = arr.filter(filter);
		arr = arr.sortByType(false, !isMin);
		return arr.firstOrDefault(function (e) { return e !== null && e !== undefined && (typeof e !== typeofType.Object || e.isDate) });
	};

	Array.prototype.max = function (filter)
	{
		///	<signature>
		///	<summary>Returns the item (if any) with the greatest value that meets the filter criteria.<br />
		///	If no filter is passed, the item with the greatest value is returned. If there are no items or none match the filter, null is returned.
		///	<remarks>
		///	<br/><br/><b>NOTE: an array with mixed types can produce unexpected results</b>
		///	</remarks>
		///	</summary>
		///	</signature>
		///	<signature>
		///	<param name="filter" type="function" optional="true">A callback function to check each element.<br />
		///	If function returns "true" (boolean), that element is included in the comparison.
		///	</param>
		///	</signature>
		return minOrMax(this.slice(), filter, false);
	};
	Array.prototype.min = function (filter)
	{
		///	<signature>
		///	<summary>Returns the item (if any) with the smallest value that meets the filter criteria.<br />
		///	If no filter is passed, the item with the smallest value is returned. If there are no items or none match the filter, null is returned.
		///	<remarks>
		///	<br/><br/><b>NOTE: an array with mixed types can produce unexpected results</b>
		///	</remarks>
		///	</summary>
		///	</signature>
		///	<signature>
		///	<param name="filter" type="function" optional="true">A callback function to check each element.<br />
		///	If function returns "true" (boolean), that element is included in the comparison.
		///	</param>
		///	</signature>
		return minOrMax(this.slice(), filter, true);
	};

	Array.prototype.distinct = function (ignoreCase)
	{
		///	<summary>Returns a new array with a unique list of items.<br />
		///	Elements that are typeof object (except dates) are considered unique by their references, not their values.
		///	</summary>
		///	<param name="ignoreCase" type="boolean" optional="true">Ignore case (strings) - false by default</param>
		///	<returns type="Array"></returns>
		var out = [];
		if (this.length === 0) return out;
		var arr = this.slice().sortByType(ignoreCase);

		var item, c, prev = undefined;
		for (var i = 0; i < arr.length; i++)
		{
			c = item = arr[i];
			if (ignoreCase && typeof item === typeofType.String)
				c = c.toLocaleLowerCase()
			else if (item && item.isDate)
				c = c.getTime();
			if (c !== prev)
			{
				prev = c;
				out.push(item);
			}
		}
		return out;
	};

	Array.prototype.union = function (otherArray, ignoreCase)
	{
		///	<summary>Returns a new array with a unique list of items from both arrays.<br />
		///	Elements that are typeof object (except dates) are considered unique by their references, not their values.
		///	</summary>
		///	<param name="otherArray" type="Array" optional="false">Array to combine with this one</param>
		///	<param name="ignoreCase" type="boolean" optional="true">Ignore case (strings) - false by default</param>
		///	<returns type="Array"></returns>
		return otherArray && otherArray.isArray && otherArray.length
			? this.distinct(ignoreCase).concat(otherArray.distinct(ignoreCase)).distinct(ignoreCase)
			: this.distinct(ignoreCase);
	};

	Array.prototype.zip = function (otherArray, callbackResultFn)
	{
		///	<summary>Returns a new array merging this array with "otherArray" as specified by the callbackResultFn(a, b).<br />
		///	</summary>
		///	<param name="otherArray" type="Array" optional="false">Array to combine with this one</param>
		///	<param name="callbackResultFn" type="function" optional="false">The callback will pass both elements, so the function should return the desired combination<br/>
		///	(e.g. { id: a.id, name: a.name } or { id: a, value: b } )
		///	</param>
		///	<returns type="Array"></returns>
		if (!otherArray || !callbackResultFn || !otherArray.isArray || typeof callbackResultFn !== typeofType.Function)
			return null;
		var arr = this;
		var len = Math.min(arr.length, otherArray.length);
		var out = [];
		for (var i = 0; i < len; i++)
			out.push(callbackResultFn(arr[i], otherArray[i]));
		return out;
	};

	function numericOps(arr, callback, filter)
	{
		///	<summary>Provides filtering for numbers and optional filter</summary>
		///	<param name="arr" type="Array" optional="false" />
		///	<param name="callback" type="function" optional="false" />
		///	<param name="filter" type="function" optional="true" />
		var f = typeof filter === typeofType.Function ? filter : null;
		arr.forEach(function (e)
		{
			if (typeof e === typeofType.Number && (!f || f(e)))
				callback(e);
		});
	};

	Array.prototype.sum = function (filter)
	{
		///	<signature>
		///	<summary>Returns the sum of the values that meet the filter criteria.<br />
		///	If no filter is passed, the sum of all items is returned. If there are no items or none match the filter, 0 is returned.
		///	</summary>
		///	</signature>
		///	<signature>
		///	<param name="filter" type="function" optional="true">A callback function to check each element.<br />
		///	If function returns "true" (boolean), that element is included in the sum.
		///	</param>
		///	</signature>
		///	<returns type="number"></returns>
		var sum = 0;
		numericOps(this, function (e) { sum += e; }, filter);
		return sum;
	};
	Array.prototype.average = function (filter)
	{
		///	<signature>
		///	<summary>Returns the average of the values that meet the filter criteria.<br />
		///	If no filter is passed, the average of all items is returned. If there are no items or none match the filter, null is returned.
		///	</summary>
		///	</signature>
		///	<signature>
		///	<param name="filter" type="function" optional="true">A callback function to check each element.<br />
		///	If function returns "true" (boolean), that element is included in the average.
		///	</param>
		///	</signature>
		///	<returns type="number"></returns>
		var sum = 0, count = 0;
		numericOps(this, function (e) { sum += e; count++ }, filter);
		return count ? sum / count : null;
	};

	Array.prototype.takeWhile = function (filterFn)
	{
		///	<summary>Returns a new array containing the elements until filterFn(element, index) returns "false".<br/>
		///	If filterFn is not passed, null is returned.
		///	</summary>
		///	<param name="filterFn" type="function" optional="false">The callback will pass the element and index for evaluation.<br/>
		///	Return "true" to keep "taking" elements.</param>
		///	<returns type="Array"></returns>
		if (typeof filterFn !== typeofType.Function) return null;
		var arr = this;
		var out = [];
		for (var i = 0; i < arr.length; i++)
		{
			var e = arr[i];
			if (!filterFn(e, i))
				break;
			out.push(e);
		}
		return out;
	};
	Array.prototype.toDictionary = function (keySelectFn, valSelectFn)
	{
		///	<summary>Returns a Javascript "dictionary" derived from the array according to the key and value selectors provided.<br/>
		///	If keySelectFn is not passed, null is returned.<br/>
		///	If valSelectFn is not passed, the key will be the value.<br/>
		///	<br/>NOTE: Unlike C#, a duplicate will not fail. Instead the last value will be used.
		///	<br/>NOTE: Returning an object as the key may produce unexpected results.
		///	</summary>
		///	<param name="keySelectFn" type="function" optional="false">The callback will pass the element. Return the value that will be the key.<br/>
		///	If null or undefined is returned, the item will not be added.</param>
		///	<param name="valSelectFn" type="function" optional="true">The callback will pass the element. Return the value that will stored for that key.<br/>
		///	If no valSelectFn is provided, the key will also be the value.</param>
		///	<returns type="Array"></returns>
		if (typeof keySelectFn !== typeofType.Function) return null;
		var vf = typeof valSelectFn === typeofType.Function ? valSelectFn : null;
		var arr = this;
		var out = [];
		for (var i = 0; i < arr.length; i++)
		{
			var e = arr[i];
			var key = keySelectFn(e);
			if (key !== null && key !== undefined)
			{
				var val = vf ? vf(e) : key;
				out[key] = val;
			}
		}
		return out;
	};
	Array.prototype.contains = function (item)
	{
		/// <summary>Returns true if the array contains an item equal (type and value) to "item".<br/>
		/// objects (except for dates) are equal if the references match (not the values).</summary>
		return this.some(function (e) { return e === item; });
	};

})();
