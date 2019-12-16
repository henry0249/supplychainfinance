#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
Created on 2019/1/23
@Author: regan
"""
import urllib2, json, os, sys, configparser
from datetime import datetime, timedelta
from elasticsearch import Elasticsearch

today = datetime.now()

dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.dirname(dir))

config_path = os.path.join(os.path.dirname(dir), 'conf', 'project.cfg')

conf = configparser.ConfigParser()
conf.read(config_path)

ip = str(conf.get('es', 'ip'))
port = int(conf.get('es', 'port'))
now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

es = Elasticsearch(hosts=[{"host": ip, "port": port}])
def esQuery(index, type, query, field, applyId):
    query_field = query[0]
    query_value = query[1]
    # query_field = query[0]
    # if isinstance(query[1], int):
    #     query_value = str(query[1])
    # elif isinstance(query[1], str):
    #     query_value = query[1]
    # else:
    #     query_value = query[1].encode('raw_unicode_escape')

    _body = {
        "_source": {"include": field},
        "query": {
            "bool": {
                "must": [
                    {
                        "match_phrase": {
                            query_field: query_value
                        }
                    }
                ]
            }
        }
    }
    if ('index_risk_company' in index) and applyId:
        _body['query']['bool']['must'].append({
            "match_phrase": {
                'applyId': applyId
            }
        })

    code_es = es.search(index, type, _body, size=1000)
    result = []
    for x in code_es['hits']['hits']:
        result.append(x['_source'])
    return result


def esQuery_indexVariable(tastId):
    _body = {
        "_source": {"include": ['indexId']},
        "query": {
            "bool": {
                "must": [
                    {
                        "match_phrase": {
                            'id': tastId
                        }
                    }
                ]
            }
        }
    }

    code_es = es.search('index_risk_subject_matter_info', 'subject_matter_info', _body, size=1000)
    indexId = None
    for x in code_es['hits']['hits']:
        indexId = x['_source']['indexId']

    ndays_ago = (datetime.now() + timedelta(days=-1000)).strftime('%Y-%m-%d')

    _body = {
        "_source": {"include": ['indexValue', 'indexDate']},
        "query": {
            "bool": {
                "must": [
                    {
                        "match_phrase": {
                            'indexId': indexId
                        }
                    }
                ],
                "filter": {
                    "range": {
                        "indexDate": {
                            "gte": ndays_ago,
                            "lte": now
                        }
                    }
                }
            }
        }
    }

    code_es = es.search('index_risk_industry_index', 'industry_index', _body, size=2000)

    result = []

    # 找出最近第一天
    all_days = []
    firstday = today - timedelta(days=366)
    for x in code_es['hits']['hits']:
        if not x['_source']['indexDate']:
            continue
        if str(x['_source']['indexValue']) == '0':
            continue
        indexDate = datetime.strptime(x['_source']['indexDate'], '%Y-%m-%d %H:%M:%S')
        all_days.append(datetime.strftime(indexDate, '%Y-%m-%d %H:%M:%S'))
        if indexDate > firstday:
            firstday = indexDate
    # 获取近6个月的数据
    if firstday.month < 7:
        six_month_ago = str(firstday.year - 1) + '-' + str(firstday.month + 12 - 6).zfill(2) + '-' + str(
            firstday.day).zfill(2) + ' 00:00:00'
    else:
        six_month_ago = str(firstday.year) + '-' + str(firstday.month - 6).zfill(2) + '-' + str(firstday.day).zfill(
            2) + ' 00:00:00'
    for x in sorted(all_days, reverse=True):
        if x <= six_month_ago:
            six_month_ago = x
            break
    six_month_ago = datetime.strptime(six_month_ago, '%Y-%m-%d %H:%M:%S')
    for x in code_es['hits']['hits']:
        if not x['_source']['indexDate']:
            continue
        if str(x['_source']['indexValue']) == '0':
            continue
        indexDate = datetime.strptime(x['_source']['indexDate'], '%Y-%m-%d %H:%M:%S')
        if indexDate >= six_month_ago:
            try:
                if float(x['_source'].get('indexValue', 0)):
                    result.append(
                        str(indexDate.year) + '-' + str(indexDate.month).zfill(2) + '-' + str(indexDate.day).zfill(2) +
                        x['_source']['indexDate'][-9:] + '_' + str(x['_source']['indexValue']))
            except:
                pass
    indexs = []
    for x in sorted(result):
        indexs.append(float(x.split('_')[1]))
    return indexs


def esQuery_SubjectMatterPriceInfo(query, field):
    query_field = query[0]
    query_value = query[1]
    # query_field = query[0]
    # if isinstance(query[1], int):
    #     query_value = str(query[1])
    # elif isinstance(query[1], str):
    #     query_value = query[1]
    # else:
    #     query_value = query[1].encode('raw_unicode_escape')

    two_years_ago = (datetime.now() + timedelta(days=-800)).strftime('%Y-%m-%d')

    _body = {
        "_source": {"include": field},
        "query": {
            "bool": {
                "must": [
                    {
                        "match_phrase": {
                            query_field: query_value
                        }
                    }
                ],
                "filter": {
                    "range": {
                        "priceDate": {
                            "gte": two_years_ago,
                            "lte": now
                        }
                    }
                }
            }
        }
    }

    code_es = es.search('index_risk_subject_matter_price_info', 'subject_matter_price_info', _body, size=1000)

    result = []
    for x in code_es['hits']['hits']:
        result.append(x['_source'])
    return result


if __name__ == '__main__':
    query = ('companyBaseId', '6C81601CF57D46E0AA5A167139F15D19')
    field = ['termStart']
    applyId = '1905080045771022'
    docs1 = esQuery(index='index_risk_company_base_info', type='company_base_info', query=query, field=field, applyId=applyId)
    print docs1
    #query = ('name', docs1[0]['operName'])
    #field = ['companyBaseId']
    #applyId = '1905090151581022'
    #docs2 = esQuery(index='index_risk_company_base_info', type='company_base_info', query=query, field=field, applyId=applyId)
    #print docs2
    #query = ('idCode', docs2[0]['no'])
    #field = ['name']
    #applyId = '1905090151581022'
    #docs3 = esQuery(index='index_risk_creditchina_info', type='dishonesty_zhixing', query=query, field=field, applyId=applyId)
    #print docs3
    #esi = esQuery_SubjectMatterPriceInfo(('sid', 46), ['id', 'priceDate', 'price', 'sid'])
    #print(len(esi))
    # query = ('sid', 1)
    # field = ['id', 'priceDate', 'price', 'sid']
    # esQuery_SubjectMatterPriceInfo(query, field)
