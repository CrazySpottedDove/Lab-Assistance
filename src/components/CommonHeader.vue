<template>
    <div class="header" >
        <span style="text-align: center; width: 100%; font-weight: bold; font-size: larger;">普物实验数据处理小助手
            <el-icon class="saveicon el-icon--right" @click="handleFileSave">
                <folder-checked></folder-checked>
            </el-icon>
            <el-icon class="saveicon el-icon--right" @click="triggerFileLoad">
                <folder-opened></folder-opened>
            </el-icon>
            <input type="file" @change="handleFileLoad" accept=".json" style="display: none;" ref="fileLoad">
        </span>
    </div>
</template>
<script setup>
import { FolderChecked,FolderOpened } from '@element-plus/icons-vue';
import { useAllDataStore } from '../assets/stores';
import {ref, onMounted, onBeforeUnmount, watch} from 'vue'

const store = useAllDataStore()
async function readUserConfig(){
    const {readUserConfig} = await import('../../supplement/arrangeFile.js')
    store.userConfig = readUserConfig()
}
async function saveStateOnExit(state){
    const { saveStateOnExit } = await import('../../supplement/arrangeFile.js')
    saveStateOnExit(state)
}

async function openFile(event, state){
    const {openFile} = await import('../../supplement/arrangeFile.js')
    openFile(event, state)
}
const handleFileSave = ()=>{
    ElMessage.success("文件已保存")
    saveStateOnExit(store.state)
}
const fileLoad = ref(null)
const triggerFileLoad = ()=>{
    fileLoad.value.click()
}
const handleFileLoad = (event)=>{
    openFile(event, store.state)
}

const handleKeydown = (event) => {
    if(event.ctrlKey){
        switch(event.key){
            case 's':
                event.preventDefault()
                handleFileSave()
                return
            case 'o':
                event.preventDefault()
                fileLoad.value.click()
                return
        }
    }
}
onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
    readUserConfig()
})

onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
})

watch(store.state, (newState) => {
    console.log('detect change, save file')
    console.log(newState)
    if(store.userConfig.autoSaveFile){
        saveStateOnExit(newState)
    }
},{deep:true})

</script>
<style  lang="less" scoped>
    .header{
        display: flex;
        align-items: center;
        width: 100%;
        height: 100%;
        color: dimgrey;
    }
    .r-content{
        .user{
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
    }
    .l-content{
        display: flex;
        align-items:center;
    }
    .saveicon:hover{
        color: lawngreen
    }
    .saveicon{
        cursor: pointer;
    }
</style>