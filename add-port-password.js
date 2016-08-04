#!/usr/bin/env node

var fs = require('fs');
var exec = require('child_process').exec;

var shadowsocksConfURL = '/etc/shadowsocks.json';

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

	console.log('配置写入成功！');
	console.log('正在重新载入shadowrocks配置文件...');
	exec(`./ssstarter.sh`, function(error, stdout, stderr) {
		if (error) {
			return console.log(error);
		}

		console.log(stdout);
		console.log('重启成功!');
	});
});
