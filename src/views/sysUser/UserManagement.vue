<template>

  <div style="display: flex">

    <div class="left">

      <!--  搜索表单  -->

      <div class="searchForm">

        <el-form :inline="true"
                 :model="formInline"
                 class="demo-form-inline">

          <el-form-item label="姓名">
            <el-input v-model="formInline.user"
                      style="width: 220px;"
                      placeholder="请输入姓名"></el-input>
          </el-form-item>

          <el-form-item label="用户名">
            <el-input v-model="formInline.user"
                      style="width: 220px;"
                      placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item label="用户角色">
            <el-select v-model="formInline.region" placeholder="请选择用户角色">
              <el-option label="管理员" value="0"></el-option>
              <el-option label="超级管理员" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item style="margin-left: 40px;">
            <el-button type="primary" @click="">查询</el-button>
            <el-button @click="resetForm('')">重置</el-button>
          </el-form-item>

        </el-form>



      </div>


      <div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding-bottom: 15px;">

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
                label="用户角色">
            </el-table-column>

            <el-table-column
                prop="operation"
                align="center"
                label="操作">

              <template slot-scope="scope">
              <el-button type="primary" size="mini" plain
                         @click="editUser(scope.$index, scope.row)" >编辑</el-button>

              <el-button type="danger" size="mini" plain>删除</el-button>
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
              {{countWarehouse}}
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
              {{countEquipments}}
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
              {{countEquipments}}
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
            <el-input v-model="editUserFormDate.username" style="width: 220px;" placeholder="请输入用户名"></el-input>
          </el-form-item>

          <el-form-item label="用户角色">
            <el-select v-model="editUserFormDate.role" placeholder="请选择用户角色">
              <el-option label="管理员" value="0"></el-option>
              <el-option label="超级管理员" value="1"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="系统权限" v-if="editUserFormDate.role != 1">
            <el-checkbox-group v-model="checkboxGroup" size="small">
              <el-checkbox-button v-for="jurisdiction in jurisdictions" :label="jurisdiction" :disabled="jurisdiction === '北京'" :key="jurisdiction">{{jurisdiction}}</el-checkbox-button>
            </el-checkbox-group>

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

          <el-form-item label="重置密码">
            <el-button type="primary" plain size="small"  >点击重置用户密码</el-button>
          </el-form-item>

        </el-form>
      </div>

      <div slot="footer" style="margin-top: -35px;">
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogFormVisible = false">确 定</el-button>
      </div>

    </el-dialog>

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

      editUserFormDate: {
        name: '',
        username: '',
        jurisdiction: [],
        role: '',
      },

      formInline: {
        user: '',
        region: '',
        pass: '',
        checkPass: '',
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

      checkAll: false,
      checkedjurisdictions: ['器材使用', '器材归还'],
      jurisdictions: jurisdictionOptions,
      isIndeterminate: true,

      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
      },

      countWarehouse: 3,
      countEquipments: 330,



      currentPage: 1,
      pageSize: 5,

      tableData: [{
        name: '王小虎',
        username: 'wxh',
        role: '管理员',
        jurisdiction: [],

      },
        {
        name: '王小虎',
        username: 'wxh',
        role: '管理员',
        userState: '正常',

      },{
        name: '王小虎',
        username: 'wxh',
        role: '管理员',
        userState: '正常',

      },
        {
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

      formLabelWidth: '120px',


      userInfo: {}

    }
  },
  created() {
    this.getUserInfo()
  },

  methods: {

    editUser(index, row) {
      this.editdialogFormVisible = true;

      let eu = this.editUserFormDate;

      eu.name = row.name;
      eu.username = row.username;
      eu.role = row.role;
      eu.userState = row.userState;
      eu.jurisdiction = row.jurisdiction;

    },

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
      this.$axios.get("/sysUser/UserInfo").then(res => {

        this.userInfo = res.data.data;
      })
    },

    deleteClassMessageBox(index, row) {
      this.$confirm('此操作将删除名称为：“' + row.warehouseName +
          '” 的仓库 , 该操作不可撤回，是否继续?', '提示', {
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
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
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