<template>
  <div class="home">
    <el-container class="el-container">
      <el-aside width="200px" class="el-aside">
        <div class="logo"></div>
        <el-row class="tac">
          <el-menu
            default-active="2"
            class="el-menu-admin"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :unique-opened="true"
            :router="true"
          >
            <el-submenu :index="item.path" v-for="item in menuForm" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{item.authName}}</span>
              </template>
              <el-menu-item-group v-for="second in item.children" :key="second.id">
                <el-menu-item :index="'/home/'+second.path">
                  <i class="el-icon-location"></i>
                  {{second.authName}}
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-row>
      </el-aside>
      <el-container>
        <el-header class="el-header">
          <el-button class="toggle-btn"><i class="myicon-menu"></i></el-button>
          <h1 class="system-title">电商后台管理系统</h1>
          <a href="JavaScript:" class="leave">退出</a>
        </el-header>
        <el-main>
          <router-view>welcome</router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getLeftMenu } from '@/api/right_index'
export default {
  data () {
    return {
      menuForm: {}
    }
  },
  async mounted () {
    let res = await getLeftMenu()
    // console.log(res)
    this.menuForm = res.data.data
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: rgba(255, 255, 255, .3);
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: rgba(255, 255, 255, .7);
    border:none;
    cursor: pointer;
    line-height: 60px;
    background: rgba(0, 0, 0, .1);
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .leave {
    color: orange;
  }
}
</style>
