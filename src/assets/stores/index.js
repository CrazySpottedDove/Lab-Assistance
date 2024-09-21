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
        selectedDataIndex : -1,
        selectedTableIndex: -1,
        selectedGraphIndex: -1,
        isReadme:true,
        isNumberDoc:false,
        isUncerDoc:false,
        isPropertyDoc:false,
    }
}
// 初始状态


export const useAllDataStore = defineStore('allData',()=>{
    const state = ref(initState())
    function deleteData(index){
        state.value.dataList.splice(index,1)
        if(state.value.selectedDataIndex >= index){
            state.value.selectedDataIndex--
        }
    }
    function deleteTable(index){
        state.value.tableList.splice(index, 1)
        if(state.value.selectedTableIndex >= index){
            state.value.selectedTableIndex--
        }
    }
    function deleteGraph(index){
        state.value.graphList.splice(index, 1)
        if(state.value.selectedGraphIndex >= index){
            state.value.selectedGraphIndex--
        }
    }
    function addData(flag){
        if(flag){
            state.value.dataList.push({
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
                levelRule: false,
                doc:''
            })
        }
        else{
            state.value.dataList.push({
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
    }
    function addTable(){
        state.value.tableList.push({
            centerContent:'',
            headContent:'',
            commentContent:'',
            tableContent:'',
            tableTitleContent:'',
            tableFramed:false,
            dataValue1:[],
            dataValueN:[],
            dataValuesSource:[],
        })
        state.value.selectedTableIndex = state.value.tableList.length - 1
    }
    function addGraph(){
        state.value.graphList.push({
            graphData:'',
            graphFramed:false,
            graphOption:'line',
            graphContent:'',
            graphTitleContent:'',
            xData:'',
            yData:'',
        })
        state.value.selectedGraphIndex = state.value.graphList.length - 1
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
                        if(selectedList.levelRule === false){
                            selectedDataSet.forEach(item => {
                                item.rawData = standardByLevel(item.rawData, dataMinLevel)
                                item.bit = getBit(item.rawData)
                                item.level = dataMinLevel
                            })
                        }
                        else{
                            selectedDataSet.forEach(item => {
                                item.bit = getBit(item.rawData)
                                item.level = getLevel(item.rawData)
                            })
                        }
                    }
                    // 规范化direct数据

                    let avgValue = calc(`(${sum}) / (${length})`)
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
                                let tmpRelErr = calc(`((${item.rawData}) - (${selectedTheoData})) / (${selectedTheoData})`)
                                tmpRelErr = toPositive(tmpRelErr)
                                relErrSum = calc(`(${relErrSum}) + (${tmpRelErr})`)
                                tmpRelErr = toPercent(errorMode(tmpRelErr))
                                item.relErr = tmpRelErr
                            })
                            // 添加相对误差
                            let tmpAvgRelErr = calc(`(${relErrSum}) / ${String(length)}`)
                            tmpAvgRelErr = toPercent(errorMode(tmpAvgRelErr))
                            createAnalysis('avgRelErr', '平均相对误差', tmpAvgRelErr)
                            // 添加平均相对误差
                            let tmpOverallRelErr = calc(`((${avgValue}) - (${selectedTheoData})) / (${selectedTheoData})`)
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
                        let tmpRelAvgDev = toPositive(calc(`(${devSum}) / (${String(length)}) / (${avgValue})`))
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
                            let tmpRelStdDev = toPositive(calc(`(${tmpStdDev}) / (${avgValue})`))
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
                            let tmpBUncer = calc(`(${selectedUncers.equipUncer}) / (${String(Math.sqrt(3))})`)
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
                            let tmpBUncer = calc(`(${selectedList.moreUncer.equipUncer}) / (${String(Math.sqrt(3))})`)
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
                    let tmpRelErr = calc(`((${selectedDataSet[0].rawData}) - (${selectedTheoData})) / (${selectedTheoData})`)
                    tmpRelErr = toPositive(tmpRelErr)
                    tmpRelErr = toPercent(errorMode(tmpRelErr))
                    createAnalysis('relErr', '相对误差', tmpRelErr)
                }
                else{
                    delete selectedAnalysis['relErr']
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
        refresh,
        editIndirectData,
        analysisChange,
        evaluateLine,
        evaluateSquare,
        errorMode,
    }
})