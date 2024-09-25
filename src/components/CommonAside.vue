<template>
<div class="common-aside">
    <el-aside width="100%">
        <el-menu
            background-color="#626aef"
            :default-openeds="['1', '1-1','1-2','2','3']"
        >
            <el-sub-menu index="1" >
                <template #title>
                    <span style="color: gainsboro!important;">数据管理</span>
                </template>
                <el-sub-menu index="1-1">
                    <template #title >
                        <span style="color: gainsboro!important;">直接数据</span>
                    </template>
                    <el-menu-item
                        v-for="(item,displayIndex) of directDataList"
                        :ref="el => refs[displayIndex] = el"
                        @click="handleDataSelection(item.index, displayIndex)"
                        :class="{'selected':selectedDataIndex === item.index}"
                    >
                        <el-input v-model="item.data.title" @change="handleTitleChange(item.index)" @click.stop="handleTitleCopy(item.index)"></el-input>
                        <span>
                            <el-icon
                                @click.stop="handleDeleteData(item.index, displayIndex)"
                                class="deleteicon el-icon--right"
                            >
                                <circle-close></circle-close>
                            </el-icon>
                        </span>
                    </el-menu-item>
                    <el-menu-item
                        class="mybutton"
                        @click="handleAddData(true)"
                    >
                        添加数据
                    </el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="1-2">
                    <template #title >
                        <span style="color: gainsboro!important;">间接数据</span>
                    </template>
                    <el-menu-item
                        v-for="(item, displayIndex) of indirectDataList"
                        :ref="el => refs[displayIndex + directDataList.length] = el"
                        @click="handleDataSelection(item.index, displayIndex + directDataList.length)"
                        :class="{'selected':selectedDataIndex === item.index}"
                    >
                        <el-input v-model="item.data.title" @change="handleTitleChange(item.index)" @click.stop="handleTitleCopy(item.index)"></el-input>
                        <span>
                            <el-icon
                                @click.stop="handleDeleteData(item.index, displayIndex + directDataList.length)"
                                class="deleteicon el-icon--right"
                            >
                                <circle-close></circle-close>
                            </el-icon>
                        </span>
                    </el-menu-item>
                    <el-menu-item
                        class="mybutton"
                        @click="handleAddData(false)"
                    >
                        添加数据
                    </el-menu-item>
                </el-sub-menu>
            </el-sub-menu>
            <el-sub-menu index="2">
                <template #title>
                    <span style="color: gainsboro!important;">LaTeX制表</span>
                </template>
                <el-menu-item
                    v-for="(table,index) of tableList"
                    :ref="el => refs[index + directDataList.length + indirectDataList.length] = el"
                    @click="handleTableSelection(index, index + directDataList.length + indirectDataList.length)"
                    :class="{'selected':selectedTableIndex === index}"
                >
                    表{{ index + 1 }}
                    <span style="width: 58%;"></span>
                    <span>
                        <el-icon
                            @click="handleDeleteTable(index, index + directDataList.length + indirectDataList.length)"
                            class="deleteicon el-icon--right"
                        >
                            <circle-close></circle-close>
                        </el-icon>
                    </span>
                </el-menu-item>
                <el-menu-item
                    class="mybutton"
                    @click="handleAddTable()"
                >
                    添加表格
                </el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="3">
                <template #title>
                    <span style="color: gainsboro!important;">LaTeX制图</span>
                </template>
                <el-menu-item
                    v-for="(graph,index) of graphList"
                    :ref="el => refs[index + directDataList.length + indirectDataList.length + tableList.length] = el"
                    @click="handleGraphSelection(index, index + directDataList.length + indirectDataList.length + tableList.length)"
                    :class="{'selected':selectedGraphIndex === index}"
                >
                    图{{ index + 1 }}
                    <span style="width: 58%;"></span>
                    <span>
                        <el-icon
                            @click="handleDeleteGraph(index, index + directDataList.length + indirectDataList.length + tableList.length)"
                            class="deleteicon el-icon--right"
                        >
                            <circle-close></circle-close>
                        </el-icon>
                    </span>
                </el-menu-item>
                <el-menu-item
                    class="mybutton"
                    @click="handleAddGraph()"
                >
                    添加图
                </el-menu-item>
            </el-sub-menu>
            <el-menu-item index="4" @click="handleSwitchToReadme" :class="{'selected':isReadme}">使用指南</el-menu-item>
            <el-sub-menu index="5">
                <template #title>
                    <span style="color: gainsboro!important;">参考</span>
                </template>
                <el-menu-item index="5-1" @click="handleSwitchToNumberDoc" :class="{'selected':isNumberDoc}">参考：有效数字</el-menu-item>
                <el-menu-item index="5-2" @click="handleSwitchToUncerDoc" :class="{'selected':isUncerDoc}">参考：不确定度</el-menu-item>
                <el-menu-item index="5-3" @click="handleSwitchToPropertyDoc" :class="{'selected':isPropertyDoc}">参考：各项参数</el-menu-item>
            </el-sub-menu>
        </el-menu>
    </el-aside >
</div>
</template>
<script setup>
import { CircleClose } from '@element-plus/icons-vue';
import { useAllDataStore } from '../assets/stores';
import { computed, nextTick, onBeforeMount, onMounted, ref } from 'vue';
const store = useAllDataStore()
const dataList = computed(()=>store.state.dataList)
const tableList = computed(()=>store.state.tableList)
const graphList = computed(()=>store.state.graphList)
const selectedDataIndex = computed(()=>store.state.selectedDataIndex)
const selectedTableIndex = computed(()=>store.state.selectedTableIndex)
const selectedGraphIndex = computed(()=>store.state.selectedGraphIndex)
const isReadme = computed(()=>store.state.isReadme)
const isNumberDoc = computed(()=>store.state.isNumberDoc)
const isUncerDoc = computed(()=>store.state.isUncerDoc)
const isPropertyDoc = computed(()=>store.state.isPropertyDoc)
const directDataList = computed(() => {
    return dataList.value.map((data, index) => ({data, index})).filter(item => item.data.type === 'direct')
})
const indirectDataList = computed(() => {
    return dataList.value.map((data, index) => ({data, index})).filter(item => item.data.type === 'indirect')
})
const refs = ref([])
const displayLength = computed(() => {
    return directDataList.value.length + indirectDataList.value.length + tableList.value.length + graphList.value.length
})
const click = (displayIndex) => {
    if(displayIndex >= 0){
        refs.value[displayIndex].$el.click()
    }
}
const handleDataSelection = (index, displayIndex)=>{
    store.state.selectedDataIndex = index
    store.state.selectedTableIndex = -1
    store.state.selectedGraphIndex = -1
    store.state.selectedDisplayIndex = displayIndex
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleTableSelection = (index, displayIndex)=>{
    store.state.selectedTableIndex = index
    store.state.selectedDataIndex = -1
    store.state.selectedGraphIndex  = -1
    store.state.selectedDisplayIndex = displayIndex
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleGraphSelection = (index, displayIndex)=>{
    store.state.selectedGraphIndex = index
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex  = -1
    store.state.selectedDisplayIndex = displayIndex
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleTitleCopy = (index) =>{
    navigator.clipboard.writeText(dataList.value[index].title)
}
const handleDeleteData = async (index, displayIndex)=>{
    store.deleteData(index, displayIndex)
    await nextTick()
    click(store.state.selectedDisplayIndex)
}
const handleDeleteTable = async(index, displayIndex) => {
    store.deleteTable(index, displayIndex)
    await nextTick()
    click(store.state.selectedDisplayIndex)
}
const handleDeleteGraph = async(index, displayIndex) => {
    store.deleteGraph(index, displayIndex)
    await nextTick()
    click(store.state.selectedDisplayIndex)
}
const handleAddData = (flag) =>{
    store.addData(flag)
    if(flag){
        store.state.selectedDisplayIndex = directDataList.value.length - 1
    }
    else{
        store.state.selectedDisplayIndex = directDataList.value.length + indirectDataList.value.length - 1
    }
    store.state.selectedTableIndex = -1
    store.state.selectedGraphIndex  = -1
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleAddTable = () =>{
    store.addTable()
    store.state.selectedDisplayIndex = directDataList.value.length + indirectDataList.value.length + tableList.value.length - 1
    store.state.selectedDataIndex = -1
    store.state.selectedGraphIndex  = -1
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
    console.log(store.state.selectedDisplayIndex)
}
const handleAddGraph = () =>{
    store.addGraph()
    store.state.selectedDisplayIndex = directDataList.value.length + indirectDataList.value.length + tableList.value.length + graphList.value.length - 1
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex  = -1
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleTitleChange = (index)=>{
    store.state.dataList[index].named = true
}
const handleSwitchToReadme = ()=>{
    store.state.selectedDisplayIndex = -1
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex = -1
    store.state.isReadme = true
    store.state.selectedGraphIndex  = -1
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleSwitchToNumberDoc =()=>{
    store.state.selectedDisplayIndex = -1
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex = -1
    store.state.isReadme = false
    store.state.selectedGraphIndex  = -1
    store.state.isNumberDoc = true
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleSwitchToUncerDoc =()=>{
    store.state.selectedDisplayIndex = -1
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex = -1
    store.state.isReadme = false
    store.state.selectedGraphIndex  = -1
    store.state.isNumberDoc = false
    store.state.isUncerDoc = true
    store.state.isPropertyDoc = false
}
const handleSwitchToPropertyDoc =()=>{
    store.state.selectedDisplayIndex = -1
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex = -1
    store.state.isReadme = false
    store.state.selectedGraphIndex  = -1
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = true
}
const handleKeydown = (event) => {
    if(event.ctrlKey){
        switch(event.key){
            case 'd':
                handleAddData(true)
                return
            case 'i':
                handleAddData(false)
                return
            case 't':
                handleAddTable()
                return
            case 'f':
                handleAddGraph()
            case 's':
                store.saveFile()
        }
    }
    switch (event.key) {
        case 'ArrowDown':
            if(store.state.selectedDisplayIndex === -1){
                return
            }
            store.state.selectedDisplayIndex++
            if(store.state.selectedDisplayIndex === displayLength.value){
                store.state.selectedDisplayIndex = 0
            }
            click(store.state.selectedDisplayIndex)
            break
        case 'ArrowUp':
            if(store.state.selectedDisplayIndex === -1){
                return
            }
            store.state.selectedDisplayIndex--
            if(store.state.selectedDisplayIndex === -1){
                store.state.selectedDisplayIndex = displayLength.value - 1
            }
            click(store.state.selectedDisplayIndex)
            break
        default:
            break;
    }
}
onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})
onBeforeMount(() => {
    document.removeEventListener('keydown', handleKeydown)
})
</script>
<style lang="less" scoped>
.el-menu{
    border-right: none;
    font-weight: bold;
    .el-menu-item{
        line-height: 48px;
        color: gainsboro;
        text-align: center !important;
        width: 100%;
    }
}
.el-aside{
    height: 100%;
    background-color: #626aef;
}
.common-aside{
    width: 13vw;
    min-width: 200px;
    color: gainsboro;
}
.deleteicon:hover{
    color: red;
}
.mybutton:focus{
    background-color: rgba(0,0,0,0);
}
.mybutton:active{
    background-color: gray;
}
.selected{
    background-color: #1520f5 !important;
    color: aliceblue;
}
:deep(.el-input__inner) {
    text-align: center;
}
</style>