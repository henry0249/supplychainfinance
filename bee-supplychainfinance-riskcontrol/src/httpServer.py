#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
Created on 2019/1/30
@Author: regan
"""
import flask
from flask import request
from flask import jsonify
from indexGen import EntrustedProcurement, ConsignmentSales, CompanyGoods_Model
from gevent.pywsgi import WSGIServer
from flask_socketio import SocketIO

server = flask.Flask(__name__)

server.config['JSON_AS_ASCII'] = False
socketio = SocketIO(server)


@server.route('/entrustedProcurement', methods=['get'])
def entrustedProcurement():
    companyEntrustId = request.values.get("companyEntrustId", '')
    companySupplierId = request.values.get("companySupplierId", '')
    companyGoodsId = request.values.get("companyGoodsId", '')
    companyGuaranteeId = request.values.get("companyGuaranteeId", '')
    applyId = request.values.get("applyId", '')
    tastId = request.values.get("tastId", '')
    if (not companyEntrustId) and (not companySupplierId) and (not companyGoodsId) and (not companyGuaranteeId) and (
            not tastId):
        resu = {'code': 999, 'message': '缺少参数'}
        return jsonify(resu)  # 将字典转换为json串, json是字符串
    else:
        entrustedProcurement = EntrustedProcurement(companyEntrustId, companySupplierId, companyGoodsId,
                                                    companyGuaranteeId,
                                                    tastId, applyId)

        # 委托企业相关
        entrustBaseInfo_Index = round(entrustedProcurement.entrustIndex[0], 4)
        guaranteeBaseInfo_Index = round(entrustedProcurement.entrustIndex[1], 4)
        entrustFinancialInfo_Index = round(entrustedProcurement.entrustIndex[2], 4)
        guaranteeFinantialInfo_Index = round(entrustedProcurement.entrustIndex[3], 4)
        entrustCreditInfo_index = round(entrustedProcurement.entrustIndex[4], 4)
        entrustManageInfo_index = round(entrustedProcurement.entrustIndex[5], 4)
        entrustIndex = round(entrustBaseInfo_Index + guaranteeBaseInfo_Index + entrustFinancialInfo_Index + \
                             guaranteeFinantialInfo_Index + entrustCreditInfo_index + entrustManageInfo_index, 4)

        # 供应商相关
        supplierBaseInfo_index = round(entrustedProcurement.supplierIndex[0], 4)
        supplierFinancialInfo_index = round(entrustedProcurement.supplierIndex[1], 4)
        supplierManageInfo_index = round(entrustedProcurement.supplierIndex[2], 4)
        supplierIndex = round(supplierBaseInfo_index + supplierFinancialInfo_index + supplierManageInfo_index, 4)

        # 货代公司相关
        goodsBaseInfo_index = round(entrustedProcurement.goodsIndex[0], 4)
        goodsSubjectInfo_index = round(entrustedProcurement.goodsIndex[1], 4)
        goodsIndex = round(goodsBaseInfo_index + goodsSubjectInfo_index, 4)

        index = round(entrustIndex + supplierIndex + goodsIndex, 4)
        adjustIndex = round(entrustedProcurement.adjustIndex, 4)
        risks = entrustedProcurement.risks
        res = {'code': 200, 'index': index, 'adjustIndex': adjustIndex, 'risks': risks,
               'entrustIndex': entrustIndex, 'supplierIndex': supplierIndex,
               'goodsIndex': goodsIndex, 'entrustBaseInfo_Index': entrustBaseInfo_Index,
               'entrustFinancialInfo_Index': entrustFinancialInfo_Index,
               'guaranteeFinantialInfo_Index': guaranteeFinantialInfo_Index,
               'entrustCreditInfo_index': entrustCreditInfo_index, 'entrustManageInfo_index': entrustManageInfo_index,
               'supplierBaseInfo_index': supplierBaseInfo_index,
               'supplierFinancialInfo_index': supplierFinancialInfo_index,
               'supplierManageInfo_index': supplierManageInfo_index, 'goodsBaseInfo_index': goodsBaseInfo_index,
               'goodsSubjectInfo_index': goodsSubjectInfo_index}
        return jsonify(res)
# http://192.168.1.48:8013/entrustedProcurement?companyEntrustId=6CD9D5A5894440C5B843F7A5ABCDAC83&companySupplierId=20FAF780DB234E988D1E453DA0395141&companyGoodsId=4D5029C903F64991B89AF957A6954AEE&companyGuaranteeId=F204A48961764AF796311D0D85AFD808&tastId=3&applyId=1902200055671005

@server.route('/consignmentSales', methods=['get'])
def consignmentSales():
    companyEntrustId = request.values.get("companyEntrustId", '')
    companyBuierId = request.values.get("companyBuierId", '')
    companyGoodsId = request.values.get("companyGoodsId", '')
    applyId = request.values.get("applyId", '')
    tastId = request.values.get("tastId", '')
    if (not companyEntrustId) and (not companyBuierId) and (not companyGoodsId) and (not tastId) and (not applyId):
        resu = {'code': 999, 'message': '必填参数未填写'}
        return jsonify(resu)  # 将字典转换为json串, json是字符串
    else:
        consignmentSales = ConsignmentSales(companyEntrustId, companyBuierId, companyGoodsId, tastId, applyId)
        # 委托企业相关
        entrustBaseInfo_index = round(consignmentSales.entrustIndex[0], 4)
        entrustFinancialInfo_index = round(consignmentSales.entrustIndex[1], 4)
        entrustCreditInfo_index = round(consignmentSales.entrustIndex[2], 4)
        entrustManageInfo_index = round(consignmentSales.entrustIndex[3], 4)
        entrustIndex = round(
            entrustBaseInfo_index + entrustFinancialInfo_index + entrustCreditInfo_index + entrustManageInfo_index, 4)
        # 购货企业相关
        buierBaseInfo_index = round(consignmentSales.buierIndex[0], 4)
        buierFinancialInfo_index = round(consignmentSales.buierIndex[1], 4)
        buierManageInfo_index = round(consignmentSales.buierIndex[2], 4)
        buierIndex = round(buierBaseInfo_index + buierFinancialInfo_index + buierManageInfo_index, 4)
        # 货代公司相关
        goodsBaseInfo_index = round(consignmentSales.goodsIndex[0], 4)
        goodsSubjectInfo_index = round(consignmentSales.goodsIndex[1], 4)
        goodsIndex = round(goodsBaseInfo_index + goodsSubjectInfo_index, 4)
        index = round(entrustIndex + buierIndex + goodsIndex, 4)
        adjustIndex = round(consignmentSales.adjustIndex, 4)
        risks = consignmentSales.risks
    res = {'code': 200, 'index': index, 'adjustIndex': adjustIndex, 'risks': risks,
           'entrustIndex': entrustIndex, 'goodsIndex': goodsIndex,
           'buierIndex': buierIndex, 'entrustBaseInfo_index': entrustBaseInfo_index,
           'entrustFinancialInfo_index': entrustFinancialInfo_index, 'entrustCreditInfo_index': entrustCreditInfo_index,
           'entrustManageInfo_index': entrustManageInfo_index, 'buierBaseInfo_index': buierBaseInfo_index,
           'buierFinancialInfo_index': buierFinancialInfo_index, 'buierManageInfo_index': buierManageInfo_index,
           'goodsBaseInfo_index': goodsBaseInfo_index, 'goodsSubjectInfo_index': goodsSubjectInfo_index}

    return jsonify(res)
    # http://106.14.2.42:8011/consignmentSales?companyEntrust=”阿里巴巴(中国)网络技术有限公司”&companyBuier=”阿里巴巴(中国)网络技术有限公司”&companyGoods=”阿里巴巴(中国)网络技术有限公司”&tast="烙铁"&applyId="1902210059801022"


@server.route('/companyGoods', methods=['get'])
def companyGoods():
    companyGoodsId = request.values.get("companyGoodsId", '')
    applyId = request.values.get("applyId", '')
    tastId = request.values.get("tastId", '')
    if (not companyGoodsId) or (not applyId) or (not tastId):
        resu = {'code': 999, 'message': '必填参数未填写'}
        return jsonify(resu)  # 将字典转换为json串, json是字符串
    else:
        companyGoods_index = CompanyGoods_Model(companyGoodsId=companyGoodsId, tastId=tastId, applyId=applyId)
        goodsBaseInfo_index = round(companyGoods_index.goodsIndex[0], 4)
        goodsSubjectInfo_index = round(companyGoods_index.goodsIndex[1], 4)
        index = goodsBaseInfo_index + goodsSubjectInfo_index
    res = {'code': 200, 'index': index, 'goodsBaseInfo_index': goodsBaseInfo_index,
           'goodsSubjectInfo_index': goodsSubjectInfo_index}

    return jsonify(res)
    # http://106.14.2.42:8011/companyGoods?companyGoods=”阿里巴巴(中国)网络技术有限公司”&tast="烙铁"&applyId="1902210059801022"


if __name__ == '__main__':
    http_server = WSGIServer(('192.168.1.48', 8011), server)
    http_server.serve_forever()
    # server.run(debug=True, port=8011, host='192.168.1.48')  # 指定端口、host,0.0.0.0代表不管几个网卡，任何ip都可以访问
