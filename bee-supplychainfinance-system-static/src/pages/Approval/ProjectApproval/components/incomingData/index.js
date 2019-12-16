import React, { Component, Fragment } from 'react'
import { Card, Divider, Collapse, message, Row, Col } from 'antd'
import styles from './index.less'
import OtherInfo from '../OtherInfo'
import { connect } from 'dva'
import withRouter from 'umi/withRouter'

const example = {
  dailyConsume: '',
  deviceQuantity: '',
  deviceType: '',
  eiaComplete: '',
  latestSafety: '',
  obsoleteDeviceRate: '',
  operatingRate: '',
  outputConsume: '',
  productionCertificate: '',
  safetyEvaluationTime: '',
  sixMonFailRate: '',
  supplierDailyCapacity: '',
  workingNormal: ''
}
const exampleTwo = {
  corporeInventory: '',
  corporeRequirement: '',
  dailyCapacity: '',
  expectDeliveryTime: '',
  agreeDeliveryTime: ''
}
const exampleOne = {
  cooperativeInstitution: '',
  creditAmount: '',
  creditStartingDate: '',
  overdue: '',
  repaymentTerm: '',
  unclearedCreditAmount: ''
}
const paymentS = [
  '',
  '委托企业提交磅单化验单后付款',
  '购货提交磅单化验单后付款'
]
const payment = ['', '先款后货', '先货后款']

const Panel = Collapse.Panel
const typeIn = ['p', 's', 'w', '', 'L']
@withRouter
@connect(({ projectApproval }) => ({
  projectApproval
}))
export default class IncomingData extends Component {
  constructor() {
    super()
    this.state = {
      newData: {},
      getData: {},
      deliveryAddress: '',
      takeGoodsAddress: '',
      companyInfo: {},
      SBLX: []
    }
  }

  componentDidMount() {
    let type = typeIn[Number(sessionStorage.businessMode)]
    let applyId = this.props.location.query.id
    let deliveryAddress,
      takeGoodsAddress = ''
    switch (type) {
      case 'p':
        this.props.dispatch({
          type: 'projectApproval/setBuyDetailData',
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState(
                {
                  getData: data.entrustBuyDTO,
                  newData: data.entrustBuyDetailDTO
                },
                () => {
                  const { newData } = this.state
                  if (newData) {
                    deliveryAddress =
                      newData.deliveryProvince.district +
                      '-' +
                      newData.deliveryCity.district +
                      '-' +
                      newData.deliveryCounty.district
                    takeGoodsAddress =
                      newData.takeGoodsProvince.district +
                      '-' +
                      newData.takeGoodsCity.district +
                      '-' +
                      newData.takeGoodsCounty.district
                    this.setState({
                      deliveryAddress: deliveryAddress,
                      takeGoodsAddress: takeGoodsAddress,
                      companyInfo: newData.companyInfoBuyDTO
                    })
                  }
                }
              )
            } else {
              message.warning(msg)
            }
          }
        })

        break
      case 's':
        this.props.dispatch({
          type: 'projectApproval/setSaleDetailData',
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState(
                {
                  getData: data.entrustBuyDTO,
                  newData: data.entrustSaleDetailDTO
                },
                () => {
                  const { newData } = this.state
                  if (newData) {
                    this.setState({
                      companyInfo: newData.companyInfoSaleDTO
                    })
                  }
                }
              )
            } else {
              message.warning(msg)
            }
          }
        })
        break
      case 'w':
        this.props.dispatch({
          type: 'projectApproval/setStorageDetailData',
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState(
                {
                  getData: data.entrustBuyDTO,
                  newData: data.financeStorageDetailDTO
                },
                () => {
                  const { newData } = this.state
                  if (newData) {
                    this.setState({
                      companyInfo: newData.companyInfoStorageDTO
                    })
                  }
                }
              )
            } else {
              message.warning(msg)
            }
          }
        })
        break
      case 'L':
        this.props.dispatch({
          type: 'projectApproval/setLargeBuyDetailData',
          payload: applyId,
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState(
                {
                  getData: data.entrustBuyDTO,
                  newData: data.largeEntrustBuyDetailDTO
                },
                () => {
                  const { newData } = this.state
                  if (newData) {
                    deliveryAddress =
                      newData.deliveryProvince.district +
                      '-' +
                      newData.deliveryCity.district +
                      '-' +
                      newData.deliveryCounty.district
                    takeGoodsAddress =
                      newData.takeGoodsProvince.district +
                      '-' +
                      newData.takeGoodsCity.district +
                      '-' +
                      newData.takeGoodsCounty.district
                    this.setState({
                      deliveryAddress: deliveryAddress,
                      takeGoodsAddress: takeGoodsAddress,
                      companyInfo: newData.companyInfoLargeDTO
                    })
                  }
                }
              )
            } else {
              message.warning(msg)
            }
          }
        })
      default:
        break
    }
  }

  cardInfo = (type, num) => {
    const { newData } = this.state
    return (
      <Card
        title={
          <div style={{ fontWeight: 600 }}>
            {num === 1 ? '购货商财务信息' : '供货商财务信息'}
          </div>
        }
        bordered={false}
        style={{ marginTop: 20 }}
      >
        <Collapse
          defaultActiveKey={
            newData[type] &&
            newData[type].map((item, index) => {
              return String(index)
            })
          }
        >
          {newData[type] &&
            newData[type].map((item, index) => {
              if (item.fiscalYear) {
                return (
                  <Panel header={item.fiscalYear + '年财务信息'} key={index}>
                    <div>
                      <div className={styles.detailInfo}>
                        资产负债率：
                        <span>
                          {item.assetLiabilityRatio ||
                          item.assetLiabilityRatio === 0
                            ? item.assetLiabilityRatio + '%'
                            : '无'}
                        </span>
                      </div>
                      <div className={styles.detailInfo}>
                        流动比率：
                        <span>
                          {item.liquidityRatio || item.liquidityRatio === 0
                            ? item.liquidityRatio + '%'
                            : '无'}
                        </span>
                      </div>
                      <div className={styles.detailInfo}>
                        速动比率：
                        <span>
                          {item.quickRatio || item.quickRatio === 0
                            ? item.quickRatio + '%'
                            : '无'}
                        </span>
                      </div>
                      <div className={styles.detailInfo}>
                        利息保障倍数：
                        <span>
                          {item.interestProtection ||
                          item.interestProtection === 0
                            ? item.interestProtection + '倍'
                            : '无'}
                        </span>
                      </div>
                      <div className={styles.detailInfo}>
                        经营性现金净流量：
                        <span>
                          {item.cashFlow ? item.cashFlow + '元' : '无'}
                        </span>
                      </div>
                      <div className={styles.detailInfo}>
                        净利润金额：
                        <span>
                          {item.netProfit ? item.netProfit + ' 元' : '无'}
                        </span>
                      </div>
                    </div>
                    <Divider />
                    <div>
                      <div className={styles.detailInfo}>
                        市盈率：
                        <span>
                          {item.peRatio || item.peRatio === 0
                            ? item.peRatio + '%'
                            : '无'}
                        </span>
                      </div>
                      <div className={styles.detailInfo}>
                        市净率：
                        <span>
                          {item.pbRatio || item.pbRatio === 0
                            ? item.pbRatio + '%'
                            : '无'}
                        </span>
                      </div>
                      <div className={styles.detailInfo}>
                        销售利润增长率：
                        <span>
                          {item.cashGrowthRate || item.cashGrowthRate === 0
                            ? item.cashGrowthRate + '%'
                            : '无'}
                        </span>
                      </div>
                      <div className={styles.detailInfo}>
                        净利润增长率：
                        <span>
                          {item.profitGrowthRate || item.profitGrowthRate === 0
                            ? item.profitGrowthRate + '%'
                            : '无'}
                        </span>
                      </div>
                      <div className={styles.detailInfo}>
                        应收账款周转率：
                        <span>
                          {item.creditVelocity || item.creditVelocity === 0
                            ? item.creditVelocity + '%'
                            : '无'}
                        </span>
                      </div>
                      <div className={styles.detailInfo}>
                        存货周转率：
                        <span>
                          {item.stockVelocity || item.stockVelocity === 0
                            ? item.stockVelocity + ' %'
                            : '无'}
                        </span>
                      </div>
                      {num === 1 ? (
                        <Fragment>
                          <Divider />
                          <div className={styles.detailInfo}>
                            生产销售毛利率：
                            <span>
                              {item.grossProfitRate ||
                              item.grossProfitRate === 0
                                ? item.grossProfitRate + ' %'
                                : '无'}
                            </span>
                          </div>
                        </Fragment>
                      ) : (
                        ''
                      )}
                    </div>
                  </Panel>
                )
              } else {
                return null
              }
            })}
        </Collapse>
      </Card>
    )
  }

  render() {
    const { getData, newData, companyInfo } = this.state
    let show,
      showTwo = false
    let showThree = false
    let type = typeIn[Number(sessionStorage.businessMode)]
    const title = type === 's' ? '购货商征信信息' : '委托企业征信信息'
    if (companyInfo && Object.keys(companyInfo).length !== 0) {
      for (let key in companyInfo) {
        for (let item in example) {
          if (item === key) {
            if (companyInfo[key] !== '' && companyInfo[key] !== null) {
              show = true
              break
            }
          }
        }
        for (let item1 in exampleTwo) {
          if (item1 === key) {
            if (companyInfo[key] !== '' && companyInfo[key] !== null) {
              showTwo = true
              break
            }
          }
        }
      }
    }
    if (newData.clientCreditList && newData.clientCreditList[0]) {
      newData.clientCreditList.forEach((item, index) => {
        for (let key in item) {
          for (let i in exampleOne) {
            if (key === i) {
              if (item[key] !== '' && item[key] !== null) {
                showThree = true
                return false
              }
            }
          }
        }
      })
    }
    return (
      <div className={styles.IncomingData}>
        <Card
          title={<div style={{ fontWeight: 600 }}>业务详细信息</div>}
          style={{ marginBottom: 10 }}
        >
          <div>
            <div className={styles.detailInfo}>
              规格：
              <span>
                {newData.specifications ? newData.specifications : '无'}
              </span>
            </div>
            <div className={styles.detailInfo}>
              来源地区：
              <span>{newData.sourceArea ? newData.sourceArea : '无'}</span>
            </div>
            <div className={styles.detailInfo}>
              质量标准：
              <span>
                {newData.grade || newData.grade === 0 ? newData.grade : '无'}
              </span>
            </div>
            <div className={styles.detailInfo}>
              数量：
              <span>
                {newData.quantity || newData.quantity === 0
                  ? newData.quantity + ' 吨'
                  : '无'}
              </span>
            </div>
            {type === 'w' ? (
              ''
            ) : (
              <div className={styles.detailInfo}>
                <div>
                  {type === 'p' || type === 'L'
                    ? '委托采购价格：'
                    : '委托销售价格：'}

                  <span>
                    {newData.purchasingPrice || newData.purchasingPrice === 0
                      ? newData.purchasingPrice + ' 元'
                      : '无'}
                  </span>
                </div>
              </div>
            )}

            {type === 'w' ? (
              ''
            ) : (
              <div className={styles.detailInfo}>
                {type === 'p' || type === 'L' ? '销售价格：' : '采购价格：'}
                <span>
                  {type === 'p' || type === 'L'
                    ? newData.sellingPrice || newData.sellingPrice === 0
                      ? newData.sellingPrice + ' 元'
                      : '无'
                    : newData.purchasePrice || newData.purchasePrice === 0
                    ? newData.purchasePrice + ' 元'
                    : '无'}
                </span>
              </div>
            )}
          </div>
          <Divider />
          <div className={styles.detailInfo}>
            担保企业：
            <span>{newData.guarantorName ? newData.guarantorName : '无'}</span>
          </div>
          {type === 'p' || type === 'L' ? (
            <div className={styles.detailInfo}>
              保证金比例：
              <span>
                {newData.marginRates || newData.marginRates === 0
                  ? newData.marginRates + '%'
                  : '无'}
              </span>
            </div>
          ) : (
            ''
          )}

          {type === 'p' || type === 'L' ? (
            <div className={styles.detailInfo}>
              货物交割类型：
              <span>
                {newData.deliveryType || newData.deliveryType === 0
                  ? newData.deliveryType === 1
                    ? '现货交易'
                    : '期货交易'
                  : '无'}
              </span>
            </div>
          ) : (
            ''
          )}
          {type !== 'w' ? <Divider /> : ''}

          <div>
            {type === 'L' || type === 'w' ? (
              ''
            ) : (
              <div className={styles.detailInfo}>
                {type === 's' ? '委托企业开票模式：' : '供货商开票模式：'}
                <span>
                  {newData.invoiceMode || newData.invoiceMode === 0
                    ? type === 's'
                      ? '先票后款'
                      : newData.invoiceMode === 1
                      ? '开一定比例票后结算'
                      : '结算后统一开票'
                    : '无'}
                </span>
              </div>
            )}
            {type === 'L' || type === 'w' ? (
              ''
            ) : (
              <div className={styles.detailInfo}>
                首次开票比例：
                <span>
                  {newData.firstInvoiceRatio || newData.firstInvoiceRatio === 0
                    ? newData.firstInvoiceRatio + '%'
                    : '无'}
                </span>
              </div>
            )}
            {type === 'w' ? (
              ''
            ) : (
              <div className={styles.detailInfo}>
                开票时限：
                <span>
                  {newData.invoiceDeadline
                    ? newData.invoiceDeadline + ' 天'
                    : '无'}
                </span>
              </div>
            )}
            {type === 'w' ? (
              ''
            ) : (
              <div className={styles.detailInfo}>
                付款比例：
                <span>
                  {newData.paymentRatio || newData.paymentRatio === 0
                    ? newData.paymentRatio + '%'
                    : ''}
                </span>
              </div>
            )}

            {type === 'p' ? (
              <div className={styles.detailInfo}>
                提货期限：
                <span>
                  {newData.takeGoodsDeadline
                    ? newData.takeGoodsDeadline + ' 天'
                    : '无'}
                </span>
              </div>
            ) : (
              ''
            )}
            {type === 'L' ? (
              <div className={styles.detailInfo}>
                委托企业回款期限：
                <span>
                  {newData.clientCollectionDeadline
                    ? newData.clientCollectionDeadline + ' 天'
                    : '无'}
                </span>
              </div>
            ) : (
              ''
            )}

            {type === 'p' || type === 'L' ? (
              <div className={styles.detailInfo}>
                货权转移期限：
                <span>
                  {newData.goodsTransferDeadline
                    ? newData.goodsTransferDeadline + ' 天'
                    : '无'}
                </span>
              </div>
            ) : (
              ''
            )}
          </div>
          <Divider />
          <div>
            <div className={styles.detailHead}>
              货代公司：
              <span>
                {newData.freightForwardName ? newData.freightForwardName : '无'}
              </span>
            </div>
            {type === 'p' || type === 'L' ? (
              <Fragment>
                <div className={styles.detailInfo}>
                  发货地：
                  <span>
                    {this.state.deliveryAddress
                      ? this.state.deliveryAddress
                      : '无'}
                  </span>
                </div>
                <div className={styles.detailInfo}>
                  发货库位/港口：
                  <span>
                    {newData.deliveryPlace ? newData.deliveryPlace : '无'}
                  </span>
                </div>
                <div />
                <div className={styles.detailInfo}>
                  收货地：
                  <span>
                    {this.state.takeGoodsAddress
                      ? this.state.takeGoodsAddress
                      : '无'}
                  </span>
                </div>
                <div className={styles.detailInfo}>
                  收货库位/港口：
                  <span>
                    {newData.takeGoodsPlace ? newData.takeGoodsPlace : '无'}
                  </span>
                </div>
                <div className={styles.detailInfo}>
                  交割库位/港口：
                  <span>
                    {newData.transactionPlace ? newData.transactionPlace : '无'}
                  </span>
                </div>
              </Fragment>
            ) : (
              ''
            )}
          </div>
          <Divider />
          <div>
            <Row gutter={24}>
              <Col span={6} />
              {type === 'p' || type === 'L' ? (
                <Col span={6}>
                  <div>
                    货物数量正负比例：
                    <span>
                      {newData.goodsPlusMinusRatio ||
                      newData.goodsPlusMinusRatio === 0
                        ? newData.goodsPlusMinusRatio + '%'
                        : '无'}
                    </span>
                  </div>
                </Col>
              ) : (
                ''
              )}
              {type === 'L' || type === 'w' ? (
                ''
              ) : (
                <Col span={6}>
                  <div>
                    付款(运输)条款：
                    <span>
                      {newData.paymentProvision ||
                      newData.paymentProvision === 0
                        ? type === 's'
                          ? paymentS[newData.paymentProvision]
                          : payment[newData.paymentProvision]
                        : '无'}
                    </span>
                  </div>
                </Col>
              )}
            </Row>
            <Row gutter={24} style={{ marginTop: 10 }}>
              <Col span={6} />
              <Col span={6}>
                <div>
                  产能竞争指数：
                  <span>
                    {companyInfo.capacityIndex
                      ? companyInfo.capacityIndex === 1
                        ? '高：竞争力较高'
                        : companyInfo.capacityIndex === 2
                        ? '中：竞争力中等'
                        : '低：竞争力低下'
                      : '无'}
                  </span>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
        <Card
          title={<div style={{ fontWeight: 600 }}>其他补充信息</div>}
          bordered={false}
          style={{ marginTop: 20 }}
        >
          <OtherInfo />
        </Card>
        {type !== 's' && newData.guarantorName ? (
          <Card
            title={<div style={{ fontWeight: 600 }}>担保公司财务信息</div>}
            bordered={false}
            style={{ marginTop: 20 }}
          >
            <Collapse
              defaultActiveKey={
                newData.assureFinanceList &&
                newData.assureFinanceList.map((item, index) => {
                  return String(index)
                })
              }
            >
              {newData.assureFinanceList &&
                newData.assureFinanceList.map((item, index) => {
                  if (item.fiscalYear) {
                    return (
                      <Panel
                        header={item.fiscalYear + '年财务信息'}
                        key={index}
                      >
                        <div>
                          <div className={styles.detailInfo}>
                            资产负债率：
                            <span>
                              {item.assetLiabilityRatio ||
                              item.assetLiabilityRatio === 0
                                ? item.assetLiabilityRatio + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            流动比率：
                            <span>
                              {item.liquidityRatio || item.liquidityRatio === 0
                                ? item.liquidityRatio + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            速动比率：
                            <span>
                              {item.quickRatio || item.quickRatio === 0
                                ? item.quickRatio + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            利息保障倍数：
                            <span>
                              {item.interestProtection ||
                              item.interestProtection === 0
                                ? item.interestProtection + '倍'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            经营性现金净流量：
                            <span>
                              {item.cashFlow ? item.cashFlow + '元' : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            净利润金额：
                            <span>
                              {item.netProfit ? item.netProfit + ' 元' : '无'}
                            </span>
                          </div>
                        </div>
                        <Divider />
                        <div>
                          <div className={styles.detailInfo}>
                            市盈率：
                            <span>
                              {item.peRatio || item.peRatio === 0
                                ? item.peRatio + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            市净率：
                            <span>
                              {item.pbRatio || item.pbRatio === 0
                                ? item.pbRatio + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            销售利润增长率：
                            <span>
                              {item.cashGrowthRate || item.cashGrowthRate === 0
                                ? item.cashGrowthRate + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            净利润增长率：
                            <span>
                              {item.profitGrowthRate ||
                              item.profitGrowthRate === 0
                                ? item.profitGrowthRate + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            应收账款周转率：
                            <span>
                              {item.creditVelocity || item.creditVelocity === 0
                                ? item.creditVelocity + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            存货周转率：
                            <span>
                              {item.stockVelocity || item.stockVelocity === 0
                                ? item.stockVelocity + ' %'
                                : '无'}
                            </span>
                          </div>
                        </div>
                      </Panel>
                    )
                  } else {
                    return null
                  }
                })}
            </Collapse>
          </Card>
        ) : (
          ''
        )}
        {type !== 'w'
          ? type === 's'
            ? newData.purchaserFinanceList &&
              newData.purchaserFinanceList[0].fiscalYear &&
              this.cardInfo('purchaserFinanceList', 1)
            : newData.supplierFinanceList &&
              newData.supplierFinanceList[0].fiscalYear &&
              this.cardInfo('supplierFinanceList', 2)
          : ''}

        {showTwo && type !== 'w' && (
          <Card
            title={
              <div style={{ fontWeight: 600 }}>
                {type === 's' ? '委托企业经营信息' : '供货商经营信息'}
              </div>
            }
            bordered={false}
            style={{ marginTop: 20 }}
          >
            <div>
              <div className={styles.detailInfo}>
                标的物库存量：
                <span>
                  {companyInfo.corporeInventory ||
                  companyInfo.corporeInventory === 0
                    ? companyInfo.corporeInventory + '吨'
                    : '无'}
                </span>
              </div>
              <div className={styles.detailInfo}>
                标的物需求量：
                <span>
                  {companyInfo.corporeRequirement ||
                  companyInfo.corporeRequirement === 0
                    ? companyInfo.corporeRequirement + '吨'
                    : '无'}
                </span>
              </div>
              <div className={styles.detailInfo}>
                供货方每日产能：
                <span>
                  {companyInfo.supplierDailyCapacity
                    ? companyInfo.supplierDailyCapacity + '吨/天'
                    : '无'}
                </span>
              </div>
              <div />
              <div className={styles.detailInfo}>
                预计供货时间：
                <span>
                  {companyInfo.expectDeliveryTime
                    ? companyInfo.expectDeliveryTime
                    : '无'}
                </span>
              </div>
              <div className={styles.detailInfo}>
                合同约定供货时间：
                <span>
                  {companyInfo.agreeDeliveryTime
                    ? companyInfo.agreeDeliveryTime
                    : '无'}
                </span>
              </div>
            </div>
          </Card>
        )}
        {show && (
          <Card
            title={
              <div style={{ fontWeight: 600 }}>
                {type === 'w'
                  ? '委托企业经营信息'
                  : type === 's'
                  ? '购货商经营信息'
                  : '委托企业经营信息'}
              </div>
            }
            bordered={false}
            style={{ marginTop: 20 }}
          >
            <div>
              <div className={styles.detailInfo}>
                设备类型：
                <span>
                  {companyInfo.deviceType
                    ? companyInfo.deviceType === 1
                      ? '高炉'
                      : companyInfo.deviceType === 2
                      ? '生产线'
                      : '其他'
                    : '无'}
                </span>
              </div>
              <div className={styles.detailInfo}>
                设备数量：
                <span>
                  {companyInfo.deviceQuantity ||
                  companyInfo.deviceQuantity === 0
                    ? companyInfo.deviceQuantity + '台'
                    : '无'}
                </span>
              </div>
              <div className={styles.detailInfo}>
                每日产能：
                <span>
                  {companyInfo.dailyCapacity
                    ? companyInfo.dailyCapacity + '吨/天'
                    : '无'}
                </span>
              </div>
              <div />
              <div className={styles.detailInfo}>
                每日标的物消耗：
                <span>
                  {companyInfo.dailyConsume || companyInfo.dailyConsume === 0
                    ? companyInfo.dailyConsume + '吨/天'
                    : '无'}
                </span>
              </div>
              <div className={styles.detailInfo}>
                单位产出耗电量：
                <span>
                  {companyInfo.outputConsume
                    ? companyInfo.outputConsume + '千瓦'
                    : '无'}
                </span>
              </div>
              {type !== 's' && (
                <Fragment>
                  {' '}
                  <div className={styles.detailInfo}>
                    设备老化率：
                    <span>
                      {companyInfo.obsoleteDeviceRate ||
                      companyInfo.obsoleteDeviceRate === 0
                        ? companyInfo.obsoleteDeviceRate + '%'
                        : '无'}
                    </span>
                  </div>
                  <Divider />
                  <div className={styles.detailInfo}>
                    近六个月环保设备故障率：
                    <span>
                      {companyInfo.sixMonFailRate ||
                      companyInfo.sixMonFailRate === 0
                        ? companyInfo.sixMonFailRate + '%'
                        : '无'}
                    </span>
                  </div>
                  <div className={styles.detailInfo}>
                    当前环保设备是否正常运行：
                    <span>
                      {companyInfo.workingNormal
                        ? companyInfo.workingNormal === 1
                          ? '是'
                          : '否'
                        : '无'}
                    </span>
                  </div>
                  <div className={styles.detailInfo}>
                    最近三年进行安全评价的次数：
                    <span>
                      {companyInfo.safetyEvaluationTime
                        ? companyInfo.safetyEvaluationTime + '次'
                        : '无'}
                    </span>
                  </div>
                  <div />
                  <div className={styles.detailInfo}>
                    最近3个月开工率：
                    <span>
                      {companyInfo.operatingRate
                        ? companyInfo.operatingRate + '%'
                        : '无'}
                    </span>
                  </div>
                  <div className={styles.detailInfo}>
                    企业环评手续是否齐全：
                    <span>
                      {companyInfo.eiaComplete
                        ? companyInfo.eiaComplete === 1
                          ? '是'
                          : '否'
                        : '无'}
                    </span>
                  </div>
                  <div className={styles.detailInfo}>
                    企业是否具有生产许可证：
                    <span>
                      {companyInfo.productionCertificate
                        ? companyInfo.productionCertificate === 1
                          ? '是'
                          : '否'
                        : '无'}
                    </span>
                  </div>
                  <Divider />
                  <div className={styles.foot}>
                    <div>
                      企业是否通过最近一次安全评价：
                      <span>
                        {companyInfo.latestSafety
                          ? companyInfo.latestSafety === 1
                            ? '是'
                            : '否'
                          : '无'}
                      </span>
                    </div>
                  </div>{' '}
                </Fragment>
              )}
            </div>
          </Card>
        )}

        {newData.clientFinanceList &&
        newData.clientFinanceList[0].fiscalYear ? (
          <Card
            title={<div style={{ fontWeight: 600 }}>委托企业财务信息</div>}
            bordered={false}
            style={{ marginTop: 20 }}
          >
            <Collapse
              defaultActiveKey={
                newData.clientFinanceList &&
                newData.clientFinanceList.map((item, index) => {
                  return String(index)
                })
              }
            >
              {newData.clientFinanceList &&
                newData.clientFinanceList.map((item, index) => {
                  if (item.fiscalYear) {
                    return (
                      <Panel
                        header={item.fiscalYear + '年财务信息'}
                        key={index}
                      >
                        <div>
                          <div className={styles.detailInfo}>
                            资产负债率：
                            <span>
                              {item.assetLiabilityRatio ||
                              item.assetLiabilityRatio === 0
                                ? item.assetLiabilityRatio + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            流动比率：
                            <span>
                              {item.liquidityRatio || item.liquidityRatio === 0
                                ? item.liquidityRatio + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            速动比率：
                            <span>
                              {item.quickRatio || item.quickRatio === 0
                                ? item.quickRatio + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            利息保障倍数：
                            <span>
                              {item.interestProtection ||
                              item.interestProtection === 0
                                ? item.interestProtection + '倍'
                                : '无'}
                            </span>
                          </div>
                          {type !== 's' && (
                            <div className={styles.detailInfo}>
                              上一个财年的经营性现金需求：
                              <span>
                                {item.cashDemand
                                  ? item.cashDemand + '元'
                                  : '无'}
                              </span>
                            </div>
                          )}

                          <div className={styles.detailInfo}>
                            经营性现金净流量：
                            <span>
                              {item.cashFlow ? item.cashFlow + '元' : '无'}
                            </span>
                          </div>
                        </div>
                        <Divider />
                        <div>
                          <div className={styles.detailInfo}>
                            净利润金额：
                            <span>
                              {item.netProfit ? item.netProfit + ' 元' : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            销售利润增长率：
                            <span>
                              {item.cashGrowthRate || item.cashGrowthRate === 0
                                ? item.cashGrowthRate + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            净利润增长率：
                            <span>
                              {item.profitGrowthRate ||
                              item.profitGrowthRate === 0
                                ? item.profitGrowthRate + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            应收账款周转率：
                            <span>
                              {item.creditVelocity || item.creditVelocity === 0
                                ? item.creditVelocity + '%'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            存货周转率：
                            <span>
                              {item.stockVelocity || item.stockVelocity === 0
                                ? item.stockVelocity + ' %'
                                : '无'}
                            </span>
                          </div>
                          {type !== 's' && (
                            <div className={styles.detailInfo}>
                              生产销售毛利润率：
                              <span>
                                {item.grossProfitRate
                                  ? item.grossProfitRate + ' %'
                                  : '无'}
                              </span>
                            </div>
                          )}
                        </div>
                      </Panel>
                    )
                  } else {
                    return null
                  }
                })}
            </Collapse>
          </Card>
        ) : (
          ''
        )}

        {type === 's'}

        {newData.clientCreditList &&
        newData.clientCreditList[0] &&
        showThree ? (
          <Card
            title={<div style={{ fontWeight: 600 }}>委托企业征信信息</div>}
            bordered={false}
            style={{ marginTop: 20 }}
          >
            <Collapse
              defaultActiveKey={
                newData.clientCreditList &&
                newData.clientCreditList.map((item, index) => {
                  return String(index)
                })
              }
            >
              {newData.clientCreditList &&
                newData.clientCreditList.map((item, index) => {
                  if (true) {
                    return (
                      <Panel
                        header={'委托企业征信信息' + `(${index + 1})`}
                        key={index}
                      >
                        <div>
                          <div className={styles.detailInfo}>
                            信贷起始日期：
                            <span>
                              {item.creditStartingDate
                                ? item.creditStartingDate
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            还款截止日期：
                            <span>
                              {item.repaymentTerm ? item.repaymentTerm : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            信贷合作机构名称：
                            <span>
                              {item.cooperativeInstitution
                                ? item.cooperativeInstitution
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            信贷金额：
                            <span>
                              {item.creditAmount
                                ? item.creditAmount + '元'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            是否逾期：
                            <span>
                              {item.overdue
                                ? item.overdue === 1
                                  ? '是'
                                  : '否'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            未结清信贷金额：
                            <span>
                              {item.unclearedCreditAmount
                                ? item.unclearedCreditAmount + ' 元'
                                : '无'}
                            </span>
                          </div>
                        </div>
                      </Panel>
                    )
                  }
                })}
            </Collapse>
          </Card>
        ) : (
          ''
        )}
        {newData.purchaserCreditList &&
        newData.purchaserCreditList[0] &&
        showThree ? (
          <Card
            title={<div style={{ fontWeight: 600 }}>{title}</div>}
            bordered={false}
            style={{ marginTop: 20 }}
          >
            <Collapse
              defaultActiveKey={
                newData.purchaserCreditList &&
                newData.purchaserCreditList.map((item, index) => {
                  return String(index)
                })
              }
            >
              {newData.purchaserCreditList &&
                newData.purchaserCreditList.map((item, index) => {
                  if (true) {
                    return (
                      <Panel header={title + `(${index + 1})`} key={index}>
                        <div>
                          <div className={styles.detailInfo}>
                            信贷起始日期：
                            <span>
                              {item.creditStartingDate
                                ? item.creditStartingDate
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            还款截止日期：
                            <span>
                              {item.repaymentTerm ? item.repaymentTerm : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            信贷合作机构名称：
                            <span>
                              {item.cooperativeInstitution
                                ? item.cooperativeInstitution
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            信贷金额：
                            <span>
                              {item.creditAmount
                                ? item.creditAmount + '元'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            是否逾期：
                            <span>
                              {item.overdue
                                ? item.overdue === 1
                                  ? '是'
                                  : '否'
                                : '无'}
                            </span>
                          </div>
                          <div className={styles.detailInfo}>
                            未结清信贷金额：
                            <span>
                              {item.unclearedCreditAmount
                                ? item.unclearedCreditAmount + ' 元'
                                : '无'}
                            </span>
                          </div>
                        </div>
                      </Panel>
                    )
                  }
                })}
            </Collapse>
          </Card>
        ) : (
          ''
        )}
      </div>
    )
  }
}
