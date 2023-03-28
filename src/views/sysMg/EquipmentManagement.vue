<template>

  <div>

    <!--  搜索表单  -->
    <div>
      <el-form :inline="true"
               :model="queryFromData"
               class="demo-form-inline"
               size="medium"
               ref="queryFromData">
        <el-form-item label="器材名称" prop="equipment">
          <el-select v-model="queryFromData.equipment"
                     filterable
                     clearable
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
          <el-select v-model="queryFromData.warehouse" clearable placeholder="请选择仓库">
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
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="queryPickerOptions">
          </el-date-picker>

        </el-form-item>

        <el-form-item label="申请原因" prop="reason">
          <el-input
              placeholder="请输入内容"
              maxlength="10"
              show-word-limit
              v-model="queryFromData.reason"
              clearable>
          </el-input>
        </el-form-item>

        <el-form-item label="申请状态" prop="applicationStatus">
          <el-select v-model="queryFromData.state" clearable placeholder="请选择状态">
            <el-option
                v-for="item in applicationStatusOptions"
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

      <el-radio-group v-model="radio" style="margin-bottom: 10px" size="small" @change="applyInfo()">
        <el-radio-button label="添加"></el-radio-button>
        <el-radio-button label="报废"></el-radio-button>
        <el-radio-button label="维修"></el-radio-button>
      </el-radio-group>

    </div>

    <!--  表格  -->
    <div>
      <el-table
          :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          :cell-style="rowStyle"
          :row-class-name="tableRowClassName"
          :default-sort="{prop: 'date', order: 'descending'}"
          style="width: 100%">
        <el-table-column
            prop="applicationDate"
            label="申请时间"
            sortable
            align="center">
        </el-table-column>
        <el-table-column
            prop="name"
            label="申请人"
            :formatter="applyName"
            align="center">
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
            :formatter="applyStatus"
            label="申请状态">
        </el-table-column>
        <el-table-column
            prop="operation"
            align="center"
            :show-overflow-tooltip="true"
            label="操作/说明">

          <template slot-scope="scope">
            <el-button
                size="mini"
                type="primary"
                v-if="scope.row.applicationStatus == 0"
                round
                plain
                @click="processApproval(scope.$index, scope.row)">处理
            </el-button>

            <span v-if="scope.row.applicationStatus != 0">
              {{ scope.row.auditorReason }}
            </span>

          </template>


        </el-table-column>
        <el-table-column
            prop="auditorDate"
            label="处理时间"
            :formatter="auditorDateState"
            sortable
            align="center">
        </el-table-column>

      </el-table>
    </div>

    <!--  处理  -->
    <el-dialog
        :title="radio + '申请处理'"
        :visible.sync="handleDialogVisible"
        @close="addApprovalDialogclose()"
        width="50%"
        center>

      <el-form label-position="right" label-width="80px" :model="approvalFromData">

        <div style="display: flex;">
          <el-form-item label="使用人" :label-width="formLabelWidth">
            <el-input v-model="approvalFromData.name"
                      style="width: 180px"
                      :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="器材名称" :label-width="formLabelWidth">
            <el-input v-model="approvalFromData.equipment"
                      style="width: 180px"
                      :disabled="true"></el-input>
          </el-form-item>
        </div>

        <div style="display: flex;">
          <el-form-item label="所属仓库" :label-width="formLabelWidth">
            <el-input v-model="approvalFromData.warehouse"
                      style="width: 180px"
                      :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="使用数量" :label-width="formLabelWidth">
            <el-input v-model="approvalFromData.num"
                      style="width: 180px"
                      :disabled="true"></el-input>
          </el-form-item>
        </div>

        <el-form-item label="申请时间" :label-width="formLabelWidth">
          <el-input v-model="approvalFromData.applyTime"
                    style="width: 180px"
                    :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="申请原因" :label-width="formLabelWidth">
          <el-input v-model="approvalFromData.reason"
                    type="textarea"
                    style="width: 480px"
                    :disabled="true"></el-input>
        </el-form-item>

        <el-form-item label="审批结果" :label-width="formLabelWidth">
          <el-select v-model="approvalFromData.state" clearable placeholder="请选择结果">
            <el-option
                v-for="item in approvalOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="说明" :label-width="formLabelWidth">
          <el-input
              type="textarea"
              placeholder="请输入原因"
              v-model="approvalFromData.auditorReason"
              maxlength="100"
              show-word-limit
              :autosize="{ minRows: 3, maxRows: 4}"
              style="width: 480px"
              clearable>
          </el-input>
        </el-form-item>

      </el-form>

      <span slot="footer" class="dialog-footer">
          <el-button @click="handleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitApprovalForm">确 定</el-button>
        </span>
    </el-dialog>


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
export default {
  name: "EquipmentManagement",
  data() {
    return {

      CS: {
        'width': '200px',
        'word-break': 'break-all'  //过长时自动换行
      },

      approvalOptions: [
        {
          value: 1,
          label: '通过'
        },
        {
          value: -1,
          label: '驳回'
        }
      ],

      radio: '添加',

      applicationStatusOptions: [
        {
          value: -1,
          label: '已驳回'
        }, {
          value: 0,
          label: '审核中'
        }, {
          value: 1,
          label: '已通过'
        },
        {
          value: '',
          label: '全部'
        }
      ],

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

      queryFromData: {
        equipment: '',
        warehouse: '',
        picker: [],
        queryStarTime: '',
        queryEndTime: '',
        state: 0,
        reason: '',
        auditor: '',
        classState: 1,
      },

      approvalFromData: {
        id: '',
        name: '',
        auditorName: '',
        state: '',
        auditorReason: '',
        auditorDate: '',
        classState: '',
        equipment: '',
        num: '',
        approvalResult: '',
        warehouse: '',
        reason: '',
        applyTime: '',
      },

      applyFromData: {
        name: '',
        equipment: '',
        num: 1,
        warehouse: '',
        applyTime: '',
        applyReason: '',
      },

      currentPage: 1,
      pageSize: 6,

      tableData: [{
        id: '',
        applicationDate: '',
        name: '',
        equipment: '',
        num: '',
        warehouse: '',
        reason: '',
        applicationStatus: 0,
        auditorReason: '',
        auditor: '',
        auditorDate: '',
      }],

      addScrapDialogVisible: false,
      handleDialogVisible: false,
      formLabelWidth: '120px',

      rules: {
        equipment: [
          {required: true, message: '请选择器材', trigger: 'change'}
        ],
        num: [
          {required: true, message: '请选择数量', trigger: 'change'}
        ],
        warehouse: [
          {required: true, message: '请选择仓库', trigger: 'change'}
        ],
        applyReason: [
          {required: true, message: '请输入内容', trigger: 'blur'}
        ],
      },

      applyData: {
        name: '',
        state: '',
        classState: '',
      },

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

      warehouseOptions: [
        {
          label: '',
          value: '',
        },
      ],

      classNameOptions: [
        {
          label: '',
          value: '',
        },
      ],

      userInfo: {},
      username: '',

      allUserOptions: [
        {
          label: '',
          value: '',
        },
      ],

    }
  },
  created() {
    this.getUserInfo();
    this.getAllUserInfo();
    this.getClassInfo();
    this.getEquipmentInfo();
    this.getWarehouseInfo();
    this.queryFromData.state = this.applicationStatusOptions[3].value;
    this.applyData.state = this.applicationStatusOptions[3].value;
    this.applyData.classState = 1;
    this.getApplyInfo();

  },

  methods: {

    getUserInfo() {
      this.$axios.get("/tb/userInfo").then(res => {

        this.name = res.data.data.name;
        this.username = res.data.data.username;
        this.applyData.name = res.data.data.username;
        console.log("username:" + this.username)
        this.applyData.name = this.username;
        this.queryFromData.name = res.data.data.username;
        console.log(res.data.data)

      })
    },

    getApplyInfo() {
      console.log("---------------")
      console.log(this.applyData)
      this.$axios.post("/tb/apply/correlation", this.applyData).then(res => {

        let apply = res.data.data.applyList;
        console.log("+++++++++++++")
        console.log(apply)
        this.tableData = [];

        for (let i = 0; i < apply.length; i++) {
          this.$set(this.tableData, i, {
            id: apply[i].id,
            username: apply[i].name,
            name: apply[i].name,
            applicationDate: apply[i].date,
            className: apply[i].className,
            equipment: apply[i].equipment,
            num: apply[i].num,
            warehouse: apply[i].warehouse,
            reason: apply[i].reason,
            applicationStatus: apply[i].state,
            auditorReason: apply[i].auditorReason,
            auditorDate: apply[i].auditorDate,
          })
        }

        console.log("table")
        console.log(this.tableData)
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

    getAllUserInfo() {
      this.$axios.get("/tb/user/allUser").then(res => {

        let allUserList = res.data.data.allUserList;
        console.log("====================")
        console.log(allUserList)

        for (let i = 0; i < allUserList.length; i++) {

          this.$set(this.allUserOptions, i, {
            label: allUserList[i].name,
            value: allUserList[i].username,
          })
        }
      })
    },

    auditorDateState(row, column) {
      if (row.auditorDate == null) {
        return '未处理'
      } else {
        return row.auditorDate;
      }
    },

    applyInfo() {
      if (this.radio == '添加') {
        this.applyData.classState = 1;
        this.queryFromData.classState = 1;
      } else if (this.radio == '报废') {
        this.applyData.classState = -1;
        this.queryFromData.classState = -1;
      } else {
        this.applyData.classState = 0;
        this.queryFromData.classState = 0;
      }
      this.getApplyInfo();
      console.log(this.radio)
      console.log(this.applyData.classState)
    },

    submitApprovalForm() {
      let afd = this.approvalFromData;

      if (afd.state && afd.auditorReason) {
        afd.auditorDate = this.getCurrentTime();
        if (this.radio == '添加') {
          afd.classState = 1;
        } else if (this.radio == '维修') {
          afd.classState = 0;
        } else {
          afd.classState = -1;
        }
        console.log("afd")
        console.log(afd)

        this.$axios.post("/tb/apply/handle", afd).then(res => {

          this.$message({
            showClose: true,
            message: "申请处理成功！~",
            type: 'success'
          });

          this.getApplyInfo();
          this.handleDialogVisible = false;

        })

      } else {
        this.$message.error('请将信息填完整后重试');
        return
      }

    },

    processApproval(index, row) {

      this.handleDialogVisible = true;
      let afd = this.approvalFromData;

      let allUserOptions = this.allUserOptions;
      for (let i = 0; i < this.allUserOptions.length; i++) {
        if (row.name == allUserOptions[i].value) {
          afd.name = allUserOptions[i].label;
        }
      }
      afd.auditorName = this.username;
      afd.id = row.id;
      afd.equipment = row.equipment;
      afd.num = row.num;
      afd.warehouse = row.warehouse;
      afd.reason = row.reason;
      afd.applyTime = row.applicationDate;

    },

    addApprovalDialogclose() {
      this.approvalFromData.state = '';
      this.approvalFromData.auditorReason = '';
    },

    handleChange() {

    },

    submitApplyForm(formName) {
      this.$refs.applyFromData.validate((valid) => {
        if (valid) {
          this.addScrapDialogVisible = false;

          console.log("applyFromData数据")
          console.log(this.applyFromData)
          console.log('器材名称: ' + this.applyFromData.equipment
              + '\n申请数量：' + this.applyFromData.num
              + '\n存放仓库: ' + this.applyFromData.warehouse
              + '\n申请时间: ' + this.getCurrentTime()
              + '\n申请人: ' + this.userInfo.username
              + '\n原因: ' + this.applyFromData.applyReason
          )

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    addScrap() {
      this.addScrapDialogVisible = true;
    },

    applyName(row, column) {

      let allUserOptions = this.allUserOptions;
      for (let i = 0; i < this.allUserOptions.length; i++) {
        if (row.name == allUserOptions[i].value) {
          return allUserOptions[i].label;
        }
      }
    },

    applyStatus(row, column) {
      if (row.applicationStatus == 0) {
        return '审核中'
      } else if (row.applicationStatus == 1) {
        return '已通过'
      } else {
        return '已驳回'
      }
    },


    submitQueryForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          if (this.queryFromData.picker.length != 0) {
            let starDate = this.$moment(this.queryFromData.picker[0]).format('YYYY-MM-DD HH:mm')
            let endDate = this.$moment(this.queryFromData.picker[1]).format('YYYY-MM-DD HH:mm')

            this.queryFromData.queryStarTime = starDate
            this.queryFromData.queryEndTime = endDate
          } else {
            this.queryFromData.queryStarTime = null;
            this.queryFromData.queryEndTime = null;
          }

          console.log("this.queryFromData数据")
          console.log('器材名称: ' + this.queryFromData.equipment
              + '\n仓库: ' + this.queryFromData.warehouse
              + '\n日期: ' + '开始时间：' + this.queryFromData.queryStarTime
              + '结束时间：' + this.queryFromData.queryEndTime
              + '\n原因: ' + this.queryFromData.reason
              + '\n状态: ' + this.queryFromData.applicationStatus
              + '\n审核人员: ' + this.queryFromData.auditor)

          this.$axios.post("/tb/apply/adminSearch", this.queryFromData).then(res => {

            let apply = res.data.data.applyList;
            console.log("+++++++++++++")
            console.log(apply)
            this.tableData = [];

            for (let i = 0; i < apply.length; i++) {
              this.$set(this.tableData, i, {
                id: apply[i].id,
                username: apply[i].name,
                name: apply[i].name,
                applicationDate: apply[i].date,
                className: apply[i].className,
                equipment: apply[i].equipment,
                num: apply[i].num,
                warehouse: apply[i].warehouse,
                reason: apply[i].reason,
                applicationStatus: apply[i].state,
                auditorReason: apply[i].auditorReason,
                auditorDate: apply[i].auditorDate,
              })
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

      if (row.applicationStatus == -1) {
        return 'warning-row';
      } else if (row.applicationStatus == 0) {
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
      this.tableData = [];
      this.queryFromData.state = this.applicationStatusOptions[3].value;
      this.getApplyInfo();
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