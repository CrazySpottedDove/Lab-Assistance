<script setup>
import { useAllDataStore } from '../assets/stores';
import { computed, ref, nextTick, watch } from 'vue';
import { CircleClose, FirstAidKit } from '@element-plus/icons-vue';
// Never import { expression } from 'mathjs';
import { commentFormat, dataFormat } from '../assets/format'
const store = useAllDataStore()
const viewType = computed(() => store.state.view.type)
const viewIndex = computed(() => store.state.view.index)
const isData = computed(() => store.state.view.type === 'directData' || store.state.view.type === 'indirectData')
const isDirectData = computed(() => store.state.view.type === 'directData')
const isIndirectData = computed(() => store.state.view.type === 'indirectData')
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

const propertyLabel = [
    {
        prop: 'propertyName',
        label: '分析结果'
    },
    {
        prop: 'propertyValue',
        label: '值（已保留有效数字）'
    }
]

const tableOneColumns = computed(() => {
    return isData.value && viewIndex.value >= 0 ? (selectedData.value.theoData === undefined || selectedData.value.theoData === '' ? [{ label: selectedData.value.title, prop: 'rawData' }] : [{ label: selectedData.value.title, prop: 'rawData' }, { label: '相对误差', prop: 'relErr' }]) : []
})

const inputRefs = ref([])

const handleChange = () => {
    store.refreshDataDetails()
}

const dataInput = ref('')

const handleAddRawData = () => {
    selectedData.value.dataSet.push({ rawData: dataInput.value })
    dataInput.value = ''
    store.refreshDataDetails()
}
const handleInsertRawData = (index) => {
    selectedData.value.dataSet.splice(index, 0, { rawData: '', })
    nextTick(() => {
        // 在下一次 DOM 更新后，聚焦到新插入的输入框
        const inputToFocus = inputRefs.value[index]
        if (inputToFocus && inputToFocus.$el) {
            inputToFocus.$el.querySelector('input').focus()
        }
    })
}
const handleEditTheoData = () => {
    store.refreshDataDetails()
}

const handleEditLevelRule = () => {
    store.refreshDataDetails()
}
const handleDeleteRawData = (index) => {
    selectedData.value.dataSet.splice(index, 1)
    store.refreshDataDetails()
}
const handleEditEquipUncer = () => {
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

const levelRules = [
    {
        value: 'unified',
        label: '统一精度'
    },
    {
        value: 'nonUnified',
        label: '不统一精度'
    },
    {
        value: 'precise',
        label: '确数'
    }
]

const handleUncerEdit = () => {
    store.refreshDataDetails()
}

const strStartIndex = ref(0)
const inputComputeMethod = ref('')
watch(selectedData, () => {
    if (selectedData.value.type === 'indirect') {
        inputComputeMethod.value = selectedData.value.computeMethod
    }
}, { deep: true })
const querySearch = (queryString, cb) => {
    const titleList = [...(store.state.directDataList.map(item => item.title)), ...(store.state.indirectDataList.map(item => item.title))]
    strStartIndex.value = queryString.length - 1
    const operators = '+-*/^()|'
    selectedData.value.computeMethod = queryString
    while (strStartIndex.value >= 0) {
        if (operators.includes(queryString[strStartIndex.value])) {
            break
        } else {
            strStartIndex.value--
        }
    }
    strStartIndex.value++
    let suggestions = []
    if (strStartIndex.value < queryString.length) {
        suggestions = titleList.filter(title =>
            title.toLowerCase().includes(queryString.slice(strStartIndex.value).toLowerCase())
        );
    }
    cb(suggestions);
}

const handleSuggestionSelect = (item) => {
    if(typeof item === 'object'){
        return
    }
    selectedData.value.computeMethod = selectedData.value.computeMethod.slice(0, strStartIndex.value) + item
    inputComputeMethod.value = selectedData.value.computeMethod
}



</script>
<template>
    <!-- 直接数据的编辑卡片 -->
    <div v-if="isDirectData && viewIndex >= 0">
        <div class="card-div">
            <el-card shadow="hover">
                <el-table :data="viewIndex >= 0 ? selectedData.dataSet : []">
                    <el-table-column fixed="left" width="60px">
                        <template #="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(column, index) in tableOneColumns" :key="index" :prop="column.prop"
                        :label="column.label" align='center'>
                        <template #header="{ column }">
                            <vue-latex :expression="column.label"></vue-latex>
                        </template>
                        <template #default="scope">
                            <el-input v-model="scope.row[column.prop]" @change="handleChange()"
                                :disabled="column.prop === 'relErr'" :ref="el => inputRefs[scope.$index] = el">
                            </el-input>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" width="60px">
                        <template #="scope">
                            <el-icon @click="handleInsertRawData(scope.$index)" class="deleteicon el-icon--right">
                                <first-aid-kit></first-aid-kit>
                            </el-icon>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" width="60px">
                        <template #="scope">
                            <el-icon @click="handleDeleteRawData(scope.$index)" class="deleteicon el-icon--right">
                                <circle-close></circle-close>
                            </el-icon>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="edit-one">
                    <div class="new-data">
                        <label style="font-weight: 550;width: 20%;text-align: left;">新数据</label>
                        <input v-model="dataInput" @change="handleAddRawData" style="text-align: center;width: 80%;">
                    </div>
                    <div class="theo-data">
                        <label style="font-weight: 550;width: 20%;text-align: left;">理论值</label>
                        <input v-model="selectedData.theoData" style="text-align: center;width: 80%;" placeholder="选填"
                            @change="handleEditTheoData"></input>
                    </div>
                </div>
                <div class="equipment">
                    <label style="font-weight: 550;width: 10%;text-align: left;min-width: 5em;">精度规则</label>
                    <el-select style="width: 39%;text-align: center;min-width: 5.5em" v-model="selectedData.levelRule"
                        @change="handleEditLevelRule">
                        <el-option v-for="levelRule in levelRules" :key="levelRule.value" :label="levelRule.label"
                            :value="levelRule.value"></el-option>
                    </el-select>
                    <span style="width: 1%;"></span>
                    <label style="font-weight: 550;width: 9%;text-align: left;min-width: 5em;">符号含义</label>
                    <input v-model="selectedData.doc" style="text-align: center;width: 40%;"
                        placeholder="选填，仅对 LaTeX 制表/图有影响">
                </div>
            </el-card>
        </div>
    </div>

    <!-- 间接数据的编辑卡片 -->
    <div class="card-div" v-if="isIndirectData && viewIndex >= 0">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 5%;text-align: center;min-width: 2.5em;">算式</label>
                <span style="width: 4%;"></span>
                <span style=" width: 40%;">
                    <el-autocomplete style="text-align: center;width: 98%;" placeholder="示例：(a+b)/(9.8*c)"
                        v-model="inputComputeMethod" :fetch-suggestions="querySearch" :select-when-unmatched=true
                        :highlight-first-item=true @select="handleSuggestionSelect">
                        <!-- 自定义补全建议显示内容 -->
                        <template v-slot="{ item }">
                            <vue-latex style="width: 98%;font-size: small;" :expression="item"></vue-latex>
                        </template>
                    </el-autocomplete>
                </span>
                <span style="width: 3.5%;"></span>
                <label style="font-weight: 550;width: 5%;text-align: center;min-width: 2.5em;">预览</label>
                <span style=" width: 40%;">
                    <center><vue-latex :expression="commentFormat(selectedData.computeMethod, [...store.state.directDataList,
                    ...store.state.indirectDataList])" style="font-size: large;"></vue-latex></center>
                </span>
            </div>
            <div class="equipment">
                <label style="font-weight: 550;width: 10%;text-align: center;min-width: 4.5em;">计算方式</label>
                <el-select style="width: 40%;text-align: center;min-width: 7em" v-model="selectedData.computeOption"
                    @change="handleComputeOptionChange">
                    <el-option v-for="option in computeOptions" :key="option.value" :label="option.label"
                        :value="option.value"></el-option>
                </el-select>
                <span style="width: 11.5%;"></span>
                <el-button style="width: 39.5%;" @click="handleCompute">刷新</el-button>
            </div>
            <div class="equipment">
                <label style="font-weight: 550;width: 10%;text-align: center;">保留方式</label>
                <span style="width: 5%;"></span>
                <el-switch v-model="selectedData.dataMethod" size="large" active-text="不确定度方式" inactive-text="有效数字方式"
                    style="font-size: large;width: 40%;--el-switch-on-color: #626aef;" />
                <span style="width: 1%;"></span>
                <label style="font-weight: 550;width: 5%;text-align: left;min-width: 5em;">符号含义</label>
                <input v-model="selectedData.doc" style="text-align: center;width: 39%;"
                    placeholder="选填，仅对 LaTeX 制表/图有影响">
                <br />
            </div>
        </el-card>
    </div>

    <!-- 公用的单位卡片 -->
    <div class="card-div" v-if="isData && viewIndex >= 0">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 16%;text-align: left;">单位</label>
                <input style="text-align: center;width: 84%;" placeholder="选填，仅对LaTeX制表/图有影响"
                    v-model="selectedData.unit">
                <span style="width: 2%; min-width: 1em;" v-if="isIndirectData"></span>
                <label style="font-weight: 550;width: 16%;text-align: left;" v-if="isIndirectData">倍率</label>
                <input style="text-align: center;width: 84%;" v-model="selectedData.multiplier" v-if="isIndirectData">
            </div>
        </el-card>
    </div>

    <!-- 间接数据的展示卡片 -->
    <div class="card-div" v-if="isIndirectData && viewIndex >= 0 && selectedData.computeOption === 'forAll'">
        <div class="card-div">
            <el-card shadow="hover">
                <el-table :data="viewIndex >= 0 ? selectedData.dataSet : []">
                    <el-table-column fixed="left" width="60px">
                        <template #="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(column, index) in tableOneColumns" :key="index" :prop="column.prop"
                        :label="column.label" align='center'>
                        <template #header="{ column }">
                            <vue-latex :expression="column.label"></vue-latex>
                        </template>
                        <template #default="scope">
                            <el-input v-model="scope.row[column.prop]" @change="handleChange()"
                                :disabled="column.prop === 'relErr'">
                            </el-input>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="edit-one">
                    <div v-if="viewIndex >= 0" class="indirect-theo-data">
                        <label style="font-weight: 550;width: 20%;text-align: left;">理论值</label>
                        <input v-model="selectedData.theoData" style="text-align: center;width: 80%;" placeholder="选填"
                            @change="handleEditTheoData"></input>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
    <div class="card-div" v-if="isIndirectData && viewIndex >= 0 && selectedData.computeOption === 'forAvg'">
        <div class="card-div">
            <el-card shadow="hover">
                <div class="edit-one">
                    <div v-if="viewIndex >= 0" class="indirect-theo-data">
                        <label style="font-weight: 550;width: 20%;text-align: left;">理论值</label>
                        <input v-model="selectedData.theoData" style="text-align: center;width: 80%;" placeholder="选填"
                            @change="handleEditTheoData"></input>
                    </div>
                </div>
            </el-card>
        </div>
    </div>

    <!-- 公用的属性卡片 -->
    <div class="card-div" v-if="isData && viewIndex >= 0">
        <el-card shadow="hover">
            <el-table :data="viewIndex >= 0 ? Object.values(selectedData.analysis) : []">
                <el-table-column v-for="(property, index) in propertyLabel" :key="index" :prop="property.prop"
                    :label="property.label" align="center">
                    <template #default="scope">
                        <vue-latex :expression="dataFormat(scope.row[property.prop])" style="font-size: small;"></vue-latex>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>

    <!-- 直接数据的不确定度卡片 -->
    <div class="card-div" v-if="isDirectData && viewIndex >= 0">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 20%;text-align: left;">仪器允差</label>
                <input style="text-align: center;width: 80%;" placeholder="选填"
                    v-model="selectedData.moreUncer.equipUncer" @change="handleEditEquipUncer">
            </div>
            <div class="equipment" v-show="selectedData.moreUncer.bUncer">
                <label style="font-weight: 550;width: 20%;text-align: left;">B类不确定度</label>
                <input style="text-align: center;width: 80%;" v-model="selectedData.moreUncer.bUncer" disabled>
            </div>
            <div class="equipment">
                <label style="font-weight: 550;width: 20%;text-align: left;">不确定度</label>
                <input style="text-align: center;width: 80%;" :disabled="selectedData.dataSet.length !== 1"
                    v-model="selectedData.moreUncer.wholeUncer" @change="handleUncerEdit">
            </div>
        </el-card>
    </div>

    <!-- 间接数据的不确定度卡片 -->
    <div class="card-div" v-if="isIndirectData && viewIndex >= 0">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 20%;text-align: left;">不确定度</label>
                <input style="text-align: center;width: 80%;" disabled v-model="selectedData.moreUncer.wholeUncer">
            </div>
        </el-card>
    </div>
</template>
<style lang="less" scoped>
@import (css) './mainPageStyle.css';
</style>