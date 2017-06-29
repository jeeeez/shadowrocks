#!/usr/bin/env node

/**
 * 收集端口流量进出数据
 */

var exec = require('child_process').exec;
var http = require('http');

// 接口域名
const HOST = 'www.fjvpn.com';

collectInput();
collectOutput();

// 收集INPUT规则流量数据
function collectInput() {
	exec(`iptables -L INPUT -v -n -x | awk -F"[:\t ]+" 'BEGIN {print "{"} /dpt/{print "\\\""$12"\\\":"$3","} END {print "}"}'`, function(error, stdout, stderr) {
		if (error) {
			return errorHandle(error);
		}

		try {
			const data = JSON.parse(stdout.replace(',\n}', '\n}'));
			Object.keys(data).forEach(key => {
				if (!data[key]) {
					delete data[key];
				}
			});

			submit(JSON.stringify(data)).then(function() {
				exec(`iptables -Z INPUT`, function(error) {
					if (error) {
						return errorHandle(error);
					}
				});
			}).catch(error => {
				errorHandle(error);
			});

		} catch (error) {
			errorHandle(error);
		}
	});
}

// 收集OUTPUT规则流量数据
function collectOutput() {
	exec(`iptables -L OUTPUT -v -n -x | awk -F"[:\t ]+" 'BEGIN {print "{"} /spt/{print "\\\""$12"\\\":"$3","} END {print "}"}'`, function(error, stdout, stderr) {
		if (error) {
			return errorHandle(error);
		}

		try {
			const data = JSON.parse(stdout.replace(',\n}', '\n}'));
			Object.keys(data).forEach(key => {
				if (!data[key]) {
					delete data[key];
				}
			});

			submit(JSON.stringify(data)).then(function() {
				exec(`iptables -Z OUTPUT`, function(error) {
					if (error) {
						return errorHandle(error);
					}
				});
			}).catch(error => {
				errorHandle(error);
			});

		} catch (error) {
			errorHandle(error);
		}
	});
}

/**
 * 错误处理
 * 1、写入日志文件
 */
function errorHandle(error) {
	console.log(error);
}

// 请求记录接口
function submit(data) {
	return new Promise(function(resolve, reject) {
		const request = http.request({
			host: HOST,
			port: 80,
			path: '/api/collect/bandwidth',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'AUTH': 'INTER'
			}
		}, function(response) {
			var responseText = [];
			var size = 0;
			response.on('data', function(data) {
				responseText.push(data);
				size += data.length;
			});
			response.on('end', function() {
				// Buffer 是node.js 自带的库，直接使用
				responseText = Buffer.concat(responseText, size);
				resolve(responseText);
			});

			response.on('error', function(error) {
				reject(error);
			});
		});

		request.write(data);
		request.end();
	});
}
