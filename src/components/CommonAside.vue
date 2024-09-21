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
                        v-for="(data,index) of dataList"
                        :key="index"
                        @click="handleDataSelection(index)"
                        :class="{'selected':selectedDataIndex === index}"
                        v-show="data ? data.type === 'direct' : false"
                    >
                        <el-input v-model="data.title" @change="handleTitleChange(index)" @click.stop="handleTitleCopy(index)"></el-input>
                        <span>
                            <el-icon
                                @click="handleDeleteData(index)"
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
                        v-for="(data,index) of dataList"
                        :key="index"
                        @click="handleDataSelection(index)"
                        :class="{'selected':selectedDataIndex === index}"
                        v-show="data ? data.type === 'indirect' : false"
                    >
                        <el-input v-model="data.title" @change="handleTitleChange(index)" @click.stop="handleTitleCopy(index)"></el-input>
                        <span>
                            <el-icon
                                @click="handleDeleteData(index)"
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
                    :key="index"
                    @click="handleTableSelection(index)"
                    :class="{'selected':selectedTableIndex === index}"
                >
                    表{{ index + 1 }}
                    <span style="width: 58%;"></span>
                    <span>
                        <el-icon
                            @click="handleDeleteTable(index)"
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
                    :key="index"
                    @click="handleGraphSelection(index)"
                    :class="{'selected':selectedGraphIndex === index}"
                >
                    图{{ index + 1 }}
                    <span style="width: 58%;"></span>
                    <span>
                        <el-icon
                            @click="handleDeleteGraph(index)"
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
import { computed } from 'vue';
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
const handleDataSelection = (index)=>{
    store.state.selectedDataIndex = index
    store.state.selectedTableIndex = -1
    store.state.selectedGraphIndex = -1
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleTableSelection = (index)=>{
    store.state.selectedTableIndex = index
    store.state.selectedDataIndex = -1
    store.state.selectedGraphIndex  = -1
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleGraphSelection = (index)=>{
    store.state.selectedGraphIndex = index
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex  = -1
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleTitleCopy = (index) =>{
    navigator.clipboard.writeText(dataList.value[index].title)
}
const handleDeleteData = (index)=>{
    store.deleteData(index)
    store.state.selectedTableIndex = -1
    store.state.selectedGraphIndex  = -1
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleDeleteTable = (index) => {
    store.deleteTable(index)
    store.state.selectedDataIndex = -1
    store.state.selectedGraphIndex  = -1
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleDeleteGraph = (index) => {
    store.deleteGraph(index)
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex  = -1
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleAddData = (flag) =>{
    store.addData(flag)
    store.state.selectedTableIndex = -1
    store.state.selectedGraphIndex  = -1
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleAddTable = () =>{
    store.state.selectedDataIndex = -1
    store.addTable()
    store.state.selectedGraphIndex  = -1
    store.state.isReadme = false
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleAddGraph = () =>{
    store.state.selectedDataIndex = -1
    store.addGraph()
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
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex = -1
    store.state.isReadme = true
    store.state.selectedGraphIndex  = -1
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleSwitchToNumberDoc =()=>{
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex = -1
    store.state.isReadme = false
    store.state.selectedGraphIndex  = -1
    store.state.isNumberDoc = true
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = false
}
const handleSwitchToUncerDoc =()=>{
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex = -1
    store.state.isReadme = false
    store.state.selectedGraphIndex  = -1
    store.state.isNumberDoc = false
    store.state.isUncerDoc = true
    store.state.isPropertyDoc = false
}
const handleSwitchToPropertyDoc =()=>{
    store.state.selectedDataIndex = -1
    store.state.selectedTableIndex = -1
    store.state.isReadme = false
    store.state.selectedGraphIndex  = -1
    store.state.isNumberDoc = false
    store.state.isUncerDoc = false
    store.state.isPropertyDoc = true
}
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