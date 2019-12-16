
const roles = {
  '1': {
    dashboard: [
      // { name: 'Welcome', styles: {} },
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} }
    ]
  },
  '2': {
    dashboard: [
      // { name: 'Welcome', styles: {} },
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} }
    ]
  },
  '3': {
    dashboard: []
  },
  '4': {
    dashboard: [
      // { name: 'Welcome', styles: {} },
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'Amount', styles: {} }
    ]
  },
  '5': {
    dashboard: [
      // { name: 'Welcome', styles: {} },
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'Amount', styles: {} },
      // { name: 'EnterPrise', styles: {} }
    ]
  },
  '6': {
    dashboard: [
      { name: 'Monitor', styles: {} },
      { name: 'Risk', styles: {} },
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'RiskRatio', styles: {} }
    ]
  },
  '7': {
    dashboard: [
      { name: 'Monitor', styles: {} },
      { name: 'Risk', styles: {} },
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'RiskRatio', styles: {} }
    ]
  },
  '8': {
    dashboard: [
      { name: 'Monitor', styles: {} },
      { name: 'Risk', styles: {} },
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'RiskRatio', styles: {} }
    ]
  },
  '9': {
    dashboard: []
  },
  '10': {
    dashboard: [
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'RiskRatio', styles: {} },
      { name: 'Risk', styles: {} },
      { name: 'Amount', styles: {} },
      // { name: 'EnterPrise', styles: {} }
    ]
  },
  '11': {
    dashboard: [
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'RiskRatio', styles: {} },
      { name: 'Risk', styles: {} },
      { name: 'Amount', styles: {} },
      // { name: 'EnterPrise', styles: {} }
    ]
  },
  '12': {
    dashboard: [
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'RiskRatio', styles: {} },
      { name: 'Risk', styles: {} },
      { name: 'Amount', styles: {} },
      // { name: 'EnterPrise', styles: {} }
    ]
  },
  '13': {
    dashboard: []
  },
  '14': {
    dashboard: [
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'RiskRatio', styles: {} },
      { name: 'Risk', styles: {} },
      { name: 'Amount', styles: {} },
      // { name: 'EnterPrise', styles: {} }
    ]
  },
  '15': {
    dashboard: [
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'RiskRatio', styles: {} },
      { name: 'Risk', styles: {} },
      { name: 'Amount', styles: {} },
    ]
  },
  '16': {
    dashboard: [
      // { name: 'EnterPrise', styles: {} },
      // { name: 'Applys', styles: {} },
      // { name: 'Todo', styles: {} },
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'RiskRatio', styles: {} }
    ]
  },
  '-1': {
    dashboard: [
      // { name: 'Welcome', styles: {} },
      { name: 'CompanyHeader', styles: {} },
      { name: 'Finance', styles: {} },
      { name: 'Bill', styles: {} },
      { name: 'TotalProfit', styles: { height: 486 }, span: 8 },
      { name: 'RiskRatio', styles: { height: 486 }, span: 16 },
      { name: 'Risk', styles: {} }
    ]
  },
  '-2': {
    dashboard: [
      // { name: 'Welcome', styles: {} },
    ]
  }
}
//业务类型
const businessModes = [{ name: '委托采购', key: '0', abbr: 'buy' }, { name: '委托销售', key: '1', abbr: 'sale' },
{ name: '金融仓储', key: '2', abbr: 'storage' }, { name: '大企业委托采购', key: '4', abbr: 'largeBuy' }]

export { roles, businessModes }
//         entru (1, "委托方"),
//         core_enterprise(2, "核心企业"),
//         forwarding_company(3, "货代公司"),
//         counterman(4, "业务员"),
//         department_manager(5, "部门经理"),
//         risk_commissioner(6, "风控专员"),
//         business_risk (7, "业务风控"),
//         risk_manager (8, "风控负责人"),
//         data_steward(9, "数据专员"),
//         settlement_specialist(10, "结算专员"),
//         settlement_reviewer(11, "结算复核人"),
//         settlement_officer(12, "结算负责人"),
//         law_work(13, "法务"),
//         caucus_member(14, "决策委员会成员"),
//         capital(15, "资方"),
//         super_administrator(16, "超级管理员");
//         other(999, "其它用户模块");
