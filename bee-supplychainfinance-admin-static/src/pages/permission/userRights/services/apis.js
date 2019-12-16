export default {
  getArticles: {
    //获取公告列表 type 0集团发文 1规章制度 2内部资讯 3督查通报
    api: ({ type = 0, size = 14, page = 1 }) =>
      `/api/articles?pageSize=${size}&currentPage=${page}&type=${type}`,
    type: 'GET'
  },
  getArticle: {
    //获取公告详情
    api: id => `/api/articles/getArticleById?id=${id}`,
    type: 'GET'
  },
  getArticleTypes: {
    //获取公告类型列表
    api: id => `/api/articles/getArticleTypes`,
    type: 'GET'
  },
  checkTypeUnique: {
    //检测类型唯一性
    api: param => `/articlesType/checkTypeUnique?${param}`,
    type: 'GET'
  },
  editArticleType: {
    //编辑公告类型
    api: param => `/api/articles/editArticleType?${param}`,
    type: 'POST'
  },
  deleteArticleType: {
    //删除公告类型
    api: id => `/api/articles/deleteArticleType?id=${id}`,
    type: 'POST'
  },
  getAllArticlesType: {
    //查询所有公告类型
    api: id => `/articlesType/getAllArticlesType`,
    type: 'GET'
  },
  deleteArticle: {
    //删除公告
    api: id => `/api/articles/deleteArticle?id=${id}`,
    type: 'POST'
  },
  editArticle: {
    //添加。修改公告
    api: id => `/api/articles/editArticle`,
    type: 'POST'
  },
  //按条件查询公告
  getArticlesByCondition: {
    api: id => `/api/articles/getArticlesByCondition`,
    type: 'POST'
  }
}
