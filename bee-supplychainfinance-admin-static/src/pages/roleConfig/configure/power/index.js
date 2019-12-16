import { Component } from 'react';
import { Form, Icon, Row, Col, Button, Card, Table, Divider, Tooltip, Modal, Input, Select, Checkbox, message } from 'antd';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import {
  getRoleByPermission,
  getConfigs,
  saveConfigs,
} from '../../services';

const FormItem = Form.Item;
const Option = Select.Option;

@withRouter
@Form.create()
export default class Index extends Component {
  state = {
    newVisible: false,
    configVisible: false,
    userVisible: false,
    roles: [],
    rolesData: [], // 权限组列表数据
    rolesPage: {
      currentPage: 1,
      pageSize: 5,
      totalPage: 0,
      totalRecords: 0
    },
    rolesModal: {}, // modal配置数据
    allOptions: [], //原策略数据
    options: [], //渲染策略数据
    selectedOptions: [], //已选中项
    checkedValues: [], //已选中id集合
    allUsers: [], // 原用户数据
    users: [], //渲染用户数据
    selectedUsers: [], //已选中项
    checkedUsers: [], //已选中id集合
    permissionName: ''
  }

  componentDidMount() {
    this.getRoles(1);
  }

  getRoles = (currentPage = this.state.rolesPage.currentPage) => {
    const { id } = this.props.location.query;
    getRoleByPermission({
      currentPage,
      id
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          rolesData: res.data,
          rolesPage: res.page
        })
      } else {
        message.error('获取企业下所有权限组失败：' + res.msg)
      }
    })
  }

  onCurrentChange = (current) => {
    this.getRoles(current)
  }

  handleConfig = (row) => {
    const { id } = this.props.location.query;
    getConfigs({
      permissionId: id
    }).then(res => {
      if (res.code === 0) {
        this.setState({
          rolesModal: row,
          configVisible: true,
          allOptions: res.data.allResource || [],
          options: res.data.allResource || [],
          selectedOptions: res.data.selectResource || [],
          checkedValues: res.data.chosenResourceIds || [],
          permissionName: res.data.permissionName
        })
      } else {
        message.error('获取可选策略失败：' + res.msg)
      }
    })
  }

  searchConfig = (value) => {
    const { allOptions } = this.state;
    let options = [];
    allOptions.forEach(item => {
      if (item.resourceName.indexOf(value) > -1) {
        options.push(item)
      }
    })
    this.setState({ options })
  }

  checkboxChange = (checked, id) => {
    let { options, selectedOptions, checkedValues } = this.state;
    if (checked) {
      for (let i = 0; i < options.length; i++) {
        if (id === options[i].resourceId) {
          selectedOptions.push(options[i]);
          checkedValues.push(id);
          break;
        }
      }
    } else {
      for (let i = 0; i < selectedOptions.length; i++) {
        if (id === selectedOptions[i].resourceId) {
          selectedOptions.splice(i, 1);
          break;
        }
      }
      for (let j = 0; j < checkedValues.length; j++) {
        if (id === checkedValues[j]) {
          checkedValues.splice(j, 1)
          break;
        }
      }
    }
    this.setState({
      selectedOptions,
      checkedValues
    })
  }

  saveConfig = () => {
    const { id } = this.props.location.query;
    const { checkedValues } = this.state;
    let params = {
      chosenResourceIds: checkedValues,
      permissionId: id
    }
    let _self = this;
    saveConfigs(params).then(res => {
      if (res.code === 0) {
        this.setState({
          configVisible: false,
          rolesModal: {}, // modal配置数据
          allOptions: [], //原策略数据
          options: [], //渲染策略数据
          selectedOptions: [], //已选中项
          checkedValues: [], //已选中id集合
        }, () => {
          message.success('保存配置成功');
          _self.getRoles(1);
        })
      } else {
        message.error('保存配置失败：' + res.msg);
      }
    })
  }


  render() {
    const {
      configVisible,
      rolesData,
      rolesPage,
      rolesModal,
      options,
      selectedOptions,
      checkedValues,
      permissionName
    } = this.state;
    const columns = [
      {
        title: '模块',
        dataIndex: 'parentName',
        key: 'parentName',
        width: '30%'
      }, {
        title: '权限',
        dataIndex: 'resourceName',
        key: 'resourceName',
        width: '20%'
      }, {
        title: '修改时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        width: '20%'
      }
    ];
    return (
      <div className={styles.container}>
        <div className={styles.body}>
          <Row>
            <Card
              title="权限组"
              bordered={false}
              style={{ marginBottom: 16 }}
            >
              <Row type="flex" justify="end" style={{ marginBottom: 16 }}>
                <Button onClick={this.handleConfig.bind(this)} type="primary" >配置策略池</Button>
              </Row>
              <Row>
                <Table
                  rowKey="roleId"
                  dataSource={rolesData}
                  columns={columns}
                  pagination={{
                    size: 'small',
                    current: rolesPage.currentPage,
                    pageSize: rolesPage.pageSize,
                    total: rolesPage.totalRecords,
                    onChange: this.onCurrentChange.bind(this),
                    showTotal: (total, range) => `共 ${rolesPage.totalRecords} 条记录 第 ${rolesPage.currentPage} / ${rolesPage.totalPage} 页`,
                  }}
                />
              </Row>
            </Card>
          </Row>
        </div>

        <Modal
          centered
          title="配置策略池"
          visible={configVisible}
          wrapClassName={styles.configModal}
          width={900}
          onOk={this.saveConfig}
          onCancel={() => this.setState({ configVisible: false })}
        >
          <Form layout="inline" hideRequiredMark>
            <Row gutter={24} style={{ marginBottom: 24 }}>
              <Col span={18}>
                所属企业角色：{permissionName}
              </Col>
              {/* <Col span={12}>
                <FormItem label="所属企业角色">
                  {rolesModal.permissionName}
                </FormItem>
              </Col> */}
            </Row>
            <Row gutter={24} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <FormItem label={`可选策略（共${options.length || 0}条）`}>
                  <Input.Search allowClear={false} style={{ width: 223 }} placeholder="请输入策略名称" onSearch={value => this.searchConfig(value)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Card
                  title={
                    <Row style={{ padding: '0 8px 0 24px', fontSize: 14 }}>
                      <Col span={12}>模块</Col>
                      <Col span={12}>权限</Col>
                    </Row>
                  }>
                  {options.map(item =>
                    <Checkbox onChange={(e) => this.checkboxChange(e.target.checked, item.resourceId)} checked={checkedValues.includes(item.resourceId)} key={item.resourceId}>
                      <Row>
                        <Col span={12}>{item.parentName}</Col>
                        <Col span={12}>{item.resourceName}</Col>
                      </Row>
                    </Checkbox>
                  )}
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title={
                    <Row style={{ fontSize: 14 }}>
                      <Col span={10}>模块</Col>
                      <Col span={10}>权限</Col>
                      <Col span={4}>操作</Col>
                    </Row>
                  }
                >
                  {
                    selectedOptions.map(item => (
                      <Row style={{ marginBottom: 12 }} key={item.resourceId}>
                        <Col span={10}>{item.parentName}</Col>
                        <Col span={10}>{item.resourceName}</Col>
                        <Col span={4}>
                          <Icon onClick={this.checkboxChange.bind(this, false, item.resourceId)} type="close" style={{ fontSize: 14, cursor: 'pointer' }} />
                        </Col>
                      </Row>
                    ))
                  }
                </Card>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}