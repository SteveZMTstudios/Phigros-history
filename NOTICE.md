## Important Notice

This project contains two completely different types of content:

### 1. Original Works (MPL 2.0 License Applicable)

- The code, web interface design (excluding images), architecture design, management tools, and documentation in this repository.

- This original content is licensed under the **Mozilla Public License Version 2.0**.

- Please refer to the [LICENSE](./LICENSE) file for the complete license text.

### 2. Collected Third-Party Resource Links (Not MPL 2.0 Applicable)

- Some files in this repository (including but not limited to `/api/v1/versions/*`) contain links to **historical game version files** created and copyrighted by others or organizations.

- This project is merely a collector and organizer of these links and **does not claim any rights to the linked binary files**, images, or other resources.

- All rights related to these game files and resources, including copyright and trademark rights, remain with their original copyright holders.

- For specific licensing requests regarding these game files, please contact their copyright holders directly.


## 重要提示

本项目包含两种完全不同的内容：

### 1. 原创作品（适用 MPL 2.0 许可）

- 本仓库中的代码、网页界面设计（不包括图像）、架构设计、管理工具和文档。

- 此原创内容采用 **Mozilla 公共许可证 2.0 版** 授权。

- 请参阅 [LICENSE](./LICENSE) 文件以获取完整的许可文本。

### 2. 收集的第三方资源链接（不适用 MPL 2.0 许可）

- 本仓库中的某些文件（包括但不限于 `/api/v1/versions/*`）包含指向由他人或组织创建并拥有版权的**历史游戏版本文件**的链接、图像等资源。

- 本项目仅收集和整理这些链接和资源，**并不主张对链接的二进制文件拥有任何权利**。

- 与这些游戏文件相关的所有权利，包括版权和商标权，均归其原版权所有者所有。

- 如需获得这些游戏文件的具体授权许可，请直接联系其版权所有者。



### 关系树
```
Phigros-history/
│  .gitignore							--> Git 忽略文件
│  404.md								--> 404页面继承自 Steve ZMT 的个人网站模板，遵循 CC BY-NC-SA 4.0
│  icon.png								--> Phigros 图标版权归南京鸽游网络有限公司所有，遵循 Fair Use 原则使用
│  index.html							--> 主页独立设计，遵循 MPL 2.0 许可
│  LICENSE								--> MPL 2.0 许可证本体
│  NOTICE.md							--> 重要提示文件，说明本项目的许可和版权信息
│  README.md							--> 项目自述文件，遵循 MPL 2.0 许可
│  README_en-us.md						--> 英文版项目自述文件，遵循 MPL 2.0 许可
│  README_old.md						--> 同 README.md
│  README_VN.md							--> 越南语版项目自述文件，由社区贡献，遵循 MPL 2.0 许可
│  Sample.md							--> 示例文件，遵循 MPL 2.0 许可
│  _config.yml							--> Jekyll 配置文件，遵循 MPL 2.0 许可
│
├─.github								--> GitHub 相关配置文件夹，遵循 MPL 2.0 许可
│  ├─ISSUE_TEMPLATE
│  │       ...
│  │
│  └─workflows
│          ...
│	
├─api									--> API 资源文件夹，其设计和架构模型遵循 MPL 2.0 许可
|  |										注意：此文件夹内的某些文件包含指向第三方游戏版本文件的链接
|  | 										这些文件的版权归版权人所有，本项目不主张对其拥有任何权利
|  | 										对于再分发链接本身，遵循 CC BY-NC-SA 4.0 许可
│  │  glados.json
│  │
│  └─v1
│      └─versions
│              1.json					--> 历史版本链接文件，指向的可执行文件版权归版权人所有
│              2.json					--> 历史版本链接文件，指向的可执行文件版权归版权人所有
│              3.json					--> 历史版本链接文件，指向的可执行文件版权归版权人所有
│              index.json				--> 版本索引文件，遵循 CC BY-NC-SA 4.0 许可
│
├─assets								--> 页面设计和函数，遵循 MPL 2.0 许可
│  ├─css
│  │      ...
│  │
│  └─js
│         ...
│
├─doc									--> 文档文件夹，遵循 MPL 2.0 许可
│      api-rule.md
│      install-apk-obb.md
│      special.md
│      unzip-parsed-file.md
│      why-donate.md
│
├─editor								--> 版本编辑器文件夹，遵循 MPL 2.0 许可
│      ...
│
├─scripts								--> 管理脚本文件夹，遵循 MPL 2.0 许可
│      ...
│
├─ver_data								--> 版本数据文件夹，其设计和架构模型遵循 MPL 2.0 许可
|											对于此文件夹内的某些文件包含指向第三方游戏版本文件的链接
|											这些链接的版权归版权人所有，本项目不主张任何权利
│      VersionList_1.x.md
│      VersionList_2.x.md
│      VersionList_3.x.md
│
└─_includes								--> Jekyll 配置文件夹，遵循 MPL 2.0 许可·
    ...
```