<template>
  <el-row type="flex" class="row-bg" justify="center">
    <el-col :span="6">
      <h2>欢迎来到校园体育器材管理系统</h2>
      <el-image :src="require('@/assets/login.png')" style="height: 180px; width: 180px;"></el-image>

      <p>体育使学校充满活力，学校因体育勃发生机</p>

    </el-col>

    <div :span="1">
      <el-divider direction="vertical"></el-divider>
    </div>
    <el-col :span="6">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
        <el-form-item label="用户名" prop="username" style="width: 380px;">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password"  style="width: 380px;">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code"  style="width: 380px;">
          <el-input v-model="loginForm.code"  style="width: 172px; float: left" maxlength="5"></el-input>
          <el-image :src="captchaImg" class="captchaImg" @click="getCaptcha"></el-image>
        </el-form-item>

        <div style="display: flex; justify-content: center;">
          <el-button type="primary" @click="submitForm('loginForm')" style="margin-left: 50px;">立即登录</el-button>
          <el-button @click="resetForm('loginForm')">重置</el-button>
        </div>
      </el-form>
    </el-col>
  </el-row>

</template>

<script>

import qs from 'qs'

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: 'wushangze',
        password: '111111',
        code: '11111',
        token: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 18, message: '长度为 4 ~ 18 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度为 6 ~ 18 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 5, max: 5, message: '长度为 5 个字符', trigger: 'blur' }
        ],
      },
      captchaImg: null
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.post('/login?' + qs.stringify(this.loginForm)).then(res => {
            const jwt = res.headers['authorization']

            console.log("store:" + this.$store)
            this.$store.commit('SET_TOKEN', jwt)
            this.$router.push("/index")
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getCaptcha() {
      this.$axios.get('/captcha').then(res => {

        console.log("/captcha")
        console.log(res)

        this.loginForm.token = res.data.data.token
        this.captchaImg = res.data.data.captchaImg
        this.loginForm.code = ''
      })
    }
  },
  created() {
    this.getCaptcha()
  }
}
</script>

<style scoped>

.el-row {
  background-color: #fafafa;
  height: 100vh;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  text-align: center;
  justify-content: center;
}

.el-divider {
  height: 200px;
}

.captchaImg {
  float: left;
  margin-left: 8px;
  border-radius: 4px;
}


</style>