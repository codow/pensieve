<template>
  <div class="fr-page__container">
    <div class="fr-page__header"
         style="background-color: #662211;">
      我是头部
    </div>
    <div class="fr-page__main">
      <div class="fr-page__aside"
           style="background-color: #226611;">
        我是边框
      </div>
      <div class="fr-page__main"
           style="background-color: #221166; overflow: auto;">
        <div>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <el-table ref="table"
                    :data="tableData"
                    style="width: 100%"
                    border>
            <el-table-column fixed
                             prop="date"
                             label="日期"
                             width="150">
            </el-table-column>
            <el-table-column prop="name"
                             label="姓名"
                             width="120">
            </el-table-column>
            <el-table-column prop="province"
                             label="省份"
                             width="120">
            </el-table-column>
            <el-table-column prop="city"
                             label="市区"
                             width="120">
            </el-table-column>
            <el-table-column prop="address"
                             label="地址"
                             width="1300">
            </el-table-column>
            <el-table-column prop="zip"
                             label="邮编"
                             width="120"
                             fixed="right">
            </el-table-column>
          </el-table>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
          <p>测测测测</p>
        </div>
        <div class="fr-copyright">
          我是版权信息
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.fr-page__container {
  height: 100%;
}
.fr-page__header {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 48px;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
}

.fr-page__main {
  overflow: auto;
}

.fr-page__container > .fr-page__main {
  height: calc(100% - 50px);
  padding-top: 50px;
}

.fr-page__header + .fr-page__main {
  padding-top: 50px;
}

.fr-page__aside {
  width: 280px;
  padding: 0 10px;
  float: left;
}

.fr-page__main > .fr-page__aside {
  height: 100%;
}

.fr-page__main > .fr-page__main {
  height: 100%;
}

.fr-page__aside + .fr-page__main {
  margin-left: 300px;
  width: auto;
}

.fr-copyright {
  width: 100%;
  height: 40px;
  line-height: 20px;
  padding: 10px 0;
  text-align: center;
}
</style>

<script>
import TableData from '@/assets/data/table_data.js'

export default {
  name: 'home',
  data () {
    return {
      tableData: TableData,
      scrollContainer: null,
      tableEl: null
    }
  },
  mounted () {
    const { table } = this.$refs
    const tableEl = table.$el
    this.tableEl = tableEl
    // 获取最近的滚动父容器
    let parent = tableEl
    window.tableEl = tableEl
    do {
      parent = parent.parentElement
      if (parent.style.overflow === 'auto' || parent.style.overflow === 'scroll' || parent.style.overflowY === 'auto' || parent.style.overflowY === 'scroll') {
        break
      }
    } while (parent.nodeName !== 'BODY')

    if (parent) {
      this.scrollContainer = parent
      window.test = this.scrollContainer
      this.scrollContainer.addEventListener('scroll', this.containerScrollListener)
    }
  },
  destroyed () {
    if (this.scrollContainer) {
      this.scrollContainer.removeEventListener('scroll', this.containerScrollListener)
    }
  },
  methods: {
    containerScrollListener (e) {
      // 计算当前定位
      let scrollTop = this.scrollContainer.scrollTop
      let contanierOffsetTop = this.scrollContainer.offsetTop
      let tableHeader = this.tableEl.querySelector('.el-table__header-wrapper')
      let tableTop = this.tableEl.offsetTop
      let tableHeight = this.tableEl.offsetHeight

      // 固定高度
      let tableFixedHeaderList = this.tableEl.querySelectorAll('.el-table__fixed-header-wrapper')

      // 判断是否被滚动了
      if (scrollTop > tableTop && scrollTop < tableTop + tableHeight - 100) {
        tableHeader.style.position = 'relative'
        tableHeader.style['z-index'] = 1
        let top = scrollTop - tableTop - 1 + contanierOffsetTop + 'px'
        tableHeader.style.top = top
        tableFixedHeaderList.forEach(item => {
          item.style.top = top
          item.style['z-index'] = 4
        })
      } else {
        let top = '0px'
        tableHeader.style.top = top
        tableFixedHeaderList.forEach(item => {
          item.style.top = top
        })
      }
    }
  }
}
</script>