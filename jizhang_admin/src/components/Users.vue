<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>基础设置</el-breadcrumb-item>
      <el-breadcrumb-item>账号管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入手机号"
            v-model="searchQuery"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserSearch"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        
        <el-table-column label="用户名" prop="tel"></el-table-column>
        <el-table-column label="密码" prop="paw"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
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

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form :model="addForm" ref="addFormRef" label-width="70px">
        <el-form-item label="手机号">
          <el-input v-model="addForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addForm.paw"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.tel" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="mobile">
          <el-input v-model="editForm.paw"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "", // 搜索
      userlist: [],
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        tel: "",
        paw: ""
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("getUser");
      this.userlist = res.list;
      console.log(res.list);
    },

    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮，添加新用户
    async addUser() {
      // 可以发起添加用户的网络请求
      const { data: res } = await this.$http.get("register", {
        params: this.addForm,
      });
      console.log(res);

      if (res.code == 200) {
        this.$message.success("添加用户成功！");
      } else if (res.code == 0) {
        this.$message.info("该用户已存在！");
      } else {
        alert("添加失败！");
      }
      // 隐藏添加用户的对话框
      this.addDialogVisible = false;
      // 重新获取用户列表数据
      this.getUserList();
      this.addForm = {
        tel: "",
        paw: ""
      };
    },
    // 展示编辑用户的对话框
    async showEditDialog(obj) {
      console.log(obj);
      this.editForm = obj;
      this.editDialogVisible = true;
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    async editUserInfo() {
      // 发起修改用户信息的数据请求
      const { data: res } = await this.$http.get("updatePost", {
        params: this.editForm,
      });

      console.log(res);
      // if (res.meta.status !== 200) {
      //   return this.$message.error('更新用户信息失败！')
      // }

      // 关闭对话框
      this.editDialogVisible = false;
      // 刷新数据列表
      this.getUserList();
      // 提示修改成功
      this.$message.success("更新用户信息成功！");
    },
    // 根据Id删除对应的用户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
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
      const res = await this.$http.get("delUser", {
        params: {
          id,
        },
      });
      console.log(res);
      // return this.$message.error('删除用户失败！')

      this.$message.success("删除用户成功！");
      this.getUserList();
    },

    // 搜索
    async getUserSearch() {
      const { data: res } = await this.$http.get("getUserSearch", {
        params: {
          tel: this.searchQuery,
        },
      });
      this.userlist = res.list;
    },
  },
};
</script>

<style lang="less" scoped>
</style>
