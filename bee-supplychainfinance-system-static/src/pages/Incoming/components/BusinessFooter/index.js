import React, { Fragment, Component } from "react";
import { connect } from "dva";
import { Form, Input, Button, Card, Row, Col, Icon, Select } from "antd";

import { FileUpload } from "@/components";
import styles from "./index.less";

let id = 0;
const InputGroup = Input.Group;
const Option = Select.Option;
@connect(({ incomingstep, loading }) => ({
  incomingstep
}))
class SecondStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProved: true,
      addTitleData: [],
      addValue: [],
      WTCGQTXX: [],
      WTXSQTXX: [],
      JRCCQTXX: [],
      file:[],
      keys: []
    };
  }
  componentDidMount() {
    const { dispatch, type, getData } = this.props;
    const writeBack = (newData) => {
      const {additionalInformation} = newData
      const arr = additionalInformation.split("&d;")
      const nextKeys = []
      for (let i = 0;i<arr.length;i++) {
        nextKeys.push(i+1)
      }
      let obj1 = {}
      let obj2 = {}
      arr.forEach((item, index) => {
        obj1["addts"+(index+1)] = item.split("&b;")[0];
        obj1["names"+(index+1)] = String(item.split("&b;")[1]);
      })
      id = nextKeys.length
      this.setState({
        keys: nextKeys,
      }, () => {
        this.props.rcForm.setFieldsValue({
          ...obj1
        })
      });
    }
    switch (type) {
      case "p":
        dispatch({
          type: "incomingstep/getSelect",
          payload: "WTCGQTXX",
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState({
                WTCGQTXX: data
              });
            }
          }
        });
        break;
      case "L":
        dispatch({
          type: "incomingstep/getSelect",
          payload: "DQYWTCGQTXX",
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState({
                WTCGQTXX: data
              });
            }
          }
        });
        break;
      case "s":
        dispatch({
          type: "incomingstep/getSelect",
          payload: "WTXSQTXX",
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState({
                WTXSQTXX: data
              });
            }
          }
        });
        break;
      case "w":
        dispatch({
          type: "incomingstep/getSelect",
          payload: "JRCCQTXX",
          callback: (code, msg, data) => {
            if (code === 0) {
              this.setState({
                JRCCQTXX: data
              });
            }
          }
        });
        break;
      default:
        break;
    }
    switch(type) {
      case "p":
        if(getData.entrustBuyDetailDTO) {
          this.setState({
            newData: getData.entrustBuyDetailDTO
          },() => {
            const { newData } = this.state
            if (newData) {
              if (newData.additionalInformation) {
                writeBack(newData)
              }
            }
          })
        }
        break;
      case "L":
        if(getData.largeEntrustBuyDetailDTO) {
          this.setState({
            newData: getData.largeEntrustBuyDetailDTO
          },() => {
            const { newData } = this.state
            if (newData) {
              if (newData.additionalInformation) {
                writeBack(newData)
              }
            }
          })
        }
        break;
      case "s":
        if(getData.entrustSaleDetailDTO) {
          this.setState({
            newData: getData.entrustSaleDetailDTO
          },() => {
            const { newData } = this.state
            if (newData) {
              if (newData.additionalInformation) {
                writeBack(newData)
              }
            }
          })
        }
        break;
      case "w":
        if(getData.financeStorageDetailDTO) {
          this.setState({
            newData: getData.financeStorageDetailDTO
          },() => {
            const { newData } = this.state
            if (newData) {
              if (newData.additionalInformation) {
                writeBack(newData)
              }
            }
          })
        }
        break;
    }

  }
  remove = k => {
    const keys = this.state.keys;
    if (keys.length < 1) {
      return;
    }
    this.setState({
      keys: keys.filter(key => key !== k)
    });
  };

  add = () => {
    const keys = this.state.keys
    let nextKeys = [];
    nextKeys = keys.concat(++id);
    this.setState({
      keys: nextKeys
    });
  };

  onRemove = (value) => {
    let url = ""
    let arr = []
    const { dispatch, id } = this.props
    const { file, applyId } = this.state
    if (value.response ? value.response.code === 0 : false) {
      url = value.response.data.access_url
       arr = file.filter(item => {
        return item.fileUrl !== url
      })
    }
    this.setState({
      file: arr
    })
    dispatch({
      type: "incomingstep/setSecondData",
      payload: {
        ...this.props.incomingstep.buyFirstPartTwo,
        otherFileInfoList: arr,
        applyId: id
      }
    });
  }

  titleChange = e => {};

  InputValue = value => {};

  fileUpload=(value)=>{
    const {id,applyId} =this.props
    let params = {
      fileName:value.name,
      fileUrl:value.value
    }
    let newFile = [].concat(this.state.file)
    newFile.push(params)
    this.setState({
      file:newFile
    })
    this.props.rcForm.setFieldsValue({
      file: newFile
    })
    this.props.dispatch({
      type: "incomingstep/setSecondData",
      payload: { ...this.props.incomingstep.buyFirstPartTwo,otherFileInfoList:newFile,applyId: id}
    });
  }

  render() {
    const { isProved, WTCGQTXX, WTXSQTXX, JRCCQTXX } = this.state;
    const { rcForm, data, dispatch, submitting, type } = this.props;
    const { getFieldDecorator, validateFields, getFieldValue } = rcForm;
    const keys = this.state.keys;
    const formItems = keys.map((k, index) => (
      <Form.Item required={false} key={k}>
        {getFieldDecorator(`addts${k}`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              whitespace: true,
              message: "Please input passenger's name or delete this field."
            }
          ]
        })(
          <Select
            style={{ width: "13%", marginLeft: "6%" }}
            placeholder={"请选择"}
            onChange={this.titleChange}
          >
            {type === "p" || type === 'L'
              ? WTCGQTXX[0]
                ? WTCGQTXX.map(item => {
                    return (
                      <Option key={item.sysCode} value={item.sysCodeVal}>
                        {item.sysCodeVal}
                      </Option>
                    );
                  })
                : null
              : type === "s"
              ? WTXSQTXX[0]
                ? WTXSQTXX.map(item => {
                    return (
                      <Option key={item.sysCode} value={item.sysCodeVal}>
                        {item.sysCodeVal}
                      </Option>
                    );
                  })
                : null
              : type === "w"
              ? JRCCQTXX[0]
                ? JRCCQTXX.map(item => {
                    return (
                      <Option key={item.sysCode} value={item.sysCodeVal}>
                        {item.sysCodeVal}
                      </Option>
                    );
                  })
                : null
              : null}
          </Select>
        )}
        --
        {getFieldDecorator(`names${k}`, {
          validateTrigger: ["onChange", "onBlur"],
          rules: [
            {
              whitespace: true,
              message: "请填入补充信息"
            }
          ]
        })(
            <Input
              style={{ width: "52%" }}
              className={styles.addInputBox}
              onChange={this.InputValue}
            />
        )}
          {keys.length > 0 ? (
            <Icon
              className={styles.deleteButton}
              type="minus-circle-o"
              style={{ marginLeft: "10px" }}
              disabled={keys.length < 1}
              onClick={() => this.remove(k)}
            />
            ) : null}
      </Form.Item>
    ));
    return (
      <Fragment>
        <Form layout="vertical" className={styles.stepForm}>
          <div className={styles.addBox}>
            <Card>
              <span>其他补充信息:</span>
              {formItems}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={this.add}
                  style={{ marginLeft: "100px", width: "50%" }}
                >
                  <Icon type="plus" /> 添加
                </Button>
              </Form.Item>
              <Row>
                <Col sm={8} xs={2}>
                  <span style={{ marginRight: "10px" }}>补充资料上传:</span>
                  <FileUpload onChange={this.fileUpload.bind(this)} labelInValue={true} 
                  upLoadProps={
                    {
                      onRemove: this.onRemove //删除附件缓存
                    }
                  }
                  />
                  <p style={{ color: "#ccc", paddingLeft: "100px" }}>
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                  </p>
                </Col>
              </Row>
            </Card>
          </div>
        </Form>
      </Fragment>
    );
  }
}

export default SecondStep;
