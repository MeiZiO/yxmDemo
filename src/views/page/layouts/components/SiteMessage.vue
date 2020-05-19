<template>
  <div class="pull-right system-letter">
    <el-dropdown trigger="click">
      <span>
        <el-badge :value="msgTotal" class="item cur-point">
          <Icon type="icon-jiankonggaojing"></Icon>
        </el-badge>
      </span>
      <el-dropdown-menu slot="dropdown" class="message-container list-group">
        <el-dropdown-item class="list-group-item message-count">
          <span>您有{{msgTotal}}条新消息</span>
          <router-link :to="{name: 'PersonalMessage'}">
            <el-button type="primary" size="mini" icon="el-icon-more" class="pull-right">查看更多</el-button>
          </router-link>
        </el-dropdown-item>
        <el-dropdown-item @click.native="handleDetail(item.id)" v-for="item in messageList" :key="item.id"
                          class="list-group-item">
          <span class="text-ellipsis">
              <i class="dot dot-warning"></i>{{item.name}}</span>
          <small class="text-ellipsis text-muted">{{item.content}}</small>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <!--详情界面-->
    <detail-dialog class="special-detail" :dialog="detail" v-if="detail.visible"></detail-dialog>
  </div>
</template>
<script>
import detailDialog from 'views/personal/message/detail.vue'
import webSocket from '@/mixins/webSocket'
import { getMessage } from '@/services/system/message'
import { mapState, mapActions } from 'vuex'

export default {
  mixins: [webSocket],
  components: { detailDialog },
  data () {
    return {
      // messageList: [],
      // totalMessage: 0,
      detail: {
        visible: false
      }
    }
  },
  computed: {
    ...mapState({
      msgTotal: state => state.messageTotal.msgTotal,
      messageList: state => state.messageTotal.messageList
    })
  },
  watch: {
    // 监控路由变化隐藏全局站内信详情
    $route () {
      if (this.detail.visible) this.detail.visible = false
    }
  },
  created () {
    this.loadMessage();
    this.$store.commit('SET_WEBSOCKET', this.webSocket)
  },
  methods: {
    ...mapActions(['GetMsgTotal']),
    // 获取站内信信息
    loadMessage () {
      getMessage({
        page: 1,
        rows: 5,
        params: JSON.stringify([{ param: { status: 'UNREAD' }, sign: 'EQ' }])
      }).then(data => {
        if (data.success) {
          // this.messageList = data.data.rows
          // this.totalMessage = data.data.total
          this.GetMsgTotal()
        }
      })
    },
    messageCommonFun (data) {
      if (data.operate !== 'HeartBeat') console.log(data);
      switch (data.category) {
        case 'MachineDiscovered':// 机器发现消息
        case 'ResourceEvent':// 云管消息
          this.$notify({
            message: data.message,
            type: data.success ? 'success' : 'error'
          })
          break
        case 'SiteMessage':// 站内信消息
          this.loadMessage()
          if (data.operate !== 'message.change') {
            this.$notify({
              message: '您有一条新的消息！',
              type: 'info'
            })
          }
          break
      }
    },
    handleDetail (id) {
      this.GetMsgTotal()
      this.detail = {
        visible: true,
        id: id
      }
    }
  }
}
</script>
<style lang="scss">
  .system-letter i {
    font-size: 18px;
  }

  .system-letter .el-badge__content.is-fixed {
    border: none;
    top: 12px !important;
  }

  .message-container {
    padding: 0 !important;
    top: 30px !important;
    width: 300px;
  }

  .list-group {
    max-width: 300px;
  }

  .message-container .popper__arrow {
    display: none !important;
  }

  .system-letter .list-group {
    min-width: 270px;
  }

  .list-group-item.message-count {
    padding: 10px !important;
    cursor: default;
  }

  .common-detail.special-detail {
    position: fixed;
    top: 55px;
    z-index: 5;
    width: calc(100% - 200px);
    right: 10px;
    .detail-body {
      height: calc(100vh - 65px) !important;
    }
  }
</style>
