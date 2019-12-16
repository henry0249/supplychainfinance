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
import moment from 'moment'
import { moneyExp, chineseMon, format } from '@/utils/utils'
import { guid } from '@/utils/utils'

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
      data: [guid()],
      passData: [],
      newData: {},
      SF: []
    }
  }
  componentDidMount() {
    const { type, getData, dispatch, onChange } = this.props
    const self = this
    dispatch({
      type: 'incomingstep/getSelect',
      payload: 'SF',
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState({
            SF: data
          })
        }
      }
    })
    switch (type) {
      case 'p':
        break
      case 's':
        if (getData.entrustSaleDetailDTO) {
          this.setState(
            {
              newData: getData.entrustSaleDetailDTO
                ? getData.entrustSaleDetailDTO.purchaserCreditList
                : {}
            },
            () => {
              const { newData } = this.state
              if (newData && Object.keys(newData).length !== 0) {
                let obj = {}
                const listArr = []
                let dataList = newData
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
                    })
                    self.props.rcForm.setFieldsValue({
                      ...obj
                    })
                  }
                )
              }
            }
          )
        }
        break
      case 'w':
        break
      default:
        break
    }
  }

  static defaultProps = {
    title: '经营信息'
  }

  static propTypes = {
    title: PropTypes.string,
    itemTitle: PropTypes.string,
    onChange: PropTypes.func
  }

  addCredit = () => {
    const { data } = this.state
    data.push(guid())
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
    const { getFieldDecorator, validateFields } = this.props.rcForm
    const {
      title,
      itemTitle,
      type,
      id,
      dispatch,
      onChange,
      applyId
    } = this.props
    const { data, passData, SF } = this.state
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
                      {itemTitle + '（' + (index + 1) + '）'}
                    </p>
                  ) : (
                      <p className={styles.headerP}>
                        {itemTitle + '（' + (index + 1) + '）'}
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
                forceRender={true}
              >
                <Form layout="vertical" className={styles.formBox}>
                  <FormItem label="信贷起始日期" className={styles.formItem}>
                    {getFieldDecorator('creditStartingDate' + index, {})(
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
                    {getFieldDecorator('repaymentTerm' + index)(
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
                    {getFieldDecorator('cooperativeInstitution' + index, {})(
                      <Input
                        style={{ max: 20, whitespace: true, width: '100%' }}
                        placeholder="请填写"
                      />
                    )}
                  </FormItem>
                  <FormItem label="信贷金额（元）" className={styles.formItem}>
                    {getFieldDecorator('creditAmount' + index, {
                      rules: [
                        {
                          max: 20,
                          pattern: moneyExp,
                          whitespace: true,
                          message: '13位数字/两位小数'
                        }
                      ]
                    })(
                      <Input
                        addonBefore={<span>￥</span>}
                        style={{ max: 20, whitespace: true, width: '100%' }}
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
                          pattern: moneyExp,
                          whitespace: true,
                          message: '13位数字/两位小数'
                        }
                      ]
                    })(
                      <Input
                        addonBefore={<span>￥</span>}
                        style={{ whitespace: true, width: '100%' }}
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
