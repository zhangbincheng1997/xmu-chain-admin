<template>
  <div class="app-container">
    <el-card>
      <el-container>
        <div v-if="checkPermission([SUPER_ADMIN, COMPANY_ADMIN])">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="企业名称" prop="name" required>
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="统一社会信用代码" prop="uscc" required>
              <el-input v-model="form.uscc" />
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="法人姓名" prop="legalPerson">
                  <el-input v-model="form.legalPerson" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="法人身份证号" prop="legalId">
                  <el-input v-model="form.legalId" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="联系方式" prop="contactInfo">
              <el-input v-model="form.contactInfo" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicense">
              <UploadImage :image.sync="form.businessLicense" :height="200" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <el-form label-width="100px">
            <el-form-item label="企业名称"><span>{{ form.name }}</span></el-form-item>
            <el-form-item label="统一社会信用代码"><span>{{ form.uscc }}</span></el-form-item>
            <el-form-item label="法人姓名"><span>{{ form.legalPerson }}</span></el-form-item>
            <el-form-item label="法人身份证号"><span>{{ form.legalId }}</span></el-form-item>
            <el-form-item label="联系方式"><span>{{ form.contactInfo }}</span></el-form-item>
            <el-form-item label="营业执照"><image-preview :image="form.businessLicense" :height="200" /></el-form-item>
          </el-form>
        </div>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { getCompanyInfo, updateCompanyInfo } from '@/api/service-admin/me'

export default {
  data() {
    return {
      form: {
        name: undefined,
        uscc: undefined,
        legalPerson: undefined,
        legalId: undefined,
        contactInfo: undefined,
        businessLicense: undefined
      }
    }
  },
  mounted() {
    getCompanyInfo().then(res => {
      this.form = res.data
    })
  },
  methods: {
    submitForm() {
      updateCompanyInfo(this.form).then(() => {})
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
