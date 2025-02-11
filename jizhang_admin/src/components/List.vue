<template>
  <div class="list">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>记账管理</el-breadcrumb-item>
      <el-breadcrumb-item>列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="searchQuery"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsSearch"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 记账列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column
          align="center"
          label="用户账号"
          prop="tel"
          width="150"
        ></el-table-column>
        <el-table-column
          align="center"
          label="记账标题"
          prop="type"
        ></el-table-column>
        <el-table-column align="center" label="记账金额" prop="price">
          <template slot-scope="scope">
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              ￥{{ scope.row.money }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="时间"
          prop="time"
        ></el-table-column>
        <el-table-column
          align="center"
          label="备注"
          prop="msg"
        ></el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>
<script>
var QQMapWX = require("../utils/qqmap-wx-jssdk.js");
//引入获得地址的js文件
var qqmapsdk;
export default {
  data() {
    return {
      userlist: [],
      searchQuery: "", // 搜索
      // 控制修改记账对话框的显示与隐藏
      editDialogVisible: false,
      addDialogVisible: false,
      editForm: [],
      brandList: [],
      typeList: [],
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 查询记账列表
    async getUserList() {
      const { data: res } = await this.$http.get("getJizhang", {});
      this.userlist = res.list;
      console.log(res.list);
    },
    // 删除
    // 根据Id删除对应的记账信息
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将会删除该记账, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$http.get("delJizhang", {
        params: {
          id
        },
      });
      console.log(res.data);
      this.$message.success("删除记账成功！");
      this.getUserList();
    },

    // 搜索
    async getGoodsSearch() {
      const { data: res } = await this.$http.get("getJizhangSearch", {
        params: {
          tel: this.searchQuery,
        },
      });
      console.log(res);
      this.userlist = res.list;
    },
  },
  watch: {
    radio(newValue, oldValue) {
      // console.log(newValue)
      this.getUserList(this.radio);
    },
  },
};
</script>
<style lang="less" scoped>
.img {
  width: 90px;
  height: 110px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>