import React, { Component } from 'react'
import styles from './index.less'
import { Breadcrumb, Tabs, Button, Spin, message } from 'antd'
const { TabPane } = Tabs;
import EditTable from './editTable'
import { connect } from 'dva'
import { getTabs } from '../../../services/index'
import { Link } from 'react-router-dom';

@connect(({ ods }) => ({ tabTypes: ods.tabTypes }))
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: []
    };

  }

  componentDidMount() {
    let { tabTypes, dispatch } = this.props
    if (tabTypes && tabTypes.length) {
      this.getTabs(tabTypes)
    } else {
      dispatch({
        type: 'ods/getTabTypes',
        payload: {},
        callback: tabTypes => {
          this.getTabs(tabTypes)
        }
      })
    }
  }

  getTabs(types) {
    if (!types || !types.length) {
      message.error('分类为空')
      return
    }
    const type = types.filter(item => item.name === '经济增长')[0];
    if (type) {
      getTabs(type.key).then(res => {
        if (res.code === 0) {
          this.setState({
            tabs: res.data
          })
        }
      })
    }
  }
  tabOnchange() {

  }
  render() {
    const { tabs } = this.state
    return (
      <div className={styles.app}>
        <div className={styles.header}>
          <Breadcrumb>
            <Breadcrumb.Item> <Link to='/'>首页</Link></Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to='/ods/macrofinance/MacroIndex'>数据仓库 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Link to='/ods/macrofinance/MacroIndex'>宏观经济数据 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item><Link to='/ods/macrofinance/macroEconomicGrowth'>经济增长</Link> </Breadcrumb.Item>
            <Breadcrumb.Item>编辑数据</Breadcrumb.Item>
          </Breadcrumb>

          <h2>
            经济增长相关数据
          </h2>
          <div>操作：仅编辑,不可添加和删除；更新频率：每月；更新方式：人工输入。
<Button className={styles.back} type='primary'  ><Link to='/ods/macrofinance/macroEconomicGrowth'>返回</Link></Button>
          </div>
        </div>

        <div className={styles.content}>
          {tabs && tabs.length ? <Tabs className={styles.tab} onChange={this.tabOnchange.bind(this)}>
            {tabs.map(item => <TabPane tab={item.name} key={item.id}>
              <Tabs className={styles.tab1} onChange={this.tabOnchange.bind(this)} type="card">
                {item.children && item.children.length ? item.children.map(chird1 => <TabPane tab={chird1.name} key={chird1.id}>
                  <Tabs className={styles.tab2} onChange={this.tabOnchange.bind(this)}>
                    {chird1.children && chird1.children.length ? chird1.children.map(chird2 => <TabPane tab={chird2.name} key={chird2.id}>
                      <EditTable tabKey={chird2.key} unit={chird2.unit} options={chird2.options || false} />
                    </TabPane>) : null}
                  </Tabs>
                </TabPane>) : null}
              </Tabs>
            </TabPane>)}
          </Tabs> : <Spin />}
        </div>

      </div>
    )
  }
}
