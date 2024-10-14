<script setup>
import { useAllDataStore } from '../assets/stores';
import { computed, ref, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { CircleClose, FirstAidKit } from '@element-plus/icons-vue';
const store = useAllDataStore()
const dataList = computed(() => store.state.dataList)
const selectedDataIndex = computed(() => store.state.selectedDataIndex)

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
    return selectedDataIndex.value >= 0 ? (dataList.value[selectedDataIndex.value].theoData === undefined || dataList.value[selectedDataIndex.value].theoData === '' ? [{ label: dataList.value[selectedDataIndex.value].title, prop: 'rawData' }] : [{ label: dataList.value[selectedDataIndex.value].title, prop: 'rawData' }, { label: '相对误差', prop: 'relErr' }]) : []
})

const inputRefs = ref([])

const handleChange = () => {
    store.refresh()
}

const dataInput = ref('')

const handleAddRawData = () => {
    dataList.value[selectedDataIndex.value].dataSet.push({ rawData: dataInput.value })
    dataInput.value = ''
    store.refresh()
}
const handleInsertRawData = (index) => {
    dataList.value[selectedDataIndex.value].dataSet.splice(index, 0, { rawData: '', })
    nextTick(() => {
        // 在下一次 DOM 更新后，聚焦到新插入的输入框
        const inputToFocus = inputRefs.value[index]
        if (inputToFocus && inputToFocus.$el) {
            inputToFocus.$el.querySelector('input').focus()
        }
    })
}
const handleEditTheoData = () => {
    store.refresh()
}
const handleDeleteRawData = (index) => {
    dataList.value[selectedDataIndex.value].dataSet.splice(index, 1)
    store.refresh()
}
const handleEditEquipUncer = () => {
    store.refresh()
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
    store.refresh()
}

// 间接数据逻辑
const handleDataMethodChange = () => {
    let selectedList = dataList.value[selectedDataIndex.value]
    if (selectedList.dataMethod) {
        dataList.value[selectedDataIndex.value].dataSet.forEach(item => {
            item.rawData = store.errorMode(item.rawData)
        })
    }
    else {
        store.editIndirectData()
    }
}

const copyBoardId = ref(-1)

// 递归的深克隆函数
function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj; // 处理基本类型
    }

    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item)); // 深拷贝数组
    }

    const clonedObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]); // 深拷贝对象属性
        }
    }
    return clonedObj;
}

// 处理快捷键事件
const handleKeydown = (event) => {
    if (event.ctrlKey && event.shiftKey) {
        const key = event.key.toLowerCase();
        switch (key) {
            case 'c':
                event.preventDefault();
                if (selectedDataIndex.value >= 0) {
                    copyBoardId.value = dataList.value[selectedDataIndex.value].id
                }
                return
            case 'v':
                event.preventDefault();
                if (selectedDataIndex.value >= 0 && copyBoardId.value !== -1) {
                    let source = dataList.value.find(data => data.id === copyBoardId.value)
                    for (let key in source) {
                        if (key !== 'title' && key !== 'id') {
                            dataList.value[selectedDataIndex.value][key] = deepClone(source[key])
                        }
                    }
                }
                return
        }
    }
}
onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})
onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
})
</script>
<template>
    <!-- 直接数据的编辑卡片 -->
    <div
        v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex] ? dataList[selectedDataIndex].type === 'direct' : false">
        <div class="card-div">
            <el-card shadow="hover">
                <el-table :data="selectedDataIndex >= 0 ? dataList[selectedDataIndex].dataSet : []">
                    <el-table-column fixed="left" width="60px">
                        <template #="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(column, index) in tableOneColumns" :key="index" :prop="column.prop"
                        :label="column.label" align='center'>
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
                    <div class="new-data" v-show="selectedDataIndex >= 0">
                        <label style="font-weight: 550;width: 20%;text-align: left;">新数据</label>
                        <input v-model="dataInput" @change="handleAddRawData" style="text-align: center;width: 80%;">
                    </div>
                    <div v-if="selectedDataIndex >= 0" class="theo-data">
                        <label style="font-weight: 550;width: 20%;text-align: left;">理论值</label>
                        <input v-model="dataList[selectedDataIndex].theoData" style="text-align: center;width: 80%;"
                            placeholder="选填" @change="handleEditTheoData"></input>
                    </div>
                </div>
                <div class="equipment" v-if="selectedDataIndex >= 0">
                    <label style="font-weight: 550;width: 10%;text-align: left;min-width: 5em;">精度规则</label>
                    <el-select style="width: 39%;text-align: center;min-width: 5.5em"
                        v-model="dataList[selectedDataIndex].levelRule">
                        <el-option v-for="levelRule in levelRules" :key="levelRule.value" :label="levelRule.label"
                            :value="levelRule.value"></el-option>
                    </el-select>
                    <span style="width: 1%;"></span>
                    <label style="font-weight: 550;width: 9%;text-align: left;min-width: 5em;">符号含义</label>
                    <input v-model="dataList[selectedDataIndex].doc" style="text-align: center;width: 40%;"
                        placeholder="选填，仅对 LaTeX 制表/图有影响">
                </div>
            </el-card>
        </div>
    </div>

    <!-- 间接数据的编辑卡片 -->
    <div class="card-div"
        v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex] ? dataList[selectedDataIndex].type === 'indirect' : false">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 10%;text-align: center;min-width: 4.5em;">计算方式</label>
                <el-select style="width: 10%;text-align: center;min-width: 7em"
                    v-model="dataList[selectedDataIndex].computeOption" @change="handleComputeOptionChange">
                    <el-option v-for="option in computeOptions" :key="option.value" :label="option.label"
                        :value="option.value"></el-option>
                </el-select>
                <span style="width: 1%;"></span>
                <input style="text-align: center;width: 64%;" placeholder="示例：(a+b)/(9.8*c)"
                    v-model="dataList[selectedDataIndex].computeMethod">
                <span style="width: 1%;"></span>
                <el-button style="width: 14%;" @click="handleCompute">刷新</el-button>
            </div>
            <div class="equipment">
                <label style="font-weight: 550;width: 10%;text-align: center;">保留方式</label>
                <span style="width: 5%;"></span>
                <el-switch v-model="dataList[selectedDataIndex].dataMethod" size="large" active-text="不确定度方式"
                    inactive-text="有效数字方式" style="font-size: large;width: 40%;--el-switch-on-color: #626aef;" />
                <span style="width: 1%;"></span>
                <label style="font-weight: 550;width: 5%;text-align: left;min-width: 5em;">符号含义</label>
                <input v-model="dataList[selectedDataIndex].doc" style="text-align: center;width: 39%;"
                    placeholder="选填，仅对 LaTeX 制表/图有影响">
                <br />
            </div>
        </el-card>
    </div>

    <!-- 公用的单位卡片 -->
    <div class="card-div" v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex]">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 16%;text-align: left;">单位</label>
                <input style="text-align: center;width: 84%;" placeholder="选填，仅对LaTeX制表/图有影响"
                    v-model="dataList[selectedDataIndex].unit"
                    >
                <span style="width: 2%; min-width: 1em;" v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex].type === 'indirect'"></span>
                <label style="font-weight: 550;width: 16%;text-align: left;" v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex].type === 'indirect'">倍率</label>
                <input style="text-align: center;width: 84%;"
                    v-model="dataList[selectedDataIndex].multiplier"
                    v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex].type === 'indirect'">
            </div>
        </el-card>
    </div>

    <!-- 间接数据的展示卡片 -->
    <div class="card-div"
        v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex] ? dataList[selectedDataIndex].type === 'indirect' && dataList[selectedDataIndex].computeOption === 'forAll' : false">
        <div class="card-div">
            <el-card shadow="hover">
                <el-table :data="selectedDataIndex >= 0 ? dataList[selectedDataIndex].dataSet : []">
                    <el-table-column fixed="left" width="60px">
                        <template #="scope">
                            {{ scope.$index + 1 }}
                        </template>
                    </el-table-column>
                    <el-table-column v-for="(column, index) in tableOneColumns" :key="index" :prop="column.prop"
                        :label="column.label" align='center'>
                        <template #default="scope">
                            <el-input v-model="scope.row[column.prop]" @change="handleChange()"
                                :disabled="column.prop === 'relErr'">
                            </el-input>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="edit-one">
                    <div v-if="selectedDataIndex >= 0" class="indirect-theo-data">
                        <label style="font-weight: 550;width: 20%;text-align: left;">理论值</label>
                        <input v-model="dataList[selectedDataIndex].theoData" style="text-align: center;width: 80%;"
                            placeholder="选填" @change="handleEditTheoData"></input>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
    <div class="card-div"
        v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex] ? dataList[selectedDataIndex].type === 'indirect' && dataList[selectedDataIndex].computeOption === 'forAvg' : false">
        <div class="card-div">
            <el-card shadow="hover">
                <div class="edit-one">
                    <div v-if="selectedDataIndex >= 0" class="indirect-theo-data">
                        <label style="font-weight: 550;width: 20%;text-align: left;">理论值</label>
                        <input v-model="dataList[selectedDataIndex].theoData" style="text-align: center;width: 80%;"
                            placeholder="选填" @change="handleEditTheoData"></input>
                    </div>
                </div>
            </el-card>
        </div>
    </div>

    <!-- 公用的属性卡片 -->
    <div class="card-div" v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex]">
        <el-card shadow="hover">
            <el-table :data="selectedDataIndex >= 0 ? Object.values(dataList[selectedDataIndex].analysis) : []">
                <el-table-column v-for="(property, index) in propertyLabel" :key="index" :prop="property.prop"
                    :label="property.label" align="center">
                </el-table-column>
            </el-table>
        </el-card>
    </div>

    <!-- 直接数据的不确定度卡片 -->
    <div class="card-div"
        v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex] ? dataList[selectedDataIndex].type === 'direct' : false">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 20%;text-align: left;">仪器允差</label>
                <input style="text-align: center;width: 80%;" placeholder="选填"
                    v-model="dataList[selectedDataIndex].moreUncer.equipUncer" @change="handleEditEquipUncer">
            </div>
            <div class="equipment" v-show="dataList[selectedDataIndex].moreUncer.bUncer">
                <label style="font-weight: 550;width: 20%;text-align: left;">B类不确定度</label>
                <input style="text-align: center;width: 80%;" v-model="dataList[selectedDataIndex].moreUncer.bUncer"
                    disabled>
            </div>
            <div class="equipment">
                <label style="font-weight: 550;width: 20%;text-align: left;">不确定度</label>
                <input style="text-align: center;width: 80%;"
                    :disabled="dataList[selectedDataIndex].dataSet.length !== 1"
                    v-model="dataList[selectedDataIndex].moreUncer.wholeUncer" @change="handleUncerEdit">
            </div>
        </el-card>
    </div>

    <!-- 间接数据的不确定度卡片 -->
    <div class="card-div"
        v-if="selectedDataIndex >= 0 && dataList[selectedDataIndex] ? dataList[selectedDataIndex].type === 'indirect' : false">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 20%;text-align: left;">不确定度</label>
                <input style="text-align: center;width: 80%;" disabled
                    v-model="dataList[selectedDataIndex].moreUncer.wholeUncer">
            </div>
        </el-card>
    </div>
</template>
<style lang="less" scoped>
@import (css) './mainPageStyle.css';
</style>