<template>
  <div class="users">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-input
      placeholder="请搜索输入内容"
      v-model="data.query"
      class="input-with-select"
      style="width:300px"
    >
      <el-button slot="append" icon="el-icon-search" @click="initByQuery"></el-button>
    </el-input>
    <el-button type="success" style="margin:20px" @click="showAddUser">添加用户</el-button>
    <el-table :data="userForm" border style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
      <el-table-column label="状态" width="80">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="editUserStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑用户" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-loading" @click="showRolesList(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="showDeleteUser(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="data.pagenum"
      :page-sizes="[1,2,3,4,5]"
      :page-size="data.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="usersTotal"
    ></el-pagination>
    <el-dialog title="添加用户" :visible.sync="addDialogFormVisible" label-width="100px">
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible" label-width="100px">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除用户" :visible.sync="deleteDialogFormVisible" label-width="100px">
      <span>是否确定要删除该用户</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="分类角色" :visible.sync="roleDialogFormVisible" label-width="100px">
      <el-form :model="roleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名">
          {{roleForm.username}}
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="roleForm.rid" :placeholder="roleForm.role_name">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAllUserList,
  addUser,
  getUserById,
  editUser,
  deleteUserById,
  grantUserRole,
  editUserStatus
} from '@/api/users/users'
import { getAllRolesList } from '@/api/roles/roles_index'
export default {
  data () {
    return {
      options: [],
      deleUserId: 0,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      roleForm: {

      },
      editForm: {},
      editRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }]
      },
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入电话', trigger: 'blur' }]
      },
      roleDialogFormVisible: false,
      deleteDialogFormVisible: false,
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      usersTotal: 1,
      data: {
        query: '',
        pagenum: 3,
        pagesize: 2
      },
      userForm: []
    }
  },
  async mounted () {
    this.init()
    let res = await getAllRolesList()
    // console.log(res)
    this.options = res.data.data
  },
  methods: {
    async editUserStatus (row) {
      let res = await editUserStatus(row.id, row.mg_state)
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
      } else {
        this.$message.warning(res.data.meta.msg + ',请联系技术人员')
      }
    },
    async editRole () {
      // console.log(this.roleForm)
      if (this.roleForm.rid) {
        let res = await grantUserRole(this.roleForm.id, this.roleForm.rid)
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.$message.success(res.data.meta.msg)
          this.roleDialogFormVisible = false
        }
      } else {
        this.$message.warning('请先选择角色')
      }
    },
    showRolesList (row) {
      this.roleDialogFormVisible = true
      console.log(row)
      this.roleForm = row
      if (!this.roleForm.rid) {
        this.roleForm.role_name = '未选择'
      }
    },
    showDeleteUser (row) {
      this.deleteDialogFormVisible = true
      this.deleUserId = row.id
    },
    async deleteUser () {
      let res = await deleteUserById(this.deleUserId)
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.deleteDialogFormVisible = false
        if (this.userForm.length === 1) {
          this.data.pagenum -= 1
        }
        this.init()
      } else {
        this.$message.warning(res.data.meta.msg + ',请联系技术人员')
      }
    },
    async editUser () {
      let res = await editUser(this.editForm)
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.editDialogFormVisible = false
      } else {
        this.$message.warning(res.data.meta.msg + ',请联系技术人员')
      }
    },
    async edit (row) {
      // console.log(row)
      let userId = row.id
      let res = await getUserById(userId)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.editDialogFormVisible = true
        this.editForm = res.data.data
      } else {
        this.$message.warning(res.data.meta.msg + ',请联系技术人员')
      }
    },
    initByQuery () {
      // console.log(123)
      this.init()
    },
    async init () {
      let res = await getAllUserList(this.data)
      if (res.data.meta.status === 200) {
        this.userForm = res.data.data.users
        this.usersTotal = res.data.data.total
        // console.log(this.userForm)
      } else {
        this.$message.warning(res.data.meta.msg)
      }
    },
    handleSizeChange (val) {
      this.data.pagesize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.data.pagenum = val
      this.init()
    },
    showAddUser () {
      this.addDialogFormVisible = true
    },
    async addUser () {
      let res = await addUser(this.addForm)
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message.success(res.data.meta.msg)
        this.init()
        this.addDialogFormVisible = false
      } else {
        this.$message.warning(res.data.meta.msg)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
