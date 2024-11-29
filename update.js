import { execSync } from "child_process";
import chalk from "chalk";
// 读取当前版本（currentVersion）
// 假设 currentVersion 存储在某个文件中，如 'src/assets/version.json'
import { currentVersion } from "./src/assets/versionTips.js";

// 执行 shell 命令
function execCommand(command) {
	try {
        console.log(chalk.blue(`EXEC: ${command}`))
		const output = execSync(command, { encoding: "utf-8" });
		console.log(output);
	} catch (error) {
		console.error(chalk.red("Error executing command:"), chalk.red(error.message));
		process.exit(1);
	}
}

// 脚本主要功能
async function updateGit(commitMessage,push) {
	if (commitMessage) {
		// 1. 执行 git add 和 git commit
		try {
			execCommand("git add .");

			execCommand(`git commit -m "${commitMessage}"`);
		} catch (error) {
			console.error(
				chalk.red("Error executing git commands:"),
				chalk.red(error.message)
			);
			console.error(chalk.red("try to use NON-COMMIT mode."));
			process.exit(1);
		}
	}
	let localExist = false;
	// 2. 检查是否已有 currentVersion 标签
	try {
		console.log(
			chalk.blue(`EXEC: git rev-parse --verify ${currentVersion}`)
		);
		execSync(`git rev-parse --verify ${currentVersion}`, {
			stdio: "ignore",
		});
		console.log(`Tag ${currentVersion} already exists. Deleting it...`);
		localExist = true;
	} catch (error) {
		console.log(
			`Tag ${currentVersion} does not exist. Proceeding to create it...`
		);
		localExist = false;
	}
    if(localExist){
		execCommand(`git tag -d ${currentVersion}`); // 删除本地标签
	}
    execCommand(`git tag ${currentVersion}`);
    if(push){
        let remoteExist = false;
         try {
				// 如果本地没有，检查远程仓库的标签
				console.log(
					chalk.blue(
						`EXEC: git ls-remote --tags origin ${currentVersion}`
					)
				);
				execSync(`git ls-remote --tags origin ${currentVersion}`, {
					stdio: "ignore",
				});
				console.log(
					`Tag ${currentVersion} exists in remote repository. Deleting it...`
				);
				remoteExist = true;
			} catch (remoteError) {
				// 如果远程仓库也没有标签
				console.log(
					`Tag ${currentVersion} does not exist locally or remotely. Proceeding to create it...`
				);
				remoteExist = false;
			}
        if(remoteExist){
			execCommand(`git push --delete origin ${currentVersion}`); // 删除远程标签
			// 3. 创建新的标签并推送到远程
		}
        execCommand(`git push origin ${currentVersion}`);

		// 4. 强制推送更改到远程仓库
		execCommand("git push -f");
    }
}

// 获取命令行参数
const args = process.argv.slice(2);
let push = true;
args.forEach(arg=>{
    if (arg === "--no-push" || arg === "-np") {
        push = false;
    }
})
if (args.length - (push ? 0 : 1) === 0) {
	console.log("script update.js works as NON-COMMIT mode.");
	await updateGit(undefined,push)
    console.log(chalk.green("Update completed!"));
}
else{
	console.log("script update.js works as COMMIT mode.");
	// 执行更新操作
	await updateGit(args[0],push);
    console.log(chalk.green("Update completed!"));
}

