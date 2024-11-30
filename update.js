import { execSync } from "child_process";
import chalk from "chalk";
import fs from "fs";
import readline from "readline";
// 读取当前版本（currentVersion）
// 假设 currentVersion 存储在某个文件中，如 'src/assets/version.json'
const packagePath = "./package.json";
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const versionTipsPath = "./src/assets/versionTips.js";
let currentVersion = packageJson.version;

// 获取命令行参数
const args = process.argv.slice(2);
const messageLocation = args.indexOf("-m");
let push = true;

const commitMessage = messageLocation !== -1 ? args[messageLocation + 1] : undefined
const flags = {
    '--no-push':{
        state: false,
        method: ()=>{
            push = false
        }
    },
    '-np':{
        state: false,
        method: ()=>{
            push = false
        }
    }
}

function checkFlags(){
    if(args.length === 0){
        console.log('No args passed. run:\n\tgit tag\n\tgit tag-remote\n\tgit push')
        return
    }
    console.log('Valid flags passed:')
    args.forEach((arg)=>{
        if(flags[arg]){
            flags[arg].state = !flags[arg].state
            console.log(`\t${arg}`)
        }
    })
}

async function writeNewVersion(newVersion) {
	fs.readFile(versionTipsPath, "utf8", (err, data) => {
		if (err) {
			console.error(chalk.red(`Error reading versionTips.js: ${err}`));
			return;
		}
		const lines = data.split("\n");
		lines[0] = `const currentVersion = "${newVersion}"`;
		fs.writeFile(versionTipsPath, lines.join("\n"), "utf8", (err) => {
			if (err) {
				console.error(
					chalk.red(`Error writing to versionTips.js: ${err}`)
				);
				return;
			}
			console.log(
				chalk.green(
					`New version written to versionTips.js: ${newVersion}`
				)
			);
		});
	});
	packageJson.version = newVersion;
	fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 4));
}
async function updateVersion(passedVersion, addFlag) {
	let newVersion = "";
	if (addFlag) {
		const currentVersionVector = currentVersion.replace("v", "").split(".");

		const newVersionNumber =
			Number(currentVersionVector[0]) * 100 +
			Number(currentVersionVector[1]) * 10 +
			Number(currentVersionVector[2]) +
			1;

		let newVersionVector = String(Math.trunc(newVersionNumber));
		while (newVersionVector.length < 3) {
			newVersionVector = `0${newVersionVector}`;
		}

		newVersion = `v${newVersionVector[0]}.${newVersionVector[1]}.${newVersionVector[2]}`;
	} else {
		newVersion = passedVersion;
	}
	await writeNewVersion(newVersion);
	currentVersion = newVersion;
	console.log(chalk.green(`New version: ${newVersion}`));
}
// 执行 shell 命令
function execCommand(command) {
	try {
		console.log(chalk.blue(`EXEC: ${command}`));
		const output = execSync(command, { encoding: "utf-8" });
		return output;
	} catch (error) {
		console.error(
			chalk.red("Error executing command:"),
			chalk.red(error.message)
		);
		process.exit(1);
	}
}

// 脚本主要功能
async function updateGit() {
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
	if (localExist) {
		execCommand(`git tag -d ${currentVersion}`); // 删除本地标签
	}
	execCommand(`git tag ${currentVersion}`);
	if (push) {
		// 如果本地没有，检查远程仓库的标签
		const remoteTags = execCommand(
			`git ls-remote --tags origin ${currentVersion}`
		);
		if (!remoteTags) {
			console.log(
				`Tag ${currentVersion} does not exist locally or remotely. Proceeding to create it...`
			);
		} else {
			console.log(
				`Tag ${currentVersion} exists in remote repository. ReTag it...`
			);
			execCommand(`git push --delete origin ${currentVersion}`); // 删除远程标签
			console.log("Deletion completed. Now start creation...");
		}
		execCommand(`git push origin ${currentVersion}`);

		// 4. 强制推送更改到远程仓库
		execCommand("git push -f");
	}
}


const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

async function main() {
    checkFlags()
    Object.keys(flags).forEach((key) => {
        if(flags[key].state){
            flags[key].method()
        }
    })
	rl.question(
		chalk.yellow(
			`Current version is ${currentVersion}. Continue?
        (Enter to continue, type to pass a new version tag, ++ to add version tag, exit to exit)`
		),
		async (input) => {
			input = input.toLowerCase().trim();
			if (input === "exit") {
				console.log("Exit.");
				process.exit(0);
			} else if (input.startsWith("v")) {
				await updateVersion(input);
			} else if (input === "++") {
				await updateVersion("", true);
			} else if (input === "") {
			} else {
				console.log(chalk.red("Unexcepted input. Abort update."));
				process.exit(1);
			}
			rl.close();
			console.log("Starting update...");
			await updateGit()
		}
	);
}

main();
