import { Component } from 'react';
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
      JJLZS: [],
      newData: {}
    }
  }
  componentDidMount() {
    const { dispatch, getData, type, id, applyId, onChange } = this.props
    const self = this
    dispatch({
      type: "incomingstep/getSelect",
      payload: "JJLZS",
      callback: (code, msg, data) => {
        if (code === 0) {
          this.setState({
            JJLZS: data
          }, () => {
            const { newData } = this.state
            if (newData) {
              self.props.rcForm.setFieldsValue({
                capacityIndex: newData.capacityIndex
              })
            }
          });
        }
      }
    });
    switch (type) {
      case "p":
        if (getData.entrustBuyDetailDTO) {
          this.setState({
            newData: getData.entrustBuyDetailDTO ? getData.entrustBuyDetailDTO.companyInfoBuyDTO : {}
          });
        }
        break;
      case "L":
        if (getData.largeEntrustBuyDetailDTO) {
          this.setState({
            newData: getData.largeEntrustBuyDetailDTO ? getData.largeEntrustBuyDetailDTO.companyInfoLargeDTO : {}
          });
        }
        break;
      case "s":
        if (getData.entrustSaleDetailDTO) {
          this.setState({
            newData: getData.entrustSaleDetailDTO ? getData.entrustSaleDetailDTO.companyInfoSaleDTO : {}
          })
        }
        break;
      case "w":
        if (getData.financeStorageDetailDTO) {
          this.setState({
            newData: getData.financeStorageDetailDTO ? getData.financeStorageDetailDTO.companyInfoStorageDTO : {}
          });
        }
        break;
      default:
        break;
    }
  }
  static defaultProps = {
    title: '补充信息',
    extend: false
  };

  static propTypes = {
    title: PropTypes.string,
    onChange: PropTypes.func
  };

  render() {
    const { JJLZS, newData } = this.state
    const { getFieldDecorator } = this.props.rcForm;
    const { title, onChange, type, dispatch, id, applyId } = this.props;

    return (
      <div className={styles.container}>
        <span className={styles.title}>{title}</span>
        <Divider />
        <div className={styles.content}>
          <Form layout="vertical" className={styles.formBox}>
            <FormItem label="产能竞争力指数" className={styles.formItem}>
              {getFieldDecorator('capacityIndex', {
                // initialValue: newData.capacityIndex,
                rules: [{ required: true, message: '请选择产能竞争力指数' }],
              })(
                <Select style={{ width: '100%' }} placeholder="请选择">
                  {
                    JJLZS[0]
                      ?
                      JJLZS.map((item) => {
                        return <Option key={item.sysCode} value={Number(item.sysCode)}>{item.sysCodeVal}</Option>
                      })
                      :
                      null
                  }
                </Select>
              )}
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
