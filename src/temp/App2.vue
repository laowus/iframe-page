<script setup>
import { onMounted, ref } from 'vue';
import './view.js'

let view;

onMounted(() => {
    view = document.createElement('foliate-view')
    document.body.append(view)
})

</script>
<template>

</template>
<style></style>