/**
 * @license stepTimer.js 1.0.0 Copyright (c) 2014, Johnny Olsa
 * Created: 9/27/2014
 * A Javascript "class" for recording durations
 * Feel free to download and share!
 * Comments and critique to johnny@johnnyolsa.com
*/
"use strict";

define("stepTimer", ["arrays"], function ()
{

	return function ()
	{
		///	<summary>Step Timer Class</summary>

		//	"Member" instance variables
		var start = new Date().getTime();
		var totalStart = start;
		var format = "mm:ss.fff";
		var steps = [];

		function formatTime(time)
		{
			///	<summary>Returns the passed time (i.e. Data.getTime()) as a formatted string
			///	according to the format string [get/set]_format()</summary>
			///	<returns>String</returns>
			var d = new Date(time);
			var fmt = format;	//	Use a copy of the format string
			var hasMs = fmt.indexOf("f") >= 0;

			if (hasMs)
			{
				//	Handle over-ambitious "fff" since Javascript only goes to milliseconds
				var fx = /f{4,}/g;
				var fs = fmt.match(fx);
				if (fs && fs.length)
					fmt = fmt.replace(fx, "fff");
				//	Do millisecond replacements
				var ms = d.getMilliseconds();
				var s = ms.toString();
				if (s.length < 3)
					s = new Array(4 - s.length).join("0") + s;
				//	Sort the distinct matches by length (descending) and do the replacements
				fmt.match(/f+/g).distinct().sort(function (a, b) { return b.length - a.length; }).forEach(function (e)
				{
					fmt = fmt.replace(new RegExp(e, "g"), s.substr(0, e.length));
				});
			}

			function updateFormat(exp, val)
			{
				var rm = fmt.match(exp);
				if (rm && rm.length)
				{
					var s = val.toString();
					var l = rm[0].length - s.length;
					if (l > 0)
						s = new Array(l + 1).join("0") + s;
					else if (l < 0)
						s = s.substr(0, s.length - l);
					fmt = fmt.replace(exp, s);
				}
			}

			updateFormat(/m+/g, d.getMinutes());
			updateFormat(/s+/g, d.getSeconds());
			return fmt;
		}

		//	This isn't REQUIRED, you could create the methods on "this", but an instance here is easier to test
		var base =
		{
			addStep: function (message)
			{
				///	<summary>Adds a step to the list of timers with the passed message</summary>
				var time = new Date().getTime() - start;
				start = new Date().getTime();
				steps.push({ message: message, time: time });
			},
			toString: function (useSum)
			{
				///	<signature>
				///	<summary>Returns the messages and times formatted for display.
				///	</summary>
				///	</signature>
				///	<signature>
				///	<param name="useSum" type="boolean" optional="true">If true, "Total Time" will be the sum of the steps.<br/>
				///	If false, it will be since the instance was created (or .reset() was called.
				///	</param>
				///	</signature>
				///	<returns>String</returns>
				var timer = this;
				return steps.map(function (e)
				{
					return e.message + ":\t" + formatTime(e.time);
				})
				.concat(["Total time:\t" + formatTime(timer.getTotalTime(useSum))])
				.join("\r\n");
			},
			get_format: function ()
			{
				///	<summary>Returns the format string used to format times (default: "mm:ss:fff")</summary>
				///	<returns>String</returns>
				return format;
			},
			set_format: function (value)
			{
				///	<summary>Set the format string to the passed value (default: "mm:ss:fff")</summary>
				format = value;
			},
			reset: function ()
			{
				///	<summary>Clear messages and reset the timer.</summary>
				steps = [];
				start = totalStart = new Date().getTime();
			},
			get_steps: function ()
			{
				///	<summary>Returns a copy of the stored steps.</summary>
				///	<returns>Array</returns>
				return steps.slice();
			},
			getTotalTime: function (useSum)
			{
				///	<signature>
				///	<summary>Returns the total time (in milliseconds)<br/>
				///	By default, it will return the time since the instance was created (or .reset() was called).<br/>
				///	If "useSum" is true, it will return the sum of the steps.
				///	</summary>
				///	</signature>
				///	<signature>
				///	<param name="useSum" type="boolean" optional="true">If true, steps will be summed.<br/>
				///	If false, total time since instance was created (or .reset() was called) is returned.
				///	</param>
				///	</signature>
				///	<returns>Number</returns>
				return useSum
					? steps.map(function (e) { return e.time; }).sum()
					: new Date().getTime() - totalStart;
			}
		};

		this.addStep = base.addStep;
		this.toString = base.toString;
		this.get_format = base.get_format;
		this.set_format = base.set_format;
		this.reset = base.reset;
		this.get_steps = base.get_steps;
		this.getTotalTime = base.getTotalTime;
		this.formatTime = formatTime;
	};

});