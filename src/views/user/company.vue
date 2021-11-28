<template>
  <div class="app-container">
    <el-card class="box-card">
      <el-container>
        <div v-if="checkPermission([SUPER_ADMIN, COMPANY_ADMIN])">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="标志" prop="logo" required>
              <AvatarUpload :avatar.sync="form.logo" />
            </el-form-item>
            <el-form-item label="名称" prop="name" required>
              <el-input v-model="form.name" />
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="法人" prop="legalPerson">
                  <el-input v-model="form.legalPerson" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人" prop="contactPerson">
                  <el-input v-model="form.contactPerson" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="contactPhone">
                  <el-input v-model="form.contactPhone" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系地址" prop="contactAddress">
                  <el-input v-model="form.contactAddress" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="成立日期" prop="foundDate">
                  <el-date-picker v-model="form.foundDate" type="date" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="官方网站" prop="officialWebsite">
                  <el-input v-model="form.officialWebsite" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="注册号码" prop="registerNumber">
                  <el-input v-model="form.registerNumber" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="注册资本" prop="registerCapital">
                  <el-input v-model="form.registerCapital" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="营业范围" prop="businessScope">
              <el-input v-model="form.businessScope" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicense">
              <ImageUpload :image.sync="form.businessLicense" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm">提交</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else>
          <el-form label-width="100px">
            <el-form-item label="图片"><el-image v-if="form.logo" :src="form.logo" :preview-src-list="[form.logo]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
            <el-form-item label="名称"><span>{{ form.name }}</span></el-form-item>
            <el-form-item label="法人"><span>{{ form.legalPerson }}</span></el-form-item>
            <el-form-item label="联系人"><span>{{ form.contactPerson }}</span></el-form-item>
            <el-form-item label="联系电话"><span>{{ form.contactPhone }}</span></el-form-item>
            <el-form-item label="联系地址"><span>{{ form.contactAddress }}</span></el-form-item>
            <el-form-item label="成立日期"><span>{{ form.foundDate }}</span></el-form-item>
            <el-form-item label="官方网站"><span>{{ form.officialWebsite }}</span></el-form-item>
            <el-form-item label="注册号码"><span>{{ form.registerNumber }}</span></el-form-item>
            <el-form-item label="注册资本"><span>{{ form.registerCapital }}</span></el-form-item>
            <el-form-item label="营业范围"><span>{{ form.businessScope }}</span></el-form-item>
            <el-form-item label="营业执照"><el-image v-if="form.businessLicense" :src="form.businessLicense" :preview-src-list="[form.businessLicense]" style="width: 100px; height: 100px" fit="contain" /></el-form-item>
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
        logo: undefined,
        name: undefined,
        legalPerson: undefined,
        contactPerson: undefined,
        contactPhone: undefined,
        contactAddress: undefined,
        foundDate: undefined,
        officialWebsite: undefined,
        registerNumber: undefined,
        registerCapital: undefined,
        businessScope: undefined,
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
