import { ElMessage } from "element-plus";

const repoUrl =
	"https://api.github.com/repos/CrazySpottedDove/Lab-Assistance/releases/latest";
const os = require("os");
const fs = require("fs");
const path = require("path");
const { pipeline } = require("stream");
const { execSync } = require("child_process");
const osMap = {
	win32: "windows",
	darwin: "macos",
	linux: "linux",
};
/**
 * 获取当前操作系统
 *
 * 此函数通过调用`os.platform()`方法获取当前运行平台的操作系统信息，
 * 然后使用此信息从`osMap`映射中检索对应的易于理解的操作系统名称。
 * 如果操作系统在`osMap`中没有对应的映射，则返回`undefined`。
 *
 * @returns {string|undefined} 当前操作系统的名称，如果找不到映射则返回`undefined`
 */
function getOS() {
	return osMap[os.platform()];
}

// 当前的操作系统
const currentOS = getOS();

const sourceNameMap = {
	windows: "package.nw.zip",
	macos: "app.nw.zip",
};

const sourceName = sourceNameMap[currentOS];

const currentPath = path.dirname(process.cwd());

async function cleanUp(zipPath) {
	try {
		fs.chmodSync(zipPath, 0o777); // 修改权限
		fs.unlinkSync(zipPath);
		console.log("File deleted successfully!");
        ElMessage.success("删除压缩包成功(*´∀`)~♥");
	} catch (error) {
		console.error(`Failed to delete ${zipPath}:`, error);
        ElMessage.error("删除压缩包失败，请检查文件权限(;´༎ຶД༎ຶ`)");
	}
}
/**解压缩zip */
async function extractZip(zipPath) {
	try {
		execSync(`unzip -o ${zipPath} -d ${currentPath}`);
		console.log("Extraction successful!");
        ElMessage.success("解压缩并替换成功⁽⁽ ◟(∗ ˊωˋ ∗)◞ ⁾⁾");
        ElMessage.success('请重启软件以使用新版本(*/ω＼*)')
	} catch (err) {
		console.error("Error extracting zip file:", err);
        ElMessage.error("解压缩失败，请检查文件权限(;´༎ຶД༎ຶ`)");
	}
}

const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
	const controller = new AbortController();
	const timeoutId = setTimeout(() => {
		controller.abort();
		ElMessage.error("下载资源超时(((ﾟДﾟ;)))");
        console.error("Download aborted due to timeout");
	}, timeout);
	options.signal = controller.signal;

	return fetch(url, options).finally(() => clearTimeout(timeoutId));
};

async function downLoadSource(url, destination) {
	const controller = new AbortController();

	try {
		// 10秒超时下载
		const response = await fetchWithTimeout(
			url,
			{ method: "GET", signal: controller.signal },
			10000
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch: HTTP ${response.status}`);
		}

		const fileStream = fs.createWriteStream(destination);
		const stream = response.body;

		// 在 pipeline 中使用 AbortController 来处理超时
		const timeoutId = setTimeout(() => {
			controller.abort(); // 超时后中止下载流
			console.error("Download aborted due to timeout");
            ElMessage.error("下载资源超时(((ﾟДﾟ;)))");
		}, 10000); // 10秒超时

		await new Promise((resolve, reject) => {
			pipeline(stream, fileStream, (err) => {
				clearTimeout(timeoutId); // 清理超时计时器
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
        if (fs.statSync(destination).size === 0) {
            ElMessage.error("下载文件为空，请检查网络连接(;´༎ຶД༎ຶ`)");
			throw new Error("Downloaded file is empty");
		}
		console.log(`File downloaded to ${destination}`);
        ElMessage.success("下载资源成功(≧∀≦)ゞ");
	} catch (error) {
		console.error("Error downloading source:", error);
	}
}

async function updateVersion() {
	// 使用fetch API获取仓库的最新发布版本信息
	const response = await fetch(repoUrl);

	// 将响应转换为JSON格式
	const data = await response.json();

	/**根据当前的操作系统，获取对应资源的下载地址 */
	function getSource(name) {
		for (let i = 0; i < data.assets.length; i++) {
			if (data.assets[i].name === name) {
				console.log("get Source:" + data.assets[i].name);
				console.log(
					"source Url:" + data.assets[i].browser_download_url
				);
				return data.assets[i].browser_download_url;
			}
		}
		return null;
	}

	const sourceUrl = getSource(sourceName);
	if (!sourceUrl) {
        ElMessage.error("未找到对应资源，请检查网络连接(;´༎ຶД༎ຶ`)");
		throw new Error("No source found");
	}
	const destination = path.join(currentPath, sourceName);

	await downLoadSource(sourceUrl, destination);

	await extractZip(destination);

	await cleanUp(destination);

	return true;
}
export { updateVersion };
