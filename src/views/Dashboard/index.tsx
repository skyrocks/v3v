import { defineComponent, ref } from 'vue';
import { authApi } from '@/api/modules/auth'
import { userApi } from '@/api/modules/user'
import { localStore } from '@/utils/storage/localStorage'

export default defineComponent({
  setup() {

    const users = ref('aa')
    const loginResponse = ref('222')

    const getUser = () => {
      userApi.getUser({}).then((response) => {
        users.value = JSON.stringify(response.data)
      })
    }
    
    const login = () => {      
      authApi.login({loginName: 'devtest', password: '1'}).then((response) => {
        console.log(response)        
        loginResponse.value = response.data
        localStore.set('token', loginResponse.value)
      })
    }

    return() => (
      <div>
        <el-row>
          <el-button type="primary" onClick={ login }>登录</el-button>
          <el-button type="success" onClick={ getUser }>获取用户数据</el-button>
        </el-row>
        <p>{ loginResponse.value }</p>
        <p>{ users.value }</p>
      </div>
    )
  }  
})