import { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Divider, Form, InputNumber, Button, Input, Icon, Collapse } from 'antd'
import styles from './Index.less'
import { compose } from 'redux'
import { connect } from 'dva'
import { moneyExp, moneyExp1, chineseMon, format } from '@/utils/utils'
import { guid } from '@/utils/utils'

const FormItem = Form.Item
const Panel = Collapse.Panel

@connect(({ incomingstep, loading }) => ({
  incomingstep
}))
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [guid()],
      passData: []
    }
    this.newDataOne = null
  }
  componentDidMount() {
    const { getData, type, supplyType, onf, onf1, part, getDom } = this.props
    let exampleItem = {
      fiscalYear: '',
      assetLiabilityRatio: '',
      cashFlow: '',
      cashGrowthRate: '',
      creditVelocity: '',
      interestProtection: '',
      liquidityRatio: '',
      netProfit: '',
      pbRatio: '',
      peRatio: '',
      profitGrowthRate: '',
      quickRatio: '',
      stockVelocity: ''
    }
    if (type === 's') {
      exampleItem.grossProfitRate = ''
    }
    const self = this
    const writeBackByType = type => {
      if (this.newDataOne) {
        if (
          type === 'p'
            ? (this.newDataOne.supplierFinanceList &&
              this.newDataOne.supplierFinanceList.length !== 0) ||
            (this.newDataOne.assureFinanceList &&
              this.newDataOne.assureFinanceList.length !== 0)
            : type === 'L'
              ? (this.newDataOne.supplierFinanceList &&
                this.newDataOne.supplierFinanceList.length !== 0) ||
              (this.newDataOne.assureFinanceList &&
                this.newDataOne.assureFinanceList.length !== 0)
              : type === 's'
                ? this.newDataOne.purchaserFinanceList &&
                this.newDataOne.purchaserFinanceList.length !== 0
                : type === 'w'
                  ? this.newDataOne.assureFinanceList &&
                  this.newDataOne.assureFinanceList.length !== 0
                  : false
        ) {
          if (supplyType === 'supply') {
            const listArr = []
            let obj = {}
            let dataList =
              type === 'p'
                ? this.newDataOne.supplierFinanceList
                : type === 'L'
                  ? this.newDataOne.supplierFinanceList
                  : type === 's'
                    ? this.newDataOne.purchaserFinanceList
                    : type === 'w'
                      ? this.newDataOne.assureFinanceList
                      : []
            for (let i = 0; i < dataList.length; i++) {
              listArr.push(String(i + 1))
            }
            this.setState(
              {
                data: listArr.length === 0 ? ['1'] : listArr
              },
              () => {
                if (type === 'p' || type === 'L') {
                  dataList.forEach((item, index) => {
                    for (let i in exampleItem) {
                      for (let key in item) {
                        if (key === i) {
                          obj[key + part + index] = item[key]
                        }
                      }
                    }
                    self.props.rcForm.setFieldsValue({
                      ...obj
                    })
                  })
                } else {
                  dataList.forEach((item, index) => {
                    for (let i in exampleItem) {
                      for (let key in item) {
                        if (key === i) {
                          obj[key + index] = item[key]
                        }
                        // debugger
                      }
                    }
                    self.props.rcForm.setFieldsValue({
                      ...obj
                    })
                  })
                }
              }
            )
          } else {
            const listArr = []
            let obj = {}
            let dataList =
              type === 'p'
                ? this.newDataOne.assureFinanceList
                : type === 'L'
                  ? this.newDataOne.assureFinanceList
                  : type === 's'
                    ? this.newDataOne.purchaserFinanceList
                    : type === 'w'
                      ? this.newDataOne.assureFinanceList
                      : []
            for (let i = 0; i < dataList.length; i++) {
              listArr.push(String(i + 1))
            }
            this.setState(
              {
                data: listArr.length === 0 ? ['1'] : listArr
              },
              () => {
                if (type === 'p' || type === 'L') {
                  dataList.forEach((item, index) => {
                    for (let i in exampleItem) {
                      for (let key in item) {
                        if (key === i) {
                          obj[key + part + index] = item[key]
                        }
                      }
                    }
                    self.props.rcForm.setFieldsValue({
                      ...obj
                    })
                  })
                } else {
                  dataList.forEach((item, index) => {
                    for (let i in exampleItem) {
                      for (let key in item) {
                        if (key === i) {
                          obj[key + index] = item[key]
                        }
                      }
                    }
                    self.props.rcForm.setFieldsValue({
                      ...obj
                    })
                  })
                }
              }
            )
          }
        }
      }
    }
    switch (type) {
      case 's':
        if (getData.entrustSaleDetailDTO) {
          this.newDataOne = getData.entrustSaleDetailDTO
        }
        writeBackByType('s')
        break
      case 'p':
        if (getData.entrustBuyDetailDTO) {
          this.newDataOne = getData.entrustBuyDetailDTO
        }
        writeBackByType('p')
        break
      case 'L':
        if (getData.largeEntrustBuyDetailDTO) {
          this.newDataOne = getData.largeEntrustBuyDetailDTO
        }
        writeBackByType('L')
        break
      case 'w':
        if (getData.financeStorageDetailDTO) {
          this.newDataOne = getData.financeStorageDetailDTO
        }
        writeBackByType('w')
        break
      default:
        break
    }
  }

  static defaultProps = {
    title: '财务信息'
  }

  static propTypes = {
    title: PropTypes.string,
    onChange: PropTypes.func
  }

  addFinancel = () => {
    const { data } = this.state
    data.push(guid())
    this.setState({
      data
    })
  }

  deleteFinancel = (index, e) => {
    e.stopPropagation()
    const { data } = this.state
    data.splice(index, 1)
    this.setState({
      data
    })
  }

  stopPropagation = e => {
    e.stopPropagation()
  }

  inputNumberEvent(e) {
    e.stopPropagation()
  }

  render() {
    const { getFieldDecorator, validateFields } = this.props.rcForm
    const {
      title,
      supplyType,
      id,
      type,
      dispatch,
      onChange,
      applyId,
      part,
      required
    } = this.props
    const { data, passData } = this.state
    return (
      <div className={styles.container}>
        <span className={styles.title}>{title}</span>
        <Divider />
        <div className={styles.content}>
          <Collapse defaultActiveKey={data}>
            {data.map((item, index) => (
              <Panel
                header={
                  <div className={styles.header}>
                    <Form
                      layout="inline"
                      hideRequiredMark
                      onClick={this.inputNumberEvent.bind(this)}
                      style={{ width: 200 }}
                    >
                      <FormItem>
                        {getFieldDecorator(
                          part
                            ? 'fiscalYear' + part + index
                            : 'fiscalYear' + index,
                          {
                            rules: [
                              {
                                type: 'integer',
                                message: '请输入财务信息年份',
                                required: required
                              }
                            ]
                          }
                        )(
                          <InputNumber
                            min={0}
                            className={styles.inputNumber}
                            onClick={this.stopPropagation.bind(this)}
                          />
                        )}
                      </FormItem>
                    </Form>
                    <span className={styles.after}>年财务信息</span>
                    {index !== 0 && (
                      <span
                        className={styles.deleteBtn}
                        onClick={this.deleteFinancel.bind(this, index)}
                      >
                        删除
                      </span>
                    )}
                  </div>
                }
                key={item}
                className={styles.panel}
                forceRender={true}
              >
                <Form
                  layout="vertical"
                  className={styles.formBox}
                  id={this.props.formId + index}
                >
                  <FormItem label="资产负债率" className={styles.formItem}>
                    {getFieldDecorator(
                      supplyType === 'supply'
                        ? 'assetLiabilityRatio' + part + index
                        : part
                          ? 'assetLiabilityRatio' + part + index
                          : 'assetLiabilityRatio' + index,
                      {}
                    )(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="流动比率" className={styles.formItem}>
                    {getFieldDecorator(
                      part
                        ? 'liquidityRatio' + part + index
                        : 'liquidityRatio' + index,
                      {}
                    )(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="速动比率" className={styles.formItem}>
                    {getFieldDecorator(
                      part ? 'quickRatio' + part + index : 'quickRatio' + index,
                      {}
                    )(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="利息保障倍数" className={styles.formItem}>
                    {getFieldDecorator(
                      part
                        ? 'interestProtection' + part + index
                        : 'interestProtection' + index,
                      {}
                    )(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>倍</span>
                  </FormItem>
                  <FormItem
                    label="经营性现金净流量（元）"
                    className={styles.formItem}
                  >
                    {getFieldDecorator(
                      part ? 'cashFlow' + part + index : 'cashFlow' + index,
                      {
                        rules: [
                          {
                            max: 20,
                            whitespace: true,
                            message: '13位数字/两位小数',
                            pattern: moneyExp
                          }
                        ]
                      }
                    )(
                      <Input
                        addonBefore={<span>￥</span>}
                        style={{ width: '100%', marginRight: 10 }}
                        placeholder="请填写"
                      />
                    )}
                    <span class="chineseMon3">
                      {chineseMon(
                        Number(
                          this.props.rcForm.getFieldValue(
                            part
                              ? 'cashFlow' + part + index
                              : 'cashFlow' + index
                          )
                        )
                      )}
                      <span style={{ marginLeft: 20 }}>
                        {format(
                          Number(
                            this.props.rcForm.getFieldValue(
                              part
                                ? 'cashFlow' + part + index
                                : 'cashFlow' + index
                            )
                          )
                        )}
                      </span>
                    </span>
                  </FormItem>

                  <FormItem
                    label="净利润金额（元）"
                    className={styles.formItem}
                  >
                    {getFieldDecorator(
                      part ? 'netProfit' + part + index : 'netProfit' + index,
                      {
                        rules: [
                          {
                            max: 20,
                            whitespace: true,
                            message: '13位数字/两位小数',
                            pattern: moneyExp
                          }
                        ]
                      }
                    )(
                      <Input
                        addonBefore={<span>￥</span>}
                        style={{ width: '100%', marginRight: 10 }}
                        placeholder="请填写"
                      />
                    )}
                    <span class="chineseMon3">
                      {chineseMon(
                        Number(
                          this.props.rcForm.getFieldValue(
                            part
                              ? 'netProfit' + part + index
                              : 'netProfit' + index
                          )
                        )
                      )}
                      <span style={{ marginLeft: 20 }}>
                        {format(
                          Number(
                            this.props.rcForm.getFieldValue(
                              part
                                ? 'netProfit' + part + index
                                : 'netProfit' + index
                            )
                          )
                        )}
                      </span>
                    </span>
                  </FormItem>

                  <Divider />
                  <FormItem label="市盈率" className={styles.formItem}>
                    {getFieldDecorator(
                      part ? 'peRatio' + part + index : 'peRatio' + index,
                      {}
                    )(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="市净率" className={styles.formItem}>
                    {getFieldDecorator(
                      part ? 'pbRatio' + part + index : 'pbRatio' + index,
                      {}
                    )(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="销售利润增长率" className={styles.formItem}>
                    {getFieldDecorator(
                      part
                        ? 'cashGrowthRate' + part + index
                        : 'cashGrowthRate' + index,
                      {}
                    )(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="净利润增长率" className={styles.formItem}>
                    {getFieldDecorator(
                      part
                        ? 'profitGrowthRate' + part + index
                        : 'profitGrowthRate' + index,
                      {}
                    )(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="应收账款周转率" className={styles.formItem}>
                    {getFieldDecorator(
                      part
                        ? 'creditVelocity' + part + index
                        : 'creditVelocity' + index,
                      {}
                    )(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="存货周转率" className={styles.formItem}>
                    {getFieldDecorator(
                      part
                        ? 'stockVelocity' + part + index
                        : 'stockVelocity' + index,
                      {}
                    )(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  {type === 's' && (
                    <Fragment>
                      <Divider />
                      <FormItem
                        label="生产销售毛利率"
                        className={styles.formItem}
                      >
                        {getFieldDecorator(
                          part
                            ? 'grossProfitRate' + part + index
                            : 'grossProfitRate' + index,
                          {}
                        )(
                          <InputNumber
                            step={1}
                            style={{ width: 100, marginRight: 10 }}
                            placeholder="请输入"
                          />
                        )}
                        <span>%</span>
                      </FormItem>
                    </Fragment>
                  )}
                </Form>
              </Panel>
            ))}
          </Collapse>
          <Button
            type="dashed"
            style={{ height: '54px', margin: '20px 0' }}
            block
            onClick={this.addFinancel.bind(this)}
          >
            <Icon type="plus" />
            添加财务信息
          </Button>
        </div>
      </div>
    )
  }
}
