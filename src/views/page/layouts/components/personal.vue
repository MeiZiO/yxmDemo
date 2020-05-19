<template>
  <div class="user-info pull-right">
    <el-dropdown class="pull-right">
      <div class="user-content">
        <img :src="userData.portrait" class="head-portrait"/>
        {{userData.name}}<i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="openPwdDialog"><i class="iconfont icon-mima"></i> 修改密码</el-dropdown-item>
        <!-- <router-link :to="{ name: 'PersonalInfo' }">
          <el-dropdown-item><i class="iconfont icon-wo"></i> 个人信息</el-dropdown-item>
        </router-link> -->
        <el-dropdown-item @click.native="logout()"><i class="iconfont icon-tuichu"></i> 退出系统</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :close-on-click-modal="false" width="30%" v-if="pwdDialogVisible"
               :visible.sync="pwdDialogVisible" append-to-body>
      <cmp-form :model="pwdData" ref="pwdData">
        <cmp-form-item label="原密码：" prop="oldPassword" validate="required">
          <el-input v-model="pwdData.oldPassword" type="password" auto-complete="off"></el-input>
        </cmp-form-item>
        <cmp-form-item label="新密码：" prop="newPassword" :validate="pwdRule">
          <el-input type="password" v-model="pwdData.newPassword" auto-complete="off"></el-input>
        </cmp-form-item>
        <cmp-form-item label="确认密码：" prop="confirmPassword" :validate="pwdRule">
          <el-input type="password" v-model="pwdData.confirmPassword" auto-complete="off"></el-input>
        </cmp-form-item>
      </cmp-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="pwdDialogVisible = false">取消</el-button>
        <el-button type="primary" @click.native="modifySubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { removeToken } from '@/views/login/auth'
import crypto from '@/utils/crypto.js'
import { operateUser } from '@/services/system/user'
import { logout } from '@/services/system'
import { IAjaxData } from '@/interface'

@Component
export default class Personal extends Vue {
  private pwdData: any = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
  private pwdDialogVisible: boolean = false
  get userData () {
    return this.$store.state.app.userData
  }
  get pwdRule () {
    return this.$store.state.app.pwdRule
  }
  private checkPassword () {
    if (this.pwdData.newPassword === this.pwdData.oldPassword) {
      this.$message({
        message: '新密码不能与原密码相同',
        type: 'error'
      })
      return false
    }
    if (this.pwdData.confirmPassword !== this.pwdData.newPassword) {
      this.$message({
        message: '确认密码与新密码不一致',
        type: 'error'
      })
      return false
    }

    return true
  }
  private logout () {
    this.$confirm('您确定要退出该系统吗?', '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    }).then(() => {
      logout().then((data: IAjaxData) => {
        if (data.success) {
          removeToken()
          location.href = '/'
        }
      })
    })
  }
  private openPwdDialog () {
    this.pwdDialogVisible = true
    this.pwdData = {}
  }
  private modifySubmit () {
    (this.$refs.pwdData as any).validate((valid: boolean) => {
      if (valid && this.checkPassword()) {
        operateUser(this.userData.id, 'change', {
          password: crypto.encrypt(this.pwdData.newPassword),
          oldPassword: crypto.encrypt(this.pwdData.oldPassword)
        }).then((data: IAjaxData) => {
          if (data.success) {
            this.pwdDialogVisible = false
            this.$message({
              message: data.message,
              type: 'success'
            })
            removeToken()
            location.href = '/'
          }
        })
      }
    })
  }
}
</script>
<style lang="scss" scoped>
  .user-info {
    margin-right: 10px;
    font-size: 16px;
    color: #666;
    .user-content {
      position: relative;
      display: inline-block;
      padding-left: 30px;
      cursor: pointer;
      .head-portrait {
        display: inline-block;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        margin: 0 2px -5px 0;
      }
    }
  }
</style>
