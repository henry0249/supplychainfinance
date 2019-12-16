import React, { Component } from "react";
import styles from "./index.less";
import { Select, Form, Button, Input, Table, message, Icon, DatePicker,Cascader } from "antd";
import { request } from "../../../common";
import moment from "moment";
import router from "umi/router";
import withRouter from "umi/withRouter";
import {getAllCompanys} from './services'
import apis from '../../apis'

const FormItem = Form.Item;
const { Option } = Select;
const api = apis.getComList.api();
const { RangePicker } = DatePicker;

@withRouter
@Form.create()
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      totalRecords: 0,
      params: '',
      levelTitle: "全部",
      levelNow: "0",
      statusTitle: "全部",
      statusNow: "3",
      resulTypeData: {},
      allCompanys:[],
      enterpriseId:''
    };
  }

  componentDidMount() {
    this.getDefaultData();
    let id = null
    const big=[1,2,3,4]
    const small =[1,3,4]
    for(let i =0;i<big.length;i++){
      if(small.indexOf(big[i]) === -1){
        id=big[i]
      }
    }
    console.log(id)
  }
  //获取默认数据
  getDefaultData = () => {
    request(api + `?currentPage=1&pageSize=10`, {
      method: "POST",
      body: {}
    }).then(res => {
      console.log(res)
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        });
        getAllCompanys().then(resp => {
          if (resp && resp.code === 0) {
            this.setState({
              allCompanys:resp.data
            })
          } else {
            message.error(res.message)              
          }
        });
      } else if (res) {
        message.error(res.msg);
      } else {
        message.error("获取列表失败，请刷新重试");
      }
    })
  };
  onChange = current => {
    const { pageSize, params } = this.state;
    request(api + `?currentPage=${current}&pageSize=${pageSize}`, {
      method: "POST",
      body:params
    }).then(res => {
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        });
      } else if (res) {
        message.error(res.msg);
      } else {
        message.error("获取列表失败，请刷新重试");
      }
    });
  };

  onShowSizeChange=(current, size)=>{
    const { params } = this.state
    request(api + `?currentPage=1&pageSize=${size}`, {
      method: "POST",
      body: params,
    }).then(res => {
      console.log(res)
      if (res && res.code === 0) {
        this.setState({
          data: res.data,
          ...res.page
        });
      } else if (res) {
        message.error(res.msg);
      } else {
        message.error("获取列表失败，请刷新重试");
      }
    })
  }

  handleSearch = () => {
    const { validateFields } = this.props.form;
    const { pageSize,enterpriseId } = this.state;
    validateFields((err, values) => {
      if (!err) {
        let params = {};
        if (values.name) {
          params['name'] = values.name
        }
        if (values.time) {
          params['start'] = moment(values['time'][0]).format('YYYY-MM-DD HH:mm:ss');
          params['end'] = moment(values['time'][1]).format('YYYY-MM-DD HH:mm:ss')
        }
        if (enterpriseId) {
          params['enterpriseId'] = enterpriseId
        }
        request(api + `?currentPage=1&pageSize=${pageSize}`, {
          method: "POST",
          body: params
        }).then(res => {
          if (res && res.code === 0) {
            this.setState({
              data: res.data,
              params: params,
              ...res.page
            });
          } else if (res) {
            this.setState({
              data: [],
              currentPage: 1,
              pageSize: 10,
              totalPage: 0,
              totalRecords: 0,
            });
          } else {
            message.error("获取列表失败，请刷新重试");
          }
        });
      }
    });
  };
  handleJump = (id) => {
    router.push(
      `/companyManage/detail?id=${id}`
    );
  };
  //切换优先级
  clickLevel = (key, title) => {
    let newData = [];
    if (title === "全部") {
      this.getDefaultData();
    } else {
      newData = data.filter(item => {
        return (item.title = title);
      });
    }
    this.setState({
      levelNow: key,
      levelTitle: title
    });
  };
  //切换状态
  clickStatus = (key, title) => {
    const { data } = this.state;
    if (title === "全部") {
      this.getDefaultData();
    } else {
      newData = data.filter(item => {
        return (item.title = title);
      });
    }
    this.setState({
      statusNow: key,
      statusTitle: title
    });
  };

  history=(row)=>{
    router.push(`/companyManage/companyList/oldSet?id=${row.id}`)
  }

  quanxian=(row)=>{
    console.log(row)
    router.push(`/companyManage/companyList/setRight?id=${row.id}`)
  }
  addOnChange = value => {
    let num = value.length-1
    this.setState({
      enterpriseId: value[num]
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      data,
      currentPage,
      pageSize,
      totalPage,
      totalRecords,
      resulTypeData,
      allCompanys
    } = this.state;
    const columns = [
      {
        title: "公司名称",
        dataIndex: "name",
        key: "name",
        width:'15%',
      },
      {
        title: "上级公司",
        dataIndex: "pname",
        key: "pname",
        width:'15%',
      },
      {
        title: "公司地址",
        dataIndex: "address",
        key: "address",
        width:'15%',
        // render: (text, row, record) => (
        //   <div
        //     style={{ width: "250px" }}
        //   >
        //     {row.address}
        //   </div>
        // )
      },
      {
        title: "企业管理员",
        dataIndex: "managers",
        key: "managers",
        width:'15%',
        render: (text, row, index) => {
          let str = ''
          text.length > 0 && text.map((item, i) => {
            str += item.name
            if (i < text.length - 1) {
              str += ','
            }

          })
          // return str
          return <p className={styles.content}>{str}</p>
        }
      },
      {
        title: "状态",
        dataIndex: "deleted",
        key: "deleted",
        width:'10%',
        render: (text, row) => {
          if (text === 1) {
            return <span style={{ color: 'red' }}>已删除</span>
          } else {
            return <span style={{ color: 'green' }}>正常</span>
          }
        }
      },
      {
        title: `创建时间`,
        dataIndex: "createTime",
        key: "createTime",
        width:'10%',
        // sorter: (a, b) => moment(a.createAt) - moment(b.createAt)
      },
      {
        title: `删除时间`,
        dataIndex: "deletedTime",
        key: "deletedTime",
        width:'10%',
        render: (text, row, record) => (
          <span
            onClick={this.handleJump.bind(this, row.type, row.orderBusinessId)}
            style={row.type === 1 || row.type === 4 ? { color: "#4CD398" } : row.type === 5 || row.type === 2 ? { color: "rgb(72, 117, 236)" } : { color: "#F45844" }}
          >
            {row.typeName}
          </span>
        )
      },
      {
        title: "操作",
        width:'10%',
        render: (text, row, record) =>{
          if(row.deleted === 1){
            return <span onClick={this.history.bind(this,row)} style={{color:'#169BD5',cursor:'pointer'}}>历史详情</span>
          }else{
            return <span onClick={this.quanxian.bind(this,row)} style={{color:'#169BD5',cursor:'pointer'}}>权限配置</span>
          }
        }
      }
    ];

    return (
      <div className={styles.container}>
        <h3>企业管理</h3>
        <div className={styles.body}>
          <Form className={styles.top + ' ' + 'topForm'} layout="inline">
            <FormItem style={{ float: "left", marginRight: 100 }} label="企业名称">
              {getFieldDecorator("name")(
                <Input style={{ width: 260 }} placeholder='请输入' />
              )}
            </FormItem>
            {/* <FormItem style={{ marginRight: 50,float: "left" }} label='企业名称'>
              {getFieldDecorator("id", {
                })(
                  <Cascader
                    options={allCompanys}
                    onChange={this.addOnChange}
                    placeholder="请选择"
                    style={{ width: "300px" }}
                  />
                )}
            </FormItem> */}
            <FormItem style={{ float: "left" }} label="创建时间">
              {getFieldDecorator("time")(
                <RangePicker format='YYYY-MM-DD HH:mm:ss' />
              )}
            </FormItem>
            
            <Button type="primary" onClick={this.handleSearch.bind(this)}>
              <Icon type="search" style={{ color: "#fff" }} />搜索
            </Button>
            
          </Form>
          <Button type="primary" onClick={()=>{router.push('/companyManage/companyList/childCompany')}} style={{ color: "#fff",marginTop:'20px',background:'#4875ec' }}>添加企业
            </Button>
          <Table
            className="workTable"
            style={{ marginTop: "20px" }}
            columns={columns}
            dataSource={data}
            rowKey={(i, index) => index}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              defaultCurrent: 1,
              defaultPageSize: 10,
              current: currentPage,
              pageSize: pageSize,
              total: totalRecords,
              onChange: this.onChange.bind(this),
              pageSizeOptions: ["10", "20", "30"],
              showTotal: (total, range) => `共 ${totalRecords} 条记录 第 ${currentPage} / ${totalPage} 页`,
              onShowSizeChange: this.onShowSizeChange.bind(this)
            }}
          />
        </div>
      </div>
    );
  }
}