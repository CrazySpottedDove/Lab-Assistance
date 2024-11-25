var win = nw.Window.get();
document.addEventListener("DOMContentLoaded", function () {
	win.maximize();
});
win.on("close", function () {
	nw.App.quit();
});

const { exec } = require("child_process");
const path = require("path");

// 替换成你要删除的文件夹路径 (macOS 路径)
const reportsFolderPath =
	"~/Library/Application Support/lab-assistance/CrashPad/";

// 使用 macOS 的 `rm` 命令来删除文件
const deleteReportsCommand = `rm -rf "${reportsFolderPath}"/*`;

// 监听应用关闭事件
window.onbeforeunload = function () {
	// 执行删除命令
	exec(deleteReportsCommand, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error (reports): ${error}`);
			return;
		}
		console.log(`stdout (reports): ${stdout}`);
		console.error(`stderr (reports): ${stderr}`);
	});
};
