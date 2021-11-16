<template>
  <div class="app-container">
    <el-card class="box-card">
      <div style="text-align: center;">
        <el-input v-model="code" placeholder="溯源码" style="width: 300px;" clearable />
        <el-input v-model="securityCode" placeholder="防伪码" style="width: 200px;" clearable>
          <el-button slot="append" icon="el-icon-search" @click="check" />
        </el-input>
      </div>
      <div v-if="isOk === true">
        <el-divider>查询结果</el-divider>
        <div v-if="list.length === 0">
          <el-result icon="success" title="校验成功" sub-title="防伪码正确！并且是首次查询！" />
        </div>
        <div v-else>
          <el-result icon="warning" title="校验成功" sub-title="防伪码正确！但不是首次查询！" />
          <el-table :data="list">
            <el-table-column label="#" prop="id" align="center" fixed="left" />
            <el-table-column label="标签编号" prop="tagId" width="100" align="center" fixed="left">
              <template slot-scope="scope">
                <span class="link" @click="linkTag(scope.row.tagId)">{{ scope.row.tagId }}</span>
              </template>
            </el-table-column>
            <el-table-column label="用户" prop="username" align="center" />
            <el-table-column label="IP" prop="ip" align="center" />
            <el-table-column label="地点" prop="location" align="center" />
            <el-table-column label="经度" prop="longitude" align="center" />
            <el-table-column label="纬度" prop="latitude" align="center" />
            <el-table-column label="创建时间" prop="createTime" align="center" />
          </el-table>
        </div>
      </div>
      <div v-if="isOk === false">
        <el-divider>查询结果</el-divider>
        <el-result icon="error" title="校验错误" sub-title="防伪码错误！" />
      </div>
    </el-card>
  </div>
</template>

<script>
import router from '@/router'
import tag from '@/api/tag'

export default {
  data() {
    return {
      loading: false,
      code: undefined,
      securityCode: undefined,
      isOk: undefined,
      list: []
    }
  },
  methods: {
    check() {
      this.isOk = undefined
      if (!this.code) return
      if (!this.securityCode) return
      tag.check(this.code, this.securityCode).then(res => {
        this.isOk = res.data.ok
        this.list = res.data.search
      })
    },
    linkTag: function(val) {
      router.push({
        path: '/tag/index',
        query: {
          id: val
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.link {
  color: #0db1c1;
  cursor: pointer;
}
</style>
