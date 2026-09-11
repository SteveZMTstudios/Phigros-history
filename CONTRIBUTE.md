## 提交贡献

我们欢迎任何形式的贡献，无论是修复错误、提交版本，还是维护页面框架。



### 故事开始之前

我们建议您在计算机上安装 Git 来提交和管理您的更改。您可以从 [Git 官方网站](https://git-scm.com/) 下载并安装 Git。

### 提交新版本

如果您嫌我们提交版本太慢，您可以按照以下步骤提交新版本：
1. **取得Github账户**：如果您还没有 Github 账户，请先注册一个。您可以在 [Github 官方网站](https://github.com/) 注册一个新账户。
2. **打开编辑器**：在新标签页打开[版本编辑器](https://stevezmt.top/Phigros-history/editor)，在顶端选择“从文件载入”
3. 在Github上下载您要提交的大版本json文件(如您要提交3.14.1，就打开/api/v1/versions/3.json)，并在编辑器中载入，此时左侧会显示这个大版本的版本列表。
4. 前往 https://www.taptap.cn/app/165287/all-info ，找到要提交内容的更新日志，复制该段的全部内容，形如：
   ```
   Version 3.13.1 (127) 2025/05/17

   1. 新增一首单曲：
   •「Alice in a xxxxxxxx」 by: Nagiha
   2. 修复已解锁的「宇宙残骸少女(Cosmic Dusty Girl)」被错误锁定的bug
   3. 修复使用重演游玩「重生」时，部分特效不显示的bug
   ```
   （包括版本号、日期和所有更新内容,这样可以自动解析。多个版本只要复制完整即可）
5. 在编辑器顶部选择“粘贴批量版本日志”，选择取消覆盖
6. 在右侧找到您刚刚载入的版本
7. 如果您有网盘链接，可以在“下载地址”处添加，将分享链接复制到剪贴板，点击“导入剪贴板项为xxx”，它会自动填入下载地址
8.  点击顶部的“保存为文件”，浏览器会通过文件流应用更改
9.  在您的 Fork 仓库中，打开对应的版本文件，选择编辑文件，将您刚刚保存的文件内容覆盖粘贴进去，点击提交更改并选择“Create a new branch for this commit and start a pull request”
10. 创建一个新的 Pull Request，描述您所做的更改。
11. 等待我们审核并合并您的贡献！

文字描述难以上手？请跟随视频教程：  
<video src="https://github.com/user-attachments/assets/9b52c592-5f83-4659-8fe1-5f2b22065aee" controls="controls" height="400" width="600"></video>

如果您是高级用户，您也可以直接在本地克隆仓库，修改版本文件后提交 Pull Request，但若您直接编辑JSON，请确保页面仍然可识别其格式。

不要气馁！我们估计维护人员的响应时间约为：60秒到数天。

### 维护页面框架
我们假定您具备基本的HTML、CSS和JavaScript知识，并且您熟悉Git的工作流程，且若您的代码由AI生成，您已经充分测试并确认能够为其负责。如果您想帮助维护页面框架或修复错误，请按照以下步骤操作：
1. **Fork 仓库**：点击[Github 仓库页面](https://github.com/stevezmtstudios/Phigros-history)右上角的 "Fork" 按钮，将本仓库复制到您的 GitHub 账户中。
2. **克隆仓库**：在您的计算机上打开终端或命令行，运行以下命令将您的 Fork 克隆到本地：
   ```bash
   git clone https://github.com/your-username/Phigros-history.git
    ```
3. 进行您想要的更改，例如修复错误或添加新功能。
4. 将更改提交到您的 Fork 仓库：
    ```bash
    git add .
    git commit -m "Fix bug / Add feature"
    git push origin main
    ```
5. 前往您的 Fork 仓库页面，点击 "Pull Request" 按钮，创建一个新的 Pull Request，描述您所做的更改。
6. 等待我们审核并合并您的贡献！

### 贡献翻译

目前新框架的翻译由 translate.js 和 Microsoft Translator 提供，如果您发现翻译错误或不准确的地方，请参照上述维护页面框架的步骤进行修改，并在 Pull Request 中注明您所修改的翻译内容。

以下是translate.js的文档：[https://translate.zvo.cn/41555.html](https://translate.zvo.cn/41555.html)

### 学习与倾听

我们鼓励您在贡献之前阅读并理解我们的代码和项目结构。
您可以通过以下方式与我们联系：

SteveZMTstudios:
- 其所有联系方式均可在其 [个人主页](https://stevezmt.top/) 找到。

Cao Huy Hoang:
- Facebook: [https://www.facebook.com/huyhoangcao39393939/](https://www.facebook.com/huyhoangcao39393939/)

