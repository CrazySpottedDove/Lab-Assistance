<template>
<div class="common-aside">
    <el-aside width="100%">
        <el-menu
            background-color="#626aef"
            :default-openeds="['1', '1-1','1-2']"
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
                        <el-input v-model="data.title" @change="handleTitleChange(index)"></el-input>
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
                        @click="handleAddData('direct')"
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
                        <el-input v-model="data.title" @change="handleTitleChange(index)"></el-input>
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
                        @click="handleAddData('indirect')"
                    >
                        添加数据
                    </el-menu-item>
                </el-sub-menu>
            </el-sub-menu>
            <el-menu-item index="2" @click="handleSwitchToOutput" :class="{'selected':isOutput}">LaTeX制表</el-menu-item>
            <el-menu-item index="3" @click="handleSwitchToLine" :class="{'selected':isLine}">LaTeX制图</el-menu-item>
            <el-menu-item index="4" @click="handleSwitchToReadme" :class="{'selected':isReadme}">使用指南</el-menu-item>
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
const selectedDataIndex = computed(()=>store.state.selectedDataIndex)
const isLine = computed(()=>store.state.isLine)
const isReadme = computed(()=>store.state.isReadme)
const isOutput = computed(()=>store.state.isOutput)
const handleDataSelection = (index)=>{
    store.state.selectedDataIndex = index
    store.state.isLine = false
    store.state.isReadme = false
    store.state.isOutput = false
}
const handleDeleteData = (index)=>{
    store.deleteData(index)
    store.state.isLine = false
    store.state.isReadme = false
    store.state.isOutput = false
}
const handleAddData = (type) =>{
    store.addData(type)
    store.state.isLine = false
    store.state.isReadme = false
    store.state.isOutput = false
}
const handleTitleChange = (index)=>{
    store.state.dataList[index].named = true
}
const handleSwitchToLine = ()=>{
    store.state.selectedDataIndex = -1
    store.state.isLine = true
    store.state.isReadme = false
    store.state.isOutput = false
}
const handleSwitchToReadme = ()=>{
    store.state.selectedDataIndex = -1
    store.state.isReadme = true
    store.state.isLine = false
    store.state.isOutput = false
}
const handleSwitchToOutput =()=>{
    store.state.selectedDataIndex = -1
    store.state.isOutput = true
    store.state.isReadme = false
    store.state.isLine = false
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