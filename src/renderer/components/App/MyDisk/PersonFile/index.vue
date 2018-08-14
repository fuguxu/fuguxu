<template>
  <div ref="perfile" v-clickoutside="removeSelect">
    <div class="perfile__menu no-select">
      <div class="perfile__menu_left">
        <div class="btn-white">上传</div>
        <div class="btn-white">下载</div>
        <div class="btn-white">分享</div>
        <div class="btn-white">删除</div>
        <div class="btn-main" @click.stop="addFile">新建文件夹</div>
      </div>
      <div class="perfile__menu_right">
        <div class="perfile__menu_icon">
          <img src="@/assets/image/ic-search@2x.png">
        </div>
        <div class="perfile__menu_icon">
          <img src="@/assets/image/ic-sort1@2x.png">
        </div>
        <div class="perfile__menu_icon">
          <img src="@/assets/image/ic-burger1@2x.png">
        </div>
      </div>
    </div>
    <div class="perfile__content">
      <div class="perfile__name">个人文件</div>
      <div class="perfile__title">
        <div class="perfile__list_1">
          <div class="check-box"></div>
          <div>名称</div>
        </div>
        <div class="perfile__list_2">大小</div>
        <div class="perfile__list_2">修改时间</div>
      </div>
      <div class="perfile__list_wrap" @click="removeSelect">
        <div class="perfile__list no-select"
          v-for="(item, index) in fileList"
          :key="index"
          :class="{'selected': setSelectBg(index)}"
          @click.stop="selectFile(index)">
          <div class="perfile__list_1">
            <div class="check-box"></div>
            <div class="perfile__list_ico">
              <img :src="item.src">
            </div>
            <div class="perfile__list_filename">{{item.filename}}</div>
          </div>
          <div class="perfile__list_2">{{item.size}}</div>
          <div class="perfile__list_2">{{item.modifyTime}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toFileName, bytesToSize } from '@/lib/utils'
import clickoutside from '@/lib/clickoutside.js'
export default {
  name: 'PersonFile',
  data () {
    return {
      fileList: [],
      selectBgList: [],
      startSelect: 0
    }
  },
  computed: {
  },
  directives: {
    clickoutside
  },
  mounted () {
    this.getfileCatalog()
  },
  methods: {
    removeSelect () {
      this.selectBgList = []
    },
    selectFile (index) {
      let min, max
      let selectList = []
      console.log(event)
      if (event.shiftKey) {
        if (this.startSelect === index) {
          this.listClick(index)
        } else {
          max = Math.max(this.startSelect, index)
          min = Math.min(this.startSelect, index)
          for (let i = min; i <= max; i++) {
            selectList.push(i)
          }
          this.selectBgList = selectList
        }
      } else if (event.metaKey || event.ctrlKey) {
        this.selectBgList.push(index)
      } else {
        this.listClick(index)
      }
    },
    listClick (index) {
      this.startSelect = index
      this.selectBgList.splice(0, 1, index)
      this.selectBgList.length = 1
    },
    setSelectBg (index) {
      return this.selectBgList.includes(index)
    },
    getfileCatalog () {
      const params = {
        path: '/',
        index: '1',
        pageSize: '100',
        type: '0',
        sortFiled: '0',
        sortType: '1'
      }
      this.$nativeApi.httpService.fileCatalog(params).then(filedata => {
        console.log('filedata--> ', filedata)
        let listData = filedata.subinfos
        listData && listData.length && listData.map(row => {
          row.src = this.getFileIcon(row.filetype, row.filename)
          row.size = bytesToSize(row.filesize)
          row.select = false
        })
        console.log('listData==', listData)
        this.fileList = listData
      })
    },
    getFileIcon (filetype, filename) {
      let src, type
      if (filetype === '2') {
        src = 'assets/image/ico_folder.png'
      } else if (filetype === '1') {
        type = toFileName(filename)
        src = `assets/image/ico_${type}.png`
      }
      return src
    },
    addFile () {
      const params = {
        md5: '',
        fileType: '2',
        classify: '',
        parentPath: '/',
        fileName: 'newFile',
        fileSize: '',
        isBPC: '0',
        frameSize: '',
        frameNum: '',
        flag: 1
      }
      this.$nativeApi.httpService.addFile(params).then(result => {
        console.log('addFile result--> ', result)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.perfile__menu {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  .perfile__menu_left, .perfile__menu_right {
    display: flex;
    flex-direction: row;
  }
  .perfile__menu_left {
    .btn-white {
      margin-right: 16px;
    }
    .btn-main {
      width: 100px;
    }
  }
  .perfile__menu_icon {
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 8px;
    img {
      width: 16px;
    }
  }
}
.perfile__list_wrap {
  position: absolute;
  top: 131px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: auto;
}
.perfile__content {
  font-size: 14px;
  color: @color-deep-blue;
  .check-box {
    display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #ffffff;
    z-index: 1;
    margin-right: 16px;
  }
  .perfile__name {
    font-size: 12px;
    padding-left: 24px;
    padding-bottom: 5px;
    border-bottom: 1px solid @border-color;
  }
  .perfile__title {
    height: 45px;
    font-weight: 400;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid @border-color;
  }
  .perfile__list_ico {
    position: relative;
    width: 20px;
    img {
      position: absolute;
      top: 50%;
      left: 0;
      z-index: 1;
      width: 100%;
      transform: translateY(-50%);
    }
  }
  .perfile__list_filename {
    margin-left: 8px;
  }
  .perfile__list {
    font-size: 14px;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid @border-color;
    &:hover {
      background-color: #f5f9ff;
    }
  }
  .perfile__list.selected {
    color: @color-white;
    background-color: @base-color;
    .check-box {
      border: 1px solid #ffffff;
      background: url('./image/checked.png') no-repeat 0 0;
      background-size: contain;
    }
  }
  .perfile__list_1 {
    display: flex;
    align-items: center;
    flex-direction: row;
    width: 60%;
    padding-left: 24px;
    .el-checkbox {
      margin-right: 16px;
    }
  }
  .perfile__list_2 {
    width: 20%;
  }
}
</style>
