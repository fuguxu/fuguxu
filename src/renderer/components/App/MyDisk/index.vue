<template>
  <div class="mx_mydisk">
    <div class="mx_aside">
      <el-menu
        class="mx_aside_emnu"
        :default-active="activeName"
        @select="routerGo">
        <el-menu-item index="myDisk-personFile">
          <i class="el-icon-menu"></i>
          <span slot="title">个人文件</span>
        </el-menu-item>
        <el-menu-item index="myDisk-groupFile">
          <i class="el-icon-document"></i>
          <span slot="title">群组文件</span>
        </el-menu-item>
        <el-menu-item index="myDisk-businessFile">
          <i class="el-icon-document"></i>
          <span slot="title">企业文件</span>
        </el-menu-item>
        <el-submenu index="share">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">分享文件</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="myDisk-pulishShare">发出的分享</el-menu-item>
            <el-menu-item index="myDisk-recieveShare">收到的分享</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="myDisk-myCollction">
          <i class="el-icon-setting"></i>
          <span slot="title">我的收藏</span>
        </el-menu-item>
      </el-menu>
      <div class="mx_aside_bottom">
        <el-progress
          class="mx_aside_progress"
          :show-text="false"
          :stroke-width="2"
          :percentage="70"></el-progress>
        <div class="mx_aside_storage">
          <span>600M / 1.00GB</span>
          <img class="mx_aside_bottom_icon" src="../../../assets/img/logo/info.png" />
        </div>
      </div>
    </div>
    <router-view class="mx_disk_wrap"></router-view>
  </div>
</template>

<script>
export default {
  name: 'my-disk',
  data () {
    return {
      activeName: 'myDisk-personFile'
    }
  },
  methods: {
    routerGo (name) {
      this.$router.push({
        name
      })
    }
  },
  watch: {
    'route.name': function (val) {
      this.activeName = val
    }
  }
}
</script>

<style lang="less" scoped>
.mx_mydisk {
  display: flex;
  height: 100%;
  padding-bottom: 70px;
  background: #F3F4F8;
  box-sizing: border-box;
  .mx_aside {
    position: relative;
    width: 200px;
    background: @color-white;
    .mx_aside_bottom {
      position: absolute;
      bottom: 0;
      padding: 30px 20px 0 20px;
      width: 100%;
      height: 90px;
      box-sizing: border-box;
      border-top: 1px solid @border-color;
      .mx_aside_bottom_icon {
        float: right;
        margin-top: 14px;
        width: 12px;
      }
      .mx_aside_storage {
        line-height: 40px;
        font-size: 14px;
        color: #667289;
        letter-spacing: 0;
      }
    }
  }
  .mx_disk_wrap {
    flex: 1;
    margin: 10px;
    background: @color-white;
  }
}
</style>

<style lang="less">
.mx_aside {
  .el-menu {
    border-right: none;
  }
}
</style>