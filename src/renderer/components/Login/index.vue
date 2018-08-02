<template>
  <div id="login" :class="{'is-logon': isLogon}">
    <div class="header" v-if="false"></div>
      <!-- 登录中 -->
      <div class="logining" v-else>
        <div class="user-avatar">
          <a class="user-status"></a>

          <!-- loading -->
          <svg class="spinner"  width="210px" height="210px" viewBox="0 0 210 210">
            <circle class="path" fill="none" stroke-width="4"
                    stroke-linecap="round" cx="105" cy="105" r="105"></circle>
          </svg>
        </div>

        <!-- 取消登录 -->
        <div class="cancel" v-if="!isLogon" @click.prevent="cancelLogin">取消登录</div>
        <div class="tips" v-if="isLogon && step === 0">登录中</div>
        <div class="tips" v-if="isLogon && step === 1">转移数据库</div>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        userNameFlag: false, // 选中用户名
        pwdFlag: false, // 选中密码
        isLogin: true, // 是初始登录界面
        isLogon: false, // 已经登录成功
        isCancel: false,
        step: 0,
        isAutoLogin: false
      }
    },
    components: {
    },
    name: 'Login',
    computed: {
    },
    mounted () {
      console.log('this==', this.$nativeApi.dataService)
      // this.$nativeApi.dataService.init().then(result => {
      //   console.debug('init success', result)
      // })
    },
    methods: {
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  .win-actions {
    float: right;
  }
  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    background-size: contain !important;
  }

  .icon(@w, @h) when(@w > 0){
    display: inline-block;
    width: @w;
    height: @h;
    background-size: contain !important;
  }

  #login {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    border-radius: 4px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
    background-color: #484759;
    transition: opacity .4s;
    // &.is-logon {
    //   opacity: 0;
    // }

    .login-region {
      width: 320px;
      min-width: 320px;
      margin: 30px auto;
      animation: popInLeft .5s linear;
    }
    .user-avatar {
      position: relative;
      width: 90px;
      height: 90px;
      border: solid 4px #fff;
      border-radius: 50%;
      /*background: url("../../assets/images/avatar.svg") no-repeat center;*/
      background-size: contain;
      user-select: none;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
      .user-status {
        display: block;
        position: absolute;
        width: 18px;
        height: 18px;
        bottom: -11px;
        left: 50%;
        margin-left: -9px;
        background: url("assets/images/status-online.svg") no-repeat center;
        background-size: contain;
      }
    }
    .submit-button {
      -webkit-appearance: none;
      background: transparent;
      box-shadow: none;
      border: none;
      cursor: pointer;
      outline: none;
    }
    .input-content {
      width: 200px;
      height: 40px;
      margin: 0 auto;
      border-radius: 95px;
      background-color: #363647;
      overflow: hidden;
      .el-input-group__prepend {
        padding-top: 2px;
        padding-left: 17px;
        padding-right: 0;
      }
      &.selected {
        box-shadow: 0 0 2px 1.5px hsl(208, 99%, 62%);

        input[type=password] {
          color: hsl(208, 99%, 62%) !important;
        }
      }
      .el-input-group__prepend,
      .el-input-group__append,
      input {
        height: 40px !important;
        border: none;
        font-size: @small;
        color: #fff;
        background-color: #363647;
        &[placeholder],
        &::-webkit-input-placeholder {
          color: rgba(171,170,184,.6) !important;
        }
      }
      & + .input-content {
        margin-top: 10px;
      }
    }
    .login-options {
      margin-top: 25px;
      height: 20px;
      & :first-child {
        text-align: left;
      }
      & :last-child {
        text-align: right;
      }
      .el-checkbox__inner {
        width: 15px;
        height: 15px;
        border-color: rgba(151,151,151,.5) !important;
        border-radius: 50%;
        background: transparent;
      }
      .el-checkbox__inner:after {
        top: 2px !important;
        left: 2px !important;
        width: 9px !important;
        height: 9px !important;
        border: none !important;
        background-color: #3da5fe !important;
        border-radius: 50%;
        -webkit-transform: scale(0);
        -moz-transform: scale(0);
        -ms-transform: scale(0);
        -o-transform: scale(0);
        transform: scale(0);
      }
      .is-checked .el-checkbox__inner:after {
        -webkit-transform: scale(1);
        -moz-transform: scale(1);
        -ms-transform: scale(1);
        -o-transform: scale(1);
        transform: scale(1);
      }
      .el-checkbox__label {
        opacity: 0.7;
        color: #ffffff;
      }
    }
    .icon-user {
      .icon;
    }
    .icon-lock {
      .icon;
    }
    .icon-go {
      .icon(24px, 24px);
    }

    .logining {
      position: relative;
      width: 100px;
      margin: 16px auto 38px;
      animation: popInRight .5s linear;

      .cancel {
        width: 88px;
        height: 26px;
        line-height: 26px;
        margin: 25px auto;
        border: 1px solid #686773;
        border-radius: 95px;
        color: #fff;
        font-size: @small;
        opacity: .7;
        text-align: center;
        cursor: pointer;
      }

      .tips {
        margin: 25px auto;
        text-align: center;
        color: #fff;
        font-size: @smaller;
      }

      .spinner {
        position: absolute;
        z-index: 2;
        top: 50%;
        left: 50%;
        margin-top: -108px;
        margin-left: -108px;
        right: 15px;
        bottom: 15px;
        padding: 3px;
        transition: opacity .15s ease;
        animation: rotator 2s linear infinite;
        animation-play-state: running;
      }

      @keyframes rotator {
        0% {
          transform: scale(0.55) rotate(0deg);
        }
        100% {
          transform: scale(0.55) rotate(270deg);
        }
      }

      .spinner .path {
        stroke: hsl(208, 99%, 62%);
        stroke-dasharray: 700;
        stroke-dashoffset: 0;
        transform-origin: center;
        animation: dash1 2s ease-in-out infinite;
      }

      @keyframes dash1 {
        0% {
          stroke-dashoffset: 700;
        }
        50% {
          stroke-dashoffset: 63;
          transform: rotate(135deg);
        }
        100% {
          stroke-dashoffset: 700;
          transform: rotate(450deg);
        }
      }
    }
  }
</style>
