<script setup>
import { onMounted, ref } from 'vue'
import './views/paginator';

let myview;
let myiframe;
onMounted(() => {
    init();
})

const init = () => {
    myview = document.createElement('foliate-paginator');
    document.body.append(myview);
    myiframe = myview.view.iframe;
    return new Promise(resolve => {
        myiframe.addEventListener('load', () => {
            myiframe.style.display = 'none';
            myiframe.style.display = 'block';
            resolve();
        }, { once: true })
        myiframe.src = './1.html'
    });

}

</script>
<template>
</template>
<style></style>