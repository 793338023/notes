https://www.cnblogs.com/joyny/p/10486739.html

https://github.com/AliyunContainerService/k8s-for-docker-desktop

https://zhuanlan.zhihu.com/p/113636565

k8s 校验运行
kubectl cluster-info

查看运行的 pods
kubectl get pods -n kube-system

查看占有端口
lsof -i : 端口号

kill 端口
kill -9 PID

docker 本地 gitlab
https://blog.csdn.net/weixin_38287709/article/details/103314136

修改 gitlab.rb
https://www.cnblogs.com/zuxing/articles/9329152.html

sudo docker run --detach \
--hostname gitlab.example.com \
 --publish 443:443 --publish 80:80 --publish 22:22 \
 --name gitlab \
 --restart always \
 --volume /tmp/gitlab/etc:/etc/gitlab \
 --volume /tmp/gitlab/log:/var/log/gitlab \
 --volume /tmp/gitlab/data:/var/opt/gitlab \
 gitlab/gitlab-ce:latest

http://gitlab.example.com/

查看容器
docker ps -a

关闭容器
docker rm id

ifconfig
inet
192.168.1.10

root
admin123456

gitlab root 密码重置
https://www.cnblogs.com/lvchaoshun/p/13285033.html

修改 host
https://www.jianshu.com/p/10a050dd1419

vite 模板
https://github.com/vitejs/awesome-vite#templates

docker stop gitlab
docker restart gitlab
docker start gitlab

gitlab-runner 容器安装

docker run -d --name gitlab-runner --restart always \
 -v /tmp/gitlab-runner/config:/etc/gitlab-runner \
 -v /var/run/docker.sock:/var/run/docker.sock \
 gitlab/gitlab-runner:latest

安装 gitlab runner

https://docs.gitlab.com/runner/install/docker.html

启动
docker run -d --name gitlab-runner --restart always \
 -v /tmp/gitlab-runner/config:/etc/gitlab-runner \
 -v /var/run/docker.sock:/var/run/docker.sock \
 gitlab/gitlab-runner:latest

注册，为了关联到 gitlab 的 docker 上

docker exec gitlab-runner gitlab-runner register -n \
 --url http://gitlab.example.com/ \
 --registration-token of9WiaAvSvMs5KfvwGP6 \
 --tag-list test-cicd \
 --executor docker \
 --docker-image docker \
 --docker-volumes /root/.m2:/root/.m2 \
 --docker-volumes /root/.npm:/root/.npm \
 --docker-volumes /var/run/docker.sock:/var/run/docker.sock \
 --description "test-cicd"

修改 url,egistration-token,tag-list
执行器 executor，这里是 docker，可以 shell 等
