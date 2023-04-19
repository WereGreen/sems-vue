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
                    filterable
                    style="width: 170px"
                    placeholder="请选择分类">
                  <el-option
                      v-for="item in classNameOptions"
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
            </div>


            <div style="display: flex;align-items: center;justify-content: center">
              <el-form-item>
                <el-button type="primary" @click="submitEquipmentQueryForm">查询</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="resetEquipmentQueryForm('equipmentQueryFromData')">重置</el-button>
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
                prop="equipment"
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

        <el-dialog title="修改器材"
                   :visible.sync="modifyEquipmentDialogVisible"
                   @close="modifyEquipmentDialogclose()"
                   width="40%"
                   center>

          <el-form :model="modifyEquipmentFromData" ref="modifyEquipmentFromData" :rules="modifyEquipmentRules">

            <el-form-item label="分类名称" :label-width="formLabelWidth" prop="className">
              <el-select
                  v-model="modifyEquipmentFromData.className"
                  clearable
                  filterable
                  placeholder="请选择分类">
                <el-option
                    v-for="item in classNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="器材名称" :label-width="formLabelWidth" prop="equipment">
              <el-input
                  placeholder="请输入修改后的器材名称"
                  style="width: 221px"
                  v-model="modifyEquipmentFromData.equipment"
                  @input="(val) => changeInputEvent(val, modifyEquipmentFromData)"
                  clearable>
              </el-input>
            </el-form-item>

            <el-form-item label="由现有器材组成" :label-width="formLabelWidth">
              <el-switch
                  v-model="modifyEquipmentFromData.state"
                  active-color="#409eff">
              </el-switch>
            </el-form-item>

            <div class="equipmentInformation" v-if="modifyEquipmentFromData.state">
              <el-form :label-width="formLabelWidth"
                       v-for="(equipment, index) in modifyEquipmentFromData.equipments"
                       :prop="'equipment.' + index + '.value'"
                       :key="equipment.key"
                       :model="equipment"
                       ref="equipment"
              >

                <div style="display: flex">

                  <el-form-item label="器材名称" prop="value">
                    <el-select v-model="equipment.equipment"
                               :key="equipment.key"
                               style="width: 150px"
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
                             @click.prevent="addEquipments(equipment)" :disabled="addFlag"></el-button>
                  <el-button class="btn" type="danger" icon="el-icon-delete" circle style="margin-left: 5px"
                             @click.prevent="removeEquipments(equipment)" :disabled="removeFlag"></el-button>

                </div>

              </el-form>

            </div>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="modifyEquipmentDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="modifyEquipmentMessageBox('modifyEquipmentFromData')">确 定</el-button>
          </div>

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
                  filterable
                  placeholder="请选择分类">
                <el-option
                    v-for="item in classNameOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="器材名称" :label-width="formLabelWidth" prop="equipment">
              <el-input
                  placeholder="请输入器材名称"
                  style="width: 221px"
                  v-model="addEquipmentFromData.equipment"
                  clearable>
              </el-input>
            </el-form-item>

            <el-form-item label="由现有器材组成" :label-width="formLabelWidth">
              <el-switch
                  v-model="addEquipmentFromData.state"
                  active-color="#409eff">
              </el-switch>
            </el-form-item>

            <div class="equipmentInformation" v-if="addEquipmentFromData.state">
              <el-form :label-width="formLabelWidth"
                       v-for="(equipment, index) in addEquipmentFromData.equipments"
                       :prop="'equipment.' + index + '.value'"
                       :key="equipment.key"
                       :model="equipment"
                       ref="equipment"
              >

                <div style="display: flex">

                  <el-form-item label="器材名称" prop="equipmentValue">
                    <el-select v-model="equipment.equipment"
                               :key="equipment.key"
                               style="width: 150px"
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
                            :disabled="optionAddStatus(item.equipment)"
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
                             @click.prevent="addNewEquipments(equipment)" :disabled="addFlag"></el-button>
                  <el-button class="btn" type="danger" icon="el-icon-delete" circle style="margin-left: 5px"
                             @click.prevent="removeNewEquipments(equipment)" :disabled="removeFlag"></el-button>

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
        equipment: '',
        state: false,
        combination: 0,
        equipments: [{
          equipment: '',
          num: 1,
          className: '',
        }],
        operationDate: '',
        details: '',
        operationType: '',
      },

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
        state: false,
        combination: '',
        equipments: [
          {
            equipment: '',
            num: 1,
            className: '',
          },
        ],
      },

      equipmentQueryFromData: {
        equipmentName: '',
        className: '',
      },

      classQueryFromData: {
        className: '',
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

      currentPage: 1,
      pageSize: 6,

      tableData: [],

      classTableData: [
      ],

      equipmentTableData: [],

      managClassDialogVisible: false,
      managEquipmentDialogVisible: false,
      modifyClassDialogVisible: false,
      modifyEquipmentDialogVisible: false,
      addClassDialogVisible: false,
      addEquipmentDialogVisible: false,
      deleteClassDialogVisible: false,
      formLabelWidth: '120px',

      removeFlag: false,
      addFlag: false,

      rules: {
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
      },

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
        equipment: [
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
        equipment: [
          {required: true, message: '请输入器材名称！', trigger: ['change', 'blur']}
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

      adminOptions: [],
    }

  },
  created() {

    this.getUserInfo();
    this.getClassInfo();
    this.getEquipmentInfo();
    this.getAdminInfo();
    this.getOperationInfo();

  },

  methods: {

    getOperationInfo() {
      this.$axios.get("/tb/operate/info", {
        // 传递的参数
        params: {
          operationClass: 0,
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

    modifyEquipmentDialogclose() {
      this.modifyEquipmentFromData.state = false;
      this.modifyEquipmentDialogVisible = false;
      this.modifyEquipmentFromData.equipments = [
        {
          equipment: '',
          num: 1,
          className: '',
        },
      ];

    },

    changeInputEvent(val, item) {
      item.equipment = val;
      this.$forceUpdate()
    },

    optionStatus(equipment) {

      for (let j = 0; j < this.equipmentInfo.length; j++) {
        if (equipment == this.equipmentInfo[j].equipment && this.equipmentInfo[j].combination == 1) {
          return true;
        }
      }

      for (let i = 0; i < this.modifyEquipmentFromData.equipments.length; i++) {

        if (i < 1) {
          if (equipment == this.modifyEquipmentFromData.oldEquipment) {
            return true
          }
          continue;
        }
        if (equipment == this.modifyEquipmentFromData.equipments[i - 1].equipment) {
          return true
        }
      }
      return false
    },

    optionAddStatus(equipment) {

      for (let j = 0; j < this.equipmentInfo.length; j++) {
        if (equipment == this.equipmentInfo[j].equipment && this.equipmentInfo[j].combination == 1) {
          return true;
        }
      }

      for (let i = 0; i < this.addEquipmentFromData.equipments.length; i++) {

        if (i < 1) {
          if (equipment == this.addEquipmentFromData.oldEquipment) {
            return true
          }
          continue;
        }
        if (equipment == this.addEquipmentFromData.equipments[i - 1].equipment) {
          return true
        }
      }
      return false
    },

    getEquipmentInfo() {
      this.$axios.get("/tb/equipment/info").then(res => {

        let equipments = res.data.data.equipments;
        this.equipmentInfo = equipments;

        this.countEquipment = this.equipmentInfo.length;

        console.log("equipments")
        console.log(equipments)

        for (let i = 0; i < equipments.length; i++) {
          this.$set(this.equipmentTableData, i, {
            className: equipments[i].className,
            equipment: equipments[i].equipment,
            combination: equipments[i].combination,
            equipments: equipments[i].equipments,
          })
        }

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

    operationStatus(row, column) {
      if (row.operationType === 0) {
        return '修改'
      } else if (row.operationType === 1) {
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

    removeEquipments(item) {
      if (this.modifyEquipmentFromData.equipments.length > 1) {
        // 表示先获取这个元素的下标，然后从这个下标开始计算，删除长度为1的元素
        console.log("item")
        console.log(item)
        this.modifyEquipmentFromData.equipments.splice(this.modifyEquipmentFromData.equipments.indexOf(item), 1);
      }
      this.flags()
      this.addFlag = false
    },

    removeNewEquipments(item) {
      if (this.addEquipmentFromData.equipments.length > 1) {
        // 表示先获取这个元素的下标，然后从这个下标开始计算，删除长度为1的元素
        console.log("item")
        console.log(item)
        this.addEquipmentFromData.equipments.splice(this.addEquipmentFromData.equipments.indexOf(item), 1);
      }
      this.addFlags()
      this.addFlag = false
    },

    addEquipments() {
      let len = this.modifyEquipmentFromData.equipments.length
      if (len < 10) {
        this.$set(this.modifyEquipmentFromData.equipments, len, {
          num: 1,
          equipment: ''
        })
        this.flags()
      }
      if ((len + 1) == 10) {
        this.addFlag = true
      }
    },

    addNewEquipments() {
      let len = this.addEquipmentFromData.equipments.length
      if (len < 10) {
        this.$set(this.addEquipmentFromData.equipments, len, {
          num: 1,
          equipment: ''
        })
        this.addFlags()
      }
      if ((len + 1) == 10) {
        this.addFlag = true
      }
    },

    addFlags() {
      if (this.addEquipmentFromData.equipments.length < 2) {
        this.removeFlag = true
      } else {
        //先赋值为true再赋为false, 不然会没反应
        this.removeFlag = true
        this.removeFlag = false
      }
    },

    // 判断数组长度
    flags() {
      if (this.modifyEquipmentFromData.equipments.length < 2) {
        this.removeFlag = true
      } else {
        //先赋值为true再赋为false, 不然会没反应
        this.removeFlag = true
        this.removeFlag = false
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

          this.addClassFromData.operationDate = this.getCurrentTime();
          this.addClassFromData.operationType = 1;
          this.addClassFromData.operationClass = 0;
          this.addClassFromData.username = this.username;
          this.addClassFromData.details = "添加分类：" + this.addClassFromData.className;

          this.$axios.post("/tb/classification/addClass", this.addClassFromData).then(res => {

            this.getClassInfo();
            this.getOperationInfo();
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

          for (let i = 0; i < this.equipmentInfo.length; i++) {
            if (this.addEquipmentFromData.equipment == this.equipmentInfo[i].equipment) {
              this.$message.error('新增器材名称与已有器材冲突！请更改后重试！');
              return false
            }
          }

          if (this.addEquipmentFromData.state) {

            this.addEquipmentFromData.combination = 1;
            for (let i = 0; i < this.addEquipmentFromData.equipments.length; i++) {
              let equipmentValue = this.addEquipmentFromData.equipments[i].equipment
              if (!equipmentValue) {
                this.$message.error('请将信息填完整后重试！');
                return false
              }
            }
            for (let i = 0; i < this.addEquipmentFromData.equipments.length; i++) {

              this.addEquipmentFromData.equipments[i].num += "";

              for (let j = 0; j < this.equipmentInfo.length; j++) {
                if (this.addEquipmentFromData.equipments[i].equipment == this.equipmentInfo[j].equipment) {
                  console.log("找到了！")
                  console.log(this.equipmentInfo[j].className)
                  this.addEquipmentFromData.equipments[i].className = this.equipmentInfo[j].className;
                }
              }
            }
            this.addEquipmentFromData.newEquipments = JSON.stringify(this.addEquipmentFromData.equipments);
            this.addEquipmentFromData.equipments = "";
          } else {
            this.addEquipmentFromData.equipments = "";
          }

          this.addEquipmentFromData.operationDate = this.getCurrentTime();
          this.addEquipmentFromData.operationType = 1;
          this.addEquipmentFromData.operationClass = 0;
          this.addEquipmentFromData.username = this.username;
          this.addEquipmentFromData.details = "添加器材：" + this.addEquipmentFromData.equipment;

          this.$axios.post("/tb/equipment/addEquipment", this.addEquipmentFromData).then(res => {
            this.$message({
              type: 'success',
              message: '添加器材成功!'
            });
            this.getEquipmentInfo();
            this.getOperationInfo();
            this.addEquipmentDialogVisible = false

          })

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

      this.addEquipmentFromData.equipments = [{
        equipment: '',
        num: 1,
        className: '',
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

          this.modifyClassFromData.operationDate = this.getCurrentTime();
          this.modifyClassFromData.operationType = 0;
          this.modifyClassFromData.operationClass = 0;
          this.modifyClassFromData.username = this.username;
          this.modifyClassFromData.details = '将分类名称由：“' + this.modifyClassFromData.oldName +
              '” 修改为： “' + this.modifyClassFromData.className;

          this.$axios.post("/tb/classification/revise", this.modifyClassFromData).then(res => {

            this.getClassInfo();
            this.getOperationInfo();
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

    operateName(row, column) {
      for (let i = 0; i < this.adminOptions.length; i++) {
        if (row.username == this.adminOptions[i].value) {
          return this.adminOptions[i].label;
          break;
        }
      }
    },

    modifyEquipmentMessageBox(formName) {

      this.$refs.modifyEquipmentFromData.validate((valid) => {
            if (valid) {
              let oldModifyEquipmentFromData = JSON.parse(JSON.stringify(this.modifyEquipmentFromData));
              let mefd = this.modifyEquipmentFromData;


              mefd.oldCombination = this.modifyEquipmentFromData.combination;

              if (mefd.state) {

                mefd.combination = 1;
                for (let i = 0; i < mefd.equipments.length; i++) {
                  if (mefd.equipments[i].equipment == "") {
                    this.$message({
                      type: 'warning',
                      message: '请完善信息后重试！'
                    });
                    return;
                  }
                }

                for (let i = 0; i < mefd.equipments.length; i++) {
                  for (let j = 0; j < this.equipmentInfo.length; j++) {
                    if (mefd.equipments[i].equipment == this.equipmentInfo[j].equipment) {
                      mefd.equipments[i].className = this.equipmentInfo[j].className;
                    }
                  }
                }

              } else {
                mefd.equipments = [];
                mefd.combination = 0;
              }

              let equationState = false;

              if (mefd.equipment == mefd.oldEquipment &&
                  mefd.className == mefd.oldClassName &&
                  mefd.combination == mefd.oldCombination) {
                if (mefd.combination == 1) {

                  if (mefd.equipments.length == mefd.oldEquipments.length) {
                    for (let i = 0; i < mefd.equipments.length; i++) {
                      if (mefd.equipments[i].equipment != mefd.oldEquipments[i].equipment ||
                          mefd.equipments[i].num != mefd.oldEquipments[i].num) {

                        equationState = true;
                      }
                    }
                  } else {
                    equationState = true;
                  }
                }

              } else {

                let equipments = null;

                for (let i = 0; i < this.equipmentInfo.length; i++) {
                  if (this.equipmentInfo[i].combination == 1) {
                    equipments = this.equipmentInfo[i].equipments;
                    for (let j = 0; j < equipments.length; j++) {
                      if (mefd.oldEquipment == equipments[j].equipment) {
                        this.$message({
                          type: 'warning',
                          message: '该器材被其他器材作为组成器材！不可更改！'
                        });
                        return;
                      }
                    }
                  }
                }
                equationState = true;
              }

              if (equationState) {
                console.log("有变动")

                for (let i = 0; i < mefd.equipments.length; i++) {
                  mefd.equipments[i].num += ""
                }

                mefd.oldName = mefd.oldEquipment;

                mefd.operationDate = this.getCurrentTime();
                mefd.operationType = 0;
                mefd.username = this.username;
                mefd.operationClass = 0;
                mefd.details = "";

                if (mefd.equipment != mefd.oldEquipment) {
                  mefd.details += " 将器材名称由： " + mefd.oldEquipment + " 修改为： " + mefd.equipment;
                }
                if (mefd.className != mefd.oldClassName) {
                  mefd.details += " 将器材分类由： " + mefd.oldClassName + " 修改为： " + mefd.className;
                }
                if (mefd.combination != mefd.oldCombination) {
                  if (mefd.combination == 0) {
                    mefd.details += " 将器材由组合器材修改为非组合器材";
                  } else {
                    mefd.details += " 将器材由非组合器材修改为组合器材 ";

                    for (let i = 0; i < mefd.equipments.length; i++) {
                      mefd.details += (i + 1) + ".器材名称：" + mefd.equipments[i].equipment + ", 数量： " + mefd.equipments[i].num + " ";
                    }

                  }
                }

                if (mefd.combination == mefd.oldCombination && mefd.combination == 1) {

                  let state = false;

                  console.log("==============")
                  console.log(mefd.oldEquipments.length)
                  console.log(mefd.oldEquipments)

                  if (mefd.equipments.length == mefd.oldEquipments.length) {
                    for (let i = 0; i < mefd.equipments.length; i++) {
                      if (mefd.equipments[i].equipment != mefd.oldEquipments[i].equipment
                          || mefd.equipments[i].num != mefd.oldEquipments[i].num) {
                        state = true;
                      }
                    }
                  } else {
                    state = true;
                  }

                  if (state) {
                    mefd.details += "器材组合修改为："
                    for (let i = 0; i < mefd.equipments.length; i++) {
                      mefd.details += (i + 1) + ".器材名称：" + mefd.equipments[i].equipment + ", 数量： " + mefd.equipments[i].num + " ";
                    }
                  }

                }

                mefd.newEquipments = JSON.stringify(mefd.equipments);
                mefd.equipments = '';

                this.$axios.post("/tb/equipment/updateEquipment", mefd).then(res => {

                  this.$message({
                    type: 'success',
                    message: '修改器材成功!'
                  });

                  this.getEquipmentInfo();
                  this.getOperationInfo();
                  this.modifyEquipmentDialogVisible = false;

                })

              } else {
                this.modifyEquipmentDialogVisible = false;
              }

            } else {
              console.log('error submit!!');
              return false;
            }
          }
      )
    },

    delectClass() {

      this.$axios.delete("/tb/classification/delete", {
        // 传递的参数
        data: {
          className: this.deleteClassName,
          operationDate: this.getCurrentTime(),
          operationType: -1,
          operationClass: 0,
          username: this.username,
          details: "删除了分类：" + this.deleteClassName,

        }
      }).then(res => {

        this.$message({
          type: 'success',
          message: '删除成功!'
        });

        this.getClassInfo();
        this.getOperationInfo();

      })

    },

    deleteClassUpdateName(formName) {
      this.$refs.updateEquipmentClassFromData.validate((valid) => {
        if (valid) {

          let updateState = false;

          this.updateEquipmentClassFromData.operationDate = this.getCurrentTime();
          this.updateEquipmentClassFromData.operationType = 0;
          this.updateEquipmentClassFromData.username = this.username;
          this.updateEquipmentClassFromData.operationClass = 0;
          this.updateEquipmentClassFromData.details = "因删除分类，将该分类下的所有器材分类由：" + this.updateEquipmentClassFromData.oldName
              + " 修改为：" + this.updateEquipmentClassFromData.className;

          this.$axios.post("/tb/equipment/update", this.updateEquipmentClassFromData).then(res => {

            updateState = true;

            console.log("updateState")
            console.log(updateState)

            if (updateState) {
              this.delectClass();
              this.getEquipmentInfo();
              this.getOperationInfo();
              this.deleteClassDialogVisible = false;
            } else {
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
    }
    ,

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

    deleteEquipment(deleteEquipment) {

      let state = true;
      let count = 0;
      let equipments = null;

      for (let i = 0; i < this.equipmentInfo.length; i++) {
        console.log("equipmentInfo.length：" + this.equipmentInfo.length)
        if (this.equipmentInfo[i].combination == 1) {

          equipments = this.equipmentInfo[i].equipments;

          for (let j = 0; j < equipments.length; j++) {

            if (deleteEquipment == equipments[j].equipment) {
              this.$message({
                type: 'warning',
                message: '该器材被其他器材作为组成器材！请先解除组成后再删除！'
              });
              state = false;
              break;
            }
          }
        }
      }

      if (state) {
        console.log("state")
        this.$axios.delete("/tb/equipment/delete", {
          // 传递的参数
          data: {
            equipment: deleteEquipment,
            operationDate: this.getCurrentTime(),
            operationType: -1,
            operationClass: 0,
            username: this.username,
            details: "删除了器材：" + deleteEquipment,
          }
        }).then(res => {

          this.$message({
            type: 'success',
            message: '删除器材成功!'
          });

          this.getEquipmentInfo();
          this.getOperationInfo();
        })
      }

    }
    ,

    deleteEquipmentMessageBox(index, row) {
      this.$confirm('此操作将删除“' + row.className +
          '”分类下，名称为："' + row.equipment + '"的器材， 该操作不可撤回，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        console.log("确定删除")
        this.deleteEquipment(row.equipment);


      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
    ,

    modifyClass(index, row) {

      this.modifyClassFromData.oldName = row.className;
      this.modifyClassFromData.className = row.className;

      this.modifyClassDialogVisible = true;
    }
    ,

    modifyEquipment(index, row) {

      console.log("row")
      console.log(row)

      this.modifyEquipmentFromData.className = row.className;
      this.modifyEquipmentFromData.equipment = row.equipment;
      this.modifyEquipmentFromData.oldClassName = row.className;
      this.modifyEquipmentFromData.oldEquipment = row.equipment;
      this.modifyEquipmentFromData.combination = row.combination;
      if (row.combination == 1) {
        this.modifyEquipmentFromData.state = true;
        this.modifyEquipmentFromData.equipments = JSON.parse(row.equipments);
        this.modifyEquipmentFromData.oldEquipments = JSON.parse(row.equipments);
      }

      this.flags();
      this.modifyEquipmentDialogVisible = true;
    }
    ,

    managClass() {
      this.managClassDialogVisible = true;
      console.log("管理分类")
    }
    ,

    managEquipment() {
      this.managEquipmentDialogVisible = true;
      console.log("管理器材")
    }
    ,

    addApplyDialogclose() {
      this.$nextTick(function () {
        this.$refs.applyFromData.resetFields();
      })
    }
    ,


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
    }
    ,

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
              operationClass: 0,
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
    }
    ,

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

      if (row.operationType == -1) {
        return 'warning-row';
      } else if (row.operationType == 0) {
        return 'conduct-row';
      }
      return 'success-row';
    },

//比较两个日期大小。格式：2018-8-12 12:30
    compareDate(d1, d2) {
      let date1 = new Date(Date.parse(d1))
      let date2 = new Date(Date.parse(d2))
      return date1 > date2
    }
    ,

    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      console.log(`每页 ${val} 条`);
    }
    ,

    handleCurrentChange(val) {
      this.currentPage = val
      console.log(`当前页: ${val}`);
    }
    ,

    rowStyle({row, column, rowIndex, columnIndex}) {

      return "text-align:center";
    }
    ,

    getEquipmentTableData() {
      this.$axios.get("/tb/equipment/search", {
        // 传递的参数
        params: {
          className: this.equipmentQueryFromData.className,
          equipment: this.equipmentQueryFromData.equipmentName,
        }
        // 回调函数,一定要使用箭头函数,不然this的指向不是vue示例
      }).then(res => {

        let equipments = res.data.data.equipments;

        this.equipmentTableData = [];
        for (let i = 0; i < equipments.length; i++) {
          this.$set(this.equipmentTableData, i, {
            className: equipments[i].className,
            equipment: equipments[i].equipment,
            combination: equipments[i].combination,
            equipments: equipments[i].equipments,
          })
        }
      })
    }
    ,

    submitEquipmentQueryForm() {
      this.getEquipmentTableData();
    }
    ,

    resetEquipmentQueryForm(formName) {
      this.$refs[formName].resetFields();
      this.getEquipmentTableData();
    }
    ,

    resetQueryForm(formName) {
      this.$refs[formName].resetFields();
      this.getOperationInfo();
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