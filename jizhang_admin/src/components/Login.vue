<template>
  <div class="login_container">
    <!-- 背景粒子效果 -->
    <vue-particles
      class="login-bg"
      color="#FFD700"
      :particleOpacity="0.7"
      :particlesNumber="100"
      shapeType="circle"
      :particleSize="4"
      linesColor="#C0C0C0"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>
    <div class="login_box">
      <!-- 登录表单区域 -->
      <div class="title">记账后台管理平台</div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      user: "admin",
      paw: "123456",
      loginForm: {
        username: "",
        password: "",
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: "请输入登录名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm() {
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      if (this.loginForm.username && this.loginForm.password) {
        if (
          this.loginForm.username == this.user &&
          this.loginForm.password == this.paw
        ) {
          this.$message.success("登录成功！");
          this.$router.push("/home");
        } else {
          this.$message.error("管理员用户名或密码错误！");
        }
      } else {
        this.$message.error("管理员用户名或密码不能为空！");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  width: 100%;
  height: 100%;
  /*如果想做背景图片 可以给标签一个class 直接添加背景图*/
  position: relative;
  background-color: #3e3e3e;
}
.login-bg {
  width: 100%;
  height: 100%;
  background: #3e3e3e;
}

.login_box {
  width: 400px;
  height: 270px;
  background: hsla(0, 0%, 100%, 0.3);
  border: 1px solid #f7f7f7;
  border-radius: 5px;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 60px;
    font-size: 24px;
    color: white;
    border-bottom: 1px solid #ffffff;
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
