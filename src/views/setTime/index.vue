<template>
  <div class="set-time">
    <div class="tab-container">
      <weekNav @tabChange="tabChange"></weekNav>
    </div>
    <div class="main-content">
      <div class="reminder-div">
        <p>周{{activeTab.name}}自由时间</p>
        <div>
          <span>自由时间</span>
          <span>锁屏时间</span>
        </div>
      </div>
      <mainContent></mainContent>
    </div>
    <div class="save-btn">保存</div>
  </div>
</template>

<script>
const weekNav = resolve => require(['./components/weekNav.vue'], resolve)
const mainContent = resolve => require(['./components/mainContent.vue'], resolve)
export default {
  name: "index",
  components: {
    weekNav,
    mainContent
  },
  data () {
    return {
      activeTab: {} // 当前在周几
    }
  },
  methods: {
    /**
     * 星期 切换
     * @param activeTab -> 当前选择的周几
     */
    tabChange (activeTab) {
      this.activeTab = activeTab
    }
  }
}
</script>

<style scoped lang="less">
  .set-time {
    font-size: 0.3rem;
  }
  .reminder-div {
    height: 1rem;
    background: #fff;
    padding: 0 0.26rem;
    display: flex;
    justify-content: space-between;
    line-height: 1rem;
    & > div {
      span {
        color: #999;
        font-size: 0.27rem;
      }
      span::before {
        content: '';
        display: inline-block;
        width: .22rem;
        height: .22rem;
      }
      span:nth-of-type(1)::before {
        background: #6e98ef;
      }
      span:nth-of-type(2)::before {
        background: rgb(246, 140, 152);
        margin-left: 0.2rem;
      }
    }
  }
  .save-btn {
    height: 0.96rem;
    line-height: 0.96rem;
    text-align: center;
    margin: 0.44rem;
    border-radius: 0.1rem;
    background: #4768f3;
    font-size: 0.32rem;
    color: #fff;
  }
</style>
