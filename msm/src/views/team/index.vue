<template>
  <div>
    <!-- 条件查询 -->
    <el-form
      :inline="true"
      :model="searchMap"
      ref="searchForm"
      style="margin-top: 20px"
    >
      <el-form-item prop="ranking">
        <el-input
          v-model="searchMap.ranking"
          placeholder="排名"
          v-if="!isDialog"
        ></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="名称"></el-input>
      </el-form-item>
      <el-form-item prop="division" v-if="!isDialog">
        <el-select v-model="searchMap.division" placeholder="赛区">
          <el-option
            v-for="option in divisionOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="entrydate" v-if="!isDialog">
        <el-date-picker
          value-format="yyyy"
          v-model="searchMap.entrydate"
          type="year"
          placeholder="进入NBA"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData" icon="el-icon-search"
          >查询</el-button
        >
        <el-button
          type="primary"
          @click="handleAdd"
          icon="el-icon-edit"
          v-if="!isDialog"
          >新增</el-button
        >
        <el-button
          type="primary"
          @click="resetForm('searchForm')"
          v-if="!isDialog"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 球队列表 -->
    <el-table
      :data="tableData"
      height="580"
      border
      style="width: 100%"
      :highlight-current-row="isDialog"
      @current-change="clickCurrentchange"
    >
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="ranking" label="排名" width="80" v-if="!isDialog">
      </el-table-column>
      <el-table-column prop="name" label="名称" width="280"> </el-table-column>
      <el-table-column
        prop="division"
        label="赛区"
        width="180"
        v-if="!isDialog"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.division | divisionFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="entrydate"
        label="进入NBA"
        width="160"
        v-if="!isDialog"
      >
      </el-table-column>
      <el-table-column prop="officialwebsite" label="官网" width="240">
        <template slot-scope="scope">
          <a :href="scope.row.officialwebsite" target="_blank">{{
            scope.row.officialwebsite
          }}</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" v-if="!isDialog">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row._id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="this.currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="this.pageSize"
      :layout="
        isDialog
          ? 'prev, pager, next'
          : 'total, sizes, prev, pager, next, jumper'
      "
      :total="this.total"
    >
    </el-pagination>
    <!-- 新增球队弹窗 -->
    <el-dialog
      title="球队信息编辑"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-form
        :model="team"
        ref="teamForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
        :rules="rules"
      >
        <el-form-item label="排名" prop="ranking">
          <el-input v-model="team.ranking" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="team.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分区" prop="division">
          <el-select v-model="team.division" placeholder="请选择分区">
            <el-option
              v-for="option in divisionOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="entrydate" label="进入NBA">
          <el-date-picker
            value-format="yyyy"
            v-model="team.entrydate"
            type="year"
            placeholder="进入NBA"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="官网" prop="officialwebsite">
          <el-input
            v-model="team.officialwebsite"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            team._id === null ? addData('teamForm') : updateData('teamForm')
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import teamApi from "@/api/team.js";
const divisionOptions = [
  { type: "1", name: "西南赛区" },
  { type: "2", name: "太平洋赛区" },
  { type: "3", name: "西北赛区" },
  { type: "4", name: "大西洋赛区" },
  { type: "5", name: "东南赛区" },
  { type: "6", name: "中部赛区" },
];
export default {
  data() {
    return {
      rules: {
        ranking: [
          { required: true, message: "请输入球队排名", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入球队名称", trigger: "blur" }],
      },
      dialogFormVisible: false,
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      searchMap: {
        ranking: "",
        name: "",
        division: "",
        entrydate: "",
      },
      divisionOptions,
      team: {
        _id: null,
        ranking: "",
        name: "",
        division: "",
        entrydate: "",
        officialwebsite: "",
      },
    };
  },
  props: {
    isDialog: Boolean,
  },
  components: {},
  created() {
    this.fetchData();
  },
  methods: {
    clickCurrentchange(currentRow){
      this.$emit("option-team",currentRow)
    },
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          teamApi.update(this.team).then((res) => {
            const resp = res.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: resp.messgae,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    addData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          teamApi.add(this.team).then((res) => {
            var resp = res.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
              this.$message({
                message: "添加成功",
                type: "success",
              });
            } else {
              this.$message({
                message: resq.message,
                type: "warning",
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleAdd() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["teamForm"].resetFields();
      });
    },
    handleEdit(id) {
      // console.log("edit", id);
      this.handleAdd();
      teamApi.getById(id).then((res) => {
        const resp = res.data;
        if (resp.flag) {
          this.team = resp.data;
        }
      });
    },
    handleDelete(id) {
      // console.log("delete", id);
      this.$confirm("确认删除这条记录吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          teamApi.deleteById(id).then((res) => {
            const resp = res.data;
            this.$message({
              type: resp.flag ? "success" : "error",
              message: resp.message,
            });
            if (resp.flag) {
              this.fetchData();
            }
          });
        })
        .catch(() => {});
    },
    searchData() {
      this.currentPage = 1;
      this.fetchData();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pageSize = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.fetchData();
    },
    fetchData() {
      teamApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then((res) => {
          const resp = res.data;
          this.tableData = resp.data.rows;
          this.total = resp.data.total;
        });
    },
  },
  filters: {
    divisionFilter(type) {
      const obj = divisionOptions.find((obj) => obj.type === type);
      return obj ? obj.name : null;
    },
  },
};
</script>

<style scoped>
</style>