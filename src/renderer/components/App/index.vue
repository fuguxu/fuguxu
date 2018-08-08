<template>
  <div>
    <header class="mx_head">
      <div class="mx_head_logo">
        <img class="mx_head_img" src="../../assets/img/logo/logo.png" />
        <span>美的网云盘</span>
      </div>
      <div class="mx_head_tab">
        <el-tabs class="mx_head_tablist" v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="我的网盘" name="myDisk">我的网盘</el-tab-pane>
          <el-tab-pane label="传输列表" name="transfer">传输列表</el-tab-pane>
          <el-tab-pane label="云备份" name="backup">云备份</el-tab-pane>
        </el-tabs>
      </div>
      <div class="mx_head_auxiliary">
        <div class="mx_head_button">姓名</div>
        <div class="mx_head_button">提醒</div>
        <div class="mx_head_button">设置</div>
        <el-dropdown trigger="click">
          <span>
            徐宝祥<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {

  },
  data () {
    return {
      activeName: 'myDisk'
    }
  },
  methods: {
    handleClick (tabName) {
      this.activeName = tabName
      console.log('tab')
    }
  }
}
</script>

<style lang="less">
.mx_head {
  display: flex;
  line-height: 70px;
  height: 70px;
  background: #2B3C5A;
  .mx_head_logo {
    padding-left: 20px;
    width: 150px;
    font-size: 20px;
    color: @color-white;
  }
  .mx_head_img {
    width: 30px;
    vertical-align: middle;
  }
  .mx_head_tab {
    flex: 1;
  }
  .mx_head_auxiliary {
    width: 200px;
    .el-dropdown {
      font-size: 14px;
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
  .mx_head_button {
    float: right
  }
}
</style>
