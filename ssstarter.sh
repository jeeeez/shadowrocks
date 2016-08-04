#!/bin/bash
#processname: shadowsocks
#/usr/bin/nohup /usr/local/bin/ssserver -c /etc/shadowsocks.json > log &
case $1 in
    start)
        echo -n "Starting shadowsocks"
        nohup /usr/bin/ssserver -c /etc/shadowsocks.json > /usr/local/shadowsocks/log &
        echo " done"
    ;;
    stop)
        echo -n "Stopping shadowsocks"
        kill -9 `ps -ef|grep '/usr/bin/python /usr/bin/ssserver'|grep -v 'grep'|awk {'print $2'}`
        echo " done"
    ;;
    restart)
        echo -n "Restarting shadowsocks"
        $0 stop
        sleep 1
        $0 start
        echo " done"
    ;;
    *)
        echo -n "Usage: $0 {start|stop|restart}"
    ;;
esac
