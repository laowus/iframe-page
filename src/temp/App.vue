<script setup>
import { ref, onMounted } from 'vue'
const fatherRef = ref(null);
onMounted(() => {
    init();
})
const init = () => {
    fatherRef.value.scrollLeft = 100;
}
const go = (flag) => {
    const size = flag === -1 ? -100 : 100;
    fatherRef.value.scrollLeft = fatherRef.value.scrollLeft + size;
}
</script>
<template>
    <div id="container">
        <div id="father" ref="fatherRef">
            <div id="son">
                “渔舟逐波受山春，两岸桃花来古津，坐看红树不知远，行书清溪忽值人……”
                “当时只记入山深，青溪几度到云罢？春来遍是桃花水，不辩仙源何处寻。”
                以上两折乐府，是唐代大诗人王维所作，用来描述天下闻名的桃花源。
                这片人间乐土，在湘北沅陵和桃源之间，由洞庭湖乘船沿沅江逆水而上，过常德、桃源，经张家湾到水溪，弃舟登岸，满山桃林掩映着一座规范宏大的的庙宇，那是后世修道人所建立的玄都观。
                这正是阳春三月，桃花努放时节，沅江岸畔，玄都岸外，遍地桃花盛开，如锦如绣，忽然由桃林深处，走出一条白衣少女，左手捧着一束桃花，右手轻提白绫罗裙，碎步轻盈，绕林而出，缓缓向江边走去。
                白衣女本来长的就美，再衬着一身雅淡白装，愈觉着迥出尘表，
            </div>
        </div>
        <div id="bottom">
            <input type="button" value="<<" @click="go(-1)"> <input type="button" value=">>" @click="go(1)">
        </div>
    </div>

</template>

<style>
#container {
    justify-items: center;
    align-items: center;
}

#father {
    background-color: blanchedalmond;
    width: 210px;
    height: 200px;
    overflow: hidden;
}

#son {
    width: 600px;
    height: 200px;
}

#bottom {
    display: flex;
    width: 200px;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 5px;
}
</style>
