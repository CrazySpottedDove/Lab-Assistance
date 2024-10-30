import { defineStore } from "pinia";
import { ref } from "vue";
import { calc } from "a-calc";
import {
	dimensionalAdd,
	evaluateExpression,
	evaluateUncer,
	calculateLeastSquares,
	calculateQuadraticLeastSquares,
	getLevel,
	getBit,
	standardByBit,
	standardByLevel,
	toPercent,
	toPositive,
	errorMode,
} from "../vaculater";

//Don't import { ElMessage } from 'element-plus'

export const useAllDataStore = defineStore("allData", () => {
	/**初始化相关函数 */
	const Init = (function () {
		return {
			/** 返回初始化状态*/
			state: function () {
				return {
					directDataList: [],
					indirectDataList: [],
					tableList: [],
					graphList: [],
					tableDataList: [],
					// view types: directData, indirectData, table, graph, readme, numberDoc, uncerDoc, propertyDoc
					view: { type: "readme" },
					counter: 0,
					copyBoardByView: { type: "null", index: -1 },
					// 剪贴板
				};
			},

			/**返回初始化用户配置 */
			config: function () {
				return {
					autoSaveFile: true,
					language: "chinese",
					directDataLevelRule: "unified",
                    framed: false,
                    saveByDate: true,
                    newVersionTips: true
				};
			},

			/**返回初始化直接数据 */
			directData: function () {
				return {
					id: state.value.counter,
					dataSet: [],
					title: "",
					theoData: "",
					analysis: {
						avg: {
							propertyName: "平均值",
							propertyValue: "",
						},
						relAvgDev: {
							propertyName: "相对平均偏差",
							propertyValue: "",
						},
						stdDev: {
							propertyName: "标准偏差",
							propertyValue: "",
						},
						relStdDev: {
							propertyName: "相对标准偏差",
							propertyValue: "",
						},
						aUncer: {
							propertyName: "A类不确定度",
							propertyValue: "0",
						},
					},
					type: "direct",
					moreUncer: {
						equipUncer: "",
						bUncer: "",
						wholeUncer: "",
					},
					unit: "",
					levelRule: userConfig.value.directDataLevelRule,
					doc: "",
				};
			},

			/**返回初始化间接数据 */
			indirectData: function () {
				return {
					id: state.value.counter,
					dataSet: [],
					title: "",
					theoData: "",
					analysis: {
						avg: {
							propertyName: "平均值",
							propertyValue: "0",
						},
						relAvgDev: {
							propertyName: "相对平均偏差",
							propertyValue: "0",
						},
						stdDev: {
							propertyName: "标准偏差",
							propertyValue: "0",
						},
						relStdDev: {
							propertyName: "相对标准偏差",
							propertyValue: "0",
						},
					},
					type: "indirect",
					computeMethod: "",
					computeOption: "forAll",
					moreUncer: {
						wholeUncer: "",
					},
					unit: "",
					dataMethod: false,
					doc: "",
					multiplier: 1,
				};
			},

			/**返回初始化表格 */
			table: function () {
				return {
					tableContent: "",
					tableTitleContent: "",
					tableFramed: userConfig.value.framed,
					dataValue1: [],
					dataValueN: [],
				};
			},

			/**返回初始化图 */
			graph: function () {
				return {
					graphFramed: userConfig.value.framed,
					singleGraphs: [
						{
							graphData: "",
							graphOption: "line",
							xDataId: -2,
							yDataId: -2,
						},
					],
					graphContent: "",
					graphTitleContent: "",
				};
			},

			/**返回初始化单图线 */
			singleGraph: function () {
				return {
					graphData: "",
					graphOption: "line",
					xDataId: -2,
					yDataId: -2,
				};
			},
			/**返回初始化forAll:analysis */
			forAllAnalysis: function () {
				return {
					avg: {
						propertyName: "平均值",
						propertyValue: "0",
					},
					relAvgDev: {
						propertyName: "相对平均偏差",
						propertyValue: "0",
					},
					stdDev: {
						propertyName: "标准偏差",
						propertyValue: "0",
					},
					relStdDev: {
						propertyName: "相对标准偏差",
						propertyValue: "0",
					},
				};
			},

			/**返回初始化forAvg:analysis */
			forAvgAnalysis: function () {
				return {
					avg: {
						propertyName: "实验值",
						propertyValue: "0",
					},
				};
			},
		};
	})();

	/**删除相关函数 */
	const Delete = (function () {
		/**处理删除某个数据或图表后页面的显示逻辑 */
		function displayAfterDeletion(type, index) {
			if (
				state.value.view.type === type &&
				state.value.view.index >= index
			) {
				state.value.view.index--;
				state.value.copyBoardByView.index = -1;
				state.value.copyBoardByView.type = "null";
				if (state.value.view.index < 0) {
					switch (type) {
						case "graph":
							if (state.value.tableList.length > 0) {
								state.value.view = {
									type: "table",
									index: state.value.tableList.length - 1,
								};
								return;
							}
						case "table":
							if (state.value.indirectDataList.length > 0) {
								state.value.view = {
									type: "indirectData",
									index:
										state.value.indirectDataList.length - 1,
								};
								return;
							}
						case "indirectData":
							if (state.value.directDataList.length > 0) {
								state.value.view = {
									type: "directData",
									index:
										state.value.directDataList.length - 1,
								};
								return;
							}
						case "directData":
							state.value.view = { type: "readme" };
							return;
					}
				}
			}
		}
		return {
			/**删除一组直接数据 */
			directData: function (index) {
				state.value.directDataList.splice(index, 1);
				displayAfterDeletion("directData", index);
			},

			/**删除一组间接数据 */
			indirectData: function (index) {
				state.value.indirectDataList.splice(index, 1);
				displayAfterDeletion("indirectData", index);
			},

			/**删除一张表 */
			table: function (index) {
				state.value.tableList.splice(index, 1);
				state.value.tableDataList.splice(index, 1);
				displayAfterDeletion("table", index);
			},

			/**删除一张图 */
			graph: function (index) {
				state.value.graphList.splice(index, 1);
				displayAfterDeletion("graph", index);
			},
			/**在当前选中的图中删除单条图线 */
			singleGraph: function (index) {
				if (state.value.view.type !== "graph") return;
				state.value.graphList[
					state.value.view.index
				].singleGraphs.splice(index, 1);
			},
		};
	})();

	/**添加相关函数 */
	const Add = (function () {
		return {
			/**添加一个直接数据 */
			directData: function () {
				state.value.directDataList.push(
					Init.directData()
				);
				// 根据flag值选择合适的数据初始化方法
				state.value.view = {
					type: "directData",
					index: state.value.directDataList.length - 1,
				};
				// 更新计数器，记录数据列表的当前长度
				state.value.counter++;
			},

			/**添加一个间接数据 */
			indirectData: function () {
				state.value.indirectDataList.push(
					Init.indirectData()
				);
				state.value.view = {
					type: "indirectData",
					index: state.value.indirectDataList.length - 1,
				};
				state.value.counter++;
			},

			/**添加一张表格 */
			table: function () {
				state.value.tableList.push(Init.table());
				state.value.tableDataList.push([]);
				state.value.view = {
					type: "table",
					index: state.value.tableList.length - 1,
				};
			},

			/**添加一张图 */
			graph: function () {
				state.value.graphList.push(Init.graph());
				state.value.view = {
					type: "graph",
					index: state.value.graphList.length - 1,
				};
			},

			/**在当前选中的图中添加单条图线 */
			singleGraph: function () {
				if (state.value.view.type !== "graph") return;
				state.value.graphList[state.value.view.index].singleGraphs.push(
					Init.singleGraph()
				);
			},
		};
	})();

	/**选择相关函数 */
	const Select = (function () {
		return {
			directData: function (index) {
				state.value.view.type = "directData";
				state.value.view.index = index;
			},
			indirectData: function (index) {
				state.value.view.type = "indirectData";
				state.value.view.index = index;
			},
			table: function (index) {
				state.value.view.type = "table";
				state.value.view.index = index;
			},
			graph: function (index) {
				state.value.view.type = "graph";
				state.value.view.index = index;
			},
			readme: function () {
				state.value.view.type = "readme";
				delete state.value.view.index;
			},
			numberDoc: function () {
				state.value.view.type = "numberDoc";
				delete state.value.view.index;
			},
			uncerDoc: function () {
				state.value.view.type = "uncerDoc";
				delete state.value.view.index;
			},
			propertyDoc: function () {
				state.value.view.type = "propertyDoc";
				delete state.value.view.index;
			},
		};
	})();

    const userConfig = ref(Init.config());
	const state = ref(Init.state());
	const rely = `\\usepackage{amsmath}
\\usepackage{bm}
\\usepackage{float}
\\usepackage{upgreek}
\\usepackage{tabularray}
\\usepackage{calc}
\\usepackage{etoolbox}
\\providecommand{\\Romannumeral}[1]{\\uppercase\\expandafter{\\romannumeral #1}}
\\NewDocumentCommand{\\cmplen}{mmmO{}}{%
    \\ifdim #1>#2%
        #3%
    \\else%
        #4%
    \\fi%
}
\\newlength{\\labtmplen}
\\NewDocumentCommand{\\framed}{omo}{%
    \\setlength{\\labtmplen}{\\widthof{#2}}%
	\\framebox[\\labtmplen+4em]{
		\\begin{minipage}{\\labtmplen+2em}
			\\quad\\\\[2ex]
			\\centering #2
			\\IfNoValueF{#1}{\\caption{#1}}\\IfNoValueF{#3}{\\IfNoValueTF{#1}{\\quad\\\\[2ex]\\em #3}{\\quad\\\\[-2ex]\\em #3}}
		\\end{minipage}
	}
}
\\NewDocumentCommand{\\notframed}{omo}{%
    \\setlength{\\labtmplen}{\\widthof{#2}}%
    \\begin{center}
        \\cmplen{\\labtmplen}{.94\\textwidth}{\\resizebox{.94\\textwidth}{!}{#2}}[#2]%
        \\IfNoValueF{#1}{\\caption{#1}}\\IfNoValueF{#3}{\\IfNoValueTF{#1}{\\quad\\\\[2ex]\\em #3}{\\quad\\\\[-2ex]\\em #3}}
    \\end{center}
}
\\usepackage{tikz}
\\usetikzlibrary{calc}
\\usepackage{pgfplots}
\\usepackage{ifthen}
\\newcommand{\\xlabel}{}
\\newcommand{\\xmin}{}
\\newcommand{\\xmax}{}
\\newcommand{\\ylabel}{}
\\newcommand{\\ymin}{}
\\newcommand{\\ymax}{}
\\newboolean{xfield}
\\newboolean{yfield}
\\setboolean{xfield}{false}
\\setboolean{yfield}{false}
\\NewDocumentCommand{\\xstyle}{moo}{
	\\renewcommand{\\xlabel}{#1}
	\\IfNoValueF{#2}{
		\\setboolean{xfield}{true}
		\\renewcommand{\\xmin}{#2}
		\\renewcommand{\\xmax}{#3}
	}
}
\\NewDocumentCommand{\\ystyle}{moo}{
	\\renewcommand{\\ylabel}{#1}
	\\IfNoValueF{#2}{
		\\setboolean{yfield}{true}
		\\renewcommand{\\ymin}{#2}
		\\renewcommand{\\ymax}{#3}
	}
}
\\newcounter{markstyle}
\\newcounter{funcstyle}
\\NewDocumentEnvironment{plot}{mos}{
	#1%
	\\begin{tikzpicture}
		\\setcounter{markstyle}{0}
		\\setcounter{funcstyle}{0}
		\\ifbool{xfield}{
			\\ifbool{yfield}{
				\\begin{axis}[xlabel={\\xlabel},ylabel={\\ylabel},xmin=\\xmin,xmax=\\xmax,ymin=\\ymin,ymax=\\ymax,\\IfNoValueF{#2}{#2,} legend pos= outer north east,grid= major,\\IfBooleanT{#3}{axis equal,}]
			}{
				\\begin{axis}[xlabel={\\xlabel},ylabel={\\ylabel},xmin=\\xmin,xmax=\\xmax,\\IfNoValueF{#2}{#2,} legend pos= outer north east,grid= major,\\IfBooleanT{#3}{axis equal,}]
			}
		}{
			\\ifbool{yfield}{
				\\begin{axis}[xlabel={\\xlabel},ylabel={\\ylabel},ymin=\\ymin,ymax=\\ymax,\\IfNoValueF{#2}{#2,} legend pos= outer north east,grid= major,\\IfBooleanT{#3}{axis equal,}]
			}{
				\\begin{axis}[xlabel={\\xlabel},ylabel={\\ylabel},\\IfNoValueF{#2}{#2,} legend pos= outer north east,grid= major,\\IfBooleanT{#3}{axis equal,}]
			}
		}
}{
	\\end{axis}\\end{tikzpicture}\\setboolean{xfield}{false}\\setboolean{yfield}{false}
}
\\NewDocumentCommand{\\datapoint}{O{}mo}{
	\\ifcase\\value{markstyle}
		\\addplot[mark=*,solid,black,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\or
		\\addplot[mark=square*,solid,green,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\or
		\\addplot[mark=diamond*,solid,red,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\or
		\\addplot[mark=triangle*,solid,blue,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\or
		\\addplot[mark=cross,solid,yellow,#1] coordinates {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{markstyle}
	\\fi
}
\\NewDocumentCommand{\\functionline}{mmo}{
	\\ifcase\\value{funcstyle}
		\\addplot[solid,black,no markers, domain=#1] {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{funcstyle}
	\\or
		\\addplot[solid,green,no markers, domain=#1] {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{funcstyle}
	\\or
		\\addplot[solid,red,no markers, domain=#1] {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{funcstyle}
	\\or
		\\addplot[solid,blue,no markers, domain=#1] {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{funcstyle}
	\\or
		\\addplot[solid,yellow,no markers,domain=#1] {#2 };
		\\IfNoValueF{#3}{\\addlegendentry{#3 }}\\stepcounter{funcstyle}
	\\fi
}`;

	/**更新当前数据的各项指标，包括 analysis 和 uncer */
	function refreshDataDetails() {
		// 错误检查
		if (
			state.value.view.type !== "directData" &&
			state.value.view.type !== "indirectData"
		) {
			console.error(
				"在 view type 不为 directData 或 indirectData 时错误调用 refresh 函数"
			);
			return;
		}
		if (state.value.view.index < 0) {
			console.error("在 view index < 0 时错误调用 refresh 函数");
			return;
		}
		try {
			let selectedType;
			let selectedList;
			switch (state.value.view.type) {
				case "directData":
					selectedType = "direct";
					selectedList =
						state.value.directDataList[state.value.view.index];
					break;
				case "indirectData":
					selectedType = "indirect";
					selectedList =
						state.value.indirectDataList[state.value.view.index];
					break;
			}
			let length = selectedList.dataSet.length;
			let selectedDataSet = selectedList.dataSet;
			let selectedAnalysis = selectedList.analysis;
			let selectedTheoData = selectedList.theoData;

			/**检查用户输入的数据是否合法，如不合法，抛出错误并提示 */
			function checkInvalidData(rawData) {
				if (rawData === "") {
					ElMessage.error(
						"数据不能为空！如果要删除，尝试点击右边的删除图标。"
					);
					throw new Error(
						"数据不能为空！如果要删除，尝试点击右边的删除图标。"
					);
				}
				let rawDataNum = Number(rawData);
				if (typeof rawDataNum !== "number" || isNaN(rawDataNum)) {
					ElMessage.error(
						`无效的数据${rawDataNum}！是否包含了字母或百分号？`
					);
					throw new Error(
						`无效的数据${rawDataNum}！是否包含了字母或百分号？`
					);
				}
			}

			/**根据传入的key和name，创造一个analysis对象，并添加到selectedAnalysis中 */
			function createAnalysis(key, name, value) {
				selectedAnalysis[key] = {
					propertyName: name,
					propertyValue: value,
				};
			}

			/**在selectedAnalysis中将一个analysis对象的值置0 */
			function initAnalysis(key) {
				selectedAnalysis[key].propertyValue = "0";
			}

			/**在selectedAnalysis中修改一个analysis对象的值 */
			function editAnalysis(key, value) {
				selectedAnalysis[key].propertyValue = value;
			}

			if (
				selectedType === "direct" ||
				(selectedType === "indirect" &&
					selectedList.computeOption === "forAll")
			) {
				let dataMaxLevel = -70;
				let dataMinLevel = 70;
				let sum = "0";
				if (length !== 0) {
					selectedDataSet.forEach((item) => {
						checkInvalidData(item.rawData);
						sum = calc(`(${sum}) + (${item.rawData})`);
						let tmpLevel = getLevel(item.rawData);
						dataMaxLevel = Math.max(dataMaxLevel, tmpLevel);
						dataMinLevel = Math.min(dataMinLevel, tmpLevel);
					});
					// 取最大level和最小level

					if (selectedType === "direct") {
						switch (selectedList.levelRule) {
							case "unified":
								selectedDataSet.forEach((item) => {
									item.rawData = standardByLevel(
										item.rawData,
										dataMinLevel
									);
									item.bit = getBit(item.rawData);
									item.level = dataMinLevel;
								});
								break;
							case "nonUnified":
								selectedDataSet.forEach((item) => {
									item.bit = getBit(item.rawData);
									item.level = getLevel(item.rawData);
								});
								break;
							case "precise":
								selectedDataSet.forEach((item) => {
									item.bit = 70;
									item.level = -70;
								});
								break;
							default:
								break;
						}
					}
					// 规范化direct数据

					let avgValue = String(Number(sum) / length);
					// calc在对小数除以相对大的数字的时候会有精度问题，需要避免

					if (selectedType === "direct") {
						editAnalysis(
							"avg",
							standardByLevel(avgValue, dataMinLevel)
						);
					} else {
						editAnalysis(
							"avg",
							standardByLevel(avgValue, dataMaxLevel)
						);
					}
					// 将均值依照level赋值

					let relErrSum = "0";
					if (selectedTheoData !== "") {
						// 当理论值不为空时，处理相关数据
						checkInvalidData(selectedTheoData);
						if (selectedTheoData === "0") {
							ElMessage.warning(
								"理论值为 0，不计算相对误差、平均相对误差与平均值与理论值的相对误差！"
							);
							createAnalysis("relErr", "相对误差", "0");
							createAnalysis("avgRelErr", "平均相对误差", "0");
							createAnalysis(
								"avgOverallRelErr",
								"平均值与理论值的相对误差",
								"0"
							);
						} else {
							selectedDataSet.forEach((item) => {
								let tmpRelErr = String(
									Number(
										calc(
											`${item.rawData} - ${selectedTheoData}`
										)
									) / Number(selectedTheoData)
								);
								tmpRelErr = toPositive(tmpRelErr);
								relErrSum = calc(
									`(${relErrSum}) + (${tmpRelErr})`
								);
								tmpRelErr = toPercent(errorMode(tmpRelErr));
								item.relErr = tmpRelErr;
							});
							// 添加相对误差
							let tmpAvgRelErr = String(
								Number(relErrSum) / length
							);
							tmpAvgRelErr = toPercent(errorMode(tmpAvgRelErr));
							createAnalysis(
								"avgRelErr",
								"平均相对误差",
								tmpAvgRelErr
							);
							// 添加平均相对误差
							let tmpOverallRelErr = String(
								Number(
									calc(`${avgValue} - ${selectedTheoData}`)
								) / Number(selectedTheoData)
							);
							tmpOverallRelErr = toPositive(tmpOverallRelErr);
							tmpOverallRelErr = toPercent(
								errorMode(tmpOverallRelErr)
							);
							createAnalysis(
								"avgOverallRelErr",
								"平均值与理论值的相对误差",
								tmpOverallRelErr
							);
							// 添加平均值与理论值的相对误差
						}
					} else {
						delete selectedAnalysis["avgRelErr"];
						delete selectedAnalysis["avgOverallRelErr"];
					}
					// 处理理论值相关

					let devSum = "0";
					let devSquareSum = "0";
					selectedDataSet.forEach((item) => {
						let tmpDev = toPositive(
							calc(`(${item.rawData}) - (${avgValue})`)
						);
						devSum = calc(`(${devSum}) + (${tmpDev})`);
						devSquareSum = calc(
							`(${devSquareSum}) + (${tmpDev}) * (${tmpDev})`
						);
					});
					// 计算偏差的和、平方偏差的和

					if (avgValue === "0") {
						ElMessage.warning("平均值为 0，不计算相对平均偏差！");
						initAnalysis("relAvgDev");
					} else {
						let tmpRelAvgDev = toPositive(
							String(Number(devSum) / length / Number(avgValue))
						);
						tmpRelAvgDev = toPercent(errorMode(tmpRelAvgDev));
						editAnalysis("relAvgDev", tmpRelAvgDev);
					}
					// 计算相对平均偏差

					if (length > 1) {
						let tmpStdDev = String(
							Math.sqrt(Number(devSquareSum) / (length - 1))
						);

						editAnalysis("stdDev", errorMode(tmpStdDev));
						if (avgValue === "0") {
							ElMessage.warning(
								"平均值为 0，不计算相对标准偏差！"
							);
							initAnalysis("relStdDev");
						} else {
							let tmpRelStdDev = toPositive(
								String(Number(tmpStdDev) / Number(avgValue))
							);
							tmpRelStdDev = toPercent(errorMode(tmpRelStdDev));
							editAnalysis("relStdDev", tmpRelStdDev);
						}
						if (selectedType === "direct") {
							let tmpAUncer = String(
								Number(tmpStdDev) / Math.sqrt(length)
							);
							editAnalysis("aUncer", errorMode(tmpAUncer));
						} else {
							delete selectedAnalysis["aUncer"];
						}
					} else {
						initAnalysis("stdDev");
						initAnalysis("relStdDev");
						if (selectedType === "direct") {
							initAnalysis("aUncer");
						} else {
							delete selectedAnalysis["aUncer"];
						}
					}
					// 计算标准偏差，相对标准偏差和A类不确定度

					if (selectedType === "direct") {
						let selectedUncers = selectedList.moreUncer;
						if (selectedUncers.equipUncer) {
							checkInvalidData(selectedUncers.equipUncer);
							let tmpBUncer = String(
								Number(selectedUncers.equipUncer) / Math.sqrt(3)
							);
							selectedUncers.bUncer = errorMode(tmpBUncer);
						} else {
							delete selectedUncers.bUncer;
						}
						// 解决B类不确定度
						if (selectedUncers.bUncer) {
							let tmpWholeUncer = dimensionalAdd(
								selectedAnalysis["aUncer"].propertyValue,
								selectedUncers.bUncer
							);
							selectedUncers.wholeUncer =
								errorMode(tmpWholeUncer);
						} else {
							selectedUncers.wholeUncer =
								selectedAnalysis["aUncer"].propertyValue;
						}
						// 解决总不确定度
					}
					// 计算direct数据的不确定度
				}
				// 长度不为0情况
				else {
					initAnalysis("avg");
					initAnalysis("relAvgDev");
					initAnalysis("stdDev");
					initAnalysis("relStdDev");
					if (selectedType === "direct") {
						initAnalysis("aUncer");
						if (selectedList.moreUncer.equipUncer) {
							checkInvalidData(selectedList.moreUncer.equipUncer);
							let tmpBUncer = String(
								Number(selectedList.moreUncer.equipUncer) /
									Math.sqrt(3)
							);
							selectedList.moreUncer.bUncer =
								errorMode(tmpBUncer);
							selectedList.moreUncer.wholeUncer =
								selectedList.moreUncer.bUncer;
						}
					}
					delete selectedAnalysis["relErr"];
					delete selectedAnalysis["avgRelErr"];
					delete selectedAnalysis["avgOverallRelErr"];
				}
				// 长度为0情况
			}
			// 多数据情况
			else if (
				selectedType === "indirect" &&
				selectedList.computeOption === "forAvg"
			) {
				createAnalysis("avg", "实验值", selectedDataSet[0].rawData);
				if (selectedTheoData !== "") {
					checkInvalidData(selectedTheoData);
					let tmpRelErr = String(
						Number(
							calc(
								`(${selectedDataSet[0].rawData}) - (${selectedTheoData}) `
							)
						) / Number(selectedTheoData)
					);
					tmpRelErr = toPositive(tmpRelErr);
					tmpRelErr = toPercent(errorMode(tmpRelErr));
					createAnalysis("relErr", "相对误差", tmpRelErr);
					selectedDataSet[0].relErr = tmpRelErr;
				} else {
					delete selectedAnalysis["relErr"];
					delete selectedDataSet[0].relErr;
				}
			}
			// 单数据情况
			if (selectedType === "indirect") {
				ElMessage.success("刷新成功！");
			}
		} catch (error) {
			ElMessage.error("在刷新时出错！");
			console.error("Error during refresh", error);
		}
	}

	/**
	 * 编辑间接数据
	 * 该函数用于处理间接数据的编辑操作，包括计算数据集和不确定性评估
	 */
	function editIndirectData() {
		// 检查当前视图是否为间接数据视图
		if (state.value.view.type !== "indirectData") {
			console.error(
				"在view type 不为indirectData 时错误调用 editIndirectData 函数"
			);
			return;
		}
		if (state.value.view.index === -1) {
			console.error("在view index 为-1 时错误调用 editIndirectData 函数");
			return;
		}

		// 获取当前选中的间接数据列表
		let selectedList = state.value.indirectDataList[state.value.view.index];

		// 检查是否已经填写了算式
		if (selectedList.computeMethod === "") {
			ElMessage.warning("还未填写算式！");
			return;
		}

		// 合并直接数据和间接数据列表，以便进行统一处理
		let dataList = [
			...state.value.directDataList,
			...state.value.indirectDataList,
		];

		// 根据计算选项执行相应的计算操作
        selectedList.dataSet = evaluateExpression(
			dataList,
			selectedList.computeMethod,
			selectedList.computeOption,
			selectedList.title,
			Number(selectedList.multiplier)
		)

		// 间接数据按照不确定度保留时
		if (selectedList.dataMethod) {
			selectedList.dataSet.forEach((item) => {
				item.rawData = errorMode(item.rawData);
			});
		}

		// 更新选中列表的不确定性
		selectedList.moreUncer.wholeUncer = evaluateUncer(
			dataList,
			selectedList.computeMethod,
			selectedList.title,
			Number(selectedList.multiplier)
		);

		// 刷新视图以显示更新后的数据
		refreshDataDetails();
	}

	/**修改一个间接数据的计算方式（forAll 或 forAvg） */
	function analysisChange() {
		if (state.value.view.type !== "indirectData") {
			console.error(
				"在view type不为indirectData时，错误调用analysisChange 函数"
			);
			return;
		}
		if (state.value.view.index === -1) {
			console.error("在view index为-1时，错误调用analysisChange 函数");
			return;
		}
		let selectedList = state.value.indirectDataList[state.value.view.index];
		switch (selectedList.computeOption) {
			case "forAll":
				selectedList.analysis = Init.forAllAnalysis();
				return;
			case "forAvg":
				selectedList.analysis = Init.forAvgAnalysis();
				return;
		}
	}

	/**
	 * 评估两条数据线的线性关系
	 * 此函数主要用于处理xDataSet和yDataSet两组数据，通过最小二乘法计算它们之间的线性关系
	 * 它首先确定了x和y数据集中最大的bit值，然后计算了它们的最小二乘法线性回归参数
	 * 最后，根据计算出的斜率和截距，进行了标准化处理，以确保它们在相同的bit级别上
	 *
	 * @param {Array} xDataSet - 第一个数据集，包含rawData和bit属性
	 * @param {Array} yDataSet - 第二个数据集，包含rawData和bit属性
	 * @returns {Object} 返回一个对象，包含斜率、截距和决定系数等线性回归参数
	 */
	function evaluateLine(xDataSet, yDataSet) {
		// 初始化x和y数据集的最大bit值为-70，这是一个任意的小数值，确保任何真实数据都会比它大
		let xbit = -70;
		let ybit = -70;
		// 初始化y数据集的最小level值为-70，用于后续的比较
		let yLevel = -70;

		// 遍历x数据集，找出最大的bit值
		xDataSet.forEach((item) => {
			xbit = xbit > item.bit ? xbit : item.bit;
		});

		// 将x数据集的rawData转换为数字数组，便于数学计算
		let x = xDataSet.map((object) => Number(object.rawData));

		// 遍历y数据集，找出最大的bit值和最小的level值
		yDataSet.forEach((item) => {
			ybit = ybit > item.bit ? ybit : item.bit;
			yLevel = yLevel < item.level ? item.level : yLevel;
		});

		// 将y数据集的rawData转换为数字数组，便于数学计算
		let y = yDataSet.map((object) => Number(object.rawData));

		// 使用最小二乘法计算x和y数据集的线性回归参数
		let computeResult = calculateLeastSquares(x, y);

		// 确定x和y数据集中较小的bit值，用于后续的标准化处理
		let bit = xbit > ybit ? ybit : xbit;

		// 根据较小的bit值，对斜率进行标准化处理
		computeResult.slope = standardByBit(String(computeResult.slope), bit);

		// 计算并获取斜率乘以平均x值的level值
		let xLevel = getLevel(
			standardByBit(String(computeResult.slope * computeResult.xAvg), bit)
		);

		// 确定x和y数据集中较大的level值，用于截距的标准化处理
		let interceptLevel = xLevel > yLevel ? xLevel : yLevel;

		// 根据较大的level值，对截距进行标准化处理
		computeResult.intercept = standardByLevel(
			String(computeResult.intercept),
			interceptLevel
		);

		// 对决定系数进行特定格式的计算
		computeResult.rSquared = calc(String(computeResult.rSquared) + "|=6");

		// 返回计算出的线性回归参数
		return computeResult;
	}

	/**
	 * 评估两个数据集的平方关系
	 * 该函数通过二次最小二乘法计算两个数据集之间的关系，并标准化结果
	 * @param {Array} xDataSet - X轴数据集，包含rawData和bit属性
	 * @param {Array} yDataSet - Y轴数据集，包含rawData、bit和level属性
	 * @returns {Object} 计算得到的二次最小二乘法结果，包括a、b、c系数和R平方值
	 */
	function evaluateSquare(xDataSet, yDataSet) {
		// 初始化X轴和Y轴的最大bit值为-70，Y轴的最小level值为-70
		let xbit = -70;
		let ybit = -70;
		let yLevel = -70;

		// 找出X轴数据集中的最大bit值
		xDataSet.forEach((item) => {
			xbit = xbit > item.bit ? xbit : item.bit;
		});

		// 将X轴数据集的rawData转换为数字数组
		let x = xDataSet.map((object) => Number(object.rawData));

		// 找出Y轴数据集中的最大bit值和最小level值
		yDataSet.forEach((item) => {
			ybit = ybit > item.bit ? ybit : item.bit;
			yLevel = yLevel < item.level ? item.level : yLevel;
		});

		// 将Y轴数据集的rawData转换为数字数组
		let y = yDataSet.map((object) => Number(object.rawData));

		// 计算二次最小二乘法
		let computeResult = calculateQuadraticLeastSquares(x, y);

		// 选择X轴和Y轴中的最小bit值
		let bit = xbit > ybit ? ybit : xbit;

		// 标准化二次最小二乘法的a和b系数
		computeResult.a = standardByBit(String(computeResult.a), bit);
		computeResult.b = standardByBit(String(computeResult.b), bit);

		// 计算并获取xLevel，用于后续确定c系数的level
		let xLevel = getLevel(
			standardByBit(
				String(
					computeResult.a * computeResult.xAvg * computeResult.xAvg +
						computeResult.b * computeResult.xAvg
				),
				bit
			)
		);

		// 选择xLevel和yLevel中的最大值作为cLevel
		let cLevel = xLevel > yLevel ? xLevel : yLevel;

		// 根据cLevel标准化二次最小二乘法的c系数
		computeResult.c = standardByLevel(String(computeResult.c), cLevel);

		// 计算并格式化R平方值
		computeResult.rSquared = calc(String(computeResult.rSquared) + "|=6");

		// 返回计算结果
		return computeResult;
	}

	return {
		state,
		userConfig,
		Delete,
		Add,
		Select,
		refreshDataDetails,
		editIndirectData,
		analysisChange,
		evaluateLine,
		evaluateSquare,
		errorMode,
		rely,
	};
});
