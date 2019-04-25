# Feed to TaskPaper

一个简单的自用工具，把信息流存为 TaskPaper 格式。

目前支持的信息流有：

* Twitter
* Github Issue（内容同步自 Instapaper）
* Github Release

![](https://cdn.nlark.com/yuque/0/2019/png/86025/1556114122722-d2c95b44-6c36-4901-b99f-8ab713f44e2e.png)

## Usage

先修改 `config.sample.js` 为 `config.js`，并配置，

然后执行 `index.js`，

```bash
$ node index.js

# 把记录存成明天，比如今天的早报发完之后，剩下的需要存为明天的内容
$ TOMORROW=1 node index.js
```

新建 `data/store.json` 文件

```json
{

}
```

## LICENSE

MIT
