<template>

  <div>

    <!--  搜索表单/添加使用  -->
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
                     style="width: 180px;"
                     clearable
                     placeholder="请选择器材">

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
                     filterable
                     clearable
                     style="width: 180px;"
                     placeholder="请选择仓库">
            <el-option
                v-for="item in warehouseOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" prop="picker">
          <el-date-picker
              v-model="queryFromData.picker"
              type="datetimerange"
              style="width: 340px;"
              :picker-options="queryPickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['06:00:00', '22:30:00']"
              format="yyyy-MM-dd HH:mm"
              value-format="yyyy-MM-dd HH:mm"
              align="right">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="使用原因" prop="reason">
          <el-input v-model="queryFromData.reason"
                    clearable
                    maxlength="10"
                    show-word-limit
                    placeholder="请输入原因">

          </el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitQueryForm('queryFromData')">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetQueryForm('queryFromData')">重置</el-button>
        </el-form-item>
      </el-form>


      <!--  添加使用    -->

      <div class="addUse">

        <el-button type="primary" @click="addUse">新增使用</el-button>

        <el-dialog title="新增体育器材使用"
                   :visible.sync="dialogFormVisible"
                   @close="dialogclose()"
                   width="40%"
                   center>

          <el-form :model="addUseFromData" ref="addUseFromData" :rules="rules">

            <el-form-item label="日期" :label-width="formLabelWidth" prop="picker">
              <el-date-picker
                  v-model="addUseFromData.picker"
                  type="datetimerange"
                  :picker-options="addPickerOptions"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :default-time="['06:00:00', '22:30:00']"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  align="right">
              </el-date-picker>
            </el-form-item>

            <div class="equipmentInformation">
              <el-form :label-width="formLabelWidth"
                       v-for="(equipment, index) in addUseFromData.equipments"
                       :prop="'equipment.' + index + '.value'"
                       :key="equipment.key"
                       :model="equipment"
                       ref="equipment"
                       :rules="rules"
              >

                <div style="display: flex">

                  <el-form-item label="器材名称" prop="value">
                    <el-select v-model="equipment.value"
                               :key="equipment.key"
                               style="width: 150px"
                               filterable
                               clearable
                               placeholder="请选择器材">

                      <el-option-group
                          v-for="group in options"
                          :key="group.label"
                          :label="group.label">
                        <el-option
                            v-for="item in group.options"
                            :key="item.equipment"
                            :label="item.equipment"
                            :disabled="optionStatus(item.equipment)"
                            :value="item.equipment">
                        </el-option>
                      </el-option-group>

                    </el-select>
                  </el-form-item>

                  <el-form-item label="数量"
                                :label-width="formLabelWidth"
                                style="margin-left: -50px"
                                prop="num">
                    <el-input-number v-model="equipment.num" controls-position="right" :min="1" :max="99" size="small"
                                     style="width: 90px"></el-input-number>
                  </el-form-item>
                  <el-button class="btn" type="primary" icon="el-icon-plus" circle
                             @click.prevent="addDomain(equipment)" :disabled="addFlag"></el-button>
                  <el-button class="btn" type="danger" icon="el-icon-delete" circle style="margin-left: 5px"
                             @click.prevent="removeDomain(equipment)" :disabled="flag"></el-button>

                </div>


              </el-form>

            </div>

            <el-form-item label="所属仓库" :label-width="formLabelWidth" prop="warehouse">
              <el-select v-model="addUseFromData.warehouse" clearable placeholder="请选择仓库">
                <el-option
                    v-for="item in warehouseOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="使用原因" :label-width="formLabelWidth" prop="reason">
              <el-input v-model="addUseFromData.reason"
                        clearable
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        maxlength="200"
                        show-word-limit
                        placeholder="请填写使用原因">

              </el-input>
            </el-form-item>
          </el-form>


          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAddForm(addUseFromData)">确 定</el-button>
          </div>
        </el-dialog>
      </div>

    </div>

    <!--  表格  -->
    <div>
      <el-table
          :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          stripe
          :cell-style="rowStyle"
          style="width: 100%">
        <el-table-column
            prop="applicationTime"
            label="开始使用时间"
            align="center"
            :formatter="carTimeFilter"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="使用人"
            align="center"
            width="180">
        </el-table-column>
        <el-table-column
            prop="className"
            align="center"
            label="器材分类">
        </el-table-column>
        <el-table-column
            prop="equipmentName"
            align="center"
            label="器材名称">
        </el-table-column>
        <el-table-column
            prop="quantity"
            align="center"
            label="数量">
        </el-table-column>
        <el-table-column
            prop="warehouse"
            align="center"
            label="所属仓库">
        </el-table-column>
        <el-table-column
            prop="reason"
            align="center"
            :show-overflow-tooltip="true"
            label="使用原因">
        </el-table-column>
        <el-table-column
            prop="returnTime"
            align="center"
            :formatter="carTimeFilter"
            label="预计归还时间">
        </el-table-column>

      </el-table>
    </div>

    <!--  分页  -->
    <div class="block">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :hide-on-single-page="tableData.length < 6"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tableData.length">
      </el-pagination>
    </div>

  </div>
</template>

<script>

import moment from "moment";
import Login from "@/views/Login";

export default {

  name: "apply",

  data() {

    return {

      queryPickerOptions: {
        disabledDate(time) {
          return (time.getTime() + 3600 * 1000 * 24 * 30) < Date.now() || (time.getTime() - 3600 * 1000 * 24 * 30) > Date.now();
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

      addPickerOptions: {
        disabledDate(time) {
          return (time.getTime() + 3600 * 1000 * 24) < Date.now() || (time.getTime() - 3600 * 1000 * 24 * 30) > Date.now();
        },
      },

      queryFromData: {
        name: '',
        className: '',
        equipment: '',
        warehouse: '',
        picker: [],
        applyDate: '',
        returnDate: '',
        reason: '',
      },

      addUseFromData: {
        name: '',
        equipments: [
          {
            value: '',
            num: 1,
            className: '',
          },
        ],
        warehouse: '',
        picker: [],
        applyDate: '',
        returnDate: '',
        reason: '',
        state: 0,
      },

      flag: true,
      addFlag: false,
      currentPage: 1,
      pageSize: 6,

      tableData: [{
        applicationTime: '',
        name: '',
        className: '',
        equipmentName: '',
        quantity: '',
        warehouse: '',
        reason: '',
        returnTime: '',
        returnStatus: ''
      },],

      dialogTableVisible: false,
      dialogFormVisible: false,

      formLabelWidth: '120px',
      rules: {
        picker: [
          {
            type: 'array',
            required: true,
            message: '请选择日期区间'
          }
        ],
        equipments: [
          {
            required: true, message: '请输入供应商名称', trigger: ['blur', 'change']
          }
        ],
        value: [
          {
            required: true, message: '请选择器材', trigger: ['blur', 'change']
          }
        ],
        num: [
          {
            required: true, message: '请选择数量', trigger: ['blur', 'change']
          }
        ],
        warehouse: [
          {
            required: true, message: '请选择仓库', trigger: ['blur', 'change']
          }
        ],
        reason: [
          {
            required: true, message: '请选择原因', trigger: ['blur', 'change']
          }
        ]

      },


      test: [
        {
          label: '',
          options: [
            {},

          ]
        }
      ],

      classNameOptions: [
        {
          label: '',
          value: '',
        },
      ],

      warehouseOptions: [
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
      name: '',

      equipmentInfo: [
        {},
      ]

    }
  },

  created() {
    this.getUserInfo()
    this.getClassInfo()
    this.getEquipmentInfo()
    this.getWarehouseInfo()
    this.getUseInfo()
  },

  methods: {

    optionStatus(equipment) {
      for (let i = 0; i < this.addUseFromData.equipments.length; i++) {
        if (i < 1) {
          continue;
        }
        if (equipment == this.addUseFromData.equipments[i - 1].value) {
          return true
        }
      }
      return false
    },

    getUserInfo() {
      this.$axios.get("/tb/userInfo").then(res => {

        this.name = res.data.data.name
        this.queryFromData.name = res.data.data.username
        this.addUseFromData.name = res.data.data.username
        console.log(this.name)

      })
    },

    getUseInfo() {

      this.$axios.get("/tb/use/info").then(res => {

        let use = res.data.data.useList;
        console.log(use)

        for (let i = 0; i < use.length; i++) {
          this.$set(this.tableData, i, {

            applicationTime: use[i].applyDate,
            name: this.name,
            className: use[i].className,
            equipmentName: use[i].equipment,
            quantity: use[i].num,
            warehouse: use[i].warehouse,
            reason: use[i].reason,
            returnTime: use[i].returnDate,
            returnStatus: use[i].state
          })
        }

        console.log("this.tableData")
        console.log(this.tableData)

        console.log("this.warehouseOptions")
        console.log(this.warehouseOptions)

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

    getApplyInfo() {
      this.$axios.get("/tb/apply/info").then(res => {
        this.userInfo = res.data.data;
      })
    },

    carTimeFilter: function (row, column, cellValue) {
      if (cellValue != null) {
        return moment(cellValue).format("YYYY-MM-DD HH:mm");
      }
    },

    submitQueryForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.queryFromData.applyDate = this.queryFromData.picker[0];
          this.queryFromData.returnDate = this.queryFromData.picker[1];
          console.log("this.queryFromData数据")
          console.log('器材名称: ' + this.queryFromData.equipment
              + '\n仓库: ' + this.queryFromData.warehouse
              + '\n日期: ' + '开始时间：' + this.queryFromData.applyDate
              + '结束时间：' + this.queryFromData.returnDate
              + '\n原因: ' + this.queryFromData.reason)

          return this.$axios.post('/tb/use/search', this.queryFromData).then(res => {

            let use = res.data.data.useList;
            console.log(use)

            this.tableData = [];

            for (let i = 0; i < use.length; i++) {

              this.$set(this.tableData, i, {

                applicationTime: use[i].applyDate,
                name: this.name,
                className: use[i].className,
                equipmentName: use[i].equipment,
                quantity: use[i].num,
                warehouse: use[i].warehouse,
                reason: use[i].reason,
                returnTime: use[i].returnDate,
                returnStatus: use[i].state
              })
            }

          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    addUse() {
      this.dialogFormVisible = true;
      this.addUseFromData.equipments = [{
        value: '',
        num: 1,
      }]
    },

    dialogclose() {
      this.$nextTick(function () {
        this.$refs.addUseFromData.resetFields();
      })
      this.addUseFromData.equipments = []
    },

    submitAddForm(formName) {
      this.$refs.addUseFromData.validate((valid) => {
        if (valid) {  //如果表单信息不为空
          let addUse = this.addUseFromData;

          //校验器材选项信息是否选择完整
          for (let i = 0; i < addUse.equipments.length; i++) {
            let equipmentValue = addUse.equipments[i].value
            if (!equipmentValue) {
              this.$message.error('请将信息填完整后重试！');
              return false
            }
          }

          //将用户选择的使用时间和预计归还时间取出互相对比及与当前时间对比
          //限制用户的预计归还时间必须大于使用时间一小时，预计归还时间必须大于等于当前时间
          //如果不满足条件则提示用户错误信息
          addUse.applyDate = addUse.picker[0];
          addUse.returnDate = addUse.picker[1];

          let oldApplyDate = addUse.applyDate

          let yy = new Date(oldApplyDate).getFullYear();

          let mm = new Date(oldApplyDate).getMonth() + 1 < 10 ?
              '0' + (new Date(oldApplyDate).getMonth() + 1) : new Date(oldApplyDate).getMonth() + 1;

          let dd = new Date(oldApplyDate).getDate() < 10 ?
              '0' + new Date(oldApplyDate).getDate() : new Date(oldApplyDate).getDate();

          let hh = new Date(oldApplyDate).getHours() + 1 < 10 ?
              '0' + (new Date(oldApplyDate).getHours() + 1 ) : new Date(oldApplyDate).getHours() + 1;

          let mf = new Date(oldApplyDate).getMinutes() < 10 ?
              '0' + new Date(oldApplyDate).getMinutes() : new Date(oldApplyDate).getMinutes();

          let compareDate = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;


          if (addUse.applyDate < this.compareApplyTime()) {
            this.$message.error('使用日期必须大于当前时间！');
            return false
          }

          if (addUse.returnDate < compareDate) {
            this.$message.error('预计归还日期必须大于使用日期一小时以上！');
            return false
          }

          //将用户选择的器材信息处理成列表准备发送给后端处理
          for (let i = 0; i < addUse.equipments.length; i++) {
            for (let j = 0; j < this.equipmentInfo.length; j++) {
              if (addUse.equipments[i].value == this.equipmentInfo[j].equipment) {
                addUse.equipments[i].className = this.equipmentInfo[j].className
                break;
              }
            }
          }

          //将数据发送给后端进行处理
          return this.$axios.post('/tb/use/addUse', this.addUseFromData)
              .then(res => {

                //后端返回成功消息后向用户提示使用成功并更新页面数据，关闭对话框
                this.$message({
                  showClose: true,
                  message: "添加使用成功！~",
                  type: 'success'
                });
                this.getUseInfo()
                this.dialogFormVisible = false;

              })


        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    compareApplyTime() {
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
      let dd = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate();
      let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();

      let dateValue = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;
      return dateValue
    },


    removeDomain(item) {
      if (this.addUseFromData.equipments.length > 1) {
        // 表示先获取这个元素的下标，然后从这个下标开始计算，删除长度为1的元素
        console.log("item")
        console.log(item)
        this.addUseFromData.equipments.splice(this.addUseFromData.equipments.indexOf(item), 1);
      }
      this.flags()
      this.addFlag = false
    },


    addDomain() {
      let len = this.addUseFromData.equipments.length
      if (len < 10) {
        this.$set(this.addUseFromData.equipments, len, {
          num: 1,
          value: ''
        })
        this.flags()
      }
      if ((len + 1) == 10) {

        this.addFlag = true
      }


    },

    // 判断数组长度
    flags() {
      if (this.addUseFromData.equipments.length < 2) {
        this.flag = true
      } else {
        //先赋值为true再赋为false, 不然会没反应
        this.flag = true
        this.flag = false
      }
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

    rowStyle() {
      return "text-align:center";
    },

    resetQueryForm(formName) {
      this.$refs[formName].resetFields();
      this.tableData = [];
      this.getUseInfo();
    }
  },

}
</script>

<style scoped>
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

.block {
  margin-top: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.addUse {
  margin-bottom: 10px;
}

/deep/ .el-textarea textarea {
  padding-bottom: 20px;
}

/deep/ .el-textarea .el-input__count {
  height: 12px;
  line-height: 12px;
}
</style>