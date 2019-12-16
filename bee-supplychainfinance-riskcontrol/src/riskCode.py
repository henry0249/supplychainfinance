#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
Created on 2019/1/27
@Author: regan
"""
import os, configparser, sys
from rawDataGen import RawDataGen
from datetime import datetime, timedelta
from util import scrapy
from util.ESQuery_url import esQuery
import json

dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.dirname(dir))

now = datetime.now()
confPath = os.path.join(os.path.dirname(dir), 'conf', 'adjustment.cfg')
conf = configparser.ConfigParser()
conf.read(confPath, encoding='utf-8')
riskScore = eval(conf.get('score', 'riskScore'))


class RiskIndex():
    def __init__(self, applyId, saleOrBuy):
        self.applyId = applyId
        self.saleOrBuy = saleOrBuy

    def businessLife(self, companyId, tastId, n=3, upOrDown='down'):
        """
        企业经营年限小于 n 年
        货代企业经营年限大于3年
        :param n:
        :return:
        """
        termStart = RawDataGen(companyId, tastId, self.applyId).CompanyBaseInfo()['termStart']
        if termStart == 'missing' or not termStart:
            return False
        if upOrDown == 'down':
            return True if ((now - termStart) / 365).days <= n else False
        if upOrDown == 'up':
            return True if ((now - termStart) / 365).days > n else False

    def statusAbnormal(self, companyId, tastId):
        """
        企业在工商行政部门登记状态非正常
        货代企业在工商行政部门登记状态非正常
        :return:
        """
        status = RawDataGen(companyId, tastId, self.applyId).CompanyBaseInfo()['status']
        if (u'存续' not in status) and (u'在营' not in status) and (u'在业' not in status) and (u'开业' not in status):
            return True
        return False

    def grossProfitRate(self, companyId, tastId, n=0.05):
        """
        委托企业原料加工销售毛利率小于 n
        :param n:
        :return:
        """
        grossProfitRate = RawDataGen(companyId, tastId, self.applyId).FinanceInfo()['grossProfitRate']
        if 'missing' == grossProfitRate or not grossProfitRate:
            return False
        return True if grossProfitRate < n else False

    def envProcedure(self, companyId, tastId):
        """
        环评手续不齐全
        :return:
        """
        eiaComplete = RawDataGen(companyId, tastId, self.applyId).CompanyOtherInfo()['eiaComplete']
        if 'missing' == eiaComplete or not eiaComplete:
            return False
        return not eiaComplete

    def proLisence(self, companyId, tastId):
        """
        不具有生产许可证
        :return:
        """
        productionCertificate = RawDataGen(companyId, tastId, self.applyId).CompanyOtherInfo()['productionCertificate']
        if 'missing' == productionCertificate or not productionCertificate:
            return False
        return not productionCertificate

    def lastestSafeUndo(self, companyId, tastId):
        """
        最近一次安全评价未通过
        :return:
        """
        latestSafety = RawDataGen(companyId, tastId, self.applyId).CompanyOtherInfo()['latestSafety']
        if 'missing' == latestSafety or not latestSafety:
            return False
        return not latestSafety

    def _get_creditCode(self, companyId):
        docs = esQuery(applyId=self.applyId, index='index_risk_company_base_info', type='company_base_info',
                       query=('companyBaseId', companyId), field=['no', 'name'])
        if len(docs) != 0:
            if docs[0]['no']:
                return docs[0]['no']
        return '--'

    def _get_company(self, companyId):
        docs = esQuery(applyId=self.applyId, index='index_risk_company_base_info', type='company_base_info',
                       query=('companyBaseId', companyId), field=['name'])
        if len(docs) != 0:
            if docs[0]['name']:
                return docs[0]['name']
        return '--'

    def zhixingCM(self, companyId):
        """
        企业命中被执行名单
        货代企业命中被执行名单
        :return:
        """
        query = ('companyBaseId', companyId)
        docs = esQuery(applyId=self.applyId, index='index_risk_company_base_info', type='company_base_info',
                       query=query, field=['creditCode', 'name'])
        creditCode = None
        if len(docs) != 0:
            if docs[0]['creditCode']:
                creditCode = docs[0]['creditCode']
        if not creditCode:
            return False
        try:
            return scrapy.isZhixing('', creditCode)
        except Exception:
            return False

    def zhixingPS(self, companyId, idField):
        """
        法人命中被执行名单
        担保企业法人命中被执行名单
        :return:
        """
        return False
        if self.saleOrBuy == 'sale':
            es_type = 'order_entrust_sale_detail'
            query = ('entrustSaleId', self.applyId)
        else:
            es_type = 'order_entrust_buy_detail'
            query = ('entrustBuyId', self.applyId)

        docs = esQuery(applyId=self.applyId, index=' index_risk_' + es_type, type=es_type,
                       query=query, field=[idField])
        idCard = None
        if len(docs) != 0:
            if docs[0][idField]:
                idCard = docs[0][idField]
        if not idCard:
            return False
        try:
            return scrapy.isZhixing('', idCard)
        except Exception:
            return False

    def zhixingSH(self, companyId, idField):
        """
        第一大股东命中被执行名单
        担保企业法人命中被执行名单
        :return:
        """
        return False
        if self.saleOrBuy == 'sale':
            es_type = 'order_entrust_sale_detail'
            query = ('entrustSaleId', self.applyId)
        else:
            es_type = 'order_entrust_buy_detail'
            query = ('entrustBuyId', self.applyId)

        docs = esQuery(applyId=self.applyId, index=' index_risk_' + es_type, type=es_type,
                       query=query, field=[idField])
        idCard = None
        if len(docs) != 0:
            if docs[0][idField]:
                idCard = docs[0][idField]
        if not idCard:
            return False
        try:
            return scrapy.isZhixing('', idCard)
        except Exception:
            return False


    def dishonestyCM(self, companyId):
        """
        企业命中失信被执行人名单
        货代企业命中失信被执行人名单
        :return:
        """
        query = ('idCode', self._get_creditCode(companyId))
        docs = esQuery(applyId=self.applyId, index='index_risk_creditchina_info', type='dishonesty_zhixing',
                       query=query, field=['name'])
        if len(docs) != 0:
            return True
        return False

    def dishonestyPS(self, companyId, tastId):
        """
        法人命中失信被执行人名单
        担保企业法人命中失信被执行人名单
        :return:
        """
        return False
        LP = RawDataGen(companyId, tastId, self.applyId).CompanyBaseInfo()['operName']
        query = ('operName', LP)
        docs = esQuery(applyId=self.applyId, index='index_risk_company_base_info', type='company_base_info',
                       query=query, field=['no', 'operName'])
        creditCode = None
        if len(docs) != 0:
            if docs[0]['no']:
                creditCode = docs[0]['no']
        if not creditCode:
            return False
        query = ('idCode', creditCode)
        docs = esQuery(applyId=self.applyId, index='index_risk_creditchina_info', type='dishonesty_zhixing',
                       query=query, field=['name'])
        if len(docs) != 0:
            return True
        return False

    def dishonestySH(self, companyId, tastId):
        """
        第一大股东命中失信被执行人名单
        担保企业法人命中失信被执行人名单
        :return:
        """
        SH = RawDataGen(companyId, tastId, self.applyId).CompanyPartners()['largestShareholderName']
        query = ('name', SH)
        docs = esQuery(applyId='', index='index_risk_company_base_info', type='company_base_info',
                       query=query, field=['no', 'name'])

        creditCode = None
        if len(docs) != 0:
            if docs[0]['no']:
                creditCode = docs[0]['no']

        if not creditCode:
            return False
        query = ('idCode', creditCode)
        docs = esQuery(applyId=self.applyId, index='index_risk_creditchina_info', type='dishonesty_zhixing',
                       query=query, field=['name'])
        if len(docs) != 0:
            return True
        return False

    def creditBlackCM(self, companyId):
        """
        企业命中信用黑名单
        货代企业命中信用黑名单
        :return:
        """
        query = ('idCode', self._get_creditCode(companyId))
        docs = esQuery(applyId=self.applyId, index='index_risk_creditchina_info', type='credit_black', query=query,
                       field=['name'])
        if len(docs) != 0:
            return True
        return False

    def creditBlackPS(self, companyId, tastId):
        """
        法人命中信用黑名单
        担保企业法人命中信用黑名单
        :return:
        """
        return False
        LP = RawDataGen(companyId, tastId, self.applyId).CompanyBaseInfo()['operName']
        query = ('operName', LP)
        docs = esQuery(applyId=self.applyId, index='index_risk_company_base_info', type='company_base_info',
                       query=query, field=['no', 'operName'])
        creditCode = None
        if len(docs) != 0:
            if docs[0]['no']:
                creditCode = docs[0]['no']
        if not creditCode:
            return False
        query = ('idCode', creditCode)
        docs = esQuery(applyId=self.applyId, index='index_risk_creditchina_info', type='credit_black', query=query,
                       field=['name'])
        if len(docs) != 0:
            return True
        return False

    def creditBlackSH(self, companyId, tastId):
        """
        第一大股东命中信用黑名单
        担保企业法人命中信用黑名单
        :return:
        """
        SH = RawDataGen(companyId, tastId, self.applyId).CompanyPartners()['largestShareholderName']
        query = ('name', SH)
        docs = esQuery(applyId='', index='index_risk_company_base_info', type='company_base_info',
                       query=query, field=['no', 'name'])
        creditCode = None
        if len(docs) != 0:
            if docs[0]['no']:
                creditCode = docs[0]['no']
        if not creditCode:
            return False
        query = ('idCode', creditCode)
        docs = esQuery(applyId=self.applyId, index='index_risk_creditchina_info', type='credit_black', query=query,
                       field=['name'])
        if len(docs) != 0:
            return True
        return False

    def vipCreaditCM(self, companyId):
        """
        企业命中信用重点关注名单
        货代企业命中信用重点关注名单
        :return:
        """
        query = ('idCode', self._get_creditCode(companyId))
        docs = esQuery(applyId=self.applyId, index='index_risk_creditchina_info', type='focus_on', query=query,
                       field=['name'])
        if len(docs) != 0:
            return True
        return False

    def vipCreaditSH(self, companyId, tastId):
        """
        第一大股东命中信用重点关注名单
        货代企业命中信用重点关注名单
        :return:
        """
        SH = RawDataGen(companyId, tastId, self.applyId).CompanyPartners()['largestShareholderName']
        query = ('name', SH)
        docs = esQuery(applyId='', index='index_risk_company_base_info', type='company_base_info',
                       query=query, field=['no', 'name'])
        creditCode = None
        if len(docs) != 0:
            if docs[0]['no']:
                creditCode = docs[0]['no']
        if not creditCode:
            return False
        query = ('idCode', creditCode)
        docs = esQuery(applyId=self.applyId, index='index_risk_creditchina_info', type='focus_on', query=query,
                       field=['name'])
        if len(docs) != 0:
            return True
        return False

    def keyMonitor(self, companyId):
        """
        重点监控名单
        :return:
        """
        query = ('name', self._get_company(companyId))
        docs = esQuery(applyId=self.applyId, index='index_risk_creditchina_info', type='key_monitoring', query=query,
                       field=['name'])
        if len(docs) != 0:
            return True
        return False

    def dishonestyEP(self, companyId):
        """
        企业命中环保失信黑名单
        :return:
        """
        docs = esQuery(applyId=self.applyId, index='index_risk_company_base_info', type='company_base_info',
                       query=('companyBaseId', companyId), field=['creditCode'])
        creditCode = None
        if len(docs) != 0:
            if docs[0]['creditCode']:
                creditCode = docs[0]['creditCode']
        if not creditCode:
            return False
        query = ('creditId', creditCode)
        docs = esQuery(applyId=self.applyId, index='index_risk_lose_credit_list', type='lose_credit_list', query=query,
                       field=['name'])
        if len(docs) != 0:
            return True
        return False

    def LPChangeNum(self, companyId, tastId, n=2, m=1):
        """
        近 n 年内企业法定代表人变更记录大于等于 m
        担保企业近2年内经营企业法定代表人变更记录大于等于1
        货代企业近2年内经营企业法定代表人变更记录大于等于1
        :return:
        """
        record = 0
        for doc in RawDataGen(companyId, tastId, self.applyId).CompanyChangerecords():
            try:
                if doc['changeDate'] == 'missing' or doc['projectName'] == 'missing':
                    return False
                if doc['changeDate'].strftime('%Y-%m-%d %H:%M:%S') >= (now - timedelta(days=365 * n)).strftime(
                        '%Y-%m-%d %H:%M:%S'):
                    if u'法定代表人变更' in doc['projectName']:
                        record += 1
            except Exception:
                if doc['changeDate'] >= (now - timedelta(days=365 * n)).strftime('%Y-%m-%d %H:%M:%S'):
                    if u'法定代表人变更' in doc['projectName']:
                        record += 1
        return True if record >= m else False

    def CNChangeNum(self, companyId, tastId, n=2):
        """
        近 n 年内企业名称变更记录数大于等于1
        担保企业近2年内经营企业名称变更记录数大于等于1
        货代企业近2年内经营企业名称变更记录数大于等于1
        :return:
        """
        for doc in RawDataGen(companyId, tastId, self.applyId).CompanyChangerecords():
            try:
                if doc['changeDate'] == 'missing' or doc['projectName'] == 'missing':
                    return False
                if doc['changeDate'].strftime('%Y-%m-%d %H:%M:%S') >= (now - timedelta(days=365 * n)).strftime(
                        '%Y-%m-%d %H:%M:%S'):
                    if u'企业名称变更' in doc['projectName'] or u'名称变更' == doc['projectName']:
                        return True
            except Exception:
                if doc['changeDate'] >= (now - timedelta(days=365 * n)).strftime('%Y-%m-%d %H:%M:%S'):
                    if u'企业名称变更' in doc['projectName'] or u'名称变更' == doc['projectName']:
                        return True
        return False

    def SHChangeNum(self, companyId, tastId, n=1):
        """
        近 n 年内企业股东变更记录数大约等于1
        担保企业近2年内经营企业股东变更记录数大约等于1
        货代企业近2年内经营企业股东变更记录数大约等于1
        :return:
        """
        for doc in RawDataGen(companyId, tastId, self.applyId).CompanyChangerecords():
            try:
                if doc['changeDate'] == 'missing' or doc['projectName'] == 'missing':
                    return False
                if doc['changeDate'].strftime('%Y-%m-%d %H:%M:%S') >= (now - timedelta(days=365 * n)).strftime(
                        '%Y-%m-%d %H:%M:%S'):
                    if u'投资人(股权)变更' in doc['projectName'] or u'投资人变更' in doc['projectName']:
                        return True
            except Exception:
                if doc['changeDate'] >= (now - timedelta(days=365 * n)).strftime('%Y-%m-%d %H:%M:%S'):
                    if u'投资人(股权)变更' in doc['projectName'] or u'投资人变更' in doc['projectName']:
                        return True
        return False

    def goodsPurchased(self, companyId, tastId, tastAmount, n=2):
        """
        企业采购货物量异常(大于实际产能 n 倍)
        :return:
        """
        try:
            docs = esQuery(applyId=self.applyId, index='index_risk_order_entrust_buy_detail', type='order_entrust_buy_detail',
                           query=('entrustBuyId', self.applyId), field=['quantity', 'capitalOccupationDays'])
            quantity = None
            capitalOccupationDays = None
            if len(docs) != 0:
                if docs[0]['quantity']:
                    quantity = docs[0]['quantity']
                if docs[0]['capitalOccupationDays']:
                    capitalOccupationDays = docs[0]['capitalOccupationDays']

            if not quantity:
                return False
            if not capitalOccupationDays:
                return False
            query = ('entrustBuyId', self.applyId)
            docs = esQuery(applyId=self.applyId, index='index_risk_order_company_info_buy', type='order_company_info_buy',
                           query=query,
                           field=['dailyConsume'])
            dailyConsume = None
            if len(docs) != 0:
                if docs[0]['dailyConsume']:
                    dailyConsume = docs[0]['dailyConsume']

            if not dailyConsume:
                return False

            return True if float(quantity) / (float(capitalOccupationDays) * float(dailyConsume)) > n else False
            # dailyCapacity = RawDataGen(companyId, tastId, self.applyId).ManagementInfo()['dailyCapacity']
            # if dailyCapacity == 'missing' or not dailyCapacity:
            #     return False
            # return True if tastAmount > dailyCapacity * n else False
        except Exception:
            return False

    def judgementNumCM(self, companyId, tastId):
        """
        企业近两年涉诉案件数大于5
        :return:
        """
        isJudgement = 0
        for doc in RawDataGen(companyId, tastId, self.applyId).CompanyJudgmentdoc():
            if doc['courtYear'] >= now.year - 2:
                isJudgement += 1
        return True if isJudgement > 5 else False

    def judgementNumPS(self, companyId, tastId):
        """
        法人近两年涉诉案件数大于5
        委托企业法人近两年涉诉案件数大于5
        :return:
        """
        isJudgement = 0
        operName = RawDataGen(companyId, tastId, self.applyId).CompanyBaseInfo()['operName']
        for doc in RawDataGen(companyId, tastId, self.applyId).CompanyJudgmentdoc():
            if doc['caseRole'] and doc['caseRole'] != 'missing':
                for one in doc['caseRole']:
                    jtest = one['P']
                    if doc['courtYear'] >= now.year - 2 and operName in jtest:
                        isJudgement += 1
                        break
            # if doc['courtYear'] >= now.year - 2 and operName in doc['caseRole']:
            #     isJudgement += 1
        return True if isJudgement > 5 else False

    def defendantNum(self, subjectId, tastId):
        """
        企业（法人）近两年以被告身份涉诉案件数大于2
        委托企业近两年以被告身份涉诉案件数大于2
        :param subject:
        :return:
        """
        isDefendant = 0
        for doc in RawDataGen(subjectId, tastId, self.applyId).CompanyJudgmentdoc():
            if doc['courtYear'] >= now.year - 2:
                if doc['isDefendant']:
                    isDefendant += 1
        return True if isDefendant > 2 else False

    def defendantNumPS(self, subjectId, tastId):
        """
        企业法人近两年以被告身份涉诉案件数大于2
        :return:
        """
        isDefendant = 0
        operName = RawDataGen(subjectId, tastId, self.applyId).CompanyBaseInfo()['operName']
        for doc in RawDataGen(subjectId, tastId, self.applyId).CompanyJudgmentdoc():
            if doc['caseRole'] and doc['caseRole'] != 'missing':
                for one in doc['caseRole']:
                    jtest = one['P']
                    if doc['courtYear'] >= now.year - 2 and operName in jtest and doc['isDefendant']:
                        isDefendant += 1
                        break
            # if doc['courtYear'] >= now.year - 2 and operName in doc['caseRole'] and doc['isDefendant']:
            #     isDefendant += 1
        return True if isDefendant > 2 else False

    def judgeAmountCM(self, companyId):
        """
        企业近两年涉诉案件金额数大于1000万（无涉诉金额相关数据）
        :return:
        """
        return False

    def judgeAmountPS(self, companyId, tastId):
        """
        法人近两年涉诉案件金额数大于1000万（无涉诉金额相关数据）
        委托企业法人近两年涉案金额数大于100万
        :return:
        """
        LP = RawDataGen(companyId, tastId, self.applyId).CompanyBaseInfo()['operName']
        return False

    def defendantAmountCM(self, companyId, n=100):
        """
        企业近两年以被告身份涉诉案件金额数大于 n 万（无涉诉金额相关数据）
        :return:
        """
        return False

    def defendantAmountPS(self, companyId, tastId, n=100):
        """
        法人近两年以被告身份涉诉案件金额数大于 n 万（无涉诉金额相关数据）
        委托企业法人近两年以被告身份涉案金额数大于50万
        :return:
        """
        LP = RawDataGen(companyId, tastId, self.applyId).CompanyBaseInfo()['operName']
        return False

    def companyInSH(self, subjectAId, subjectBId, tastId):
        """
        【企业】在【股东】中
        委托企业股东中有供货企业
        委托企业股东中有货代企业
        :return:
        """
        return True if self._get_company(subjectBId) in \
                       RawDataGen(subjectAId, tastId, self.applyId).CompanyPartners()[
                           'shareholders'] else False

    def LPInSH(self, subjectAId, subjectBId, tastId):
        """
        【法人】在【股东】中
        委托企业股东中有供货企业法人
        委托企业股东中有货代企业法人
        委托企业法人是供货企业股东
        委托企业法人是货代企业股东
        :return:
        """
        return True if \
            RawDataGen(subjectBId, tastId, self.applyId).CompanyBaseInfo()['operName'] in \
            RawDataGen(subjectAId, tastId, self.applyId).CompanyPartners()['shareholders'] else False

    def LPInLP(self, subjectAId, subjectBId, tastId):
        """
        【法人】是【法人】
        委托企业法人是供货企业法人
        委托企业法人是货代企业法人
        :return:
        """
        return True if \
            RawDataGen(subjectAId, tastId, self.applyId).CompanyBaseInfo()['operName'] == \
            RawDataGen(subjectBId, tastId, self.applyId).CompanyBaseInfo()['operName'] else False


def entrustBuy(companyEntrustId, companySupplierId, companyGoodsId, companyGuaranteeId, tastId, applyId, tastAmount):
    riskIndex = RiskIndex(applyId, 'buy')
    # 委托企业、供应商、货代公司、担保公司、标的物
    adjustments = []
    adjustmentScore = 0
    # 委托企业经营年限小于3年
    if riskIndex.businessLife(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业经营年限小于3年'})
        adjustmentScore += riskScore['低']
    # 委托企业在工商行政部门登记状态非正常
    if riskIndex.statusAbnormal(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业在工商行政部门登记状态非正常'})
        adjustmentScore += riskScore['高']
    # 委托企业原料加工销售毛利率小于2%
    if riskIndex.grossProfitRate(companyEntrustId, tastId, 0.02):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业原料加工销售毛利率小于2%'})
        adjustmentScore += riskScore['高']
    # 环评手续不齐全
    if riskIndex.envProcedure(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'环评手续不齐全'})
        adjustmentScore += riskScore['高']
    # 不具有生产许可证
    if riskIndex.proLisence(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'不具有生产许可证'})
        adjustmentScore += riskScore['高']
    # 最近一次安全评价未通过
    if riskIndex.lastestSafeUndo(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'最近一次安全评价未通过'})
        adjustmentScore += riskScore['高']
    # 委托企业命中被执行名单【需识别验证码，待开发】
    if riskIndex.zhixingCM(companyEntrustId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业命中被执行名单'})
        adjustmentScore += riskScore['高']
    # 委托企业命中失信被执行人名单
    if riskIndex.dishonestyCM(companyEntrustId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业命中失信被执行人名单'})
        adjustmentScore += riskScore['高']
    # 委托企业命中信用黑名单
    if riskIndex.creditBlackCM(companyEntrustId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业命中信用黑名单'})
        adjustmentScore += riskScore['高']
    # 委托企业命中信用重点关注名单
    if riskIndex.vipCreaditCM(companyEntrustId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业命中信用重点关注名单'})
        adjustmentScore += riskScore['高']
    # 委托企业命中环保失信黑名单
    if riskIndex.dishonestyEP(companyEntrustId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业命中环保失信黑名单'})
        adjustmentScore += riskScore['高']
    # 委托企业近2年内经营企业法定代表人变更记录大于等于1
    if riskIndex.LPChangeNum(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近2年内经营企业法定代表人变更记录大于等于1'})
        adjustmentScore += riskScore['中']
    # 委托企业近2年内经营企业名称变更记录数大于等于1
    if riskIndex.CNChangeNum(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近2年内经营企业名称变更记录数大于等于1'})
        adjustmentScore += riskScore['低']
    # 委托企业近2年内经营企业股东变更记录数大约等于1
    if riskIndex.SHChangeNum(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近2年内经营企业股东变更记录数大约等于1'})
        adjustmentScore += riskScore['低']
    # 委托企业采购货物量异常(大于实际产能2倍)
    if riskIndex.goodsPurchased(companyEntrustId, tastId, tastAmount):
        adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业采购货物量异常(大于实际产能2倍)'})
        adjustmentScore += riskScore['中']
    # 委托企业法人命中被执行名单
    if riskIndex.zhixingPS(companyEntrustId, 'clientCorporationIdcard'):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人命中被执行名单'})
        adjustmentScore += riskScore['高']
    # 委托企业法人命中失信被执行人名单PL
    if riskIndex.dishonestyPS(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人命中失信被执行人名单'})
        adjustmentScore += riskScore['高']
    # 委托企业法人命中信用黑名单
    if riskIndex.creditBlackPS(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人命中信用黑名单'})
        adjustmentScore += riskScore['高']
    # 委托企业近两年涉诉案件数大于5
    if riskIndex.judgementNumCM(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近两年涉诉案件数大于5'})
        adjustmentScore += riskScore['中']
    # 委托企业近两年以被告身份涉诉案件数大于2
    if riskIndex.defendantNum(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近两年以被告身份涉诉案件数大于2'})
        adjustmentScore += riskScore['中']
    # 委托企业近两年涉诉案件金额数大于1000万
    if riskIndex.judgeAmountCM(companyEntrustId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近两年涉诉案件金额数大于1000万'})
        adjustmentScore += riskScore['中']
    # 委托企业近两年以被告身份涉诉案件金额数大于100万
    if riskIndex.defendantAmountCM(companyEntrustId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近两年以被告身份涉诉案件金额数大于100万'})
        adjustmentScore += riskScore['高']
    # 委托企业第一大股东命中被执行名单
    if riskIndex.zhixingSH(companyEntrustId, 'clientShareholderIdcard'):
        adjustments.append({'ruleType': 1, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业大股东', 'riskContent': u'委托企业第一大股东命中被执行名单'})
        adjustmentScore += riskScore['高']
    # 委托企业第一大股东命中失信被执行人名单
    if riskIndex.dishonestySH(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业大股东', 'riskContent': u'委托企业第一大股东命中失信被执行人名单'})
        adjustmentScore += riskScore['高']
    # 委托企业第一大股东命中信用黑名单
    if riskIndex.creditBlackSH(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'委托企业大股东', 'riskContent': u'委托企业第一大股东命中信用黑名单'})
        adjustmentScore += riskScore['高']
    # 委托企业第一大股东命中信用重点关注名单
    if riskIndex.vipCreaditSH(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'委托企业大股东', 'riskContent': u'委托企业第一大股东命中信用重点关注名单'})
        adjustmentScore += riskScore['高']
    # 委托企业股东中有供货企业
    if riskIndex.companyInSH(companyEntrustId, companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业股东', 'riskContent': u'委托企业股东中有供货企业'})
        adjustmentScore += riskScore['低']
    # 委托企业股东中有供货企业法人
    if riskIndex.LPInSH(companyEntrustId, companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业股东', 'riskContent': u'委托企业股东中有供货企业法人'})
        adjustmentScore += riskScore['低']

    # 委托企业法人是供货企业股东
    if riskIndex.LPInSH(companySupplierId, companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人是供货企业股东'})
        adjustmentScore += riskScore['低']
    # 委托企业法人是供货企业法人
    if riskIndex.LPInLP(companyEntrustId, companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人是供货企业法人'})
        adjustmentScore += riskScore['低']
    if companyGoodsId:
        # 委托企业股东中有货代企业
        if riskIndex.companyInSH(companyEntrustId, companyGoodsId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                                'ruleObject': u'委托企业股东', 'riskContent': u'委托企业股东中有货代企业'})
            adjustmentScore += riskScore['低']
        # 委托企业股东中有货代企业法人
        if riskIndex.LPInSH(companyEntrustId, companyGoodsId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                                'ruleObject': u'委托企业股东', 'riskContent': u'委托企业股东中有货代企业法人'})
            adjustmentScore += riskScore['低']
        # 委托企业法人是货代企业股东
        if riskIndex.LPInSH(companyGoodsId, companyEntrustId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                                'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人是货代企业股东'})
            adjustmentScore += riskScore['低']
        # 委托企业法人是货代企业法人
        if riskIndex.LPInLP(companyGoodsId, companyEntrustId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                                'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人是货代企业法人'})
            adjustmentScore += riskScore['低']
    # 委托企业法人近两年涉诉案件数大于5
    if riskIndex.judgementNumPS(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人近两年涉诉案件数大于5'})
        adjustmentScore += riskScore['低']
    # 委托企业法人近两年以被告身份涉诉案件数大于2
    if riskIndex.defendantNumPS(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人近两年以被告身份涉诉案件数大于2'})
        adjustmentScore += riskScore['低']
    # 委托企业法人近两年涉案金额数大于100万
    if riskIndex.judgeAmountPS(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人近两年涉案金额数大于100万'})
        adjustmentScore += riskScore['低']
    # 委托企业法人近两年以被告身份涉案金额数大于50万
    if riskIndex.defendantAmountPS(companyEntrustId, tastId, 50):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人近两年以被告身份涉案金额数大于50万'})
        adjustmentScore += riskScore['中']
    # 供货企业经营年限小于等于3年
    if riskIndex.businessLife(companySupplierId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业经营年限小于等于3年'})
        adjustmentScore += riskScore['低']
    # 供货企业在工商行政部门登记状态非正常
    if riskIndex.statusAbnormal(companySupplierId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业在工商行政部门登记状态非正常'})
        adjustmentScore += riskScore['高']
    # 供货企业命中被执行名单
    if riskIndex.zhixingCM(companySupplierId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业命中被执行名单'})
        adjustmentScore += riskScore['高']
    # 供货企业命中失信被执行人名单
    if riskIndex.dishonestyCM(companySupplierId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业命中失信被执行人名单'})
        adjustmentScore += riskScore['高']
    # 供货企业命中信用黑名单
    if riskIndex.creditBlackCM(companySupplierId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业命中信用黑名单'})
        adjustmentScore += riskScore['高']
    # 供货企业命中信用重点关注名单
    if riskIndex.vipCreaditCM(companySupplierId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业命中信用重点关注名单'})
        adjustmentScore += riskScore['高']
    # 供货企业命中环保失信黑名单
    if riskIndex.dishonestyEP(companySupplierId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'黑名单', 'riskLevel': u'低',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业命中环保失信黑名单'})
        adjustmentScore += riskScore['低']
    # 供货企业近2年内经营企业法定代表人变更记录大于等于1
    if riskIndex.LPChangeNum(companySupplierId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业近2年内经营企业法定代表人变更记录大于等于1'})
        adjustmentScore += riskScore['高']
    # 供货企业近2年内经营企业名称变更记录数大于等于1
    if riskIndex.CNChangeNum(companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业近2年内经营企业名称变更记录数大于等于1'})
        adjustmentScore += riskScore['低']
    # 供货企业近2年内经营企业股东变更记录数大约等于1
    if riskIndex.SHChangeNum(companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业近2年内经营企业股东变更记录数大约等于1'})
        adjustmentScore += riskScore['低']
    # 供货企业股东中有委托企业
    if riskIndex.companyInSH(companySupplierId, companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                            'ruleObject': u'供货企业股东', 'riskContent': u'供货企业股东中有委托企业'})
        adjustmentScore += riskScore['低']
    # 供货企业股东中委托业法人
    if riskIndex.LPInSH(companySupplierId, companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'高',
                            'ruleObject': u'供货企业股东', 'riskContent': u'供货企业股东中有委托业法人'})
        adjustmentScore += riskScore['高']
    if companyGoodsId:
        # 供货企业股东中有货代企业
        if riskIndex.companyInSH(companySupplierId, companyGoodsId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                                'ruleObject': u'供货企业股东', 'riskContent': u'供货企业股东中有货代企业'})
            adjustmentScore += riskScore['低']
        # 供货企业股东中有货代企业法人
        if riskIndex.LPInSH(companySupplierId, companyGoodsId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                                'ruleObject': u'供货企业股东', 'riskContent': u'供货企业股东中有货代企业法人'})
            adjustmentScore += riskScore['低']
        # 供货企业法人是货代企业股东
        if riskIndex.LPInSH(companyGoodsId, companySupplierId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                                'ruleObject': u'供货企业法人', 'riskContent': u'供货企业法人是货代企业股东'})
            adjustmentScore += riskScore['低']
        # 供货企业法人是无货代企业法人
        if riskIndex.LPInLP(companyGoodsId, companySupplierId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                                'ruleObject': u'供货企业法人', 'riskContent': u'供货企业法人是无货代企业法人'})
            adjustmentScore += riskScore['低']
    # 供货企业法人委托企业股东
    if riskIndex.LPInSH(companyEntrustId, companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'关联风险', 'riskLevel': u'低',
                            'ruleObject': u'供货企业法人', 'riskContent': u'供货企业法人是委托企业股东'})
        adjustmentScore += riskScore['低']
    # 供货企业法人命中被执行名单
    if riskIndex.zhixingPS(companySupplierId, 'supplierCorporationIdcard'):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'供货企业法人', 'riskContent': u'供货企业法人命中被执行名单'})
        adjustmentScore += riskScore['高']
    # 供货企业法人命中失信被执行人名单
    if riskIndex.dishonestyPS(companySupplierId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'供货企业法人', 'riskContent': u'供货企业法人命中失信被执行人名单'})
        adjustmentScore += riskScore['高']
    # 供货企业法人命中信用黑名单
    if riskIndex.creditBlackPS(companySupplierId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'供货企业法人', 'riskContent': u'供货企业法人命中信用黑名单'})
        adjustmentScore += riskScore['高']
    # 供货企业近两年涉诉案件数大于5
    if riskIndex.judgementNumCM(companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业近两年涉诉案件数大于5'})
        adjustmentScore += riskScore['中']
    # 供货企业近两年以被告身份涉诉案件数大于2
    if riskIndex.defendantNum(companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业近两年以被告身份涉诉案件数大于2'})
        adjustmentScore += riskScore['中']
    # 供货企业近两年涉诉案件金额数大于1000万
    if riskIndex.judgeAmountCM(companySupplierId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业近两年涉诉案件金额数大于1000万'})
        adjustmentScore += riskScore['中']
    # 供货企业近两年以被告身份涉诉案件金额数大于100万
    if riskIndex.defendantAmountCM(companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'高',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业近两年以被告身份涉诉案件金额数大于100万'})
        adjustmentScore += riskScore['高']
    # 供货企业法人近两年涉诉案件数大于5
    if riskIndex.judgementNumPS(companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'供货企业法人', 'riskContent': u'供货企业法人近两年涉诉案件数大于5'})
        adjustmentScore += riskScore['中']
    # 供货企业法人近两年以被告身份涉诉案件数大于2
    if riskIndex.defendantNumPS(companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'供货企业法人', 'riskContent': u'供货企业法人近两年以被告身份涉诉案件数大于2'})
        adjustmentScore += riskScore['中']
    # 供货企业法人近两年涉案金额数大于100万
    if riskIndex.judgeAmountPS(companySupplierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'供货企业法人', 'riskContent': u'供货企业法人近两年涉案金额数大于100万'})
        adjustmentScore += riskScore['中']
    # 供货企业法人近两年以被告身份涉案金额数大于50万
    if riskIndex.defendantAmountPS(companySupplierId, tastId, 50):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'高',
                            'ruleObject': u'供货企业法人', 'riskContent': u'供货企业法人近两年以被告身份涉案金额数大于50万'})
        adjustmentScore += riskScore['高']
    if companyGuaranteeId:
        # 担保企业经营年限小于等于3年
        if riskIndex.businessLife(companyGuaranteeId, tastId, 3, 'down'):
            adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                                'ruleObject': u'担保企业', 'riskContent': u'担保企业经营年限小于等于3年'})
            adjustmentScore += riskScore['低']
        # 担保企业在工商行政部门登记状态非正常
        if riskIndex.statusAbnormal(companyGuaranteeId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                                'ruleObject': u'担保企业', 'riskContent': u'担保企业在工商行政部门登记状态非正常'})
            adjustmentScore += riskScore['高']
        # 担保企业命中被执行名单
        if riskIndex.zhixingCM(companyGuaranteeId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'担保企业', 'riskContent': u'担保企业命中被执行名单'})
            adjustmentScore += riskScore['高']
        # 担保企业命中失信被执行人名单
        if riskIndex.dishonestyCM(companyGuaranteeId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'担保企业', 'riskContent': u'担保企业命中失信被执行人名单'})
            adjustmentScore += riskScore['高']
        # 担保企业命中信用黑名单
        if riskIndex.creditBlackCM(companyGuaranteeId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                                'ruleObject': u'担保企业', 'riskContent': u'担保企业命中信用黑名单'})
            adjustmentScore += riskScore['高']
        # 担保企业命中信用重点关注名单
        if riskIndex.vipCreaditCM(companyGuaranteeId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                                'ruleObject': u'担保企业', 'riskContent': u'担保企业命中信用重点关注名单'})
            adjustmentScore += riskScore['高']
        # 担保企业近2年内经营企业法定代表人变更记录大于等于1
        if riskIndex.LPChangeNum(companyGuaranteeId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'中',
                                'ruleObject': u'担保企业', 'riskContent': u'担保企业近2年内经营企业法定代表人变更记录大于等于1'})
            adjustmentScore += riskScore['中']
        # 担保企业近2年内经营企业名称变更记录数大于等于1
        if riskIndex.CNChangeNum(companyGuaranteeId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                                'ruleObject': u'担保企业', 'riskContent': u'担保企业近2年内经营企业名称变更记录数大于等于1'})
            adjustmentScore += riskScore['低']
        # 担保企业近2年内经营企业股东变更记录数大约等于1
        if riskIndex.SHChangeNum(companyGuaranteeId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                                'ruleObject': u'担保企业', 'riskContent': u'担保企业近2年内经营企业股东变更记录数大约等于1'})
            adjustmentScore += riskScore['低']
        # 担保企业法人命中被执行名单
        if riskIndex.zhixingPS(companyGuaranteeId, 'guarantorCorporationIdcard'):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'担保企业法人', 'riskContent': u'担保企业法人命中被执行名单'})
            adjustmentScore += riskScore['高']
        # 担保企业法人命中失信被执行人名单
        if riskIndex.dishonestyPS(companyGuaranteeId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'担保企业法人', 'riskContent': u'担保企业法人命中失信被执行人名单'})
            adjustmentScore += riskScore['高']
        # 担保企业法人命中信用黑名单
        if riskIndex.creditBlackPS(companyGuaranteeId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                                'ruleObject': u'担保企业法人', 'riskContent': u'担保企业法人命中信用黑名单'})
            adjustmentScore += riskScore['高']
    if companyGoodsId:
        # 货代企业经营年限小于等于3年
        if riskIndex.businessLife(companyGoodsId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业经营年限小于等于3年'})
            adjustmentScore += riskScore['高']
        # 货代企业在工商行政部门登记状态非正常
        if riskIndex.statusAbnormal(companyGoodsId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业在工商行政部门登记状态非正常'})
            adjustmentScore += riskScore['高']
        # 货代企业命中被执行名单
        if riskIndex.zhixingCM(companyGoodsId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业命中被执行名单'})
            adjustmentScore += riskScore['高']
        # 货代企业命中失信被执行人名单
        if riskIndex.dishonestyCM(companyGoodsId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业命中失信被执行人名单'})
            adjustmentScore += riskScore['高']
        # 货代企业命中信用黑名单
        if riskIndex.creditBlackCM(companyGoodsId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业命中信用黑名单'})
            adjustmentScore += riskScore['高']
        # 货代企业命中信用重点关注名单
        if riskIndex.vipCreaditCM(companyGoodsId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业命中信用重点关注名单'})
            adjustmentScore += riskScore['高']
        # 货代企业近2年内经营企业法定代表人变更记录大于等于1
        if riskIndex.LPChangeNum(companyGoodsId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业近2年内经营企业法定代表人变更记录大于等于1'})
            adjustmentScore += riskScore['高']
        # 货代企业近2年内经营企业名称变更记录数大于等于1
        if riskIndex.CNChangeNum(companyGoodsId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业近2年内经营企业名称变更记录数大于等于1'})
            adjustmentScore += riskScore['高']
        # 货代企业近2年内经营企业股东变更记录数大约等于1
        if riskIndex.SHChangeNum(companyGoodsId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业近2年内经营企业股东变更记录数大约等于1'})
            adjustmentScore += riskScore['高']
        # 货代企业法人命中被执行名单
        if riskIndex.zhixingPS(companyGoodsId, 'freightForwardCorporationIdcard'):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业法人', 'riskContent': u'货代企业法人命中被执行名单'})
            adjustmentScore += riskScore['高']
        # 货代企业法人命中失信被执行人名单
        if riskIndex.dishonestyPS(companyGoodsId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业法人', 'riskContent': u'货代企业法人命中失信被执行人名单'})
            adjustmentScore += riskScore['高']
        # 货代企业法人命中信用黑名单
        if riskIndex.creditBlackPS(companyGoodsId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                                'ruleObject': u'货代企业法人', 'riskContent': u'货代企业法人命中信用黑名单'})
            adjustmentScore += riskScore['高']
    # 供货企业命中重点监控名单
    if riskIndex.keyMonitor(companySupplierId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'供货企业', 'riskContent': u'供货企业命中重点监控名单'})
        adjustmentScore += riskScore['高']
    return adjustmentScore, adjustments


def entrustSale(companyEntrustId, companyBuierId, companyGoodsId, tastId, applyId):
    riskIndex = RiskIndex(applyId, 'sale')
    adjustments = []
    adjustmentScore = 0
    # 委托企业经营年限小于等于3年
    if riskIndex.businessLife(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业经营年限小于等于3年'})
        adjustmentScore += riskScore['低']
    # 委托企业在工商行政部门登记状态非正常
    if riskIndex.statusAbnormal(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业在工商行政部门登记状态非正常'})
        adjustmentScore += riskScore['高']
    # 委托企业命中被执行名单
    if riskIndex.zhixingCM(companyEntrustId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业命中被执行名单'})
        adjustmentScore += riskScore['高']
    # 委托企业命中失信被执行人名单
    if riskIndex.dishonestyCM(companyEntrustId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业命中失信被执行人名单'})
        adjustmentScore += riskScore['高']
    # 委托企业命中信用黑名单
    if riskIndex.creditBlackCM(companyEntrustId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业命中信用黑名单'})
        adjustmentScore += riskScore['高']
    # 委托企业命中信用重点关注名单
    if riskIndex.vipCreaditCM(companyEntrustId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业命中信用重点关注名单'})
        adjustmentScore += riskScore['高']
    # 委托企业命中环保失信黑名单
    if riskIndex.dishonestyEP(companyEntrustId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业命中环保失信黑名单'})
        adjustmentScore += riskScore['高']
    # 委托企业近2年内经营企业法定代表人变更记录大于等于1
    if riskIndex.LPChangeNum(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近2年内经营企业法定代表人变更记录大于等于1'})
        adjustmentScore += riskScore['中']
    # 委托企业近2年内经营企业名称变更记录数大于等于1
    if riskIndex.CNChangeNum(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近2年内经营企业名称变更记录数大于等于1'})
        adjustmentScore += riskScore['低']
    # 委托企业近2年内经营企业股东变更记录数大约等于1
    if riskIndex.SHChangeNum(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近2年内经营企业股东变更记录数大约等于1'})
        adjustmentScore += riskScore['低']
    # 委托企业法人命中被执行名单
    if riskIndex.zhixingPS(companyEntrustId, 'clientCorporationIdcard'):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人命中被执行名单'})
        adjustmentScore += riskScore['高']
    # 委托企业法人命中失信被执行人名单
    if riskIndex.dishonestyPS(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人命中失信被执行人名单'})
        adjustmentScore += riskScore['高']
    # 委托企业法人命中信用黑名单
    if riskIndex.creditBlackPS(companyEntrustId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人命中信用黑名单'})
        adjustmentScore += riskScore['高']
    # 委托企业近两年涉诉案件数大于5
    if riskIndex.judgementNumCM(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近两年涉诉案件数大于5'})
        adjustmentScore += riskScore['中']
    # 委托企业近两年以被告身份涉诉案件数大于2
    if riskIndex.defendantNum(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近两年以被告身份涉诉案件数大于2'})
        adjustmentScore += riskScore['中']
    # 委托企业近两年涉诉案件金额数大于1000万
    if riskIndex.judgeAmountCM(companyEntrustId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近两年涉诉案件金额数大于1000万'})
        adjustmentScore += riskScore['中']
    # 委托企业近两年以被告身份涉诉案件金额数大于100万
    if riskIndex.defendantAmountCM(companyEntrustId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业', 'riskContent': u'委托企业近两年以被告身份涉诉案件金额数大于100万'})
        adjustmentScore += riskScore['高']
    # 委托企业法人近两年涉诉案件数大于5
    if riskIndex.judgementNumPS(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人近两年涉诉案件数大于5'})
        adjustmentScore += riskScore['中']
    # 委托企业法人近两年以被告身份涉诉案件数大于2
    if riskIndex.defendantNumPS(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人近两年以被告身份涉诉案件数大于2'})
        adjustmentScore += riskScore['中']
    # 委托企业法人近两年涉案金额数大于100万
    if riskIndex.judgeAmountPS(companyEntrustId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人近两年涉案金额数大于100万'})
        adjustmentScore += riskScore['中']
    # 委托企业法人近两年以被告身份涉案金额数大于50万
    if riskIndex.defendantAmountPS(companyEntrustId, tastId, 50):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'高',
                            'ruleObject': u'委托企业法人', 'riskContent': u'委托企业法人近两年以被告身份涉案金额数大于50万'})
        adjustmentScore += riskScore['高']
    # 购货企业经营年限小于等于3年
    if riskIndex.businessLife(companyBuierId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业经营年限小于等于3年'})
        adjustmentScore += riskScore['低']
    # 购货企业在工商行政部门登记状态非正常
    if riskIndex.statusAbnormal(companyBuierId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业在工商行政部门登记状态非正常'})
        adjustmentScore += riskScore['高']
    # 购货企业购买原料加工销售毛利率小于2%
    if riskIndex.grossProfitRate(companyBuierId, tastId, 0.02):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业购买原料加工销售毛利率小于0.02'})
        adjustmentScore += riskScore['高']
    # 购货企业命中被执行名单
    if riskIndex.zhixingCM(companyBuierId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业命中被执行名单'})
        adjustmentScore += riskScore['高']
    # 购货企业命中失信被执行人名单
    if riskIndex.dishonestyCM(companyBuierId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业命中失信被执行人名单'})
        adjustmentScore += riskScore['高']
    # 购货企业命中信用黑名单
    if riskIndex.creditBlackCM(companyBuierId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业命中信用黑名单'})
        adjustmentScore += riskScore['高']
    # 购货企业命中信用重点关注名单
    if riskIndex.vipCreaditCM(companyBuierId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业命中信用重点关注名单'})
        adjustmentScore += riskScore['高']
    # 购货企业命中环保失信黑名单
    if riskIndex.dishonestyEP(companyBuierId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业命中环保失信黑名单'})
        adjustmentScore += riskScore['高']
    # 购货企业近2年内经营企业法定代表人变更记录大于等于1
    if riskIndex.LPChangeNum(companyBuierId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'中',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业近2年内经营企业法定代表人变更记录大于等于1'})
        adjustmentScore += riskScore['中']
    # 购货企业近2年内经营企业名称变更记录数大于等于1
    if riskIndex.CNChangeNum(companyBuierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业近2年内经营企业名称变更记录数大于等于1'})
        adjustmentScore += riskScore['低']
    # 购货企业近2年内经营企业股东变更记录数大约等于1
    if riskIndex.SHChangeNum(companyBuierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业近2年内经营企业股东变更记录数大约等于1'})
        adjustmentScore += riskScore['低']
    # 购货企业法人命中被执行名单
    if riskIndex.zhixingPS(companyBuierId, 'purchaserCorporationIdcard'):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'购货企业法人', 'riskContent': u'购货企业法人命中被执行名单'})
        adjustmentScore += riskScore['高']
    # 购货企业法人命中失信被执行人名单
    if riskIndex.dishonestyPS(companyBuierId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                            'ruleObject': u'购货企业法人', 'riskContent': u'购货企业法人命中失信被执行人名单'})
        adjustmentScore += riskScore['高']
    # 购货企业法人命中信用黑名单
    if riskIndex.creditBlackPS(companyBuierId, tastId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'购货企业法人', 'riskContent': u'购货企业法人命中信用黑名单'})
        adjustmentScore += riskScore['高']
    # 购货企业近两年涉诉案件数大于5
    if riskIndex.judgementNumCM(companyBuierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业近两年涉诉案件数大于5'})
        adjustmentScore += riskScore['中']
    # 购货企业近两年以被告身份涉诉案件数大于2
    if riskIndex.defendantNum(companyBuierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业近两年以被告身份涉诉案件数大于2'})
        adjustmentScore += riskScore['中']
    # 购货企业近两年涉诉案件金额数大于1000万
    if riskIndex.judgeAmountCM(companyBuierId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业近两年涉诉案件金额数大于1000万'})
        adjustmentScore += riskScore['中']
    # 购货企业近两年以被告身份涉诉案件金额数大于100万
    if riskIndex.defendantAmountCM(companyBuierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'高',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业近两年以被告身份涉诉案件金额数大于100万'})
        adjustmentScore += riskScore['高']
    # 购货企业法人近两年涉诉案件数大于5
    if riskIndex.judgementNumPS(companyBuierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'购货企业法人', 'riskContent': u'购货企业法人近两年涉诉案件数大于5'})
        adjustmentScore += riskScore['中']
    # 购货企业法人近两年以被告身份涉诉案件数大于2
    if riskIndex.defendantNumPS(companyBuierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'购货企业法人', 'riskContent': u'购货企业法人近两年以被告身份涉诉案件数大于2'})
        adjustmentScore += riskScore['中']
    # 购货企业法人近两年涉案金额数大于100万
    if riskIndex.judgeAmountPS(companyBuierId, tastId):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'中',
                            'ruleObject': u'购货企业法人', 'riskContent': u'购货企业法人近两年涉案金额数大于100万'})
        adjustmentScore += riskScore['中']
    # 购货企业法人近两年以被告身份涉案金额数大于50万
    if riskIndex.defendantAmountPS(companyBuierId, tastId, 50):
        adjustments.append({'ruleType': 1, 'riskDimension': u'涉诉风险', 'riskLevel': u'高',
                            'ruleObject': u'购货企业法人', 'riskContent': u'购货企业法人近两年以被告身份涉案金额数大于50万'})
        adjustmentScore += riskScore['高']
    if companyGoodsId:
        # 货代企业经营年限小于等于3年
        if riskIndex.businessLife(companyGoodsId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业经营年限小于等于3年'})
            adjustmentScore += riskScore['低']
        # 货代企业在工商行政部门登记状态非正常
        if riskIndex.statusAbnormal(companyGoodsId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业在工商行政部门登记状态非正常'})
            adjustmentScore += riskScore['高']
        # 货代企业命中被执行名单
        if riskIndex.zhixingCM(companyGoodsId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业命中被执行名单'})
            adjustmentScore += riskScore['高']
        # 货代企业命中失信被执行人名单
        if riskIndex.dishonestyCM(companyGoodsId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业命中失信被执行人名单'})
            adjustmentScore += riskScore['高']
        # 货代企业命中信用黑名单
        if riskIndex.creditBlackCM(companyGoodsId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业命中信用黑名单'})
            adjustmentScore += riskScore['高']
        # 货代企业命中信用重点关注名单
        if riskIndex.vipCreaditCM(companyGoodsId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业命中信用重点关注名单'})
            adjustmentScore += riskScore['高']
        # 货代企业近2年内经营企业法定代表人变更记录大于等于1
        if riskIndex.LPChangeNum(companyGoodsId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'经营风险', 'riskLevel': u'中',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业近2年内经营企业法定代表人变更记录大于等于1'})
            adjustmentScore += riskScore['中']
        # 货代企业近2年内经营企业名称变更记录数大于等于1
        if riskIndex.CNChangeNum(companyGoodsId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业近2年内经营企业名称变更记录数大于等于1'})
            adjustmentScore += riskScore['低']
        # 货代企业近2年内经营企业股东变更记录数大约等于1
        if riskIndex.SHChangeNum(companyGoodsId, tastId):
            adjustments.append({'ruleType': 1, 'riskDimension': u'经营风险', 'riskLevel': u'低',
                                'ruleObject': u'货代企业', 'riskContent': u'货代企业近2年内经营企业股东变更记录数大约等于1'})
            adjustmentScore += riskScore['低']
        # 货代企业法人命中被执行名单
        if riskIndex.zhixingPS(companyGoodsId, 'freightForwardCorporationIdcard'):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业法人', 'riskContent': u'货代企业法人命中被执行名单'})
            adjustmentScore += riskScore['高']
        # 货代企业法人命中失信被执行人名单
        if riskIndex.dishonestyPS(companyGoodsId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业法人', 'riskContent': u'货代企业法人命中失信被执行人名单'})
            adjustmentScore += riskScore['高']
        # 货代企业法人命中信用黑名单
        if riskIndex.creditBlackPS(companyGoodsId, tastId):
            adjustments.append({'ruleType': 0, 'riskDimension': u'法律风险', 'riskLevel': u'高',
                                'ruleObject': u'货代企业法人', 'riskContent': u'货代企业法人命中信用黑名单'})
            adjustmentScore += riskScore['高']
    # 购货企业命中重点监控名单
    if riskIndex.keyMonitor(companyBuierId):
        adjustments.append({'ruleType': 0, 'riskDimension': u'黑名单', 'riskLevel': u'高',
                            'ruleObject': u'购货企业', 'riskContent': u'购货企业命中重点监控名单'})
        adjustmentScore += riskScore['高']
    return adjustmentScore, adjustments


if __name__ == '__main__':
    riskIndex = RiskIndex('1902210059801022')
    # print riskIndex.LPChangeNum(u'阿里巴巴(中国)网络技术有限公司', u'烙铁')
    print entrustBuy(u'阿里巴巴(中国)网络技术有限公司', u'阿里巴巴(中国)网络技术有限公司', u'阿里巴巴(中国)网络技术有限公司',
                     u'阿里巴巴(中国)网络技术有限公司', u'烙铁', 1000000, '1902280005371022')

    print entrustSale(u'阿里巴巴(中国)网络技术有限公司', u'阿里巴巴(中国)网络技术有限公司', u'阿里巴巴(中国)网络技术有限公司',
                      u'烙铁', '1902280005371022')
