# 如何解压 7z 或其他压缩类型的分卷压缩包

想要解压7z分卷压缩文件，需要用到支持7z格式的解压缩软件，比如7-Zip、或者WinRAR软件都是适用的，所以我们要先确保安装好解压缩软件。

[Windows端7zip zstd](https://github.com/mcmilk/7-Zip-zstd/releases/latest)

[Android端ZArchiver](https://play.google.com/store/apps/details?id=ru.zdevs.zarchiver)
[Android端ZArchiver Pro](https://github.com/SteveZMTstudios/sharepoint/releases/tag/zarchive)



安装好软件后，把同一个压缩包的所有7z分卷文件都放在一个文件夹里，不能有缺失；同时，分卷文件的名字不能有更改，要保持初始样式，一般是以“文件名.7z.数字”格式命名的，比如：

```
|-- 文件名.7z.001
|-- 文件名.7z.002
|-- 文件名.7z.003
|...

(具体分卷数量请检查发布页面列表)
```

7z分卷压缩文件只要解压其中一个，就可以直接解压全部分卷。但因为有些软件只能解压第一个分卷，有些可以解压任何一个分卷，所以我们最好还是直接选择编号“001”的分卷来解压。

如果双击`*.7z.001`文件无法解压，可以尝试右键点击`*.7z.001`文件，选择“7-Zip”或“WinRAR”软件的“解压到当前文件夹”选项，即可解压。

