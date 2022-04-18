<template>
  <div>
    <el-menu
      :router="true"
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      background-color="#182c72"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/home">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>

      <el-menu-item index="/player/">
        <i class="el-icon-s-custom"></i>
        <span slot="title">球员信息</span>
      </el-menu-item>

      <el-menu-item index="/team/">
        <i class="el-icon-basketball"></i>
        <span slot="title">球队信息</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  methods: {},
};
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>