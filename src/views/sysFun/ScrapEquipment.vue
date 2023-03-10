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
          <el-select v-model="queryFromData.equipment" clearable placeholder="请选择器材">
            <el-option
                v-for="item in queryFromData.equipmentOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属仓库" prop="warehouse">
          <el-select v-model="queryFromData.warehouse" clearable placeholder="请选择仓库">
            <el-option
                v-for="item in queryFromData.warehouseOptions"
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
              :picker-options="queryFromData.queryPickerOptions">
          </el-date-picker>

        </el-form-item>

        <el-form-item label="申请原因" prop="reason">
          <el-input
              placeholder="请输入内容"
              v-model="queryFromData.reason"
              clearable>
          </el-input>
        </el-form-item>

        <el-form-item label="申请状态" prop="applicationStatus">
          <el-select v-model="queryFromData.applicationStatus" clearable placeholder="请选择状态">
            <el-option
                v-for="item in queryFromData.applicationStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="审核人员" prop="auditor">
          <el-select v-model="queryFromData.auditor" clearable placeholder="请选择审核人员" style="width: 190px">
            <el-option
                v-for="item in queryFromData.applicationStatusOptions"
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


      <el-button type="primary" @click="addScrap">新增报废申请</el-button>

      <el-dialog
          title="新增报废申请"
          :visible.sync="addScrapDialogVisible"
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
            <el-select v-model="applyFromData.equipment" clearable placeholder="请选择器材">
              <el-option
                  v-for="item in applyFromData.equipmentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
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

          <el-form-item label="所属仓库" prop="warehouse">
            <el-select v-model="applyFromData.warehouse" clearable placeholder="请选择仓库">
              <el-option
                  v-for="item in applyFromData.warehouseOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="申请原因" prop="applyReason">
            <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="applyFromData.applyReason">
            </el-input>
          </el-form-item>


        </el-form>


        <span slot="footer" class="dialog-footer">
          <el-button @click="addScrapDialogVisible = false">取 消</el-button>
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
            prop="explain"
            align="center"
            :show-overflow-tooltip="true"
            label="状态说明">
        </el-table-column>
        <el-table-column
            prop="auditor"
            align="center"
            label="审核人员">
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
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.length">
      </el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  name: "ScrapEquipment",
  data() {
    return {

      queryFromData: {
        equipment: '',
        equipmentOptions: [{
          value: '乒乓球',
          label: '乒乓球'
        }, {
          value: '羽毛球',
          label: '羽毛球'
        }, {
          value: '篮球',
          label: '篮球'
        }, {
          value: '足球',
          label: '足球'
        }, {
          value: '排球',
          label: '排球'
        }],
        warehouse: '',
        warehouseOptions: [
          {
            value: '仓库1',
            label: '仓库1'
          }, {
            value: '仓库2',
            label: '仓库2'
          }, {
            value: '仓库3',
            label: '仓库3'
          }
        ],
        picker: [],
        queryStarTime: '',
        queryEndTime: '',
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
        reason: '',
        auditor: '',
        applicationStatus: '',
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
          }
        ]
      },

      applyFromData: {
        name: '',
        equipment: '',
        equipmentOptions: [{
          value: '乒乓球',
          label: '乒乓球'
        }, {
          value: '羽毛球',
          label: '羽毛球'
        }, {
          value: '篮球',
          label: '篮球'
        }, {
          value: '足球',
          label: '足球'
        }, {
          value: '排球',
          label: '排球'
        }],
        num: 1,
        warehouse: '',
        warehouseOptions: [
          {
            value: '仓库1',
            label: '仓库1'
          }, {
            value: '仓库2',
            label: '仓库2'
          }, {
            value: '仓库3',
            label: '仓库3'
          }
        ],
        applyTime: '',
        applyReason: '',
      },

      currentPage: 1,
      pageSize: 6,

      tableData: [{
        applicationDate: '2023-2-8 08:49',
        name: 'xxx',
        equipment: '乒乓球',
        num: '3',
        warehouse: '东一',
        reason: '现数量不能满足教学需求',
        applicationStatus: 0,
        explain: '',
        auditor: '',
      },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          equipment: '乒乓球',
          num: '3',
          warehouse: '东一',
          reason: '弥补报废后差异',
          applicationStatus: 1,
          explain: '同意',
          auditor: '',
        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          equipment: '乒乓球',
          num: '3',
          warehouse: '东一',
          reason: '现数量不能满足教学需求现数量不能满足教学需求现数量不能满足教学需求现数量不能满足教学需求现数量不能满足教学需求',
          applicationStatus: -1,
          explain: '原因不合理充分，不同意',
          auditor: '',
        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          equipment: '乒乓球',
          num: '3',
          warehouse: '东一',
          reason: '现数量不能满足教学需求',
          applicationStatus: 1,
          explain: '',
          auditor: '王小明',
        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          equipment: '乒乓球',
          num: '3',
          warehouse: '东一',
          reason: '现数量不能满足教学需求',
          applicationStatus: 0
        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          equipment: '乒乓球',
          num: '3',
          warehouse: '东一',
          reason: '现数量不能满足教学需求',
          applicationStatus: 0
        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          equipment: '乒乓球',
          num: '3',
          warehouse: '东一',
          reason: '现数量不能满足教学需求',
          applicationStatus: -1
        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          equipment: '乒乓球',
          num: '3',
          warehouse: '东一',
          reason: '现数量不能满足教学需求',
          applicationStatus: -1
        },],

      addScrapDialogVisible: false,
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

      userInfo: {

      }

    }
  },
  created() {
    this.getUserInfo()
  },

  methods: {

    getUserInfo() {
      this.$axios.get("/sysUser/UserInfo").then(res => {

        this.userInfo = res.data.data;
      })
    },

    addApplyDialogclose() {
      this.$nextTick(function () {
        this.$refs.applyFromData.resetFields();
      })
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

    applyStatus(row, column) {
      if (row.applicationStatus === 0) {
        return '审核中'
      } else if (row.applicationStatus === 1) {
        return '已通过'
      } else {
        return '已驳回'
      }
    },


    submitQueryForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {

          let starDate = this.$moment(this.queryFromData.picker[0]).format('YYYY-MM-DD')
          let endDate = this.$moment(this.queryFromData.picker[1]).format('YYYY-MM-DD')

          this.queryFromData.queryStarTime = starDate
          this.queryFromData.queryEndTime = endDate
          console.log("this.queryFromData数据")
          console.log('器材名称: ' + this.queryFromData.equipment
              + '\n仓库: ' + this.queryFromData.warehouse
              + '\n日期: ' + '开始时间：' + this.queryFromData.queryStarTime
              + '结束时间：' + this.queryFromData.queryEndTime
              + '\n原因: ' + this.queryFromData.reason
              + '\n状态: ' + this.queryFromData.applicationStatus
              + '\n审核人员: ' + this.queryFromData.auditor)
        } else {
          console.log('error submit!!');
          return false;
        }
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