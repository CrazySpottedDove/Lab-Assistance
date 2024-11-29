// 本文件是构建脚本，用于生成 package.nw.zip 和 app.nw.zip
import fs from "fs-extra";
import path from "path";
import archiver from "archiver";
import { fileURLToPath } from "url";

// 获取当前文件目录的绝对路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, "dist");
const packageNwDir = path.resolve(__dirname, "../package.nw");
const appNwDir = path.resolve(__dirname, "../app.nw");
const outputDir = path.resolve(__dirname, "../");

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

(async () => {
	// 复制 dist 到 package.nw 和 app.nw
	await copyFiles(distDir, packageNwDir);
	await copyFiles(distDir, appNwDir);

	// 压缩 package.nw 和 app.nw 文件夹
	await zipFolder(packageNwDir, path.join(outputDir, "package.nw.zip"));
	await zipFolder(appNwDir, path.join(outputDir, "app.nw.zip"));
})();
