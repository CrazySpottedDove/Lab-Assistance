<script setup>
import { computed } from 'vue';
import {useAllDataStore} from '../assets/stores'
import { CircleClose, DocumentCopy } from '@element-plus/icons-vue';
import { titleFormat, dataFormat, unitFormat} from '../assets/format';
// 基础属性
const store = useAllDataStore()
const dataList = computed(() => store.state.dataList)
const graphList = computed(()=>store.state.graphList)
const selectedGraphIndex = computed(()=>store.state.selectedGraphIndex)

const figureLineName = computed(() => {
    return store.userConfig.language === 'chinese' ? '拟合直线' : 'fitting line'
})
const figureCurveName = computed(() => {
    return store.userConfig.language === 'chinese' ? '拟合曲线' : 'fitting curve'
})
const figureDataName = computed(() => {
    return store.userConfig.language === 'chinese' ? '实验数据' : 'raw data'
})

// 绘图选项
const graphOptions = [
    {
        value: 'line',
        label: '线性拟合'
    },
    {
        value: 'square',
        label: '二次拟合'
    },
    {
        value: 'simple',
        label: '折线'
    },
    {
        value: 'smooth',
        label: '曲线'
    }
]

// 复制绘图内容
const handleGraphCopy = () => {
    navigator.clipboard.writeText(graphList.value[selectedGraphIndex.value].graphContent)
        .then(() => {
            ElMessage.success('绘图内容已复制到剪贴板！')
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

// x轴数据选项
const xTitleList = computed(() => {
    let tmp = dataList.value.map(data => ({ value: data.title, label: data.title }))
    tmp.push({ value: '序号', label: '序号' })
    return tmp
})

// y轴数据选项
const yTitleList = computed(() => {
    return dataList.value.map(data => ({ value: data.title, label: data.title }))
})

// 添加单条图线
const handleAddSingleGraph = () => {
    store.addSingleGraph()
}

// 删除单条图线
const handleDeleteSingleGraph = (index) => {
    store.deleteSingleGraph(index)
    handleGraphQuietUpdate()
}

// 静默更新图线
const handleGraphQuietUpdate = () => {
    function getDomain(dataSet) {
        let minData = dataSet.reduce((min, data) => {
            return min < Number(data.rawData) ? min : Number(data.rawData)
        }, Number(dataSet[0].rawData))
        let maxData = dataSet.reduce((max, data) => {
            return max > Number(data.rawData) ? max : Number(data.rawData)
        }, Number(dataSet[0].rawData))
        return `${minData} : ${maxData}`
    }
    // 获取一组数据的最小，最大值
    let xDataSet = []
    let yDataSet = []
    let xUnit = ''
    let yUnit = ''
    let selectedGraph = graphList.value[selectedGraphIndex.value]
    let xstyleContent = ''
    let ystyleContent = ''
    let graphCenterContent = ''
    let graphCommentContent = ''
    let graphs = selectedGraph.singleGraphs
    let graphLength = selectedGraph.singleGraphs.length
    try {
        for (let i = 0; i < graphLength; i++) {
            const yItem = dataList.value.find(item => item.title === selectedGraph.singleGraphs[i].yData)
            if (!yItem) {
                return
            }
            yDataSet = yItem.dataSet
            yUnit = yItem.unit
            if (selectedGraph.singleGraphs[i].xData === '序号') {
                xDataSet = []
                for (let i = 1; i <= yDataSet.length; i++) {
                    xDataSet.push({ rawData: i, bit: 100 })
                }
                xUnit = ''
            }
            else {
                const xItem = dataList.value.find(item => item.title === selectedGraph.singleGraphs[i].xData)
                if (!xItem) {
                    return
                }
                xDataSet = xItem.dataSet
                xUnit = xItem.unit
            }

            if (i === 0) {
                xstyleContent += `${titleFormat(graphs[i].xData)}`
                ystyleContent += `${titleFormat(graphs[i].yData)}`
            }
            else {
                if (xstyleContent.indexOf(titleFormat(graphs[i].xData)) === -1) {
                    xstyleContent += `, ${titleFormat(graphs[i].xData)}`
                }
                if (ystyleContent.indexOf(titleFormat(graphs[i].yData)) === -1) {
                    ystyleContent += `, ${titleFormat(graphs[i].yData)}`
                }
            }
            if (i === graphLength - 1) {
                xstyleContent += ` ${unitFormat(xUnit)}`
                ystyleContent += ` ${unitFormat(yUnit)}`
            }
            // 处理xstyleContent, ystyleContent

            if (xDataSet.length !== yDataSet.length) {
                ElMessage.error('数组长度不一致！')
                throw new Error('数组长度不一致！')
            }
            // 检测

            let datapointContent = ''
            for (let i = 0; i < xDataSet.length; i++) {
                datapointContent += `(${xDataSet[i].rawData} , ${yDataSet[i].rawData}) `
            }
            let xDomain = ''
            switch (graphs[i].graphOption) {
                case 'line':
                    xDomain = getDomain(xDataSet)
                    graphs[i].graphData = store.evaluateLine(xDataSet, yDataSet)
                    if (i !== 0) {
                        graphCenterContent += `\n\t\t\t`
                        if (graphCommentContent !== '') {
                            graphCommentContent += ` \\\\ `
                        }
                    }
                    graphCenterContent += `\\functionline{${xDomain}}{${graphs[i].graphData.slope}*x${graphs[i].graphData.intercept[0] === '-' ? '' : '+'}${graphs[i].graphData.intercept}}[${figureLineName.value}：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]\n\t\t\t\\datapoint[only marks]{${datapointContent}}[${figureDataName.value}：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    graphCommentContent += `$ ${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)} : y=${dataFormat(graphs[i].graphData.slope)}x${graphs[i].graphData.intercept[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.intercept)} \\qquad R^2 = ${dataFormat(graphs[i].graphData.rSquared)} $`
                    break
                case 'square':
                    xDomain = getDomain(xDataSet)
                    graphs[i].graphData = store.evaluateSquare(xDataSet, yDataSet)
                    if (i !== 0) {
                        graphCenterContent += `\n\t\t\t`
                        if (graphCommentContent !== '') {
                            graphCommentContent += ` \\\\ `
                        }
                    }
                    graphCenterContent += `\\functionline{${xDomain}}{${graphs[i].graphData.a}*x*x${graphs[i].graphData.b[0] === '-' ? '' : '+'}${graphs[i].graphData.b}*x${graphs[i].graphData.c[0] === '-' ? '' : '+'}${graphs[i].graphData.c}}[${figureCurveName.value}：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]\n\t\t\t\\datapoint[only marks]{${datapointContent}}[${figureDataName.value}：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    graphCommentContent += `$ ${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)} : y=${dataFormat(graphs[i].graphData.a)}x^2${graphs[i].graphData.b[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.b)}x${graphs[i].graphData.c[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.c)} \\qquad R^2 = ${dataFormat(graphs[i].graphData.rSquared)} $`
                    break
                case 'simple':
                    graphs[i].graphData = ''
                    if (i !== 0) {
                        graphCenterContent += `\n\t\t\t`
                    }
                    graphCenterContent += `\\datapoint{${datapointContent}}[$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    break
                case 'smooth':
                    graphs[i].graphData = ''
                    if (i !== 0) {
                        graphCenterContent += `\n\t\t\t`
                    }
                    graphCenterContent += `\\datapoint[smooth]{${datapointContent}}[$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    break
            }
        }
        if (selectedGraph.graphFramed) {
            selectedGraph.graphContent = `\\begin{figure}[H]\n\t\\framed[${selectedGraph.graphTitleContent}]{\n\t\t\\begin{plot}{\\xstyle{$ ${xstyleContent} $} \\ystyle{$ ${ystyleContent} $}}\n\t\t\t${graphCenterContent}\n\t\t\\end{plot}\n\t}[ ${graphCommentContent}]\n\\end{figure}`
        }
        else {
            selectedGraph.graphContent = `\\begin{figure}[H]\n\t\\notframed[${selectedGraph.graphTitleContent}]{\n\t\t\\begin{plot}{\\xstyle{$ ${xstyleContent} $} \\ystyle{$ ${ystyleContent} $}}\n\t\t\t${graphCenterContent}\n\t\t\\end{plot}\n\t}[ ${graphCommentContent}]\n\\end{figure}`
        }
    }
    catch (error) {
        ElMessage.error('作图失败！')
        console.error('Error during plotting', error)
    }
}

// 更新图线
const handleGraphUpdate = () => {
    function getDomain(dataSet) {
        let minData = dataSet.reduce((min, data) => {
            return min < Number(data.rawData) ? min : Number(data.rawData)
        }, Number(dataSet[0].rawData))
        let maxData = dataSet.reduce((max, data) => {
            return max > Number(data.rawData) ? max : Number(data.rawData)
        }, Number(dataSet[0].rawData))
        return `${minData} : ${maxData}`
    }
    // 获取一组数据的最小，最大值
    let xDataSet = []
    let yDataSet = []
    let xUnit = ''
    let yUnit = ''
    let selectedGraph = graphList.value[selectedGraphIndex.value]
    function initXYDataSetsAndUnits(index) {
        const yItem = dataList.value.find(item => item.title === selectedGraph.singleGraphs[index].yData)
        if (!yItem) {
            ElMessage.error('变量 y 不存在！')
            throw new Error('变量 y 不存在！')
        }
        yDataSet = yItem.dataSet
        yUnit = yItem.unit
        if (selectedGraph.singleGraphs[index].xData === '序号') {
            xDataSet = []
            for (let i = 1; i <= yDataSet.length; i++) {
                xDataSet.push({ rawData: i, bit: 100 })
            }
            xUnit = ''
        }
        else {
            const xItem = dataList.value.find(item => item.title === selectedGraph.singleGraphs[index].xData)
            if (!xItem) {
                ElMessage.error('变量 x 不存在！')
                throw new Error('变量 x 不存在！')
            }
            xDataSet = xItem.dataSet
            xUnit = xItem.unit
        }
    }
    // 初始化作图所需的两个dataSet
    let xstyleContent = ''
    let ystyleContent = ''
    let graphCenterContent = ''
    let graphCommentContent = ''
    let graphs = selectedGraph.singleGraphs
    let graphLength = selectedGraph.singleGraphs.length
    try {
        for (let i = 0; i < graphLength; i++) {
            initXYDataSetsAndUnits(i)

            if (i === 0) {
                xstyleContent += `${titleFormat(graphs[i].xData)}`
                ystyleContent += `${titleFormat(graphs[i].yData)}`
            }
            else {
                if (xstyleContent.indexOf(titleFormat(graphs[i].xData)) === -1) {
                    xstyleContent += `, ${titleFormat(graphs[i].xData)}`
                }
                if (ystyleContent.indexOf(titleFormat(graphs[i].yData)) === -1) {
                    ystyleContent += `, ${titleFormat(graphs[i].yData)}`
                }
            }
            if (i === graphLength - 1) {
                xstyleContent += ` ${unitFormat(xUnit)}`
                ystyleContent += ` ${unitFormat(yUnit)}`
            }
            // 处理xstyleContent, ystyleContent

            if (xDataSet.length !== yDataSet.length) {
                ElMessage.error('数组长度不一致！')
                throw new Error('数组长度不一致！')
            }
            // 检测

            let datapointContent = ''
            for (let i = 0; i < xDataSet.length; i++) {
                datapointContent += `(${xDataSet[i].rawData} , ${yDataSet[i].rawData}) `
            }
            let xDomain = ''
            switch (graphs[i].graphOption) {
                case 'line':
                    xDomain = getDomain(xDataSet)
                    graphs[i].graphData = store.evaluateLine(xDataSet, yDataSet)
                    if (i !== 0) {
                        graphCenterContent += `\n\t\t\t`
                        if (graphCommentContent !== '') {
                            graphCommentContent += ` \\\\ `
                        }
                    }
                    graphCenterContent += `\\functionline{${xDomain}}{${graphs[i].graphData.slope}*x${graphs[i].graphData.intercept[0] === '-' ? '' : '+'}${graphs[i].graphData.intercept}}[${figureLineName.value}：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]\n\t\t\t\\datapoint[only marks]{${datapointContent}}[${figureDataName.value}：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    graphCommentContent += `$ ${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)} : y=${dataFormat(graphs[i].graphData.slope)}x${graphs[i].graphData.intercept[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.intercept)} \\qquad R^2 = ${dataFormat(graphs[i].graphData.rSquared)} $`
                    break
                case 'square':
                    xDomain = getDomain(xDataSet)
                    graphs[i].graphData = store.evaluateSquare(xDataSet, yDataSet)
                    if (i !== 0) {
                        graphCenterContent += `\n\t\t\t`
                        if (graphCommentContent !== '') {
                            graphCommentContent += ` \\\\ `
                        }
                    }
                    graphCenterContent += `\\functionline{${xDomain}}{${graphs[i].graphData.a}*x*x${graphs[i].graphData.b[0] === '-' ? '' : '+'}${graphs[i].graphData.b}*x${graphs[i].graphData.c[0] === '-' ? '' : '+'}${graphs[i].graphData.c}}[${figureCurveName.value}：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]\n\t\t\t\\datapoint[only marks]{${datapointContent}}[${figureDataName.value}：$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    graphCommentContent += `$ ${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)} : y=${dataFormat(graphs[i].graphData.a)}x^2${graphs[i].graphData.b[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.b)}x${graphs[i].graphData.c[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.c)} \\qquad R^2 = ${dataFormat(graphs[i].graphData.rSquared)} $`
                    break
                case 'simple':
                    if (i !== 0) {
                        graphCenterContent += `\n\t\t\t`
                    }
                    graphCenterContent += `\\datapoint{${datapointContent}}[$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    break
                case 'smooth':
                    if (i !== 0) {
                        graphCenterContent += `\n\t\t\t`
                    }
                    graphCenterContent += `\\datapoint[smooth]{${datapointContent}}[$${titleFormat(graphs[i].yData)}\\text{-}${titleFormat(graphs[i].xData)}$]`
                    break
            }
        }
        if (selectedGraph.graphFramed) {
            selectedGraph.graphContent = `\\begin{figure}[H]\n\t\\framed[${selectedGraph.graphTitleContent}]{\n\t\t\\begin{plot}{\\xstyle{$ ${xstyleContent} $} \\ystyle{$ ${ystyleContent} $}}\n\t\t\t${graphCenterContent}\n\t\t\\end{plot}\n\t}[ ${graphCommentContent}]\n\\end{figure}`
        }
        else {
            selectedGraph.graphContent = `\\begin{figure}[H]\n\t\\notframed[${selectedGraph.graphTitleContent}]{\n\t\t\\begin{plot}{\\xstyle{$ ${xstyleContent} $} \\ystyle{$ ${ystyleContent} $}}\n\t\t\t${graphCenterContent}\n\t\t\\end{plot}\n\t}[ ${graphCommentContent}]\n\\end{figure}`
        }
        ElMessage.success('作图成功！')
    }
    catch (error) {
        ElMessage.error('作图失败！')
        console.error('Error during plotting', error)
    }
}

</script>
<template>
    <!-- 导出为LaTeX图像视图 -->
    <div v-if="selectedGraphIndex >= 0 && graphList[selectedGraphIndex]">
        <div v-for="(singleGraph, index) in graphList[selectedGraphIndex].singleGraphs">
            <div class="card-div">
                <el-card shadow="hover">
                    <div class="equipment" style="font-weight: bold; font-size: large;">
                        图线 {{ index + 1 }}
                        <el-icon class="el-icon--right deleteicon" @click="handleDeleteSingleGraph">
                            <circle-close></circle-close>
                        </el-icon>
                    </div>
                    <div class="equipment">
                        <div class="equipment" style="width: 60%;">
                            <label style="font-weight: 550;width: 16%;text-align: center;">x轴数据</label>
                            <span style="width: 1%;"></span>
                            <el-select style="width: 32%;text-align: center;min-width: 5.5em"
                                v-model="singleGraph.xData" @change="handleGraphQuietUpdate">
                                <el-option v-for="title in xTitleList" :key="title.value" :label="title.label"
                                    :value="title.value"></el-option>
                            </el-select>
                            <span style="width: 1%;"></span>
                            <label style="font-weight: 550;width: 16%;text-align: center;">y轴数据</label>
                            <span style="width: 1%;"></span>
                            <el-select style="width: 32%;text-align: center;min-width: 5.5em"
                                v-model="singleGraph.yData" @change="handleGraphQuietUpdate">
                                <el-option v-for="title in yTitleList" :key="title.value" :label="title.label"
                                    :value="title.value"></el-option>
                            </el-select>
                            <span style="width: 1%;"></span>
                        </div>
                        <div class="equipment" style="width: 40%;">
                            <label style="font-weight: 550;width: 10%;text-align: center;">制图方法</label>
                            <span style="width: 5%;"></span>
                            <el-select style="width: 45%;text-align: center;min-width: 5.5em"
                                v-model="singleGraph.graphOption" @change="handleGraphQuietUpdate">
                                <el-option v-for="option in graphOptions" :key="option.value" :label="option.label"
                                    :value="option.value"></el-option>
                            </el-select>
                        </div>
                    </div>
                </el-card>
            </div>
            <div class="card-div" v-if="singleGraph.graphData !== ''">
                <el-card shadow="hover">
                    <div class="equipment" style="font-size: 15pt;font-weight: bold;"
                        v-if="singleGraph.graphOption === 'line'">
                        拟合结果：{{ 'y = ' + singleGraph.graphData.slope + ' x ' + (singleGraph.graphData.intercept[0] ===
                            '-' ? '' : '+')
                            + singleGraph.graphData.intercept + ' ' + ',' + ' R² = ' + singleGraph.graphData.rSquared }}
                    </div>
                    <div class="equipment" style="font-size: 15pt;font-weight: bold;"
                        v-if="singleGraph.graphOption === 'square'">
                        拟合结果：{{ 'y = ' + singleGraph.graphData.a + ' x² ' + (singleGraph.graphData.b[0] === '-' ? '' :
                            '+ ') +
                            singleGraph.graphData.b + ' x ' + (singleGraph.graphData.c[0] === '-' ? '' : '+ ') +
                            singleGraph.graphData.c
                            + ' , R² = ' + singleGraph.graphData.rSquared }}
                    </div>
                </el-card>
            </div>
        </div>
        <div class="card-div">
            <el-card shadow="hover">
                <div class="equipment">
                    <label style="font-weight: 550;width: 10%;text-align: center;">标题</label>
                    <span style="width: 1%;"></span>
                    <input placeholder="标题" v-model="graphList[selectedGraphIndex].graphTitleContent"
                        @change="handleGraphQuietUpdate" style="width: 22%; text-align: center;">
                    <span style="width: 5%;"></span>
                    <el-button @click="handleAddSingleGraph" style="width: 35%; text-align: center;">添加图线</el-button>
                    <span style="width: 5%;"></span>
                    <el-button @click="handleGraphUpdate" style="width: 35%; text-align: center;">刷新</el-button>
                </div>
            </el-card>
        </div>
        <div class="card-div">
            <el-card shadow="hover">
                <div>
                    <div style="text-align: center;">
                        <el-switch v-model="graphList[selectedGraphIndex].graphFramed" size="large" inactive-text="不带边框"
                            active-text="带边框" style="font-size: large;width: 20%;--el-switch-on-color: #626aef;"
                            @change="handleGraphQuietUpdate" />
                        <span style="font-weight: bold; font-size: large;"> 内容 </span>
                        <el-icon class="copy el-icon--right" @click="handleGraphCopy">
                            <document-copy></document-copy>
                        </el-icon>
                    </div>
                    <pre>{{ graphList[selectedGraphIndex].graphContent }}</pre>
                </div>
            </el-card>
        </div>
        <div class="card-div">
            <el-card shadow="hover" style="height: 100px; overflow: auto;">
                <div>
                    <div style="text-align: center;">
                        <span style="font-weight: bold; font-size: large;">依赖 </span>
                        <el-icon class="copy el-icon--right" @click="handleRelyCopy">
                            <document-copy></document-copy>
                        </el-icon>
                    </div>
                    <pre>{{ store.rely }}</pre>
                </div>
            </el-card>
        </div>
    </div>
</template>
<style lang="less" scoped>
@import (css) './mainPageStyle.css';
</style>