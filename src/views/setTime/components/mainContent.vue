<template>
  <div class="time-main-content">
    <div class="time-choose-container">
      <div class="left-div">
        <p>上<br/>午</p>
        <p>下<br/>午</p>
      </div>
      <div class="right-div">
        <span v-for="(item, index) in hList"
              @click="chooseHour(item, index)">
          <b class="text-b">{{item.hour}}</b>
          <b v-for="flag in item.flags" class="active-bg" :style="{left: flag.left, width: flag.width}"></b>
        </span>
      </div>
    </div>
    <div class="show-time">
      <div class="time-box">
        <p>自由时间：</p>
        <div class="free-time">
          <span v-for="item in freeTimeList">{{item}}</span>
        </div>
      </div>
      <div class="time-box">
        <p>锁屏时间：</p>
        <div class="lock-time">
          <span v-for="(item, index) in lockTimeList" @click="lockTimeRangeClick(item, index)">{{item}}</span>
        </div>
      </div>
    </div>
    <div class="dialog-container" v-if="showDialog">
      <timePicker @chooseTime="chooseTime" :showDialog.sync="showDialog" :activeLockTime="activeLockTime"></timePicker>
    </div>
  </div>
</template>

<script>
const timePicker = resolve => require(['./time-picker'], resolve)
export default {
  name: "time-main-content",
  components: {
    timePicker
  },
  data () {
    return {
      hList: [
        {
          hour:'0',
          flags:[]
        },{
          hour:'1',
          flags:[]
        },{
          hour:'2',
          flags:[]
        },{
          hour:'3',
          flags:[]
        },{
          hour:'4',
          flags:[]
        },{
          hour:'5',
          flags:[]
        },{
          hour:'6',
          flags:[]
        },{
          hour:'7',
          flags:[]
        },{
          hour:'8',
          flags:[]
        },{
          hour:'9',
          flags:[]
        },{
          hour:'10',
          flags:[]
        },{
          hour:'11',
          flags:[]
        },{
          hour:'12',
          flags:[]
        },{
          hour:'13',
          flags:[]
        },{
          hour:'14',
          flags:[]
        },{
          hour:'15',
          flags:[]
        },{
          hour:'16',
          flags:[]
        },{
          hour:'17',
          flags:[]
        },{
          hour:'18',
          flags:[]
        },{
          hour:'19',
          flags:[]
        },{
          hour:'20',
          flags:[]
        },{
          hour:'21',
          flags:[]
        },{
          hour:'22',
          flags:[]
        },{
          hour:'23',
          flags:[]
        }
      ], // 小时 list
      freeTimeList: [], // 自由时间 list
      lockTimeList: [], // 锁屏时间 list
      currentTime: '', // 时间插件 初始时间
      showDialog: false, // 是否显示弹窗
      activeLockTime: {
        time: '',
        index: ''
      } // 当时编辑的 锁屏时间
    }
  },
  methods: {
    /**
     * 选择时间
     */
    chooseHour (activeItem, activeIndex) {
      if (activeItem.flags.length === 0) { // 当前时间没有 添加到锁屏时间
        activeItem.flags.push({left: 0, width: '100%'}) // 改变背景色
        this.lockTimeAdd(activeItem, activeIndex)
      } else if (activeItem.flags.length === 1 && activeItem.flags[0].width === '100%') { // 选中整个时间段
        activeItem.flags = [] // 改变背景色
        this.removeLockTime(activeItem)
      } else {
        console.log(activeItem)
      }
    },
    /**
     * 添加锁屏时间
     * condition1 -》 当前选择的时间 === 锁屏时间中一个的开始时间 -1 或 当前选择的时间 === 锁屏时间中一个的结束时间
     */
    lockTimeAdd (activeItem, activeIndex) {
      let condition1 = this.lockTimeList.filter(item => Number(activeItem.hour) === this.timeToNub(item).start.h - 1 || Number(activeItem.hour) === this.timeToNub(item).end.h)
      let timeScope = ''
      if (condition1.length === 0) {
        timeScope = `${this.formatH(activeItem.hour)}-${this.formatH(Number(activeItem.hour) + 1)}`
      } else {
        let list = []
        // 先将 锁屏时间中 符合 condition1  条件 的时间范围删除
        for (let i = 0; i < this.lockTimeList.length; i++) {
          if (condition1.includes(this.lockTimeList[i])) {
            this.lockTimeList.splice(i, 1)
            i--
          }
        }
        // 将筛选出符合条件 condition1 的 小时都放入一个数组中然后排序，选择 开始和结束时间
        condition1.forEach(item => {
          list = list.concat([this.timeToNub(item).start.h, this.timeToNub(item).end.h])
        })
        list = list.sort((a, b) => a - b)
        let start = list[0] > activeItem.hour ? activeItem.hour : list[0]
        let end = list[list.length - 1] === Number(activeItem.hour) ? (list[list.length - 1] + 1) : list[list.length - 1]
        timeScope = `${this.formatH(start)}-${this.formatH(end)}`
      }
      this.lockTimeList.push(timeScope)
      this.lockTimeList = this.timeRangeSort(this.lockTimeList)
    },
    /**
     * 移除锁屏时间
     */
    removeLockTime (activeItem) {
      let list = this.lockTimeList.filter(item => this.timeToNub(item).start.h <= activeItem.hour && activeItem.hour < this.timeToNub(item).end.h)
      let index = this.lockTimeList.indexOf(list[0])
      let condition1 = Number(activeItem.hour) === this.timeToNub(list[0]).start.h && (Number(activeItem.hour) + 1) === this.timeToNub(list[0]).end.h // 条件1：例：8,9,10 点的 9
      let condition2 = Number(activeItem.hour) === this.timeToNub(list[0]).start.h // 条件2：例：8,9,10  点的 8
      let condition3 = Number(activeItem.hour) + 1 === this.timeToNub(list[0]).end.h // 条件3：例：8,9,10  点的 10
      if (condition1) {
        this.lockTimeList.splice(index, 1)
      } else if (condition2) {
        this.lockTimeList[index] = `${this.formatH(Number(activeItem.hour) + 1)}-${this.formatH(this.timeToNub(list[0]).end.h)}`
      } else if (condition3) {
        this.lockTimeList[index] = `${this.formatH(this.timeToNub(list[0]).start.h)}-${this.formatH(activeItem.hour)}`
      } else { // 条件4：例：8,9,10,11  点的 10
        this.lockTimeList.splice(index, 1)
        this.lockTimeList.push(`${this.formatH(this.timeToNub(list[0]).start.h)}-${this.formatH(activeItem.hour)}`)
        this.lockTimeList.push(`${this.formatH(Number(activeItem.hour) + 1)}-${this.formatH(this.timeToNub(list[0]).end.h)}`)
        this.lockTimeList = this.timeRangeSort(this.lockTimeList)
      }
    },
    /**
     * 时间范围排序
     */
    timeRangeSort (arr) {
      return arr.sort((a, b) => {
        let start = this.timeToNub(a).start.h
        let end = this.timeToNub(b).start.h
        return start - end
      })
    },
    /**
     * 格式化小时格式
     * return  08:00
     */
    formatH (hour) {
      let h = hour < 10 ? `0${hour}:00` : `${hour}:00`
      return h
    },
    /**
     * 时间转换成 数字
     * 例：08:06-09:10  转成 { start：{h:8,m:6}， end:{h:9,m:10} }
     */
    timeToNub (time) {
      let list = time.split('-')
      return {
        start: {
          h: Number(list[0].split(':')[0].replace(/^0+/, '')),
          m: Number(list[0].split(':')[1].replace(/^0+/, ''))
        },
        end: {
          h: Number(list[1].split(':')[0].replace(/^0+/, '')),
          m: Number(list[1].split(':')[1].replace(/^0+/, ''))
        }
      }
    },
    /**
     * 锁屏时间 点击事件
     */
    lockTimeRangeClick (activeItem, activeIndex) {
      this.showDialog = true
      this.activeLockTime = {time: activeItem, index: activeIndex}
    },
    /**
     * 时间插件 选好时间后
     */
    chooseTime (start, end) {
      this.showDialog = false
      this.resetLockTime(start, end)
    },
    /**
     * 选择时间插件 选完时间后 重新设置锁屏时间 并标背景
     * @param timeRange -》 09:10-10:39
     * 已修改后的时间范围为主
     */
    resetLockTime (start, end) {
      this.lockTimeList.splice(this.activeLockTime.index, 1)
      let newTimeObj = this.timeToNub(start + '-' + end)
      let newStartM = newTimeObj.start.m // 新开始时间的 分钟
      let newEndM = newTimeObj.end.m // 新结束时间的 分钟
      let newStart = this.dateForTime(start) // 时间戳
      let newEnd = this.dateForTime(end) // 时间戳
      for (let i = 0; i < this.lockTimeList.length; i++) {
        let item = this.lockTimeList[i]
        let list = item.split('-')
        let itemTimeObj = this.timeToNub(item)
        let itemStartM = itemTimeObj.start.m // 原有开始时间的 分钟
        let itemEndM = itemTimeObj.end.m // 原有结束始时间的 分钟
        let itemStart = this.dateForTime(list[0]) // 时间戳
        let itemEnd = this.dateForTime(list[1]) // 时间戳
        if (itemStart >= newStart && itemStart < newEnd && itemEnd <= newEnd) {
          this.lockTimeList.splice(i, 1)
          i--
        } else if (newStart >= itemStart && newStart <= itemEnd) {
          if (newEnd >= itemEnd) {
            newStart = itemStart
            this.lockTimeList.splice(i, 1)
            i--
          } else if (newEnd < itemEnd) {
            newStart = itemStart
            newEnd = itemEnd
            this.lockTimeList.splice(i, 1)
            i--
          }
        } else if (newEnd >= itemStart && newEnd <= itemEnd) {
          if (newStart <= itemStart) {
            newEnd = itemEnd
            this.lockTimeList.splice(i, 1)
            i--
          } else if (newStart > itemStart) {
            newStart = itemStart
            newEnd = itemEnd
            this.lockTimeList.splice(i, 1)
            i--
          }
        }
      }
      // 最后添加新的时间范围
      this.lockTimeList.push(this.formatTime(newStart) + '-' + this.formatTime(newEnd))
      this.lockTimeList = this.timeRangeSort(this.lockTimeList)
      // 设置背景色
      this.setFlagsVal(this.lockTimeList)
      console.log(this.lockTimeList)
    },
    /**
     * 设置 hList  中的 flags 值，加背景色
     */
    setFlagsVal (arr) {
      this.hList.forEach((item, index) => {
        let itemH = Number(item.hour)
        item.flags = []
        let bgStart = '', bgEnd = ''
        arr.forEach(lockTime => {
          let {start: {h: lockStartH, m: lockStartM}, end: {h: lockEndH, m: lockEndM}} = this.timeToNub(lockTime)
          if (lockStartH < itemH && itemH < lockEndH) {
            bgStart = 0
            bgEnd = 60
          } else if (lockStartH === lockEndH && itemH === lockEndH) {
            bgStart = lockStartM
            bgEnd = lockEndM
          } else if (itemH === lockStartH) {
            bgStart = lockStartM
            bgEnd = 60
          } else if (itemH === lockEndH && lockEndM !== 0) {
            bgStart = 0
            bgEnd = lockEndM
          }
        })
        if (bgStart === 0 || bgEnd === 0 || bgStart || bgEnd) {
          item.flags.push(this.calcLeftAndWidth(bgStart, bgEnd))
        }
      })
    },
    calcLeftAndWidth (start, end) {
      let left = ((start / 60) * 100) + '%'
      let width = ((end - start) / 60) * 100 + '%'
      return {left, width}
    },
    /**
     * 日期转时间戳
     * 2020-08-08  这个时间可以随意哪年那月都可以，只要统一就可以
     */
    dateForTime (time) {
      return new Date('2020-08-08/' + time).getTime()
    },
    /**
     * format 日期
     * @type {Date}
     */
    formatTime (date) {
      let data = new Date(date)
      let h = data.getHours()
      if (h < 10) {
        h = '0' + h
      }
      let m = data.getMinutes()
      if (m < 10) {
        m = '0' + m
      }
      return h + ':' + m
    }
  }
}
</script>

<style scoped lang="less">
  .time-choose-container {
    display: flex;
    height:3.25rem;
    .left-div {
      width: 3.8rem;
      line-height: 0.8rem;
      text-align: center;
      border-right: 0.01rem solid #dcdcdc;
    }
    .right-div {
      display: flex;
      flex-wrap:wrap;
      span{
        display: inline-block;
        height:0.8rem;
        width: 0.93rem;
        text-align: center;
        line-height: 0.8rem;
        background: #6e98ef;
        color: #fff;
        border-right: 0.01rem solid #dcdcdc;
        border-bottom: 0.01rem solid #dcdcdc;
        position: relative;
        .text-b {
          position: relative;
          z-index: 100;
        }
      }
    }
  }
  .time-box {
    background: #fff;
    line-height: 0.43rem;
    padding: 0 0.16rem 0.1rem;
    overflow: hidden;
    & > p {
      font-size: 0.22rem;
      line-height: 0.68rem;
      float: left;
    }
    & > div {
      width: 80%;
      float: right;
      span {
        display: inline-block;
        padding: 0.15rem;
        margin-right: 0.12rem;
        line-height: 0.3rem;
        margin-top: 0.12rem;
      }
    }
    .free-time span {
      color: #a3a3a3;
    }
    .lock-time span {
      background: #e4eaff;
      color: #4768f3;
    }
  }
  .active-bg {
    background: #f68c98!important;
    display: inline-block;
    position: absolute;
    height: 0.8rem;
    left:0;
    width: 0;
    z-index: 1;
  }
  .dialog-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0, .6);
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
