import Abstract from '../abstract'

type LoginPwdType = {
  loginName: string
  pwd: string
  captcha: string
  captchaId: string
}
type LoginSmsType = {
  cellphone: string
  code: string
  is: string
}
class Auth extends Abstract {
  login(data: LoginPwdType) {
    return this.post({ url: '/auth/login', data })
  }
  profile() {
    return this.get({ url: 'auth/profile' })
  }
  sendSmsCode(id: string, cellphone: string) {
    return this.post({ url: '/auth/sms/code', data: { id, cellphone } })
  }
  loginSms(data: LoginSmsType) {
    return this.post({ url: '/auth/sms/login', data })
  }
}

// 单列模式返回对象
let instance
const authApi = (() => {
  if (instance) return instance
  instance = new Auth()
  return instance
})()

export { authApi }
