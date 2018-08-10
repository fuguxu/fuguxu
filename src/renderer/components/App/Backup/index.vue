<template>
  <div class="backup__bg">
  	<div class="backup__content">
  		<div class="backup__title">开启云备份功能，让您的本地文件自动备份到云端</div>
  		<div class="backup__item">
  			<div class="backup__item_font"><span class="serial">1</span>设置本地备份目录</div>
  			<div class="btn-white">设置</div>
  		</div>
  		<div class="backup__item">
  			<div class="backup__item_font"><span class="serial">2</span>选择网盘保存位置</div>
  			<div class="btn-white">选择</div>
  		</div>
  		<div class="backup__item">
  			<div class="backup__item_font"><span class="serial">3</span>设置备份频率</div>
  			<div class="backup__item_radio">
  				<el-radio v-model="radio" label="1"><span class="backup__item_label">实时备份</span></el-radio>
					<el-radio v-model="radio" label="2"><span class="backup__item_label">定时备份</span></el-radio>
  			</div>
  		</div>
  		<div class="backup__btn">开始备份</div>
  	</div>
  </div>
</template>

<script>
export default {
  name: '',
  components: {

  },
  data () {
    return {
      radio: '1'
    }
  }
}
</script>

<style lang="less" scoped>
.backup__bg {
	position: absolute;
	top: 70px;
	left: 0px;
	bottom: 0px;
	right: 0px;
	z-index: 1;
	background-color: @main-bg;
}
.backup__content {
	position: absolute;
	top: 12px;
	left: 12px;
	bottom: 12px;
	right: 12px;
	z-index: 2;
	background-color: @color-white;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	.backup__title {
		font-size: 22px;
		font-weight: 400;
		color: #667289;
	}
	.backup__item {
		position: relative;
		width: 265px;
		display: flex;
		justify-content: space-between;
		text-align: center;
		font-size: 14px;
		line-height: 32px;
		font-weight: 400;
		color: #333333;
		margin: 0 auto;
		margin-top: 50px;
		.backup__item_radio {
			margin-right: -50px;
		}
		.el-radio {
			line-height: 32px;
			margin-left: 24px;
		}
		.backup__item_label {
			font-size: 12px;
			color: #667289;
			font-weight: normal;
		}
	}
	.serial {
		position: absolute;
		top: 7px;
		left: -30px;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		background-color: #eff4ff;
		border: 1px solid #aecafb;
		display: block;
		text-align: center;
		line-height: 17px;
		font-size: 10px;
		color: #667289;
	}
	.backup__btn {
		.btn-main;
		width: 182px;
		margin-top: 50px;
	}
}
</style>
