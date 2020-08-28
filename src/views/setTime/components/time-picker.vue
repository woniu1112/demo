<template>
  <div class="time-picker">
    <div class="time-box">
      <div class="show-time">
        <span @click="handleSwich(1)" :class="{'time': true, 'active': activeTab === 1}">{{start}}</span>
        <span>至</span>
        <span @click="handleSwich(2)" :class="{'time': true, 'active': activeTab === 2}">{{end}}</span>
      </div>
      <van-datetime-picker
        v-model="currentTime"
        type="time"
        title="选择时间"
        :min-hour="0"
        :max-hour="23"
        :show-toolbar="false"
        :visible-item-count = '3'
        @change="timePickerChange"
      />
      <div class="btn-box">
        <span @click="cancel">取消</span>
        <span @click="handleSure">{{sureText}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "time-picker",
  props: ['activeLockTime', 'showDialog'],
  data () {
    return {
      currentTime: '', // 绑定的时间
      activeTab: 1,
      start: '',
      end: '',
      sureText: '下一步'
    }
  },
  watch: {
    activeLockTime: {
      handler: 'watchActiveLockTime',
      immediate: true
    }
  },
  methods: {
    watchActiveLockTime (val) {
      let list = val.time.split('-')
      this.currentTime = list[0]
      this.start = list[0]
      this.end = list[1]
    },
    /**
     * 时间change事件
     */
    timePickerChange () {
      switch (this.activeTab) {
        case 1:
          this.start = this.currentTime
          break
        case 2:
          this.end = this.currentTime
          break
      }
    },
    /**
     * 点击时间切换
     */
    handleSwich (val) {
      this.activeTab = val
      switch (val) {
        case 1:
          this.sureText = '下一步'
          this.currentTime = this.start
          break
        case 2:
          this.sureText = '确定'
          this.currentTime = this.end
          break
      }
    },
    cancel () {
      this.$emit('update:showDialog', false)
    },
    /**
     * 确定
     */
    handleSure () {
      if (this.activeTab === 1) {
        this.sureText = '确定'
        this.activeTab = 2
        this.currentTime = this.end
      } else {
        this.$emit('chooseTime', this.start, this.end)
      }
    }
  }
}
</script>

<style scoped lang="less">
.time-box {
  display: inline-block;
  text-align: center;
  width: 5.6rem;
  border-radius: 0.2rem;
  background: #fff;
  padding: .4rem 0 0;
  overflow: hidden;
  .show-time {
    text-align: center;
    span {
      display: inline-block;
      height: 0.6rem;
      text-align: center;
      line-height: 0.6rem;
      vertical-align: top;
    }
    span:nth-of-type(2) {
      margin: 0 .2rem;
    }
    .time{
      background: #e4eaff;
      color: #4768f3;
      width: 1.7rem;
      font-size: 0.26rem;
      border-radius: 0.07rem;
    }
    .active {
      background: #4768f3;
      color: #fff;
    }
  }
  .btn-box {
    display: flex;
    width: 100%;
    height: .8rem;
    justify-content: space-between;
    border-top: 1px solid #f1f1f1;
    span {
      line-height: 0.8rem;
      text-align: center;
      width: 50%;
    }
    span:nth-of-type(2) {
      border-left: 1px solid #f1f1f1;
      color: #4768f3;
    }
    span:nth-of-type(2):focus {
      background: #4768f3;
      color: #fff;
    }
  }
}
</style>
