<template>
  <div class="app-container">
    <el-card class="box-card">
      <h1 style="text-align: center;">注册企业</h1>
      <el-steps :active="step" align-center>
        <el-step title="步骤 1" description="企业信息" icon="el-icon-edit" />
        <el-step title="步骤 2" description="管理员信息" icon="el-icon-upload" />
        <el-step title="步骤 3" description="完成" icon="el-icon-picture" />
      </el-steps>
      <el-container>
        <div v-if="step === 1" style="width: 800px; margin:0 auto; padding-top: 50px;">
          <el-form ref="companyForm" :model="companyForm" :rules="companyRules" label-width="100px">
            <el-form-item label="标志" prop="logo">
              <AvatarUpload :avatar.sync="companyForm.logo" />
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input v-model="companyForm.name" />
            </el-form-item>
            <el-row>
              <el-col :span="12">
                <el-form-item label="法人" prop="legalPerson">
                  <el-input v-model="companyForm.legalPerson" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系人" prop="contactPerson">
                  <el-input v-model="companyForm.contactPerson" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="contactPhone">
                  <el-input v-model="companyForm.contactPhone" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系地址" prop="contactAddress">
                  <el-input v-model="companyForm.contactAddress" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="成立日期" prop="foundDate">
                  <el-date-picker v-model="companyForm.foundDate" type="date" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="官方网站" prop="officialWebsite">
                  <el-input v-model="companyForm.officialWebsite" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="注册号码" prop="registerNumber">
                  <el-input v-model="companyForm.registerNumber" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="注册资本" prop="registerCapital">
                  <el-input v-model="companyForm.registerCapital" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="营业范围" prop="businessScope">
              <el-input v-model="companyForm.businessScope" />
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicense">
              <ImageUpload :image.sync="companyForm.businessLicense" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleNext">下一步</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="step === 2" style="width: 500px; margin:0 auto; padding-top: 50px;">
          <el-form ref="userForm" :model="userForm" :rules="userRules" label-width="100px">
            <el-form-item label="账号" prop="username">
              <el-input v-model="userForm.username" autocomplete="off" />
            </el-form-item>
            <el-form-item label="手机" prop="phone">
              <el-input v-model="userForm.phone" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="userForm.email" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handlePrev">上一步</el-button>
              <el-button type="primary" @click="handleNext">完成</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="step === 3" style="width: 500px; margin:0 auto; padding-top: 50px;">
          <el-result icon="success" title="成功" sub-title="请耐心等待管理员审核！！！">
            <template slot="extra">
              <el-button type="primary" @click="back">回到首页</el-button>
            </template>
          </el-result>
        </div>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import { register } from '@/api/service-admin/company'

export default {
  data() {
    return {
      step: 1,
      companyForm: {
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
      },
      companyRules: {
        logo: [{ required: true, message: '请上传标志', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      userForm: {
        username: undefined,
        phone: undefined,
        email: undefined
      },
      userRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
      }
    }
  },
  mounted() {
  },
  methods: {
    handleNext() {
      if (this.step === 1) {
        this.$refs.companyForm.validate((valid) => {
          if (valid) {
            this.step += 1
          } else {
            return false
          }
        })
      } else if (this.step === 2) {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            this.handleSubmit()
          } else {
            return false
          }
        })
      }
    },
    handlePrev() {
      if (this.step === 1) this.$refs.companyForm.clearValidate()
      if (this.step === 2) this.$refs.userForm.clearValidate()
      this.step -= 1
    },
    resetForm() {
      if (this.step === 1) this.$refs.companyForm.resetFields()
      if (this.step === 2) this.$refs.userForm.resetFields()
    },
    handleSubmit() {
      register(this.companyForm, this.userForm).then(() => {
        this.step += 1
      })
    },
    back() {
      this.$router.push('/')
    }
  }
}
</script>
