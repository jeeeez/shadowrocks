#!/bin/bash

# 读取shadowsocks配置文件
shadowsocks=`cat ./shadowsocks.json`
echo 'shadowsocks 配置：' $shadowsocks

parseJson(){
	echo $1 | sed 's/.*'$2':[^,}]*.*/\1/'
}

value=$(parseJson $shadowsocks "port_password")
echo $value
