import {defineStore} from 'pinia'
import {ref} from 'vue'
import {calc} from 'a-calc'

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
    errorMode
} from '../vaculater'

//Don't import { ElMessage } from 'element-plus'

function initState(){
    return{
        dataList:[],
        tableList:[],
        graphList:[],
        tableDataList:[],
        selectedDataIndex : -1,
        selectedTableIndex: -1,
        selectedGraphIndex: -1,
        selectedDisplayIndex: -1,
        isReadme:true,
        isNumberDoc:false,
        isUncerDoc:false,
        isPropertyDoc:false,
        counter:0,
    }
}
// 初始状态


export const useAllDataStore = defineStore('allData',()=>{
    const state = ref(initState())
    const userConfig = ref({
        autoSaveFile: true,
        language: 'chinese'
    })
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
    function deleteData(index, displayIndex){
        state.value.dataList.splice(index,1)
        if(state.value.selectedDisplayIndex >= displayIndex){
            state.value.selectedDisplayIndex--
        }
    }
    function deleteTable(index, displayIndex){
        state.value.tableList.splice(index, 1)
        state.value.tableDataList.splice(index, 1)
        if(state.value.selectedDisplayIndex >= displayIndex){
            state.value.selectedDisplayIndex--
        }
    }
    function deleteGraph(index, displayIndex){
        state.value.graphList.splice(index, 1)
        if(state.value.selectedDisplayIndex >= displayIndex){
            state.value.selectedDisplayIndex--
        }
    }
    function addData(flag){
        if(flag){
            state.value.dataList.push({
                id:state.value.counter,
                dataSet:[],
                named:false,
                theoData:'',
                analysis:{
                    avg:{
                        propertyName:'平均值',
                        propertyValue:''
                    },
                    relAvgDev: {
                        propertyName:'相对平均偏差',
                        propertyValue:''
                    },
                    stdDev: {
                        propertyName:'标准偏差',
                        propertyValue:''
                    },
                    relStdDev: {
                        propertyName:'相对标准偏差',
                        propertyValue:''
                    },
                    aUncer: {
                        propertyName:'A类不确定度',
                        propertyValue:'0'
                    }
                },
                type:'direct',
                moreUncer:{
                    equipUncer:'',
                    bUncer:'',
                    wholeUncer:''
                },
                unit:'',
                levelRule: 'unified',
                doc:''
            })
        }
        else{
            state.value.dataList.push({
                id:state.value.counter,
                dataSet:[],
                named:false,
                theoData:'',
                analysis:{
                    avg:{
                        propertyName:'平均值',
                        propertyValue:'0'
                    },
                    relAvgDev:{
                        propertyName:'相对平均偏差',
                        propertyValue:'0'
                    },
                    stdDev:{
                        propertyName:'标准偏差',
                        propertyValue:'0'
                    },
                    relStdDev:{
                        propertyName:'相对标准偏差',
                        propertyValue:'0'
                    },
                },
                type:'indirect',
                computeMethod:'',
                computeOption:'forAll',
                moreUncer:{
                    wholeUncer:''
                },
                unit:'',
                dataMethod:false,
                doc:''
            })
        }
        state.value.selectedDataIndex = state.value.dataList.length - 1
        state.value.counter++
    }
    function addTable(){
        state.value.tableList.push({
            tableContent:'',
            tableTitleContent:'',
            tableFramed:false,
            dataValue1:[],
            dataValueN:[],
            // tableDataList:[],
        })
        state.value.tableDataList.push([])
        state.value.selectedTableIndex = state.value.tableList.length - 1
    }
    function addGraph(){
        state.value.graphList.push({
            graphFramed:false,
            singleGraphs:[{
                graphData:'',
                graphOption:'line',
                xData:'',
                yData:''
            }],
            graphContent:'',
            graphTitleContent:'',
        })
        state.value.selectedGraphIndex = state.value.graphList.length - 1
    }
    function addSingleGraph(){
        state.value.graphList[state.value.selectedGraphIndex].singleGraphs.push({
            graphData:'',
            graphOption:'line',
            xData:'',
            yData:''
        })
    }
    function deleteSingleGraph(index){
        state.value.graphList[state.value.selectedGraphIndex].singleGraphs.splice(index, 1)
    }
    function refresh(){
        try{
            let selectedList = state.value.dataList[state.value.selectedDataIndex]
            let length = selectedList.dataSet.length
            let selectedDataSet = selectedList.dataSet
            let selectedAnalysis = selectedList.analysis
            let selectedTheoData = selectedList.theoData
            let selectedType = selectedList.type
            function checkInvalidData(rawData){
                if(rawData === ''){
                    ElMessage.error('数据不能为空！如果要删除，尝试点击右边的删除图标。')
                    throw new Error('数据不能为空！如果要删除，尝试点击右边的删除图标。')
                }
                let rawDataNum = Number(rawData)
                if(typeof rawDataNum !== 'number' || isNaN(rawDataNum)){
                    ElMessage.error('无效的数据！是否包含了字母或百分号？')
                    throw new Error('无效的数据！是否包含了字母或百分号？')
                }
            }
            // 检测rawData不合法的错误情况
            function createAnalysis(key, name, value){
                selectedAnalysis[key] = {
                    propertyName: name,
                    propertyValue: value
                }
            }
            // 创造某个analysis
            function initAnalysis(key){
                selectedAnalysis[key].propertyValue = '0'
            }
            // 将某个analysis置0
            function editAnalysis(key, value){
                selectedAnalysis[key].propertyValue = value
            }
            if(selectedType === 'direct' || (selectedType ==='indirect' && selectedList.computeOption === 'forAll')){
                let dataMaxLevel = -100
                let dataMinLevel = 100
                let sum =  '0'
                if(length !== 0){
                    selectedDataSet.forEach(item => {
                        checkInvalidData(item.rawData)
                        sum = calc(`(${sum}) + (${item.rawData})`)
                        let tmpLevel = getLevel(item.rawData)
                        dataMaxLevel = Math.max(dataMaxLevel, tmpLevel)
                        dataMinLevel = Math.min(dataMinLevel, tmpLevel)
                    })
                    // 取最大level和最小level

                    if(selectedType === 'direct'){
                        if(selectedList.levelRule === 'unified'){
                            selectedDataSet.forEach(item => {
                                item.rawData = standardByLevel(item.rawData, dataMinLevel)
                                item.bit = getBit(item.rawData)
                                item.level = dataMinLevel
                            })
                        }
                        else if(selectedList.levelRule === 'nonUnified'){
                            selectedDataSet.forEach(item => {
                                item.bit = getBit(item.rawData)
                                item.level = getLevel(item.rawData)
                            })
                        }
                        else if(selectedList.levelRule === 'precise'){
                            selectedDataSet.forEach(item => {
                                item.bit = 100
                                item.level = -100
                            })
                        }
                    }
                    // 规范化direct数据

                    let avgValue = String(Number(sum) / length)
                    // calc在对小数除以相对大的数字的时候会有精度问题，需要避免

                    if(selectedType === 'direct'){
                        editAnalysis('avg', standardByLevel(avgValue, dataMinLevel))
                    }
                    else{
                        editAnalysis('avg', standardByLevel(avgValue, dataMaxLevel))
                    }
                    // 将均值依照level赋值

                    let relErrSum = '0'
                    if(selectedTheoData !== ''){
                        // 当理论值不为空时，处理相关数据
                        checkInvalidData(selectedTheoData)
                        if(selectedTheoData === '0'){
                            ElMessage.warning('理论值为 0，不计算相对误差、平均相对误差与平均值与理论值的相对误差！')
                            createAnalysis('relErr', '相对误差', '0')
                            createAnalysis('avgRelErr', '平均相对误差', '0')
                            createAnalysis('avgOverallRelErr', '平均值与理论值的相对误差', '0')
                        }
                        else{
                            selectedDataSet.forEach(item => {
                                let tmpRelErr = String(Number(calc(`${item.rawData} - ${selectedTheoData}`)) / Number(selectedTheoData))
                                tmpRelErr = toPositive(tmpRelErr)
                                relErrSum = calc(`(${relErrSum}) + (${tmpRelErr})`)
                                tmpRelErr = toPercent(errorMode(tmpRelErr))
                                item.relErr = tmpRelErr
                            })
                            // 添加相对误差
                            let tmpAvgRelErr = String(Number(relErrSum) / length)
                            tmpAvgRelErr = toPercent(errorMode(tmpAvgRelErr))
                            createAnalysis('avgRelErr', '平均相对误差', tmpAvgRelErr)
                            // 添加平均相对误差
                            let tmpOverallRelErr = String(Number(calc(`${avgValue} - ${selectedTheoData}`)) / Number(selectedTheoData))
                            tmpOverallRelErr = toPositive(tmpOverallRelErr)
                            tmpOverallRelErr = toPercent(errorMode(tmpOverallRelErr))
                            createAnalysis('avgOverallRelErr', '平均值与理论值的相对误差', tmpOverallRelErr)
                            // 添加平均值与理论值的相对误差
                        }
                    }
                    else{
                        delete selectedAnalysis['avgRelErr']
                        delete selectedAnalysis['avgOverallRelErr']
                    }
                    // 处理理论值相关

                    let devSum = '0'
                    let devSquareSum = '0'
                    selectedDataSet.forEach(item => {
                        let tmpDev = toPositive(calc(`(${item.rawData}) - (${avgValue})`))
                        devSum = calc(`(${devSum}) + (${tmpDev})`)
                        devSquareSum = calc(`(${devSquareSum}) + (${tmpDev}) * (${tmpDev})`)
                    })
                    // 计算偏差的和、平方偏差的和

                    if(avgValue === '0'){
                        ElMessage.warning('平均值为 0，不计算相对平均偏差！')
                        initAnalysis('relAvgDev')
                    }
                    else{
                        let tmpRelAvgDev = toPositive(String(Number(devSum) / length / Number(avgValue)))
                        tmpRelAvgDev = toPercent(errorMode(tmpRelAvgDev))
                        editAnalysis('relAvgDev', tmpRelAvgDev)
                    }
                    // 计算相对平均偏差

                    if(length > 1){
                        let tmpStdDev = String(Math.sqrt(Number(devSquareSum) / (length - 1)))

                        editAnalysis('stdDev', errorMode(tmpStdDev))
                        if(avgValue === '0'){
                            ElMessage.warning('平均值为 0，不计算相对标准偏差！')
                            initAnalysis('relStdDev')
                        }
                        else{
                            let tmpRelStdDev = toPositive(String(Number(tmpStdDev) / Number(avgValue)))
                            tmpRelStdDev = toPercent(errorMode(tmpRelStdDev))
                            editAnalysis('relStdDev', tmpRelStdDev)
                        }
                        if(selectedType === 'direct'){
                            let tmpAUncer = String(Number(tmpStdDev) / Math.sqrt(length))
                            editAnalysis('aUncer', errorMode(tmpAUncer))
                        }
                        else{
                            delete selectedAnalysis['aUncer']
                        }
                    }
                    else{
                        initAnalysis('stdDev')
                        initAnalysis('relStdDev')
                        if(selectedType === 'direct'){
                            initAnalysis('aUncer')
                        }
                        else{
                            delete selectedAnalysis['aUncer']
                        }
                    }
                    // 计算标准偏差，相对标准偏差和A类不确定度

                    if(selectedType === 'direct'){
                        let selectedUncers = selectedList.moreUncer
                        if(selectedUncers.equipUncer){
                            checkInvalidData(selectedUncers.equipUncer)
                            let tmpBUncer =  String(Number(selectedUncers.equipUncer) / Math.sqrt(3))
                            selectedUncers.bUncer = errorMode(tmpBUncer)
                        }
                        else{
                            delete selectedUncers.bUncer
                        }
                        // 解决B类不确定度
                        if(selectedUncers.bUncer){
                            let tmpWholeUncer = dimensionalAdd(selectedAnalysis['aUncer'].propertyValue, selectedUncers.bUncer)
                            selectedUncers.wholeUncer = errorMode(tmpWholeUncer)
                        }
                        else{
                            selectedUncers.wholeUncer = selectedAnalysis['aUncer'].propertyValue
                        }
                        // 解决总不确定度
                    }
                    // 计算direct数据的不确定度
                }
                // 长度不为0情况
                else{
                    initAnalysis('avg')
                    initAnalysis('relAvgDev')
                    initAnalysis('stdDev')
                    initAnalysis('relStdDev')
                    if(selectedType === 'direct'){
                        initAnalysis('aUncer')
                        if(selectedList.moreUncer.equipUncer){
                            checkInvalidData(selectedList.moreUncer.equipUncer)
                            let tmpBUncer = String(Number(selectedList.moreUncer.equipUncer) / Math.sqrt(3))
                            selectedList.moreUncer.bUncer = errorMode(tmpBUncer)
                            selectedList.moreUncer.wholeUncer = selectedList.moreUncer.bUncer
                        }
                    }
                    delete selectedAnalysis['relErr']
                    delete selectedAnalysis['avgRelErr']
                    delete selectedAnalysis['avgOverallRelErr']
                }
                // 长度为0情况
            }
            // 多数据情况
            else if(selectedType === 'indirect' && selectedList.computeOption === 'forAvg'){
                createAnalysis('avg', '实验值', selectedDataSet[0].rawData)
                if(selectedTheoData !== ''){
                    checkInvalidData(selectedTheoData)
                    let tmpRelErr = String(Number(calc(`(${selectedDataSet[0].rawData}) - (${selectedTheoData}) `)) / Number(selectedTheoData))
                    tmpRelErr = toPositive(tmpRelErr)
                    tmpRelErr = toPercent(errorMode(tmpRelErr))
                    createAnalysis('relErr', '相对误差', tmpRelErr)
                    selectedDataSet[0].relErr = tmpRelErr
                }
                else{
                    delete selectedAnalysis['relErr']
                    delete selectedDataSet[0].relErr
                }
            }
            // 单数据情况
            if(selectedType === 'indirect'){
                ElMessage.success('刷新成功！')
            }
        }
        catch(error){
            ElMessage.error('在刷新时出错！')
            console.error('Error during refresh', error)
        }
    }
    // 刷新当前选中数据
    function editIndirectData(){
        let selectedList = state.value.dataList[state.value.selectedDataIndex]
        if(selectedList.computeMethod === ''){
            ElMessage.warning('还未填写算式！')
            return
        }
        let resultDataSet
        if(selectedList.computeOption === 'forAll'){
            resultDataSet = evaluateExpression(state.value.dataList , selectedList.computeMethod, 'forAll', selectedList.title)
            // 数值计算
        }
        else if(selectedList.computeOption === 'forAvg'){
            resultDataSet = evaluateExpression(state.value.dataList , selectedList.computeMethod, 'forAvg', selectedList.title)
            // 数值计算
        }
        selectedList.dataSet = resultDataSet
        selectedList.moreUncer.wholeUncer = evaluateUncer(state.value.dataList, selectedList.computeMethod)
        refresh()
    }
    function analysisChange(){
        let selectedList = state.value.dataList[state.value.selectedDataIndex]
        if(selectedList.computeOption === 'forAll'){
            selectedList.analysis = {
                avg:{
                    propertyName:'平均值',
                    propertyValue:'0'
                },
                relAvgDev:{
                    propertyName:'相对平均偏差',
                    propertyValue:'0'
                },
                stdDev:{
                    propertyName:'标准偏差',
                    propertyValue:'0'
                },
                relStdDev:{
                    propertyName:'相对标准偏差',
                    propertyValue:'0'
                },
            }
        }
        else{
            selectedList.analysis = {
                avg: {
                    propertyName:'实验值',
                    propertyValue:'0'
                }
            }
        }
    }
    function evaluateLine(xDataSet, yDataSet){
        let xbit = -100
        let ybit = -100
        let yLevel = -100
        xDataSet.forEach(item =>{
            xbit = xbit > item.bit ? xbit : item.bit
        })
        let x= xDataSet.map(object => Number(object.rawData))
        yDataSet.forEach(item =>{
            ybit = ybit > item.bit ? ybit : item.bit
            yLevel = yLevel < item.level ? item.level : yLevel
        })
        let y = yDataSet.map(object => Number(object.rawData))
        let computeResult = calculateLeastSquares(x,y)
        let bit = xbit > ybit? ybit:xbit
        computeResult.slope = standardByBit(String(computeResult.slope),bit)
        let xLevel = getLevel(standardByBit(String(computeResult.slope * computeResult.xAvg),bit))
        let interceptLevel = xLevel > yLevel ? xLevel : yLevel
        computeResult.intercept = standardByLevel(String(computeResult.intercept),interceptLevel)
        computeResult.rSquared = calc(String(computeResult.rSquared)+'|=6')
        return computeResult
    }
    function evaluateSquare(xDataSet, yDataSet){
        let xbit = -100
        let ybit = -100
        let yLevel = -100
        xDataSet.forEach(item =>{
            xbit = xbit > item.bit ? xbit : item.bit
        })
        let x= xDataSet.map(object => Number(object.rawData))
        yDataSet.forEach(item =>{
            ybit = ybit > item.bit ? ybit : item.bit
            yLevel = yLevel < item.level ? item.level : yLevel
        })
        let y = yDataSet.map(object => Number(object.rawData))
        let computeResult = calculateQuadraticLeastSquares(x,y)
        let bit = xbit > ybit? ybit : xbit
        computeResult.a = standardByBit(String(computeResult.a),bit)
        computeResult.b = standardByBit(String(computeResult.b),bit)
        let xLevel = getLevel(standardByBit(String(computeResult.a * computeResult.xAvg * computeResult.xAvg + computeResult.b * computeResult.xAvg),bit))
        let cLevel = xLevel > yLevel ? xLevel : yLevel
        computeResult.c = standardByLevel(String(computeResult.c),cLevel)
        computeResult.rSquared = calc(String(computeResult.rSquared)+'|=6')
        return computeResult
    }

    return{
        state,
        deleteData,
        deleteTable,
        deleteGraph,
        addData,
        addTable,
        addGraph,
        addSingleGraph,
        deleteSingleGraph,
        refresh,
        editIndirectData,
        analysisChange,
        evaluateLine,
        evaluateSquare,
        errorMode,
        userConfig,
        rely
    }
})