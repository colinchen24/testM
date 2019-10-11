### Running environment

- nodejs version >= 8.9.3

### Installation Steps

- Use git clone to your local.

- Use `npm install -g codeceptjs@2.0.4` Install codeceptjs.

- Use `npm install -g webdriverio@4.6.2` Install webdriverio.

- Use `npm install` Install all modules of package.json.

- Use `npm i bifrost-io --save` Install heimdal report.

- Use `export NODE_TLS_REJECT_UNAUTHORIZED=0` Fix Error: self signed certificate in certificate chain.

- Use `npm install selenium-standalone@latest -g` Install selenium server.

- Use `selenium-standalone install` Install browser driver.

- Use `selenium-standalone start` Launch selenium server.

- New a terminal, Use `export NODE_ENV=cm && codeceptjs run --steps --profile ehmp/Sanity/sanityFlowMA.js`  Specify the script you wanna run.

- New a terminal, Use `export NODE_ENV=cm && codeceptjs run-multiple --all --profile ehmp/*/*.js `  Specify the folder you wanna run in parallel.

### codeceptjs 配置介绍

##### 主要看codecept.conf.js文件

- `tests`  : 设置要跑的脚本

- `include`：添加page object    

#####  run脚本命令可添加多个配置

- `--steps`  : 可在后台打印出每一步操作。

- `--profile`: 可通过命令传env的变量。

- `--grep`   : 可通过在Scenario的描述语中添加 @xxx,run脚本的时候 可以所有包含@xxx的脚本。

- `--reporter`: 可通过安装mochawesome生成漂亮的report。

- `--config`: 可指定配置文件。


### 提交代码

- 使用 `git pull` 在修改代码前先拉取最新代码

- 使用 `git status` 在提交代码前先确认下 都修改了什么文件

- 使用 `git add .`  "." 代表提交所有改动的文件,也可以使用`git add xxx.js` 单独提交xx.js文件

- 使用 `git commit -m "xxx"` commit 自己的代码 并且在"xxx" 写一下备注 标记这改动主要是做了什么

- 使用 `git push"` 推送到远程master分支

### 处理log拿到报错脚本名字
```
grep -i -e ') at Test.Data.Scenario (' -e ') at Test.Scenario ('  build.log >result1.txt
sed 's/^.*\(test\/.*.js\).*$/\1/' result1.txt >result2.txt 
sort -u result2.txt >result.txt 
sed 's/\\\n//' -i result.txt
cat result.txt
```


