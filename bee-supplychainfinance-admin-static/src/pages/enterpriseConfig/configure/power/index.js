import { Component } from 'react';
import { Form, Icon, Row, Col, Button, Card, Table, Divider, Tooltip, Modal, Input, Select, Checkbox, message } from 'antd';
import withRouter from 'umi/withRouter';
import styles from './index.less';
import {
  getEnterprisePermission,
  getAllRoles,
  getConfigs,
  saveConfigs,
  addRole,
  deleteRole,
  getAllUsers,
  saveUsers,
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
  }

  componentDidMount() {
    const { id } = this.props.location.query;
    getEnterprisePermission({id}).then(res => {
      if (res.code === 0) {
        this.setState({
          roles: res.data
        })
      } else {
        message.error('获取企业下所有企业角色失败：' + res.msg)
      }
    })
    this.getRoles(1);
  }

  getRoles = (currentPage) => {
    const { id } = this.props.location.query;
    getAllRoles({
      currentPage,
      enterpriseId: id
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

  handleAddRole = () => {
    const { validateFields } = this.props.form;
    const { id } = this.props.location.query;
    let _self = this;
    validateFields(['addRoleName', 'permissionId'], (err, values) => {
      if (!err) {
        addRole({
          enterpriseId: id,
          roleName: values.addRoleName,
          permissionId: values.permissionId
        }).then(res => {
          if (res.code === 0) {
            this.setState({
              newVisible: false,
            }, () => {
              message.success('新建权限组成功')
              _self.getRoles(1);
            })
          } else {
            message.error('新建权限组失败：' + res.msg);
          }
        })
      }
    })
  }

  onCurrentChange = (current) => {
    this.getRoles(current)
  }

  handleConfig = (row) => {
    getConfigs(row.roleId).then(res => {
      if (res.code === 0) {
        this.setState({
          rolesModal: row,
          configVisible: true,
          allOptions: res.data.allResource || [],
          options: res.data.allResource || [],
          selectedOptions: res.data.selectResource || [],
          checkedValues: res.data.chosenResourceIds || []
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
    const { validateFields } = this.props.form;
    const { id } = this.props.location.query;
    const { rolesModal, checkedValues } = this.state;
    let params = {
      enterpriseId: id,
      resourceIds: checkedValues,
      roleId: rolesModal.roleId
    }
    let _self = this;
    validateFields(['roleName'], (err, values) => {
      if (!err) {
        params['roleName'] = values.roleName

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
    })
  }

  handleUser = (row) => {
    const { id } = this.props.location.query;
    getAllUsers({ enterpriseId: id, roleId: row.roleId }).then(res => {
      if (res.code === 0) {
        this.setState({
          rolesModal: row,
          userVisible: true,
          allUsers: res.data.allUserList || [],
          users: res.data.allUserList || [],
          selectedUsers: res.data.checkUserList || [],
          checkedUsers: res.data.checkUserIds || []
        })
      } else {
        message.error('获取可选用户失败：' + res.msg)
      }
    })
  }

  searchUser = (value) => {
    const { allUsers } = this.state;
    let users = [];
    allUsers.forEach(item => {
      if (item.userName.indexOf(value) > -1) {
        users.push(item)
      }
    })
    this.setState({ users })
  }

  checkboxUsersChange = (checked, id) => {
    let { users, selectedUsers, checkedUsers } = this.state;
    if (checked) {
      for (let i = 0; i < users.length; i++) {
        if (id === users[i].userId) {
          selectedUsers.push(users[i]);
          checkedUsers.push(id);
          break;
        }
      }
    } else {
      for (let i = 0; i < selectedUsers.length; i++) {
        if (id === selectedUsers[i].userId) {
          selectedUsers.splice(i, 1);
          break;
        }
      }
      for (let j = 0; j < checkedUsers.length; j++) {
        if (id === checkedUsers[j]) {
          checkedUsers.splice(j, 1)
          break;
        }
      }
    }
    this.setState({
      selectedUsers,
      checkedUsers
    })
  }

  saveUser = () => {
    const { validateFields } = this.props.form;
    const { id } = this.props.location.query;
    const { rolesModal, checkedUsers } = this.state;
    let params = {
      enterpriseId: id,
      checkUserIds: checkedUsers,
      roleId: rolesModal.roleId
    }
    let _self = this;
    saveUsers(params).then(res => {
      if (res.code === 0) {
        this.setState({
          userVisible: false,
          rolesModal: {}, // modal配置数据
          allUsers: [], // 原用户数据
          users: [], //渲染用户数据
          selectedUsers: [], //已选中项
          checkedUsers: [], //已选中id集合
        }, () => {
          message.success('保存用户权限成功');
          _self.getRoles(1);
        })
      } else {
        message.error('保存用户权限失败：' + res.msg);
      }
    })
  }

  handleDeleteRole = (row) => {
    let _self = this;
    Modal.confirm({
      title: '删除后该权限组将无法恢复！',
      content: '你还要继续吗？',
      okText: '继续',
      cancelText: '取消',
      onOk: () => {
        deleteRole(row.roleId).then(res => {
          if (res.code === 0) {
            message.success('删除权限组成功');
            _self.getRoles(1);
          } else {
            message.error('删除权限组失败：' + res.msg);
          }
        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      newVisible,
      configVisible,
      userVisible,
      roles,
      rolesData,
      rolesPage,
      rolesModal,
      options,
      selectedOptions,
      checkedValues,
      users,
      selectedUsers,
      checkedUsers,
    } = this.state;
    const columns = [
      {
        title: '权限组名称',
        dataIndex: 'roleName',
        key: 'roleName',
        width: '30%'
      }, {
        title: '企业角色',
        dataIndex: 'permissionName',
        key: 'permissionName',
        width: '20%'
      }, {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: '20%'
      }, {
        title: '操作',
        key: 'action',
        render: (text, row, record) =>
          <div>
            {
              <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={this.handleConfig.bind(this, row)}>配置</span>
            }
            <Divider type="vertical" />
            <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={this.handleUser.bind(this, row)}>用户管理</span>
            <Divider type="vertical" />
            {
              <span style={{ color: '#1890ff', cursor: 'pointer' }} onClick={this.handleDeleteRole.bind(this, row)}>删除</span>
            }
          </div>,
        width: '30%'
      },
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
                <Button onClick={() => this.setState({ newVisible: true })} type="primary" icon="plus">新建权限组</Button>
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

        {newVisible ? <Modal
          centered
          wrapClassName={styles.newModal}
          title="新建权限组"
          visible={newVisible}
          onOk={this.handleAddRole}
          onCancel={() => this.setState({ newVisible: false })}
        >
          <Form layout="inline">
            <FormItem label="权限组名称" style={{ marginBottom: 16 }}>
              {
                getFieldDecorator('addRoleName', {
                  rules: [
                    { required: true, message: '请输入权限组名称' }
                  ]
                })(
                  <Input allowClear={false} style={{ width: 320 }} placeholder="请输入" />
                )
              }
            </FormItem>

            <FormItem label="所属企业角色">
              {
                getFieldDecorator('permissionId', {
                  rules: [
                    { required: true, message: '请选择所属企业角色' }
                  ]
                })(
                  <Select allowClear={false} style={{ width: 320 }} placeholder="请选择">
                    {
                      roles.length && roles.length !== 0 && roles.map(item =>
                        <Option value={item.permissionId} key={item.permissionId}>{item.permissionName}</Option>
                      )
                    }
                  </Select>
                )
              }
            </FormItem>
          </Form>
        </Modal> : null}

        <Modal
          centered
          title="权限组配置"
          visible={configVisible}
          wrapClassName={styles.configModal}
          width={900}
          onOk={this.saveConfig}
          onCancel={() => this.setState({ configVisible: false })}
        >
          <Form layout="inline" hideRequiredMark>
            <Row gutter={24} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <FormItem label="权限组名称">
                  {
                    getFieldDecorator('roleName', {
                      initialValue: rolesModal.roleName,
                      rules: [
                        { required: true, message: '请输入权限组名称' }
                      ]
                    })(
                      <Input allowClear={false} style={{ width: 280 }} placeholder="请输入" />
                    )
                  }
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="所属企业角色">
                  {rolesModal.permissionName}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <FormItem label={`可选策略（共${options.length}条）`}>
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
                  }
                >
                  {
                    options.map(item =>
                      <Checkbox onChange={(e) => this.checkboxChange(e.target.checked, item.resourceId)} checked={checkedValues.includes(item.resourceId)} key={item.resourceId}>
                        <Row>
                          <Col span={12}>{item.parentName}</Col>
                          <Col span={12}>{item.resourceName}</Col>
                        </Row>
                      </Checkbox>
                    )
                  }
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
                    selectedOptions.map(item =>
                      <Row style={{ marginBottom: 12 }} key={item.resourceId}>
                        <Col span={10}>{item.parentName}</Col>
                        <Col span={10}>{item.resourceName}</Col>
                        <Col span={4}>
                          <Icon onClick={this.checkboxChange.bind(this, false, item.resourceId)} type="close" style={{ fontSize: 14, cursor: 'pointer' }} />
                        </Col>
                      </Row>
                    )
                  }
                </Card>
              </Col>
            </Row>
          </Form>
        </Modal>

        <Modal
          centered
          title="用户管理"
          visible={userVisible}
          wrapClassName={styles.userModal}
          width={900}
          onOk={this.saveUser}
          onCancel={() => this.setState({ userVisible: false })}
        >
          <Form layout="inline" hideRequiredMark>
            <Row gutter={24} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <FormItem label="权限组名称">
                  {rolesModal.roleName}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem label="所属企业角色">
                  {rolesModal.permissionName}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24} style={{ marginBottom: 16 }}>
              <Col span={12}>
                <FormItem label={`可选用户（共${users.length || 0}条）`}>
                  <Input.Search allowClear={false} style={{ width: 223 }} placeholder="请输入用户名称" onSearch={value => this.searchUser(value)} />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={12}>
                <Card
                  title={
                    <Row style={{ padding: '0 8px 0 24px', fontSize: 14 }}>
                      <Col span={24}>用户名称</Col>
                    </Row>
                  }
                >
                  {
                    users.map(item =>
                      <Checkbox onChange={(e) => this.checkboxUsersChange(e.target.checked, item.userId)} checked={checkedUsers.includes(item.userId)} key={item.userId}>
                        <Row>
                          <Col span={24}>{item.userName}</Col>
                        </Row>
                      </Checkbox>
                    )
                  }
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  title={
                    <Row style={{ fontSize: 14 }}>
                      <Col span={20}>用户名称</Col>
                      <Col span={4}>操作</Col>
                    </Row>
                  }
                >
                  {
                    selectedUsers.map(item =>
                      <Row style={{ marginBottom: 12 }} key={item.userId}>
                        <Col span={20}>{item.userName}</Col>
                        <Col span={4}>
                          <Icon onClick={this.checkboxUsersChange.bind(this, false, item.userId)} type="close" style={{ fontSize: 14, cursor: 'pointer' }} />
                        </Col>
                      </Row>
                    )
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