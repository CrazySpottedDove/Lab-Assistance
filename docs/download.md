# 安装与更新

Lab-Assistance 支持 windows-64 版本和 macOS-arm64 版本。

作者较为繁忙，暂时没有对下载方式做比较好的优化，请用户耐心 follow 教程：

## 安装

* windows-64：提供两种安装方式： [setup.exe](https://github.com/CrazySpottedDove/Lab-Assistance/releases/download/webpage-download/Lab-Assistance_setup_v1.3.7.exe "win64-安装程序") 为安装程序。[win64.zip](https://objects.githubusercontent.com/github-production-release-asset-2e65be/842860378/9f6aece6-f23d-4e05-95c6-c6c5dad7f347?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20241201%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241201T025050Z&X-Amz-Expires=300&X-Amz-Signature=de6f08bd026038ef18a726fb886c32f5bc157301070cda2de7392554683c9fa5&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3DLab-Assistance-win64.zip&response-content-type=application%2Foctet-stream "win64-便携版zip") 为便携版，解压即用。
* macOS-arm64：[macOS.zip](https://github.com/CrazySpottedDove/Lab-Assistance/releases/download/webpage-download/Lab-Assistance-macOS.zip "macOS-便携版zip") 为便携版，解压即用。如果提示 Lab-Assistance 已损坏，在终端上运行命令 xattr -cr /path/to/Lab-Assistance.app。

## 更新

理论上，安装完成就可以使用 Lab-Assistance 了。但是，无法排除现有版本存在的一些 bug。并且，由于作者繁忙，并不会持续更新这个网站上的资源。作为解决方案，作者在 Lab-Assistance 中内置了更新功能。**在确保网络能够稳定连接 GitHub的情况下**，自动更新功能将正常运作，保证用户时刻体验最新发行版本。

另外，我们也提供了手动更新方式：

* windows :
  * 在一些较老旧的版本中，提供了 updater.exe， 在原来目录下运行即可完成更新。
  * 较新版本使用下载 package.nw 包，并替换 Lab-Assistance 目录下的 package.nw 包的方式更新。
* macOS:
  * 下载 app.nw 包，并替换 /Lab-Assistance.app/Contents/Resources 目录下的 app.nw 包。

**不推荐任何用户使用老旧版本！一些老版本存在数据计算错误的原则问题，且一般而言，老版本 bug 更多！**

任何使用过程中遇见的问题与建议，欢迎在 [issues](https://github.com/CrazySpottedDove/Lab-Assistance/issues "issues") 处指出！
