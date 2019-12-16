# -*- coding: utf-8 -*-
import scrapy, json
from dishonestyZhixing.items import DishonestyzhixingItem

class DishonestyzhixingspiderSpider(scrapy.Spider):
    name = 'dishonestyZhixingSpider'
    allowed_domains = ['creditchina.gov.cn']
    url = 'https://www.creditchina.gov.cn/api/credit_info_search?objectType=2&templateId=1&page={}&pageSize=10'

    offset = 1
    # 起始url
    start_urls = [url.format(str(offset))]

    def parse(self, response):
        response = json.loads(response.text)
        results = response['data']['results']
        totalPageCount = response['data']['totalPageCount']
        for result in results:
            item = DishonestyzhixingItem()
            item['name'] = result.get('name', '')
            item['dishonestyCount'] = result.get('dishonestyCount', '')
            item['idCardOrOrgCode'] = result.get('idCardOrOrgCode', '')
            yield item

        if self.offset < totalPageCount:
            self.offset += 1

        # 每次处理完一页的数据之后，重新发送下一页页面请求
        # self.offset自增10，同时拼接为新的url，并调用回调函数self.parse处理Response
        yield scrapy.Request(self.url.format(str(self.offset)), callback=self.parse)
