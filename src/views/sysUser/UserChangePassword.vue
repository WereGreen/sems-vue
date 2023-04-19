<template>
  <div style="text-align: center;">
    <h2>你好！</h2>

    <el-form :model="passForm" status-icon :rules="rules" ref="passForm" label-width="100px">
      <el-form-item label="旧密码" prop="currentPass">
        <el-input type="password"
                  v-model="passForm.currentPass"
                  clearable
                  :maxlength="18"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input type="password"
                  v-model="passForm.password"
                  show-password
                  clearable
                  @input="passwordInput"
                  :maxlength="18"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password"
                  v-model="passForm.checkPass"
                  show-password
                  clearable
                  @input="checkPassInput"
                  :maxlength="18"
                  autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('passForm')">提交</el-button>
        <el-button @click="resetForm('passForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "UserChangePassword",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      userInfo: {
      },
      passForm: {
        username: '',
        password: '',
        checkPass: '',
        currentPass: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度为 6 ~ 18 个字符', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        currentPass: [
          { required: true, message: '请输入当前密码', trigger: 'blur' },
        ]
      },
      username: '',
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {

    getUserInfo() {
      this.$axios.get("/tb/userInfo").then(res => {

        this.username = res.data.data.username;
        this.passForm.username = res.data.data.username;

        console.log("this.userInfo.name")
        console.log(this.userInfo.name)

      })
    },

    passwordInput(val){
      let codeReg = new RegExp("[A-Za-z0-9]+"), //正则 英文+数字；
          len=val.length,
          str='';
      for(var i=0;i<len;i++){
        if(codeReg.test(val[i])){
          str+=val[i];
        }
      }
      this.passForm.password=str;
    },

    checkPassInput(val){
      let codeReg = new RegExp("[A-Za-z0-9]+"), //正则 英文+数字；
          len=val.length,
          str='';
      for(var i=0;i<len;i++){
        if(codeReg.test(val[i])){
          str+=val[i];
        }
      }
      this.passForm.checkPass=str;
    },


    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          this.passForm.username = this.username;
          this.$axios.post("/tb/user/updatePassword", this.passForm).then(res => {

            this.$message({
              type: 'success',
              message: '修改用户密码成功!请重新登录！(即将跳转到登录页面)'
            });
            var storage = window.localStorage;
            storage.clear();

            this.$router.push("/login")

          })



        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style scoped>
.el-form {
  width: 420px;
  margin: 50px auto;
}
</style>