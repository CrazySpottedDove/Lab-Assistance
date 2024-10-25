<script setup>
import { computed, ref, watch } from 'vue';
import { useAllDataStore } from '../assets/stores'
import { CircleClose, DocumentCopy } from '@element-plus/icons-vue';
import { titleFormat, dataFormat, unitFormat, docFormat } from '../assets/format';


// 基础属性
const store = useAllDataStore()
const dataList = computed(() => [...store.state.directDataList, ...store.state.indirectDataList])
const graphList = computed(() => store.state.graphList)
const viewIndex = computed(() => store.state.view.index)
const viewType = computed(() => store.state.view.type)


// 随语言模式切换的一些默认值
const graphLineName = computed(() => {
    return store.userConfig.language === 'chinese' ? '拟合直线' : 'fitting line'
})
const graphCurveName = computed(() => {
    return store.userConfig.language === 'chinese' ? '拟合曲线' : 'fitting curve'
})
const graphDataName = computed(() => {
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

// 通过id获得数据
function getSourceById(id) {
    return dataList.value.find(data => data.id === id)
}

// x,y轴数据选项
const xDataOptionList = ref([{ value: -2, label: '空' }])
const yDataOptionList = ref([{ value: -2, label: '空' }])

// 实时更新图
watch(dataList, () => {
    // 更新x,yDataOptionList
    function updateXYDataOptionList() {
        // 返回id在dataOptionList中的index
        function dataOptionPosition(id, dataOptionList) {
            let i
            for (i = 0; i < dataOptionList.length; i++) {
                if (dataOptionList[i].value === id) {
                    return i
                }
            }
            return -1
        }

        // 检测id在dataList是否存在
        function dataOfIdExists(id) {
            for (let i = 0; i < dataList.value.length; i++) {
                if (dataList.value[i].id === id) {
                    return true
                }
            }
            return false
        }

        // 处理xDataOption的序号
        if (dataOptionPosition(-1, xDataOptionList.value) === -1) {
            xDataOptionList.value.push({ value: -1, label: '序号' })
        }

        // 根据dataList补足dataOptionList
        dataList.value.forEach(data => {
            let xIndex = dataOptionPosition(data.id, xDataOptionList.value)
            let yIndex = dataOptionPosition(data.id, yDataOptionList.value)
            if (xIndex === -1) {
                xDataOptionList.value.push({ value: data.id, label: data.title ? data.title : '未命名数据' })
            }
            else {
                if (data.title) {
                    xDataOptionList.value[xIndex].label = data.title
                }

            }
            if (yIndex === -1) {
                yDataOptionList.value.push({ value: data.id, label: data.title ? data.title : '未命名数据' })
            }
            else {
                if (data.title) {
                    yDataOptionList.value[yIndex].label = data.title
                }
            }
        });

        // 删除多余部分
        let len = xDataOptionList.value.length
        for (let i = 0; i < len;) {
            if (xDataOptionList.value[i].value !== -2 && xDataOptionList.value[i].value !== -1 && !dataOfIdExists(xDataOptionList.value[i].value)) {
                graphList.value.forEach((graph) => {
                    graph.singleGraphs.forEach(singleGraph => {
                        if (singleGraph.xDataId === xDataOptionList.value[i].value) {
                            singleGraph.xDataId = -2
                        }
                    })
                })
                xDataOptionList.value.splice(i, 1)
                len--
            }
            else {
                i++
            }
        }
        len = yDataOptionList.value.length
        for (let i = 0; i < len;) {
            if (yDataOptionList.value[i].value !== -2 && !dataOfIdExists(yDataOptionList.value[i].value)) {
                graphList.value.forEach(graph => {
                    graph.singleGraphs.forEach(singleGraph => {
                        if (singleGraph.yDataId === yDataOptionList.value[i].value) {
                            singleGraph.yDataId = -2
                        }
                    })
                })
                yDataOptionList.value.splice(i, 1)
                len--
            }
            else {
                i++
            }
        }
    }

    updateXYDataOptionList()
    if (viewType === 'graph' && viewIndex >= 0) {
        updateCurrentGraph('quiet')
    }
}, { deep: true })

/**更新当前图，mode有quiet和active两种 */
function updateCurrentGraph(mode) {
    // 获取一组数据的最小，最大值范围，用于函数绘图
    function getDomain(dataSet) {
        let minData = dataSet.reduce((min, data) => {
            return min < Number(data.rawData) ? min : Number(data.rawData)
        }, Number(dataSet[0].rawData))
        let maxData = dataSet.reduce((max, data) => {
            return max > Number(data.rawData) ? max : Number(data.rawData)
        }, Number(dataSet[0].rawData))
        return `${minData} : ${maxData}`
    }

    let xDataSet = []
    let yDataSet = []
    let xUnit = ''
    let yUnit = ''
    let selectedGraph = graphList.value[viewIndex.value]
    let xstyleContent = ''
    let ystyleContent = ''
    let graphCenterContent = ''
    let graphCommentContent = ''
    let xTitle = ''
    let xDoc = ''
    let yDoc = ''
    let yTitle = ''
    let graphs = selectedGraph.singleGraphs
    let graphLength = selectedGraph.singleGraphs.length
    try {
        for (let i = 0; i < graphLength; i++) {
            const ySource = getSourceById(selectedGraph.singleGraphs[i].yDataId)
            if (!ySource) {
                switch (mode) {
                    case 'quiet':
                        return
                    case 'active':
                        ElMessage.error(`图线 ${i + 1} 的变量 y 不存在！`)
                        throw new Error(`图线 ${i + 1} 的变量 y 不存在！`)
                    default:
                        break;
                }
            }
            yDataSet = ySource.dataSet
            yUnit = ySource.unit
            yTitle = ySource.title
            yDoc = ySource.doc
            if (selectedGraph.singleGraphs[i].xDataId === -1) {
                xDataSet = []
                for (let i = 1; i <= yDataSet.length; i++) {
                    xDataSet.push({ rawData: i, bit: 100 })
                }
                xUnit = ''
                xTitle = '序号'
            }
            else {
                const xSource = getSourceById(selectedGraph.singleGraphs[i].xDataId)
                if (!xSource) {
                    switch (mode) {
                        case 'quiet':
                            return
                        case 'active':
                            ElMessage.error(`图线 ${i + 1} 的变量 x 不存在！`)
                            throw new Error(`图线 ${i + 1} 的变量 x 不存在！`)
                        default:
                            break;
                    }
                }
                xDataSet = xSource.dataSet
                xUnit = xSource.unit
                xTitle = xSource.title
                xDoc = xSource.doc
            }

            if (i === 0) {
                xstyleContent += `${titleFormat(xTitle)}${docFormat(xDoc)}`
                ystyleContent += `${titleFormat(yTitle)}${docFormat(yDoc)}`
            }
            // 防止同样的变量多次出现在标题中
            else {
                if (xstyleContent.indexOf(titleFormat(xTitle)) === -1) {
                    xstyleContent += `, ${titleFormat(xTitle)}${docFormat(xDoc)}`
                }
                if (ystyleContent.indexOf(titleFormat(yTitle)) === -1) {
                    ystyleContent += `, ${titleFormat(yTitle)}${docFormat(yDoc)}`
                }
            }
            if (i === graphLength - 1) {
                xstyleContent += ` ${unitFormat(xUnit)}`
                ystyleContent += ` ${unitFormat(yUnit)}`
            }
            // 处理xstyleContent, ystyleContent

            if (xDataSet.length !== yDataSet.length) {
                ElMessage.error(`${xTitle} 与 ${yTitle} 数组长度不一致！`)
                throw new Error(`${xTitle} 与 ${yTitle} 数组长度不一致！`)
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
                    graphCenterContent += `\\functionline{${xDomain}}{${graphs[i].graphData.slope}*x${graphs[i].graphData.intercept[0] === '-' ? '' : '+'}${graphs[i].graphData.intercept}}[${graphLineName.value}：$${titleFormat(yTitle)}\\text{-}${titleFormat(xTitle)}$]\n\t\t\t\\datapoint[only marks]{${datapointContent}}[${graphDataName.value}：$${titleFormat(yTitle)}\\text{-}${titleFormat(xTitle)}$]`
                    graphCommentContent += `$ ${titleFormat(yTitle)}\\text{-}${titleFormat(xTitle)} : y=${dataFormat(graphs[i].graphData.slope)}x${graphs[i].graphData.intercept[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.intercept)} \\qquad R^2 = ${dataFormat(graphs[i].graphData.rSquared)} $`
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
                    graphCenterContent += `\\functionline{${xDomain}}{${graphs[i].graphData.a}*x*x${graphs[i].graphData.b[0] === '-' ? '' : '+'}${graphs[i].graphData.b}*x${graphs[i].graphData.c[0] === '-' ? '' : '+'}${graphs[i].graphData.c}}[${graphCurveName.value}：$${titleFormat(yTitle)}\\text{-}${titleFormat(xTitle)}$]\n\t\t\t\\datapoint[only marks]{${datapointContent}}[${graphDataName.value}：$${titleFormat(yTitle)}\\text{-}${titleFormat(xTitle)}$]`
                    graphCommentContent += `$ ${titleFormat(yTitle)}\\text{-}${titleFormat(xTitle)} : y=${dataFormat(graphs[i].graphData.a)}x^2${graphs[i].graphData.b[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.b)}x${graphs[i].graphData.c[0] === '-' ? '' : '+'}${dataFormat(graphs[i].graphData.c)} \\qquad R^2 = ${dataFormat(graphs[i].graphData.rSquared)} $`
                    break
                case 'simple':
                    graphs[i].graphData = ''
                    if (i !== 0) {
                        graphCenterContent += `\n\t\t\t`
                    }
                    graphCenterContent += `\\datapoint{${datapointContent}}[$${titleFormat(yTitle)}\\text{-}${titleFormat(xTitle)}$]`
                    break
                case 'smooth':
                    graphs[i].graphData = ''
                    if (i !== 0) {
                        graphCenterContent += `\n\t\t\t`
                    }
                    graphCenterContent += `\\datapoint[smooth]{${datapointContent}}[$${titleFormat(yTitle)}\\text{-}${titleFormat(xTitle)}$]`
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
    if (mode === 'active') {
        ElMessage.success('刷新成功！')
    }
}

// 复制绘图内容
const handleGraphCopy = () => {
    navigator.clipboard.writeText(graphList.value[viewIndex.value].graphContent)
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

// 添加单条图线
const handleAddSingleGraph = () => {
    store.Add.singleGraph()
}

// 删除单条图线
const handleDeleteSingleGraph = (index) => {
    store.Delete.singleGraph(index)
    handleGraphQuietUpdate()
}

// 静默更新图线
const handleGraphQuietUpdate = () => {
    updateCurrentGraph('quiet')
}

// 活跃更新图线
const handleGraphUpdate = () => {
    updateCurrentGraph('active')
}

</script>
<template>
    <!-- 导出为LaTeX图像视图 -->
    <div v-if="viewType === 'graph' && viewIndex >= 0">
        <div v-for="(singleGraph, index) in graphList[viewIndex].singleGraphs">
            <div class="card-div">
                <el-card shadow="hover">
                    <div class="equipment" style="font-weight: bold; font-size: large;">
                        图线 {{ index + 1 }}
                        <el-icon class="el-icon--right deleteicon" @click="handleDeleteSingleGraph(index)">
                            <circle-close></circle-close>
                        </el-icon>
                    </div>
                    <div class="equipment">
                        <div class="equipment" style="width: 60%;">
                            <label style="font-weight: 550;width: 16%;text-align: center;">x轴数据</label>
                            <span style="width: 1%;"></span>
                            <el-select style="width: 32%;text-align: center;min-width: 5.5em"
                                v-model="singleGraph.xDataId" @change="handleGraphQuietUpdate">
                                <template #label="{label}">
                                    <vue-latex :expression="label" style="font-size: small;"></vue-latex>
                                </template>
                                <el-option v-for="xDataOption in xDataOptionList" :key="xDataOption.value"
                                    :label="xDataOption.label" :value="xDataOption.value">
                                    <template #default>
                                        <vue-latex :expression="xDataOption.label"></vue-latex>
                                    </template>
                                </el-option>
                            </el-select>
                            <span style="width: 1%;"></span>
                            <label style="font-weight: 550;width: 16%;text-align: center;">y轴数据</label>
                            <span style="width: 1%;"></span>
                            <el-select style="width: 32%;text-align: center;min-width: 5.5em"
                                v-model="singleGraph.yDataId" @change="handleGraphQuietUpdate">
                                <template #label="{ label }" style="font-size: small;">
                                    <vue-latex :expression="label" style="font-size: small;"></vue-latex>
                                </template>
                                <el-option v-for="title in yDataOptionList" :key="title.value" :label="title.label"
                                    :value="title.value">
                                    <template #default>
                                        <vue-latex :expression="title.label"></vue-latex>
                                    </template>
                                </el-option>
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
                    <input placeholder="标题" v-model="graphList[viewIndex].graphTitleContent"
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
                        <el-switch v-model="graphList[viewIndex].graphFramed" size="large" inactive-text="不带边框"
                            active-text="带边框" style="font-size: large;width: 20%;--el-switch-on-color: #626aef;"
                            @change="handleGraphQuietUpdate" />
                        <span style="font-weight: bold; font-size: large;"> 内容 </span>
                        <el-icon class="copy el-icon--right" @click="handleGraphCopy">
                            <document-copy></document-copy>
                        </el-icon>
                    </div>
                    <pre>{{ graphList[viewIndex].graphContent }}</pre>
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