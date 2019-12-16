#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
Created on 2018/12/22
@Author: regan
"""
import numpy, pandas, sys, os

dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.dirname(dir))

from util.ESQuery_url import esQuery, esQuery_SubjectMatterPriceInfo
from datetime import datetime, timedelta

today = datetime.now()


class RawDataGen():
    """
    输入数据生成
    """

    def __init__(self, companyId, tastId, applyId):
        self._companyId = companyId
        self._tastId = tastId
        self._applyId = applyId
        self._company = self._get_company()

    def _get_company(self):
        query = ('companyBaseId', self._companyId)
        field = ['companyBaseId', 'name']
        docs = esQuery(applyId=self._applyId, index='index_risk_company_base_info', type='company_base_info',
                       query=query, field=field)
        if len(docs) != 0:
            return docs[0]['name']
        return '--'


    def CompanyBaseInfo(self):
        """
        企业基础信息: 营业期限始【termStart】，注册资本【registCapi】，类型【econKind】、法人【operName】、状态
        :return
        """
        query = ('companyBaseId', self._companyId)
        field = ['companyBaseId', 'name', 'termStart', 'registCapi', 'econKind', 'operName', 'status', 'applyId']
        docs = esQuery(applyId=self._applyId, index='index_risk_company_base_info', type='company_base_info',
                       query=query, field=field)
        if len(docs) != 0:
            # 营业起始时间、注册资本、工商注册类型、法人
            try:
                termStart = datetime.strptime(docs[0]['termStart'], '%Y-%m-%d %H:%M:%S')
            except Exception:
                termStart = 'missing'
            try:
                registCapi = float(docs[0]['registCapi'])
            except:
                registCapi = 'missing'
            result = {'termStart': termStart,
                      'registCapi': registCapi, 'econKind': docs[0]['econKind'],
                      'operName': docs[0]['operName'],
                      'status': docs[0]['status']}
            return result

        result = {'termStart': 'missing', 'registCapi': 'missing', 'econKind': 'missing', 'operName': 'missing',
                  'status': 'missing'}
        return result

    def CompanyPartners(self):
        """
        投资人及出资信息：投资人类型【stockType】，出资比例百分数（1位小数）【stockPercent】，是否第一大股东【isFirstShareholder】
        :return: ['name', 'legalPersonSharehld', 'enterpriSharehld', 'shareRatioOfLegalPersonsEquity', 'largestShareholdersInvest']
        """
        query = ('companyBaseId', self._companyId)
        field = ['companyBaseId', 'stockType', 'stockPercent', 'isFirstShareholder', 'stockName', 'shouldCapi',
                 'foreignInvest']
        docs = esQuery(applyId=self._applyId, index='index_risk_company_partners', type='company_partners', query=query,
                       field=field)

        # 法人股东个数、法人股权占比、第一大股东对外投资企业个数、参股企业数、第一大自然人股东名称
        result = {'legalPersonSharehld': 'missing', 'shareRatioOfLegalPersonsEquity': 'missing',
                  'largestShareholdersInvest': 'missing', 'enterpriSharehld': 'missing',
                  'largestShareholderName': 'missing', 'shareholders': [],
                  'largestPersonShareholderName': 'missing'}
        if len(docs) == 0:
            return result

        largestStockName = ''
        largestStockNum = 0
        largestShareholdersInvests = []
        for doc in docs:
            try:
                shouldCapi = float(doc['shouldCapi'])
            except:
                shouldCapi = 0
            try:
                stockPercent = float(doc['stockPercent'].replace('%', '')) * 0.01
            except:
                stockPercent = 'missing'
            if doc['stockType'] == u'自然人股东':
                if shouldCapi > largestStockNum:
                    largestStockNum = shouldCapi
                    largestStockName = doc['stockName']
            if doc['stockName'] == self.CompanyBaseInfo()['operName']:
                result['shareRatioOfLegalPersonsEquity'] = stockPercent
            if doc['stockType'] == u'企业法人' or doc['stockType'] == u'法人股东':
                lastNum = result.get('legalPersonSharehld') if result.get('legalPersonSharehld') != 'missing' else 0
                result['legalPersonSharehld'] = lastNum + 1
            if doc['stockType'] != u'自然人股东':
                lastNum = result.get('enterpriSharehld') if result.get('enterpriSharehld') != 'missing' else 0
                result['enterpriSharehld'] = lastNum + 1
            if int(doc['isFirstShareholder']) == 1:
                result['largestShareholderName'] = doc['stockName']
                try:
                    largestShareholdersInvests.append(float(doc.get('foreignInvest', 0)))
                except:
                    pass
            result['shareholders'].append(doc['stockName'])
        result['largestPersonShareholderName'] = largestStockName
        try:
            result['largestShareholdersInvest'] = sum(largestShareholdersInvests)
        except:
            result['largestShareholdersInvest'] = 1

        return result

    def FinanceInfo(self, buyOrSell=''):
        """
        财务信息表数据获取
        :return:
        """
        query = ('companyBaseId', self._companyId)
        field = ['assetLiabilityRatio', 'liquidityRatio', 'quickRatio', 'interestProtection', 'cashGrowthRate',
                 'profitGrowthRate', 'creditVelocity', 'stockVelocity', 'grossProfitRate', 'cashFlow', 'netProfit',
                 'peRatio', 'pbRatio', 'cashDemand', 'netOperatingCashToValueRatio', 'netProfitCashToGoodsRatio']
        docs = esQuery(applyId=self._applyId, index='index_risk_company_finance_info', type='company_finance_info',
                       query=query, field=field)
        if len(docs) == 0:
            return {}.fromkeys(field, 'missing')
        doc = docs[0]
        result = {}
        # 资产负债率
        try:
            assetLiabilityRatio = float(doc['assetLiabilityRatio']) * 0.01
        except:
            assetLiabilityRatio = 'missing'
        result.setdefault('assetLiabilityRatio', assetLiabilityRatio)
        # 流动比率
        try:
            liquidityRatio = float(doc['liquidityRatio']) * 0.01
        except:
            liquidityRatio = 'missing'
        result.setdefault('liquidityRatio', liquidityRatio)
        # 速动比率
        try:
            quickRatio = float(doc['quickRatio']) * 0.01
        except:
            quickRatio = 'missing'
        result.setdefault('quickRatio', quickRatio)
        # 利息保障倍数
        result.setdefault('interestProtection', doc['interestProtection'])
        # 贷款额
        if buyOrSell == 'buy':
            docs_0 = esQuery(applyId=self._applyId, index='index_risk_order_entrust_buy_detail',
                             type='order_entrust_buy_detail', query=('entrustBuyId', self._applyId), field=['quota'])
        else:
            docs_0 = esQuery(applyId=self._applyId, index='index_risk_order_entrust_sale_detail',
                             type='order_entrust_sale_detail', query=('entrustSaleId', self._applyId), field=['quota'])

        # 经营性现金净额货值比
        try:
            result.setdefault('netOperatingCashToValueRatio', float(doc.get('cashFlow', 0)) * 1.0 / float(docs_0[0]['quota']))
        except Exception:
            result.setdefault('netOperatingCashToValueRatio', 'missing')
        # 净利润现金净额货值比
        try:
            result.setdefault('netProfitCashToGoodsRatio', float(doc.get('netProfit', 0)) * 1.0 / float(docs_0[0]['quota']))
        except Exception:
            result.setdefault('netProfitCashToGoodsRatio', 'missing')
        # 销售利润增长率
        try:
            cashGrowthRate = float(doc['cashGrowthRate']) * 0.01
        except:
            cashGrowthRate = 'missing'
        result.setdefault('cashGrowthRate', cashGrowthRate)
        # 净利润增长率
        try:
            profitGrowthRate = float(doc['profitGrowthRate']) * 0.01
        except:
            profitGrowthRate = 'missing'
        result.setdefault('profitGrowthRate', profitGrowthRate)
        # 应收账款周转率
        try:
            creditVelocity = float(doc['creditVelocity']) * 0.01
        except:
            creditVelocity = 'missing'
        result.setdefault('creditVelocity', creditVelocity)
        # 存货周转率
        try:
            stockVelocity = float(doc['stockVelocity']) * 0.01
        except:
            stockVelocity = 'missing'
        result.setdefault('stockVelocity', stockVelocity)
        # 委托企业生产销售毛利润率
        try:
            result.setdefault('grossProfitRate', float(doc['grossProfitRate']) * 0.01)
        except:
            result.setdefault('grossProfitRate', 'missing')
        # 经营性现金净流量
        result.setdefault('cashFlow', doc['cashFlow'])
        # 净利润现金含量
        result.setdefault('netProfit', doc['netProfit'])
        # 市盈率
        try:
            peRatio = float(doc['peRatio']) * 0.01
        except:
            peRatio = 'missing'
        result.setdefault('peRatio', peRatio)
        # 市净率
        try:
            pbRatio = float(doc['pbRatio']) * 0.01
        except:
            pbRatio = 'missing'
        result.setdefault('pbRatio', pbRatio)
        return result

    def CreditInfo(self):
        """
        企业征信数据表
        :return:
        """
        query = ('companyBaseId', self._companyId)
        field = ['creditStartingDate', 'cooperativeInstitution', 'unclearedCreditAmount', 'creditAmount']
        docs = esQuery(applyId=self._applyId, index='index_risk_company_credit_info', type='company_credit_info',
                       query=query, field=field)
        if len(docs) == 0:
            # 信贷年限、信贷合作机构数、未结清信贷机构数、未结清信贷余额、未结清贷款比例
            return {}.fromkeys(['creditLife', 'cooperativeInstitution', 'unclearedInstitution',
                                'unclearedCreditAmount', 'unclearedCreditRatio'], 'missing')
        result = {'cooperativeInstitution': set(), 'unclearedInstitution': set(), 'unclearedCreditAmount': [],
                  'creditAmount': [], 'creditLife': 0}

        for doc in docs:
            cooperativeInstitution = doc.get('cooperativeInstitution', '')
            unclearedCreditAmount = doc.get('unclearedCreditAmount', 0)
            try:
                unclearedCreditAmount = float(unclearedCreditAmount)
            except Exception:
                unclearedCreditAmount = 0
            # 信贷年限
            creditYear_raw = result.get('creditLife', 0)
            try:
                try:
                    creditLife = (today - datetime.strptime(doc['creditStartingDate'],
                                                            '%Y-%m-%d %H:%M:%S')).days * 1.0 / 365
                except Exception:
                    creditLife = (today - datetime.strptime(doc['creditStartingDate'], '%Y-%m-%d')).days * 1.0 / 365
            except Exception:
                creditLife = 0
            if creditLife > creditYear_raw:
                result['creditLife'] = creditLife
            # 信贷合作机构
            if cooperativeInstitution:
                result.setdefault('cooperativeInstitution', set()).add(cooperativeInstitution)
            # 未结清信贷机构
            if unclearedCreditAmount > 0:
                result.setdefault('unclearedInstitution', set()).add(cooperativeInstitution)
            # 未结清信贷余额
            result.setdefault('unclearedCreditAmount', []).append(unclearedCreditAmount)
            # 总信贷额
            try:
                creditAmount = doc.get('creditAmount', 1)
                creditAmount = float(creditAmount)
            except Exception:
                creditAmount = 1
            result.setdefault('creditAmount', []).append(creditAmount)
        return {'creditLife': result['creditLife'], 'cooperativeInstitution': len(result['cooperativeInstitution']),
                'unclearedInstitution': len(result['unclearedInstitution']),
                'unclearedCreditAmount': sum(result['unclearedCreditAmount']),
                'unclearedCreditRatio': sum(result['unclearedCreditAmount']) * 1.0 / sum(result['creditAmount'])}

    def ManagementInfo(self):
        """
        经营信息
        :return:
        """
        query = ('companyBaseId', self._companyId)
        field = ['deviceType', 'deviceQuantity', 'obsoleteDeviceRate', 'dailyCapacity', 'dailyConsume',
                 'outputConsume', 'sixMonFailRate', 'workingNormal', 'safetyEvaluationTime', 'operatingRate',
                 'corporeInventory', 'corporeRequirement', 'supplierDailyCapacity', 'agreeDeliveryTime',
                 'expectDeliveryTime', 'createTime']
        docs = esQuery(applyId=self._applyId, index='index_risk_company_management_info',
                       type='company_management_info', query=query,
                       field=field)

        if len(docs) == 0:
            return {}.fromkeys(field, 'missing')
        doc = docs[0]
        result = {}
        # 设备类型
        device_map = {'1': u'高炉', '2': u'生产线', '3': u'其他'}
        result.setdefault('deviceType', device_map.get(str(doc['deviceType']), u'其他'))
        # 设备数量
        result.setdefault('deviceQuantity', doc['deviceQuantity'])
        # 设备老化率
        result.setdefault('obsoleteDeviceRate', doc['obsoleteDeviceRate'])
        # 每日产能
        try:
            dailyCapacity = float(doc['dailyCapacity'])
        except:
            dailyCapacity = 'missing'
        result.setdefault('dailyCapacity', dailyCapacity)
        # 每日货物消耗量
        try:
            dailyConsume = float(doc['dailyConsume'])
        except:
            dailyConsume = 'missing'
        result.setdefault('dailyConsume', dailyConsume)
        # 单位产出耗电量
        try:
            outputConsume = float(doc['outputConsume'])
        except:
            outputConsume = 'missing'
        result.setdefault('outputConsume', outputConsume)
        # 近6个月环保设备故障率
        try:
            sixMonFailRate = float(doc['sixMonFailRate']) * 0.01
        except:
            sixMonFailRate = 'missing'
        result.setdefault('sixMonFailRate', sixMonFailRate)
        # 当前环保设备是否正常运行
        result.setdefault('workingNormal', 'True' if u'是' == doc['workingNormal'] else 'False')
        # 最近三年进行安全评价的次数
        result.setdefault('safetyEvaluationTime', doc['safetyEvaluationTime'])
        # 最近3个月开工率
        try:
            operatingRate = float(doc['operatingRate']) * 0.01
        except:
            operatingRate = 'missing'
        result.setdefault('operatingRate', operatingRate)
        # 库存量
        if not doc.get('corporeInventory'):
            corporeInventory = 'missing'
        else:
            corporeInventory = doc.get('corporeInventory', 'missing')
        result.setdefault('corporeInventory', corporeInventory)
        # 标的物需求量
        if not doc.get('corporeRequirement'):
            corporeRequirement = 'missing'
        else:
            corporeRequirement = doc.get('corporeRequirement', 'missing')
        result.setdefault('corporeRequirement', corporeRequirement)
        # 供货方每日产能
        if not doc.get('supplierDailyCapacity'):
            supplierDailyCapacity = 'missing'
        else:
            supplierDailyCapacity = doc.get('supplierDailyCapacity', 'missing')
        result.setdefault('supplierDailyCapacity', supplierDailyCapacity)
        # 合同约定供货时间
        if not doc.get('agreeDeliveryTime'):
            agreeDeliveryTime = 'missing'
        else:
            agreeDeliveryTime = doc.get('agreeDeliveryTime', 'missing')
        result.setdefault('agreeDeliveryTime', agreeDeliveryTime)
        # 预计供货时间
        if not doc.get('expectDeliveryTime'):
            expectDeliveryTime = 'missing'
        else:
            expectDeliveryTime = doc.get('expectDeliveryTime', 'missing')
        result.setdefault('expectDeliveryTime', expectDeliveryTime)
        # 创建时间
        result.setdefault('createTime', doc.get('createTime', datetime.strptime(today.strftime('%Y-%m-%d %H:%M:%S'),
                                                                                '%Y-%m-%d %H:%M:%S')))
        return result

    def coreCompany(self):
        """
        供应链核心企业白名单
        :return:
        """
        query = ('companyName', self._company)
        field = ['roleType']
        docs = esQuery(applyId=self._applyId, index='index_risk_core_company', type='core_company', query=query,
                       field=field)
        if len(docs) == 0:
            return {'coreCompany': 'False'}
        else:
            return {'coreCompany': 'True'}

    def publicCompany(self):
        """
        上市公司名单
        :return:
        """
        query = ('companyName', self._company)
        field = ['companyName', 'publicTime']
        docs = esQuery(applyId=self._applyId, index='index_risk_public_company', type='public_company', query=query,
                       field=field)
        if len(docs) == 0:
            return {'publicCompany': 'False'}
        else:
            return {'publicCompany': 'True'}

    def importCompany(self):
        """
        国企、央企名单
        :return:
        """
        query = ('companyName', self._company)
        field = ['companyName', 'companyType']
        docs = esQuery(applyId=self._applyId, index='index_risk_import_company', type='import_company', query=query,
                       field=field)
        if len(docs) == 0:
            return {'importCompany': 'False'}
        else:
            return {'importCompany': 'True'}

    def topCompany(self):
        """
        历年世界500强名单
        :return:
        """
        query = ('companyCname', self._company)
        field = ['companyCname', 'years', 'rank']
        docs = esQuery(applyId=self._applyId, index='index_risk_top_company', type='top_company', query=query,
                       field=field)
        if len(docs) == 0:
            return {'topCompany': 'missing'}
        result = {'topCompany': []}
        for doc in docs:
            if today.month > 8:
                if doc['years'] >= today.year - 2:
                    result['topCompany'].append(doc['rank'])
            else:
                if doc['years'] >= today.year - 3:
                    result['topCompany'].append(doc['rank'])
        if len(result['topCompany']) == 1:
            result['topCompany'].append(500)
            result['topCompany'].append(500)
        if len(result['topCompany']) == 2:
            result['topCompany'].append(500)
        return {'topCompany': sum(result['topCompany']) * 1.0 / len(result['topCompany'])}

    def subjectMatterInfo(self):
        """
        标的物信息表
        :return:
        """
        query = ('id', self._tastId)
        field = ['id', 'tast', 'sourceToMoney', 'sourceConsumable', 'sourceStabilization', 'bigType']
        docs = esQuery(applyId=self._applyId, index='index_risk_subject_matter_info', type='subject_matter_info',
                       query=query, field=field)
        if len(docs) == 0:
            result = {'sourceToMoney': 'missing', 'sourceConsumable': 'missing', 'sourceStabilization': 'missing'}
        else:
            doc = docs[0]
            if len(docs) == 0:
                return {}.fromkeys(['sourceToMoney', 'sourceConsumable', 'sourceStabilization', 'bigType'], '--')
            result = {}
            # 货物变现能力
            result.setdefault('sourceToMoney', doc['sourceToMoney'])
            # 货物易损耗性
            result.setdefault('sourceConsumable', doc['sourceConsumable'])
            # 货物稳定性
            result.setdefault('sourceStabilization', doc['sourceStabilization'])
        return result

    def OrderEntrustBuyDetail(self):
        """
        货物交割类型
        :return:
        """
        query = ('entrustBuyId', self._applyId)
        field = ['entrustBuyId', 'deliveryType']
        docs = esQuery(applyId=self._applyId, index='index_risk_order_entrust_buy_detail',
                       type='order_entrust_buy_detail', query=query,
                       field=field)
        if len(docs) == 0:
            result = {'deliveryType': 'missing'}
        else:
            # 货物交割类型
            result = {'deliveryType': u'现货' if int(docs[0]['deliveryType']) == 1 else u'期货'}
        return result

    def SubjectMatterPriceInfo(self):
        """
        标的物时间价格信息表
        :return:
        """
        query = ('sid', self._tastId)
        field = ['id', 'priceDate', 'price', 'sid']
        docs = esQuery_SubjectMatterPriceInfo(query=query, field=field)
        if len(docs) == 0:
            return {}.fromkeys(['coefficientPrice', 'monthPriceDown', 'priceVariable', 'monthPriceVariable'], 'missing')

        # 当前价格
        thisPrice = 0
        thisDate = today - timedelta(days=366)
        ##############################
        # 获取最近数据日期和最近价格
        ##############################
        for doc in docs:
            if not doc['priceDate']:
                continue
            priceDate = datetime.strptime(doc['priceDate'], '%Y-%m-%d %H:%M:%S')
            if priceDate > thisDate:
                thisDate = priceDate
                thisPrice = doc['price']
                try:
                    if float(thisPrice) < 0:
                        return {'coefficientPrice': '--', 'monthPriceDown': '--',
                                'priceVariable': '--', 'monthPriceVariable': '--'}
                except Exception:
                    pass
        # 当月价格
        thisMonthPrices = []
        # 上年当月价格
        lastYearMonthPrices = []
        # 上月价格
        lastMonthPrices = []
        month_price = {}
        years_price_raw = {}
        for doc in docs:
            if not doc['priceDate']:
                continue
            priceDate = datetime.strptime(doc['priceDate'], '%Y-%m-%d %H:%M:%S')
            if priceDate.month == thisDate.month:
                if priceDate.year == thisDate.year - 1:
                    lastYearMonthPrices.append(doc['price'])
                elif priceDate.year == thisDate.year:
                    thisMonthPrices.append(doc['price'])
            elif priceDate.month == thisDate.month - 1:
                if priceDate.year == thisDate.year:
                    lastMonthPrices.append(doc['price'])

            one_year_ago_month = str(int(thisDate.year) - 1) + '-' + str(thisDate.month) + '-01 00:00:00'
            one_year_ago_year = str(int(thisDate.year) - 1) + '-' + str(thisDate.month) + '-' + str(
                thisDate.day) + ' 00:00:00'
            if priceDate >= datetime.strptime(one_year_ago_month, '%Y-%m-%d %H:%M:%S'):
                month_price.setdefault(str(priceDate.year) + str(priceDate.month).zfill(2), []).append(doc['price'])
            if priceDate >= datetime.strptime(one_year_ago_year, '%Y-%m-%d %H:%M:%S'):
                years_price_raw.setdefault(str(priceDate.year) + str(priceDate.month).zfill(2), []).append(doc['price'])

        years_price = []
        for x in years_price_raw.values():
            years_price.extend(x)

        result = {}
        # 货物价格变异系数
        try:
            if len(years_price) != 0 and sum(years_price) != 0:
                coefficientPrice = numpy.std(years_price) * 1.0 / (sum(years_price) * 1.0 / len(years_price))
            else:
                coefficientPrice = 0
        except Exception:
            coefficientPrice = 0
        result.setdefault('coefficientPrice', coefficientPrice)
        # 货物月均价格下跌指数
        try:
            tmp = sorted(month_price.items(), key=lambda item: item[0])
            monthPriceDown = 0

            for x, y in enumerate(tmp):
                if x != 0:
                    monthPriceDown += sum(y[1]) / len(y[1]) - sum(tmp[x - 1][1]) / len(tmp[x - 1][1])
            result.setdefault('monthPriceDown', monthPriceDown / len(month_price.keys()))
        except Exception:
            result.setdefault('monthPriceDown', 'missing')
        # 货物当前价格波动系数
        try:
            if numpy.std(years_price) == 0 or len(years_price) == 0:
                priceVariable = 0
            else:
                priceVariable = (thisPrice - sum(years_price) * 1.0 / len(years_price)) / numpy.std(years_price)
        except Exception:
            priceVariable = 0
        result.setdefault('priceVariable', priceVariable)
        # 货物月均价格波动
        try:
            if len(thisMonthPrices) == 0:
                thisMonthPriceAverage = 0
            else:
                thisMonthPriceAverage = sum(thisMonthPrices) * 1.0 / len(thisMonthPrices)
            if len(lastMonthPrices) == 0:
                lastMonthPriceAverage = 0
            else:
                lastMonthPriceAverage = sum(lastMonthPrices) * 1.0 / len(lastMonthPrices)
            if len(lastYearMonthPrices) == 0:
                lastYearMonthPriceAverage = 0
            else:
                lastYearMonthPriceAverage = sum(lastYearMonthPrices) * 1.0 / len(lastYearMonthPrices)
            if lastYearMonthPriceAverage == 0 or thisMonthPriceAverage == 0:
                monthPriceVariable = 0
            else:
                monthPriceVariable = (thisMonthPriceAverage / lastMonthPriceAverage) / (
                        thisMonthPriceAverage / lastYearMonthPriceAverage)
        except Exception:
            monthPriceVariable = 0
        result.setdefault('monthPriceVariable', monthPriceVariable)
        return result

    def CompanyChangerecords(self):
        """
        企业变更事项
        :return:
        """
        query = ('companyBaseId', self._companyId)
        field = ['projectName', 'changeDate']
        docs = esQuery(applyId=self._applyId, index='index_risk_company_changerecords', type='company_changerecords',
                       query=query, field=field)
        if len(docs) == 0:
            return [{'projectName': 'missing', 'changeDate': 'missing'}]
        return docs

    def CompanyJudgmentdoc(self):
        """
        企业司法相关信息表
        :return:
        """
        query = ('companyBaseId', self._companyId)
        field = ['isDefendant', 'courtYear', 'caseRole']
        docs = esQuery(applyId=self._applyId, index='index_risk_company_judgmentdoc', type='company_judgmentdoc',
                       query=query, field=field)
        if len(docs) == 0:
            return [{'isDefendant': False, 'courtYear': today.year - 100, 'caseRole': 'missing'}]
        else:
            return docs

    def CompanyOtherInfo(self):
        """
        新增企业其他信息
        :return:
        """
        query = ('companyBaseId', self._companyId)
        # 企业环评手续是否齐全、企业是否具有生产许可证、企业是否通过最后一次安全评价
        field = ['eiaComplete', 'productionCertificate', 'latestSafety']
        docs = esQuery(applyId=self._applyId, index='index_risk_company_other_info', type='company_other_info',
                       query=query, field=field)
        if len(docs) == 0:
            return {'eiaComplete': 'missing', 'productionCertificate': 'missing', 'latestSafety': 'missing'}
        else:
            return {'eiaComplete': True if docs[0]['eiaComplete'] == u'是' else False,
                    'productionCertificate': True if docs[0]['productionCertificate'] == u'是' else False,
                    'latestSafety': True if docs[0]['latestSafety'] == u'是' else False}


if __name__ == '__main__':
    rawDataGen = RawDataGen(u'乐山金蜜准时达物流有限公司', u'铬铁', '1902280005371022')
    print rawDataGen.CompanyBaseInfo()
    print rawDataGen.CompanyPartners()
    print rawDataGen.FinanceInfo()
    print rawDataGen.CreditInfo()
    print rawDataGen.ManagementInfo()
    print rawDataGen.coreCompany()
    print rawDataGen.publicCompany()
    print rawDataGen.importCompany()
    print rawDataGen.topCompany()
    print rawDataGen.subjectMatterInfo()
    print rawDataGen.SubjectMatterPriceInfo()
    print rawDataGen.OrderEntrustBuyDetail()

