<script setup>
import { dataFormat } from '../../assets/format';
const props = defineProps({
    analysis: Object,
})
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

</script>
<template>
    <div class="card-div">
        <el-card shadow="hover">
            <el-table :data="Object.values(props.analysis)">
                <el-table-column v-for="(property, index) in propertyLabel" :key="index" :prop="property.prop"
                    :label="property.label" align="center">
                    <template #default="scope">
                        <vue-latex :expression="dataFormat(scope.row[property.prop])"
                            style="font-size: small;"></vue-latex>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<style lang="less" scoped>
@import (css) '../mainPageStyle.css';
</style>