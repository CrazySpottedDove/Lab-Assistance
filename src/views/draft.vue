<script>
import { dataFormat, titleFormat, unitFormat } from '../assets/format'

watch(dataList, () => {
    // 检测当前的dataOption中是否存在某个id的data
    function dataOptionPosition(id) {
        let i
        for (i = 0; i < dataOptions.value.length; i++) {
            if (dataOptions.value[i].id === id) {
                return i
            }
        }
        return -1
    }

    // 生成一个child
    function child(label, source){
        return {
            label: label,
            value: {
                source: source,
                subtitle: label
            }
        }
    }

    // 依据source生成应有的labelList
    function generateLabelList(source) {
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

    // 添加所有labelList中有的,children中没有的元素
    function addValidChild(labelList, children, source) {
        labelList.forEach(label => {
            let isExist = false
            for (let i = 0; i < children.length; i++) {
                if (children[i].label === label) {
                    isExist = true
                    break
                }
            }
            if (!isExist) {
                children.push(child(label, source))
            }
        })
    }

    // 删除所有labelList中没有的，children中有的元素
    function deleteInvalidChild(labelList, children) {
        let len = children.length
        for (let i = 0; i < len; i++) {
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

    // 生成一个原始的dataOption，只包含source和subtitle
    function generateDataOption(item){
        let result = {}
        result.value = {source: item}
        result.label = item.title
        result.id = item.id
        result.children = []
        let labelList = generateLabelList(item)
        addValidChild(labelList, result.children, item)
        return result
    }

    // 更新某个dataOption
    function updateDataOption(index){
        let target = dataOptions.value[index]
        let source = target.value.source
        let children = target.children
        target.label = source.title
        let labelList = generateLabelList(source)
        deleteInvalidChild(labelList, children)
        addValidChild(labelList, children, source)
    }

    // 将dataOption中不存在的部分添加，存在的部分更新
    dataList.value.forEach(item => {
        let index = dataOptionPosition(item.id)
        if (index === -1) {
            dataOptions.value.push(generateDataOption(item))
        }
        else{
            updateDataOption(index)
        }
    })
}, { deep: true })

// 将粗略的tableDataList信息处理，成为可以直接用于绘表的数据
function processTableDataList(tableDataList) {

    // 处理可能多行数据的格式
    function processDataFmt(source, dataSource, title) {
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
        let source = data.source
        let processed = {}
        let title = `$ ${titleFormat(source.title)} ${docFormat(source.doc)} ${unitFormat(source.unit)} $`
        let tmp = processDataFmt(source, source.dataSet.map(data => data.rawData), title)
        processed.center = tmp.center
        processed.dataLength = tmp.dataLength
        processed.dataHeight = tmp.dataHeight

        if (source.computeMethod) {
            processed.comment = `$ \\displaystyle ${titleFormat(source.title)} = ${commentFormat(source.computeMethod, store.state.dataList)} $\\qquad `
        }

        return processed
    }

    // 处理性质行
    function processProperty(property) {
        function propertyMap(subtitle, source) {
            let fmtUnit = unitFormat(source.unit)
            let fmtDoc = unitFormat(source.doc)
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
                    fmtData = dataFormat(source.analysis['avg'].propertyValue)
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
                        center: `$ ${fmtTitle}_{\\text{theory}} ${fmtDoc} ${fmtUnit} $ & $ ${fmtData} $`,
                        dataLength: 1,
                    }
                case '相对误差':
                    let title = `$ \\varepsilon_{r,${fmtTitle}} $`
                    let tmp = processDataFmt(source, source.dataSet.map(data => data.relErr), title)
                    return {
                        center: tmp.center,
                        dataLength: tmp.dataLength,
                        dataHeight: tmp.dataHeight
                    }
                default:
                    return;
            }
        }
        let source = property.source
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

</script>