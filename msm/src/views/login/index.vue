<template>
  <div class="login-container">
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="form"
      label-width="100px"
      class="login-form"
    >
      <h2 class="login-title">登录</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">登录</el-button>
        <el-button @click="goRegister">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login, getUserInfo } from "@/api/login";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
    };
  },

  components: {},

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          login(this.form.username, this.form.password).then((res) => {
            var resp = res.data;
            if (resp.flag) {
            //   console.log(resp);
              getUserInfo(resp.data.token).then((res) => {
                const respUser = res.data;
                console.log(respUser);
                localStorage.setItem('NBA-token',resp.data.token);
                localStorage.setItem('NBA-user',JSON.stringify(respUser.data))
                this.$router.push('/')
              });
            } else {
              this.$message({
                message: resp.message,
                type: "error",
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    goRegister() {
        this.$router.push('/register');
    },
  },
};
</script>

<style scoped>
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url(../../assets/nbalogin.png);
  background-size: cover;
}
.login-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 30px;
  border-radius: 20px;
}
.login-title {
  text-align: center;
}
</style>