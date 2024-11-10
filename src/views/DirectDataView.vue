<script setup>
import { useAllDataStore } from '../assets/stores';
import { computed, ref, nextTick} from 'vue';
import { titleFormat } from '../assets/format';
import { CircleClose, FirstAidKit } from '@element-plus/icons-vue';
// Never import { expression } from 'mathjs';
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
    store.state.directDataList.forEach(directData => {
        result.push(directData.theoData === undefined || directData.theoData === '' ? [{ label: directData.title, prop: 'rawData' }] : [{ label: directData.title, prop: 'rawData' }, { label: '相对误差', prop: 'relErr' }])
    })
    return result
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



</script>
<template>
    <div v-for="(directData, directDataIndex) in store.state.directDataList">
        <div v-show="viewType === 'directData' && viewIndex === directDataIndex">
            <!-- 编辑卡片 -->
            <div class="card-div">
                <el-card shadow="hover">
                    <el-table :data="directData.dataSet">
                        <el-table-column fixed="left" width="60px">
                            <template #="scope">
                                {{ scope.$index + 1 }}
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(column, index) in tableOneColumns[directDataIndex]" :key="index"
                            :prop="column.prop" :label="column.label" align='center'>
                            <template #header="{ column }">
                                <vue-latex :expression="titleFormat(column.label)"></vue-latex>
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
                            <el-input v-model="dataInput" @change="handleAddRawData"
                                style="text-align: center;width: 80%;" ></el-input>
                        </div>
                        <div class="theo-data">
                            <label style="font-weight: 550;width: 20%;text-align: left;">理论值</label>
                            <el-input v-model="directData.theoData" style="text-align: center;width: 80%;" placeholder="选填"
                                @change="handleEditTheoData" ></el-input>
                        </div>
                    </div>
                    <div class="equipment">
                        <label style="font-weight: 550;width: 10%;text-align: left;min-width: 5em;">精度规则</label>
                        <el-select style="width: 39%;text-align: center;min-width: 5.5em" v-model="directData.levelRule"
                            @change="handleEditLevelRule" :popper-append-to-body="false">
                            <el-option v-for="levelRule in levelRules" :key="levelRule.value" :label="levelRule.label"
                                :value="levelRule.value"></el-option>
                        </el-select>
                        <span style="width: 1%;"></span>
                        <label style="font-weight: 550;width: 9%;text-align: left;min-width: 5em;">符号含义</label>
                        <el-input v-model="directData.doc" style="text-align: center;width: 40%;"
                            placeholder="选填，仅对 LaTeX 制表/图有影响"></el-input>
                    </div>
                </el-card>
            </div>
            <data-unit v-model:unit="directData.unit"></data-unit>
            <data-property :analysis="directData.analysis"></data-property>
            <!-- 不确定度卡片 -->
            <div class="card-div">
                <el-card shadow="hover">
                    <div class="equipment">
                        <label style="font-weight: 550;width: 20%;text-align: left;">仪器允差</label>
                        <el-input style="text-align: center;width: 80%;" placeholder="选填"
                            v-model="directData.moreUncer.equipUncer" @change="handleEditEquipUncer"></el-input>
                    </div>
                    <div class="equipment" v-show="directData.moreUncer.bUncer">
                        <label style="font-weight: 550;width: 20%;text-align: left;">B类不确定度</label>
                        <el-input style="text-align: center;width: 80%;" v-model="directData.moreUncer.bUncer" disabled></el-input>
                    </div>
                    <div class="equipment">
                        <label style="font-weight: 550;width: 20%;text-align: left;">不确定度</label>
                        <el-input style="text-align: center;width: 80%;" :disabled="directData.dataSet.length !== 1"
                            v-model="directData.moreUncer.wholeUncer" @change="handleUncerEdit"></el-input>
                    </div>
                </el-card>
            </div>
        </div>
    </div>


</template>
<style lang="less" scoped>
@import (css) './mainPageStyle.css';
</style>