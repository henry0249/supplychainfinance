import React, { Component, Fragment } from 'react'
import { Icon } from 'antd'
import styles from './index.less'
import { connect } from 'dva';

//'其他补充信息'组件
@connect(({ projectApproval }) => ({
    projectApproval
}))
export default class OtherInfo extends Component {
    
    constructor(props) {
        super()
    }

    render() {
        const { data } = this.props
        let arr = []
        if (data) {
            arr = data.split("&d;")
        }
        return (
            <Fragment>
                {
                    data && data.length > 0
                        ?
                        arr.map((item,index)=>{
                            return <p key={index} style={{overflow:'hidden'}}>{item.split("&b;").join(": ")}</p>
                        })
                        :
                        <div className={styles.otherInfo}>
                            <div>
                                <Icon type="smile" />
                                <span style={{ marginLeft: 10 }}>暂无数据</span>
                            </div>
                            <div>
                            </div>
                        </div>
                }
            </Fragment>
        )
    }
}
OtherInfo.defaultProps = {
    data: [{}]
}
