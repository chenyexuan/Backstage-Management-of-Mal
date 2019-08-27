import axios from '../utils/myaxios'
export const login = data => {
  return axios({
    url: 'login',
    method: 'post',
    data
  })
}
