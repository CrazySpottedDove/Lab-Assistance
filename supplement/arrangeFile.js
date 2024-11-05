// 引入 Node.js 模块
const fs = require("fs");
const path = require("path");

// 获取当前模块的绝对路径

const __dirname = path.resolve();
const configDir = path.join(__dirname, "../user/config");
const configFilePath = path.join(__dirname, "../user/config/userConfig.json");
let tmpname = "";

/**检查config完整性并补全 */
function checkConfig(configData) {
	if (configData.language === undefined) {
		configData.language = "chinese";
	}
	if (configData.directDataLevelRule === undefined) {
		configData.directDataLevelRule = "unified";
	}
	if (configData.autoSaveFile === undefined) {
		configData.autoSaveFile = true;
	}
	if (configData.framed === undefined) {
		configData.framed = false;
	}
	if (configData.saveByDate === undefined) {
		configData.saveByDate = true;
	}
    if(configData.newVersionTips === undefined){
        configData.newVersionTips = true;
    }
    if(configData.autoCalcUnit === undefined){
        configData.autoCalcUnit = true;
    }
	return configData;
}

/**读取用户配置文件 */
function readUserConfig() {
	if (fs.existsSync(configFilePath)) {
		let configData = checkConfig(
			JSON.parse(fs.readFileSync(configFilePath, "utf-8"))
		);
		return configData;
	} else {
		fs.mkdirSync(configDir, { recursive: true });
		const initConfig = {
			autoSaveFile: true,
			language: "chinese",
			directDataLevelRule: "unified",
			framed: false,
			saveByDate: true,
		};
		const jsonContent = initConfig;
		fs.writeFileSync(configFilePath, jsonContent, "utf-8");
		return initConfig;
	}
}

/**保存用户配置文件设置 */
function saveUserConfig(userConfig) {
	const jsonContent = JSON.stringify(userConfig, null, 2);
	fs.writeFileSync(configFilePath, jsonContent, "utf-8");
}

/** 生成文件名字*/
function generateFileName(state) {
	let filename = "";
	const tableTitleList = state.tableList.map(
		(table) => table.tableTitleContent
	);
	const graphTitleList = state.graphList.map(
		(graph) => graph.graphTitleContent
	);
	const dataList = [...state.directDataList, ...state.indirectDataList];
	const titleList = tableTitleList.concat(graphTitleList);
	const filteredTitleList = titleList.filter((title) => title !== "");
	if (filteredTitleList.length > 0) {
		for (let i = 0; i < Math.min(filteredTitleList.length, 8); i++) {
			if (i !== 0) {
				filename += "-";
			}
			filename += `${filteredTitleList[i]}`;
		}
	} else {
		for (let i = 0; i < Math.min(dataList.length, 10); i++) {
			if (i !== 0) {
				filename += "-";
			}
			filename += `${dataList[i].title}`;
		}
	}
	return filename.replace(/[<>:"/\\|?*]+/g, "_");
}

/**保存state，作为数据文件 */
function saveStateOnExit(state, userConfig) {
	if (
		state.directDataList.length === 0 &&
		state.indirectDataList.length === 0 &&
		tmpname === ""
	) {
		return;
	}
	const currentDate = new Date();
	const formattedDate = `${currentDate.getFullYear()}-${(
		currentDate.getMonth() + 1
	)
		.toString()
		.padStart(2, "0")}-${currentDate
		.getDate()
		.toString()
		.padStart(2, "0")}`;
	const saveDir = userConfig.saveByDate
		? path.join(__dirname, `../user/data/${formattedDate}`)
		: path.join(__dirname, "../user/data");

	// 如果目录不存在，则创建目录
	if (!fs.existsSync(saveDir)) {
		fs.mkdirSync(saveDir, { recursive: true });
	}
	const filename = `${generateFileName(state)}.json`;
	const filePath = path.join(saveDir, filename);
	const jsonContent = JSON.stringify(state, null, 2);
	if (tmpname === "") {
		tmpname = filename;
		fs.writeFileSync(filePath, jsonContent, "utf-8");
	} else {
		if (tmpname !== filename) {
			const lastPath = path.join(saveDir, tmpname);
			fs.renameSync(lastPath, filePath);
			tmpname = filename;
			fs.writeFileSync(filePath, jsonContent, "utf-8");
		} else {
			fs.writeFileSync(filePath, jsonContent, "utf-8");
		}
	}
}

/** 打开文件，其中会创建一个临时的input文档元素*/
function openFile(state) {
	const fileInput = document.createElement("input");
	fileInput.type = "file";
	fileInput.style.display = "none";

	// 将文件输入元素添加到文档中
	document.body.appendChild(fileInput);

	// 触发文件输入元素的点击事件
	fileInput.click();
	// 监听文件选择后的change事件
	fileInput.addEventListener("change", function (fileEvent) {
		const selectedFile = fileEvent.target.files[0];
		if (selectedFile && selectedFile.type === "application/json") {
			console.log("Selected file:", selectedFile.name);
			// 在这里可以处理选中的文件，例如上传或显示文件内容
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const result = e.target.result; // 获取文件内容
					const parsedData = JSON.parse(result); // 解析 JSON并存储

					for (const key in parsedData) {
						state[key] = parsedData[key];
					}
				} catch (error) {
					ElMessage.error("读取文件过程出错！");
					console.error("Error parsing JSON:", error);
				}
			};
			reader.readAsText(selectedFile); // 读取文件内容为文本
			fileEvent.target.value = "";
		} else {
			console.log("No file selected or file type is not supported.");
			alert("请上传一个 JSON 文件");
		}

		// 选择文件后移除文件输入元素
		document.body.removeChild(fileInput);
	});
}

export { readUserConfig, saveUserConfig, saveStateOnExit, openFile };
