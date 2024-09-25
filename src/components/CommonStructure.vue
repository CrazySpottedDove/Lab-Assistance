<script setup>
import CommonHeader from './CommonHeader.vue';
import CommonAside from './CommonAside.vue';
import MainPage from '../views/MainPage.vue'
</script>
<template>

<div class="common-layout">
    <el-container class="lay-container">
        <common-aside/>
        <el-container>
            <el-header class="el-header">
                <common-header/>
            </el-header>
            <el-main class="right-main">
                <main-page></main-page>
            </el-main>
        </el-container>
    </el-container>
</div>

</template>
<style  lang="less">

.common-layout,.lay-container{
    height: 100%;
}
.el-header{
    width: 87vw;
    height: 8vh;
}
// body {
//   width: 100%;
//   height: 100%;
//   background-color: #121212;
//   color:#E0E0E0;
// //   background-color: #f5f5f5;
//   font-family: 'PingFangSC-Light', 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', 'Arial', 'sans-serif';
// }
</style>