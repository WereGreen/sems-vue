<template>

  <div style="display: flex">

    <div class="left">

      <!--  搜索表单  -->

      <div class="searchForm">

        <el-form :inline="true"
                 :model="queryFromData"
                 class="demo-form-inline">

          <el-form-item label="姓名">
            <el-input v-model="queryFromData.name"
                      style="width: 220px;"
                      maxlength="10"
                      show-word-limit
                      clearable
                      placeholder="请输入姓名"></el-input>
          </el-form-item>

          <el-form-item label="用户名">
            <el-input v-model="queryFromData.username"
                      style="width: 220px;"
                      maxlength="10"
                      show-word-limit
                      @input="queryUsernameInput"
                      clearable
                      placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item label="用户角色">
            <el-select v-model="queryFromData.role" placeholder="请选择用户角色">
              <el-option label="管理员" value="normal"></el-option>
              <el-option label="超级管理员" value="admin"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="margin-left: 40px;">
            <el-button type="primary" @click="submitQueryForm()">查询</el-button>
            <el-button @click="resetForm()">重置</el-button>
          </el-form-item>

        </el-form>



      </div>


      <div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding-bottom: 15px;height: 420px;">

        <!--  表格  -->
        <div>
          <el-table
              :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              stripe
              :default-sort="{prop: 'date', order: 'descending'}"
              style="width: 100%">

            <el-table-column
                prop="name"
                label="姓名"
                align="center">
            </el-table-column>
            <el-table-column
                prop="username"
                align="center"
                label="用户名">
            </el-table-column>
            <el-table-column
                prop="role"
                align="center"
                :formatter="userRoleStatus"
                label="用户角色">
            </el-table-column>

            <el-table-column
                prop="operation"
                align="center"
                label="操作">

              <template slot-scope="scope">
              <el-button type="primary" size="mini" plain
                         :disabled="scope.row.username == username"
                         @click="editUser(scope.$index, scope.row)" >编辑</el-button>

              <el-button type="danger" size="mini" plain
                         :disabled="scope.row.username == username"
                          @click="deleteUser(scope.$index, scope.row,tableData)">删除</el-button>
              </template>

            </el-table-column>

          </el-table>
        </div>

        <!--  分页  -->
        <div class="block">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :hide-on-single-page="tableData.length < 5"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="tableData.length">
          </el-pagination>
        </div>

      </div>

    </div>

    <!--  操作区  -->
    <div class="right">

      <div style="font-size: 18px;margin: 20px;">操作区</div>

      <div style="display: flex; align-items: center; justify-content: center; width: 100%;height: 260px;">

        <div style="margin-right: 20px">
          <el-card shadow="always" class="dataCard">
            <div style="font-size: 16px;color: #606266">
              现共有用户
            </div>
            <div style="color: #409EFF;font-size: 80px;
            text-align: center;line-height: 120px;width: 165px;margin-left: -20px">
              {{countUser}}
            </div>
            <div style="font-size: 18px;color: #909399;float: right">
              人
            </div>
          </el-card>
        </div>


        <div>
          <el-card shadow="always" class="dataCard">
            <div style="font-size: 16px;color: #606266">
              超级管理员
            </div>
            <div style="color: coral;font-size: 80px;
            text-align: center;line-height: 120px;width: 165px;margin-left: -20px">
              {{countAdmin}}
            </div>
            <div style="font-size: 18px;color: #909399;float: right">
              人
            </div>
          </el-card>
        </div>

      </div>


      <div style="display: flex; align-items: center; justify-content: center; width: 100%;height: 230px;">


        <div style="margin-right: 20px">
          <el-card shadow="always" class="dataCard">
            <div style="font-size: 16px;color: #606266">
              管理员
            </div>
            <div style="color: #67C23A;font-size: 80px;
            text-align: center;line-height: 120px;width: 165px;margin-left: -20px">
              {{countNormal}}
            </div>
            <div style="font-size: 18px;color: #909399;float: right">
              人
            </div>
          </el-card>
        </div>


        <div @click="dialogFormVisible = true">
          <el-card shadow="always" class="dataCard">

            <div style="font-size: 65px;text-align: center;line-height: 150px;margin-bottom: -20px; color: #E6A23C;">
              <i class="el-icon-s-custom"></i>
            </div>

            <div style="font-size: 16px;text-align: center;color: #606266;">
              新增用户
            </div>

          </el-card>
        </div>

      </div>


    </div>

    <!--  新增用户  -->
    <el-dialog
        title="新增用户"
        center
        width="30%"
        @close="addUserDialogclose()"
        :visible.sync="dialogFormVisible">


      <div>
        <el-form :model="formInline" label-position="right" label-width="80px">

          <el-form-item label="姓名">
            <el-input v-model="formInline.name" style="width: 220px;" placeholder="请输入姓名"></el-input>
          </el-form-item>


          <el-form-item label="用户名">
            <el-input v-model="formInline.username"
                      @input="formUsernameInput"
                      style="width: 220px;" placeholder="请输入用户名"></el-input>
          </el-form-item>


          <el-form-item label="用户角色">
            <el-select v-model="formInline.role" placeholder="请选择用户角色">
              <el-option label="管理员" value="normal"></el-option>
              <el-option label="超级管理员" value="admin"></el-option>
            </el-select>
          </el-form-item>

        </el-form>
      </div>

      <div slot="footer" style="margin-top: -35px;">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewUser()">确 定</el-button>
      </div>

    </el-dialog>

    <!--  编辑用户  -->
    <el-dialog
        title="编辑用户信息"
        center
        width="30%"
        :visible.sync="editdialogFormVisible">


      <div>
        <el-form :model="editUserFormDate" label-position="right" label-width="80px">

          <el-form-item label="姓名">
            <el-input v-model="editUserFormDate.name" style="width: 220px;" placeholder="请输入姓名"></el-input>
          </el-form-item>


          <el-form-item label="用户名">
            <el-input v-model="editUserFormDate.username"
                      @input="editUsernameInput"
                      style="width: 220px;" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item label="用户角色" :formatter="userRoleStatus">
            <el-select v-model="editUserFormDate.role" placeholder="请选择用户角色">
              <el-option label="管理员" value="normal"></el-option>
              <el-option label="超级管理员" value="admin"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="重置密码">
            <el-button type="primary" plain size="small" @click="resettingPassword" >点击重置用户密码</el-button>
          </el-form-item>

        </el-form>
      </div>

      <div slot="footer" style="margin-top: -35px;">
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateUserInfo()">确 定</el-button>
      </div>

    </el-dialog>

  </div>

</template>

<script>


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

      countUser: 0,
      countNormal: 0,
      countAdmin: 0,

      editUserFormDate: {
        name: '',
        username: '',
        role: '',
        oldName: '',
        oldUsername: '',
        oldRole: '',
      },

      queryFromData: {
        username: '',
        name: '',
        role: '',
      },

      formInline: {
        name: '',
        username: '',
        role: '',
      },

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

      dialogFormVisible: false,
      editdialogFormVisible: false,

      addUser: {
        name: '',
        username: '',
        password: '',
        role: '',
        jurisdiction: [],
      },

      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },


      currentPage: 1,
      pageSize: 5,

      tableData: [],

      formLabelWidth: '120px',

      username: '',
      name: '',
      userInfo: {}

    }
  },
  created() {
    this.getUserInfo();
    this.getAllUser();
  },

  methods: {

    editUser(index, row) {
      this.editdialogFormVisible = true;
      let eu = this.editUserFormDate;
      eu.name = row.name;
      eu.username = row.username;
      eu.role = row.role;
      eu.oldName = row.name;
      eu.oldUsername = row.username;
      eu.oldRole = row.role;

    },

    addUserDialogclose() {
      this.formInline = {};
    },


    repeatUsername(username) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (username == this.tableData[i].username) {
          this.$message({
            type: 'warning',
            message: '用户名重复！请重新输入'
          });
          return true;
        }
      }
      return false;
    },

    addNewUser() {

      if (this.repeatUsername(this.formInline.username)) {
        this.$message({
          type: 'warning',
          message: '用户名重复！请重新输入'
        });
        return;
      }


      this.formInline.operationDate = this.getCurrentTime();
      this.formInline.operationType = 1;
      this.formInline.operationUsername = this.username;
      this.formInline.operationClass = 2;
      this.formInline.details = '添加系统新用户，用户名为：' + this.formInline.username;

      this.$axios.post("/tb/user/add", this.formInline).then(res => {

        this.getAllUser();

        this.$message({
          type: 'success',
          message: '新增用户成功!'
        });

      })

      this.dialogFormVisible = false;
      this.formInline = {};

    },

    resettingPassword() {

      let edi = this.editUserFormDate;

      this.$confirm('此操作将重置用户名为： ' + edi.oldUsername + ' 的用户密码, 该操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        edi.operationDate = this.getCurrentTime();
        edi.operationType = 0;
        edi.operationUsername = this.username;
        edi.operationClass = 2;
        edi.details = '重置用户名为：' + edi.oldUsername + ' 的密码';

        this.$axios.post("/tb/user/resettingPassword", edi).then(res => {

          this.$message({
            type: 'success',
            message: '重置用户密码成功!'
          });

          this.editdialogFormVisible = false;
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },

    updateUserInfo() {

      let edi = this.editUserFormDate;


      if (edi.name == edi.oldName && edi.role == edi.oldRole && edi.username == edi.oldUsername) {
        this.editdialogFormVisible = false;
        return;
      }

      if (this.repeatUsername(edi.username)) {
        this.$message({
          type: 'warning',
          message: '用户名重复！请重新输入'
        });
        return;
      }

      edi.operationDate = this.getCurrentTime();
      edi.operationType = 0;
      edi.operationUsername = this.username;
      edi.operationClass = 2;
      edi.details = '';

      if (edi.name != edi.oldName) {
        edi.details += ' 将用户名字由： ' + edi.oldName + ' 改为：' + edi.name;
      }
      if (edi.role != edi.oldRole) {
        if (edi.role == 'normal') {
          edi.details += ' 将用户角色由超级管理员修改为管理员 ';
        } else {
          edi.details += ' 将用户角色由管理员修改为超级管理员 ';
        }
      }
      if (edi.username != edi.oldUsername) {
        edi.details += ' 将该用户的用户名由： ' + edi.oldUsername + ' 改为：' + edi.username;
      }

      this.$axios.post("/tb/user/update", edi).then(res => {

        this.getAllUser();
        this.$message({
          type: 'success',
          message: '修改用户信息成功!'
        });

        this.editdialogFormVisible = false;
      })

    },

    deleteUser(index, row) {
      this.$confirm('此操作将删除用户名为： ' + row.username + ' 的用户, 该操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.$axios.delete("/tb/user/delete", {
          // 传递的参数
          data: {
            username: row.username,
            operationDate: this.getCurrentTime(),
            operationType: -1,
            operationClass: 2,
            operationUsername: this.username,
            details: "删除了系统中用户名为：" + row.username + ' 的用户信息 ',
          }
        }).then(res => {

          this.getAllUser();

          this.$message({
            type: 'success',
            message: '删除成功!'
          });

        })


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    submitAddForm(formName) {
      this.$refs.addEquipmentFromData.validate((valid) => {
        if (valid) {

          for (let i = 0; i < this.addEquipmentFromData.equipments.length; i++) {
            let equipmentValue = this.addEquipmentFromData.equipments[i].value
            if (!equipmentValue) {
              this.$message.error('请将信息填完整后重试！');
              return false
            }
          }

          this.dialogFormVisible = false
          console.log("this.addEquipmentFromData数据")
          console.log(this.addEquipmentFromData)
          for (let i = 0; i < this.addEquipmentFromData.equipments.length; i++) {
            console.log('器材名称: ' + this.addEquipmentFromData.equipments[i].value
                + '  数量：' + this.addEquipmentFromData.equipments[i].num
            )
          }
          console.log('仓库: ' + this.addEquipmentFromData.warehouse
              + '\n日期: ' + this.addEquipmentFromData.picker
              + '\n原因: ' + this.addEquipmentFromData.reason)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    queryUsernameInput(val){
      let codeReg = new RegExp("[A-Za-z0-9]+"), //正则 英文+数字；
          len=val.length,
          str='';
      for(var i=0;i<len;i++){
        if(codeReg.test(val[i])){
          str+=val[i];
        }
      }
      this.queryFromData.username=str;
    },

    formUsernameInput(val){
      let codeReg = new RegExp("[A-Za-z0-9]+"), //正则 英文+数字；
          len=val.length,
          str='';
      for(var i=0;i<len;i++){
        if(codeReg.test(val[i])){
          str+=val[i];
        }
      }
      this.formInline.username=str;
    },

    editUsernameInput(val){
      let codeReg = new RegExp("[A-Za-z0-9]+"), //正则 英文+数字；
          len=val.length,
          str='';
      for(var i=0;i<len;i++){
        if(codeReg.test(val[i])){
          str+=val[i];
        }
      }
      this.editUserFormDate.username=str;
    },


    submitQueryForm() {
      this.$axios.get("/tb/user/search", {
        // 传递的参数
        params: {
          name: this.queryFromData.name,
          username: this.queryFromData.username,
          role: this.queryFromData.role,
        }
        // 回调函数,一定要使用箭头函数,不然this的指向不是vue示例
      }).then(res => {

        let userList = res.data.data.userList;

        this.tableData = [];
        for (let i = 0; i < userList.length; i++) {
          this.$set(this.tableData, i, {
            username: userList[i].username,
            name: userList[i].name,
            role: userList[i].role,
          })
        }
      })
    },

    resetForm() {
      this.queryFromData = {};
      this.getAllUser();
    },

    userRoleStatus(row) {
      if (row.role == 'normal') {
        return '管理员'
      } else {
        return '超级管理员'
      }

    },

    operationStatus(row, column) {
      if (row.operationStatus === 0) {
        return '修改'
      } else if (row.operationStatus === 1) {
        return '添加'
      } else {
        return '删除'
      }
    },

    getUserInfo() {
      this.$axios.get("/tb/userInfo").then(res => {
        this.name = res.data.data.name;
        this.username = res.data.data.username;
      })
    },

    getAllUser() {

      this.$axios.get("/tb/user/allUser").then(res => {

        let allUserList = res.data.data.allUserList;

        this.tableData = [];
        this.countNormal = 0;
        this.countUser = 0;
        this.countAdmin = 0;
        for (let i = 0; i < allUserList.length; i++) {
          this.$set(this.tableData, i, {
            username: allUserList[i].username,
            name: allUserList[i].name,
            role: allUserList[i].role,
          })
          this.countUser += 1;

          if (allUserList[i].role == 'normal') {
            this.countNormal += 1;
          } else {
            this.countAdmin += 1;
          }

        }

      })
    },

    deleteUserMessageBox(index, row) {
      this.$confirm('此操作将删除名称为：“' + row.warehouseName +
          '” 的用户 , 该操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    getCurrentTime() {
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
      let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();

      let dateValue = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;
      return dateValue
    },


    //比较两个日期大小。格式：2018-8-12 12:30
    compareDate(d1, d2) {
      let date1 = new Date(Date.parse(d1))
      let date2 = new Date(Date.parse(d2))
      return date1 > date2
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      console.log(`每页 ${val} 条`);
    },

    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`);
    },

    rowStyle({row, column, rowIndex, columnIndex}) {
      return "text-align:center";
    },
  },

}
</script>

<style scoped>

.el-table >>> .success-row {
  background: #e1f3d8;
}

.el-table >>> .conduct-row {
  background: #d9ecff;
}

.el-table >>> .warning-row {
  background: #faecd8;
}

.btn {
  height: 25px;
  width: 25px;
  margin-left: 35px;
  margin-top: 5px;
  padding: 0px;
  text-align: center;
  font-size: 16px;
  border-radius: 50%;
}

.left {
  width: 70%;
}

.searchForm {
  padding-top: 15px;
  padding-left: 10px;
  margin-bottom: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.right {
  width: 30%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-left: 1%;
  font-weight: bold;
}

.dataCard {
  width: 165px;
  height: 200px;
  padding: 0px;
}


.block {
  margin-top: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>