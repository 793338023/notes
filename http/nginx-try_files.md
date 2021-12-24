try_files 指令

语法：try_files file ... uri 或 try_files file ... = code
默认值：无
作用域：server location

try_files 的作用是按顺序检查文件是否存在，返回第一个找到的文件或文件夹（结尾加斜线表示为文件夹），如果所有的文件或文件夹都找不到，会进行一个内部重定向到最后一个参数。

需要注意的是，只有最后一个参数可以引起一个内部重定向，之前的参数只设置内部 URI 的指向

$uri
请求的资源名，和资源定位符$request_uri 的区别是，资源定位符只是一个 symbol，可能会被映射重写，$uri 则是 nginx 对 $request_uri 解析后所的出的资源名。

$query_string / $args & $is_args
url 的 queryString 参数，$query_string 与 $args 与其完全一致，$is_args 是友好的表示是否携带了 queryString，携带为'?' 未携带 ''。

http://nginx.org/en/docs/http/ngx_http_core_module.html#try_files

https://www.codenong.com/cs105358934/

https://segmentfault.com/a/1190000022499679
