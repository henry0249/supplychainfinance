# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html
import json


class KeymonitoringPipeline(object):
    def __init__(self):
        self.filename = '../keyMonitoring.json'

    def process_item(self, item, spider):
        text = json.dumps(dict(item), ensure_ascii=False) + "\n"
        with open(self.filename, 'a+') as f:
            f.write(text.encode('utf-8'))
        return item
