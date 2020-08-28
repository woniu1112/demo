<template>
  <div class="week-nav">
    <div class="week-list">
      <span class="tab-item" v-for="item in weekTabList" @click="tabClick(item)">
        {{item.name}}
        <b v-if="item.showBEl"></b>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "week-nav",
  data () {
    return {
      weekTabList: [
        {
          value:'sun',
          name:'日',
          showBEl: false // b 标签（倒三角）是否显示
        },{
          value:'mon',
          name:'一',
          showBEl: false
        },{
          value:'tues',
          name:'二',
          showBEl: false
        },{
          value:'wed',
          name:'三',
          showBEl: false
        },{
          value:'thurs',
          name:'四',
          showBEl: false
        },{
          value:'fri',
          name:'五',
          showBEl: false
        },{
          value:'sat',
          name:'六',
          showBEl: false
        }
      ] // 星期 tab list
    }
  },
  mounted () {
    this.weekTabList[0].showBEl = true // 默认第一个显示
    this.$emit('tabChange', this.weekTabList[0])
  },
  methods: {
    tabClick (item) {
      this.$emit('tabChange', item)
    }
  }
}
</script>

<style scoped lang="less">
.week-list {
  height: 0.77rem;
  background: #4768f3;
  .tab-item {
    display: inline-block;
    color: #fff;
    font-size: 0.32rem;
    line-height: 0.77rem;
    width: 14%;
    text-align: center;
    position: relative;
    b {
      position: absolute;
      top:0.41rem;
      left:0.29rem;
      width: 0;
      height: 0;
      border-width: 0.18rem;
      border-style: solid;
      border-color:  transparent transparent #fff transparent;
    }
  }
}
</style>
