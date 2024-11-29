// 本文件是构建脚本，用于生成 package.nw.zip 和 app.nw.zip
import fs from "fs-extra";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { currentVersion } from "./src/assets/versionTips.js";

// 获取当前文件目录的绝对路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "dist");
const packageNwDir = path.resolve(__dirname, "nw-folders/unzipped/package.nw");
const appNwDir = path.join(__dirname, "nw-folders/unzipped/app.nw");
const outputDir = path.join(__dirname, "nw-folders/zipped");

// 先确保 outputDir 目录存在，如果不存在则创建它
async function ensureOutputDir() {
  try {
    await fs.ensureDir(outputDir);
    console.log(`Output directory is ready: ${outputDir}`);
  } catch (error) {
    console.error(`Failed to create output directory: ${outputDir}`, error);
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
			`Failed to copy files from ${srcDir} to ${destDir}:`,
			error
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
		console.error(`Failed to create zip for ${folderPath}:`, error);
	}
}

// 检查 GitHub Release 是否存在
function checkReleaseExists(version) {
  try {
    const result = execSync(`gh release list --limit 1000 --json tagName`, { encoding: "utf-8" });
    return result.includes(version); // 如果版本号在列表中，表示已经存在该 Release
  } catch (error) {
    console.error("Failed to check for existing release:", error);
    return false;
  }
}

// 发布或更新 GitHub Release
async function publishRelease() {
  // 检查是否已存在该版本的 Release
  const releaseExists = checkReleaseExists(currentVersion);

  if (releaseExists) {
    console.log(`Release ${currentVersion} already exists. Editing the release...`);

    // 更新已存在的 Release（上传新的文件和修改标题）
    execSync(
      `gh release edit ${currentVersion} --title "${currentVersion}" `
    );
    console.log(`Release ${currentVersion} has been updated.`);

    // 上传新的资产（如果需要）
    execSync(
      `gh release upload ${currentVersion} ${outputDir}/package.nw.zip ${outputDir}/app.nw.zip --clobber`
    );
    console.log(`Assets uploaded to Release ${currentVersion}.`);

  } else {
    console.log(`Release ${currentVersion} does not exist. Creating a new release...`);
    // 创建新的 Release 并上传文件
    execSync(
      `gh release create ${currentVersion} ${outputDir}/package.nw.zip ${outputDir}/app.nw.zip --title "${currentVersion}"`
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
