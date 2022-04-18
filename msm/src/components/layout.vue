<template>
  <div>
    <div class="header">
      <app-header />
    </div>
    <div class="navbar">
      <app-navbar />
    </div>
    <div class="main">
      <app-main />
    </div>
  </div>
</template>

<script>
import AppHeader from "./AppHeader";
import AppNavbar from "./AppNavbar";
import AppMain from "./AppMain";
export default {
  data() {
    return {};
  },

  components: {
    AppHeader,
    AppNavbar,
    AppMain,
  },

  methods: {},
};
</script>

<style scoped>
/* 头部区域 */
.header {
  position: absolute;
  line-height: 70px;
  padding: 0px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #1473ee;
}
/* 左侧导航栏 */
.navbar {
  position: absolute;
  text-align: left;
  width: 230px;
  top: 70px;
  left: 0px;
  bottom: 0px;
  overflow-y: auto;
  background-color: #182c72;
}
/* 右侧主区域 */
.main {
  position: absolute;
  top: 70px;
  left: 230px;
  right: 0px;
  bottom: 0px;
  overflow-y: auto;
  padding: 10px;
  /* background-color: red; */
}
</style>