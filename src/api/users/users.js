import axios from '@/utils/myaxios'
export const getAllUserList = params => {
  return axios({
    url: 'users',
    params
  })
}
export const addUser = data => {
  return axios({
    url: 'users',
    data,
    method: 'post'
  })
}
