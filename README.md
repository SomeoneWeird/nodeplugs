
=== NodePlugs ===

Node plugin manager.

Installation:

	npm install nodeplugs

Usage:

	var Loader = require('nodeplugs').Loader;
	var loader = Loader(options);

Options:

	"path" - [string] Path to search plugins in. (defaults to "plugins")

	"autorun"         - [bool] Enable or disable automatic function execution.
	"autorunFunction" - [string] Name of function to automatically execute. (if autorun is true)
	"autorunDelay"	  - [int] Time (in milliseconds) to delay execution (don't set or set to 0 for no delay)
	"autorunParam"	  - [object] Object to pass as param to the autorun function.

	"requiredVariables" - [Strings] List of required variables each plugin contain.
	"requiredFunctions" - [Strings] List of required functions each plugin contain.	

	"rename" - [Object] Rename KEY to VALUE when passing plugin back.

Events:

	"loading" - Fired when Load is called.
	"pluginsFound" - Fired when enumeration of plugins has finished, returns an array of filenames (of the plugins)
	"pluginLoaded" - Fired when a plugin is loaded, returns a plugin.
	"function"	   - Fired when a function is automatically run, returns the function name and the file name.

Example:

	Read example/test.js
