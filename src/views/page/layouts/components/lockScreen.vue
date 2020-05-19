<template>
  <div class="pull-right m-r-md">
    <Icon type="icon-dongjie" class="lock" @click.native="lockScreen"></Icon>
  </div>
</template>

<script>
import { removeToken } from 'views/login/auth'
import { checkUser } from '@/services/system/user'

export default {
  data () {
    return {
      timer: ''
    }
  },
  computed: {
    operateTime () {
      return this.$store.state.app.operateTime
    },
    userData () {
      return this.$store.state.app.userData
    }
  },
  created () {
    this.handleLock()
  },
  mounted () {
    this.init()
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    lockScreen () {
      localStorage.setItem('lockData', JSON.stringify({
        path: this.$route.fullPath,
        isLock: true
      }))
      this.$router.push({ name: 'LockMe' })
    },
    handleLock () {
      this.timer = setInterval(() => {
        const interval = 1000 * 60 * 15
        this.checkUser()
        if (new Date().getTime() - this.operateTime >= interval) {
          this.lockScreen()
        }
      }, 1000 * 60)
    },
    init () {
      this.$store.commit('SET_OPERATETIME')
      let lockData = localStorage.getItem('lockData')
      if (lockData) {
        lockData = JSON.parse(lockData)
        if (lockData.isLock) this.$router.push({ name: 'LockMe' })
      }
    },
    checkUser () {
      checkUser(this.userData.id).then(data => {
        if (!data.success) {
          clearInterval(this.timer)
          this.$alert('用户已在其他地方登录，请确保您的账户安全 ', '提示', {
            confirmButtonText: '重新登录',
            callback: () => {
              removeToken()
              location.href = '/'
            }
          })
        }
      }, () => {
        clearInterval(this.timer)
      })
    }
  }
}
</script>
<style scoped>
  .lock {
    font-size: 20px;
    cursor: pointer;
  }
</style>
