<template>

  <div style="display: flex">

    <div class="left">

      <!--  搜索表单  -->

      <div class="searchForm">
        <el-form :inline="true"
                 :model="queryFromData"
                 class="demo-form-inline"
                 size="medium"
                 ref="queryFromData">

          <div style="display: flex;align-items: center;justify-content: center;">
            <el-form-item label="操作日期" prop="picker">
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

            <el-form-item label="操作类型" prop="operationType">
              <el-select
                  v-model="queryFromData.operationType"
                  clearable
                  placeholder="请选择操作">
                <el-option
                    v-for="item in operationTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>


          <div style="display: flex;align-items: center;justify-content: center;">

            <el-form-item label="操作人员" prop="username">
              <el-select
                  v-model="queryFromData.username"
                  clearable
                  filterable
                  style="width: 205px"
                  placeholder="请选择操作人"
              >
                <el-option
                    v-for="item in adminOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="具体操作" prop="details">
              <el-input
                  v-model="queryFromData.details"
                  placeholder="请输入具体操作"
                  maxlength="10"
                  show-word-limit
                  clearable
              >

              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitQueryForm('queryFromData')">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetQueryForm('queryFromData')">重置</el-button>
            </el-form-item>
          </div>
        </el-form>


      </div>


      <div style="box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);padding-bottom: 15px;">

        <!--  表格  -->
        <div>
          <el-table
              :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
              :cell-style="rowStyle"
              :row-class-name="tableRowClassName"
              :default-sort="{prop: 'date', order: 'descending'}"
              style="width: 100%">
            <el-table-column
                prop="operationDate"
                label="操作时间"
                sortable
                align="center">
            </el-table-column>

            <el-table-column
                prop="username"
                label="操作人员"
                :formatter="operateName"
                align="center">
            </el-table-column>

            <el-table-column
                prop="operationType"
                label="操作类型"
                :formatter="operationStatus"
                align="center">
            </el-table-column>

            <el-table-column
                prop="details"
                align="center"
                :show-overflow-tooltip="true"
                label="具体操作">
            </el-table-column>

          </el-table>
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

    </div>

    <!--  操作区  -->
    <div class="right">

      <div style="font-size: 20px;margin: 20px;">操作区</div>

      <div style="display: flex; align-items: center; justify-content: center; width: 100%;height: 260px;">

        <div style="margin-right: 20px">
          <el-card shadow="always" class="dataCard">
            <div style="font-size: 18px;color: #606266">
              现共有仓库
            </div>
            <div style="color: #409EFF;font-size: 80px;
            text-align: center;line-height: 120px;width: 165px;margin-left: -20px;font-weight: bold;">
              {{ countWarehouse }}
            </div>
            <div style="font-size: 18px;color: #909399;float: right">
              个
            </div>
          </el-card>
        </div>


        <div>
          <el-card shadow="always" class="dataCard">
            <div style="font-size: 18px;color: #606266">
              现有器材总量
            </div>
            <div style="color: #67C23A;font-size: 45px;
            text-align: center;line-height: 120px;width: 165px;margin-left: -20px;font-weight: bold;">
              {{ countEquipments }}
            </div>
            <div style="font-size: 18px;color: #909399;float: right">
              份
            </div>
          </el-card>
        </div>

      </div>


      <div style="display: flex; align-items: center; justify-content: center; width: 100%;height: 230px;">

        <div style="margin-right: 20px" @click="managClass">
          <el-card shadow="hover" class="dataCard">

            <div style="font-size: 65px;text-align: center;line-height: 150px;margin-bottom: -20px; color: #409EFF;">
              <i class="el-icon-house"></i>
            </div>

            <div style="font-size: 18px;text-align: center;color: #606266;">
              仓库管理
            </div>

          </el-card>
        </div>


        <div @click="managEquipment">
          <el-card shadow="hover" class="dataCard">

            <div style="font-size: 65px;text-align: center;line-height: 150px;margin-bottom: -20px; color: #67C23A;">
              <i class="el-icon-pie-chart"></i>
            </div>

            <div style="font-size: 18px;text-align: center;color: #606266;">
              库存管理
            </div>

          </el-card>
        </div>

      </div>

      <!--   仓库管理   -->
      <div>

        <el-dialog
            title="仓库管理"
            :visible.sync="managClassDialogVisible"
            width="40%"
            @close="managClassdialogclose()"
            center>


          <el-form :inline="true"
                   :model="warehouseQueryFromData"
                   class="demo-form-inline"
                   style="margin-left: 85px;"
                   size="medium"
                   ref="classQueryFromData">

            <el-form-item label="仓库名称" prop="warehouse">
              <el-select
                  v-model="warehouseQueryFromData.warehouse"
                  clearable
                  filterable
                  style="width: 170px"
                  placeholder="请选择仓库">
                <el-option
                    v-for="item in warehouseOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitWarehouseQueryForm('warehouseQueryFromData')">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetWarehouseQueryForm()">重置</el-button>
            </el-form-item>
          </el-form>


          <el-table
              :data="WarehouseTableData"
              stripe
              height="250"
              style="width: 100%">
            <el-table-column
                prop="warehouse"
                label="仓库名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="address"
                label="仓库地址"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="warehouseOperation"
                label="操作"
                align="center"
            >
              <template slot-scope="scope">

                <el-button type="primary"
                           size="mini"
                           plain round
                           @click="modifyWarehouse(scope.$index, scope.row)">修改
                </el-button>

                <el-button type="danger"
                           size="mini"
                           plain round
                           @click="deleteWarehouseMessageBox(scope.$index, scope.row)">删除
                </el-button>

              </template>

            </el-table-column>
          </el-table>


          <div style="display: flex;align-items: center;justify-content: center;">
            <el-button type="primary"
                       round
                       @click="addClass()"
                       style="align-items: center; margin-top: 25px;">新增仓库
            </el-button>
          </div>


        </el-dialog>

        <!--    修改仓库    -->

        <el-dialog
            title="修改仓库"
            :visible.sync="modifyWarehouseDialogVisible"
            width="25%"
            center>

          <el-form :inline="true"
                   :model="modifyWarehouseFromData"
                   class="demo-form-inline"
                   size="medium"
                   :rules="modifyWarehouseRules"
                   ref="modifyWarehouseFromData">

            <el-form-item label="仓库名称" prop="warehouse">
              <el-input
                  placeholder="请输入修改后的仓库名称"
                  v-model="modifyWarehouseFromData.warehouse"
                  clearable>
              </el-input>
            </el-form-item>

            <el-form-item label="仓库地址" prop="address">
              <el-input
                  placeholder="请输入修改后的仓库地址"
                  v-model="modifyWarehouseFromData.address"
                  clearable>
              </el-input>
            </el-form-item>

          </el-form>


          <span slot="footer" class="dialog-footer">
            <el-button @click="modifyWarehouseDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="modifyWarehouseMessageBox">确 定</el-button>
          </span>

        </el-dialog>


        <!--    新增仓库    -->

        <el-dialog
            title="新增仓库"
            :visible.sync="addWarehouseDialogVisible"
            width="25%"
            @close="addWarehousedialogclose()"
            center>

          <el-form :inline="true"
                   :model="addWarehouseFromData"
                   class="demo-form-inline"
                   size="medium"
                   :rules="addWarehouseRules"
                   ref="addWarehouseFromData">

            <el-form-item label="仓库名称" prop="warehouse">
              <el-input
                  placeholder="请输入新增的仓库名称"
                  v-model="addWarehouseFromData.warehouse"
                  clearable>
              </el-input>
            </el-form-item>

            <el-form-item label="仓库地址" prop="address">
              <el-input
                  placeholder="请输入新增的仓库名称"
                  v-model="addWarehouseFromData.address"
                  clearable>
              </el-input>
            </el-form-item>

          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="addWarehouseDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAddWarehouseFromData()">确 定</el-button>
          </span>

        </el-dialog>

        <!--    删除仓库    -->

        <el-dialog
            title="请为该仓库下库存选择新的仓库"
            :visible.sync="deleteWarehouseDialogVisible"
            width="30%"
            center>

          <el-form :inline="true"
                   :model="updateStockWarehouseFromData"
                   class="demo-form-inline"
                   size="medium"
                   style="display: flex;align-items: center;justify-content: center;"
                   ref="updateStockWarehouseRules">

            <el-form-item label="库存仓库" prop="warehouse">
              <el-select v-model="updateStockWarehouseFromData.warehouse"
                         filterable
                         style="width: 180px;"
                         clearable
                         placeholder="请选择仓库">
                <el-option
                    v-for="item in warehouseOptions"
                    :key="item.value"
                    :disabled="item.value == deleteWarehouse"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          </el-form>


          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteWarehouseDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteWarehouseUpdateStock()">确 定</el-button>
          </span>

        </el-dialog>


      </div>

      <!--   库存管理   -->
      <div>

        <el-dialog
            title="库存管理"
            :visible.sync="managEquipmentDialogVisible"
            width="50%"
            @close="managClassdialogclose()"
            center>


          <el-form :inline="true"
                   :model="stockQueryFromData"
                   class="demo-form-inline"
                   size="medium"
                   ref="stockQueryFromData">

            <div style="display: flex;align-items: center;justify-content: center">
              <el-form-item label="所属仓库" prop="warehouseName">
                <el-select
                    v-model="stockQueryFromData.warehouse"
                    clearable
                    filterable
                    style="width: 170px"
                    placeholder="请选择仓库">
                  <el-option
                      v-for="item in warehouseOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="器材名称" prop="equipment">
                <el-select
                    v-model="stockQueryFromData.equipment"
                    clearable
                    filterable
                    style="width: 170px"
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

              <el-form-item style="margin-left: 15px;">
                <el-button type="primary" @click="submitStockQueryForm()">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="resetStockQueryForm('stockQueryFromData')">重置</el-button>
              </el-form-item>

            </div>

          </el-form>


          <el-table
              :data="stockTableData"
              stripe
              height="300"
              style="width: 100%">

            <el-table-column
                prop="warehouse"
                label="仓库名称"
                align="center"
            >
            </el-table-column>

            <el-table-column
                prop="equipment"
                label="器材名称"
                align="center"
            >
            </el-table-column>

            <el-table-column
                prop="totalStock"
                label="库存数量"
                align="center"
            >
            </el-table-column>

            <el-table-column
                prop="warehouseOperation"
                label="操作"
                align="center"
            >
              <template slot-scope="scope">

                <el-button type="primary"
                           size="mini"
                           plain round
                           @click="modifyStock(scope.$index, scope.row)">修改
                </el-button>

                <el-button type="danger"
                           size="mini"
                           plain round
                           @click="deleteStockMessageBox(scope.$index, scope.row)">删除
                </el-button>

              </template>

            </el-table-column>
          </el-table>


          <div style="display: flex;align-items: center;justify-content: center;">
            <el-button type="primary"
                       round
                       @click="addEquipment()"
                       style="align-items: center; margin-top: 25px;">新增库存
            </el-button>
            <el-button type="primary"
                       round
                       @click="upkeepEquipment()"
                       style="align-items: center; margin-top: 25px;">维修记录
            </el-button>
          </div>


        </el-dialog>

        <!--    维修库存    -->
        <el-dialog title="维修记录"
                   center
                   width="60%"
                   :visible.sync="upkeepDialogVisible">

          <el-form :inline="true"
                   :model="upkeepQueryFromData"
                   class="demo-form-inline"
                   style="margin-left: 85px;"
                   size="medium"
                   ref="classQueryFromData">

            <el-form-item label="仓库名称" prop="warehouse">
              <el-select
                  v-model="upkeepQueryFromData.warehouse"
                  clearable
                  filterable
                  style="width: 170px"
                  placeholder="请选择仓库">
                <el-option
                    v-for="item in warehouseOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="维修状态" prop="state">
              <el-select
                  v-model="upkeepQueryFromData.state"
                  clearable
                  style="width: 170px"
                  placeholder="请选择状态">
                <el-option
                    v-for="item in upkeepStateOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item style="margin-left: 20px;">
              <el-button type="primary" @click="submitUpkeepQueryForm()">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetUpkeepQueryForm()">重置</el-button>
            </el-form-item>
          </el-form>

          <el-table
              :cell-style="rowStyle"
              height="450px"
              style="width: 100%;"
              stripe
              :data="upkeepTableData">

            <el-table-column
                property="startDate"
                align="center"
                label="开始日期">
            </el-table-column>
            <el-table-column
                property="warehouse"
                align="center"
                label="所属仓库">
            </el-table-column>
            <el-table-column
                property="equipment"
                align="center"
                label="维修器材">
            </el-table-column>
            <el-table-column
                property="num"
                align="center"
                label="维修数量">
            </el-table-column>
            <el-table-column
                property="reason"
                align="center"
                :show-overflow-tooltip="true"
                label="原因">
            </el-table-column>
            <el-table-column
                property="operation"
                align="center"
                label="操作/结束日期">

              <template slot-scope="scope">
                <el-button
                    size="mini"
                    type="primary"
                    v-if="scope.row.state == 0"
                    round
                    plain
                    @click="accomplishUpkeep(scope.$index, scope.row)">完成
                </el-button>

                <span v-if="scope.row.state != 0">
              {{ scope.row.endDate }}
            </span>

              </template>

            </el-table-column>
          </el-table>
        </el-dialog>

        <!--    修改库存    -->
        <el-dialog
            title="修改库存"
            :visible.sync="modifyStockDialogVisible"
            width="30%"
            center>

          <el-form :inline="true"
                   :model="modifyStockFromData"
                   class="demo-form-inline"
                   size="medium"
                   :rules="modifyStockRules"
                   ref="modifyStockFromData">


            <div style="display: flex;align-items: center;justify-content: center;">

              <el-form-item label="所属仓库" prop="warehouse">
                <el-select
                    v-model="modifyStockFromData.warehouse"
                    clearable
                    filterable
                    placeholder="请选择仓库">
                  <el-option
                      v-for="item in warehouseOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

            </div>

            <div style="display: flex;align-items: center;justify-content: center;">
              <el-form-item label="器材名称" prop="equipmentName">
                <el-input
                    placeholder="请输入修改后的器材名称"
                    v-model="modifyStockFromData.equipment"
                    :disabled="true"
                    clearable>
                </el-input>
              </el-form-item>
            </div>

            <div style="margin-left: 60px">
              <el-form-item label="库存数量" prop="stock">
                <el-input-number
                    v-model="modifyStockFromData.totalStock"
                    size="small"
                    style="width: 100px"
                    controls-position="right"
                    @change="handleChange"
                    :min="1" :max="9999">
                </el-input-number>
              </el-form-item>
            </div>

          </el-form>


          <span slot="footer" class="dialog-footer">
            <el-button @click="modifyStockDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="modifyStockMessageBox">确 定</el-button>
          </span>

        </el-dialog>


        <!--    新增库存    -->
        <el-dialog title="新增库存"
                   :visible.sync="addStockDialogVisible"
                   @close="addStockdialogclose()"
                   width="30%"
                   center>

          <el-form :model="addStockFromData" ref="addStockFromData" :rules="addStockRules">


            <el-form-item label="仓库名称" :label-width="formLabelWidth" prop="warehouse">
              <el-select
                  v-model="addStockFromData.warehouse"
                  clearable
                  filterable
                  placeholder="请选择仓库">
                <el-option
                    v-for="item in warehouseOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="器材名称" :label-width="formLabelWidth" prop="equipment">
              <el-select
                  v-model="addStockFromData.equipment"
                  clearable
                  filterable
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


            <el-form-item label="新增数量" :label-width="formLabelWidth" prop="stock">
              <el-input-number
                  v-model="addStockFromData.stock"
                  size="small"
                  style="width: 100px"
                  controls-position="right"
                  @change="handleChange"
                  :min="1" :max="9999">
              </el-input-number>
            </el-form-item>


          </el-form>


          <div slot="footer" class="dialog-footer">
            <el-button @click="addStockDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitaddStockFromData()">确 定</el-button>
          </div>
        </el-dialog>


      </div>


    </div>

  </div>

</template>

<script>
import moment from "moment";

export default {
  name: "EquipmentWarehouse",
  data() {

    return {

      countWarehouse: 0,
      countEquipments: 0,
      deleteWarehouse: '',

      updateStockWarehouseFromData: {},

      warehouseOptions: [
        {
          label: '',
          value: '',
        },
      ],

      upkeepStateOptions:[
        {
          label: '维修中',
          value: 0,
        },
        {
          label: '已完成',
          value: 1,
        }
      ],

      addStockFromData: {

        warehouse: '',
        equipment: '',
        stock: 1,

      },

      addWarehouseFromData: {
        warehouse: '',
        address: '',
      },

      modifyWarehouseFromData: {
        oldName: '',
        warehouse: '',
        address: '',
        oldAddress: '',
      },

      modifyStockFromData: {
        oldwarehouse: '',
        oldTotalStock: 0,
        equipment: '',
        warehouse: '',
        totalStock: 0,
        id: 0,
      },


      stockQueryFromData: {
        equipment: '',
        warehouse: '',
      },

      warehouseQueryFromData: {
        warehouse: '',
      },

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

      operationTypeOptions: [
        {
          value: 1,
          label: '新增'
        },
        {
          value: -1,
          label: '删除'
        },
        {
          value: 0,
          label: '修改'
        },
      ],

      queryFromData: {
        picker: [],
        queryStarTime: '',
        queryEndTime: '',
        operationType: '',
        username: '',
        details: '',
      },

      applyFromData: {
        name: '',
        equipment: '',
        num: 1,
        warehouse: '',
        applyTime: '',
        applyReason: '',
      },

      upkeepQueryFromData: {
        username: '',
        equipment: '',
        warehouse: '',
        state: '',
      },

      currentPage: 1,
      pageSize: 6,

      tableData: [],

      WarehouseTableData: [],

      upkeepTableData: [],

      stockTableData: [],

      managClassDialogVisible: false,
      managEquipmentDialogVisible: false,
      modifyWarehouseDialogVisible: false,
      modifyStockDialogVisible: false,
      addWarehouseDialogVisible: false,
      addStockDialogVisible: false,
      upkeepDialogVisible: false,
      deleteWarehouseDialogVisible: false,
      formLabelWidth: '120px',

      flag: true,
      addFlag: false,

      modifyWarehouseRules: {
        warehouse: [
          {required: true, message: '请输入仓库名称！', trigger: ['change', 'blur']}
        ],
        address: [
          {required: true, message: '请输入仓库地址！', trigger: ['change', 'blur']}
        ],
      },

      modifyStockRules: {
        warehouseName: [
          {required: true, message: '请选择所属仓库！', trigger: ['change', 'blur']}
        ]

      },

      addWarehouseRules: {
        warehouse: [
          {required: true, message: '请输入需要添加的仓库名称！', trigger: ['change', 'blur']}
        ],
        address: [
          {required: true, message: '请输入需要添加的仓库地址！', trigger: ['change', 'blur']}
        ]
      },

      addStockRules: {
        warehouse: [
          {required: true, message: '请选择仓库名称！', trigger: ['change', 'blur']}
        ],
        equipment: [
          {required: true, message: '请输入器材名称！', trigger: ['change', 'blur']}
        ],
        stock: [
          {required: true, message: '数量不能为空！', trigger: ['change', 'blur']}
        ],

      },

      username: '',

      userInfo: {},
      adminOptions: [],
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

    }
  },
  created() {

    this.getUserInfo();
    this.getClassInfo();
    this.getEquipmentInfo();
    this.getAdminInfo();
    this.getOperationInfo();
    this.getWarehouseInfo();
    this.getStockInfo();

  },

  methods: {

    getClassInfo() {
      this.$axios.get("/tb/classification/info").then(res => {

        let classifications = res.data.data.classifications;
        for (let i = 0; i < classifications.length; i++) {
          this.$set(this.test, i, {
            label: classifications[i].className,
          })
        }
      })
    },

    getStockInfo() {
      this.$axios.get("/tb/stock/info").then(res => {
        let stockList = res.data.data.stockList;

        this.countEquipments = 0;
        this.stockTableData = [];
        for (let i = 0; i < stockList.length; i++) {
          this.countEquipments += stockList[i].totalStock;

          this.$set(this.stockTableData, i, {
            id: stockList[i].id,
            warehouse: stockList[i].warehouse,
            equipment: stockList[i].equipment,
            totalStock: stockList[i].totalStock,
          })

        }

        console.log("this.countEquipments")
        console.log(this.countEquipments)
      })
    },

    getWarehouseInfo() {
      this.$axios.get("/tb/warehouse/info").then(res => {

        let warehouseList = res.data.data.warehouseList;
        console.log("===============")
        console.log(warehouseList)
        this.countWarehouse = warehouseList.length;


        this.warehouseOptions = [];
        this.WarehouseTableData = [];
        for (let i = 0; i < warehouseList.length; i++) {
          this.$set(this.WarehouseTableData, i, {
            warehouse: warehouseList[i].warehouse,
            address: warehouseList[i].address,
          })

          this.$set(this.warehouseOptions, i, {
            label: warehouseList[i].warehouse,
            value: warehouseList[i].warehouse,
          })
        }
      })
    },

    getOperationInfo() {
      this.$axios.get("/tb/operate/info", {
        // 传递的参数
        params: {
          operationClass: 1,
        }
        // 回调函数,一定要使用箭头函数,不然this的指向不是vue示例
      }).then(res => {

        let operateList = res.data.data.operateList;

        console.log("+++++++++++")
        console.log(operateList)

        this.tableData = [];
        for (let i = 0; i < operateList.length; i++) {
          this.$set(this.tableData, i, {
            username: operateList[i].username,
            operationType: operateList[i].operationType,
            details: operateList[i].details,
            operationDate: operateList[i].operationDate,
          })
        }
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

    getEquipmentInfo() {
      this.$axios.get("/tb/equipment/info").then(res => {

        let equipments = res.data.data.equipments;
        this.equipmentInfo = equipments;

        console.log("equipments")
        console.log(equipments)

        for (let i = 0; i < this.equipmentInfo.length; i++) {
          if (this.equipmentInfo[i].combination == 1) {
            this.equipmentInfo[i].equipments = JSON.parse(this.equipmentInfo[i].equipments)
          }
        }

        for (let i = 0; i < this.test.length; i++) {
          this.test[i].options = equipments.filter(item => {
            return item.className == this.test[i].label;
          })
        }
        this.options = this.test

        console.log("this.options")
        console.log(this.options)
        console.log("this.test")
        console.log(this.test)

      })
    },

    tableRowClassName({row, rowIndex}) {

      if (row.operationType == -1) {
        return 'warning-row';
      } else if (row.operationType == 0) {
        return 'conduct-row';
      }
      return 'success-row';
    },

    operationStatus(row, column) {
      if (row.operationType === 0) {
        return '修改'
      } else if (row.operationType === 1) {
        return '添加'
      } else {
        return '删除'
      }
    },

    operateName(row, column) {
      for (let i = 0; i < this.adminOptions.length; i++) {
        if (row.username == this.adminOptions[i].value) {
          return this.adminOptions[i].label;
          break;
        }
      }
    },


    getUserInfo() {
      this.$axios.get("/tb/userInfo").then(res => {
        this.name = res.data.data.name;
        this.username = res.data.data.username;
      })
    },


    addClass() {
      this.addWarehouseDialogVisible = true;
    },

    addEquipment() {
      this.addStockDialogVisible = true;
    },

    upkeepEquipment() {
      this.upkeepDialogVisible = true;
      this.getUpkeepInfo();
    },

    accomplishUpkeep(index, row) {
      this.$confirm('此操作将结束维修并将该器材归还至对应的仓库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        row.endDate = this.getCurrentTime();

        this.$axios.post("/tb/upkeep/accomplish", row).then(res => {

          this.getUpkeepInfo();
          this.getStockInfo();

          this.$message({
            type: 'success',
            message: '完成维修成功！'
          });

        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });

    },

    getUpkeepInfo() {
      this.$axios.get("/tb/upkeep/info", {
        // 传递的参数
        params: {
          username: this.username,
        }
        // 回调函数,一定要使用箭头函数,不然this的指向不是vue示例
      }).then(res => {

        let upkeepList = res.data.data.upkeepList;

        this.upkeepTableData = [];
        for (let i = 0; i < upkeepList.length; i++) {
          this.$set(this.upkeepTableData, i, {
            warehouse: upkeepList[i].warehouse,
            equipment: upkeepList[i].equipment,
            num: upkeepList[i].num,
            state: upkeepList[i].state,
            reason: upkeepList[i].reason,
            startDate: upkeepList[i].startDate,
            endDate: upkeepList[i].endDate,
            id: upkeepList[i].id,
            username: upkeepList[i].username,
          })
        }

      })

    },

    submitAddWarehouseFromData() {
      this.$refs.addWarehouseFromData.validate((valid) => {
        if (valid) {
          this.addWarehouseFromData.operationDate = this.getCurrentTime();
          this.addWarehouseFromData.operationType = 1;
          this.addWarehouseFromData.username = this.username;
          this.addWarehouseFromData.operationClass = 1;
          this.addWarehouseFromData.details = "添加仓库，名称：" + this.addWarehouseFromData.warehouse + "，地址："
              + this.addWarehouseFromData.address;

          this.$axios.post("/tb/warehouse/add", this.addWarehouseFromData).then(res => {

            this.getWarehouseInfo();
            this.getOperationInfo();
            this.addWarehouseDialogVisible = false;

            this.$message({
              type: 'success',
              message: '修改仓库信息成功！'
            });

          })

        }
      })

    },

    submitaddStockFromData() {
      this.$refs.addStockFromData.validate((valid) => {
        if (valid) {

          let asfd = this.addStockFromData;

          asfd.operationDate = this.getCurrentTime();
          asfd.operationType = 1;
          asfd.username = this.username;
          asfd.operationClass = 1;
          asfd.details = "添加仓库： “" + asfd.warehouse + " ” 器材：“" + asfd.equipment + "” 库存，数量为：" + asfd.stock;

          this.$axios.post("/tb/stock/add", asfd).then(res => {

            this.getStockInfo();
            this.getOperationInfo();
            this.addStockDialogVisible = false;

            this.$message({
              type: 'success',
              message: '添加库存成功！'
            });

          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    addWarehousedialogclose() {

      this.$refs.addWarehouseFromData.resetFields();

    },

    addStockdialogclose() {
      this.$nextTick(function () {
        this.$refs.addStockFromData.resetFields();
      })
    },

    managClassdialogclose() {
      this.warehouseQueryFromData.warehouse = '';
    },

    updateWarehouse() {

      this.modifyWarehouseFromData.operationDate = this.getCurrentTime();
      this.modifyWarehouseFromData.operationType = 0;
      this.modifyWarehouseFromData.username = this.username;
      this.modifyWarehouseFromData.operationClass = 1;
      this.modifyWarehouseFromData.details = "修改仓库信息，";

      if (this.modifyWarehouseFromData.oldName != this.modifyWarehouseFromData.warehouse) {
        this.modifyWarehouseFromData.details += " 将仓库名称由：" + this.modifyWarehouseFromData.oldName + " 修改为："
            + this.modifyWarehouseFromData.warehouse;
      }
      if (this.modifyWarehouseFromData.oldAddress != this.modifyWarehouseFromData.address) {
        this.modifyWarehouseFromData.details += " 将仓库地址由：" + this.modifyWarehouseFromData.oldAddress + " 修改为："
            + this.modifyWarehouseFromData.address;
      }

      this.$axios.post("/tb/warehouse/update", this.modifyWarehouseFromData).then(res => {

        this.getWarehouseInfo();
        this.getOperationInfo();
        this.modifyWarehouseDialogVisible = false

        this.$message({
          type: 'success',
          message: '修改仓库信息成功！'
        });

      })

    },

    modifyWarehouseMessageBox() {

      let mwfd = this.modifyWarehouseFromData;

      if (mwfd.oldName == mwfd.warehouse && mwfd.address == mwfd.oldAddress) {
        this.modifyWarehouseDialogVisible = false;
        return;
      }

      for (let i = 0; i < this.warehouseOptions.length; i++) {
        if (mwfd.warehouse == this.warehouseOptions[i].value) {
          this.$message({
            type: 'warning',
            message: '仓库名称冲突！'
          });
          return;
        }
      }

      this.$confirm('此操作将修改该仓库信息，操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.updateWarehouse();

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    },

    updateStock() {

      let msfd = this.modifyStockFromData;

      msfd.operationDate = this.getCurrentTime();
      msfd.operationType = 0;
      msfd.username = this.username;
      msfd.operationClass = 1;
      msfd.details = "修改 " + msfd.oldwarehouse + "下的" + msfd.equipment + " ";

      if (msfd.warehouse != msfd.oldwarehouse) {
        msfd.details += "将库存仓库由：" + msfd.oldwarehouse + " 修改为："
            + msfd.warehouse;
      }
      if (msfd.totalStock != msfd.oldTotalStock) {
        msfd.details += "将库存数量由：" + msfd.oldTotalStock +
            " 修改为：" + msfd.totalStock;
      }


      this.$axios.post("/tb/stock/update", msfd).then(res => {

        this.getStockInfo();
        this.getWarehouseInfo();
        this.getOperationInfo();
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
        this.modifyStockDialogVisible = false

      })

    },

    deleteStock(row) {
      this.$axios.delete("/tb/stock/delete", {
        // 传递的参数
        data: {
          id: row.id,
          operationDate: this.getCurrentTime(),
          operationType: -1,
          operationClass: 1,
          username: this.username,
          details: "删除了仓库 “" + row.warehouse + " ” 下器材为：“" + row.equipment + "“ 的库存",

        }
      }).then(res => {

        this.$message({
          type: 'success',
          message: '删除成功!'
        });

        this.getStockInfo();
        this.getOperationInfo();

      })
    },

    deleteStockMessageBox(index, row) {

      this.$confirm('此操作将删除 “' + row.warehouse + '“ 仓库下的 ”' + row.equipment
          + '“ 器材的库存，该操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.deleteStock(row);

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });

    },

    modifyStockMessageBox() {

      let msfd = this.modifyStockFromData;

      if (msfd.warehouse == msfd.oldwarehouse &&
          msfd.totalStock == msfd.oldTotalStock) {

        this.modifyStockDialogVisible = false
        return;
      }

      this.$confirm('此操作将修改器材信息，该操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.updateStock();

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    },

    deletewarehouse() {
      this.$axios.delete("/tb/warehouse/delete", {
        // 传递的参数
        data: {
          warehouse: this.deleteWarehouse,
          operationDate: this.getCurrentTime(),
          operationType: -1,
          operationClass: 1,
          username: this.username,
          details: "删除了仓库 “" + this.deleteWarehouse,
        }
      }).then(res => {

        this.$message({
          type: 'success',
          message: '删除成功!'
        });

        this.getWarehouseInfo();
        this.getOperationInfo();

      })

    },

    deleteWarehouseUpdateStock() {

      if (!this.updateStockWarehouseFromData.warehouse) {
        this.$message({
          type: 'warning',
          message: '请选择仓库!'
        });
        return;
      }

      let updateState = false;

      this.updateStockWarehouseFromData.oldWarehouse = this.deleteWarehouse;
      this.updateStockWarehouseFromData.operationDate = this.getCurrentTime();
      this.updateStockWarehouseFromData.operationType = 0;
      this.updateStockWarehouseFromData.username = this.username;
      this.updateStockWarehouseFromData.operationClass = 1;
      this.updateStockWarehouseFromData.details = "因删除仓库，将该仓库下的所有库存仓库由：" + this.deleteWarehouse
          + " 修改为：" + this.updateStockWarehouseFromData.warehouse;

      this.$axios.post("/tb/stock/updateStockWarehouse", this.updateStockWarehouseFromData).then(res => {

        updateState = true;

        if (updateState) {

          this.deletewarehouse();
          this.getStockInfo();
          this.deleteWarehouseDialogVisible = false;

        } else {
          this.$message({
            type: 'warning',
            message: '删除失败!'
          });
        }
      })

    },

    deleteWarehouseMessageBox(index, row) {

      this.$confirm('此操作将删除名称为：“' + row.warehouse +
          '” 的仓库 , 该操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.deleteWarehouse = row.warehouse;

        let stock = this.stockTableData;
        for (let i = 0; i < stock.length; i++) {
          if (this.deleteWarehouse == stock[i].warehouse) {
            this.deleteWarehouseDialogVisible = true;
            return;
          }
        }

        this.deletewarehouse();

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    modifyWarehouse(index, row) {

      this.modifyWarehouseFromData.oldName = row.warehouse;
      this.modifyWarehouseFromData.warehouse = row.warehouse;
      this.modifyWarehouseFromData.oldAddress = row.address;
      this.modifyWarehouseFromData.address = row.address;

      this.modifyWarehouseDialogVisible = true;
    },

    modifyStock(index, row) {

      this.modifyStockFromData.warehouse = row.warehouse;
      this.modifyStockFromData.equipment = row.equipment;
      this.modifyStockFromData.oldwarehouse = row.warehouse;
      this.modifyStockFromData.oldEquipment = row.equipment;
      this.modifyStockFromData.oldTotalStock = row.totalStock;
      this.modifyStockFromData.totalStock = row.totalStock;
      this.modifyStockFromData.id = row.id;

      this.modifyStockDialogVisible = true;
    },

    managClass() {
      this.managClassDialogVisible = true;
      console.log("管理仓库")
    },

    managEquipment() {
      this.managEquipmentDialogVisible = true;
      console.log("管理器材")
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

    submitWarehouseQueryForm() {
      this.$axios.get("/tb/warehouse/search", {
        // 传递的参数
        params: {
          warehouse: this.warehouseQueryFromData.warehouse,
        }
        // 回调函数,一定要使用箭头函数,不然this的指向不是vue示例
      }).then(res => {

        let warehouseList = res.data.data.warehouseList;

        this.WarehouseTableData = [];
        for (let i = 0; i < warehouseList.length; i++) {
          this.$set(this.WarehouseTableData, i, {
            warehouse: warehouseList[i].warehouse,
            address: warehouseList[i].address,
          })
        }

      })
    },

    submitUpkeepQueryForm() {
      this.$axios.get("/tb/upkeep/search", {
        // 传递的参数
        params: {
          warehouse: this.upkeepQueryFromData.warehouse,
          username: this.username,
          state: this.upkeepQueryFromData.state,
        }
        // 回调函数,一定要使用箭头函数,不然this的指向不是vue示例
      }).then(res => {

        let upkeepList = res.data.data.upkeepList;

        this.upkeepTableData = [];
        for (let i = 0; i < upkeepList.length; i++) {
          this.$set(this.upkeepTableData, i, {
            warehouse: upkeepList[i].warehouse,
            equipment: upkeepList[i].equipment,
            num: upkeepList[i].num,
            state: upkeepList[i].state,
            reason: upkeepList[i].reason,
            startDate: upkeepList[i].startDate,
            endDate: upkeepList[i].endDate,
            id: upkeepList[i].id,
            username: upkeepList[i].username,
          })
        }

      })
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

          console.log("=============")
          console.log(this.queryFromData.username)

          this.$axios.get("/tb/operate/search", {
            // 传递的参数
            params: {
              username: this.queryFromData.username,
              operationClass: 1,
              operationType: this.queryFromData.operationType,
              queryStarTime: this.queryFromData.queryStarTime,
              queryEndTime: this.queryFromData.queryEndTime,
              details: this.queryFromData.details,
            }
            // 回调函数,一定要使用箭头函数,不然this的指向不是vue示例
          }).then(res => {

            let operateList = res.data.data.operateList;

            this.tableData = [];
            for (let i = 0; i < operateList.length; i++) {
              this.$set(this.tableData, i, {
                username: operateList[i].username,
                operationType: operateList[i].operationType,
                details: operateList[i].details,
                operationDate: operateList[i].operationDate,
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

    tableRowwarehouseName({row, rowIndex}) {

      if (row.operationStatus == -1) {
        return 'warning-row';
      } else if (row.operationStatus == 0) {
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

    resetWarehouseQueryForm() {
      this.warehouseQueryFromData.warehouse = '';
      this.getWarehouseInfo();
    },

    resetUpkeepQueryForm() {
      this.upkeepQueryFromData.warehouse = '';
      this.upkeepQueryFromData.state = '';
      this.getUpkeepInfo();
    },

    submitStockQueryForm() {

      this.$axios.get("/tb/stock/search", {
        // 传递的参数
        params: {
          warehouse: this.stockQueryFromData.warehouse,
          equipment: this.stockQueryFromData.equipment,
        }
        // 回调函数,一定要使用箭头函数,不然this的指向不是vue示例
      }).then(res => {

        let stockList = res.data.data.stockList;

        this.stockTableData = [];
        for (let i = 0; i < stockList.length; i++) {
          this.$set(this.stockTableData, i, {
            id: stockList[i].id,
            warehouse: stockList[i].warehouse,
            equipment: stockList[i].equipment,
            totalStock: stockList[i].totalStock,
          })
        }
      })
    },

    resetStockQueryForm(formName) {
      this.$refs[formName].resetFields();
      this.getStockInfo();
    },

    resetQueryForm(formName) {
      this.$refs[formName].resetFields();
      this.getOperationInfo();
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
  margin-left: 1%
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