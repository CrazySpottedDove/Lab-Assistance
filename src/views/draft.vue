<script>
// x,y轴数据选项
const xDataOptionList = ref([])
const yDataOptionList = ref([])
watch(dataList, () => {

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
            xDataOptionList.value.push({ value: data.id, label: data.title })
        }
        else {
            xDataOptionList.value[xIndex].label = data.title
        }
        if (yIndex === -1) {
            yDataOptionList.value.push({ value: data.id, label: data.title })
        }
        else {
            yDataOptionList.value[yIndex].label = data.title
        }
    });

    let len = xDataOptionList.value.length
    for (let i = 0; i < len;) {
        if (!dataOfIdExists(xDataOptionList.value[i].value)) {
            xDataOptionList.value.splice(i, 1)
            len--
        }
        else {
            i++
        }
    }
    len = yDataOptionList.value.length
    for (let i = 0; i < len;) {
        if (!dataOfIdExists(yDataOptionList.value[i].value)) {
            yDataOptionList.value.splice(i, 1)
            len--
        }
        else {
            i++
        }
    }
}, { deep: true })

// 更新当前图，mode有quiet和active两种
function updateCurrentGraph(mode) {
    // 获取一组数据的最小，最大值
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
    let selectedGraph = graphList.value[selectedGraphIndex.value]
    let xstyleContent = ''
    let ystyleContent = ''
    let graphCenterContent = ''
    let graphCommentContent = ''
    let xTitle = ''
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
            }

            if (i === 0) {
                xstyleContent += `${titleFormat(xTitle)}`
                ystyleContent += `${titleFormat(yTitle)}`
            }
            // 防止同样的变量多次出现在标题中
            else {
                if (xstyleContent.indexOf(titleFormat(xTitle)) === -1) {
                    xstyleContent += `, ${titleFormat(xTitle)}`
                }
                if (ystyleContent.indexOf(titleFormat(yTitle)) === -1) {
                    ystyleContent += `, ${titleFormat(yTitle)}`
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
}
</script>
<!-- xData and yData waiting to be solved -->
