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
export const getUserById = id => {
  return axios({
    url: `users/${id}`
  })
}
export const editUser = data => {
  return axios({
    url: `users/${data.id}`,
    method: 'put',
    data
  })
}
export const deleteUserById = id => {
  return axios({
    url: `users/${id}`,
    method: 'delete'
  })
}
