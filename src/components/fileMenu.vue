<template>
  <div class="file-menu">
    <div class="file-menu-icon">
      <i v-for="(i, d) in icons" :key="i" class="iconfont" :class="i"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义顶部icon - 静态
const icons = [
  "icon-xinjianwenjian",
  "icon-xinjianwenjianjia",
  "icon-zidongliuchengxiafaliebiao",
];
</script>

<style lang="less" scoped>
@import url("../assets/font_4568361_difd97dq5u4/iconfont.css");
.file-menu {
  width: 220px;
  border-right: solid #ccc 1px;
}
</style>
