# 版本API规范
此文档为版本API规范，定义了版本API的设计原则、命名规范、请求和响应格式等内容。

## 0. 状态测试
状态测试接口用于检查API服务的运行状态，确保服务可用。
请求示例：
```
GET /api/v1/glados
```
响应：
```json
{
  "status": "ok",
  "message": "still alive",
  "announce":[
    {
      "type":"info", // 可选值 info/warning/error/error_persist
      "content":"欢迎使用Phigros History！" // 公告内容
    },
    {
      "type":"warning",
      "content":"注意：愚人节版本仅在4月1日有效，过期后请更新至最新版本以继续使用全部功能。"
    }// ...更多公告...
  ]
}
```


## 1. 大版本目录
大版本目录用于区分不同的大版本。每个大版本目录下包含该版本的细节版本列表地址。

请求示例：
```
GET /api/v1/versions/index
```

响应：
```json
{
  "versions": [
    {
      "version": "1.x",
      "url": "/api/v1/versions/1.json" // 指向v1.x.x大版本的细节版本列表
    },
    {
      "version": "2.x",
      "url": "/api/v1/versions/2.json"
    },
    {
      "version": "3.x",
      "url": "/api/v1/versions/3.json"
    }
  ]
}
```

## 2. 细节版本列表
细节版本列表用于列出某个大版本下的所有细节版本信息,包括版本号、发布日期和更新内容和下载链接集合

请求示例：
```
GET /api/v1/versions/1
```

响应：
```json
{
  "version": "v1",
  "details": [
    {
      "versionName": "v1.0.0",
      "versionCode": 1,
      "releaseDate": "2022-01-15",
        "changelog": [
            "- Initial release",
            "Support Multi-line",
            "- Bug fixes",
            "..etc",// 多行文本
        ],
        "tag":[],// 可选字段，发布时的标签，如"april-fools","big-update"
        "downloads":{
            "taptap":{ // 渠道服版本不一致，分为taptap和playstore两个子对象
                "123":"https://www.123pan.com/s/xxxxxx", // 每个子对象有多个下载负载点
                "huang1111":"https://www.huang1111.com/xxxxxx",
                "github":"https://github.com/stevezmtstudios/Phigros-history/releases/tag/v1.0.0",
                "caiyun":"https://cloud.139.com/t/xxxxxx",
                "onedrive":"https://1drv.ms/u/xxxxxx",
                // 可扩充其他下载渠道，解析时将键值对视为渠道名称和对应链接
            },
            "playstore":{
                "123":"https://www.123pan.com/s/yyyyyy",
                "huang1111":"https://www.huang1111.com/yyyyyy",
                "github":"https://github.com/stevezmtstudios/Phigros-history/releases/tag/v1.0.0",
                "caiyun":"https://cloud.139.com/t/yyyyyy",
                "onedrive":"https://1drv.ms/u/yyyyyy",
            }// 暂时不存在其他渠道
        },
    },
    {
      "versionName": "v1.0.1",
      "versionCode": 2,
      "releaseDate": "2022-02-10",
        "changelog": [
            "- Bug fixes",
            "- Performance improvements",
            "..etc",
        ],
        "tag":["april-fools"],// 可选字段，发布时的标签，如"april-fools","big-update"
        "downloads":{
            "taptap":{
                "123pan":"https://www.123pan.com/s/aaaaaa",
                "huang1111":"https://www.huang1111.com/aaaaaa",
                "github":"https://github.com/stevezmtstudios/Phigros-history/releases/tag/v1.0.1",
                "caiyun":"https://cloud.139.com/t/aaaaaa",
                "onedrive":"https://1drv.ms/u/aaaaaa",
            },
            "playstore":{}, // 如果某个渠道没有该版本的下载链接，可以返回空对象
        },
    }
    // ...更多版本...
    ]
}
```

## 3. 错误处理
API在处理请求时可能会遇到各种错误情况。任何不为JSON格式的响应都视为错误响应。