import axios from '@/utils/myaxios'
export const getAllRolesList = () => {
  return axios({
    url: 'roles'
  })
}
