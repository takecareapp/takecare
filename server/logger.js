'use strict';

const fs = require('fs');
const path = require('path');
const winston = require('winston');
var mkdirp = require('mkdirp');

winston.transports.DailyRotateFile = require('winston-daily-rotate-file');

function checkDir(dir) {
	try {
		fs.statSync(dir);
	} catch (e) {
		mkdirp.sync(dir);
	}
};


let transports = [
	new winston.transports.DailyRotateFile({
		datePattern: '.dd-MM-yyyy',
		colorize: true,
		timestamp: true,
		filename: path.join(__dirname, '.', 'logs/debug.log'),
		maxsize: 10485760,
		maxFiles: 200
	})
];

transports.push(new (winston.transports.Console)());

let logger = new winston.Logger({
	level: 'verbose',
	transports: transports
});

var consoleFunction = function (info, data) {
	if (data) {
		data = JSON.stringify(data);
	} else {
		data = "";
	}
	console.log(info + ": " + data);
};

/*exports*/
exports.trace = logger.silly;
exports.debug = logger.debug;
exports.info = logger.info;
exports.warn = logger.warn;
exports.error = logger.error;
/*end exports*/
