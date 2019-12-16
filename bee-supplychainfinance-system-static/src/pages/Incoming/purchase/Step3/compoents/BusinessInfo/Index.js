import react, { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Form, Select, InputNumber, Input } from 'antd';
import styles from './Index.less'
import Link from 'umi/link';
import { connect } from 'dva';


const FormItem = Form.Item;
const Option = Select.Option;

@connect(({ incomingstep, loading }) => ({
  incomingstep,
}))
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      SBLX: [],
      SF: [],
      newData: {},
    }
  }
  componentDidMount() {
    const { dispatch, type, getData, onBus, id } = this.props
    const self = this
    dispatch({
      type: "incomingstep/getSelect",
      payload: "SBLX",
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState({
            SBLX: data
          }, () => {
            const { newData } = this.state
            if (Object.keys(newData).length !== 0) {
              if (newData.deviceType) {
                self.props.rcForm.setFieldsValue({
                  deviceType: String(newData.deviceType)
                })
              }
            }
          });
        }
      }
    });
    dispatch({
      type: "incomingstep/getSelect",
      payload: "SF",
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState({
            SF: data
          }, () => {
            const { newData } = this.state
            if (Object.keys(newData).length !== 0) {
              self.props.rcForm.setFieldsValue({
                workingNormal: newData.workingNormal ? String(newData.workingNormal) : "",
                eiaComplete: newData.eiaComplete ? String(newData.eiaComplete) : "",
                productionCertificate: newData.productionCertificate ? String(newData.productionCertificate) : "",
                latestSafety: newData.latestSafety ? String(newData.latestSafety) : "",
              })
            }
          });
        }
      }
    });
    if (Object.keys(getData).length !== 0) {
      switch (type) {
        case "p":
          if (getData.entrustBuyDetailDTO && Object.keys(getData.entrustBuyDetailDTO).length !== 0) {
            this.setState({
              newData: getData.entrustBuyDetailDTO ? getData.entrustBuyDetailDTO.companyInfoBuyDTO : {}
            });
          }
          break;
        case "L":
          if (getData.largeEntrustBuyDetailDTO && Object.keys(getData.largeEntrustBuyDetailDTO).length !== 0) {
            this.setState({
              newData: getData.largeEntrustBuyDetailDTO ? getData.largeEntrustBuyDetailDTO.companyInfoBuyDTO : {}
            });
          }
          break;
        case "s":
          if (getData.entrustSaleDetailDTO && Object.keys(getData.entrustSaleDetailDTO).length !== 0) {
            this.setState({
              newData: getData.entrustSaleDetailDTO ? getData.entrustSaleDetailDTO.companyInfoSaleDTO : {}
            });
          }
          break;
        case "w":
          if (getData.financeStorageDetailDTO && Object.keys(getData.financeStorageDetailDTO).length !== 0) {
            this.setState({
              newData: getData.financeStorageDetailDTO ? getData.financeStorageDetailDTO.companyInfoStorageDTO : {}
            });
          }
          break;
        default:
          break;
      }
    }
  }
  static defaultProps = {
    title: '经营信息',
    extend: false
  };
  static propTypes = {
    title: PropTypes.string,
    extend: PropTypes.bool,
    onChange: PropTypes.func
  };
  render() {
    const { SBLX, SF, newData } = this.state
    const { getFieldDecorator, validateFields } = this.props.rcForm;
    const { title, extend, onChange, type, dispatch, id, applyId } = this.props;
    return (
      <div className={styles.container}>
        <span className={styles.title}>{title}</span>
        <Divider />
        <div className={styles.content}>
          <Form layout="vertical" className={styles.formBox}>
            <FormItem label="设备类型" className={styles.formItem}>
              {getFieldDecorator('deviceType', {
                // initialValue: newData.deviceType,
              })(
                <Select style={{ width: '100%' }} placeholder="请选择" >
                  {
                    SBLX[0]
                      ?
                      SBLX.map((item) => {
                        return <Option key={item.sysCode} value={item.sysCode}>{item.sysCodeVal}</Option>
                      })
                      :
                      null
                  }
                </Select>
              )}
            </FormItem>

            <FormItem label="设备数量" className={styles.formItem}>
              {getFieldDecorator('deviceQuantity', {
                initialValue: newData.deviceQuantity || newData.deviceQuantity === 0 ? newData.deviceQuantity : "",
                // rules: [{ type: "number", message: '请输入设备数量' }],
              })(
                <InputNumber step={1} style={{ width: 100 }} placeholder="请输入" />
              )}
              <span style={{ marginLeft: "10px" }}>台</span>
            </FormItem>

            <FormItem label="每日产能" className={styles.formItem}>
              {getFieldDecorator('dailyCapacity', {
                initialValue: newData.dailyCapacity || newData.dailyCapacity === 0 ? Number(newData.dailyCapacity) : "",
              })(
                <InputNumber step={1} style={{ width: 300 }} placeholder="请输入" />
              )}
              <span style={{ marginLeft: "10px" }}>吨/天</span>
            </FormItem>

            <FormItem label="每日标的物消耗" className={styles.formItem}>
              {getFieldDecorator('dailyConsume', {
                initialValue: newData.dailyConsume || newData.dailyConsume === 0 ? Number(newData.dailyConsume) : "",
              })(
                <InputNumber step={1} style={{ width: 300 }} placeholder="请输入" />
              )}
              <span style={{ marginLeft: "10px" }}>吨/天</span>
            </FormItem>

            <FormItem label="单位产出耗电量" className={styles.formItem}>
              {getFieldDecorator('outputConsume', {
                initialValue: newData.outputConsume || newData.outputConsume === 0 ? Number(newData.outputConsume) : "",
              })(
                <InputNumber step={1} style={{ width: 300 }} placeholder="请输入" />
              )}
              <span style={{ marginLeft: "10px" }}>千瓦</span>
            </FormItem>

            {
              extend && <FormItem label="设备老化率" className={styles.formItem}>
                {getFieldDecorator('obsoleteDeviceRate', {
                  initialValue: newData.obsoleteDeviceRate || newData.obsoleteDeviceRate === 0 ? newData.obsoleteDeviceRate : "",
                })(
                  <InputNumber step={1} style={{ width: 100 }} placeholder="请输入" />
                )}
                <span style={{ marginLeft: "10px" }}>%</span>
              </FormItem>
            }

            {
              extend && <Divider />
            }

            {
              extend && <FormItem label="近六个月环保设备故障率" className={styles.formItem}>
                {getFieldDecorator('sixMonFailRate', {
                  initialValue: newData.sixMonFailRate || newData.sixMonFailRate === 0 ? newData.sixMonFailRate : "",
                })(
                  <InputNumber step={1} style={{ width: 100 }} placeholder="请输入" />
                )}
                <span style={{ marginLeft: "10px" }}>%</span>
              </FormItem>
            }

            {
              extend && <FormItem label="当前环保设备是否正常运行" className={styles.formItem}>
                {getFieldDecorator('workingNormal', {
                  rules: [{ message: '请选择当前环保设备是否正常运行' }],
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择" >
                    {
                      SF[0]
                        ?
                        SF.map((item) => {
                          return <Option key={item.sysCode} value={item.sysCode}>{item.sysCodeVal}</Option>
                        })
                        :
                        null
                    }
                  </Select>
                )}
              </FormItem>
            }

            {
              extend && <FormItem label="最近三年进行安全评价的次数" className={styles.formItem}>
                {getFieldDecorator('safetyEvaluationTime', {
                  initialValue: newData.safetyEvaluationTime,
                  // rules: [{ type: 'integer',message: '请填写最近三年进行安全评价的次数' }],
                })(
                  <InputNumber step={1} style={{ width: 100 }} placeholder="请输入" />
                )}
                <span style={{ marginLeft: "10px" }}>次</span>
              </FormItem>
            }

            {
              extend && <FormItem label="最近3个月开工率" className={styles.formItem}>
                {getFieldDecorator('operatingRate', {
                  initialValue: newData.operatingRate || newData.operatingRate === 0 ? newData.operatingRate : "",
                })(
                  <InputNumber step={1} style={{ width: 100 }} placeholder="请输入" />
                )}
                <span style={{ marginLeft: "10px" }}>%</span>
              </FormItem>
            }

            {
              extend && <FormItem label="企业环评手续是否齐全" className={styles.formItem}>
                {getFieldDecorator('eiaComplete', {
                  // initialValue: newData.eiaComplete,
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择" >
                    {
                      SF[0]
                        ?
                        SF.map((item) => {
                          return <Option key={item.sysCode} value={item.sysCode}>{item.sysCodeVal}</Option>
                        })
                        :
                        null
                    }
                  </Select>
                )}
              </FormItem>
            }

            {
              extend && <FormItem label="企业是否具有生产许可证" className={styles.formItem}>
                {getFieldDecorator('productionCertificate', {
                  // initialValue: newData.productionCertificate,
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择" >
                    {
                      SF[0]
                        ?
                        SF.map((item) => {
                          return <Option key={item.sysCode} value={item.sysCode}>{item.sysCodeVal}</Option>
                        })
                        :
                        null
                    }
                  </Select>
                )}
              </FormItem>
            }

            {
              extend && <Divider />
            }

            {
              extend && <FormItem label="企业是否通过最近一次安全评价" className={styles.formItem}>
                {getFieldDecorator('latestSafety', {
                  // initialValue: newData.latestSafety,
                })(
                  <Select style={{ width: '100%' }} placeholder="请选择" >
                    {
                      SF[0]
                        ?
                        SF.map((item) => {
                          return <Option key={item.sysCode} value={item.sysCode}>{item.sysCodeVal}</Option>
                        })
                        :
                        null
                    }
                  </Select>
                )}
              </FormItem>
            }
          </Form>
        </div>
      </div>
    )
  }
}
