# xmu-chain-admin
区块链应用：食品溯源（管理端）

## Usage

* npm install
* npm run dev
* npm run build:prod

## Nginx

[Stable version](https://nginx.org/en/download.html)

### 下载

* wget https://nginx.org/download/nginx-1.20.2.tar.gz
* tar -zxvf nginx-1.20.2.tar.gz
* mv nginx-1.20.2.tar.gz nginx
* cd nginx

### 安装

* ./configure
* make
* make install

### 软链接

* ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx

### 命令

* nginx
* nginx -s stop
* nginx -s quit
* nginx -s reload

### 默认端口

* vim /etc/nginx/nginx.conf
```
listen       8889 default_server;
listen       [::]:8889 default_server;
server_name  xmu-chain-admin;
root         /usr/share/nginx/html/xmu-chain-admin;

location ^~ /prod-api/ {
    proxy_pass http://localhost:8080/;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

### 代码目录

* cd /usr/share/nginx/html
* rz xxx
