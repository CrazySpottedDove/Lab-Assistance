<script setup>
import { useAllDataStore } from '../assets/stores';
import { computed, ref, nextTick } from 'vue';

// Never import { expression } from 'mathjs';
import { commentFormat, titleFormat } from '../assets/format'
import DataUnit from './assets/DataUnit.vue';
import DataProperty from './assets/DataProperty.vue';
const store = useAllDataStore()
const viewType = computed(() => store.state.view.type)
const viewIndex = computed(() => store.state.view.index)

const selectedData = computed(() => {
    switch (viewType.value) {
        case 'directData':
            if (viewIndex.value >= 0) {
                return store.state.directDataList[viewIndex.value]
            }
        case 'indirectData':
            if (viewIndex.value >= 0) {
                return store.state.indirectDataList[viewIndex.value]
            }
    }
    return {}
})

const tableOneColumns = computed(() => {
    let result = []
    store.state.indirectDataList.forEach(indirectData => {
        result.push(indirectData.theoData === undefined || indirectData.theoData === '' ? [{ label: indirectData.title, prop: 'rawData' }] : [{ label: indirectData.title, prop: 'rawData' }, { label: '相对误差', prop: 'relErr' }])
    })
    return result
})



const handleChange = () => {
    store.refreshDataDetails()
}

const handleEditTheoData = () => {
    store.refreshDataDetails()
}

const handleCompute = () => {
    store.editIndirectData()
}
const handleComputeOptionChange = () => {
    store.analysisChange()
}
const computeOptions = [
    {
        value: 'forAll',
        label: '遍历元素'
    },
    {
        value: 'forAvg',
        label: '对平均值'
    },
]

// 临时存储输入框数据
const inputComputeMethod = ref([])

// 临时存储输入框光标位置
const inputCursorPostion = ref([])

// 参与补全的函数
const functionList = ['sin()', 'cos()', 'ln()', 'asin()', 'acos()', 'atan()', 'sqrt()', 'log()', 'abs()', 'tan()']
const querySearch = (queryString, cb) => {
    // 补全表
    const compeletionList = [...(store.state.directDataList.map(item => item.title)), ...(store.state.indirectDataList.map(item => item.title)), ...functionList]

    const inputElement = document.getElementById(`myAutocomplete${viewIndex.value}`)
    const cursorPosition = inputElement ? inputElement.selectionStart : 0

    // 存储位置，防止回车丢失
    store.state.inputCursorPosition[viewIndex.value] = cursorPosition

    // 实时更新
    selectedData.value.computeMethod = queryString

    let suggestions = []

    // 通过光标位置开始切割查询字符串
    if (cursorPosition <= queryString.length && cursorPosition >= 0) {
        // 获取光标前最近的部分
        let queryPart = queryString.slice(0, cursorPosition);

        // 使用正则表达式查找光标前的最近部分（可以是单词或符号）
        const match = queryPart.match(/[\w]+$/);  // 匹配最后一个单词

        if (match) {
            queryPart = match[0];  // 只保留最后一个匹配到的部分
        }

        // 通过queryPart与completionList中的每个项进行匹配
        suggestions = compeletionList.filter(title =>
            title.toLowerCase().startsWith(queryPart.toLowerCase())  // 匹配开头部分
        );
    }
    cb(suggestions);
}

const handleSuggestionSelect = (item) => {
    if (typeof item === 'object') {
        return
    }
    const currentContent = selectedData.value.computeMethod
    const cursorPosition = store.state.inputCursorPosition[viewIndex.value]

    let beforeCursor = currentContent.slice(0, cursorPosition); // 光标之前的内容
    const afterCursor = currentContent.slice(cursorPosition); // 光标之后的内容
    const match = beforeCursor.match(/[\w]+$/);  // 匹配最后一个单词
    if (match) {
        // beforCursor删除末尾的match[0]
        beforeCursor = beforeCursor.slice(0, beforeCursor.length - match[0].length)
    }

    // 更新
    selectedData.value.computeMethod = beforeCursor + ' ' + item + ' ' + afterCursor
    store.state.inputComputeMethod[viewIndex.value] = selectedData.value.computeMethod

    // 移动光标到合适位置
    const inputElement = document.getElementById(`myAutocomplete${viewIndex.value}`)
    if (item.endsWith('()')) {
        nextTick(() => {
            if (inputElement) {
                const beginIndex = beforeCursor.length + item.length
                inputElement.setSelectionRange(beginIndex, beginIndex);
                inputElement.focus();
            }
        });
    }
}

</script>
<template>
    <div v-for="(indirectData, indirectDataIndex) in store.state.indirectDataList">
        <div v-show="viewType === 'indirectData' && viewIndex === indirectDataIndex">
            <!-- 编辑卡片 -->
            <div class="card-div">
                <el-card shadow="hover">
                    <div class="equipment">
                        <span style="width: 1.7%;"></span>
                        <label style="font-weight: 550;width: 4%;text-align: right;min-width: 2.5em;">算式</label>
                        <span style="width: 5%;"></span>
                        <span style=" width: 40%;">
                            <el-autocomplete style="text-align: center;width: 98%;" placeholder="示例：(a+b)/(9.8*c)"
                                v-model="store.state.inputComputeMethod[indirectDataIndex]" :fetch-suggestions="querySearch"
                                :select-when-unmatched=true :highlight-first-item=true @select="handleSuggestionSelect"
                                :id="`myAutocomplete${indirectDataIndex}`">
                                <!-- 自定义补全建议显示内容 -->
                                <template v-slot="{ item }">
                                    <vue-latex style="width: 98%;font-size: small;" :expression="item"></vue-latex>
                                </template>
                            </el-autocomplete>
                        </span>
                        <span style="width: 3%;"></span>
                        <label style="font-weight: 550;width: 5%;text-align: right;min-width: 2.5em;">预览</label>
                        <span style="width: 3%;"></span>
                        <span style=" width: 40%;" class="fake-input">
                            <vue-latex :expression="commentFormat(indirectData.computeMethod, [...store.state.directDataList,
                            ...store.state.indirectDataList])" style="font-size: large;"></vue-latex>
                        </span>
                    </div>
                    <div class="equipment">
                        <label style="font-weight: 550;width: 10%;text-align: center;min-width: 4.5em;">计算方式</label>
                        <el-select style="width: 40%;text-align: center;min-width: 7em"
                            v-model="indirectData.computeOption" @change="handleComputeOptionChange">
                            <el-option v-for="option in computeOptions" :key="option.value" :label="option.label"
                                :value="option.value"></el-option>
                        </el-select>
                        <span style="width: 11.5%;"></span>
                        <el-button style="width: 39.5%;" @click="handleCompute">刷新</el-button>
                    </div>
                    <div class="equipment">
                        <label style="font-weight: 550;width: 10%;text-align: center;">保留方式</label>
                        <span style="width: 5%;"></span>
                        <el-switch v-model="indirectData.dataMethod" size="large" active-text="不确定度方式"
                            inactive-text="有效数字方式" style="font-size: large;width: 40%;" />
                        <span style="width: 1%;"></span>
                        <label style="font-weight: 550;width: 5%;text-align: left;min-width: 5em;">符号含义</label>
                        <el-input v-model="indirectData.doc" style="text-align: center;width: 39%;"
                            placeholder="选填，仅对 LaTeX 制表/图有影响"></el-input>
                        <br />
                    </div>
                </el-card>
            </div>
            <!-- 倍率卡片 -->
            <div class="card-div">
                <el-card shadow="hover">
                    <div class="equipment">
                        <label style="font-weight: 550;width: 16%;text-align: left;">倍率</label>
                        <el-input style="text-align: center;width: 84%;" v-model="indirectData.multiplier"></el-input>
                    </div>
                </el-card>
            </div>
            <data-unit v-model:unit="indirectData.unit"></data-unit>
            <!-- 展示卡片 -->
            <div class="card-div" v-if="indirectData.computeOption === 'forAll'">
                <el-card shadow="hover">
                    <el-table :data="indirectData.dataSet">
                        <el-table-column fixed="left" width="60px">
                            <template #="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(column, index) in tableOneColumns[indirectDataIndex]" :key="index"
                            :prop="column.prop" :label="column.label" align='center'>
                            <template #header="{ column }">
                                <vue-latex :expression="titleFormat(column.label)"></vue-latex>
                            </template>
                            <template #default="scope">
                                <el-input v-model="scope.row[column.prop]" @change="handleChange()"
                                    :disabled="column.prop === 'relErr'">
                                </el-input>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="edit-one">
                        <div class="indirect-theo-data">
                            <label style="font-weight: 550;width: 20%;text-align: left;">理论值</label>
                            <el-input v-model="indirectData.theoData" style="text-align: center;width: 80%;"
                                placeholder="选填" @change="handleEditTheoData"></el-input>
                        </div>
                    </div>
                </el-card>
            </div>
            <div class="card-div" v-if="indirectData.computeOption === 'forAvg'">
                <el-card shadow="hover">
                    <div class="edit-one">
                        <div class="indirect-theo-data">
                            <label style="font-weight: 550;width: 20%;text-align: left;">理论值</label>
                            <el-input v-model="indirectData.theoData" style="text-align: center;width: 80%;"
                                placeholder="选填" @change="handleEditTheoData"></el-input>
                        </div>
                    </div>
                </el-card>
            </div>
            <data-property :analysis="indirectData.analysis"></data-property>
            <!-- 不确定度卡片 -->
            <div class="card-div">
                <el-card shadow="hover">
                    <div class="equipment">
                        <label style="font-weight: 550;width: 20%;text-align: left;">不确定度</label>
                        <el-input style="text-align: center;width: 80%;" disabled
                            v-model="indirectData.moreUncer.wholeUncer"></el-input>
                    </div>
                </el-card>
            </div>
        </div>
    </div>


</template>
<style lang="less" scoped>
@import (css) './mainPageStyle.css';
</style>