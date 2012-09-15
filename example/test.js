var Loader = require('../lib/index.js').Loader;

var loader = new Loader({

	/* All options are... optional */

	path: [ __dirname, 'testplugins'].join("/"),
	autorun: true,			 //
	autorunFunction: 'auto', // -
	autorunDelay: 2000,      // Auto call the function "auto" 2 seconds after the plugin is loaded and pass "test.js" to it.
	autorunParam: "test.js", // -
	requiredFunctions: [
		'auto',
		'auto2'
	],
	requiredVariables: [
		'name',
		'version'
	],
	rename: {
		'name': 'modulename' // rename 'name' to 'modulename' when passing the plugin back
	}

});

var count;

loader.on('loading', function() {
	console.log("Loading..");
});

loader.on('pluginsFound', function(files) {
	var num = files.length;
	console.log("Found " + num + " plugins");
	count = num;
});

loader.on('pluginLoaded', function(plugin) {
	console.log("Loaded " + plugin.modulename + "@v" + plugin.version);
});

loader.on('finished', function(num) {
	console.log("Successfully loaded " + num + " out of " + count + " plugins.");
});

loader.on('function', function(funct, file) {
	console.log('Ran function ' + funct + " for file " + file);
});

loader.Load();