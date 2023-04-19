<template>

  <div>

    <!--  搜索表单  -->
    <div>
      <el-form :inline="true"
               :model="queryFromData"
               class="demo-form-inline"
               size="medium"
               ref="queryFromData">

        <el-form-item label="器材分类" prop="className">
          <el-select v-model="queryFromData.className"
                     filterable
                     style="width: 180px;"
                     clearable
                     placeholder="请选择分类">
            <el-option
                v-for="item in classNameOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="器材名称" prop="equipment">
          <el-select v-model="queryFromData.equipment"
                     filterable
                     clearable
                     style="width: 180px;"
                     clearable placeholder="请选择器材">

            <el-option-group
                v-for="group in options"
                :key="group.label"
                :label="group.label">
              <el-option
                  v-for="item in group.options"
                  :key="item.equipment"
                  :label="item.equipment"
                  :value="item.equipment">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouse">
          <el-select v-model="queryFromData.warehouse"
                     style="width: 180px;"
                     filterable
                     clearable placeholder="请选择仓库">
            <el-option
                v-for="item in warehouseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="申请日期" prop="picker">
          <el-date-picker
              v-model="queryFromData.picker"
              type="daterange"
              align="right"
              style="width: 340px;"
              unlink-panels
              range-separator="至"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd HH:mm"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="queryPickerOptions">
          </el-date-picker>

        </el-form-item>

        <el-form-item label="申请原因" prop="reason">
          <el-input
              placeholder="请输入内容"
              style="width: 180px;"
              maxlength="10"
              show-word-limit
              v-model="queryFromData.reason"
              clearable>
          </el-input>
        </el-form-item>

        <el-form-item label="申请状态" prop="state">
          <el-select v-model="queryFromData.state"
                     style="width: 180px;"
                     clearable placeholder="请选择状态">
            <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核人员" prop="auditorName">
          <el-select v-model="queryFromData.auditorName"
                     style="width: 180px;"
                     filterable
                     clearable placeholder="请选择审核人员">
            <el-option
                v-for="item in adminOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitQueryForm('queryFromData')">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetQueryForm('queryFromData')">重置</el-button>
        </el-form-item>
      </el-form>


      <el-button type="primary" @click="addApply">新增维修申请</el-button>

      <el-dialog
          title="新增维修申请"
          :visible.sync="addApplyDialogVisible"
          width="30%"
          @close="addApplyDialogclose()"
          center>

        <el-form :model="applyFromData"
                 ref="applyFromData"
                 :rules="rules"
                 label-width="80px"
                 style="align-items: center;"
                 label-position="right">


          <el-form-item label="器材名称" prop="equipment">
            <el-select v-model="applyFromData.equipment" clearable filterable placeholder="请选择器材">
              <el-option-group
                  v-for="group in options"
                  :key="group.label"
                  :label="group.label">
                <el-option
                    v-for="item in group.options"
                    :key="item.equipment"
                    :label="item.equipment"
                    :value="item.equipment">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>

          <el-form-item label="申请数量" prop="num">
            <el-input-number
                v-model="applyFromData.num"
                controls-position="right"
                size="large"
                style="width: 100px"
                @change="handleChange"
                :min="1"
                :max="99">

            </el-input-number>
          </el-form-item>

          <el-form-item label="存放仓库" prop="warehouse">
            <el-select v-model="applyFromData.warehouse" clearable filterable placeholder="请选择仓库">
              <el-option
                  v-for="item in warehouseOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="申请原因" prop="reason">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="applyFromData.reason">
            </el-input>
          </el-form-item>

        </el-form>


        <span slot="footer" class="dialog-footer">
          <el-button @click="addApplyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitApplyForm(applyFromData)">确 定</el-button>
        </span>
      </el-dialog>


    </div>

    <!--  表格  -->
    <div>
      <el-table
          :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          :cell-style="rowStyle"
          :row-class-name="tableRowClassName"
          :hide-on-single-page="tableData.length < 6"
          :default-sort="{prop: 'date', order: 'descending'}"
          style="width: 100%">
        <el-table-column
            prop="applicationDate"
            label="申请时间"
            width="170px"
            :formatter="carTimeFilter"
            sortable
            align="center">
        </el-table-column>
        <el-table-column
            prop="name"
            label="申请人"
            align="center">
        </el-table-column>
        <el-table-column
            prop="className"
            align="center"
            label="器材分类">
        </el-table-column>
        <el-table-column
            prop="equipment"
            align="center"
            label="器材名称">
        </el-table-column>
        <el-table-column
            prop="num"
            align="center"
            label="数量">
        </el-table-column>
        <el-table-column
            prop="warehouse"
            align="center"
            label="仓库">
        </el-table-column>
        <el-table-column
            prop="reason"
            align="center"
            :show-overflow-tooltip="true"
            label="申请原因">
        </el-table-column>
        <el-table-column
            prop="operation"
            align="center"
            :formatter="applystate"
            label="状态">
        </el-table-column>
        <el-table-column
            prop="auditorName"
            align="center"
            :formatter="auditorName"
            label="审核人">
        </el-table-column>
        <el-table-column
            prop="explain"
            align="center"
            :formatter="auditorexplain"
            :show-overflow-tooltip="true"
            label="审核说明">
        </el-table-column>
        <el-table-column
            prop="auditorDate"
            label="审核时间"
            width="170px"
            :formatter="carTimeFilter"
            sortable
            align="center">
        </el-table-column>


      </el-table>
    </div>


    <!--  分页  -->
    <div class="block">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[6, 12, 18, 24]"
          :hide-on-single-page="tableData.length < 7"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "ScrapEquipment",
  data() {
    return {

      queryPickerOptions: {
        disabledDate(time) {
          return (time.getTime() + 3600 * 1000 * 24 * 30) < Date.now() || time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },

      stateOptions: [
        {
          value: -1,
          label: '已驳回'
        }, {
          value: 0,
          label: '审核中'
        }, {
          value: 1,
          label: '已通过'
        }
      ],

      queryFromData: {
        name: '',
        className: '',
        equipment: '',
        warehouse: '',
        picker: [],
        queryStarTime: '',
        queryEndTime: '',
        reason: '',
        auditorName: '',
        state: '',
        classState: '',
      },

      applyFromData: {
        name: '',
        className: '',
        equipment: '',
        num: 1,
        warehouse: '',
        date: '',
        reason: '',
        state: '',
        classState: '',
      },

      currentPage: 1,
      pageSize: 6,

      classNameOptions: [
        {
          label: '',
          value: '',
        },
      ],

      name: '',

      warehouseOptions: [
        {
          label: '',
          value: '',
        },
      ],

      adminOptions: [
        {
          label: '',
          value: '',
        },
      ],

      options: [{
        label: '',
        options: [{
          value: '',
          label: ''
        },]
      },
      ],

      test: [
        {
          label: '',
          options: [
            {},

          ]
        }
      ],

      equipmentInfo: [
        {},
      ],

      tableData: [
      ],

      addApplyDialogVisible: false,
      formLabelWidth: '120px',

      rules: {
        className: [
          {required: true, message: '请选择分类', trigger: 'change'}
        ],

        equipment: [
          {required: true, message: '请选择器材', trigger: 'change'}
        ],
        num: [
          {required: true, message: '请选择数量', trigger: 'change'}
        ],
        warehouse: [
          {required: true, message: '请选择仓库', trigger: 'change'}
        ],
        reason: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ],
      },

      userInfo: {},
      username: '',
      applyTable: {
        classState: 0,
        name: '',
      },


    }
  },
  created() {
    this.getUserInfo()
    this.getClassInfo()
    this.getEquipmentInfo()
    this.getWarehouseInfo()
    this.getAuditorInfo()
    this.getAdminInfo()
  },

  methods: {

    getUserInfo() {
      this.$axios.get("/tb/userInfo").then(res => {

        this.name = res.data.data.name
        this.username = res.data.data.username;
        console.log("username:" + this.username)
        this.queryFromData.name = res.data.data.username
        this.applyTable.name = res.data.data.username;

        console.log(res.data.data)

      })
    },

    getAdminInfo() {
      this.$axios.get("/tb/user/admin").then(res => {

        let adminList = res.data.data.adminList;
        console.log(adminList)

        for (let i = 0; i < adminList.length; i++) {

          this.$set(this.adminOptions, i, {
            label: adminList[i].name,
            value: adminList[i].username,
          })
        }
      })
    },

    getWarehouseInfo() {

      this.$axios.get("/tb/warehouse/info").then(res => {

        let warehouses = res.data.data.warehouseList;
        console.log(warehouses)

        for (let i = 0; i < warehouses.length; i++) {

          this.$set(this.warehouseOptions, i, {
            label: warehouses[i].warehouse,
            value: warehouses[i].warehouse,
          })
        }

        console.log("this.warehouseOptions")
        console.log(this.warehouseOptions)

      })
    },

    getClassInfo() {

      this.$axios.get("/tb/classification/info").then(res => {

        let classifications = res.data.data.classifications;

        for (let i = 0; i < classifications.length; i++) {

          this.$set(this.test, i, {
            label: classifications[i].className,
          })

          this.$set(this.classNameOptions, i, {
            label: classifications[i].className,
            value: classifications[i].className,
          })

        }

      })
    },

    getEquipmentInfo() {
      this.$axios.get("/tb/equipment/info").then(res => {

        let equipments = res.data.data.equipments;
        this.equipmentInfo = equipments;
        console.log("this.equipmentInfo")
        console.log(this.equipmentInfo)

        for (let i = 0; i < this.test.length; i++) {
          this.test[i].options = equipments.filter(item => {
            return item.className == this.test[i].label;
          })
        }
        this.options = this.test

        console.log("this.options")
        console.log(this.options)

      })
    },

    getAuditorInfo() {

      this.$axios.get("/tb/apply/info", {
        // 传递的参数
        params: {
          classState: 0,
        }
      }).then(res => {

        let apply = res.data.data.applyList;
        console.log(apply)

        this.tableData = [];

        for (let i = 0; i < apply.length; i++) {
          this.$set(this.tableData, i, {
            id: apply[i].id,
            username: apply[i].name,
            name: this.name,
            applicationDate: apply[i].date,
            className: apply[i].className,
            equipment: apply[i].equipment,
            num: apply[i].num,
            warehouse: apply[i].warehouse,
            reason: apply[i].reason,
            state: apply[i].state,
            explain: apply[i].auditorReason,
            auditorName: apply[i].auditorName,
            auditorDate: apply[i].auditorDate,

          })
        }
      })
    },

    addApplyDialogclose() {
      this.$nextTick(function () {
        this.$refs.applyFromData.resetFields();
      })
    },

    carTimeFilter: function (row, column, cellValue) {
      if (cellValue != null) {
        return moment(cellValue).format("YYYY-MM-DD HH:mm");
      } else {
        return '审核中'
      }
    },

    handleChange() {

    },

    submitApplyForm(formName) {
      this.$refs.applyFromData.validate((valid) => {
        if (valid) {

          this.applyFromData.date = this.getCurrentTime();
          this.applyFromData.state = 0;
          this.applyFromData.classState = this.applyTable.classState;
          this.applyFromData.name = this.username;

          for (let j = 0; j < this.equipmentInfo.length; j++) {
            if (this.applyFromData.equipment == this.equipmentInfo[j].equipment) {
              this.applyFromData.className = this.equipmentInfo[j].className
              break;
            }
          }


          console.log("applyFromData数据")
          console.log(this.applyFromData)
          console.log('器材名称: ' + this.applyFromData.equipment
              + '\n器材分类：' + this.applyFromData.className
              + '\n申请数量：' + this.applyFromData.num
              + '\n存放仓库: ' + this.applyFromData.warehouse
              + '\n申请时间: ' + this.applyFromData.date
              + '\n申请人: ' + this.applyFromData.name
              + '\n原因: ' + this.applyFromData.reason
              + '\n状态: ' + this.applyFromData.state
              + '\n申请类别: ' + this.applyFromData.classState
          )

          this.$axios.post('/tb/apply/add', this.applyFromData).then(res => {

            this.$message({
              showClose: true,
              message: "已提交申请！~",
              type: 'success'
            });

            this.getAuditorInfo();

            this.addApplyDialogVisible = false;
          })


        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    addApply() {
      this.addApplyDialogVisible = true;
    },

    applystate(row, column) {
      if (row.state == 0) {
        return '审核中'
      } else if (row.state == 1) {
        return '已通过'
      } else {
        return '已驳回'
      }
    },

    auditorexplain(row, column) {
      if (row.explain == null) {
        return '审核中'
      } else {
        return row.explain
      }
    },

    auditorName(row, column) {
      if (row.auditorName == null) {
        return '审核中'
      }
      for (let i = 0; i < this.adminOptions.length; i++) {
        if (row.auditorName == this.adminOptions[i].value) {
          return this.adminOptions[i].label;
          break;
        }
      }
    },


    submitQueryForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          if (this.queryFromData.picker) {
            this.queryFromData.queryStarTime = this.queryFromData.picker[0];
            this.queryFromData.queryEndTime = this.queryFromData.picker[1];
          }
          this.queryFromData.classState = this.applyTable.classState;

          console.log("this.queryFromData数据");
          console.log(
              '姓名: ' + this.queryFromData.name
              + '\n器材分类: ' + this.queryFromData.className
              + '\n器材名称: ' + this.queryFromData.equipment
              + '\n仓库: ' + this.queryFromData.warehouse
              + '\n日期: ' + '开始时间：' + this.queryFromData.queryStarTime
              + '结束时间：' + this.queryFromData.queryEndTime
              + '\n原因: ' + this.queryFromData.reason
              + '\n状态: ' + this.queryFromData.state
              + '\n审核人员: ' + this.queryFromData.auditorName)

          console.log(this.queryFromData)

          this.$axios.post('/tb/apply/search', this.queryFromData).then(res => {

            this.tableData = [];
            let apply = res.data.data.applyList;

            for (let i = 0; i < apply.length; i++) {
              this.$set(this.tableData, i, {

                id: apply[i].id,
                username: apply[i].name,
                name: this.name,
                applicationDate: apply[i].date,
                className: apply[i].className,
                equipment: apply[i].equipment,
                num: apply[i].num,
                warehouse: apply[i].warehouse,
                reason: apply[i].reason,
                state: apply[i].state,
                explain: apply[i].auditorReason,
                auditorName: apply[i].auditorName,

              })

              console.log("name：" + this.tableData.name)
              console.log("username：" + this.tableData.username)
            }

          })

        } else {
          console.log('error submit!!');
          return false;
        }
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

    tableRowClassName({row, rowIndex}) {

      if (row.state == -1) {
        return 'warning-row';
      } else if (row.state == 0) {
        return 'conduct-row';
      }
      return 'success-row';
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

    resetQueryForm(formName) {
      this.$refs[formName].resetFields();
      this.getAuditorInfo()


    }
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


.block {
  margin-top: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>