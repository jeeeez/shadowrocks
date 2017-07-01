#!/usr/bin/env node

/**
 * @useage `./collect.js development` | `./collect.js production`
 * @see https://github.com/jeezlee/www.pickerlee.com/wiki/Centos-%E9%85%8D%E7%BD%AE-iptables-%E6%8F%90%E4%BE%9B-shadowsocks-%E6%9C%8D%E5%8A%A1
 */

var exec = require('child_process').exec;
var http = require('http');

var arguments = process.argv.splice(2);
const ENV = arguments[0] || 'production';

const hostMap = {
	production: 'www.fjvpn.com',
	development: 'localhost:8080'
};

return;

// api host
const HOST = hostMap[ENV] || hostMap.development;


// main function
Promise.all([collectInput(), collectOutput()])
	.then(function([inputData, outputData]) {
		const formData = {
			input: inputData,
			output: outputData
		};
		// console.log(JSON.stringify(formData, null, 4));
		return submit(JSON.stringify(formData)).then(function() {
			exec(`iptables -Z INPUT && iptables -Z OUT`);
		});
	}).catch(error => {
		errorHandle(error);
	});



function collect(rule, tag) {
	const collectCMD = `iptables -L ${rule} -v -n -x | awk -F"[:\t ]+" 'BEGIN {print "{"} /${tag}/{print "\\\""$12"\\\":"$3","} END {print "}"}'`;

	return new Promise(function(resolve, reject) {
		exec(collectCMD, function(error, stdout, stderr) {
			if (error) {
				return reject(error);
			}

			try {
				const data = JSON.parse(stdout.replace(',\n}', '\n}'));
				Object.keys(data).forEach(key => {
					if (!data[key]) {
						delete data[key];
					}
				});

				resolve(data);

			} catch (error) {
				reject(error);
			}
		});
	});
}

function collectInput() {
	return collect('INPUT', 'dpt').then(function(data) {
		// write data to log
		return data;
	});
}

function collectOutput() {
	return collect('OUTPUT', 'spt').then(function(data) {
		// write data to log
		return data;
	});
}


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
