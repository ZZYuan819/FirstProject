<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item class="line" :to="{ path: $route.path }">{{$route.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
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
.el-breadcrumb{
    height: 10px;
    padding: 20px;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
    background-color: #fff;
}
.line{
    border-left: 3px solid rgba(38, 207, 103, 0.733);
    padding-left: 5px;
}
</style>