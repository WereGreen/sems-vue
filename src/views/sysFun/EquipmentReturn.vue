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

    </div>

    <el-button type="primary" @click="difference">查看差异记录</el-button>


    <el-dialog title="差异记录"
               center
               width="60%"
               :visible.sync="differenceDialog">
      <el-table
          :cell-style="rowStyle"
          height="450px"
          style="width: 100%;"
          stripe
          :data="differenceTable">

        <el-table-column
            property="differenceDate"
            align="center"
            :formatter="carTimeFilter"
            label="日期">

        </el-table-column>
        <el-table-column
            property="name"
            align="center"
            label="姓名">

        </el-table-column>
        <el-table-column
            property="equipmentName"
            align="center"
            label="器材名称">
        </el-table-column>
        <el-table-column
            property="lendNum"
            align="center"
            label="应归还数量">
        </el-table-column>
        <el-table-column
            property="returnNum"
            align="center"
            label="实际归还">
        </el-table-column>

        <el-table-column
            property="reason"
            align="center"
            :show-overflow-tooltip="true"
            label="原因">
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--  表格  -->
    <div style="margin-bottom: -20px">
      <el-table
          :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          :cell-style="rowStyle"
          :hide-on-single-page="tableData.length < 6"
          :row-class-name="tableRowClassName"
          :default-sort="{prop: 'date', order: 'descending'}"
          style="width: 100%">
        <el-table-column
            prop="applicationTime"
            label="使用时间"
            :formatter="carTimeFilter"
            sortable
            align="center">
        </el-table-column>
        <el-table-column
            prop="name"
            label="使用人"
            align="center">
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
            width="100px"
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
            sortable
            label="预计归还时间">
        </el-table-column>
        <el-table-column
            prop="operation"
            align="center"
            label="操作">

          <template slot-scope="scope">
            <el-button
                size="mini"
                type="success"
                round
                plain
                @click="returnEquipment(scope.$index, scope.row)">归还
            </el-button>
            <el-button
                size="mini"
                type="primary"
                round
                plain
                @click="delayReturn(scope.$index, scope.row)">延迟
            </el-button>
          </template>

        </el-table-column>

      </el-table>
    </div>

    <!--  归还/延迟 操作  -->
    <div>
      <!--   归还   -->
      <el-dialog
          title="归还使用器材"
          :visible.sync="returnDialogVisible"
          @close="returnDialogclose()"
          width="45%"
          center>


        <el-form label-position="right" label-width="80px" :model="returnFromData">

          <div style="display: flex;">
            <el-form-item label="使用人" :label-width="formLabelWidth">
              <el-input v-model="returnFromData.name"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="器材名称" :label-width="formLabelWidth">
              <el-input v-model="returnFromData.equipment"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>
          </div>

          <div style="display: flex;">
            <el-form-item label="所属仓库" :label-width="formLabelWidth">
              <el-input v-model="returnFromData.warehouse"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="使用数量" :label-width="formLabelWidth">
              <el-input v-model="returnFromData.num"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>
          </div>

          <el-form-item label="使用原因" :label-width="formLabelWidth">
            <el-input v-model="returnFromData.reason"
                      type="textarea"
                      style="width: 480px"
                      :disabled="true"></el-input>
          </el-form-item>

          <div style="display: flex;">

            <el-form-item label="开始使用时间" :label-width="formLabelWidth">
              <el-input v-model="returnFromData.applicationTime"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="预计归还时间" :label-width="formLabelWidth">
              <el-input v-model="returnFromData.queryEndTime"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>

          </div>

          <div style="display: flex;">

            <el-form-item label="实际归还数量" :label-width="formLabelWidth">
              <el-input-number v-model="returnFromData.actualNum"
                               controls-position="right"
                               @change="changeReturnNum"
                               size="medium"
                               style="width: 180px;"
                               :min="0"
                               :max="99">
              </el-input-number>
            </el-form-item>

            <el-form-item label="实际归还时间" :label-width="formLabelWidth">
              <el-input v-model="returnFromData.returnTime"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>

          </div>

          <el-form-item label="超期归还原因" v-if="returnFromData.timeChange" :label-width="formLabelWidth">
            <el-input
                type="textarea"
                placeholder="请输入原因"
                v-model="returnFromData.delayReason"
                maxlength="100"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4}"
                style="width: 480px"
                clearable>
            </el-input>
          </el-form-item>

          <el-form-item :label="returnFromData.changeState" v-if="returnFromData.change" :label-width="formLabelWidth">
            <el-input
                type="textarea"
                placeholder="请输入原因"
                v-model="returnFromData.changeReason"
                maxlength="100"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4}"
                style="width: 480px"
                clearable>
            </el-input>
          </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="returnDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitReturnFrom">确 定</el-button>
        </span>
      </el-dialog>

      <!--   延迟   -->
      <el-dialog
          title="延迟归还器材"
          :visible.sync="delayDialogVisible"
          @close="delaydialogclose()"
          width="50%"
          center>


        <el-form label-position="right" label-width="80px" :model="delayFromData">

          <div style="display: flex;">
            <el-form-item label="使用人" :label-width="formLabelWidth">
              <el-input v-model="delayFromData.name"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="器材名称" :label-width="formLabelWidth">
              <el-input v-model="delayFromData.equipment"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>
          </div>

          <div style="display: flex;">
            <el-form-item label="所属仓库" :label-width="formLabelWidth">
              <el-input v-model="delayFromData.warehouse"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="使用数量" :label-width="formLabelWidth">
              <el-input v-model="delayFromData.num"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>
          </div>

          <el-form-item label="使用原因" :label-width="formLabelWidth">
            <el-input v-model="delayFromData.reason"
                      type="textarea"
                      style="width: 480px"
                      :disabled="true"></el-input>
          </el-form-item>

          <div style="display: flex;">

            <el-form-item label="开始使用时间" :label-width="formLabelWidth">
              <el-input v-model="delayFromData.applicationTime"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="预计归还时间" :label-width="formLabelWidth">
              <el-input v-model="delayFromData.returnTime"
                        style="width: 180px"
                        :disabled="true"></el-input>
            </el-form-item>

          </div>

          <el-form-item label="延迟至何时归还" :label-width="formLabelWidth">
            <div style="width: 200px;">
              <el-date-picker
                  v-model="delayFromData.startDate"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm"
                  placeholder="请选择新的归还时间"
                  style="width:200px"
                  :picker-options="startPickerOptions"
              />

            </div>
          </el-form-item>


          <el-form-item label="延迟归还原因" :label-width="formLabelWidth">
            <el-input
                type="textarea"
                placeholder="请输入原因"
                v-model="delayFromData.delayReason"
                maxlength="100"
                show-word-limit
                :autosize="{ minRows: 2, maxRows: 4}"
                style="width: 480px"
                clearable>
            </el-input>
          </el-form-item>


        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="delayDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitdelayForm">确 定</el-button>
        </span>
      </el-dialog>

    </div>


    <!--  分页  -->
    <div class="block">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :hide-on-single-page="tableData.length < 7"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="tableData.length">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "return",
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

      returnFromData: {
        useId: 0,
        username: '',
        name: '',
        equipment: '',
        num: '',
        actualNum: '',
        change: false,
        timeChange: false,
        changeState: '',
        changeReason: '',
        delayReason: '',
        warehouse: '',
        reason: '',
        applicationTime: '',
        queryEndTime: '',
        returnTime: ''
      },

      startPickerOptions: {
        disabledDate: (time) => {
          var time1 = new Date(this.delayFromData.returnTime).getTime();

          return time.getTime() < time1 - 3600 * 1000 * 24
        },

      },

      delayFromData: {
        useId: 0,
        startDate: '',//时间
        username: '',
        name: '',
        equipment: '',
        num: '',
        delayReason: '',
        warehouse: '',
        reason: '',
        applicationTime: '',
        returnTime: '',
        delayTime: ''
      },

      currentPage: 1,
      pageSize: 6,

      classNameOptions: [
        {
          label: '',
          value: '',
        },
      ],

      differenceTable: [
        {},
      ],

      tableData: [{
        useId: 0,
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


      name: '',

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

      returnDialogVisible: false,
      delayDialogVisible: false,
      differenceDialog: false,

      formLabelWidth: '120px',

    }
  },

  created() {
    this.getUserInfo()
    this.getClassInfo()
    this.getEquipmentInfo()
    this.getWarehouseInfo()
    this.getReturnInfo()
  },

  methods: {

    getUserInfo() {
      this.$axios.get("/tb/userInfo").then(res => {

        this.name = res.data.data.name
        this.queryFromData.name = res.data.data.username


      })
    },

    getReturnInfo() {

      this.$axios.get("/tb/use/returnInfo").then(res => {

        let use = res.data.data.useList;
        console.log(use)

        this.tableData = [];

        for (let i = 0; i < use.length; i++) {
          this.$set(this.tableData, i, {

            useId: use[i].id,
            username: use[i].name,
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

          if (classifications[i].className == "固定资产") {
            continue;
          }

          this.$set(this.test, i - 1, {
            label: classifications[i].className,
          })

          this.$set(this.classNameOptions, i - 1, {
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

    difference() {
      this.differenceDialog = true;

      this.$axios.get("/tb/difference/info").then(res => {

        this.differenceTable = [];

        let difference = res.data.data.differenceList;

        for (let i = 0; i < difference.length; i++) {
          this.$set(this.differenceTable, i, {

            useId: difference[i].id,
            differenceDate: difference[i].differenceDate,
            username: difference[i].username,
            name: this.name,
            equipmentName: difference[i].equipment,
            lendNum: difference[i].lendNum,
            returnNum: difference[i].returnNum,
            reason: difference[i].reason,

          })
        }


      })
    },

    carTimeFilter: function (row, column, cellValue) {
      if (cellValue != null) {
        return moment(cellValue).format("YYYY-MM-DD HH:mm");
      }
    },

    submitdelayForm() {

      let dfd = this.delayFromData;

      if (!dfd.startDate || !dfd.delayReason) {
        this.$message.error('请将信息填完整后重试');
        return
      }
      if (dfd.startDate) {
        let choiceDate = this.$moment(dfd.startDate).format('YYYY-MM-DD')
        let choiceTime = this.$moment(dfd.startDate).format('HH:mm')


        let returnDate = this.$moment(dfd.returnTime).format('YYYY-MM-DD')
        let returnTime = this.$moment(dfd.returnTime).format('HH:mm')

        if (dfd.startDate < this.getCurrentTime()) {
          this.$message.error('延迟归还时间不能小于当前时间！请重新选择');
          return
        }

        if (choiceDate == returnDate) {
          if (choiceTime < returnTime) {
            this.$message.error('延迟归还时间不能小于预计归还时间！请重新选择');
            return
          }
        }
      }


      console.log("延迟归还时间数据")
      console.log(
          "ID：" + dfd.useId +
          "\n使用人：" + dfd.name +
          "\n器材：" + dfd.equipment +
          "\n使用数量：" + dfd.num +
          "\n所属仓库：" + dfd.warehouse +
          "\n使用原因：" + dfd.reason +
          "\n开始使用时间：" + dfd.applicationTime +
          "\n预计归还时间：" + dfd.returnTime +
          "\n延迟至何时归还：" + dfd.startDate +
          "\n理由：" + dfd.delayReason
      )
      console.log(this.delayFromData)

      this.$axios.post('/tb/use/delay', this.delayFromData).then(res => {

        this.getReturnInfo();
        this.$message({
          showClose: true,
          message: "延迟归还成功！~",
          type: 'success'
        });

        this.delayDialogVisible = false;
      })

    },

    submitReturnFrom() {

      let rfd = this.returnFromData;

      //校验信息是否完善，是否超期归还或照成差异
      if (rfd.change) {
        if (!rfd.changeReason) {
          this.$message.error('请将信息填完整后重试');
          return
        }

        //如有差异则对后端发送差异请求
        this.$axios.post('/tb/difference/add', this.returnFromData).then(res => {

          this.$message({
            showClose: true,
            message: "存在差异！请根据差异向超级管理员提交新增或报废申请！",
            type: 'warning'
          });

        })

      }

      if (rfd.timeChange) {
        if (!rfd.delayReason) {
          this.$message.error('请将信息填完整后重试');
          return
        }

        //如超期则向后端发送超期请求
        this.$axios.post('/tb/use/delay', this.returnFromData).then(res => {

          this.$message({
            showClose: true,
            message: "超期归还！请关注归还时间！",
            type: 'warning'
          });

        })

      }

      console.log("returnFromData")
      console.log(rfd)

      //向后端发送归还请求
      this.$axios.post('/tb/use/returnEquipment', this.returnFromData).then(res => {

        this.$message({
          showClose: true,
          message: "归还器材成功！~",
          type: 'success'
        });

        this.getReturnInfo();

      })

      this.returnDialogVisible = false;
    },

    returnDialogclose() {
      this.returnFromData.change = false;


    },

    delaydialogclose() {
      this.delayFromData.startDate = '';
    },

    returnEquipment(index, row) {
      this.returnDialogVisible = true;

      let rfd = this.returnFromData;

      rfd.delayReason = '';
      rfd.changeReason = '';
      rfd.useId = row.useId;
      rfd.username = row.username,
          rfd.name = row.name;
      rfd.equipment = row.equipmentName;
      rfd.num = row.quantity;
      rfd.actualNum = row.quantity;
      rfd.warehouse = row.warehouse;
      rfd.reason = row.reason;
      rfd.applicationTime = row.applicationTime;
      rfd.queryEndTime = row.returnTime;
      rfd.returnTime = this.getCurrentTime()


      let yy = new Date(rfd.returnTime).getFullYear();

      let mm = new Date(rfd.returnTime).getMonth() + 1 < 10 ?
          '0' + (new Date(rfd.returnTime).getMonth() + 1) : (new Date(rfd.returnTime).getMonth() + 1);

      let dd = new Date(rfd.returnTime).getDate() < 10 ?
          '0' + new Date(rfd.returnTime).getDate() : new Date(rfd.returnTime).getDate();

      let hh = new Date(rfd.returnTime).getHours() < 10 ?
          '0' + new Date(rfd.returnTime).getHours() : new Date(rfd.returnTime).getHours();

      let mf = new Date(rfd.returnTime).getMinutes() + 10;

      if (mf >= 60) {
        mf = '0' + (mf - 60);
        hh = hh + 1;
        if (hh >= 24) {
          hh = '0' + (hh - 24);
          dd = dd + 1;
          let testYYMM = yy + '-' + mm
          let thisMd = moment(testYYMM, "YYYY-MM").daysInMonth()

          if (dd > thisMd) {
            dd = '0' + (dd - thisMd)
            mm = new Date(rfd.returnTime).getMonth() + 2 < 10 ?
                '0' + (new Date(rfd.returnTime).getMonth() + 2) : (new Date(rfd.returnTime).getMonth() + 2);
            ;
            if (mm > 12) {
              mm = '0' + (mm - 12);
              yy = new Date(rfd.returnTime).getFullYear() + 1;
            }
          }
        }
      }


      let dateValue = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf;

      console.log("归还时间+ 10：")
      console.log(dateValue)


      rfd.timeChange = this.compareDate(dateValue, rfd.queryEndTime)

    },

    changeReturnNum() {

      let returnData = this.returnFromData;

      if (returnData.num > returnData.actualNum) {
        returnData.change = true;
        returnData.changeState = "减少原因";
      } else if (returnData.num < returnData.actualNum) {
        returnData.change = true;
        returnData.changeState = "增加原因";
      } else {
        returnData.change = false;
      }
    },

    delayReturn(index, row) {
      this.delayDialogVisible = true;

      let dfd = this.delayFromData;

      dfd.delayReason = '';

      dfd.useId = row.useId;
      dfd.username = row.username;
      dfd.name = row.name;
      dfd.equipment = row.equipmentName;
      dfd.num = row.quantity;
      dfd.warehouse = row.warehouse;
      dfd.reason = row.reason;
      dfd.applicationTime = row.applicationTime;
      dfd.returnTime = row.returnTime;

      console.log(index, row);
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

          return this.$axios.post('/tb/use/returnSearch', this.queryFromData).then(res => {

            let use = res.data.data.useList;
            console.log(use)

            this.tableData = [];

            for (let i = 0; i < use.length; i++) {

              this.$set(this.tableData, i, {

                userId: use[i].id,
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

      let dateValue = this.getCurrentTime()

      let timeResults = this.compareDate(dateValue, row.returnTime);

      if (timeResults) {
        return 'warning-row';
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
      this.getReturnInfo();
    }
  },

}
</script>

<style scoped>

.el-table >>> .success-row {
  background: #e1f3d8;
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