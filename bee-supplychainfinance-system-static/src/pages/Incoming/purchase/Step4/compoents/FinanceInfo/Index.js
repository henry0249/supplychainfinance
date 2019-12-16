import { Component } from 'react'
import PropTypes from 'prop-types'
import { Divider, Form, InputNumber, Button, Input, Icon, Collapse } from 'antd'
import styles from './Index.less'
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
      data: [guid()]
    }
  }

  static defaultProps = {
    title: '财务信息'
  }

  static propTypes = {
    title: PropTypes.string,
    extend: PropTypes.bool,
    onChange: PropTypes.func
  }

  addFinancel = () => {
    const { data } = this.state
    data.push(guid())
    this.setState({
      data
    })
  }

  componentDidMount() {
    const { getData, type, supplyType, onChange } = this.props
    const self = this
    const writeBackByType = type => {
      if (this.newDataOne) {
        if (
          type === 'p'
            ? this.newDataOne.clientFinanceList &&
            this.newDataOne.clientFinanceList.length !== 0
            : type === 'L'
              ? this.newDataOne.clientFinanceList &&
              this.newDataOne.clientFinanceList.length !== 0
              : type === 's'
                ? this.newDataOne.clientFinanceList &&
                this.newDataOne.clientFinanceList.length !== 0
                : type === 'w'
                  ? this.newDataOne.clientFinanceList &&
                  this.newDataOne.clientFinanceList.length !== 0
                  : false
        ) {
          const listArr = []
          let obj = {}
          let dataList =
            type === 'p'
              ? this.newDataOne.clientFinanceList
              : type === 'L'
                ? this.newDataOne.clientFinanceList
                : type === 's'
                  ? this.newDataOne.clientFinanceList
                  : type === 'w'
                    ? this.newDataOne.clientFinanceList
                    : []
          for (let i = 0; i < dataList.length; i++) {
            listArr.push(String(i + 1))
          }
          this.setState(
            {
              data: listArr.length !== 0 ? listArr : ['1']
            },
            () => {
              dataList.forEach((item, index) => {
                for (let key in item) {
                  if (
                    key !== 'id' &&
                    key !== 'companyType' &&
                    key !== 'entrustBuyDetailId'
                  ) {
                    obj[key + index] = item[key]
                  }
                }
              })
              self.props.rcForm.setFieldsValue({
                ...obj
              })
            }
          )
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

  deleteFinancel = (index, e) => {
    e.stopPropagation()
    const { data } = this.state
    data.splice(index, 1)
    this.setState({
      data
    })
  }

  stopPropagation = e => {
    const self = this
    e.stopPropagation()
  }
  inputNumberEvent(e) {
    e.stopPropagation()
  }
  render() {
    const { getFieldDecorator } = this.props.rcForm
    const { title, extend, type } = this.props
    const { data } = this.state
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
                        {getFieldDecorator('fiscalYear' + index, {
                          rules: [
                            { type: 'integer', message: '请输入财务信息年份' }
                          ]
                        })(
                          <InputNumber
                            className={styles.inputNumber}
                            onClick={this.stopPropagation}
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
                    {getFieldDecorator('assetLiabilityRatio' + index, {
                      // rules: [{type: 'integer', message: '请输入资产负债率' }],
                    })(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="流动比率" className={styles.formItem}>
                    {getFieldDecorator('liquidityRatio' + index, {
                      // rules: [{type: 'integer', message: '请输入流动比率' }],
                    })(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="速动比率" className={styles.formItem}>
                    {getFieldDecorator('quickRatio' + index, {
                      // rules: [{type: 'integer', message: '请输入速动比率' }],
                    })(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="利息保障倍数" className={styles.formItem}>
                    {getFieldDecorator('interestProtection' + index, {
                      // rules: [{ type: 'integer',message: '请填写利息保障倍数' }],
                    })(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>倍</span>
                  </FormItem>
                  {type !== 's' && (
                    <FormItem
                      label="上一个财年的经营性现金需求（元）"
                      className={styles.formItem}
                    >
                      {getFieldDecorator('cashDemand' + index, {
                        rules: [
                          {
                            max: 20,
                            whitespace: true,
                            message: '经营性现金需求必须为数字',
                            pattern: moneyExp
                          }
                        ]
                      })(
                        <Input
                          addonBefore={<span>￥</span>}
                          style={{ width: '100%' }}
                          placeholder="请填写"
                        />
                      )}
                      <span class="chineseMon3">
                        {chineseMon(
                          Number(
                            this.props.rcForm.getFieldValue(
                              'cashDemand' + index
                            )
                          )
                        )}
                        <span style={{ marginLeft: 20 }}>
                          {format(
                            Number(
                              this.props.rcForm.getFieldValue(
                                'cashDemand' + index
                              )
                            )
                          )}
                        </span>
                      </span>
                    </FormItem>
                  )}

                  <FormItem
                    label="经营性现金净流量（元）"
                    className={styles.formItem}
                  >
                    {getFieldDecorator('cashFlow' + index, {
                      rules: [
                        {
                          // max: 20,
                          // whitespace: true,
                          message: '13位数字/两位小数',
                          // type: "string"
                          pattern: moneyExp
                        }
                      ]
                    })(
                      <Input
                        addonBefore={<span>￥</span>}
                        style={{ width: '100%' }}
                        placeholder="请填写"
                      />
                    )}
                    <span class="chineseMon3">
                      {chineseMon(
                        Number(
                          this.props.rcForm.getFieldValue('cashFlow' + index)
                        )
                      )}
                      <span style={{ marginLeft: 20 }}>
                        {format(
                          Number(
                            this.props.rcForm.getFieldValue('cashFlow' + index)
                          )
                        )}
                      </span>
                    </span>
                  </FormItem>

                  <Divider />

                  <FormItem
                    label="净利润金额（元）"
                    className={styles.formItem}
                  >
                    {getFieldDecorator('netProfit' + index, {
                      rules: [
                        {
                          // max: 20,
                          // whitespace: true,
                          // type: "string",
                          message: '13位数字/两位小数',
                          // pattern: moneyExp
                          pattern: moneyExp
                        }
                      ]
                    })(
                      <Input
                        addonBefore={<span>￥</span>}
                        style={{ width: '100%' }}
                        placeholder="请填写"
                      />
                    )}
                    <span class="chineseMon3">
                      {chineseMon(
                        Number(
                          this.props.rcForm.getFieldValue('netProfit' + index)
                        )
                      )}
                      <span style={{ marginLeft: 20 }}>
                        {format(
                          Number(
                            this.props.rcForm.getFieldValue('netProfit' + index)
                          )
                        )}
                      </span>
                    </span>
                  </FormItem>
                  <FormItem label="销售利润增长率" className={styles.formItem}>
                    {getFieldDecorator('cashGrowthRate' + index, {
                      // rules: [{type: 'integer', message: '请输入销售利润增长率' }],
                    })(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="净利润增长率" className={styles.formItem}>
                    {getFieldDecorator('profitGrowthRate' + index, {
                      // rules: [{type: 'integer', message: '请输入净利润增长率' }],
                    })(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="应收账款周转率" className={styles.formItem}>
                    {getFieldDecorator('creditVelocity' + index, {
                      // rules: [{type: 'integer', message: '请输入应收账款周转率' }],
                    })(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  <FormItem label="存货周转率" className={styles.formItem}>
                    {getFieldDecorator('stockVelocity' + index, {
                      // rules: [{type: 'integer', message: '请输入存货周转率' }],
                    })(
                      <InputNumber
                        step={1}
                        style={{ width: 100, marginRight: 10 }}
                        placeholder="请输入"
                      />
                    )}
                    <span>%</span>
                  </FormItem>
                  {extend && (
                    <FormItem
                      label="生产销售毛利润率"
                      className={styles.formItem}
                    >
                      {getFieldDecorator('grossProfitRate' + index, {
                        // rules: [{type:'integer', message: '请输入生产销售毛利润率' }],
                      })(
                        <InputNumber
                          step={1}
                          style={{ width: 100, marginRight: 10 }}
                          placeholder="请输入"
                        />
                      )}
                      <span>%</span>
                    </FormItem>
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
