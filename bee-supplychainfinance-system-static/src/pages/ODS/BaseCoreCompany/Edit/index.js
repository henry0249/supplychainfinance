import { Component } from 'react';
import { Button, Form, Breadcrumb, Select, Row, Col, message } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import {
  getDataById,
  getList,
  saveData
} from '../services';

const FormItem = Form.Item;
const { Option } = Select;

@withRouter
@Form.create()
export default class Index extends Component {
  state = {
    list: [],
    inputValue: ''
  }

  componentDidMount() {
    const { id } = this.props.location.query;
    const { setFieldsValue } = this.props.form;
    getList().then(res => {
      if (res.code === 0) {
        this.setState({
          list: res.data
        })
      } else {
        message.error('查询所有企业失败：' + res.msg);
      }
    })
    if (id !== undefined) {
      getDataById(id).then(res => {
        if (res.code === 0) {
          setFieldsValue({
            roleType: res.data.roleType,
            companyName: res.data.companyName
          })
        } else {
          message.error('查询核心白名单企业失败：' + res.msg);
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
          roleType: values.roleType,
          companyName: values.companyName
        }

        if (id !== undefined) {
          params['id'] = id
        }

        saveData(params).then(res => {
          if (res.code === 0) {
            message.success('保存核心白名单企业成功！');
            router.goBack();
          } else {
            message.error('保存核心白名单企业失败:' + res.msg);
          }
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { id } = this.props.location.query;
    const { list, inputValue } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/home">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/macrofinance/MacroIndex">数据仓库</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/baseCoreCompany/index">供应链平台核心企业白名单</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{id === undefined ? '添加' : '编辑'}企业</Breadcrumb.Item>
          </Breadcrumb>

          <h2>供应链平台核心企业白名单数据</h2>

          <div>
            操作：可编辑、添加和删除供应链平台核心企业白名单数据。
            <Button onClick={() => router.goBack()} className={styles.back} icon="rollback" type='primary' >返回</Button>
          </div>
        </div>

        <div className={styles.body}>
          <Form>
            <FormItem label="企业类型">
              {
                getFieldDecorator('roleType', {
                  rules: [{ required: true, message: '请选择企业类型' }]
                })(
                  <Select allowClear={false} style={{ width: 360 }} placeholder="请选择">
                    <Option value="委托企业">委托企业</Option>
                    <Option value="担保公司">担保公司</Option>
                    <Option value="供货企业">供货企业</Option>
                    <Option value="购货企业">购货企业</Option>
                    <Option value="货代企业">货代企业</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="企业名称">
              {
                getFieldDecorator('companyName', {
                  rules: [{ required: true, message: '请选择企业名称' }]
                })(
                  <Select
                    allowClear={false}
                    showSearch
                    placeholder="请选择"
                    style={{ width: 360 }}
                    filterOption={false}
                    onSearch={(inputValue) => this.setState({ inputValue })}
                  >
                    {
                      list.map((item, i) => {
                        if (item.name.indexOf(inputValue) > -1) {
                          return <Option value={item.name} key={i}>{item.name}</Option>
                        }
                      })
                    }
                  </Select>
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
