import { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Divider,
  Form,
  Button,
  Input,
  Collapse,
  Icon,
  DatePicker,
  Select
} from 'antd'
import styles from './Index.less'
import Link from 'umi/link'
import { connect } from 'dva'
import { moneyExp, chineseMon, format } from '@/utils/utils'
import moment from 'moment'

const FormItem = Form.Item
const Panel = Collapse.Panel
const Option = Select.Option
@connect(({ incomingstep, loading }) => ({
  incomingstep
}))
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: ['1'],
      passData: [],
      SF: []
    }
  }

  componentDidMount() {
    const { getData, type, dispatch, supplyType } = this.props
    const self = this
    dispatch({
      type: 'incomingstep/getSelect',
      payload: 'SF',
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState(
            {
              SF: data
            },
            () => {
              const { newData } = this.state
            }
          )
        }
      }
    })
    switch (type) {
      case 's':
        if (getData.entrustSaleDetailDTO) {
          this.newDataOne = getData.entrustSaleDetailDTO
            ? getData.entrustSaleDetailDTO.clientCreditList
            : {}
        }
        break
      case 'p':
        if (getData.entrustBuyDetailDTO) {
          this.newDataOne = getData.entrustBuyDetailDTO
            ? getData.entrustBuyDetailDTO.clientCreditList
            : {}
        }
        break
      case 'L':
        if (getData.largeEntrustBuyDetailDTO) {
          this.newDataOne = getData.largeEntrustBuyDetailDTO
            ? getData.largeEntrustBuyDetailDTO.clientCreditList
            : {}
        }
        break
      case 'w':
        if (getData.financeStorageDetailDTO) {
          this.newDataOne = getData.financeStorageDetailDTO
            ? getData.financeStorageDetailDTO.clientCreditList
            : {}
        }
        break
      default:
        break
    }
    if (this.newDataOne) {
      if (this.newDataOne.length !== 0) {
        const listArr = []
        let obj = {}
        let dataList = this.newDataOne
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
                  if (
                    key.indexOf('creditStartingDate') !== -1 ||
                    key.indexOf('repaymentTerm') !== -1
                  ) {
                    obj[key + index] = moment(item[key])
                  }
                  if (key.indexOf('overdue') !== -1) {
                    obj[key + index] = String(item[key])
                  }
                }
              }
            })
            self.props.rcForm.setFieldsValue({
              ...obj
            })
            const values = self.props.rcForm.getFieldsValue()
          }
        )
      }
    }
  }

  static defaultProps = {
    title: '供货商经营信息'
  }

  static propTypes = {
    title: PropTypes.string,
    itemTitle: PropTypes.string,
    onChange: PropTypes.func
  }

  addCredit = () => {
    const { data } = this.state
    data.push(String(data.length + 1))
    this.setState({
      data
    })
  }

  deleteCredit = (index, e) => {
    e.stopPropagation()
    const { data } = this.state
    data.splice(index, 1)
    this.setState({
      data
    })
  }

  render() {
    const { getFieldDecorator } = this.props.rcForm
    const { title, itemTitle } = this.props
    const { data, SF } = this.state
    const onValidateForm = () => {
      validateFields((err, values) => {
        if (!err) {
          let newData = [].concat(passData)
          let index = 0
          let arr = null
          let exampleItem = {
            cooperativeInstitution: '2',
            creditAmount: '2',
            creditStartingDate: '2',
            overdue: '2',
            repaymentTerm: '2',
            unclearedCreditAmount: '2',
            id: id,
            applyId: applyId
          }
          let newItem = {}
          values['id'] = id
          for (var item in exampleItem) {
            for (var valueItem in values) {
              let keyItem = valueItem.indexOf(item)
              if (keyItem >= 0) {
                newItem[item] = values[valueItem]
                index = Number((arr = valueItem.replace(item, '')))
              }
            }
          }
          newData[index] = newItem
          this.setState({
            passData: newData
          })
          dispatch({
            type: 'incomingstep/setFourthData',
            payload: { purchaserCreditList: newData }
          })
        }
      })
    }
    return (
      <div className={styles.container}>
        <span className={styles.title}>{title}</span>
        <Divider />
        <div className={styles.content}>
          <Collapse defaultActiveKey={data}>
            {data.map((item, index) => (
              <Panel
                header={
                  index === 0 ? (
                    <p className={styles.headerP}>
                      {itemTitle + '（' + item + '）'}
                    </p>
                  ) : (
                      <p className={styles.headerP}>
                        {itemTitle + '（' + item + '）'}
                        <span
                          className={styles.deleteBtn}
                          onClick={this.deleteCredit.bind(this, index)}
                        >
                          删除
                      </span>
                      </p>
                    )
                }
                key={item}
                className={styles.panel}
              >
                <Form layout="vertical" className={styles.formBox}>
                  <FormItem label="信贷起始日期" className={styles.formItem}>
                    {getFieldDecorator('creditStartingDate' + index, {
                      // rules: [{ required: true, message: '请选择信贷起始日期' }],
                    })(
                      <DatePicker
                        allowClear={false}
                        format="YYYY-MM-DD"
                        disabledDate={this.datepick}
                        placeholder="请选择"
                        style={{ width: '79%' }}
                      />
                    )}
                  </FormItem>
                  <FormItem label="还款截止日期" className={styles.formItem}>
                    {getFieldDecorator('repaymentTerm' + index, {})(
                      <DatePicker
                        allowClear={false}
                        format="YYYY-MM-DD"
                        disabledDate={this.datepick}
                        placeholder="请选择"
                        style={{ width: '79%' }}
                      />
                    )}
                  </FormItem>
                  <FormItem
                    label="信贷合作机构名称"
                    className={styles.formItem}
                  >
                    {getFieldDecorator('cooperativeInstitution' + index, {
                      rules: [{ max: 20, whitespace: true }]
                    })(
                      <Input style={{ width: '100%' }} placeholder="请填写" />
                    )}
                  </FormItem>
                  <FormItem label="信贷金额（元）" className={styles.formItem}>
                    {getFieldDecorator('creditAmount' + index, {
                      rules: [
                        {
                          max: 20,
                          whitespace: true,
                          message: '13位数字/两位小数',
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
                            'creditAmount' + index
                          )
                        )
                      )}
                      <span style={{ marginLeft: 20 }}>
                        {format(
                          Number(
                            this.props.rcForm.getFieldValue(
                              'creditAmount' + index
                            )
                          )
                        )}
                      </span>
                    </span>
                  </FormItem>
                  <FormItem label="是否逾期" className={styles.formItem}>
                    {getFieldDecorator('overdue' + index, {
                      rules: [{}]
                    })(
                      <Select style={{ width: '100%' }} placeholder="请选择">
                        {SF[0]
                          ? SF.map(item => {
                            return (
                              <Option key={item.sysCode} value={item.sysCode}>
                                {item.sysCodeVal}
                              </Option>
                            )
                          })
                          : null}
                      </Select>
                    )}
                  </FormItem>
                  <FormItem
                    label="未结清信贷金额（元）"
                    className={styles.formItem}
                  >
                    {getFieldDecorator('unclearedCreditAmount' + index, {
                      rules: [
                        {
                          max: 20,
                          whitespace: true,
                          message: '13位数字/两位小数',
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
                            'unclearedCreditAmount' + index
                          )
                        )
                      )}
                      <span style={{ marginLeft: 20 }}>
                        {format(
                          Number(
                            this.props.rcForm.getFieldValue(
                              'unclearedCreditAmount' + index
                            )
                          )
                        )}
                      </span>
                    </span>
                  </FormItem>
                </Form>
              </Panel>
            ))}
          </Collapse>
          <Button
            type="dashed"
            style={{ height: '54px', margin: '20px 0' }}
            block
            onClick={this.addCredit.bind(this)}
          >
            <Icon type="plus" />
            添加企业征信
          </Button>
        </div>
      </div>
    )
  }
}
