import axios from '@/utils/myaxios'
export const getAllRolesList = () => {
  return axios({
    url: 'roles'
  })
}
export const deleteRightById = (roleId, rightId) => {
  return axios({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}
export const addRole = data => {
  return axios({
    url: 'roles',
    method: 'post',
    data
  })
}
export const editRole = data => {
  return axios({
    url: `roles/${data.id}`,
    method: 'put',
    data
  })
}
export const deleteRoleById = id => {
  return axios({
    url: `roles/${id}`,
    method: 'delete'
  })
}
