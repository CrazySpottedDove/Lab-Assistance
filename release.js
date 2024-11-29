// 本文件是构建脚本，用于生成 package.nw.zip 和 app.nw.zip
import fs from "fs-extra";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { currentVersion } from "./src/assets/versionTips.js";
import chalk from "chalk";
import { ChatLineRound } from "@element-plus/icons-vue";
// 获取当前文件目录的绝对路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "dist");
const packageNwDir = path.resolve(__dirname, "nw-folders/unzipped/package.nw");
const appNwDir = path.join(__dirname, "nw-folders/unzipped/app.nw");
const outputDir = path.join(__dirname, "nw-folders/zipped");

// 获取上一个tag
function getPreviousTag(version) {
	try {
		console.log(chalk.blue(`EXEC: git tag --sort=-creatordate`));
		const result = execSync(`git tag --sort=-creatordate`, {
			encoding: "utf-8",
		}).split("\n");
		let prevTag = "";
		for (let i = 0; i < result.length; i++) {
			if (result[i] === version) {
				prevTag = result[i + 1] || "";
				break;
			}
		}
		return prevTag;
	} catch (error) {
		console.error(
			chalk.red("Error getting previous tag:"),
			chalk.red(error)
		);
		return "";
	}
}

// 获取标签之间的提交信息
function getCommitNotes(fromTag, toTag) {
	try {
		// 获取标签之间的提交信息
		console.log(chalk.blue(`EXEC: git log ${fromTag}..${toTag} --oneline`));
		const commits = execSync(`git log ${fromTag}..${toTag} --oneline`, {
			encoding: "utf-8",
		});

		// 使用正则表达式删除哈希值（如63926d4），并保持换行
		const commitNotes =
			"**--- " +
			commits
				.replace(/^[a-f0-9]{7}\s+/gm, "") // 删除每行开头的哈希值
				.trim() // 去掉首尾空格（不去掉中间换行符）
				.replace(/\n/g, "<br/>--- ") +
			"**";

		return commitNotes; // 返回格式化后的提交日志
	} catch (error) {
		console.error(
			chalk.red("Error getting commit notes:"),
			chalk.red(error)
		);
		return "";
	}
}

// 先确保 outputDir 目录存在，如果不存在则创建它
async function ensureOutputDir() {
	try {
		await fs.ensureDir(outputDir);
		console.log(`Output directory is ready: ${outputDir}`);
	} catch (error) {
		console.error(
			chalk.red(`Failed to create output directory: ${outputDir}`),
			chalk.red(error)
		);
	}
}
// 复制文件
async function copyFiles(srcDir, destDir) {
	try {
		await fs.ensureDir(destDir);
		await fs.copy(srcDir, destDir, { overwrite: false });
		console.log(`Files copied from ${srcDir} to ${destDir}`);
	} catch (error) {
		console.error(
			chalk.red(`Failed to copy files from ${srcDir} to ${destDir}:`),
			chalk.red(error)
		);
	}
}

// 压缩文件夹
async function zipFolder(folderPath, zipPath) {
	try {
		const output = fs.createWriteStream(zipPath);
		const archive = archiver("zip", { zlib: { level: 9 } });

		output.on("close", () => {
			console.log(
				`${zipPath} has been created (${archive.pointer()} bytes)`
			);
		});

		archive.on("error", (err) => {
			throw err;
		});

		archive.pipe(output);
		archive.directory(folderPath, path.basename(folderPath));
		await archive.finalize();
	} catch (error) {
		console.error(chalk.red(`Failed to create zip for ${folderPath}:`), chalk.red(error));
	}
}

// 检查 GitHub Release 是否存在
function checkReleaseExists(version) {
	try {
        console.log(chalk.blue(`EXEC: gh release list --limit 1000 --json tagName`))
		const result = execSync(`gh release list --limit 1000 --json tagName`, {
			encoding: "utf-8",
		});
		return result.includes(version); // 如果版本号在列表中，表示已经存在该 Release
	} catch (error) {
		console.error(chalk.red("Failed to check for existing release:"), chalk.red(error));
		return false;
	}
}

// 发布或更新 GitHub Release
async function publishRelease() {
	// 检查是否已存在该版本的 Release
	const releaseExists = checkReleaseExists(currentVersion);

	// 获取上一个标签
	const previousTag = getPreviousTag(currentVersion);
	console.log(`find previousTag ${previousTag}`);
	// 获取上一个标签到当前标签的提交信息
	let commitNotes = "";
	if (previousTag) {
		commitNotes = getCommitNotes(previousTag, currentVersion);
	}
	if (releaseExists) {
		console.log(
			`Release ${currentVersion} already exists. Editing the release...`
		);

		// 更新已存在的 Release（上传新的文件和修改标题）
        console.log(chalk.blue(`EXEC: gh release edit ${currentVersion} --title "${currentVersion}" --notes "${commitNotes}"`))
		execSync(
			`gh release edit ${currentVersion} --title "${currentVersion} " --notes "${commitNotes}" --latest`
		);

		console.log(`Release ${currentVersion} has been updated.`);

		// 上传新的资产（如果需要）
        console.log(chalk.blue(`EXEC: gh release upload ${currentVersion} ${outputDir}/package.nw.zip ${outputDir}/app.nw.zip --clobber`))
		execSync(
			`gh release upload ${currentVersion} ${outputDir}/package.nw.zip ${outputDir}/app.nw.zip --clobber`
		);
		console.log(`Assets uploaded to Release ${currentVersion}.`);
	} else {
		console.log(
			`Release ${currentVersion} does not exist. Creating a new release...`
		);
		// 创建新的 Release 并上传文件
        console.log(chalk.blue(`EXEC: gh release create ${currentVersion} ${outputDir}/package.nw.zip ${outputDir}/app.nw.zip --title "${currentVersion}" --latest --notes "${commitNotes}"`))
		execSync(
			`gh release create ${currentVersion} ${outputDir}/package.nw.zip ${outputDir}/app.nw.zip --title "${currentVersion}" --latest --notes "${commitNotes}"`
		);
		console.log(`Release ${currentVersion} has been created.`);
	}
}

(async () => {
	// 复制 dist 到 package.nw 和 app.nw
	await copyFiles(distDir, packageNwDir);
	await copyFiles(distDir, appNwDir);
	await ensureOutputDir();
	// 压缩 package.nw 和 app.nw 文件夹
	await zipFolder(packageNwDir, path.join(outputDir, "package.nw.zip"));
	await zipFolder(appNwDir, path.join(outputDir, "app.nw.zip"));
	await publishRelease();
})();
