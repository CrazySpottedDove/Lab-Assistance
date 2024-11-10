<script setup>
import { ref } from 'vue';
import { unitFormat } from '../../assets/format';

const props = defineProps({
    unit: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:unit']);

const localUnit = ref(props.unit);

const handleInput = () => {
    emit('update:unit', props.unit=localUnit.value);
};
</script>

<template>
    <div class="card-div">
        <el-card shadow="hover">
            <div class="equipment">
                <label style="font-weight: 550;width: 16%;text-align: left;">单位</label>
                <el-input style="text-align: center;width: 84%;" placeholder="选填，仅对LaTeX制表/图有影响" v-model="localUnit"
                    @input="handleInput"></el-input>
                <span style="width: 2%; min-width: 1em;"></span>
                <label style="font-weight: 550;width: 16%;text-align: left;">预览</label>
                <span style="width: 84%; " class="fake-input">
                    <vue-latex :expression="unitFormat(localUnit)"></vue-latex>
                </span>
            </div>
        </el-card>
    </div>
</template>

<style lang="less" scoped>
@import (css) '../mainPageStyle.css';
</style>