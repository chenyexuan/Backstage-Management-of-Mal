import axios from '@/utils/myaxios'
export const getLeftMenu = () => {
  return axios({
    url: 'menus'
  })
}
export const getAllRightList = type => {
  return axios({
    url: `rights/${type}`
  })
}
