# PhiHistoryLib API 接口文档
欢迎使用 PhiHistoryLib API 接口文档。  
此文档面向v2版本的API，提供了各个端点的详细说明和使用方法。  

## 说明
v1 版本的 API 基于 json，因其难以维护且扩展性差，现已弃用并停止提供。  
v2 版本的 API 基于 yaml，您可以通过 `js-yaml` 等库轻松解析。

## 端点
- `/api/v2/status`：获取 API 状态信息。
- `/api/v2/docs`：获取 API 文档信息。
- `/api/v2/history/index`：获取历史记录数据。
- `/api/v2/history/{id}`：根据 ID 获取特定的历史记录数据。

## 示例请求
请求均通过 GET 方法发送。

### 获取 API 状态
```
GET /api/v2/status
```
响应：
```yaml
response:
  code: 200
  status: "success"
  data:
    message: "This is the v2 status endpoint and still researching."
```


### 获取历史记录索引
```
GET /api/v2/history/index
```
响应：
```yaml
response:
  code: 200
  status: "success"
  data:
    message: "This is the v2 history index endpoint."
    version-list:
      - version: "1"
        name: "v1.x"
        url: "/api/v2/history/1"
        desc: "Phigros 早期版本，以版本号1.x开头的版本"
      - version: "2"
        name: "v2.x"
        url: "/api/v2/history/2"
        desc: "Phigros 早期版本，以版本号2.x开头的版本"
      - version: "3"
        name: "v3.x"
        url: "/api/v2/history/3"
        desc: "Phigros 近期版本，以版本号3.x开头的版本"
```

### 获取特定历史记录
```
GET /api/v2/history/{id}
```
响应：
```yaml
response:
    code: 200
    status: "success"
    data:
      version-list: