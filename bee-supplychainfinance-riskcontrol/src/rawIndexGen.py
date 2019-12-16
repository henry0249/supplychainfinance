#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
Created on 2018/12/22
@Author: regan

计算所有的基础指标
"""
from datetime import datetime
from rawDataGen import RawDataGen


class BasicInfoIndexGen(RawDataGen):
    """
    二级模块:基本信息
    """

    def __init__(self, subjectCompanyId, tastId, applyId):
        self._now = datetime.now()
        RawDataGen.__init__(self, subjectCompanyId, tastId, applyId)
        self._CompanyBaseInfo = self.CompanyBaseInfo()
        self._CompanyPartners = self.CompanyPartners()
        self._coreCompany = self.coreCompany()
        self._publicCompany = self.publicCompany()
        self._importCompany = self.importCompany()
        self._topCompany = self.topCompany()

    def businessLife(self):
        """
        经营年限: >（当日日期 - 营业期限始日期）／365
        :return:
        """
        if self._CompanyBaseInfo['termStart'] == 'missing':
            return 'missing'
        return ((self._now - self._CompanyBaseInfo['termStart']) / 365).days

    def registeredCapital(self):
        """
        注册资本
        :return:
        """
        if self._CompanyBaseInfo['registCapi'] == 'missing':
            return 'missing'
        return self._CompanyBaseInfo['registCapi']

    def typesOfBusinessRgist(self):
        """
        工商注册类型
        :return:
        """
        if self._CompanyBaseInfo['econKind'] == 'missing':
            return 'missing'
        return self._CompanyBaseInfo['econKind']

    def enterpriSharehld(self):
        """
        参股企业数
        :return
        """
        if self._CompanyPartners['enterpriSharehld'] == 'missing':
            return 'missing'
        return self._CompanyPartners['enterpriSharehld']

    def numOfLegalPersonSharehld(self):
        """
        法人股东数
        :return
        """
        if self._CompanyPartners['legalPersonSharehld'] == 'missing':
            return 'missing'
        return self._CompanyPartners['legalPersonSharehld']

    def shareRatioOfLegalPersonsEquity(self):
        """
        法人股权占比
        :return
        """
        if self._CompanyPartners['shareRatioOfLegalPersonsEquity'] == 'missing':
            return 'missing'
        return self._CompanyPartners['shareRatioOfLegalPersonsEquity']

    def largestShareholders(self):
        """
        第一大股东对外投资企业个数
        :return
        """
        if self._CompanyPartners['largestShareholdersInvest'] == 'missing':
            return 'missing'
        return self._CompanyPartners['largestShareholdersInvest']

    def isCoreCompany(self):
        """
        是否核心企业
        :return:
        """
        return self._coreCompany['coreCompany']

    def isPublicCompany(self):
        """
        是否上市企业
        :return:
        """
        return self._publicCompany['publicCompany']

    def isImportCompany(self):
        """
        是否国企、央企
        :return:
        """
        return self._importCompany['importCompany']

    def topCompanyRank(self):
        """
        近三年世界500强平均排名
        :return:
        """
        if self._topCompany['topCompany'] == 'missing':
            return 'missing'
        return self._topCompany['topCompany']

    def largestShareholdersIsLegalPerson(self):
        """
        第一大自然人股东是否与企业法人一致
        :return:
        """
        if self._CompanyPartners['largestPersonShareholderName'] == self._CompanyBaseInfo['operName']:
            if self._CompanyPartners['largestPersonShareholderName'] != 'missing':
                return 'True'
        return 'False'


class FinancialInfoIndexGen(RawDataGen):
    """
    二级模块: 财务信息
    """

    def __init__(self, subjectCompanyId, tastId, applyId, buyOrSell):
        RawDataGen.__init__(self, subjectCompanyId, tastId, applyId)
        self._FinanceInfo = self.FinanceInfo(buyOrSell)

    def assetLiabilityRatio(self):
        """
        资产负债率
        :return: {'id': 'assetLiabilityRatio'}
        """
        if self._FinanceInfo['assetLiabilityRatio'] == 'missing':
            return 'missing'
        return self._FinanceInfo['assetLiabilityRatio']

    def liquidityRatio(self):
        """
        流动比率
        :return: {'id': 'liquidityRatio'}
        """
        if self._FinanceInfo['liquidityRatio'] == 'missing':
            return 'missing'
        return self._FinanceInfo['liquidityRatio']

    def quickRatio(self):
        """
        速动比率
        :return: {'id': 'quickRatio'}
        """
        if self._FinanceInfo['quickRatio'] == 'missing':
            return 'missing'
        return self._FinanceInfo['quickRatio']

    def interestProtection(self):
        """
        利息保障倍数
        :return: {'id': 'interestProtection'}
        """
        if self._FinanceInfo['interestProtection'] == 'missing':
            return 'missing'
        return self._FinanceInfo['interestProtection']

    def cashFlow(self):
        """
        经营性现金净流量
        :return:
        """
        if self._FinanceInfo['cashFlow'] == 'missing':
            return 'missing'
        return self._FinanceInfo['cashFlow']

    def netProfit(self):
        """
        净利润现金含量
        :return:
        """
        if self._FinanceInfo['netProfit'] == 'missing':
            return 'missing'
        return self._FinanceInfo['netProfit']

    def peRatio(self):
        """
        市盈率
        :return:
        """
        if self._FinanceInfo['peRatio'] == 'missing':
            return 'missing'
        return self._FinanceInfo['peRatio']

    def pbRatio(self):
        """
        市净率
        :return:
        """
        if self._FinanceInfo['pbRatio'] == 'missing':
            return 'missing'
        return self._FinanceInfo['pbRatio']

    def netOperatingCashToValueRatio(self):
        """
        经营性现金净额货值比
        :return: {'id': 'netOperatingCashToValueRatio'}
        """
        if self._FinanceInfo['netOperatingCashToValueRatio'] == 'missing':
            return 'missing'
        return self._FinanceInfo['netOperatingCashToValueRatio']

    def netProfitCashToGoodsRatio(self):
        """
        净利润现金净额货值比
        :return: {'id': 'netProfitCashToGoodsRatio'}
        """
        if self._FinanceInfo['netProfitCashToGoodsRatio'] == 'missing':
            return 'missing'
        return self._FinanceInfo['netProfitCashToGoodsRatio']

    def cashGrowthRate(self):
        """
        销售利润增长率
        :return: {'id': 'cashGrowthRate'}
        """
        if self._FinanceInfo['cashGrowthRate'] == 'missing':
            return 'missing'
        return self._FinanceInfo['cashGrowthRate']

    def profitGrowthRate(self):
        """
        净利润增长率
        :return: {'id': 'profitGrowthRate'}
        """
        if self._FinanceInfo['profitGrowthRate'] == 'missing':
            return 'missing'
        return self._FinanceInfo['profitGrowthRate']

    def creditVelocity(self):
        """
        应收账款周转率
        :return: {'id': 'creditVelocity'}
        """
        if self._FinanceInfo['creditVelocity'] == 'missing':
            return 'missing'
        return self._FinanceInfo['creditVelocity']

    def stockVelocity(self):
        """
        存货周转率
        :return: {'id': 'stockVelocity'}
        """
        if self._FinanceInfo['stockVelocity'] == 'missing':
            return 'missing'
        return self._FinanceInfo['stockVelocity']

    def grossProfitRate(self):
        """
        委托企业生产销售毛利润率
        :return: {'id': 'grossProfitRate'}
        """
        if self._FinanceInfo['grossProfitRate'] == 'missing':
            return 'missing'
        return self._FinanceInfo['grossProfitRate']


class CreditReportIndexGen(RawDataGen):
    """
    二级模块: 企业征信
    """

    def __init__(self, subjectCompanyId, tastId, applyId):
        RawDataGen.__init__(self, subjectCompanyId, tastId, applyId)
        self._CreditInfo = self.CreditInfo()

    def creditLife(self):
        """
        信贷年限
        :return: {'id': 'creditLife'}
        """
        if self._CreditInfo['creditLife'] == 'missing':
            return 'missing'
        return self._CreditInfo['creditLife']

    def cooperativeInstitution(self):
        """
        信贷合作机构数
        :return: {'id': 'cooperativeInstitution'}
        """
        if self._CreditInfo['cooperativeInstitution'] == 'missing':
            return 'missing'
        return self._CreditInfo['cooperativeInstitution']

    def unclearedInstitution(self):
        """
        未结清信贷机构数
        :return: {'id': 'unclearedInstitution'}
        """
        if self._CreditInfo['unclearedInstitution'] == 'missing':
            return 'missing'
        return self._CreditInfo['unclearedInstitution']

    def unclearedCreditAmount(self):
        """
        未结清信贷余额
        :return: {'id': 'unclearedCreditAmount'}
        """
        if self._CreditInfo['unclearedCreditAmount'] == 'missing':
            return 'missing'
        return self._CreditInfo['unclearedCreditAmount']

    def ratioOfUnliquidatedLoans(self):
        """
        未结清贷款比例
        :return: {'id': 'unliquidatedCreditBalance'}
        """
        if self._CreditInfo['unclearedCreditRatio'] == 'missing':
            return 'missing'
        return self._CreditInfo['unclearedCreditRatio']


class ManagementInfoIndexGen(RawDataGen):
    """
    二级模块: [经营信息]
    """

    def __init__(self, subjectCompanyId, tastId, applyId):
        RawDataGen.__init__(self, subjectCompanyId, tastId, applyId)
        self._ManagementInfo = self.ManagementInfo()

    def deviceType(self):
        """
        设备类型
        :return: {'id': 'deviceType'}
        """
        if self._ManagementInfo['deviceType'] == 'missing':
            return 'missing'
        return self._ManagementInfo['deviceType']

    def deviceQuantity(self):
        """
        设备数量
        :return: {'id': 'deviceQuantity'}
        """
        if self._ManagementInfo['deviceQuantity'] == 'missing':
            return 'missing'
        return self._ManagementInfo['deviceQuantity']

    def obsoleteDeviceRate(self):
        """
        设备老化率
        :return: {'id': 'obsoleteDeviceRate'}
        """
        if self._ManagementInfo['obsoleteDeviceRate'] == 'missing':
            return 'missing'
        return self._ManagementInfo['obsoleteDeviceRate']

    def dailyCapacity(self):
        """
        每日产能
        :return: {'id': 'dailyCapacity'}
        """
        if self._ManagementInfo['dailyCapacity'] == 'missing':
            return 'missing'
        return self._ManagementInfo['dailyCapacity']

    def dailyConsume(self):
        """
        每日货物消耗量
        :return:
        """
        if self._ManagementInfo['dailyConsume'] == 'missing':
            return 'missing'
        return self._ManagementInfo['dailyConsume']

    def outputConsume(self):
        """
        单位产出耗电量
        :return:
        """
        if self._ManagementInfo['outputConsume'] == 'missing':
            return 'missing'
        return self._ManagementInfo['outputConsume']

    def sixMonFailRate(self):
        """
        近6个月环保设备故障率
        :return:
        """
        if self._ManagementInfo['sixMonFailRate'] == 'missing':
            return 'missing'
        return self._ManagementInfo['sixMonFailRate']

    def workingNormal(self):
        """
        当前环保设备是否正常运行
        :return:
        """
        if self._ManagementInfo['workingNormal'] == 'missing':
            return 'missing'
        return self._ManagementInfo['workingNormal']

    def safetyEvaluationTime(self):
        """
        最近3年进行安全评价的次数
        :return:
        """
        if self._ManagementInfo['safetyEvaluationTime'] == 'missing':
            return 'missing'
        return self._ManagementInfo['safetyEvaluationTime']

    def operatingRate(self):
        """
        最近3个月开工率
        :return:
        """
        if self._ManagementInfo['operatingRate'] == 'missing':
            return 'missing'
        return self._ManagementInfo['operatingRate']

    def corporeInventory(self):
        """
        库存量
        :return:
        """
        if self._ManagementInfo['corporeInventory'] == 'missing':
            return 'missing'
        return self._ManagementInfo['corporeInventory']

    def supplierTimeDelta(self):
        """
        供货时间与预期时间之间的差距
        :return:
        """
        if self._ManagementInfo['agreeDeliveryTime'] == 'missing' or self._ManagementInfo['expectDeliveryTime'] == 'missing':
            return 'missing'
        try:
            agreeDeliveryTime = datetime.strptime(self._ManagementInfo['agreeDeliveryTime'], '%Y-%m-%d %H:%M:%S')
        except Exception:
            agreeDeliveryTime = datetime.strptime(self._ManagementInfo['agreeDeliveryTime'], '%Y-%m-%d')
        try:
            expectDeliveryTime = datetime.strptime(self._ManagementInfo['expectDeliveryTime'], '%Y-%m-%d %H:%M:%S')
        except Exception:
            expectDeliveryTime = datetime.strptime(self._ManagementInfo['expectDeliveryTime'], '%Y-%m-%d')

        return float((agreeDeliveryTime - expectDeliveryTime).days)

    def inventoryRequirement(self):
        """
        库存量与需求量之比
        :return:
        """
        if self._ManagementInfo['corporeRequirement'] == 'missing':
            return 'missing'
        if self._ManagementInfo['corporeRequirement'] == 0:
            return 99999
        try:
            return float(self._ManagementInfo['corporeInventory']) / float(self._ManagementInfo['corporeRequirement'])
        except Exception:
            return 99999



class SubjectMatterInfoIndexGen(RawDataGen):
    """
    二级模块: [标的物信息]
    """

    def __init__(self, companyId, tastId, applyId):
        RawDataGen.__init__(self, companyId, tastId, applyId)
        self._subjectMatterInfo = self.subjectMatterInfo()
        self._orderEntrustBuyDetail = self.OrderEntrustBuyDetail()
        self._subjectMatterPriceInfo = self.SubjectMatterPriceInfo()

    def sourceToMoney(self):
        """
        货物变现能力
        :return:
        """
        return self._subjectMatterInfo['sourceToMoney']

    def sourceConsumable(self):
        """
        货物易损耗性
        :return:
        """
        if self._subjectMatterInfo['sourceConsumable'] == 'missing':
            return 'missing'
        return self._subjectMatterInfo['sourceConsumable']

    def sourceStabilization(self):
        """
        货物稳定性
        :return:
        """
        if self._subjectMatterInfo['sourceStabilization'] == 'missing':
            return 'missing'
        return self._subjectMatterInfo['sourceStabilization']

    def bigType(self):
        """
        货物交割类型
        :return:
        """
        if self._orderEntrustBuyDetail['deliveryType'] == 'missing':
            return 'missing'
        return self._orderEntrustBuyDetail['deliveryType']

    def coefficientPrice(self):
        """
        货物价格变异系数
        :return:
        """
        if self._subjectMatterPriceInfo['coefficientPrice'] == 'missing':
            return 'missing'
        return self._subjectMatterPriceInfo['coefficientPrice']

    def monthPriceDown(self):
        """
        货物月均价格下跌指数
        :return:
        """
        if self._subjectMatterPriceInfo['monthPriceDown'] == 'missing':
            return 'missing'
        return self._subjectMatterPriceInfo['monthPriceDown']

    def priceVariable(self):
        """
        货物当前价格波动系数
        :return:
        """
        if self._subjectMatterPriceInfo['priceVariable'] == 'missing':
            return 'missing'
        return self._subjectMatterPriceInfo['priceVariable']

    def monthPriceVariable(self):
        """
        货物月均价格波动
        :return:
        """
        if self._subjectMatterPriceInfo['monthPriceVariable'] == 'missing':
            return 'missing'
        return self._subjectMatterPriceInfo['monthPriceVariable']


if __name__ == '__main__':
    print ManagementInfoIndexGen(u'峨边瑞凯通贸易有限责任公司', u'煤炭', '1902260069561001').inventoryRequirement()
    ###########
    # 基础信息
    ###########
    basicInfo = BasicInfoIndexGen(u'四川明达集团实业有限公司', u'铬铁', '1902210059801022')
    print basicInfo.businessLife()
    print basicInfo.registeredCapital()
    print basicInfo.typesOfBusinessRgist()
    print basicInfo.enterpriSharehld()
    print basicInfo.numOfLegalPersonSharehld()
    print basicInfo.shareRatioOfLegalPersonsEquity()
    print basicInfo.largestShareholders()
    print basicInfo.isCoreCompany()
    print basicInfo.isPublicCompany()
    print basicInfo.isImportCompany()
    print basicInfo.topCompanyRank()
    print basicInfo.largestShareholdersIsLegalPerson()

    ##########
    # 财务信息
    ##########
    financialInfoIndexGen = FinancialInfoIndexGen(u'四川明达集团实业有限公司', u'铬铁', '1902210059801022')
    # print financialInfoIndexGen.assetLiabilityRatio()
    # print financialInfoIndexGen.liquidityRatio()
    # print financialInfoIndexGen.quickRatio()
    # print financialInfoIndexGen.interestProtection()
    # print financialInfoIndexGen.cashFlow()
    # print financialInfoIndexGen.netProfit()
    # print financialInfoIndexGen.peRatio()
    # print financialInfoIndexGen.pbRatio()
    print financialInfoIndexGen.netOperatingCashToValueRatio()
    print financialInfoIndexGen.netProfitCashToGoodsRatio()
    # print financialInfoIndexGen.cashGrowthRate()
    # print financialInfoIndexGen.profitGrowthRate()
    # print financialInfoIndexGen.creditVelocity()
    # print financialInfoIndexGen.stockVelocity()
    # print financialInfoIndexGen.grossProfitRate()

    #########
    pass

