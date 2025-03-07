import { ElMessage } from "element-plus";

async function saveStateOnExit(state, userConfig) {
	const { saveStateOnExit } = await import("../../supplement/arrangeFile.js");
	saveStateOnExit(state, userConfig);
}

async function openFile(state) {
	const { openFile } = await import("../../supplement/arrangeFile.js");
	openFile(state);
}

/**递归的深克隆函数 */
function deepClone(obj) {
	if (obj === null || typeof obj !== "object") {
		return obj; // 处理基本类型
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => deepClone(item)); // 深拷贝数组
	}

	const clonedObj = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			clonedObj[key] = deepClone(obj[key]); // 深拷贝对象属性
		}
	}
	return clonedObj;
}

/**将str复制到剪贴板 */
function copy(str) {
	navigator.clipboard.writeText(str);
}

/**处理所有的快捷键事件 */
function handleKeyDown(event, store) {
	// ctrl+shift
	if (event.ctrlKey && event.shiftKey) {
		const key = event.key.toLowerCase();
		switch (key) {
			case "c":
				event.preventDefault();

				// 合法性检查
				if (
					store.state.view.type === "readme" ||
					store.state.view.type === "numberDoc" ||
					store.state.view.type === "uncerDoc" ||
					store.state.view.type === "propertyDoc"
				)
					return;
				if (store.state.view.index < 0) return;

				store.state.copyBoardByView.type = store.state.view.type;
				store.state.copyBoardByView.index = store.state.view.index;
				switch (store.state.view.type) {
					case "directData":
						ElMessage.success(
							`已复制 ${
								store.state.directDataList[
									store.state.view.index
								].title
							} 的信息，在新的直接数据中使用 Ctrl + Shift + V 黏贴`
						);
						break;
					case "indirectData":
						ElMessage.success(
							`已复制 ${
								store.state.indirectDataList[
									store.state.view.index
								].title
							} 的信息，在新的间接数据中使用 Ctrl + Shift + V 黏贴`
						);
						break;
					case "table":
						copy(
							store.state.tableList[store.state.view.index]
								.tableContent
						);
						ElMessage.success(`表格内容已复制到剪贴板！`);
						break;
					case "graph":
						copy(
							store.state.graphList[store.state.view.index]
								.graphContent
						);
						ElMessage.success(`绘图内容已复制到剪贴板！`);
						break;
					default:
						break;
				}

				return;
			case "v":
				event.preventDefault();

				// 合法性检查
				if (
					store.state.view.type !== "directData" &&
					store.state.view.type !== "indirectData"
				)
					return;
				if (store.state.view.type !== store.state.copyBoardByView.type)
					return;
				if (
					store.state.view.index < 0 ||
					store.state.copyBoardByView.index < 0
				)
					return;
				let source;
				switch (store.state.copyBoardByView.type) {
					case "directData":
						source =
							store.state.directDataList[
								store.state.copyBoardByView.index
							];
						for (let key in source) {
							if (key !== "title" && key !== "id") {
								store.state.directDataList[
									store.state.view.index
								][key] = deepClone(source[key]);
							}
						}
						return;
					case "indirectData":
						source =
							store.state.indirectDataList[
								store.state.copyBoardByView.index
							];
						for (let key in source) {
							if (key !== "title" && key !== "id") {
								store.state.indirectDataList[
									store.state.view.index
								][key] = deepClone(source[key]);
							}
						}
						return;
				}
				return;
			case "d":
				event.preventDefault();
				switch (store.state.view.type) {
					case "directData":
						store.Delete.directData(store.state.view.index);
						break;
					case "indirectData":
						store.Delete.indirectData(store.state.view.index);
						break;
					case "table":
						store.Delete.table(store.state.view.index);
						break;
					case "graph":
						store.Delete.graph(store.state.view.index);
						break;
					default:
						break;
				}
				return;
		}
	}

	// ctrl
	let view = store.state.view;
	if (event.ctrlKey) {
		switch (event.key) {
			case "s":
				event.preventDefault();
				saveStateOnExit(store.state, store.userConfig);
				ElMessage.success("文件已保存");
				return;
			case "o":
				event.preventDefault();
				openFile(store.state);
				return;
			case "d":
				event.preventDefault();
				store.Add.directData();
				return;
			case "i":
				event.preventDefault();
				store.Add.indirectData();
				return;
			case "t":
				event.preventDefault();
				store.Add.table();
				return;
			case "g":
				event.preventDefault();
				store.Add.graph();
				return;
			case "n":
				event.preventDefault();
				switch (view.type) {
					case "directData":
						store.Add.directData();
						return;
					case "indirectData":
						store.Add.indirectData();
						return;
					case "table":
						store.Add.table();
						return;
					case "graph":
						store.Add.graph();
						return;
				}
				return;
		}
	}

	if (event.altKey) {
		switch (event.key) {
			case "s":
				event.preventDefault();
				switch (view.type) {
					case "directData":
						if (
							view.index <
							store.state.directDataList.length - 1
						) {
							view.index++;
							break;
						} else {
							view.index = -1;
							view.type = "indirectData";
						}
					case "indirectData":
						if (
							view.index <
							store.state.indirectDataList.length - 1
						) {
							view.index++;
							break;
						} else {
							view.index = -1;
							view.type = "table";
						}
					case "table":
						if (view.index < store.state.tableList.length - 1) {
							view.index++;
							break;
						} else {
							view.index = -1;
							view.type = "graph";
						}
					case "graph":
						if (view.index < store.state.graphList.length - 1) {
							view.index++;
							break;
						} else {
							view.index = 0;
							if (store.state.directDataList.length) {
								view.type = "directData";
							} else if (store.state.indirectDataList.length) {
								view.type = "indirectData";
							} else if (store.state.tableList.length) {
								view.type = "table";
							} else if (store.state.graphList.length) {
								view.type = "graph";
							}
							return;
						}
					default:
						return;
				}
				return;
			case "w":
				switch (view.type) {
					case "graph":
						if (view.index > 0) {
							view.index--;
							break;
						} else {
							view.index = store.state.tableList.length;
							view.type = "table";
						}
					case "table":
						if (view.index > 0) {
							view.index--;
							break;
						} else {
							view.index = store.state.indirectDataList.length;
							view.type = "indirectData";
						}
					case "indirectData":
						if (view.index > 0) {
							view.index--;
							break;
						} else {
							view.index = store.state.directDataList.length;
							view.type = "directData";
						}
					case "directData":
						if (view.index > 0) {
							view.index--;
							break;
						} else {
							if (store.state.graphList.length) {
								view.index = store.state.graphList.length - 1;
								view.type = "graph";
							} else if (store.state.tableList.length) {
								view.index = store.state.tableList.length - 1;
								view.type = "table";
							} else if (store.state.indirectDataList.length) {
								view.index =
									store.state.indirectDataList.length - 1;
								view.type = "indirectData";
							} else if (store.state.directDataList.length) {
								view.index =
									store.state.directDataList.length - 1;
								view.type = "directData";
							}
							return;
						}
					default:
						return;
				}
				return;
		}
	}
}

export { handleKeyDown };
