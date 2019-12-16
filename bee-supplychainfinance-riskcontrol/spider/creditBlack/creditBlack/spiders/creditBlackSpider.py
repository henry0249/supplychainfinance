# -*- coding: utf-8 -*-
import scrapy, json
from creditBlack.items import CreditblackItem


class CreditblackspiderSpider(scrapy.Spider):
    name = 'creditBlackSpider'
    allowed_domains = ['creditchina.gov.cn']
    url = 'https://www.creditchina.gov.cn/api/credit_info_search?objectType=2&page={}&pageSize=10&creditType=8'

    offset = 1
    # 起始url
    start_urls = [url.format(str(offset))]

    def parse(self, response):
        response = json.loads(response.text)
        results = response['data']['results']
        totalPageCount = response['data']['totalPageCount']
        for result in results:
            item = CreditblackItem()
            item['name'] = result.get('name', '')
            item['idCardOrOrgCode'] = result.get('idCardOrOrgCode', '')
            yield item

        if self.offset < totalPageCount:
            self.offset += 1

        # 每次处理完一页的数据之后，重新发送下一页页面请求
        # self.offset自增10，同时拼接为新的url，并调用回调函数self.parse处理Response
        yield scrapy.Request(self.url.format(str(self.offset)), callback=self.parse)
