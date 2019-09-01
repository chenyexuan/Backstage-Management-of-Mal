import axios from '@/utils/myaxios'
export const getLeftMenu = () => {
  return axios({
    url: 'menus'
  })
}
