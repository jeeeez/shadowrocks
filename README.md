# shadowrocks

> 请确保系统已安装`node`程序  
> 确保`ssstarter.sh`拥有可执行权限
```bash
chmod +x shadowrocks/ssstarter.sh
```

## Usage

### 添加指定端口/密码
```bash
./add-port-password.js PORT PASSWORD
```

### 开启/关闭/重启ss服务
```bash
./ssstarter.sh start
./ssstarter.sh stop
./ssstarter.sh restart
```

### 重新载入shadowrocks配置文件
```bash
./initialize.js '{"8000":"1234","8001":"12345"}'
```

## More
`shadowrocks`安装可移步至[CentOS6.6安装ShadowSocks服务](https://github.com/jeezlee/www.pickerlee.com/wiki/CentOS6.6%E5%AE%89%E8%A3%85ShadowSocks%E6%9C%8D%E5%8A%A1)
