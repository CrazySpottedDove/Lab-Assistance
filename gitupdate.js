import { execSync } from "child_process";

// 读取当前版本（currentVersion）
// 假设 currentVersion 存储在某个文件中，如 'src/assets/version.json'
import { currentVersion } from "./src/assets/versionTips.js";

// 执行 shell 命令
function execCommand(command) {
	try {
		const output = execSync(command, { encoding: "utf-8" });
		console.log(output);
	} catch (error) {
		console.error("Error executing command:", error.message);
		process.exit(1);
	}
}

// 脚本主要功能
function updateGit(commitMessage) {

	// 1. 执行 git add 和 git commit
	execCommand("git add .");
	execCommand(`git commit -m "${commitMessage}"`);

	// 2. 检查是否已有 currentVersion 标签
	try {
		execSync(`git rev-parse --verify ${currentVersion}`, {
			stdio: "ignore",
		});
		console.log(`Tag ${currentVersion} already exists. Deleting it...`);
		execCommand(`git tag -d ${currentVersion}`); // 删除本地标签
		execCommand(`git push --delete origin ${currentVersion}`); // 删除远程标签
	} catch (error) {
		console.log(
			`Tag ${currentVersion} does not exist. Proceeding to create it...`
		);
	}

	// 3. 创建新的标签并推送到远程
	execCommand(`git tag ${currentVersion}`);
	execCommand(`git push origin ${currentVersion}`);

	// 4. 强制推送更改到远程仓库
	execCommand("git push -f");
}

// 获取命令行参数
const args = process.argv.slice(2);
if (args.length === 0) {
	console.error("Please provide a commit message.");
	process.exit(1);
}

// 执行更新操作
updateGit(args.join(" "));
