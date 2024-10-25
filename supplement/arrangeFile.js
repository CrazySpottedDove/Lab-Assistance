// 引入 Node.js 模块
const fs = require("fs");
const path = require("path");

// 获取当前模块的绝对路径

const __dirname = path.resolve();
const configDir = path.join(__dirname, "../user/config");
const configFilePath = path.join(__dirname, "../user/config/userConfig.json");
let tmpname = "";

// 读取用户配置文件
function readUserConfig() {
	if (fs.existsSync(configFilePath)) {
		let configData = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
		if(!configData.language){
            configData.language = 'chinese'
        }
        if(!configData.directDataLevelRule){
            configData.directDataLevelRule = 'unified'
        }
        if(!configData.autoSaveFile){
            configData.autoSaveFile = true
        }
        return configData;
	} else {
		fs.mkdirSync(configDir, { recursive: true });
		const initConfig = {
			autoSaveFile: true,
			language: "chinese",
            directDataLevelRule:'unified'
		};
		const jsonContent = initConfig;
		fs.writeFileSync(configFilePath, jsonContent, "utf-8");
		return initConfig;
	}
}

// 修改用户配置文件
function saveUserConfig(userConfig) {
	const jsonContent = JSON.stringify(userConfig, null, 2);
	fs.writeFileSync(configFilePath, jsonContent, "utf-8");
}

// 生成文件名字
function generateFileName(state) {
	let filename = "";
	const tableTitleList = state.tableList.map(
		(table) => table.tableTitleContent
	);
	const graphTitleList = state.graphList.map(
		(graph) => graph.graphTitleContent
	);
    const dataList = [...state.directDataList, ...state.indirectDataList]
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

// 保存文件
function saveStateOnExit(state) {
    if(state.directDataList.length === 0 && state.indirectDataList.length === 0 && tmpname === ''){
        return
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
    const saveDir = path.join(__dirname, `../user/data/${formattedDate}`);

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

// 打开文件
function openFile(event, state) {
	const file = event.target.files[0];
	if (file && file.type === "application/json") {
		const reader = new FileReader();
		// 文件读取完成时的回调
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
		reader.readAsText(file); // 读取文件内容为文本
		event.target.value = "";
	} else {
		alert("请上传一个 JSON 文件");
	}
}

// 导出函数
export { readUserConfig, saveUserConfig, saveStateOnExit, openFile };
