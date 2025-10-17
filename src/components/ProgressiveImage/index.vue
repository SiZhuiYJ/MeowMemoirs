<template>
    <div class="progressive">
        <img class="img placeholder" :src="placeholder" />
        <img @load="handleLoaded" class="img origin" :src="origin" />
    </div>
</template>

<script setup lang="ts">
defineProps({
    placeholder: String,
    origin: String
});
function handleLoaded(e: Event) {
    const target = e.target as HTMLImageElement;
    if (target.parentElement) {
        target.parentElement.classList.add("loaded");
    }
}
</script>

<style setup lang="scss">
.progressive {
    position: relative;
}

.img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    transition: 0.6s;
}

.origin {
    opacity: 0;
    position: absolute;
    left: 0;
    top: 0;
    filter: blur(10px);
}

.loaded .origin {
    opacity: 1;
    filter: blur(0);
}
</style>
