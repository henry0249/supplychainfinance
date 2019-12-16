import { Component } from 'react';
import { Form, Breadcrumb, Button, Row, Col, Select, Table, Icon, Input, message, Modal } from 'antd';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import {
  getSubjectMatterAttribute,
  getSourceAddressList,
  saveSourceAddressInfo,
  deleteInfo
} from '../../service';

const FormItem = Form.Item;
const { Option } = Select;

@withRouter
@Form.create()
export default class Index extends Component {
  state = {
    data: [],
    editId: null,
    name: null,
    name_add: null,
    names: [],
    attributes: {},
    current: 1,
    page: {
      totalPage: 0,
      totalRecords: 0,
    },
    visible: false
  }

  componentDidMount() {
    const { setFieldsValue } = this.props.form;
    const { key, name } = this.props.location.query;
    if (name) {
      setFieldsValue({
        tast: name
      })
      this.setState({
        name
      })
    }
    getSubjectMatterAttribute({ typeName: key, attributeType: 1 }).then(res => {
      if (res.code === 0) {
        let names = [], attributes = {};
        res.data.forEach(item => {
          names.push(item.name);
          attributes[item.name] = item.attributes
        })
        this.setState({
          names,
          attributes
        })
      } else {
        message.error('获取标的物规格筛选项失败：' + res.msg);
      }
    })
  }

  changeName = (name) => {
    const { resetFields } = this.props.form;
    resetFields(['specification'])
    this.setState({ name })
  }

  changeNameAdd = (name_add) => {
    const { resetFields } = this.props.form;
    resetFields(['specification_add'])
    this.setState({ name_add })
  }

  handleQuery = (value) => {
    const { validateFields } = this.props.form;
    validateFields(['tast'], (err, values) => {
      if (!err) {
        if (!values.tast || !value) {
          return message.warning('请先选择标的物和规格')
        }
        let params = {
          tast: values.tast,
          specification: encodeURI(value)
        }
        getSourceAddressList(params).then(res => {
          if (res.code === 0) {
            this.setState({
              data: res.data,
              page: {
                totalPage: Math.ceil(res.data.length / 10),
                totalRecords: res.data.length
              },
              editId: null,
              visible: false
            })
          } else {
            message.error('获取来源列表失败：' + res.msg);
          }
        })
      }
    })
  }

  handleSave = (id, update) => {
    const { validateFields } = this.props.form;
    let _self = this;
    validateFields(update ? ['sourceAddress', 'specification'] : ['tast_add', 'specification_add', 'sourceAddress_add', 'specification'], (err, values) => {
      if (!err) {
        let params = {}
        if (update) {
          if (!sourceAddress) {
            return message.warning('请输入来源名字')
          }
          params = {
            id,
            sourceAddress: values.sourceAddress
          }
        } else {
          params = {
            tast: values.tast_add,
            specification: values.specification_add,
            sourceAddress: values.sourceAddress_add
          }
        }
        saveSourceAddressInfo(params).then(res => {
          if (res.code === 0) {
            message.success('保存来源成功');
            _self.handleQuery(values.specification)
          } else {
            message.error('保存来源失败：' + res.msg);
          }
        })
      }
    })
  }

  handleDelte = (row) => {
    const { validateFields } = this.props.form;
    let _self = this;
    validateFields(['tast', 'specification'], (err, values) => {
      if (!err) {
        if (row.isUse) {
          return Modal.error({
            title: '删除标的物来源',
            content: '该来源已含有价格数据，无法删除！',
          });
        } else {
          Modal.confirm({
            title: '删除标的物来源',
            content: `删除标的物“${values.tast}”的来源“${row.sourceAddress}”吗？`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              deleteInfo(row.id).then(res => {
                if (res.code === 0) {
                  message.success('删除成功');
                  _self.handleQuery(values.specification)
                } else {
                  message.error('删除失败：' + res.msg);
                }
              })
            }
          });
        }
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { key } = this.props.location.query
    const { data, editId, name, name_add, names, attributes, current, page, visible } = this.state;

    const columns = [{
      title: '标的物来源',
      dataIndex: 'sourceAddress',
      key: 'sourceAddress',
      render: (text, row, record) => editId !== null && editId === row.id ? <FormItem>
        {
          getFieldDecorator('sourceAddress', {
            initialValue: text
          })(
            <Input style={{ width: 240 }} placeholder="来源名称" />
          )
        }
      </FormItem> : text,
      width: '40%'
    }, {
      title: '是否使用',
      dataIndex: 'isUse',
      key: 'isUse',
      render: (text, row) => text ? <Icon style={{ color: '#52C41A', fontSize: 17 }} type="check-circle" theme="filled" /> :
        <Icon style={{ color: '#F5222D', fontSize: 17 }} type="close-circle" theme="filled" />,
      width: '20%'
    }, {
      title: '操作',
      key: 'action',
      render: (text, row, record) => editId !== null && editId === row.id ?
        <div>
          <span onClick={this.handleSave.bind(this, row.id, true)} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>保存</span>
          <span onClick={() => this.setState({ editId: null })} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer' }}>取消</span>
        </div> :
        <div>
          <span onClick={() => this.setState({ editId: row.id })} style={{ fontSize: 14, color: '#1890FF', cursor: 'pointer', marginRight: 12 }}>编辑规格</span>
          <span onClick={this.handleDelte.bind(this, row)} style={row.isUse ? { fontSize: 14, color: 'rgba(0,0,0,0.45)', cursor: 'pointer' }
            : { fontSize: 14, color: '#1890FF', cursor: 'pointer' }}>删除</span>
        </div>,
      width: '40%'
    }]
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to="/home">首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/macrofinance/MacroIndex">数据仓库</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/subjectMatterInfo">标的物信息</Link></Breadcrumb.Item>
            <Breadcrumb.Item><Link to="/ods/subjectMatterInfo/list">标的物列表</Link></Breadcrumb.Item>
            <Breadcrumb.Item>来源管理</Breadcrumb.Item>
          </Breadcrumb>

          <h2>标的物来源数据</h2>

          <Row type="flex" justify="space-between" align="middle">
            <Col>
              <span>操作：可编辑、添加和删除指定标的物的来源属性。</span>
            </Col>
            <Col>
              <Button onClick={() => this.setState({ visible: true })} icon="plus" type='primary' style={{ marginRight: 16 }}>添加新来源</Button>
              <Button onClick={() => router.goBack()} icon="rollback" type='primary'>返回</Button>
            </Col>
          </Row>
        </div>

        <div className={styles.select}>
          <FormItem label="选择标的物">
            {
              getFieldDecorator('tast')(
                <Select
                  style={{ width: 240 }}
                  placeholder="请选择"
                  onChange={(value) => this.changeName(value)}
                >
                  {
                    names.length !== 0 && names.map((item, i) => <Option value={item} key={i}>{item}</Option>)
                  }
                </Select>
              )
            }
            {
              getFieldDecorator('specification')(
                <Select
                  style={{ width: 240, marginLeft: 16 }}
                  placeholder="选择标的物规格"
                  onSelect={value => this.handleQuery(value)}
                >
                  {
                    name && attributes[name] && attributes[name].length !== 0 && attributes[name].map((item, i) => <Option value={item} key={i}>{item}</Option>)
                  }
                </Select>
              )
            }
          </FormItem>
        </div>

        <div className={styles.body}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={data}
            pagination={{
              showQuickJumper: true,
              current: current,
              pageSize: 10,
              total: page.totalRecords,
              onChange: this.currentChange,
              showTotal: (total, range) => `共 ${page.totalRecords} 条记录 第 ${current} / ${page.totalPage} 页`,
            }}
          />
        </div>

        <Modal
          title="添加新来源"
          visible={visible}
          onOk={this.handleSave.bind(this, null, false)}
          onCancel={() => this.setState({ visible: false })}
        >
          <Form className={styles.moadlForm}>
            <FormItem label="标的物名称">
              {
                getFieldDecorator('tast_add', {
                  rules: [{ required: true, message: '请选择标的物名称' }]
                })(
                  <Select
                    style={{ width: 240 }}
                    placeholder="请选择"
                    onChange={(value) => this.changeNameAdd(value)}
                  >
                    {
                      names.length !== 0 && names.map((item, i) => <Option value={item} key={i}>{item}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="标的物规格">
              {
                getFieldDecorator('specification_add', {
                  rules: [{ required: true, message: '请选择标的物规格' }]
                })(
                  <Select
                    style={{ width: 240 }}
                    placeholder="请选择标的物规格"
                  >
                    {
                      name_add && attributes[name_add].length !== 0 && attributes[name_add].map((item, i) => <Option value={item} key={i}>{item}</Option>)
                    }
                  </Select>
                )
              }
            </FormItem>
            <FormItem label="来源名称">
              {
                getFieldDecorator('sourceAddress_add', {
                  rules: [{ required: true, message: '请输入来源名称' }]
                })(
                  <Input style={{ width: 240, }} placeholder="请输入来源名称" />
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    )
  }
}
