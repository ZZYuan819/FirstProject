<template>
  <div>
    <!--条件查询  -->
    <el-form
      :inline="true"
      :model="searchMap"
      class="demo-form-inline"
      ref="searchForm"
      style="margin-top: 20px"
    >
      <el-form-item prop="number">
        <el-input v-model="searchMap.number" placeholder="号码"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input v-model="searchMap.name" placeholder="姓名"></el-input>
      </el-form-item>
      <el-form-item prop="team">
        <el-input
          v-model="searchMap.team"
          placeholder="球队"
          @click.native="dialogTeamVisible = true"
        ></el-input>
      </el-form-item>
      <el-form-item prop="division">
        <el-select v-model="searchMap.division" placeholder="赛区">
          <el-option
            v-for="option in divisionOptions"
            :key="option.type"
            :label="option.name"
            :value="option.type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchData" icon="el-icon-search"
          >查询</el-button
        >
        <el-button type="primary" icon="el-icon-edit" @click="handelADD"
          >新增</el-button
        >
        <el-button type="primary" @click="resetForm('searchForm')"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <!--球员列表  -->
    <el-table :data="tableData" height="580" border style="width: 100%">
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="number" label="号码" width="80"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="height" label="身高" width="80"> </el-table-column>
      <el-table-column prop="weight" label="体重" width="80"> </el-table-column>
      <el-table-column prop="birthday" label="生日" width="180">
      </el-table-column>
      <el-table-column prop="team" label="球队" width="280"> </el-table-column>
      <el-table-column prop="division" label="赛区" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.division | divisionFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salary" label="薪资" width="180">
      </el-table-column>
      <el-table-column label="操作">
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
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 教师列表弹窗 -->
    <el-dialog title="选择球队" :visible.sync="dialogTeamVisible" width="33.7%">
      <team :isDialog="true" @option-team="optionTeam" />
    </el-dialog>
    <!-- 球员新增 编辑弹窗 -->
    <el-dialog
      title="请编辑球员信息"
      :visible.sync="dialogFormVisible"
      width="500px"
    >
      <el-form
        :model="teamPojo"
        :rules="rules"
        ref="teamPojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px"
      >
        <el-form-item label="号码" prop="number">
          <el-input v-model="teamPojo.number"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="teamPojo.name"></el-input>
        </el-form-item>
        <el-form-item label="身高" prop="height">
          <el-input v-model="teamPojo.height"></el-input>
        </el-form-item>
        <el-form-item label="体重" prop="weight">
          <el-input v-model="teamPojo.weight"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="teamPojo.birthday"
            type="date"
            placeholder="生日"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="球队" prop="team">
          <el-input
            readonly
            @click.native="dialogOptionTeam"
            v-model="teamPojo.team"
          ></el-input>
        </el-form-item>
        <el-form-item label="分区" prop="division">
          <el-select v-model="teamPojo.division" placeholder="请选择分区">
            <el-option
              v-for="option in divisionOptions"
              :key="option.type"
              :label="option.name"
              :value="option.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="薪资" prop="salary">
          <el-input v-model="teamPojo.salary" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="
              teamPojo._id === null
                ? addData('teamPojoForm')
                : updateData('teamPojoForm')
            "
            >提交</el-button
          >
          <el-button type="primary" @click="dialogFormVisible = false"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import playerApi from "@/api/player.js";
import Team from "@/views/team";
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
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchMap: {
        number: "",
        name: "",
        team: "",
        division: "",
      },
      divisionOptions,
      dialogTeamVisible: false,
      dialogFormVisible: false,
      isEdit: false,
      teamPojo: {
        _id: null,
        number: "",
        name: "",
        height: "",
        weight: "",
        birthday: "",
        team: "",
        division: "",
        salary: "",
      },
      rules: {
        number: [{ required: true, message: "号码不能为空", trigger: "blur" }],
        name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        salary: [{ required: true, message: "薪资不能为空", trigger: "blur" }],
      },
    };
  },

  components: {
    Team,
  },
  created() {
    this.fetchData();
  },

  methods: {
    updateData(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          playerApi.update(this.teamPojo).then((res) => {
            if (res.data.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                messgae: res.data.message,
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
          playerApi.add(this.teamPojo).then((res) => {
            const resp = res.data;
            if (resp.flag) {
              this.fetchData();
              this.dialogFormVisible = false;
            } else {
              this.$message({
                message: reap.message,
                type: "warning",
              });
            }
          });
        } else {
          return false;
        }
      });
    },
    dialogOptionTeam() {
      this.isEdit = true;
      this.dialogTeamVisible = true;
    },
    handelADD() {
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["teamPojoForm"].resetFields();
      });
    },
    optionTeam(currentRow) {
      if (this.isEdit) {
        this.teamPojo.team = currentRow.name;
      } else {
        this.searchMap.team = currentRow.name;
      }
      this.dialogTeamVisible = false;
    },
    handleEdit(id) {
      // console.log(index, row);
      this.handelADD();
      playerApi.getById(id).then((res) => {
        if (res.data.flag) {
          this.teamPojo = res.data.data;
        }
      });
    },
    handleDelete(id) {
      // console.log(id); 
      this.$confirm("此操作将永久删除该球员信息, 是否继续?", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          playerApi.deleteById(id).then((res) => {
            this.$message({
              type:res.data.flag? "success":"warning",
              message: res.data.message,
            });
            if(res.data.flag){
              this.fetchData();
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    searchData() {
      this.currentPage = 1;
      this.fetchData();
    },
    fetchData() {
      playerApi
        .search(this.currentPage, this.pageSize, this.searchMap)
        .then((res) => {
          this.tableData = res.data.data.rows;
          this.total = res.data.data.total;
        });
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