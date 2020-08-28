# 以nginx为基础镜像
FROM registry.eversec.com:5000/nginx:1.13.9
# 设置时区
RUN rm -rf /etc/localtime && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# 增加文件夹到centos目录
ADD dist/ /usr/share/nginx/html
# 增加文件夹到centos目录
ADD config/nginx.conf /etc/nginx/nginx.conf
