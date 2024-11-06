<script setup>
import { useAllDataStore } from '../assets/stores';
import { computed, watch, ref } from 'vue';
import { titleFormat, dataFormat, unitFormat, commentFormat, docFormat } from '../assets/format';
import { DocumentCopy } from '@element-plus/icons-vue';
import { highlightKeywords} from '../assets/highlight';
// 基本参数
const store = useAllDataStore()
const viewType = computed(() => store.state.view.type)
const viewIndex = computed(() => store.state.view.index)
const dataList = computed(() => [...store.state.directDataList, ...store.state.indirectDataList])
const tableDataList = computed(() => store.state.tableDataList)
const selectedTable = computed(() => viewType.value === 'table' && viewIndex.value >=0 ? store.state.tableList[viewIndex.value] : {})
const selectedTableData = computed(() => viewType.value === 'table' && viewIndex.value >= 0 ? store.state.tableDataList[viewIndex.value] : null)

const tableNO = computed(() => {
    return store.userConfig.language === 'chinese' ? '编号' : 'No.'
})

// 表格取数据的设置参数
const props = {
    multiple: true,
    checkStrictly: true,
    emitPath: false, // 如果只希望返回最后一级选项的值
    label: 'label',
    value: 'value',
}

// 制表时的选择项，与dataList一致
const dataOptions = ref([])

function getSourceById(id) {
    return dataList.value.find(data => data.id === id)
}

// 根据dataList变化，调整dataOptions
watch(dataList, () => {
    function updateDataOptions() {
        /** 检测当前的dataOption中是否存在某个id的data*/
        function dataOptionPosition(id) {
            let i
            for (i = 0; i < dataOptions.value.length; i++) {
                if (dataOptions.value[i].id === id) {
                    return i
                }
            }
            return -1
        }

        /** 生成一个child*/
        function child(label, id) {
            return {
                label: label,
                value: {
                    id: id,
                    subtitle: label
                }
            }
        }

        /** 依据source-id生成应有的labelList*/
        function generateLabelList(id) {
            let source = getSourceById(id)
            let labelList = []
            if (source.theoData) {
                labelList.push('理论值')
                labelList.push('相对误差')
                if (source.type === 'direct' || (source.type === 'indirect' && source.computeOption === 'forAll')) {
                    labelList.push('平均相对误差')
                    labelList.push('平均值与理论值的相对误差')
                }
            }
            if (source.type === 'direct' || (source.type === 'indirect' && source.computeOption === 'forAll')) {
                labelList.push('平均值')
                labelList.push('相对平均偏差')
                labelList.push('标准偏差')
                labelList.push('相对标准偏差')
                if (source.type === 'direct') {
                    labelList.push('A类不确定度')
                }
            }
            else if (source.type === 'indirect' && source.computeOption === 'forAvg') {
                labelList.push('实验值')
            }
            if (source.moreUncer.bUncer) {
                labelList.push('仪器允差')
                labelList.push('B类不确定度')
            }
            labelList.push('不确定度')
            return labelList
        }

        /** 添加所有labelList中有的,children中没有的元素*/
        function addValidChild(labelList, children, id) {
            labelList.forEach(label => {
                let isExist = false
                for (let i = 0; i < children.length; i++) {
                    if (children[i].label === label) {
                        isExist = true
                        break
                    }
                }
                if (!isExist) {
                    children.push(child(label, id))
                }
            })
        }

        /**删除所有labelList中没有的，children中有的元素 */
        function deleteInvalidChild(labelList, children) {
            let len = children.length
            for (let i = 0; i < len;) {
                let isExist = false
                for (let j = 0; j < labelList.length; j++) {
                    if (labelList[j] === children[i].label) {
                        isExist = true
                        break
                    }
                }
                if (!isExist) {
                    children.splice(i, 1)
                    len--
                }
                else {
                    i++
                }
            }
        }

        /** 生成一个原始的dataOption，只包含id和subtitle*/
        function generateDataOption(item) {
            let result = {}
            result.value = { id: item.id }
            result.label = item.title
            result.id = item.id
            result.children = []
            let labelList = generateLabelList(item.id)
            addValidChild(labelList, result.children, item.id)
            return result
        }

        /**更新某个dataOption */
        function updateDataOption(index) {
            let target = dataOptions.value[index]
            let id = target.value.id
            let source = getSourceById(id)
            let children = target.children
            target.label = source.title
            let labelList = generateLabelList(id)
            deleteInvalidChild(labelList, children)
            addValidChild(labelList, children, id)
        }

        /**检查dataList中有没有特定id的数据 */
        function dataOfIdExists(id) {
            for (let i = 0; i < dataList.value.length; i++) {
                if (dataList.value[i].id === id) {
                    return true
                }
            }
            return false
        }

        // 将dataOption中不存在的部分添加，存在的部分更新
        dataList.value.forEach(item => {
            let index = dataOptionPosition(item.id)
            if (index === -1) {
                dataOptions.value.push(generateDataOption(item))
            }
            else {
                updateDataOption(index)
            }
        })

        // 删除dataList中不存在的对应option
        let len = dataOptions.value.length
        for (let i = 0; i < len;) {
            if (!dataOfIdExists(dataOptions.value[i].id)) {
                // 在tableDataList中去除
                tableDataList.value.forEach((tableData, index) => {
                    // 对每一个 tableData 重新赋值，过滤掉不需要的元素
                    tableDataList.value[index] = tableData.filter(singleTableData => singleTableData.id !== dataOptions.value[i].id);
                });

                dataOptions.value.splice(i, 1)
                len--
            }
            else {
                i++
            }
        }
    }
    updateDataOptions()
    if(viewType.value === 'table' && viewIndex.value >= 0){
        updateCurrentTable()
    }
}, { deep: true })

// 将粗略的tableDataList信息处理，成为可以直接用于绘表的数据
function processTableDataList(tableDataList) {
    // 处理可能多行数据的格式
    function processDataFmt(id, dataSource, title) {
        let source = getSourceById(id)
        let fmtData = []
        let len = source.dataSet.length
        let dataLength = len
        function draftFmtData(head, tail, index) {
            fmtData[index] = ''
            for (let i = head; i < tail; i++) {
                fmtData[index] += `$ ${dataFormat(dataSource[i])} $`
                if (i !== tail - 1) {
                    fmtData[index] += ' & '
                }
            }
        }
        let i
        for (i = 1; i <= 7; i++) {
            if (len % i === 0 && len / i <= 10) {
                for (let j = 0; j < i; j++) {
                    draftFmtData(j * len / i, (j + 1) * len / i, j)
                }
                dataLength = len / i
                break
            }
        }
        if (i === 8) {
            draftFmtData(0, len, 0)
        }
        let center = []
        for (let i = 0; i < fmtData.length; i++) {
            center[i] = `${title} & ${fmtData[i]}`
        }
        return {
            center: center,
            dataLength: dataLength,
            dataHeight: fmtData.length
        }
    }

    // 处理数据行
    function processData(data) {
        let source = getSourceById(data.id)
        let processed = {}
        let title = `$ ${titleFormat(source.title)} ${docFormat(source.doc)} ${unitFormat(source.unit)} $`
        let tmp = processDataFmt(data.id, source.dataSet.map(data => data.rawData), title)
        processed.center = tmp.center
        processed.dataLength = tmp.dataLength
        processed.dataHeight = tmp.dataHeight

        if (source.computeMethod) {
            processed.comment = `$ \\displaystyle ${titleFormat(source.title)} = ${commentFormat(source.computeMethod, dataList.value)} $\\qquad `
        }

        return processed
    }

    // 处理性质行
    function processProperty(property) {
        function propertyMap(subtitle, source) {
            let fmtUnit = unitFormat(source.unit)
            let fmtDoc = docFormat(source.doc)
            let fmtTitle = titleFormat(source.title)
            let fmtData
            switch (subtitle) {
                case '平均值':
                    fmtData = dataFormat(source.analysis['avg'].propertyValue)
                    break
                case '相对平均偏差':
                    fmtData = dataFormat(source.analysis['relAvgDev'].propertyValue)
                    break
                case '标准偏差':
                    fmtData = dataFormat(source.analysis['stdDev'].propertyValue)
                    break
                case '相对标准偏差':
                    fmtData = dataFormat(source.analysis['relStdDev'].propertyValue)
                    break
                case 'A类不确定度':
                    fmtData = dataFormat(source.analysis['aUncer'].propertyValue)
                    break
                case '仪器允差':
                    fmtData = dataFormat(source.moreUncer.equipUncer)
                    break
                case 'B类不确定度':
                    fmtData = dataFormat(source.moreUncer.bUncer)
                    break
                case '不确定度':
                    fmtData = dataFormat(source.moreUncer.wholeUncer)
                    break
                case '平均相对误差':
                    fmtData = dataFormat(source.analysis['avgRelErr'].propertyValue)
                    break
                case '平均值与理论值的相对误差':
                    fmtData = dataFormat(source.analysis['avgOverallRelErr'].propertyValue)
                    break
                case '理论值':
                    fmtData = dataFormat(source.theoData)
                    break
                default:
                    break
            }
            switch (subtitle) {
                case '平均值':
                    return {
                        center: `$ \\overline{${fmtTitle}} ${fmtDoc} ${fmtUnit} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case '相对平均偏差':
                    return {
                        center: `$ \\overline{\\delta}_{r,${fmtTitle}} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case '标准偏差':
                    return {
                        center: `$ s_{${fmtTitle}} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case '相对标准偏差':
                    return {
                        center: `$ s_{r,${fmtTitle}} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case 'A类不确定度':
                    return {
                        center: `$ u_{A,${fmtTitle}} ${fmtUnit} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case 'B类不确定度':
                    return {
                        center: `$ u_{B,${fmtTitle}} ${fmtUnit} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case '仪器允差':
                    return {
                        center: `$ \\Delta_{\\text{仪},${fmtTitle}} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case '不确定度':
                    return {
                        center: `$ u_{${fmtTitle}} ${fmtUnit} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case '平均相对误差':
                    return {
                        center: `$ \\overline{\\varepsilon}_{r,${fmtTitle}} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case '平均值与理论值的相对误差':
                    return {
                        center: `$ \\Delta_{r,${fmtTitle}} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case '理论值':
                    return {
                        center: `$ {${fmtTitle}}_{\\text{theory}} ${fmtDoc} ${fmtUnit} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case '相对误差':
                    let title = `$ \\varepsilon_{r,${fmtTitle}} $`
                    let tmp = processDataFmt(source.id, source.dataSet.map(data => data.relErr), title)
                    return {
                        center: tmp.center,
                        dataLength: tmp.dataLength,
                        dataHeight: tmp.dataHeight
                    }
                default:
                    return;
            }
        }
        let source = getSourceById(property.id)
        let subtitle = property.subtitle
        return propertyMap(subtitle, source)
    }

    let processedTableDataList = []
    tableDataList.forEach(tableData => {
        if (tableData.subtitle) {
            processedTableDataList.push(processProperty(tableData))
        }
        else {
            processedTableDataList.push(processData(tableData))
        }
    })
    return processedTableDataList
}

// 更新当前表格
function updateCurrentTable() {
    let processedTableDataList = processTableDataList(selectedTableData.value)
    let tableFramed = selectedTable.value.tableFramed
    function updateDataValue1() {
        let tmp = []
        if (processedTableDataList && processedTableDataList.length) {
            processedTableDataList.forEach(item => {
                if (item.dataLength === 1) {
                    tmp.push(item)
                }
            })
        }
        selectedTable.value.dataValue1 = tmp
    }
    function updateDataValueN() {
        let tmp = []
        if (processedTableDataList && processedTableDataList.length) {
            processedTableDataList.forEach(item => {
                if (item.dataLength !== 1) {
                    tmp.push(item)
                }
            })
        }
        selectedTable.value.dataValueN = tmp
    }

    let centerContent = ''
    function updateCenterContent() {
        let center = ''
        let len1 = selectedTable.value.dataValue1.length
        let lenN = selectedTable.value.dataValueN.length
        if (lenN) {
            try {
                let maxLen = selectedTable.value.dataValueN.reduce((max, data) => {
                    if (max === data.dataLength || (max > data.dataLength && data.dataLength === 1)) {
                        return max
                    }
                    else if (max === 1) {
                        return data.dataLength
                    }
                    else {
                        ElMessage.error('数组的长度不一致！')
                        throw new Error('数组的长度不一致！')
                    }
                }, selectedTable.value.dataValueN[0].dataLength)
                let maxHeight = selectedTable.value.dataValueN.reduce((max, data) => {
                    if (max === data.dataHeight || (max > data.dataHeight && data.dataHeight === 1)) {
                        return max
                    }
                    else if (max === 1) {
                        return data.dataHeight
                    }
                    else {
                        ElMessage.error('数组的长度不一致！')
                        throw new Error('数组的长度不一致！')
                    }
                }, selectedTable.value.dataValueN[0].dataHeight)
                function draftCenterNumber(length, index) {
                    center += `${tableNO.value} & `
                    for (let i = index * length + 1; i < (index + 1) * length + 1; i++) {
                        center += `$ ${i} $`
                        if (i !== (index + 1) * length) {
                            center += ' & '
                        }
                    }
                    center += ' \\\\\n\t\t\t'
                }
                for (let i = 0; i < maxHeight; i++) {
                    draftCenterNumber(maxLen, i)
                    if (len1) {
                        for (let j = 0; j < lenN; j++) {
                            center += selectedTable.value.dataValueN[j].center[i]
                            center += ' \\\\\n\t\t\t'
                        }
                    }
                    else {
                        for (let j = 0; j < lenN; j++) {
                            center += selectedTable.value.dataValueN[j].center[i]
                            if (!(j === lenN - 1 && i === maxHeight - 1)) {
                                center += ' \\\\\n\t\t\t'
                            }
                        }
                        if (i === maxHeight - 1) {
                            center += '\n\t\t'
                        }
                    }
                }
            }
            catch (error) {
                ElMessage.error('制表过程中出错！')
                console.error("Error creating table:", error);
            }

        }
        if (len1) {
            for (let i = 0; i < len1; i++) {
                center += selectedTable.value.dataValue1[i].center
                if (i !== len1 - 1) {
                    center += ' \\\\\n\t\t\t'
                }
            }
            center += '\n\t\t'
        }
        centerContent = center
    }

    let headContent = ''
    function updateHeadContent() {
        let head = ''
        let len1 = selectedTable.value.dataValue1.length
        let lenN = 0
        let lenNum = 0
        if (selectedTable.value.dataValueN.length) {
            for (let i = 0; i < selectedTable.value.dataValueN.length; i++) {
                lenN += selectedTable.value.dataValueN[i].center.length
                lenNum = Math.max(lenNum, selectedTable.value.dataValueN[i].center.length)
            }
        }
        if (lenN && len1) {
            head += ',cell{'
            for (let i = lenN + lenNum + 1; i <= lenN + len1 + lenNum; i++) {
                head += `${i}`
                if (i !== lenN + len1 + lenNum) {
                    head += ','
                }
            }
            let maxDataLength = 0
            selectedTable.value.dataValueN.forEach(item => {
                maxDataLength = Math.max(maxDataLength, item.dataLength)
            })
            head += `}{2}={r=1,c=${maxDataLength}}{c}`
        }
        headContent = head
    }

    let commentContent = ''
    function updateCommentContent() {
        let comment = ''
        selectedTable.value.dataValueN.forEach(item => {
            if (item.comment) {
                comment += item.comment
            }
        })
        selectedTable.value.dataValue1.forEach(item => {
            if (item.comment) {
                comment += item.comment
            }
        })
        commentContent = comment
    }

    updateDataValue1()
    updateDataValueN()
    updateHeadContent()
    updateCenterContent()
    updateCommentContent()
    if (tableFramed) {
        selectedTable.value.tableContent = `\\begin{table}[H]\n\t\\framed[${selectedTable.value.tableTitleContent}]{\n\t\t\\begin{tblr}{hlines,vlines,cells={c}` + headContent + '}\n\t\t\t' + centerContent + '\\end{tblr}\n\t}[' + commentContent + ']\n\\end{table}'
    }
    else {
        selectedTable.value.tableContent = `\\begin{table}[H]\n\t\\notframed[${selectedTable.value.tableTitleContent}]{\n\t\t\\begin{tblr}{hlines,vlines,cells={c}` + headContent + '}\n\t\t\t' + centerContent + '\\end{tblr}\n\t}[' + commentContent + ']\n\\end{table}'
    }
}

// 手动刷新表格
const handleTableUpdate = (() => {
    updateCurrentTable()
    ElMessage.success('刷新成功！')
})

// 实时更新选中表格的内容
watch(selectedTableData, () => {
    if (selectedTableData.value !== null) {
        updateCurrentTable()
    }
}, { deep: true })

// 表格选择全部数据
const handleTableSelectAll = () => {
    tableDataList.value[viewIndex.value] = dataOptions.value.map(item => item.value)
    handleTableUpdate()
}

// 表格清除全部数据
const handleTableClearAll = () => {
    tableDataList.value[viewIndex.value] = []
    handleTableUpdate()
}

// 复制表格内容
const handleTableCopy = () => {
    navigator.clipboard.writeText(selectedTable.value.tableContent)
        .then(() => {
            ElMessage.success('表格内容已复制到剪贴板！')
        })
        .catch(err => alert('复制失败: ' + err));
}

// 复制依赖
const handleRelyCopy = () => {
    navigator.clipboard.writeText(store.rely)
        .then(() => {
            ElMessage.success('依赖已复制到剪贴板！')
        })
        .catch(err => alert('复制失败: ' + err));
}


</script>

<template>
    <div v-for="(table, index) of store.state.tableList">
        <div v-show="viewType==='table'&& viewIndex === index">
            <!-- 表格数据，标题，全选，清空，刷新 -->
            <div class="card-div">
                <el-card shadow="hover">
                    <div class="equipment">
                        <label style="font-weight: 550;width: 10%;text-align: center;">表格数据</label>
                        <span style="width: 1%;"></span>
                        <el-cascader :options="dataOptions" :props="props" placeholder="选择数据"
                            v-model="tableDataList[index]" style="width: 38.5%;">
                            <template v-slot:default="{ node, data }">
                                <vue-latex :expression="data.label" style="font-size: small;"></vue-latex>
                            </template>
                            <template #label="label">
                                <vue-latex :expression="label"></vue-latex>
                            </template>
                        </el-cascader>
                        <span style="width: 1%;"></span>
                        <label style="font-weight: 550;width: 10%;text-align: center;">标题</label>
                        <span style="width: 1%;"></span>
                        <input placeholder="标题" v-model="table.tableTitleContent"
                            style="width: 38.5%; text-align: center; " @change="updateCurrentTable">
                    </div>
                    <div class="equipment">
                        <el-button @click="handleTableSelectAll" style="width: 32%;">全选</el-button>
                        <el-button @click="handleTableClearAll" style="width: 32%;">清空</el-button>
                        <el-button @click="handleTableUpdate" style="width: 32%;">刷新</el-button>
                    </div>
                </el-card>
            </div>
            <!-- 带/不带边框，内容代码，依赖 -->
            <div class="card-div">
                <el-card shadow="hover">
                    <div>
                        <div style="text-align: center;">
                            <el-switch v-model="table.tableFramed" size="large" inactive-text="不带边框"
                                active-text="带边框" style="font-size: large;width: 20%;--el-switch-on-color: #626aef;"
                                @change="updateCurrentTable" />
                            <span style="font-weight: bold; font-size: large;"> 内容 </span>
                            <el-icon class="copy el-icon--right" @click="handleTableCopy">
                                <document-copy></document-copy>
                            </el-icon>
                        </div>
                        <pre v-html="highlightKeywords(table.tableContent)"></pre>
                    </div>
                </el-card>
                <br>
                <el-card shadow="hover" style="height: 100px; overflow: auto;">
                    <div>
                        <div style="text-align: center;">
                            <span style="font-weight: bold; font-size: large;"> 依赖 </span>
                            <el-icon class="copy el-icon--right" @click="handleRelyCopy">
                                <document-copy></document-copy>
                            </el-icon>
                        </div>
                        <pre v-html="highlightKeywords(store.rely)"></pre>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import (css) './mainPageStyle.css';
</style>
