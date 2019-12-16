import { Component } from 'react';
import { Button, Form, Breadcrumb, Select, Input, Row, Col, Modal, message } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import {
  getConstant,
  getDataById,
  saveData
} from '../services';

const FormItem = Form.Item;
const { Option } = Select;

@withRouter
@Form.create()
export default class Index extends Component {
  state = {
    years: [],
    ranks: [],
    inputValue: ''
  }

  componentDidMount() {
    const { id } = this.props.location.query;
    const { setFieldsValue } = this.props.form;
    getConstant().then(res => {
      if (res.code === 0) {
        this.setState({
          years: res.data.years,
          ranks: res.data.ranks
        })
      } else {
        message.error('查询所有年份失败：' + res.msg);
      }
    })
    if (id !== undefined) {
      getDataById(id).then(res => {
        if (res.code === 0) {
          setFieldsValue({
            years: res.data.years,
            rank: res.data.rank,
            companyCname: res.data.companyCname,
            companyEname: res.data.companyEname || null,
            companyCode: res.data.companyCode || null
          })
        } else {
          message.error('查询世界500强企业失败：' + res.msg);
        }
      })
    }
  }

  handleSave = () => {
    const { validateFields } = this.props.form;
    const { id } = this.props.location.query;
    validateFields((err, values) => {
      if (!err) {
        let params = {
          ...values
        }

        if (id !== undefined) {
          params['id'] = id
        }

        saveData(params).then(res => {
          if (res.code === 0) {
            message.success('保存世界500强企业成功！');
            router.goBack();
          } else {
            message.error('保存世界500强企业失败:' + res.msg);
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { id } = this.props.location.query;
    const { years, ranks, inputValue } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/home">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/macrofinance/MacroIndex">数据仓库</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/baseTopCompany/index">世界500强企业名单</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{id === undefined ? '添加' : '编辑'}企业</Breadcrumb.Item>
          </Breadcrumb>

          <h2>世界500强企业数据</h2>

          <div>
            操作：可编辑、添加和删除世界500强企业数据。
            <Button onClick={() => router.goBack()} className={styles.back} icon="rollback" type='primary' >返回</Button>
          </div>
        </div>

        <div className={styles.body}>
          <Form>
            <FormItem label="年份">
              {
                getFieldDecorator('years', {
                  rules: [{ required: true, message: '请选择年份' }]
                })(
                  <Select allowClear={false} style={{ width: 240 }} placeholder="请选择">
                    {
                      years.length !== 0 && years.map(
                        (item, i) => <Option value={item}>{item}</Option>
                      )
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="排名">
              {
                getFieldDecorator('rank', {
                  rules: [{ required: true, message: '请选择排名' }]
                })(
                  <Select
                    allowClear={false}
                    style={{ width: 240 }}
                    showSearch
                    placeholder="请选择"
                    filterOption={false}
                    onSearch={(inputValue) => this.setState({ inputValue })}
                  >
                    {
                      ranks.length !== 0 && ranks.map(
                        (item, i) => {
                          if (String(item).indexOf(String(inputValue)) > -1) {
                            return <Option value={item}>{item}</Option>
                          }
                        }
                      )
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="企业名称（中文）">
              {
                getFieldDecorator('companyCname', {
                  rules: [{ required: true, message: '请输入企业中文全名' }]
                })(
                  <Input allowClear={false} style={{ width: 480 }} placeholder="企业中文全名（必填）" />
                )
              }
            </FormItem>
            <FormItem label="企业名称（英文）">
              {
                getFieldDecorator('companyEname')(
                  <Input allowClear={false} style={{ width: 480 }} placeholder="企业英文全名（选填）" />
                )
              }
            </FormItem>
            <FormItem label="统一社会信用代码">
              {
                getFieldDecorator('companyCode')(
                  <Input allowClear={false} style={{ width: 480 }} placeholder="统一社会信用代码（非内地企业可不填）" />
                )
              }
            </FormItem>
          </Form>
        </div>

        <Row type="flex" justify="end" align="middle" className={styles.footer}>
          <Col>
            <Button onClick={() => router.goBack()} style={{ marginRight: 24 }}>取消</Button>
            <Button onClick={this.handleSave.bind(this)} type='primary' >提交</Button>
          </Col>
        </Row>
      </div>
    )
  }
}
