export default {
  //获取包含个数的大类
  getTypes: {
    api: () => '/supplychainfinance-data-entry/subjectMatterInfo/getBigTypeInfo',
    type: 'GET'
  },
  //获取所有大类
  getAllTypes: {
    api: () => '/supplychainfinance-data-entry/subjectMatterInfo/getBigTypeList',
    type: 'GET'
  },
  getUnit: {
    api: () => '/supplychainfinance-data-entry/subjectMatterInfo/getPriceUnitList',
    type: 'GET'
  },
  getIndex: {
    api: () => '/supplychainfinance-data-entry/subjectMatterInfo/getIndexList',
    type: 'GET'
  },
  getList: {
    api: (typeName) => `/supplychainfinance-data-entry/subjectMatterInfo/getSubjectMatterList?typeName=${typeName}`,
    type: 'GET'
  },
  //获取编辑价格筛选项目
  getSearch: {
    api: (typeName) => `/supplychainfinance-data-entry/subjectMatterInfo/getPriceCondition?typeName=${typeName}`,
    type: 'GET'
  },
  //获取规格、能源筛选项
  getSubjectMatterAttribute: {
    api: ({ typeName, attributeType }) => `/supplychainfinance-data-entry/subjectMatterInfo/getSubjectMatterAttribute?attributeType=${attributeType}&typeName=${typeName}`,
    type: 'GET'
  },
  //获取价格列表
  getPriceDatas: {
    api: (sid) => `/supplychainfinance-data-entry/subjectMatterInfo/getPriceList?sid=${sid}`,
    type: 'GET'
  },
  //保存价格编辑
  savePriceInfo: {
    api: () => '/supplychainfinance-data-entry/subjectMatterInfo/savePriceInfo',
    type: 'POST'
  },
  //根据名字获取标的物详细信息
  getInfoByTast: {
    api: (tast) => `/supplychainfinance-data-entry/subjectMatterInfo/getSubjectMatterInfo?tast=${tast}`,
    type: 'GET'
  },
  //保存属性
  saveAttributes: {
    api: () => '/supplychainfinance-data-entry/subjectMatterInfo/saveSubjectMatterInfo',
    type: 'POST'
  },
  getSpecificationList: {
    api: ({ tast, sourceAddress }) => `/supplychainfinance-data-entry/subjectMatterInfo/getSpecificationList?tast=${tast}&sourceAddress=${sourceAddress}`,
    type: 'GET'
  },
  saveSpecificationInfo: {
    api: () => '/supplychainfinance-data-entry/subjectMatterInfo/saveSpecificationInfo',
    type: 'POST'
  },
  getSourceAddressList: {
    api: ({ tast, specification }) => `/supplychainfinance-data-entry/subjectMatterInfo/getSourceAddressList?tast=${tast}&specification=${specification}`,
    type: 'GET'
  },
  saveSourceAddressInfo: {
    api: () => '/supplychainfinance-data-entry/subjectMatterInfo/saveSourceAddressInfo',
    type: 'POST'
  },
  deleteInfo: {
    api: () => '/supplychainfinance-data-entry/subjectMatterInfo/delSubjectMatterInfo',
    type: 'POST'
  }
}