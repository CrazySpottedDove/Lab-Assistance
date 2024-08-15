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
<style scoped lang="less">

.common-layout,.lay-container{
    height: 100%;
}
.el-header{
    width: 87vw;
    height: 10vh;
}
</style>