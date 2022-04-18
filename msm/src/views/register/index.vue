<template>
  <div class="register-container">
    <el-form
      :model="form"
      status-icon
      :rules="rules"
      ref="form"
      label-width="100px"
      class="register-form"
    >
      <h2 class="register-title">注册</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="form.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="form.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button @click="goLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
 
<script>
import {register} from '@/api/register'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.form.checkPass !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        username: "",
        nickname: "",
        password: "",
        checkPass: "",
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
        username: [
          { required: true, message: "账号不能为空", trigger: "blur" },
        ],
        nickname: [
          { required: true, message: "昵称不能为空", trigger: "blur" },
        ],
      },
    };
  },

  components: {},
 
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
        //   alert("submit!");
        register(this.form.username,this.form.nickname,this.form.password).then(res=>{
            // console.log(res.data);
            var resp = res.data;
            if(resp.flag){
              console.log('注册成功');
              this.$router.push('/login')
            }else{
              this.$message({
                message:resp.message,
                type:"warning"
              })
            }
        })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    goLogin(){
      this.$router.push('/login')
    }
  },
};
</script>

<style scoped>
.register-container {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url(../../assets/nbaregister.png);
  background-size: cover;
}
.register-form {
  width: 350px;
  margin: 160px auto;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 30px;
  border-radius: 20px;
}
.register-title {
  text-align: center;
}
</style>