<script setup>
import { onMounted, ref } from 'vue';
const iframeRef = ref(null);
const sizeRef = ref([]);
const $ = document.querySelector.bind(document)
const contentRange = document.createRange()
const container = $('#page-area')

onMounted(() => {
    initIframe();
});

const initIframe = () => {
    iframeRef.value.src = './1.html';
    iframeRef.value.onload = () => {
        handleResize();
    }
}

// 监听窗口大小变化
const handleResize = () => {
    setWindowSize();
    iframeRef.value.width = sizeRef.value[0] - 20;
    iframeRef.value.height = sizeRef.value[1] - 20;
    setBodyCss();
}

// 获取当前窗口的宽度和高度
const setWindowSize = () => {
    sizeRef.value = [window.innerWidth, window.innerHeight];
}
const setBodyCss = () => {
    let doc = iframeRef.value.contentDocument;
    console.log(doc);
    if (doc) {
        const textWidth = iframeRef.value.width / 2 - 80;
        const style = `width: auto;height: 100%;overflow-y: hidden;overflow-X: hidden;padding-left: 0px;padding: 10px;margin: 0px;box-sizing: border-box;max-width: inherit;column-fill: auto;column-gap: 60px; column-width:${textWidth}px;`;
        doc.documentElement.setAttribute("style", style);
        contentRange.selectNodeContents(doc.body);
        const contentRect = contentRange.getBoundingClientRect();
        const pages = Math.round(contentRect.width / iframeRef.value.width);
    }
}
// 监听resize事件
window.addEventListener('resize', handleResize);

</script>

<template>
    <div id="page-area">
        <iframe ref="iframeRef" class="no-border" scrolling="no">
        </iframe>
    </div>
</template>

<style>
.no-border {
    border: none;
}
</style>
