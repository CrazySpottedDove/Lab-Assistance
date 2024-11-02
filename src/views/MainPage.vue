<script setup>
import 'katex/dist/katex.css'
import DataView from './DataView.vue';
import TableView from './TableView.vue';
import GraphView from './GraphView.vue';
import ReadmeView from './ReadmeView.vue';
import DocView from './DocView.vue';

import { useAllDataStore } from '../assets/stores';
import { handleKeyDown } from '../assets/keyBoard';
import { onMounted, onBeforeUnmount } from 'vue';
const store = useAllDataStore();
const wrappedHandleKeyDown = (event) => {
    handleKeyDown(event, store)
}

onMounted(() => {
    document.addEventListener('keydown', wrappedHandleKeyDown)
})
onBeforeUnmount(() => {
    document.removeEventListener('keydown', wrappedHandleKeyDown)
})

</script>
<template>
    <data-view></data-view>
    <graph-view></graph-view>
    <table-view></table-view>
    <readme-view></readme-view>
    <doc-view></doc-view>
</template>
<style lang="less" scoped>
</style>