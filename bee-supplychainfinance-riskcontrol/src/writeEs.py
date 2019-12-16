#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
Created on 2019/1/30
@Author: regan
"""

import time, sys, os, json
from elasticsearch import Elasticsearch
from elasticsearch import helpers

dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.dirname(dir))



def data_prepare(doc_name):
    doc_path = os.path.join(os.path.dirname(dir), 'spider', doc_name)
    datas = []
    with open(doc_path, 'r') as f:
        rows = f.readlines()
        for row in rows:
            name = json.loads(row, encoding='utf-8')['name']
            idCode = json.loads(row, encoding='utf-8').get('idCardOrOrgCode', '')
            if name:
                datas.append((name, idCode))
    return datas


def write_data(datas, index, type):
    actions = []
    i = 0
    for data in datas:
        name, idCode = data
        action = {
            "_index": index,
            "_type": type,
            "_id": i,
            "_source": {
                'name': name,
                'idCode': idCode
            }
        }
        i += 1
        actions.append(action)
        if len(action) == 1000:
            helpers.bulk(es, actions)
            del actions[0:len(action)]

    if i > 0:
        helpers.bulk(es, actions)


def main():
    datas = data_prepare('creditBlack.json')
    write_data(datas, 'index_risk_creditchina_info', 'credit_black')
    datas = data_prepare('dishonestyZhixing.json')
    write_data(datas, 'index_risk_creditchina_info', 'dishonesty_zhixing')
    datas = data_prepare('focusOn.json')
    write_data(datas, 'index_risk_creditchina_info', 'focus_on')
    datas = data_prepare('keyMonitoring.json')
    write_data(datas, 'index_risk_creditchina_info', 'key_monitoring')


if __name__ == '__main__':
    es = Elasticsearch('192.168.1.96:9200')
    main()

