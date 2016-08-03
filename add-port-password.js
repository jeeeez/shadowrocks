#!/usr/bin/env node

var fs = require('fs');
var exec = require('child_process').exec;

var shadowsocksConfURL = './shadowsocks.json';

var shadowsocksConf = require(shadowsocksConfURL);

var portPasswords = shadowsocksConf.port_password;

var arguments = process.argv.splice(2);

var port = arguments[0],
	password = arguments[1];


portPasswords[port] = password;

fs.writeFile(shadowsocksConfURL, JSON.stringify(shadowsocksConf, null, 4), function(error) {
	if (error) {
		return console.log(error);
	}

	console.log('写入成功！');
	exec(`echo 我要开始装逼了`, function(error, stdout, stderr) {
		if (error) {
			return console.log(error);
		}

		console.log(stdout);
		console.log('装逼成功!');
	});
});
