<template>
  <div>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="formInline.user" placeholder="请输入姓名"></el-input>
      </el-form-item>

      <el-form-item label="用户名">
        <el-input v-model="formInline.user" placeholder="请输入用户名"></el-input>
      </el-form-item>

      <el-form-item label="用户角色">
        <el-select v-model="formInline.region" placeholder="请选择用户角色">
          <el-option label="管理员" value="0"></el-option>
          <el-option label="超级管理员" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="用户状态">
        <el-select v-model="formInline.region" placeholder="请选择用户状态">
          <el-option label="正常" value="0"></el-option>
          <el-option label="禁用" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="">查询</el-button>
        <el-button @click="resetForm('')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="dialogFormVisible = true">新增用户</el-button>

    <el-dialog
        title="新增用户"
        center
        width="30%"
        :visible.sync="dialogFormVisible">


      <div>
        <el-form :model="formInline" label-position="right" label-width="80px">

          <el-form-item label="姓名">
            <el-input v-model="formInline.user" style="width: 220px;" placeholder="请输入姓名"></el-input>
          </el-form-item>


          <el-form-item label="用户名">
            <el-input v-model="formInline.user" style="width: 220px;" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="pass">
            <el-input type="password"
                      style="width: 220px;"
                      v-model="formInline.pass"
                      placeholder="请输入密码"
                      autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password"
                      style="width: 220px;"
                      v-model="formInline.checkPass"
                      placeholder="请再次输入密码"
                      autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="用户角色">
            <el-select v-model="formInline.region" placeholder="请选择用户角色">
              <el-option label="管理员" value="0"></el-option>
              <el-option label="超级管理员" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="系统权限" v-if="formInline.region != 1">
            <el-checkbox-group v-model="checkboxGroup" size="small">
              <el-checkbox-button v-for="jurisdiction in jurisdictions" :label="jurisdiction" :disabled="jurisdiction === '北京'" :key="jurisdiction">{{jurisdiction}}</el-checkbox-button>
            </el-checkbox-group>

            <el-checkbox :indeterminate="isIndeterminate"
                         v-model="checkAll"
                         @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 10px 0;"></div>

            <el-checkbox-group
                v-model="checkedjurisdictions"
                @change="handleCheckedjurisdictionsChange">
              <el-checkbox
                  v-for="jurisdiction in jurisdictions"
                  :label="jurisdiction"
                  :disabled="jurisdiction === '器材使用' || jurisdiction === '器材归还'"
                  :key="jurisdiction">{{jurisdiction}}</el-checkbox>
            </el-checkbox-group>

          </el-form-item>

        </el-form>
      </div>

      <div slot="footer" style="margin-top: -35px;">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>

    </el-dialog>

    <div>
      <el-table
          :data="tableData"
          stripe
          style="width: 100%">
        <el-table-column
            prop="name"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="username"
            label="用户名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="role"
            width="180"
            label="用户角色">
        </el-table-column>

        <el-table-column
            prop="userState"
            width="180"
            label="用户状态">
        </el-table-column>

        <el-table-column
            prop="operation"
            label="操作">

          <el-button type="primary" size="mini" plain>分配权限</el-button>
          <el-button type="info" size="mini" plain>编辑</el-button>
          <el-button type="danger" size="mini" plain>删除</el-button>

        </el-table-column>

      </el-table>
    </div>

  </div>



</template>

<script>

const jurisdictionOptions = ['器材使用', '器材归还', '申请添加', '申请报修', '申请报废'];

export default {
  name: "UserManagement",
  data() {

    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {

      addUser: {
        name: '',
        username: '',
        password: '',
        role: '',
        jurisdiction: [],
      },

      checkAll: false,
      checkedjurisdictions: ['器材使用', '器材归还'],
      jurisdictions: jurisdictionOptions,
      isIndeterminate: true,

      tableData: [{
        name: '王小虎',
        username: 'wxh',
        role: '管理员',
        userState: '正常',

      }, {
        name: '王小虎',
        username: 'wxh',
        role: '管理员',
        userState: '正常',
      }, {
        name: '王小虎',
        username: 'wxh',
        role: '管理员',
        userState: '正常',
      }, {
        name: '王小虎',
        username: 'wxh',
        role: '管理员',
        userState: '正常',
      }],

      formInline: {
        user: '',
        region: '',
        pass: '',
        checkPass: '',
      },

      dialogFormVisible: false,
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',

      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },

    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },

    handleCheckAllChange(val) {
      this.checkedjurisdictions = val ? jurisdictionOptions : ['器材使用', '器材归还'];
      this.isIndeterminate = false;
    },
    handleCheckedjurisdictionsChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.jurisdictions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.jurisdictions.length;
    },

  }

}
</script>

<style scoped>

</style>



<!--<template>-->
<!--<div>-->
<!--  个人中心-->
<!--</div>-->
<!--</template>-->

<!--<script>-->

<!--	export default {-->
<!--		name: "UserCenter"-->

<!--	}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->