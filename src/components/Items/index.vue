<template>
  <div>
    <el-table :data="content">
      <el-table-column label="标题" prop="title" width="200">
        <template slot-scope="scope">
          <el-input v-model="scope.row.title" />
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" width="200">
        <template slot-scope="scope">
          <el-select v-model="scope.row.type" clearable>
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="内容" prop="value">
        <template slot-scope="scope">
          <el-input v-if="scope.row.type==='text'" v-model="scope.row.value" />
          <UploadImage v-if="scope.row.type==='image'" :image.sync="scope.row.value" :width="200" />
          <UploadVideo v-if="scope.row.type==='video'" :video.sync="scope.row.value" />
          <UploadAudio v-if="scope.row.type==='audio'" :audio.sync="scope.row.value" />
          <UploadFile v-if="scope.row.type==='file'" :file.sync="scope.row.value" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" @click="delContent(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center">
      <el-button type="text" @click="addContent">添加一行</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Items',
  props: {
    content: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      typeOptions: [
        { label: '文本', value: 'text' },
        { label: '图片', value: 'image' },
        { label: '视频', value: 'video' },
        { label: '音频', value: 'audio' },
        { label: '文件', value: 'file' }
      ]
    }
  },
  methods: {
    // ----- 添加一行 -----
    addContent() {
      this.content.push({})
      this.$emit('update:content', this.content) // 子组件向父组件传值
      this.$forceUpdate()
      console.log('add: ' + JSON.stringify(this.content))
    },
    // ----- 删除一行 -----
    delContent(index) {
      this.content.splice(index, 1)
      this.$emit('update:content', this.content) // 子组件向父组件传值
      console.log('del: ' + JSON.stringify(this.content))
    }
  }
}
</script>
