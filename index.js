#!/usr/bin/env node

var fs = require('fs');
var exec = require('child_process').exec;

var shadowsocksConfURL = '/etc/shadowsocks.json';
var shadowsocksConf = require(shadowsocksConfURL);

module.exports = {
	update: function(port, password) {
		var portPasswords = shadowsocksConf.port_password;
		portPasswords[port] = password;

		return reload(shadowsocksConf);
	},
	remove: function(port) {
		var portPasswords = shadowsocksConf.port_password;
		delete portPasswords[port];

		return reload(shadowsocksConf);
	}
};


function reload(shadowsocksConf) {
	fs.writeFile(shadowsocksConfURL, JSON.stringify(shadowsocksConf, null, 4), function(error) {
		if (error) {
			return Promise.reject(error);
		}

		console.log('配置写入成功！');
		console.log('正在重新载入shadowrocks配置文件...');
		exec(`./ssstarter.sh restart`, function(error, stdout, stderr) {
			if (error) {
				return Promise.reject(error);
			}

			console.log(stdout);
			console.log('重启成功!');
			return Promise.resolve();
		});
	});
}
