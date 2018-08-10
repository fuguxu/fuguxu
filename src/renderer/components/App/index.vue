<template>
  <div class="mx_wrap" :class="{isMac: platform !== 'win32'}">
    <header class="mx_head app-draggable">
      <div class="mx_head_logo">
        <img class="mx_head_img" src="@/assets/img/logo/logo.png" />
      </div>
      <div class="mx_head_tab">
        <el-tabs class="mx_head_tablist" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我的网盘" name="myDisk"></el-tab-pane>
          <el-tab-pane label="传输列表" name="transfer"></el-tab-pane>
          <el-tab-pane label="云备份" name="backup"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="mx_head_auxiliary">
        <!-- <div class="mx_head_auxiliary_item mx_close">
          <img class="mx_head_auxiliary_img" src="../../assets/img/logo/close.png" />       
        </div>
        <div class="mx_head_auxiliary_item mx_minus">
          <img class="mx_head_auxiliary_img" src="../../assets/img/logo/minus.png" /> 
        </div> -->
        <!-- <div class="mx_head_auxiliary_item mx_head_auxiliary_split">|</div> -->
        <div class="mx_head_auxiliary_item">
          <img class="mx_head_auxiliary_img" src="@/assets/img/logo/settings.png" /> 
        </div>
        <div class="mx_head_auxiliary_item">
          <img class="mx_head_auxiliary_img" src="@/assets/img/logo/bell.png" /> 
        </div>
        <div class="mx_head_auxiliary_item">
          <el-dropdown class="mx_head_dropdown" trigger="click">
          <span>
            徐宝祥<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><div @click="logout">退出登录</div></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        </div>
      </div>
    </header>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      activeName: 'myDisk'
    }
  },
  computed: {
    platform: {
      get () {
        return this.$nativeApi.system.platform()
      }
    }
  },
  methods: {
    handleClick (tab) {
      this.activeName = tab.name
      this.$router.push({
        name: this.activeName
      })
    },
    logout () {
      console.log('click')
      this.$nativeApi.login.logout()
    }
  }
}
</script>

<style lang="less">
.mx_wrap {
  height: 100%;
  .el-menu-item, .el-submenu__title {
    height: 44px;
    line-height: 44px;
  }
  .mx_aside_emnu {
    margin-top: 12px;
  }
}
.mx_head {
  display: flex;
  position: relative;
  padding-left: 20px;
  line-height: 70px;
  height: 70px;
  background: #2B3C5A;
  .mx_head_logo {
    width: 138px;
  }
  .mx_head_img {
    width: 100%;
    margin-top: 22px;
  }
  .mx_head_tab {
    flex: 1;
  }
  .mx_head_auxiliary {
    width: 260px;
    .mx_head_dropdown {
      line-height: 20px;
      cursor: pointer;
    }
    .el-dropdown {
      font-size: 14px;
      color: @color-white;
    }
    .mx_head_auxiliary_split {
      opacity: .3;
      color: @color-white;
    }
  }
  .mx_head_tablist {
    margin-left: 60px;
    .el-tabs__item {
      font-size: 16px;
      color: @color-white;
      opacity: 0.7;
    }
    .el-tabs__item.is-active {
      opacity: 1;
    }
    .el-tabs__nav-wrap::after {
      background: none
    }
    .el-tabs__active-bar {
      height: 4px;
      background-color: @base-color;
    }
  }
  .mx_head_auxiliary_item {
    float: right;
    margin-right: 20px;
    .mx_head_auxiliary_img {
      width: 16px;
      vertical-align: middle;
    }
  }
}
.isMac {
  font-weight: 300;
  .el-tabs__item {
    font-weight: 300;
  }
  .el-tabs__item.is-active {
    font-weight: 400;
  }
}
</style>
