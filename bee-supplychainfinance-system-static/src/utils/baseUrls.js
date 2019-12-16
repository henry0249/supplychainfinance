const env = process.env.API
// const env = 'pro'
const bee = {
  //后台请求地址域名
  domain:
    env === 'dev'
      ? 'http://192.168.3.179'
      : env === 'scft'
      ? 'https://scft.beesrv.com'
      : env === 'test'
      ? 'http://182.139.182.247:9155'
      : env === 'qa'
      ? 'http://192.168.3.181:9155'
      : env === 'qa1'
      ? 'http://192.168.3.205:9155'
      : 'https://scf.beesrv.com',

  //平台地址请求
  beesrvUrls:
    env === 'dev'
      ? 'http://192.168.3.199:81'
      : env === 'scft'
      ? 'https://www.beesrv.com/'
      : env === 'test'
      ? 'http://182.139.182.247:9152'
      : env === 'qa'
      ? 'http://192.168.3.181:9152'
      : env === 'qa1'
      ? 'http://192.168.3.205:9152'
      : 'https://www.beesrv.com',
  url: {
    news: () => '/news', //新闻首页
    newsDetail: id => `/news/details?id=${id}`, //新闻详情
    purchase: () => '/supplyChain/purchase', //委托采购
    sell: () => '/supplyChain/sell', //委托销售
    financial: () => '/supplyChain/storage', //金融仓储
    supply: () => '/supplyChain', //供应链服务
    warkIn: () => '/warkIn', //委托采购
    erp: () => '/selectCom/per', //erp
    oa: () => '/selectCom/per', //erp
    personalCenter: () => '/personal', //个人中心
    logUrl: () =>
      `https://tms.beesrv.com/rest/login/getUserInfo?username=${sessionStorage.getItem(
        'userCode'
      )}&password=${localStorage.getItem('sysToken')}` //物流系统跳转地址
  },
  api: {
    getNews: (type = 1, size = 9, page = 1) =>
      `/bee-web/api/user/news/category?size=${size}&page=${page}&type=${type}` //获取新闻
  }
}

export default bee
