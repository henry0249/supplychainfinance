# -*- coding: utf-8 -*-
import scrapy, json
from keyMonitoring.items import KeymonitoringItem


class KeymonitoringspiderSpider(scrapy.Spider):
    name = 'keyMonitoringSpider'
    allowed_domains = ['creditchina.gov.cn']
    url = 'https://www.creditchina.gov.cn/api/EPAndPS/getEpKeyMonitoringCompany?keyword=&page={}&pageSize=10'

    offset = 1
    # 起始url
    start_urls = [url.format(str(offset))]

    def parse(self, response):
        self.totalPageCount = None
        try:
            response = json.loads(response.text)
            results = response['keyMonitoringCompanys']['results']
            if not self.totalPageCount:
                self.totalPageCount = response['keyMonitoringCompanys']['totalPageCount']
        except Exception:
            results = [{}]
        for result in results:
            item = KeymonitoringItem()
            item['name'] = result.get('name', '')
            item['idCardOrOrgCode'] = result.get('legalPersonCode', '')
            yield item
        if self.totalPageCount:
            if self.offset < self.totalPageCount:
                self.offset += 1
        else:
            self.offset += 1

        # 每次处理完一页的数据之后，重新发送下一页页面请求
        # self.offset自增10，同时拼接为新的url，并调用回调函数self.parse处理Response
        yield scrapy.Request(self.url.format(str(self.offset)), callback=self.parse)
