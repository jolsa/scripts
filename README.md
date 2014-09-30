scripts
=======

Useful Javascript functionality

These are scripts that I find useful.  All have been minified with Closure Compiler and the .map file is included.

Constructive (and non-derogatory) comments and suggestions are welcomed.

arrays.js, numbers.js, and strings.js extend the native objects.  I know several people oppose that idea, but I've found these extensions very useful and have yet to come across a reason why they're bad, when used carefully.

stepTimer.js is a class for recording and displaying elapsed time for code run in Javascript which has been useful to me when optimizing my Javascript.  It conforms to AMD (as far as I know) and can be loaded with require.js or other AMD standards. (I've only tested it with require.js.)

numbers.js:
===========

####.in():
Returns true if the number matches one of the values (and type) passed:

	var x = 5;
	x.in(1, 3, 5) // returns true
	!x.in(1, 3, 5) // returns false
	x.in("1", "3", "5") // returns false because of types

strings.js:
===========

####.in():
Returns true if the string matches one of the values passed. If first argument is a boolean, true will be case insensitive, false will not. Case-insensitive is the default.

	var s = "a";
	s.in("z", "xyz", "a") // returns true
	s.in("z", "xyz", "A") // returns false
	s.in(true, "z", "xyz", "A") // returns true

####.repeat():
Repeats the string "n" times.

	var tds = "<td/>".repeat(3); // "<td/><td/><td/>"

####.fancify():
Replaces certain ASCII characters with extended characters.
	Double quotes are replace with the appropriate “”, single quotes or apostrophes with ‘’, " - " with " – ", "--" with "—", and "..." is replaced with "…".  Currently, it removes leading whitespace. I may add an option to NOT do that, but haven't yet.

arrays.js
===========
Extends arrays for .NET LINQ-like operations. Also adds an .isDate property to the date type.

####.sortByType():
Sorts the array by type.  The default .sort() method sorts as strings. If multiple types are present, they're sorted by type name first, then value. There is also an optional ignoreCase parameter for strings and a desc parameter for descending sorting.

####.firstOrDefault():
Returns the first item that matches the criteria (either a filter callback function or a value). If no match is found (or the array is empty), null is returned. No arguments returns the first item (or null if empty).

####.lastOrDefault():
Same as .firstOrDefault, but last instead of first.

####.max():
Returns the maximum value in the array with an optional filter callback function.

####.min():
Returns the minimum value in the array with an optional filter callback function.

####.distinct():
Returns a distinct (and sorted) array of values.

####.union():
Concatenates arrays and returns a distinct (and sorted) array of values.

####.zip():
Combines 2 arrays and returns the combined values as specified in the callback function. The order is by index and if the arrays have different lengths, the combined length will be the shorter of the two. 

####.sum():
Returns the sum of the values (numbers only) in the array with an optional filter callback function.

####.average():
Returns the average of the values (numbers only) in the array with an optional filter callback function.

####.takeWhile():
Returns the items in the array (starting with the first) until the callback function returns false.

####.toDictionary():
Converts the array to a Javascript "dictionary" as specified by the callback functions for keys and values. If the value callback is not used, the value will be the key.

####.contains():
Returns true if the array contains the passed value.  I may add an optional ignoreCase parameter for strings, but haven't yet.
