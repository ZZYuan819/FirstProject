<template>
  <div>
    <a href="/">
      <img class="logo" src="@/assets/nba-icon.webp" height="60px" />
      <span class="company">球员信息库</span>
    </a>
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link">
        {{ user.username }}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">修改密码</el-dropdown-item>
        <el-dropdown-item command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      :visible.sync="dialogTableVisible"
      width="500px"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
      >
        <el-form-item label="原密码" prop="oldPass">
          <el-input v-model="ruleForm.oldPass"></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="pass">
          <el-input
            type="password"
            v-model="ruleForm.pass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >提交</el-button
        >
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form>
    </el-dialog>
  </div>
</template> 

<script>
import { logout } from "@/api/login.js";
import passwordApi from "@/api/password.js";
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      // console.log(value);
      passwordApi.checkPwd(this.user.id, value).then((res) => {
        var resp = res.data;
        if (resp.flag) {
          callback();
        } else {
          callback(new Error(resp.message));
        }
      });
    };
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      user: JSON.parse(localStorage.getItem("NBA-user")),
      dialogTableVisible: false,
      ruleForm: {
        oldPass: "",
        pass: "",
        checkPass: "",
      },
      rules: {
        oldPass: [
          { required: true, message: "原密码不能为空", trigger: "blur" },
          { validator: validatePass, trigger: "blur" },
        ],
        pass: [{ required: true, message: "新密码不能为空", trigger: "blur" }],
        checkPass: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { validator: validatePass2, trigger: "blur" },
        ],
      },
    };
  },

  components: {},

  methods: {
    handlePwd() {
      this.dialogTableVisible = true;
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          passwordApi
            .updatePwd(this.user.id, this.ruleForm.checkPass)
            .then((res) => {
              var resp = res.data;
              this.$message({
                type: resp.flag ? "success" : "error",
                message: resp.message,
              });
              if (resp.flag) {
                this.handleLogout();
                this.dialogTableVisible = false;
              }
            });
        } else {
          return false;
        }
      });
    },
    handleLogout() {
      logout(localStorage.getItem("NBA-token")).then((res) => {
        const resp = res.data;
        if (resp.flag) {
          localStorage.removeItem("NBA-token");
          localStorage.removeItem("NBA-user");
          this.$router.push("/login");
        } else {
          this.$message({
            message: resp.message,
            type: "error",
          });
          this.$router.push("/login");
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleCommand(command) {
      switch (command) {
        case "a":
          this.handlePwd();
          break;
        case "b":
          this.handleLogout();
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.logo {
  float: left;
  vertical-align: middle;
  /* 上 右 下 左 */
  padding: 0 10px 0 40px;
}
.company {
  position: absolute;
  left: 200px;
  color: white;
  font-size: 24px;
}
.el-dropdown-link {
  cursor: pointer;
  color: white;
}
.el-icon-arrow-down {
  cursor: pointer;
  font-size: 12px;
}
.el-dropdown {
  float: right;
  margin-right: 40px;
}
</style>