import React, { Component } from 'react'
import styles from './index.less'
import { Breadcrumb, Tabs, Button, Icon } from 'antd'
import { connect } from 'dva'
import { getTabs } from '../../../services/index'
import EditTable from './editTable'
import { Link } from 'react-router-dom';

const { TabPane } = Tabs;
@connect(({ ods }) => ({ tabTypes: ods.tabTypes }))
export default class index extends Component {
  constructor(props) {
    super(props);
    this.state = { tabs: [] };

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
    const type = types.filter(item => item.name === '通货膨胀')[0];
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
              <Link to='/ods/macrofinance/MacroIndex'>宏观经济</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item><Link to='/ods/macrofinance/macroInflation'>通货膨胀</Link> </Breadcrumb.Item>
            <Breadcrumb.Item>编辑数据</Breadcrumb.Item>
          </Breadcrumb>
          <h2>
            通货膨胀相关数据
          </h2>
          <div>
            <span>操作：仅编辑,不可添加和删除；更新频率：每月；更新方式：人工输入。</span>
            <Button className={styles.back} type='primary' ><Link to='/ods/macrofinance/macroInflation'>返回</Link></Button>
          </div>
        </div>

        <div className={styles.content}>
          <Tabs className={styles.tab} >
            {tabs.map(item => <TabPane tab={item.name} key={item.id}>
              <Tabs className={styles.tab1}  >
                {item.children && item.children.length ? item.children.map(chird1 => <TabPane tab={chird1.name}
                  key={chird1.key}>
                  <EditTable tabKey={chird1.key} unit={chird1.unit} />
                </TabPane>) : null}
              </Tabs>
            </TabPane>)}
          </Tabs>
        </div>
      </div>
    )
  }
}
