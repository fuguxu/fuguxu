<template>
  <div id="login" class="app-draggable" :class="{'is-logon': isLogon}">
    <div class="header" v-if="platform === 'win32'"></div>
    <img src="./assets/images/login-bg.png" class="login-bg">
    <img src="./assets/images/login-logo.png" class="login-logo">
    <form :class="{'has-header': true}" @submit.prevent="login()">
      <!-- 登录 -->
      <el-row name="login-box" class="login-region" v-if="isLogin && !isLogon">
        <el-col>
          <!-- 用户名 -->
          <div class="input-content" :class="{'active-wraning': validate}">
            <el-autocomplete
              class="inline-input"
              v-model="username"
              :fetch-suggestions="querySearch"
              placeholder="请输入MIP账号"
              :trigger-on-focus="false"
              @select="handleSelect"
              autofocus
              clearable
            >
              <template slot-scope="{ item }">
                <div class="name">{{ item }}</div>
              </template>
              <template slot="prepend"><i class="icon-user"></i></template>
            </el-autocomplete>
            <div class="warn-tips">
              <img src="./assets/images/warning.png">
              {{warningMsg}}
            </div>
          </div>
          <!-- 密码-->
          <div class="input-content">
            <el-input placeholder="请输入密码"
              type="password"
              v-model="password"
              clearable
              @change="isAutoLogin = false">
              <template slot="prepend"><i class="icon-lock"></i></template>
            </el-input>
          </div>
          <!-- 选项-->
          <el-row class="login-options">
            <el-col><el-checkbox name="rememberMe" v-model="rememberMe">记住密码</el-checkbox></el-col>
            <el-col><el-checkbox name="autoLogin" v-model="autoLogin">自动登录</el-checkbox></el-col>
            <a href="">忘记密码</a>
          </el-row>
        </el-col>
        <el-button type="primary" class="login-submit" @click="login()">登录</el-button>
      </el-row>

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
        <div class="tips" v-if="isLogon && step === 0">登录中...</div>
      </div>
    </form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        accountList: [],
        isLogin: true, // 是初始登录界面
        isLogon: false, // 已经登录成功
        isCancel: false,
        step: 0,
        isAutoLogin: false,
        rememberMe: true,
        autoLogin: false,
        username: '',
        password: '',
        warningMsg: '账号密码错误',
        validate: false
      }
    },
    components: {},
    name: 'Login',
    computed: {
      platform: {
        get () {
          // return this.$nativeApi.system.platform()
          return false
        }
      }
    },
    mounted () {
      // window.ds = this.$nativeApi.dataService
      // window.hs = this.$nativeApi.httpService
      this.openDB().then(open => {
        console.log('数据库初始化完成')
        this.getUserName()
      })
    },
    methods: {
      querySearch (queryString, cb) {
        const accountList = this.accountList
        const results = queryString ? accountList.filter(username => username.includes(queryString)) : accountList
        // 调用 callback 返回建议列表的数据
        cb(results)
      },
      handleSelect (item) {
        this.username = item && item.toString()
      },
      login () {
        if (this.loginValidate) {
          console.log('login')
          this.$nativeApi.httpService.login('Testuser001', '').then(result => {
            console.log('result==', result)
          })
        }
      },
      loginValidate () {
        let success = false
        if (!this.username) {
          this.warningMsg = '账号不能为空'
          this.validate = true
        } else {
          this.validate = false
          success = true
        }
        return success
      },
      cancelLogin () {
        this.isCancel = true
        this.isLogin = true
      },
      openDB () {
        return this.$nativeApi.dataService.dbinit()
      },
      getUserName () {
        this.$nativeApi.dataService.getUserName().then(user => {
          this.accountList = user.map(row => row.username)
        })
      }
    }
  }
</script>

<style rel="stylesheet/less" lang="less">
  .win-actions {
    float: right;
  }
  .login-bg {
    position: absolute;
    top: -21%;
    z-index: 0;
    width: 100%;
  }
  .login-logo {
    position: absolute;
    top: 47px;
    left: 50%;
    width: 163px;
    transform: translateX(-50%);
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
    background-color: #ffffff;
    transition: opacity .4s;
    .login-region {
      position: absolute;
      top: 80px;
      z-index: 2;
      background-color: #ffffff;
    }
    .user-avatar {
      position: relative;
      width: 90px;
      height: 90px;
      border: solid 4px #fff;
      border-radius: 50%;
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
      position: relative;
      width: 250px;
      height: 32px;
      margin: 0 auto;
      margin-top: 10px;
      border-bottom: 1px solid #A2A5AD;
      .warn-tips {
        position: absolute;
        bottom: -16px;
        left: 0;
        z-index: 5;
        font-size: 10px;
        color: @color-warn;
        padding-left: 5px;
        display: none;
        img {
          width: 10px;
          margin-bottom: -1px;
        }
      }
      .el-input__inner {
        width: 230px;
        font-size: 12px;
        padding-left: 12px;
        outline: 0;
        border: none;
        color: #666666 !important;
        -webkit-app-region: no-drag;
      }
      .el-input-group__prepend {
        padding: 0;
        background-color: #ffffff;
      }
      .el-input-group__prepend,
      .el-input-group__append,
      input {
        height: 32px !important;
        border: none;
        font-size: @small;
        color: #fff;
        &[placeholder],
        &::-webkit-input-placeholder {
          color: rgba(171,170,184,.6);
        }
      }
    }
    .input-content.active-wraning {
      .warn-tips {
        display: block;
      }
    }
    .login-submit {
      width: 250px;
      height: 38px;
      margin: 0 auto;
      background-color: @base-color;
      border-color: @base-color;
      display: block;
      &:hover {
        background-color: #87b1fb;
        border-color: #87b1fb;
      }
    }
    .login-options {
      display: flex;
      width: 250px;
      height: 26px;
      margin: 12px auto 8px;
      .el-checkbox__label, a {
        padding-left: 6px;
        font-size: 12px;
        font-weight: normal;
        color: #666666;
      }
      a {
        display: block;
        line-height: 26px;
        white-space: nowrap;
        text-decoration: none;
      }
    }
    .icon-user {
      .icon(12px, 14px);
      margin-top: 4px;
      margin-left: 4px;
      background: url("assets/images/user.png") no-repeat center;
      opacity: 0.6;
    }
    .icon-lock {
      .icon(12px, 14px);
      margin-top: 4px;
      margin-left: 4px;
      background: url("assets/images/lock.png") no-repeat center;
      opacity: 0.6;
    }
    .logining {
      position: relative;
      width: 100px;
      margin: 16px auto 38px;

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
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: @base-color;
    border-color: @base-color;
  }
  .el-autocomplete-suggestion li {
    font-size: 12px;
    line-height: 25px;
  }
</style>
