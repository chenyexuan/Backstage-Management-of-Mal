<template>
  <div class="roles">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/rights' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button style="margin:20px" @click="addDialogFormVisible=true">添加角色</el-button>
    <el-table :data="roleForm" border style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-row
            v-for="(first) in props.row.children"
            :key="first.id"
            style="margin-bottom:15px;border-bottom:1px dashed #f00;"
          >
            <el-col :span="4">
              <el-tag
                closable
                :type="'success'"
                @close="cnt=0;handleClose(first.id,props.row)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row
                v-for="(second) in first.children"
                :key="second.id"
                style="margin-bottom:10px;"
              >
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'info'"
                    @close="cnt=0;handleClose(second.id,props.row)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    :type="'warning'"
                    style="margin-right:5px;margin-bottom:5px"
                    @close="cnt=0;handleClose(third.id,props.row)"
                    v-for="(third) in second.children"
                    :key="third.id"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述"></el-table-column>
      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑角色" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="授权角色" placement="top">
            <el-button type="success" icon="el-icon-loading" @click="showRightsList(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="showDeleteRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加角色" :visible.sync="addDialogFormVisible" label-width="100px">
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="editDialogFormVisible" label-width="100px">
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editRuleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除角色" :visible.sync="deleteDialogFormVisible" label-width="100px">
      <span>是否确定要删除该角色</span>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deleteDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- <el-dialog title="分类角色" :visible.sync="roleDialogFormVisible" label-width="100px">
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
    </el-dialog>-->
  </div>
</template>
<script>
import {
  getAllRolesList,
  deleteRightById,
  addRole,
  editRole,
  deleteRoleById
} from '@/api/roles/roles_index'
export default {
  data () {
    return {
      cnt: 0,
      roleForm: [],
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      deleteDialogFormVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      editForm: {
        roleName: '',
        roleDesc: '',
        id: 0
      },
      editRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      deleteId: 0
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    handleClose (id, row) {
      //   console.log(id, row)
      deleteRightById(row.id, id)
        .then(res => {
          //   console.log(res, row)
          if (res.data.meta.status === 200) {
            // console.log(row)
            if (this.cnt === 0) {
              this.$message.success(res.data.meta.msg)
              this.cnt++
            }
            row.children = res.data.data
            row.children.forEach(v1 => {
              if (v1.children.length === 0) {
                this.handleClose(v1.id, row)
              } else {
                v1.children.forEach(v2 => {
                  if (v2.children.length === 0) {
                    this.handleClose(v2.id, row)
                  }
                })
              }
            })
          } else {
            this.$message.warning(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    init () {
      getAllRolesList()
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.roleForm = res.data.data
          } else {
            this.$message.warning(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    addRole () {
      this.$refs.addRuleForm.validate(valid => {
        if (valid) {
          addRole(this.addForm)
            .then(res => {
              //   console.log(res)
              if (res.data.meta.status === 201) {
                this.init()
                this.$message.success(res.data.meta.msg)
                this.$refs.addRuleForm.resetFields()
              } else {
                this.$message.warning(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
          this.addDialogFormVisible = false
        } else {
          console.log('error submit')
          return false
        }
      })
    },
    edit (row) {
      console.log(row)
      this.editForm.roleName = row.roleName
      this.editForm.roleDesc = row.roleDesc
      this.editForm.id = row.id
      this.editDialogFormVisible = true
    },
    editUser () {
      this.$refs.editRuleForm.validate(valid => {
        if (valid) {
          editRole(this.editForm)
            .then(res => {
            //   console.log(res)
              if (res.data.meta.status === 200) {
                this.$message.success('编辑角色成功')
                this.init()
                this.editDialogFormVisible = false
              } else {
                this.$message.warning('编辑角色失败')
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          console.log('error')
          return false
        }
      })
      this.editDialogFormVisible = false
    },
    showDeleteRole (row) {
      this.deleteDialogFormVisible = true
      this.deleteId = row.id
    },
    deleteUser () {
      deleteRoleById(this.deleteId)
        .then(res => {
        //   console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            this.init()
            this.deleteDialogFormVisible = false
          } else {
            this.$message.warning(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="stylus" scoped></style>
