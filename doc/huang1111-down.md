 <script>
        // Function to get the value of the "tag" parameter from the URL
        function getTagFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('tag');
        }

        // Function to handle the "继续访问" button click
        function continueVisit() {
            const tag = getTagFromUrl();
            if (tag) {
                window.location.href = `https://pan.huang1111.cn//s/${tag}`;
            } else {
                alert("URL中缺少'tag'参数");
            }
        }
    </script>

## huang1111网盘 已经停用。
您可能无法再访问原始链接。

我们保存了我们存储在相关页面的副本，但是由于网络问题，部分文件可能尚未上传完成。

并且由于路径的碎片化和文件的数量，我们可能需要一些时间来整理这些文件。

您可以先自行寻找他们。

> 文件在每个网盘中都应该有一份可用的副本。如果一个网盘中的文件过小，请尝试在另一个网盘中查找，并[告诉我们](https://github.com/SteveZMTstudios/Phigros-history/issues/new/choose)

### 阿里云盘

[文件夹1](https://www.alipan.com/s/fV5pEuoEgKS) (3.5.0.1-3.10.1 TapTap 1.8.0-3.8.0 Play商店)
[文件夹2] (1.6.9-3.0.1 Play商店版本)
[文件夹3]()



### 中国移动云盘（原和彩云）

### 其他

<button onclick="continueVisit()">继续访问 huang1111</button>