import { Component } from 'react';
import PropTypes from 'prop-types';
import { Divider, Button, Input, Form, InputNumber, Select, Icon } from 'antd';
import styles from './index.less'
import { connect } from 'dva';

const { TextArea } = Input;
const FormItem = Form.Item;
const Option = Select.Option;

@Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    props.onChange(allValues)
  }
})
@connect(({ global, projectApproval }) => ({
  projectApproval, global
}))
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      self: [],
    }
  }

  static defaultProps = {
    titleEdit: false,
    contentEdit: false,
    onChange: () => { },
    onDelete: () => { }
  };

  static propTypes = {
    data: PropTypes.array,
    titleEdit: PropTypes.bool,
    contentEdit: PropTypes.bool,
    onChange: PropTypes.func,
    onDelete: PropTypes.func
  };

  addSelf = () => {
    const { self } = this.state;
    self.push(self.length + 1)
    this.setState({
      self
    })
  }

  deleteSelf = (index, e) => {
    e.stopPropagation();
    const { onDelete } = this.props;
    const { self } = this.state;
    self.splice(index, 1)
    this.setState({
      self
    }, () => {
      onDelete(index + 1)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { data = [], titleEdit, contentEdit, projectApproval: { process } } = this.props;
    const { self } = this.state;

    return (
      <div className={styles.container}>
        <span className={styles.title}>{process.state === 4 || process.state === 5 || process.state === 6 ? "风险要素" : "风险要素建议"}</span>
        <Divider />
        <div className={styles.content}>
          {
            data.length > 0 ? data.map((i, index) => {
              if (i.isDefined === 0) {
                if (i.riskElementKey.indexOf('额度') > -1 || i.riskElementKey.indexOf('年化利率') > -1) {
                  return (
                    <div className={styles.item} key={i.riskElementConfigId}>
                      {
                        contentEdit ?
                          <div className={styles.itemBox}>
                            {
                              titleEdit ? <Form layout='inline' className={styles.header}>
                                <FormItem label={i.riskElementKey}>
                                  {getFieldDecorator('input' + String(i.riskElementConfigId), {
                                    initialValue: i.riskElementValue && i.riskElementValue.indexOf("%") !== -1 ? i.riskElementValue.slice(0, i.riskElementValue.length - 1) : i.riskElementValue
                                  })(
                                    i.riskElementKey.indexOf('额度') > -1 ? <Input style={{ width: 200 }} /> : <InputNumber min={0} max={100} />
                                  )}
                                </FormItem>
                                {
                                  i.riskElementKey.indexOf('年化利率') > -1 && <span style={{ lineHeight: '39px' }}>%</span>
                                }
                                {
                                  i.riskElementKey.indexOf("额度") !== -1 && <span style={{ lineHeight: "39px" }}>元</span>
                                }
                              </Form> : <span className={styles.header}>{i.riskElementKey + '： ' + (i.riskElementKey.indexOf("额度") !== -1 ? i.riskElementValue ? i.riskElementValue + " 元" : "" : i.riskElementKey.indexOf("年化利率") !== -1 ? i.riskElementValue + " %" : i.riskElementValue)}</span>
                            }
                            <Form className={styles.marginForm}>
                              <FormItem>
                                {getFieldDecorator(String(i.riskElementConfigId))(
                                  <TextArea autosize={{ minRows: 4, maxRows: 6 }} />
                                )}
                              </FormItem>
                            </Form>
                          </div> : <span>{i.riskElementKey + '： ' + (i.riskElementKey.indexOf("额度") !== -1 ? i.riskElementValue ? i.riskElementValue + " 元" : "" : i.riskElementKey.indexOf("年化利率") !== -1 ? i.riskElementValue + " %" : i.riskElementValue)}</span>
                      }
                      {
                        i.riskElementSuggestions && i.riskElementSuggestions.length !== 0 && i.riskElementSuggestions.map((row, index) => <div className={styles.suggestBox} key={index}>
                          <p>{row.createTime}<span>{row.creator}</span></p>
                          <p>{row.content}</p>
                        </div>
                        )
                      }
                      <Divider />
                    </div>
                  )
                } else {
                  return (
                    <div className={styles.item} key={i.riskElementConfigId}>
                      {
                        contentEdit ? <div className={styles.itemBox}>
                          <span className={styles.header}>{i.riskElementKey + '： ' + (i.riskElementKey.indexOf("额度") !== -1 ? i.riskElementValue ? i.riskElementValue + " 元" : "" : i.riskElementKey.indexOf("年化利率") !== -1 ? i.riskElementValue + " %" : i.riskElementValue)}</span>
                          <Form className={styles.marginForm}>
                            <FormItem>
                              {getFieldDecorator(String(i.riskElementConfigId))(
                                <TextArea autosize={{ minRows: 4, maxRows: 6 }} />
                              )}
                            </FormItem>
                          </Form>
                        </div> : <span className={styles.header}>{i.riskElementKey + '： ' + (i.riskElementKey.indexOf("额度") !== -1 ? i.riskElementValue ? i.riskElementValue + " 元" : "" : i.riskElementKey.indexOf("年化利率") !== -1 ? i.riskElementValue + " %" : i.riskElementValue)}</span>
                      }
                      {
                        i.riskElementSuggestions && i.riskElementSuggestions.length !== 0 && i.riskElementSuggestions.map((row, index) => <div className={styles.suggestBox} key={index}>
                          <p>{row.createTime}<span>{row.creator}</span></p>
                          <p>{row.content}</p>
                        </div>
                        )
                      }
                      <Divider />
                    </div>
                  )
                }
              }
            }) : null
          }
          {
            self && self.map((item, index) => <div className={styles.item} key={item}>
              {
                contentEdit && <div className={styles.itemBox}>
                  <Form layout='inline' className={styles.header}>
                    <FormItem label='自定义'>
                      {getFieldDecorator('title' + item)(
                        <Select style={{ width: 240 }}>
                          {
                            data.map((i, index) => i.isDefined === 1 && <Option value={i.riskElementConfigId + '-' + i.riskElementValue} key={i.riskElementConfigId}>{i.riskElementKey + '：' + (i.riskElementValue === "" ? "无" : i.riskElementValue)}</Option>)
                          }
                        </Select>
                      )}
                    </FormItem>
                  </Form>
                  <Form className={styles.marginForm}>
                    <FormItem>
                      {getFieldDecorator('self' + item)(
                        <TextArea autosize={{ minRows: 4, maxRows: 6 }} />
                      )}
                    </FormItem>
                    <Icon type="minus-circle" className={styles.delBtn} onClick={this.deleteSelf.bind(this, index)} />
                  </Form>
                </div>
              }
              <Divider />
            </div>)
          }
          {
            contentEdit && <div className={styles.item}>
              <Button type="dashed" style={{ height: '94px', margin: "49px 0 0" }} block onClick={this.addSelf.bind(this)}>
                <Icon type="plus" />
                添加
              </Button>
            </div>
          }
        </div>
      </div>
    )
  }
}
