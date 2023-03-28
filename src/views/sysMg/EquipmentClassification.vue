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
                  :picker-options="queryFromData.queryPickerOptions">
              </el-date-picker>

            </el-form-item>

            <el-form-item label="操作类型" prop="operationType">
              <el-select
                  v-model="queryFromData.operationType"
                  clearable
                  placeholder="请选择操作">
                <el-option
                    v-for="item in queryFromData.operationTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>


          <div style="display: flex;align-items: center;justify-content: center;">

            <el-form-item label="操作人员" prop="operationName">
              <el-select
                  v-model="queryFromData.operationName"
                  clearable
                  style="width: 205px"
                  placeholder="请选择操作人"
              >
                <el-option
                    v-for="item in queryFromData.operationNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="具体操作" prop="specificOperation">
              <el-input
                  v-model="queryFromData.specificOperation"
                  placeholder="请输入具体操作"
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
                prop="applicationDate"
                label="操作时间"
                sortable
                align="center">
            </el-table-column>

            <el-table-column
                prop="name"
                label="操作人员"
                align="center">
            </el-table-column>

            <el-table-column
                prop="operationStatus"
                label="操作类型"
                :formatter="operationStatus"
                align="center">
            </el-table-column>

            <el-table-column
                prop="reason"
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
              :page-sizes="[6, 12, 18, 24]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
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
              现共有分类
            </div>
            <div style="color: #409EFF;font-size: 80px;
            text-align: center;line-height: 120px;width: 165px;margin-left: -20px">
              {{ countClass }}
            </div>
            <div style="font-size: 18px;color: #909399;float: right">
              种
            </div>
          </el-card>
        </div>


        <div>
          <el-card shadow="always" class="dataCard">
            <div style="font-size: 18px;color: #606266">
              现共有器材
            </div>
            <div style="color: #67C23A;font-size: 80px;
            text-align: center;line-height: 120px;width: 165px;margin-left: -20px">
              {{ countEquipment }}
            </div>
            <div style="font-size: 18px;color: #909399;float: right">
              种
            </div>
          </el-card>
        </div>

      </div>


      <div style="display: flex; align-items: center; justify-content: center; width: 100%;height: 230px;">

        <div style="margin-right: 20px" @click="managClass">
          <el-card shadow="hover" class="dataCard">

            <div style="font-size: 65px;text-align: center;line-height: 150px;margin-bottom: -20px; color: #409EFF;">
              <i class="el-icon-guide"></i>
            </div>

            <div style="font-size: 18px;text-align: center;color: #606266;">
              分类管理
            </div>

          </el-card>
        </div>


        <div @click="managEquipment">
          <el-card shadow="hover" class="dataCard">

            <div style="font-size: 65px;text-align: center;line-height: 150px;margin-bottom: -20px; color: #67C23A;">
              <i class="el-icon-basketball"></i>
            </div>

            <div style="font-size: 18px;text-align: center;color: #606266;">
              器材管理
            </div>

          </el-card>
        </div>

      </div>

      <!--   分类管理   -->
      <div>

        <el-dialog
            title="分类管理"
            :visible.sync="managClassDialogVisible"
            width="32%"
            @close="managClassdialogclose()"
            center>


          <el-form :inline="true"
                   :model="classQueryFromData"
                   class="demo-form-inline"
                   style="margin-left: 15px;"
                   size="medium"
                   ref="classQueryFromData">

            <el-form-item label="分类名称" prop="classification">
              <el-input
                  placeholder="请输入内容"
                  maxlength="10"
                  style="width: 170px"
                  show-word-limit
                  v-model="classQueryFromData.className"
                  clearable>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitClassQueryForm('classQueryFromData')">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetQueryForm('classQueryFromData')">重置</el-button>
            </el-form-item>
          </el-form>


          <el-table
              :data="classTableData"
              stripe
              height="250"
              style="width: 100%">
            <el-table-column
                prop="className"
                label="分类名称"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="classOperation"
                label="操作"
                align="center"
            >
              <template slot-scope="scope">

                <el-button type="primary"
                           size="mini"
                           plain round
                           @click="modifyClass(scope.$index, scope.row)">修改
                </el-button>

                <el-button type="danger"
                           size="mini"
                           plain round
                           @click="deleteClassMessageBox(scope.$index, scope.row)">删除
                </el-button>

              </template>

            </el-table-column>
          </el-table>


          <div style="display: flex;align-items: center;justify-content: center;">
            <el-button type="primary"
                       round
                       @click="addClass()"
                       style="align-items: center; margin-top: 25px;">新增分类
            </el-button>
          </div>


        </el-dialog>

        <!--    修改分类    -->

        <el-dialog
            title="修改分类"
            :visible.sync="modifyClassDialogVisible"
            width="30%"
            center>

          <el-form :inline="true"
                   :model="modifyClassFromData"
                   class="demo-form-inline"
                   size="medium"
                   :rules="modifyClassRules"
                   style="display: flex;align-items: center;justify-content: center;"
                   ref="modifyClassFromData">

            <el-form-item label="分类名称" prop="className">
              <el-input
                  placeholder="请输入修改后的分类名称"
                  v-model="modifyClassFromData.className"
                  clearable>
              </el-input>
            </el-form-item>

          </el-form>


          <span slot="footer" class="dialog-footer">
            <el-button @click="modifyClassDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="modifyClassMessageBox">确 定</el-button>
          </span>

        </el-dialog>


        <!--    新增分类    -->

        <el-dialog
            title="新增分类"
            :visible.sync="addClassDialogVisible"
            width="30%"
            @close="addClassdialogclose()"
            center>

          <el-form :inline="true"
                   :model="addClassFromData"
                   class="demo-form-inline"
                   size="medium"
                   :rules="addClassRules"
                   style="display: flex;align-items: center;justify-content: center;"
                   ref="addClassFromData">

            <el-form-item label="分类名称" prop="className">
              <el-input
                  placeholder="请输入新增的分类名称"
                  v-model="addClassFromData.className"
                  clearable>
              </el-input>
            </el-form-item>

          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="addClassDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAddClassFromData(addClassFromData)">确 定</el-button>
          </span>

        </el-dialog>

        <!--    删除分类    -->

        <el-dialog
            title="请为该分类下器材选择新的分类"
            :visible.sync="deleteClassDialogVisible"
            width="30%"
            center>

          <el-form :inline="true"
                   :model="updateEquipmentClassFromData"
                   class="demo-form-inline"
                   size="medium"
                   :rules="updateClassRules"
                   style="display: flex;align-items: center;justify-content: center;"
                   ref="updateEquipmentClassFromData">

            <el-form-item label="器材分类" prop="className">
              <el-select v-model="updateEquipmentClassFromData.className"
                         filterable
                         style="width: 180px;"
                         clearable
                         placeholder="请选择分类">
                <el-option
                    v-for="item in classNameOptions"
                    :key="item.value"
                    :disabled="item.value == deleteClassName"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

          </el-form>


          <span slot="footer" class="dialog-footer">
            <el-button @click="deleteClassDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="deleteClassUpdateName(updateEquipmentClassFromData)">确 定</el-button>
          </span>

        </el-dialog>


      </div>

      <!--   器材管理   -->
      <div>

        <el-dialog
            title="器材管理"
            :visible.sync="managEquipmentDialogVisible"
            width="40%"
            @close="managClassdialogclose()"
            center>


          <el-form :inline="true"
                   :model="equipmentQueryFromData"
                   class="demo-form-inline"
                   size="medium"
                   ref="equipmentQueryFromData">

            <div style="display: flex;align-items: center;justify-content: center">
              <el-form-item label="分类名称" prop="className">
                <el-select
                    v-model="equipmentQueryFromData.className"
                    clearable
                    style="width: 170px"
                    placeholder="请选择分类">
                  <el-option
                      v-for="item in classQueryFromData.classificationOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="器材名称" prop="equipmentName">
                <el-select
                    v-model="equipmentQueryFromData.equipmentName"
                    clearable
                    style="width: 170px"
                    placeholder="请选择器材">
                  <el-option
                      v-for="item in classQueryFromData.classificationOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>


            <div style="display: flex;align-items: center;justify-content: center">
              <el-form-item>
                <el-button type="primary" @click="">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="resetQueryForm('equipmentQueryFromData')">重置</el-button>
              </el-form-item>
            </div>
          </el-form>


          <el-table
              :data="equipmentTableData"
              stripe
              height="250"
              style="width: 100%">

            <el-table-column
                prop="className"
                label="分类名称"
                align="center"
            >
            </el-table-column>

            <el-table-column
                prop="equipmentName"
                label="器材名称"
                align="center"
            >
            </el-table-column>

            <el-table-column
                prop="classOperation"
                label="操作"
                align="center"
            >
              <template slot-scope="scope">

                <el-button type="primary"
                           size="mini"
                           plain round
                           @click="modifyEquipment(scope.$index, scope.row)">修改
                </el-button>

                <el-button type="danger"
                           size="mini"
                           plain round
                           @click="deleteEquipmentMessageBox(scope.$index, scope.row)">删除
                </el-button>

              </template>

            </el-table-column>
          </el-table>


          <div style="display: flex;align-items: center;justify-content: center;">
            <el-button type="primary"
                       round
                       @click="addEquipment()"
                       style="align-items: center; margin-top: 25px;">新增器材
            </el-button>
          </div>


        </el-dialog>

        <!--    修改器材    -->

        <el-dialog
            title="修改器材"
            :visible.sync="modifyEquipmentDialogVisible"
            width="30%"
            center>

          <el-form :inline="true"
                   :model="modifyEquipmentFromData"
                   class="demo-form-inline"
                   size="medium"
                   :rules="modifyEquipmentRules"
                   ref="modifyEquipmentFromData">


            <div style="display: flex;align-items: center;justify-content: center;">

              <el-form-item label="分类名称" prop="className">
                <el-select
                    v-model="modifyEquipmentFromData.className"
                    clearable
                    placeholder="请选择分类">
                  <el-option
                      v-for="item in classQueryFromData.classificationOptions"
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
                    v-model="modifyEquipmentFromData.equipmentName"
                    clearable>
                </el-input>
              </el-form-item>
            </div>

          </el-form>


          <span slot="footer" class="dialog-footer">
            <el-button @click="modifyEquipmentDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="modifyEquipmentMessageBox">确 定</el-button>
          </span>

        </el-dialog>


        <!--    新增器材    -->
        <el-dialog title="新增器材"
                   :visible.sync="addEquipmentDialogVisible"
                   @close="addEquipmentdialogclose()"
                   width="40%"
                   center>

          <el-form :model="addEquipmentFromData" ref="addEquipmentFromData" :rules="addEquipmentRules">


            <el-form-item label="分类名称" :label-width="formLabelWidth" prop="className">
              <el-select
                  v-model="addEquipmentFromData.className"
                  clearable
                  placeholder="请选择分类">
                <el-option
                    v-for="item in classQueryFromData.classificationOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="器材名称" :label-width="formLabelWidth" prop="equipmentName">
              <el-input
                  placeholder="请输入器材名称"
                  style="width: 221px"
                  v-model="addEquipmentFromData.equipmentName"
                  clearable>
              </el-input>
            </el-form-item>

            <el-form-item label="由现有器材组成" :label-width="formLabelWidth">
              <el-switch
                  v-model="value"
                  active-color="#409eff">
              </el-switch>
            </el-form-item>


            <el-form-item label="初始库存" :label-width="formLabelWidth" prop="stockNum" v-if="!value">
              <el-input-number
                  v-model="addEquipmentFromData.stockNum"
                  size="small"
                  style="width: 100px"
                  controls-position="right"
                  @change="handleChange"
                  :min="1" :max="10">
              </el-input-number>
            </el-form-item>


            <div class="equipmentInformation" v-if="value">
              <el-form :label-width="formLabelWidth"
                       v-for="(equipment, index) in addEquipmentFromData.equipments"
                       :prop="'equipment.' + index + '.value'"
                       :key="equipment.key"
                       :model="equipment"
                       ref="equipment"
              >

                <div style="display: flex">

                  <el-form-item label="器材名称" prop="equipmentValue">
                    <el-select v-model="equipment.value"
                               :key="equipment.key"
                               style="width: 150px"
                               clearable
                               placeholder="请选择器材">
                      <el-option
                          v-for="item in showCityList(equipment.value)"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                      </el-option>
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
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="addEquipmentDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAddEquipmentFromData(addEquipmentFromData)">确 定</el-button>
          </div>
        </el-dialog>


      </div>


    </div>

  </div>

</template>

<script>
export default {
  name: "EquipmentClassification",
  data() {

    return {

      countClass: 0,
      countEquipment: 0,

      addEquipmentFromData: {

        className: '',
        addEquipmentName: '',
        stockNum: 1,

        equipments: [{
          value: '',
          num: 1,

        }],
        equipmentOptions: [{
          value: '乒乓球',
          label: '乒乓球',
        }, {
          value: '羽毛球',
          label: '羽毛球',
        }, {
          value: '篮球',
          label: '篮球',
        }, {
          value: '足球',
          label: '足球',
        }, {
          value: '排球',
          label: '排球',
        }],

        addUseDate: '',
        reason: '',
      },

      value: false,

      addClassFromData: {
        className: '',
      },

      modifyClassFromData: {
        oldName: '',
        className: '',
      },

      updateEquipmentClassFromData: {
        oldName: '',
        className: '',
      },

      modifyEquipmentFromData: {
        oldEquipmentName: '',
        oldClassName: '',
        equipmentName: '',
        className: '',
      },

      equipmentQueryFromData: {
        equipmentName: '',
        className: '',
      },

      classQueryFromData: {
        className: '',
      },

      queryFromData: {

        classification: '',
        classificationOptions: [
          {
            value: '武术',
            label: '武术'
          },
          {
            value: '小球',
            label: '小球'
          },
          {
            value: '大球',
            label: '大球'
          }
        ],

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

        operationType: '',
        operationTypeOptions: [
          {
            value: '新增',
            label: '新增'
          },
          {
            value: '删除',
            label: '删除'
          },
          {
            value: '修改',
            label: '修改'
          },
        ],

        operationName: '',
        operationNameOptions: [
          {
            value: '王小明',
            label: '王小明'
          },
          {
            value: '李二蛋',
            label: '李二蛋'
          },
          {
            value: '赵六哥',
            label: '赵六哥'
          },
        ],

        specificOperation: '',

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
        reason: '现数量不能满足教学需求',
        operationStatus: 0,
      },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          reason: '弥补报废后差异',
          operationStatus: 1,

        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          reason: '现数量不能满足教学需求现数量不能满足教学需求现数量不能满足教学需求现数量不能满足教学需求现数量不能满足教学需求',
          operationStatus: -1,
        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          reason: '现数量不能满足教学需求',
          operationStatus: 1,
        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          reason: '现数量不能满足教学需求',
          operationStatus: 0
        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          reason: '现数量不能满足教学需求',
          operationStatus: 0
        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          reason: '现数量不能满足教学需求',
          operationStatus: -1
        },
        {
          applicationDate: '2023-2-8 08:49',
          name: 'xxx',
          reason: '现数量不能满足教学需求',
          operationStatus: -1
        },],

      classTableData: [
        {
          className: '',
        }
      ],

      equipmentTableData: [
        {
          equipmentName: '乒乓球',
          className: '大球',
        },
        {
          equipmentName: '乒乓球',
          className: '武术',
        },
        {
          equipmentName: '乒乓球',
          className: '田径',
        },
        {
          equipmentName: '乒乓球',
          className: '比赛',
        },
      ],

      managClassDialogVisible: false,
      managEquipmentDialogVisible: false,
      modifyClassDialogVisible: false,
      modifyEquipmentDialogVisible: false,
      addClassDialogVisible: false,
      addEquipmentDialogVisible: false,
      deleteClassDialogVisible: false,
      formLabelWidth: '120px',

      flag: true,
      addFlag: false,

      modifyClassRules: {
        className: [
          {required: true, message: '请输入分类！', trigger: ['change', 'blur']}
        ],
      },

      updateClassRules: {
        className: [
          {required: true, message: '请输入分类！', trigger: ['change', 'blur']}
        ],
      },

      modifyEquipmentRules: {
        className: [
          {required: true, message: '请选择分类名称！', trigger: ['change', 'blur']}
        ],
        equipmentName: [
          {required: true, message: '请输入器材名称！', trigger: ['change', 'blur']}
        ]

      },

      addClassRules: {
        className: [
          {required: true, message: '请输入需要添加的分类名称！', trigger: ['change', 'blur']}
        ]
      },

      addEquipmentRules: {
        className: [
          {required: true, message: '请选择分类名称！', trigger: ['change', 'blur']}
        ],
        equipmentName: [
          {required: true, message: '请输入器材名称！', trigger: ['change', 'blur']}
        ],
        stockNum: [
          {required: true, message: '数量不能为空！', trigger: ['change', 'blur']}
        ],

      },


      userInfo: {},

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

      classNameOptions: [
        {
          label: '',
          value: '',
        },
      ],
      name: '',
      username: '',
      deleteClassName: '',

    }
  },
  created() {

    this.getUserInfo();
    this.getClassInfo();
    this.getEquipmentInfo();

  },

  methods: {

    getEquipmentInfo() {
      this.$axios.get("/tb/equipment/info").then(res => {

        let equipments = res.data.data.equipments;
        this.equipmentInfo = equipments;

        this.countEquipment = this.equipmentInfo.length;

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

      console.log("getClassInfo启动了")
      this.$axios.get("/tb/classification/info").then(res => {

        let classifications = res.data.data.classifications;

        this.countClass = classifications.length;
        this.classTableData = [];
        for (let i = 0; i < classifications.length; i++) {

          this.$set(this.test, i, {
            label: classifications[i].className,
          })

          this.$set(this.classTableData, i, {
            className: classifications[i].className,
          })

          this.$set(this.classNameOptions, i, {
            label: classifications[i].className,
            value: classifications[i].className,
          })

        }

      })
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
      this.$axios.get("/tb/userInfo").then(res => {
        this.name = res.data.data.name;
        this.username = res.data.data.username;
        console.log("username:" + this.username)
        this.queryFromData.name = res.data.data.username;
        console.log(res.data.data)

      })
    },

    removeDomain(item) {
      if (this.addEquipmentFromData.equipments.length > 1) {
        // 表示先获取这个元素的下标，然后从这个下标开始计算，删除长度为1的元素
        console.log("item")
        console.log(item)
        this.addEquipmentFromData.equipments.splice(this.addEquipmentFromData.equipments.indexOf(item), 1);
      }
      this.flags()
      this.addFlag = false
    },

    addDomain() {
      let len = this.addEquipmentFromData.equipments.length
      if (len < this.addEquipmentFromData.equipmentOptions.length) {
        this.$set(this.addEquipmentFromData.equipments, len, {
          num: 1,
          // key: Date.now(),
          value: ''
        })
        this.flags()
      }
      if ((len + 1) == this.addEquipmentFromData.equipmentOptions.length) {

        this.addFlag = true
      }


    },

    // 判断数组长度
    flags() {
      if (this.addEquipmentFromData.equipments.length < 2) {
        this.flag = true
      } else {
        //先赋值为true再赋为false, 不然会没反应
        this.flag = true
        this.flag = false
      }
    },

    addClass() {
      this.addClassDialogVisible = true;
    },

    addEquipment() {
      this.addEquipmentDialogVisible = true;
    },

    submitAddClassFromData(formName) {
      this.$refs.addClassFromData.validate((valid) => {
        if (valid) {

          this.$axios.post("/tb/classification/addClass", this.addClassFromData).then(res => {

            this.getClassInfo();
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.addClassDialogVisible = false
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    submitAddEquipmentFromData(formName) {
      this.$refs.addEquipmentFromData.validate((valid) => {
        if (valid) {

          if (this.value) {
            for (let i = 0; i < this.addEquipmentFromData.equipments.length; i++) {
              let equipmentValue = this.addEquipmentFromData.equipments[i].value
              if (!equipmentValue) {
                this.$message.error('请将信息填完整后重试！');
                return false
              }
            }
          }

          this.addEquipmentDialogVisible = false
          console.log("this.addEquipmentFromData")
          console.log(this.addEquipmentFromData)
          for (let i = 0; i < this.addEquipmentFromData.equipments.length; i++) {
            console.log('器材名称: ' + this.addEquipmentFromData.equipments[i].value
                + '  数量：' + this.addEquipmentFromData.equipments[i].num
            )
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    addClassdialogclose() {

      this.$refs.addClassFromData.resetFields();

    },

    addEquipmentdialogclose() {

      this.$nextTick(function () {
        this.$refs.addEquipmentFromData.resetFields();
      })
      this.value = false;

      this.addEquipmentFromData.equipments = [{
        value: '',
        num: 1,
      }]

    },

    managClassdialogclose() {
      this.classQueryFromData.classification = '';
    },

    modifyClassMessageBox() {

      if (this.modifyClassFromData.oldName != this.modifyClassFromData.className) {
        this.$confirm('此操作将该分类名称由：“' + this.modifyClassFromData.oldName +
            '” 修改为： “' + this.modifyClassFromData.className + '” , 该操作不可撤回，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$axios.post("/tb/classification/revise", this.modifyClassFromData).then(res => {

            this.getClassInfo();
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.modifyClassDialogVisible = false

          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });
        });
      } else {
        this.modifyClassDialogVisible = false;
      }


    },

    modifyEquipmentMessageBox() {
      this.$confirm('此操作将修改器材信息，分类名称由：“' + this.modifyEquipmentFromData.oldClassName +
          '” 修改为：“' + this.modifyEquipmentFromData.className + '”，' +
          '器材名称由："' + this.modifyEquipmentFromData.oldEquipmentName +
          '"修改为："' + this.modifyEquipmentFromData.equipmentName + '"，该操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    },

    delectClass() {

      this.$axios.delete("/tb/classification/delete", {
        // 传递的参数
        data: {
          className: this.deleteClassName,
        }
      }).then(res => {

        this.$message({
          type: 'success',
          message: '删除成功!'
        });

        this.getClassInfo();

      })


    },

    deleteClassUpdateName(formName) {
      this.$refs.updateEquipmentClassFromData.validate((valid) => {
        if (valid) {

          let updateState = false;
          this.$axios.post("/tb/equipment/update", this.updateEquipmentClassFromData).then(res => {

            updateState = true;

            console.log("updateState")
            console.log(updateState)

            if (updateState) {
              this.delectClass();
              this.getEquipmentInfo();
              this.deleteClassDialogVisible = false;
            }else {
              this.$message({
                type: 'warning',
                message: '删除失败!'
              });
            }

          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },


    deleteClassMessageBox(index, row) {
      this.$confirm('此操作将删除名称为：“' + row.className +
          '” 的分类 , 该操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        let equiments = this.equipmentInfo;

        for (let i = 0; i < equiments.length; i++) {
          if (row.className == equiments[i].className) {
            this.updateEquipmentClassFromData.oldName = equiments[i].className;
            this.deleteClassName = equiments[i].className;
            this.deleteClassDialogVisible = true;
            return;
          }
        }

        this.deleteClassName = row.className;
        this.delectClass();

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    deleteEquipmentMessageBox(index, row) {
      this.$confirm('此操作将删除“' + row.className +
          '”分类下，名称为："' + row.equipmentName + '"的器材， 该操作不可撤回，是否继续?', '提示', {
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

    modifyClass(index, row) {

      this.modifyClassFromData.oldName = row.className;
      this.modifyClassFromData.className = row.className;

      this.modifyClassDialogVisible = true;
    },

    modifyEquipment(index, row) {

      this.modifyEquipmentFromData.className = row.className;
      this.modifyEquipmentFromData.equipmentName = row.equipmentName;
      this.modifyEquipmentFromData.oldClassName = row.className;
      this.modifyEquipmentFromData.oldEquipmentName = row.equipmentName;

      this.modifyEquipmentDialogVisible = true;
    },

    managClass() {
      this.managClassDialogVisible = true;
      console.log("管理分类")
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

    submitClassQueryForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios.get("/tb/classification/search", {
            // 传递的参数
            params: {
              className: this.classQueryFromData.className,
            }
            // 回调函数,一定要使用箭头函数,不然this的指向不是vue示例
          }).then(res => {

            let classifications = res.data.data.classifications;
            this.classTableData = []

            console.log("1111111111111")
            console.log(classifications)

            if (classifications) {
              for (let i = 0; i < classifications.length; i++) {
                this.$set(this.classTableData, i, {
                  className: classifications[i].className,
                })
              }
            }
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
              + '\n状态: ' + this.queryFromData.operationStatus
              + '\n审核人员: ' + this.queryFromData.auditor)
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

    resetQueryForm(formName) {
      this.$refs[formName].resetFields();
      this.classQueryFromData.className = '';
      this.$axios.get("/tb/classification/info").then(res => {

        let classifications = res.data.data.classifications;

        this.classTableData = []

        for (let i = 0; i < classifications.length; i++) {
          this.$set(this.classTableData, i, {
            className: classifications[i].className,
          })
        }
      })
    }
  },

  computed: {
    showCityList() {
      return (val) => {
        //讲option的显示数据进行深拷贝
        let newList = JSON.parse(JSON.stringify(this.addEquipmentFromData.equipmentOptions));

        //处理selectList数据，返回一个新数组arr
        //arr数组就相当于所有Select选中的数据集合（没有选中的为''，不影响判断），只要在这个集合里面，其他的下拉框就不应该有这个选项
        const arr = this.addEquipmentFromData.equipments.map(item => {
          //将其格式{value：'NewYork'}变成['NewYork'],方便使用indexOf进行判断
          return (item = item.value);
        });

        //过滤出newList里面需要显示的数据
        newList = newList.filter(item => {
          //当前下拉框的选中的数据需要显示
          //val就是当前下拉框选中的值
          if (val == item.value) {
            return item;
          } else {
            //再判断在arr这个数组中是不是有这个数据，如果不在，说明是需要显示的
            if (arr.indexOf(item.value) == -1) {
              return item;
            }
          }
        });

        //返回Options显示数据
        return newList;
      };
    }
  }
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