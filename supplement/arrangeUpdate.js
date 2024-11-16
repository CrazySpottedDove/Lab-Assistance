const repoUrl =
	"https://api.github.com/repos/CrazySpottedDove/Lab-Assistance/releases/latest";
const os = require("os");
const fs = require("fs");
const path = require("path");
const {pipeline} = require("stream");
const {execSync} = require("child_process");
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

async function cleanUp(zipPath){
    try{
        fs.unlinkSync(zipPath)
    }catch(error){
        console.error(`Failed to delete ${zipPath}:`,error)
    }
}
/**解压缩zip */
async function extractZip(zipPath){
    try {
		execSync(`unzip -o ${zipPath} -d ${currentPath}`);
		console.log("Extraction successful!");
	} catch (err) {
		console.error("Error extracting zip file:", err);
	}
}
async function downLoadSource(url, destination) {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Failed to fetch: HTTP ${response.status}`);
	}
	const fileStream = fs.createWriteStream(destination);
	const stream = response.body;
	await new Promise((resolve, reject) => {
		pipeline(
			stream, // 响应流
			fileStream, // 文件写入流
			(err) => {
				// 错误处理
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			}
		);
	});
	console.log(`File downloaded to ${destination}`);
}
async function updateVersion() {
	// 使用fetch API获取仓库的最新发布版本信息
	const response = await fetch(repoUrl);

	// 将响应转换为JSON格式
	const data = await response.json();

	/**根据当前的操作系统，获取对应资源的下载地址 */
	function getSource(name) {
		for (let i = 0; i < data.assets.length; i++) {
            console.log(data.assets[i].name)
            console.log(data.assets[i].browser_download_url)
			if (data.assets[i].name === name) {
				return data.assets[i].browser_download_url;
			}
		}
		return null;
	}

	const sourceUrl = getSource(sourceName);
    if(!sourceUrl){
        throw new Error('No source found')
    }
	const destination = path.join(currentPath, sourceName);

	await downLoadSource(sourceUrl, destination);

    await extractZip(destination)

    await cleanUp(destination)

    return true
}
export { updateVersion };
