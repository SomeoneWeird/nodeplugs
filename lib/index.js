var fs = require('fs');
var events = require('events');
var assert = require('assert');
var util = require('util');


function error(msg) {
	console.error(msg);
	process.exit(1);
}

function isFunction(f) {
	var g = {};
	return f && g.toString.call(f) == '[object Function]';
}

var Loader = function(config) {

	this.config = config || { path: 'plugins' };
	this.pluginsLoaded = 0;
	this.pluginCount = 0;
	this.pluginFiles = [];
	this.plugins = [];

	fs.exists(this.config.path, function(res) {
		if(!res) {
			error("Invalid plugin path... did you remember to set it?!");
		}
	});

	this.on('pluginsFound', function(files) {
		this.pluginCount = files.length;
		this.pluginFiles = files;
	});

	this.on('pluginLoaded', function(plugin) {
		this.pluginsLoaded++;
		this.plugins.push(plugin);
		
		if(this.pluginsLoaded==this.pluginCount) {
			var self = this;
			process.nextTick(function() {
				self.emit('finished', self.pluginsLoaded);
			});
		}
	});

}

util.inherits(Loader, events.EventEmitter);

exports.Loader = Loader;

Loader.prototype.Load = function() {

	this.emit('loading');

	var self = this;

	fs.readdir(this.config.path, function(err, files) {

		if(err) {
			throw new Error(err);
		}

		self.emit('pluginsFound', files);	

		files.forEach(function(filename) {

			var filepath = [ self.config.path, filename ].join('/');

			var tmp = require(filepath);

			if(self.config.requiredFunctions&&self.config.requiredFunctions.length>0) {

				self.config.requiredFunctions.forEach(function(func) {

					if(!isFunction(tmp[func])) {

						error(filepath + " does not contain required function " + func);

					}
				});
			}

			if(self.config.requiredVariables&&self.config.requiredVariables.length>0) {

				self.config.requiredVariables.forEach(function(variable) {

					if(!tmp[variable]) {

						error(filepath + " does not contain required variable " + variable);

					}
				});
			}

			if(self.config.autorunFunction&&self.config.autorunFunction.length>0) {

				if(!isFunction(tmp[self.config.autorunFunction])) {

					error("Autorun function doesn't exist in file " + filepath + " (try requiring it?)");

				}

			}

			var plugin = tmp;

			var rename = self.config.rename;

			if(rename) {

				for(var a in rename) {

					if(plugin[a]) {

						plugin[rename[a]] = plugin[a];
						delete plugin[a];

					}
				}
			}

			self.emit('pluginLoaded', plugin)

			if(self.config.autorun) {

				setTimeout(function() {

					tmp[self.config.autorunFunction](self.config.autorunParam),
					self.emit('function', self.config.autorunFunction, filepath);

				}, (self.config.autorunDelay&&self.config.autorunDelay>0) ? self.config.autorunDelay : 0);	
			}
		});
	});
}
