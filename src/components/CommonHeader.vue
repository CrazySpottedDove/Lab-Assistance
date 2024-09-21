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
        <span>

        </span>
        <span>

        </span>
    </div>
</template>
<script setup>
import { FolderChecked,FolderOpened } from '@element-plus/icons-vue';
import { saveAs } from "file-saver";
import { useAllDataStore } from '../assets/stores';
import {ref} from 'vue'
const store = useAllDataStore()

const handleFileSave = ()=>{
    if(store.state.dataList.length === 0){
        ElMessage.error('没有数据，无法保存！')
    }
    else{
        const jsonContent = JSON.stringify(store.state, null, 2)
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8' });
        let filename = ''
        store.state.dataList.forEach(item => {
            filename += `${item.title}-`
        })
        saveAs(blob, `${filename}.json`); // 使用 FileSaver.js 保存 JSON 文件
    }
}

const fileLoad = ref(null)
const triggerFileLoad = ()=>{
    fileLoad.value.click()
}
const handleFileLoad = (event)=>{
    const file = event.target.files[0];
    if (file && file.type === 'application/json') {
        const reader = new FileReader();
        // 文件读取完成时的回调
        reader.onload = (e) => {
            try {
                const result = e.target.result; // 获取文件内容
                store.state = JSON.parse(result); // 解析 JSON 并存储
            }
            catch (error) {
                ElMessage.error('读取文件过程出错！')
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file); // 读取文件内容为文本
        event.target.value = '';
    }
    else {
        alert('请上传一个 JSON 文件');
    }
}
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