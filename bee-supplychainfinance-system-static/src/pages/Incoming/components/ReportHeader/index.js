import { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "dva";
import { Breadcrumb, Button, Form, Input, message } from "antd";
import styles from "./index.less";
import router from "umi/router";

const FormItem = Form.Item;

@connect(({ incomingstep, loading }) => ({
  incomingstep
}))
// @Form.create({
//   onValuesChange: (props, changedValues, values) => {
//     for (let item in values) {
//       if (values[item] === undefined) {
//         values[item] = "";
//       }
//     }
//     const { applyId, dispatch,type,onChange,valueChange } = props;
//     let toNext =true
//     const partOne = props.incomingstep.buyFirstPartOne
//     const arr = Object.values(values)
//     const bool =  arr.some((item) => item === "")
//     if (bool) {
//       toNext = false
//     }
//     onChange(toNext)
//     dispatch({
//       type: "incomingstep/setFirstData",
//       payload: { ...props.incomingstep.buyFirstPartOne,...values, applyId: applyId }
//     });
//   }
// })
export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newData:{},
      loading: false
    };
  }
  static defaultProps = {
    title: "",
  };

  static propTypes = {
    list: PropTypes.array,
    title: PropTypes.string,
    showInput: PropTypes.bool,
    prev: PropTypes.bool,
    prevFun: PropTypes.func,
    nextFun: PropTypes.func,
    onChange: PropTypes.func
  };
  componentDidMount() {
    const { type, getData, dispatch, applyId,onChange } = this.props;
    const self = this
    if(getData) {
      switch (type) {
        case "p":
          if (Object.keys(getData).length !== 0) {
            this.setState({
              newData: getData.entrustBuyDetailDTO ? getData.entrustBuyDetailDTO : {}
            }, () => {
              dispatch({
                type: "incomingstep/setFirstData",
                payload: { ...self.props.rcForm.getFieldsValue(), applyId: applyId },
              });
            });
          }
          break;
        case "s":
          if (Object.keys(getData).length !== 0) {
            this.setState({
              newData: getData.entrustSaleDetailDTO ? getData.entrustSaleDetailDTO :{}
            }, () => {
              dispatch({
                type: "incomingstep/setFirstData",
                payload: { ...self.props.rcForm.getFieldsValue(), applyId: applyId }
              });
            });
          }
          break;
        case "w":
          if (Object.keys(getData).length !== 0) {
            this.setState({
              newData: getData.financeStorageDetailDTO ? getData.financeStorageDetailDTO : {}
            }, () => {
              dispatch({
                type: "incomingstep/setFirstData",
                payload: { ...self.props.rcForm.getFieldsValue(), applyId: applyId },
              });
            });
          }
          break;
        case "L":
          if (Object.keys(getData).length !== 0) {
            this.setState({
              newData: getData.largeEntrustBuyDetailDTO ? getData.largeEntrustBuyDetailDTO : {}
            }, () => {
              dispatch({
                type: "incomingstep/setFirstData",
                payload: { ...self.props.rcForm.getFieldsValue(), applyId: applyId },
              });
            });
          }
          break;
        default:
          break;
      }
    }
  }
  nextFun = () => {
    const { type, dispatch, step,id, applyId } = this.props;
    const self = this
    this.setState({
      loading: true
    }, () => {
      if (step === 1) {
        this.props.onValidateFormOne("save",() => {
          self.setState({
            loading: false
          })
        })
      } else if (step === 2) {
        this.props.onValidateFormTwo("save",() => {
          self.setState({
            loading: false
          })
        })
        // router.push(`/incoming/purchase/step3?type=${type}&applyId=${applyId}`);
      } else if (step === 3) {
        this.props.onValidateFormThree("save",() => {
          self.setState({
            loading: false
          })
        })
      } else if (step === 4) {
        this.props.onValidateFormFour("save",() => {
          self.setState({
            loading: false
          })
        })
      }
    })
  };
  render() {
    const { newData } =this.state
    const { getFieldDecorator, validateFields } = this.props.rcForm;
    const {
      list,
      title,
      showInput,
      prev,
      prevFun,
      nextFun,
      onChange,
      dispatch
    } = this.props;
    return (
      <div className={styles.header}>
        <div className={styles.crumb}>
          <Breadcrumb>
            {list &&
              list.map((item, index) => (
                <Breadcrumb.Item key={index}> {item} </Breadcrumb.Item>
              ))}
          </Breadcrumb>
          <span className={styles.name}> {title} </span>
          {showInput && (
            <Form layout="inline" className={styles.form}>
              <FormItem label="项目意义">
                {getFieldDecorator("projectSignificance", {
                  initialValue:newData.projectSignificance ? newData.projectSignificance : null,
                  rules: [
                    {
                      max: 20,
                      whitespace: true,
                      required: true,
                      message: "请填写正确的项目意义，最长不超过20字符！"
                    }
                  ]
                })(
                  <Input
                    style={{
                      width: 300
                    }}
                    placeholder="请填写"
                  />
                )}
              </FormItem>
            </Form>
          )}
        </div>
        <div className={styles.btnBox}>
          {prev && prevFun && (
            <Button size="large" onClick={prevFun}>
              上一步
            </Button>
          )}
          <Button type="primary" size="large" onClick={this.nextFun} loading={this.state.loading}>
            保存
          </Button>
        </div>
      </div>
    );
  }
}
