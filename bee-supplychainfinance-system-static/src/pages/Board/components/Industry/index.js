import React, { Component } from "react";
import { Row, Col, Card, Tabs, DatePicker } from "antd";
import styles from "./index.less";
import numeral from "numeral";
import { baseUrls, request } from "@/utils/index";

export default class Industry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: []
    };
  }

  componentDidMount() {
    this.getNews();
  }

  getNews() {
    request(baseUrls.beesrvUrls + baseUrls.api.getNews(0, 7), {
      method: "GET",
      headers: {
        sysToken: localStorage.sysToken,
        subSysClientid: "platform-v3.0"
      }
    }).then(resp => {
      if (resp && resp.code === 1) {
        this.setState({
          news: resp.object.content
        });
      }
    });
  }
  render() {
    const { news } = this.state;
    return (
      <div className={styles.industryWrap}>
        <Card title="行业资讯" bordered={false}>
          <Row>
            <Col>
              <div className={styles.salesRank}>
                <ul className={styles.rankingList}>
                  {news.length > 0 ? (
                    news.map((item, i) => (
                      <li key={item.id}>
                        <span
                          className={`${styles.rankingItemNumber} ${
                            i < 3 ? styles.active : ""
                            }`}
                        >
                          {i + 1}
                        </span>
                        <span
                          className={styles.rankingItemTitle}
                          title={item.title}
                          onClick={() =>
                            window.open(
                              baseUrls.beesrvUrls +
                              baseUrls.url.newsDetail(item.id)
                            )
                          }
                        >
                          {item.title}
                        </span>
                        <span className={styles.rankingItemValue}>
                          {/* {item.total} */}
                        </span>
                      </li>
                    ))
                  ) : (
                      <li style={{ textAlign: "center" }}>暂无</li>
                    )}
                </ul>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
