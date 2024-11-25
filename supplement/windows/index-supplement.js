var win = nw.Window.get();
document.addEventListener("DOMContentLoaded", function () {
	win.maximize();
});
win.on("close", function () {
	nw.App.quit();
});
const { exec } = require("child_process");
const path = require("path");
// 替换成你要删除的文件夹路径
const reportsFolderPath =
	"C:\\Users\\CC\\AppData\\Local\\lab-assistance\\User Data\\Crashpad\\reports";
const pmaFolderPath =
	"C:\\Users\\CC\\AppData\\Local\\lab-assistance\\User Data";
const deleteReportsCommand = `cmd /c del /q /s "${reportsFolderPath}\\*.*"`;
// 监听应用关闭事件
const deletePmaCommand = `cmd /c del /q /s "${pmaFolderPath}"`;
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
	exec(deletePmaCommand, (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error (pma): ${error}`);
			return;
		}
		console.log(`stdout (pma): ${stdout}`);
		console.error(`stderr (pma): ${stderr}`);
	});
};
