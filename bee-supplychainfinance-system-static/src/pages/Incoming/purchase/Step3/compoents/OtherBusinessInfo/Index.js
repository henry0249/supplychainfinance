import { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Form, Select, InputNumber, Input, DatePicker } from 'antd';
import styles from './Index.less'
import Link from 'umi/link';
import { connect } from 'dva';
import moment from 'moment'

const FormItem = Form.Item;
const Option = Select.Option;


@connect(({ incomingstep, loading }) => ({
  incomingstep,
}))
export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newData: {}
    }
  }
  componentDidMount() {
    const { type, getData, onOt } = this.props
    const self = this
    switch (type) {
      case "p":
        if (getData.entrustBuyDetailDTO) {
          this.setState({
            newData: getData.entrustBuyDetailDTO ? getData.entrustBuyDetailDTO.companyInfoBuyDTO : {}
          }, () => {
            const expectDeliveryTime = this.state.newData.expectDeliveryTime ? moment(this.state.newData.expectDeliveryTime) : null
            const agreeDeliveryTime = this.state.newData.agreeDeliveryTime ? moment(this.state.newData.agreeDeliveryTime) : null;
            self.props.rcForm.setFieldsValue({
              expectDeliveryTime,
              agreeDeliveryTime
            })
          });
        }
        break;
      case "L":
        if (getData.largeEntrustBuyDetailDTO) {
          this.setState({
            newData: getData.largeEntrustBuyDetailDTO ? getData.largeEntrustBuyDetailDTO.companyInfoLargeDTO : {}
          }, () => {
            const expectDeliveryTime = this.state.newData.expectDeliveryTime ? moment(this.state.newData.expectDeliveryTime) : null
            const agreeDeliveryTime = this.state.newData.agreeDeliveryTime ? moment(this.state.newData.agreeDeliveryTime) : null;
            self.props.rcForm.setFieldsValue({
              expectDeliveryTime,
              agreeDeliveryTime
            })
          });
        }
        break;
      case "s":
        if (getData.entrustSaleDetailDTO) {
          this.setState({
            newData: getData.entrustSaleDetailDTO ? getData.entrustSaleDetailDTO.companyInfoSaleDTO : {}
          });
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
    title: '供货商经营信息'
  };

  static propTypes = {
    title: PropTypes.string,
    onChange: PropTypes.func
  };

  datepick = current => {
    return current && current < moment().endOf("day");
  };

  render() {
    const { newData } = this.state
    const { getFieldDecorator, validateFields } = this.props.rcForm;
    const { title, extend, onChange, type, id, incomingstep, dispatch, applyId } = this.props;
    return (
      <div className={styles.container}>
        <span className={styles.title}>{title}</span>
        <Divider />
        <div className={styles.content}>
          <Form layout="vertical" className={styles.formBox}>
            <FormItem label="标的物库存量" className={styles.formItem}>
              {getFieldDecorator('corporeInventory', {
                initialValue: newData.corporeInventory ? Number(newData.corporeInventory) : "",
                // rules: [{type: 'number', message: '请填写标的物库存量' }],
              })(
                <InputNumber
                  step={1}
                  style={{ width: 100, marginRight: 10 }}
                  placeholder="请输入"
                />
              )}
              <span>吨</span>
            </FormItem>

            <FormItem label="标的物需求量" className={styles.formItem}>
              {getFieldDecorator('corporeRequirement', {
                initialValue: newData.corporeRequirement ? Number(newData.corporeRequirement) : "",
                // rules: [{ type: 'number',message: '请填写标的物需求量' }],
              })(
                <InputNumber step={1} style={{ width: 100, marginRight: 10 }} placeholder="请输入" />
              )}
              <span>吨</span>
            </FormItem>

            <FormItem label="供货方每日产能" className={styles.formItem}>
              {getFieldDecorator('supplierDailyCapacity', {
                initialValue: newData.supplierDailyCapacity ? Number(newData.supplierDailyCapacity) : "",
                // rules: [{ type: 'number',message: '请填写供货方每日产能' }],
              })(
                <InputNumber step={1} style={{ width: 100, marginRight: 10 }} placeholder="请输入" />
              )}
              <span>吨/天</span>
            </FormItem>

            <FormItem label="预计供货时间" className={styles.formItem}>
              {getFieldDecorator('expectDeliveryTime', {
                // initialValue: newData.expectDeliveryTime,
                // rules: [{  message: '请选择预计供货时间' }],
              })(
                <DatePicker
                  allowClear={false}
                  format="YYYY-MM-DD"
                  disabledDate={this.datepick}
                  placeholder="请选择"
                  style={{ width: "79%" }}

                />
              )}
            </FormItem>

            <FormItem label="合同约定供货时间" className={styles.formItem}>
              {getFieldDecorator('agreeDeliveryTime', {
                // initialValue: newData.agreeDeliveryTime,
                // rules: [{ message: '请选择合同约定供货时间' }],
              })(
                <DatePicker
                  allowClear={false}
                  format="YYYY-MM-DD"
                  disabledDate={this.datepick}
                  placeholder="请选择"
                  style={{ width: "79%" }}

                />
              )}
            </FormItem>
          </Form>
        </div>
      </div>
    )
  }
}
