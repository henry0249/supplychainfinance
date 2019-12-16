import React, { Component } from 'react'
import styles from './index.less'
import { Breadcrumb, Tabs, Button, Icon } from 'antd'
import { connect } from 'dva'
import { getTabs } from '../../services/index'
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
    const type = types.filter(item => item.name === '行业指数')[0];
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
              <Link to='/ods/sectorIndex'>行业指数</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>指数列表</Breadcrumb.Item>
          </Breadcrumb>
          <h2>
          行业指数列表数据
          </h2>
          <div>
            操作：可编辑，不可添加和删除。
<Button className={styles.back} type='primary' ><Link to='/ods/sectorIndex'>返回</Link></Button>
          </div>
        </div>

        <div className={styles.content}>
          <Tabs className={styles.tab} onChange={this.tabOnchange.bind(this)}>
            {tabs.map(item => <TabPane tab={item.name} key={item.id}>
              <Tabs className={styles.tab1} onChange={this.tabOnchange.bind(this)} >
                {item.children && item.children.length ? item.children.map(chird1 => <TabPane tab={chird1.name} key={chird1.id}>
                  <EditTable tabKey={item.key + '-' + chird1.key} unit={chird1.unit} />
                </TabPane>) : null}
              </Tabs>
            </TabPane>)}
          </Tabs>
        </div>

      </div>
    )
  }
}
