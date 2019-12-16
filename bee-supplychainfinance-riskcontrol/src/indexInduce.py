#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
Created on 2018/12/22
@Author: regan

委托采购：
按企业类型进行指标归档和权重分配：供货商、委托企业、货代公司

委托销售：
按企业类型进行指标归档和权重分配：购货企业、委托企业、货代公司
"""
import os, sys

dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.dirname(dir))

from util.confRead import confRead
from rawIndexGen import BasicInfoIndexGen, FinancialInfoIndexGen, CreditReportIndexGen, ManagementInfoIndexGen, \
    SubjectMatterInfoIndexGen
from util.ESQuery_url import esQuery_indexVariable


class CompanyBaseInfoInduce():
    """
    基本信息
    :return:
    """

    def __init__(self, companyId, tastId, buyOrSell, applyId):
        self._basicInfoIndexGen = BasicInfoIndexGen(companyId, tastId, applyId)
        self._confGrade = confRead(buyOrSell, 'grade')
        self._confWeight = confRead(buyOrSell, 'weight')
        self.tastId = tastId

    def businessLife(self, model):
        """
        经营年限
        :return:
        """
        businessLife_value = self._basicInfoIndexGen.businessLife()
        if businessLife_value == 'missing':
            return eval(self._confGrade.get(model, 'businessLife'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'businessLife'))
        businessLife_index = 0
        for key, value in eval(self._confGrade.get(model, 'businessLife')).items():
            if businessLife_value > key[0] and businessLife_value <= key[1]:
                businessLife_index = value * eval(self._confWeight.get(model, 'businessLife'))
                break
        return businessLife_index

    def registeredCapital(self, model):
        """
        注册资本
        :return:
        """
        registeredCapital_value = self._basicInfoIndexGen.registeredCapital()
        if registeredCapital_value == 'missing':
            return eval(self._confGrade.get(model, 'registeredCapital'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'registeredCapital'))
        registeredCapital_index = 0
        for key, value in eval(self._confGrade.get(model, 'registeredCapital')).items():
            if registeredCapital_value > key[0] and registeredCapital_value <= key[1]:
                registeredCapital_index = value * eval(self._confWeight.get(model, 'registeredCapital'))
                break
        return registeredCapital_index

    def enterpriSharehld(self, model):
        """
        参股企业数
        :return:
        """
        enterpriSharehld_value = self._basicInfoIndexGen.enterpriSharehld()
        enterpriSharehld_index = 0
        if enterpriSharehld_value == 'missing':
            return eval(self._confGrade.get(model, 'enterpriSharehld'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'enterpriSharehld'))
        for key, value in eval(self._confGrade.get(model, 'enterpriSharehld')).items():
            if enterpriSharehld_value >= key[0] and enterpriSharehld_value < key[1]:
                enterpriSharehld_index = value * eval(self._confWeight.get(model, 'enterpriSharehld'))
                break
        return enterpriSharehld_index

    def typesOfBusinessRgist(self, model):
        """
        工商注册类型
        :return:
        """
        typesOfBusinessRgist_value = self._basicInfoIndexGen.typesOfBusinessRgist()
        for key, value in eval(self._confGrade.get(model, 'typesOfBusinessRgist')).items():
            if unicode(key, 'utf-8') in typesOfBusinessRgist_value:
                typesOfBusinessRgist_index = value * eval(self._confWeight.get(model, 'typesOfBusinessRgist'))
                return typesOfBusinessRgist_index

        return eval(self._confGrade.get(model, 'typesOfBusinessRgist'))[u'其他企业'] * eval(
            self._confWeight.get(model, 'typesOfBusinessRgist'))

    def numOfLegalPersonSharehld(self, model):
        """
        法人股东个数
        :return:
        """
        numOfLegalPersonSharehld_value = self._basicInfoIndexGen.numOfLegalPersonSharehld()
        if numOfLegalPersonSharehld_value == 'missing':
            return eval(self._confGrade.get(model, 'numOfLegalPersonSharehld'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'numOfLegalPersonSharehld'))
        numOfLegalPersonSharehld_index = 0
        for key, value in eval(self._confGrade.get(model, 'numOfLegalPersonSharehld')).items():
            if numOfLegalPersonSharehld_value >= key[0] and numOfLegalPersonSharehld_value < key[1]:
                numOfLegalPersonSharehld_index = value * eval(self._confWeight.get(model, 'numOfLegalPersonSharehld'))
                break
        return numOfLegalPersonSharehld_index

    def shareRatioOfLegalPersonsEquity(self, model):
        """
        法人股权占比
        :return:
        """
        shareRatioOfLegalPersonsEquity_value = self._basicInfoIndexGen.shareRatioOfLegalPersonsEquity()
        if shareRatioOfLegalPersonsEquity_value == 'missing':
            return eval(self._confGrade.get(model, 'shareRatioOfLegalPersonsEquity'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'shareRatioOfLegalPersonsEquity'))
        shareRatioOfLegalPersonsEquity_index = 0
        for key, value in eval(self._confGrade.get(model, 'shareRatioOfLegalPersonsEquity')).items():
            if shareRatioOfLegalPersonsEquity_value >= key[0] and shareRatioOfLegalPersonsEquity_value < key[1]:
                shareRatioOfLegalPersonsEquity_index = value * eval(
                    self._confWeight.get(model, 'shareRatioOfLegalPersonsEquity'))
                break
        return shareRatioOfLegalPersonsEquity_index

    def largestShareholders(self, model):
        """
        第一大股东对外投资企业个数
        :return:
        """
        largestShareholders_value = self._basicInfoIndexGen.largestShareholders()
        largestShareholders_index = 0
        if largestShareholders_value == 'missing':
            return eval(self._confGrade.get(model, 'largestShareholders'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'largestShareholders'))
        for key, value in eval(self._confGrade.get(model, 'largestShareholders')).items():
            if largestShareholders_value >= key[0] and largestShareholders_value < key[1]:
                largestShareholders_index = value * eval(self._confWeight.get(model, 'largestShareholders'))
                break
        return largestShareholders_index

    def isCoreCompany(self, model):
        """
        是否核心企业
        :return:
        """
        isCoreCompany_value = self._basicInfoIndexGen.isCoreCompany()
        isCoreCompany_index = 0
        for key, value in eval(self._confGrade.get(model, 'isCoreCompany')).items():
            if isCoreCompany_value == key:
                isCoreCompany_index = value * eval(self._confWeight.get(model, 'isCoreCompany'))
                break
        return isCoreCompany_index

    def isPublicCompany(self, model):
        """
        是否上市企业(包括新三板)
        :return:
        """
        isPublicCompany_value = self._basicInfoIndexGen.isPublicCompany()
        isPublicCompany_index = 0
        for key, value in eval(self._confGrade.get(model, 'isPublicCompany')).items():
            if isPublicCompany_value == key:
                isPublicCompany_index = value * eval(self._confWeight.get(model, 'isPublicCompany'))
                break
        return isPublicCompany_index

    def isImportCompany(self, model):
        """
        是否国企、央企
        :return:
        """
        isImportCompany_value = self._basicInfoIndexGen.isImportCompany()
        isImportCompany_index = 0
        for key, value in eval(self._confGrade.get(model, 'isImportCompany')).items():
            if isImportCompany_value == key:
                isImportCompany_index = value * eval(self._confWeight.get(model, 'isImportCompany'))
                break
        return isImportCompany_index

    def topCompanyRank(self, model):
        """
        近三年世界五百强平均排名
        :return:
        """
        topCompanyRank_value = self._basicInfoIndexGen.topCompanyRank()
        topCompanyRank_index = 0
        if topCompanyRank_value == 'missing':
            return eval(self._confGrade.get(model, 'topCompanyRank'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'topCompanyRank'))
        for key, value in eval(self._confGrade.get(model, 'topCompanyRank')).items():
            if topCompanyRank_value > key[0] and topCompanyRank_value <= key[1]:
                topCompanyRank_index = value * eval(self._confWeight.get(model, 'topCompanyRank'))
                break
        return topCompanyRank_index

    def largestShareholdersIsLegalPerson(self, model):
        """
        第一大自然人股东和是否与企业法人一致
        :return:
        """
        largestShareholdersIsLegalPerson_value = self._basicInfoIndexGen.largestShareholdersIsLegalPerson()
        largestShareholdersIsLegalPerson_index = 0
        for key, value in eval(self._confGrade.get(model, 'largestShareholdersIsLegalPerson')).items():
            if largestShareholdersIsLegalPerson_value == key:
                largestShareholdersIsLegalPerson_index = value * eval(
                    self._confWeight.get(model, 'largestShareholdersIsLegalPerson'))
                break
        return largestShareholdersIsLegalPerson_index

    def indexVariable(self, model):
        """
        指数变化效率*(当前景气指数 - min(近6个月标的物景气指数))/近6个月景气指数极差
        假设指数为1，3，2，6，价格总变化为6-1＝5，但经历的路程为，abs(1-3）+abs(3-2)+abs(2-6)＝7，所以变化效率为5/7
        :return:
        """
        indexes = esQuery_indexVariable(self.tastId)
        l = len(indexes)
        if l == 0:
            return eval(self._confGrade.get(model, 'indexVariable'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'indexVariable'))
        indexVa = 0
        for a, x in enumerate(indexes):
            if a != l - 1:
                indexVa += abs(indexes[a + 1] - x)

        try:
            index_value = ((indexes[-1] - indexes[0]) / indexVa) * (indexes[-1] - min(indexes)) / (
                    max(indexes) - min(indexes))
        except:
            return eval(self._confGrade.get(model, 'indexVariable'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'indexVariable'))

        for key, value in eval(self._confGrade.get(model, 'indexVariable')).items():
            if index_value > key[0] and index_value <= key[1]:
                return value * eval(self._confWeight.get(model, 'indexVariable'))


class FinancialInfoInduce():
    def __init__(self, companyId, tastId, buyOrSell, applyId):
        self._financialInfoIndexGen = FinancialInfoIndexGen(companyId, tastId, applyId, buyOrSell)
        self._confGrade = confRead(buyOrSell, 'grade')
        self._confWeight = confRead(buyOrSell, 'weight')

    def assetLiabilityRatio(self, model):
        """
        资产负债率
        :return:
        """
        assetLiabilityRatio_value = self._financialInfoIndexGen.assetLiabilityRatio()
        assetLiabilityRatio_index = 0
        if assetLiabilityRatio_value == 'missing':
            return eval(self._confGrade.get(model, 'assetLiabilityRatio'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'assetLiabilityRatio'))
        for key, value in eval(self._confGrade.get(model, 'assetLiabilityRatio')).items():
            if assetLiabilityRatio_value > key[0] and assetLiabilityRatio_value <= key[1]:
                assetLiabilityRatio_index = value * eval(self._confWeight.get(model, 'assetLiabilityRatio'))
                break
        return assetLiabilityRatio_index

    def liquidityRatio(self, model):
        """
        流动比率
        :return:
        """
        liquidityRatio_value = self._financialInfoIndexGen.liquidityRatio()
        liquidityRatio_index = 0
        if liquidityRatio_value == 'missing':
            return eval(self._confGrade.get(model, 'liquidityRatio'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'liquidityRatio'))
        for key, value in eval(self._confGrade.get(model, 'liquidityRatio')).items():
            if liquidityRatio_value > key[0] and liquidityRatio_value <= key[1]:
                liquidityRatio_index = value * eval(self._confWeight.get(model, 'liquidityRatio'))
                break
        return liquidityRatio_index

    def quickRatio(self, model):
        """
        速动比率
        :return:
        """
        quickRatio_value = self._financialInfoIndexGen.quickRatio()
        quickRatio_index = 0
        if quickRatio_value == 'missing':
            return eval(self._confGrade.get(model, 'quickRatio'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'quickRatio'))
        for key, value in eval(self._confGrade.get(model, 'quickRatio')).items():
            if quickRatio_value >= key[0] and quickRatio_value < key[1]:
                quickRatio_index = value * eval(self._confWeight.get(model, 'quickRatio'))
                break
        return quickRatio_index

    def interestProtection(self, model):
        """
        利息保障倍数
        :return:
        """
        interestProtection_value = self._financialInfoIndexGen.interestProtection()
        interestProtection_index = 0
        if interestProtection_value == 'missing':
            return eval(self._confGrade.get(model, 'interestProtection'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'interestProtection'))
        for key, value in eval(self._confGrade.get(model, 'interestProtection')).items():
            if interestProtection_value >= key[0] and interestProtection_value < key[1]:
                interestProtection_index = value * eval(self._confWeight.get(model, 'interestProtection'))
                break
        return interestProtection_index

    def netOperatingCashToValueRatio(self, model):
        """
        经营性现金净额货值比
        :return:
        """
        netOperatingCashToValueRatio_value = self._financialInfoIndexGen.netOperatingCashToValueRatio()
        netOperatingCashToValueRatio_index = 0
        if netOperatingCashToValueRatio_value == 'missing':
            return eval(self._confGrade.get(model, 'netOperatingCashToValueRatio'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'netOperatingCashToValueRatio'))
        for key, value in eval(self._confGrade.get(model, 'netOperatingCashToValueRatio')).items():
            if netOperatingCashToValueRatio_value > key[0] and netOperatingCashToValueRatio_value <= key[1]:
                netOperatingCashToValueRatio_index = value * eval(
                    self._confWeight.get(model, 'netOperatingCashToValueRatio'))
                break
        return netOperatingCashToValueRatio_index

    def netProfitCashToGoodsRatio(self, model):
        """
        净利润现金净额货值比
        :return:
        """
        netProfitCashToGoodsRatio_value = self._financialInfoIndexGen.netProfitCashToGoodsRatio()
        netProfitCashToGoodsRatio_index = 0
        if netProfitCashToGoodsRatio_value == 'missing':
            return eval(self._confGrade.get(model, 'netProfitCashToGoodsRatio'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'netProfitCashToGoodsRatio'))
        for key, value in eval(self._confGrade.get(model, 'netProfitCashToGoodsRatio')).items():
            if netProfitCashToGoodsRatio_value >= key[0] and netProfitCashToGoodsRatio_value < key[1]:
                netProfitCashToGoodsRatio_index = value * eval(self._confWeight.get(model, 'netProfitCashToGoodsRatio'))
                break
        return netProfitCashToGoodsRatio_index

    def cashGrowthRate(self, model):
        """
        销售利润增长率
        :return:
        """
        cashGrowthRate_value = self._financialInfoIndexGen.cashGrowthRate()
        cashGrowthRate_index = 0
        if cashGrowthRate_value == 'missing':
            return eval(self._confGrade.get(model, 'cashGrowthRate'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'cashGrowthRate'))
        for key, value in eval(self._confGrade.get(model, 'cashGrowthRate')).items():
            if cashGrowthRate_value > key[0] and cashGrowthRate_value <= key[1]:
                cashGrowthRate_index = value * eval(self._confWeight.get(model, 'cashGrowthRate'))
                break
        return cashGrowthRate_index

    def profitGrowthRate(self, model):
        """
        净利润增长率
        :return:
        """
        profitGrowthRate_value = self._financialInfoIndexGen.profitGrowthRate()
        profitGrowthRate_index = 0
        if profitGrowthRate_value == 'missing':
            return eval(self._confGrade.get(model, 'profitGrowthRate'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'profitGrowthRate'))
        for key, value in eval(self._confGrade.get(model, 'profitGrowthRate')).items():
            if profitGrowthRate_value > key[0] and profitGrowthRate_value <= key[1]:
                profitGrowthRate_index = value * eval(self._confWeight.get(model, 'profitGrowthRate'))
                break
        return profitGrowthRate_index

    def creditVelocity(self, model):
        """
        应收账款周转率
        :return:
        """
        creditVelocity_value = self._financialInfoIndexGen.creditVelocity()
        creditVelocity_index = 0
        if creditVelocity_value == 'missing':
            return eval(self._confGrade.get(model, 'creditVelocity'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'creditVelocity'))
        for key, value in eval(self._confGrade.get(model, 'creditVelocity')).items():
            if creditVelocity_value > key[0] and creditVelocity_value <= key[1]:
                creditVelocity_index = value * eval(self._confWeight.get(model, 'creditVelocity'))
                break
        return creditVelocity_index

    def stockVelocity(self, model):
        """
        存货周转率
        :return:
        """
        stockVelocity_value = self._financialInfoIndexGen.stockVelocity()
        stockVelocity_index = 0
        if stockVelocity_value == 'missing':
            return eval(self._confGrade.get(model, 'stockVelocity'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'stockVelocity'))
        for key, value in eval(self._confGrade.get(model, 'stockVelocity')).items():
            if stockVelocity_value > key[0] and stockVelocity_value <= key[1]:
                stockVelocity_index = value * eval(self._confWeight.get(model, 'stockVelocity'))
                break
        return stockVelocity_index

    def grossProfitRate(self, model):
        """
        委托企业生产销售毛利润率(%)
        :return:
        """
        grossProfitRate_value = self._financialInfoIndexGen.grossProfitRate()
        grossProfitRate_index = 0
        if grossProfitRate_value == 'missing':
            return eval(self._confGrade.get(model, 'grossProfitRate'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'grossProfitRate'))
        for key, value in eval(self._confGrade.get(model, 'grossProfitRate')).items():
            if grossProfitRate_value > key[0] and grossProfitRate_value <= key[1]:
                grossProfitRate_index = value * eval(self._confWeight.get(model, 'grossProfitRate'))
                break
        return grossProfitRate_index

    def cashFlow(self, model):
        """
        经营性现金净流量
        :return:
        """
        cashFlow_value = self._financialInfoIndexGen.cashFlow()
        cashFlow_index = 0
        if cashFlow_value == 'missing':
            return eval(self._confGrade.get(model, 'cashFlow'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'cashFlow'))
        for key, value in eval(self._confGrade.get(model, 'cashFlow')).items():
            if cashFlow_value > key[0] and cashFlow_value <= key[1]:
                cashFlow_index = value * eval(self._confWeight.get(model, 'cashFlow'))
                break
        return cashFlow_index

    def netProfit(self, model):
        """
        净利润现金净含量
        :return:
        """
        netProfit_value = self._financialInfoIndexGen.netProfit()
        netProfit_index = 0
        if netProfit_value == 'missing':
            return eval(self._confGrade.get(model, 'netProfit'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'netProfit'))
        for key, value in eval(self._confGrade.get(model, 'netProfit')).items():
            if netProfit_value >= key[0] and netProfit_value < key[1]:
                netProfit_index = value * eval(self._confWeight.get(model, 'netProfit'))
                break
        return netProfit_index

    def peRatio(self, model):
        """
        市盈率
        :return:
        """
        peRatio_value = self._financialInfoIndexGen.peRatio()
        peRatio_index = 0
        # if peRatio_value == 'missing':
        #     return eval(self._confGrade.get(model, 'peRatio'))[('missing', 'missing')] * eval(
        #         self._confWeight.get(model, 'peRatio'))
        for key, value in eval(self._confGrade.get(model, 'peRatio')).items():
            if peRatio_value > key[0] and peRatio_value <= key[1]:
                peRatio_index = value * eval(self._confWeight.get(model, 'peRatio'))
                break
        return peRatio_index

    def pbRatio(self, model):
        """
        市净率
        :return:
        """
        pbRatio_value = self._financialInfoIndexGen.pbRatio()
        pbRatio_index = 0
        # if pbRatio_value == 'missing':
        #     return eval(self._confGrade.get(model, 'pbRatio'))[('missing', 'missing')] * eval(
        #         self._confWeight.get(model, 'pbRatio'))
        for key, value in eval(self._confGrade.get(model, 'pbRatio')).items():
            if pbRatio_value > key[0] and pbRatio_value <= key[1]:
                pbRatio_index = value * eval(self._confWeight.get(model, 'pbRatio'))
                break
        return pbRatio_index


class CreditReportInduce():
    """
    企业征信
    :return:
    """

    def __init__(self, companyId, tastId, buyOrSell, applyId):
        self._creditReportIndexGen = CreditReportIndexGen(companyId, tastId, applyId)
        self._confGrade = confRead(buyOrSell, 'grade')
        self._confWeight = confRead(buyOrSell, 'weight')

    def creditLife(self, model):
        """
        信贷年限
        :return:
        """
        creditLife_value = self._creditReportIndexGen.creditLife()
        creditLife_index = 0
        if creditLife_value == 'missing':
            return eval(self._confGrade.get(model, 'creditLife'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'creditLife'))
        for key, value in eval(self._confGrade.get(model, 'creditLife')).items():
            if creditLife_value > key[0] and creditLife_value <= key[1]:
                creditLife_index = value * eval(self._confWeight.get(model, 'creditLife'))
                break
        return creditLife_index

    def cooperativeInstitution(self, model):
        """
        信贷合作机构数
        :return:
        """
        cooperativeInstitution_value = self._creditReportIndexGen.cooperativeInstitution()
        cooperativeInstitution_index = 0
        if cooperativeInstitution_value == 'missing':
            return eval(self._confGrade.get(model, 'cooperativeInstitution'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'cooperativeInstitution'))
        for key, value in eval(self._confGrade.get(model, 'cooperativeInstitution')).items():
            if cooperativeInstitution_value > key[0] and cooperativeInstitution_value <= key[1]:
                cooperativeInstitution_index = value * eval(self._confWeight.get(model, 'cooperativeInstitution'))
                break
        return cooperativeInstitution_index

    def unclearedInstitution(self, model):
        """
        未结清信贷机构数
        :return:
        """
        unclearedInstitution_value = self._creditReportIndexGen.unclearedInstitution()
        unclearedInstitution_index = 0
        if unclearedInstitution_value == 'missing':
            return eval(self._confGrade.get(model, 'unclearedInstitution'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'unclearedInstitution'))
        for key, value in eval(self._confGrade.get(model, 'unclearedInstitution')).items():
            if unclearedInstitution_value >= key[0] and unclearedInstitution_value < key[1]:
                unclearedInstitution_index = value * eval(self._confWeight.get(model, 'unclearedInstitution'))
                break
        return unclearedInstitution_index

    def unclearedCreditAmount(self, model):
        """
        未结清信贷余额
        :return:
        """
        unclearedCreditAmount_value = self._creditReportIndexGen.unclearedCreditAmount()
        unclearedCreditAmount_index = 0
        if unclearedCreditAmount_value == 'missing':
            return eval(self._confGrade.get(model, 'unclearedCreditAmount'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'unclearedCreditAmount'))
        for key, value in eval(self._confGrade.get(model, 'unclearedCreditAmount')).items():
            if unclearedCreditAmount_value >= key[0] and unclearedCreditAmount_value < key[1]:
                unclearedCreditAmount_index = value * eval(self._confWeight.get(model, 'unclearedCreditAmount'))
                break
        return unclearedCreditAmount_index

    def ratioOfUnliquidatedLoans(self, model):
        """
        未结清贷款比例
        :return:
        """
        ratioOfUnliquidatedLoans_value = self._creditReportIndexGen.ratioOfUnliquidatedLoans()
        ratioOfUnliquidatedLoans_index = 0
        if ratioOfUnliquidatedLoans_value == 'missing':
            return eval(self._confGrade.get(model, 'ratioOfUnliquidatedLoans'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'ratioOfUnliquidatedLoans'))
        for key, value in eval(self._confGrade.get(model, 'ratioOfUnliquidatedLoans')).items():
            if ratioOfUnliquidatedLoans_value >= key[0] and ratioOfUnliquidatedLoans_value < key[1]:
                ratioOfUnliquidatedLoans_index = value * eval(self._confWeight.get(model, 'ratioOfUnliquidatedLoans'))
                break
        return ratioOfUnliquidatedLoans_index


class ManagementInfoInduce():
    """
    经营信息
    """

    def __init__(self, companyId, tastId, buyOrSell, applyId):
        self.tastId = tastId
        self._managementInfoIndexGen = ManagementInfoIndexGen(companyId, tastId, applyId)
        self._confGrade = confRead(buyOrSell, 'grade')
        self._confWeight = confRead(buyOrSell, 'weight')

    def indexVariable(self, model):
        """
        指数变化效率*(当前景气指数 - min(近6个月标的物景气指数))/近6个月景气指数极差
        假设指数为1，3，2，6，价格总变化为6-1＝5，但经历的路程为，abs(1-3）+abs(3-2)+abs(2-6)＝7，所以变化效率为5/7
        :return:
        """
        try:
            indexes = esQuery_indexVariable(self.tastId)
        except Exception:
            return eval(self._confGrade.get(model, 'indexVariable'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'indexVariable'))
        l = len(indexes)
        if l == 0:
            return eval(self._confGrade.get(model, 'indexVariable'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'indexVariable'))
        indexVa = 0
        for a, x in enumerate(indexes):
            if a != l - 1:
                indexVa += abs(indexes[a + 1] - x)

        try:
            index_value = ((indexes[-1] - indexes[0]) / indexVa) * (indexes[-1] - min(indexes)) / (
                    max(indexes) - min(indexes))
        except:
            return eval(self._confGrade.get(model, 'indexVariable'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'indexVariable'))

        for key, value in eval(self._confGrade.get(model, 'indexVariable')).items():
            if index_value > key[0] and index_value <= key[1]:
                return value * eval(self._confWeight.get(model, 'indexVariable'))

    def deviceType(self, model):
        """
        设备类型
        :return:
        """
        deviceType_value = self._managementInfoIndexGen.deviceType()
        deviceType_index = 0
        for key, value in eval(self._confGrade.get(model, 'deviceType')).items():
            if deviceType_value == unicode(key, 'utf-8'):
                deviceType_index = value * eval(self._confWeight.get(model, 'deviceType'))
                break
        return deviceType_index

    def deviceQuantity(self, model):
        """
        设备数量
        :return:
        """
        deviceQuantity_value = self._managementInfoIndexGen.deviceQuantity()
        deviceQuantity_index = 0
        if deviceQuantity_value == 'missing':
            return eval(self._confGrade.get(model, 'deviceQuantity'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'deviceQuantity'))
        for key, value in eval(self._confGrade.get(model, 'deviceQuantity')).items():
            if deviceQuantity_value > key[0] and deviceQuantity_value <= key[1]:
                deviceQuantity_index = value * eval(self._confWeight.get(model, 'deviceQuantity'))
                break
        return deviceQuantity_index

    def obsoleteDeviceRate(self, model):
        """
        设备老化率
        :return:
        """
        obsoleteDeviceRate_value = self._managementInfoIndexGen.obsoleteDeviceRate()
        obsoleteDeviceRate_index = 0
        # if obsoleteDeviceRate_value == 'missing':
        #     return eval(self._confGrade.get(model, 'obsoleteDeviceRate'))[('missing', 'missing')] * eval(
        #         self._confWeight.get(model, 'obsoleteDeviceRate'))
        for key, value in eval(self._confGrade.get(model, 'obsoleteDeviceRate')).items():
            if obsoleteDeviceRate_value > key[0] and obsoleteDeviceRate_value <= key[1]:
                obsoleteDeviceRate_index = value * eval(self._confWeight.get(model, 'obsoleteDeviceRate'))
                break
        return obsoleteDeviceRate_index

    def dailyCapacity(self, model):
        """
        每日产能
        :return:
        """
        dailyCapacity_value = self._managementInfoIndexGen.dailyCapacity()
        dailyCapacity_index = 0
        #if dailyCapacity_value == 'missing':
        #    return eval(self._confGrade.get(model, 'dailyCapacity'))[('missing', 'missing')] * eval(
        #        self._confWeight.get(model, 'dailyCapacity'))
        for key, value in eval(self._confGrade.get(model, 'dailyCapacity')).items():
            if dailyCapacity_value > key[0] and dailyCapacity_value <= key[1]:
                dailyCapacity_index = value * eval(self._confWeight.get(model, 'dailyCapacity'))
                break
        return dailyCapacity_index

    def dailyConsume(self, model):
        """
        每日炉/生产线委托产品消耗量
        :return:
        """
        dailyConsume_value = self._managementInfoIndexGen.dailyConsume()
        dailyConsume_index = 0
        #if dailyConsume_value == 'missing':
        #    return eval(self._confGrade.get(model, 'dailyConsume'))[('missing', 'missing')] * eval(
        #        self._confWeight.get(model, 'dailyConsume'))
        for key, value in eval(self._confGrade.get(model, 'dailyConsume')).items():
            if dailyConsume_value > key[0] and dailyConsume_value <= key[1]:
                dailyConsume_index = value * eval(self._confWeight.get(model, 'dailyConsume'))
                break
        return dailyConsume_index

    def outputConsume(self, model):
        """
        单位产出耗电量
        :return:
        """
        outputConsume_value = self._managementInfoIndexGen.outputConsume()
        outputConsume_index = 0
        #if outputConsume_value == 'missing':
        #    return eval(self._confGrade.get(model, 'outputConsume'))[('missing', 'missing')] * eval(
        #        self._confWeight.get(model, 'outputConsume'))
        for key, value in eval(self._confGrade.get(model, 'outputConsume')).items():
            if outputConsume_value > key[0] and outputConsume_value <= key[1]:
                outputConsume_index = value * eval(self._confWeight.get(model, 'outputConsume'))
                break
        return outputConsume_index

    def sixMonFailRate(self, model):
        """
        近六个月环保设备故障率
        :return:
        """
        sixMonFailRate_value = self._managementInfoIndexGen.sixMonFailRate()
        sixMonFailRate_index = 0
        if sixMonFailRate_value == 'missing':
            return eval(self._confGrade.get(model, 'sixMonFailRate'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'sixMonFailRate'))
        for key, value in eval(self._confGrade.get(model, 'sixMonFailRate')).items():
            if sixMonFailRate_value >= key[0] and sixMonFailRate_value < key[1]:
                sixMonFailRate_index = value * eval(self._confWeight.get(model, 'sixMonFailRate'))
                break
        return sixMonFailRate_index

    def workingNormal(self, model):
        """
        当前环保设备是否正常运行
        :return:
        """
        workingNormal_value = self._managementInfoIndexGen.workingNormal()
        workingNormal_index = 0
        for key, value in eval(self._confGrade.get(model, 'workingNormal')).items():
            if workingNormal_value == key:
                workingNormal_index = value * eval(self._confWeight.get(model, 'workingNormal'))
                break
        return workingNormal_index

    def safetyEvaluationTime(self, model):
        """
        最近三年进行安全评价的次数
        :return:
        """
        safetyEvaluationTime_value = self._managementInfoIndexGen.safetyEvaluationTime()
        safetyEvaluationTime_index = 0
        for key, value in eval(self._confGrade.get(model, 'safetyEvaluationTime')).items():
            if safetyEvaluationTime_value == key:
                safetyEvaluationTime_index = value * eval(self._confWeight.get(model, 'safetyEvaluationTime'))
                break
        return safetyEvaluationTime_index

    def operatingRate(self, model):
        """
        最近3个月开工率
        :return:
        """
        operatingRate_value = self._managementInfoIndexGen.operatingRate()
        operatingRate_index = 0
        if operatingRate_value == 'missing':
            return eval(self._confGrade.get(model, 'operatingRate'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'operatingRate'))
        for key, value in eval(self._confGrade.get(model, 'operatingRate')).items():
            if operatingRate_value >= key[0] and operatingRate_value < key[1]:
                operatingRate_index = value * eval(self._confWeight.get(model, 'operatingRate'))
                break
        return operatingRate_index

    def corporeInventory(self, model):
        """
        库存量
        :return:
        """
        corporeInventory_value = self._managementInfoIndexGen.corporeInventory()
        corporeInventory_index = 0
        for key, value in eval(self._confGrade.get(model, 'corporeInventory')).items():
            if corporeInventory_value == unicode(key, 'utf-8'):
                corporeInventory_index = value * eval(self._confWeight.get(model, 'corporeInventory'))
                break
        return corporeInventory_index

    def inventoryRequirement(self, model):
        """
        库存量与需求量之比
        :return:
        """
        inventoryRequirement_value = self._managementInfoIndexGen.inventoryRequirement()
        inventoryRequirement_index = 0
        if inventoryRequirement_value == 'missing':
            return eval(self._confGrade.get(model, 'inventoryRequirement'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'inventoryRequirement'))
        for key, value in eval(self._confGrade.get(model, 'inventoryRequirement')).items():
            if inventoryRequirement_value > key[0] and inventoryRequirement_value <= key[1]:
                inventoryRequirement_index = value * eval(self._confWeight.get(model, 'inventoryRequirement'))
                break
        return inventoryRequirement_index

    def supplierTimeDelta(self, model):
        """
        供货时间与预期时间之间的差距
        :return:
        """
        supplierTimeDelta_value = self._managementInfoIndexGen.supplierTimeDelta()
        supplierTimeDelta_index = 0
        if supplierTimeDelta_value == 'missing':
            return eval(self._confGrade.get(model, 'supplierTimeDelta'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'supplierTimeDelta'))
        for key, value in eval(self._confGrade.get(model, 'supplierTimeDelta')).items():
            if supplierTimeDelta_value > key[0] and supplierTimeDelta_value <= key[1]:
                supplierTimeDelta_index = value * eval(self._confWeight.get(model, 'supplierTimeDelta'))
                break
        return supplierTimeDelta_index


class SubjectMatterInfoInduce():
    def __init__(self, companyId, tastId, buyOrSell, applyId):
        self._subjectMatterInfoIndexGen = SubjectMatterInfoIndexGen(companyId, tastId, applyId)
        self._confGrade = confRead(buyOrSell, 'grade')
        self._confWeight = confRead(buyOrSell, 'weight')

    def sourceToMoney(self, model):
        """
        货物变现能力
        :return:
        """
        sourceToMoney_value = self._subjectMatterInfoIndexGen.sourceToMoney()
        sourceToMoney_index = 0
        for key, value in eval(self._confGrade.get(model, 'sourceToMoney')).items():
            if sourceToMoney_value == unicode(key, 'utf-8'):
                sourceToMoney_index = value * eval(self._confWeight.get(model, 'sourceToMoney'))
                break
        return sourceToMoney_index

    def sourceConsumable(self, model):
        """
        货物易损耗性
        :return:
        """
        sourceConsumable_value = self._subjectMatterInfoIndexGen.sourceConsumable()
        sourceConsumable_index = 0
        for key, value in eval(self._confGrade.get(model, 'sourceConsumable')).items():
            if sourceConsumable_value == unicode(key, 'utf-8'):
                sourceConsumable_index = value * eval(self._confWeight.get(model, 'sourceConsumable'))
                break
        return sourceConsumable_index

    def sourceStabilization(self, model):
        """
        货物稳定性
        :return:
        """
        sourceStabilization_value = self._subjectMatterInfoIndexGen.sourceStabilization()
        sourceStabilization_index = 0
        for key, value in eval(self._confGrade.get(model, 'sourceStabilization')).items():
            if sourceStabilization_value == unicode(key, 'utf-8'):
                sourceStabilization_index = value * eval(self._confWeight.get(model, 'sourceStabilization'))
                break
        return sourceStabilization_index

    def bigType(self, model):
        """
        货物交割类型
        :return:
        """
        bigType_value = self._subjectMatterInfoIndexGen.bigType()
        bigType_index = 0
        for key, value in eval(self._confGrade.get(model, 'bigType')).items():
            if bigType_value == unicode(key, 'utf-8'):
                bigType_index = value * eval(self._confWeight.get(model, 'bigType'))
                break
        return bigType_index

    def coefficientPrice(self, model):
        """
        价格变异系数
        :return:
        """
        coefficientPrice_value = self._subjectMatterInfoIndexGen.coefficientPrice()
        if coefficientPrice_value == '--':
            return 50 * eval(self._confWeight.get(model, 'coefficientPrice'))
        if coefficientPrice_value == 'missing':
            return eval(self._confGrade.get(model, 'coefficientPrice'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'coefficientPrice'))
        coefficientPrice_index = 0
        for key, value in eval(self._confGrade.get(model, 'coefficientPrice')).items():
            if coefficientPrice_value > key[0] and coefficientPrice_value <= key[1]:
                coefficientPrice_index = value * eval(self._confWeight.get(model, 'coefficientPrice'))
                break
        return coefficientPrice_index

    def monthPriceDown(self, model):
        """
        月均价格下跌指数
        :return:
        """
        monthPriceDown_value = self._subjectMatterInfoIndexGen.monthPriceDown()
        if monthPriceDown_value == '--':
            return 50 * eval(self._confWeight.get(model, 'monthPriceDown'))
        monthPriceDown_index = 0
        if monthPriceDown_value == 'missing':
            return eval(self._confGrade.get(model, 'monthPriceDown'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'monthPriceDown'))
        for key, value in eval(self._confGrade.get(model, 'monthPriceDown')).items():
            if monthPriceDown_value > key[0] and monthPriceDown_value <= key[1]:
                monthPriceDown_index = value * eval(self._confWeight.get(model, 'monthPriceDown'))
                break
        return monthPriceDown_index

    def priceVariable(self, model):
        """
        当前价格波动系数
        :return:
        """
        priceVariable_value = self._subjectMatterInfoIndexGen.priceVariable()
        if priceVariable_value == '--':
            return 50 * eval(self._confWeight.get(model, 'priceVariable'))
        if priceVariable_value == 'missing':
            return eval(self._confGrade.get(model, 'priceVariable'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'priceVariable'))
        priceVariable_index = 0
        for key, value in eval(self._confGrade.get(model, 'priceVariable')).items():
            if priceVariable_value >= key[0] and priceVariable_value < key[1]:
                priceVariable_index = value * eval(self._confWeight.get(model, 'priceVariable'))
                break
        return priceVariable_index

    def monthPriceVariable(self, model):
        """
        货物月均价格波动
        :return:
        """
        monthPriceVariable_value = self._subjectMatterInfoIndexGen.monthPriceVariable()
        if monthPriceVariable_value == '--':
            return 50 * eval(self._confWeight.get(model, 'monthPriceVariable'))
        monthPriceVariable_index = 0
        if monthPriceVariable_value == 'missing':
            return eval(self._confGrade.get(model, 'monthPriceVariable'))[('missing', 'missing')] * eval(
                self._confWeight.get(model, 'monthPriceVariable'))
        for key, value in eval(self._confGrade.get(model, 'monthPriceVariable')).items():
            if monthPriceVariable_value > key[0] and monthPriceVariable_value <= key[1]:
                monthPriceVariable_index = value * eval(self._confWeight.get(model, 'monthPriceVariable'))
                break
        return monthPriceVariable_index


if __name__ == '__main__':
    ######################################################
    # 委托采购
    ######################################################
    # # 委托企业模型----基本信息
    companyBaseInfoInduce = CompanyBaseInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'buy')
    print companyBaseInfoInduce.businessLife('BaseInfo_Entrust')
    print companyBaseInfoInduce.registeredCapital('BaseInfo_Entrust')
    print companyBaseInfoInduce.enterpriSharehld('BaseInfo_Entrust')
    print companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Entrust')
    print companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Entrust')
    print companyBaseInfoInduce.shareRatioOfLegalPersonsEquity('BaseInfo_Entrust')
    print companyBaseInfoInduce.largestShareholders('BaseInfo_Entrust')

    # # 供货商企业模型----基本信息
    # companyBaseInfoInduce = CompanyBaseInfoInduce(u'国家电网有限公司', u'铬铁', 'buy')
    # print companyBaseInfoInduce.businessLife('BaseInfo_Supplier')
    # print companyBaseInfoInduce.registeredCapital('BaseInfo_Supplier')
    # print companyBaseInfoInduce.enterpriSharehld('BaseInfo_Supplier')
    # print companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Supplier')
    # print companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Supplier')
    # print companyBaseInfoInduce.shareRatioOfLegalPersonsEquity('BaseInfo_Supplier')
    # print companyBaseInfoInduce.largestShareholders('BaseInfo_Supplier')
    # print companyBaseInfoInduce.isCoreCompany('BaseInfo_Supplier')
    # print companyBaseInfoInduce.isPublicCompany('BaseInfo_Supplier')
    # print companyBaseInfoInduce.isImportCompany('BaseInfo_Supplier')
    # print companyBaseInfoInduce.topCompanyRank('BaseInfo_Supplier')

    # # 委托企业模型----担保公司基本信息
    # companyBaseInfoInduce = CompanyBaseInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'buy')
    # print companyBaseInfoInduce.businessLife('BaseInfo_Guarantee')
    # print companyBaseInfoInduce.registeredCapital('BaseInfo_Guarantee')
    # print companyBaseInfoInduce.enterpriSharehld('BaseInfo_Guarantee')
    # print companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Guarantee')
    # print companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Guarantee')
    # print companyBaseInfoInduce.shareRatioOfLegalPersonsEquity('BaseInfo_Guarantee')
    # print companyBaseInfoInduce.largestShareholders('BaseInfo_Guarantee')
    # print companyBaseInfoInduce.isCoreCompany('BaseInfo_Guarantee')
    # print companyBaseInfoInduce.isPublicCompany('BaseInfo_Guarantee')
    # print companyBaseInfoInduce.isImportCompany('BaseInfo_Guarantee')
    # print companyBaseInfoInduce.topCompanyRank('BaseInfo_Guarantee')

    # # 货代公司模型----基本信息
    # companyBaseInfoInduce = CompanyBaseInfoInduce(u'四川明达集团实业有限公司', u'铬铁', 'buy')
    # print companyBaseInfoInduce.businessLife('BaseInfo_Goods')
    # print companyBaseInfoInduce.registeredCapital('BaseInfo_Goods')
    # print companyBaseInfoInduce.enterpriSharehld('BaseInfo_Goods')
    # print companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Goods')
    # print companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Goods')
    # print companyBaseInfoInduce.largestShareholders('BaseInfo_Goods')
    # print companyBaseInfoInduce.largestShareholdersIsLegalPerson('BaseInfo_Goods')
    # print companyBaseInfoInduce.isImportCompany('BaseInfo_Goods')

    # # 委托企业模型----财务信息
    # financialInfoInduce = FinancialInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'buy')
    # print financialInfoInduce.assetLiabilityRatio('FinancialInfo_Entrust')
    # print financialInfoInduce.liquidityRatio('FinancialInfo_Entrust')
    # print financialInfoInduce.quickRatio('FinancialInfo_Entrust')
    # print financialInfoInduce.interestProtection('FinancialInfo_Entrust')
    # print financialInfoInduce.netOperatingCashToValueRatio('FinancialInfo_Entrust')
    # print financialInfoInduce.netProfitCashToGoodsRatio('FinancialInfo_Entrust')
    # print financialInfoInduce.cashGrowthRate('FinancialInfo_Entrust')
    # print financialInfoInduce.profitGrowthRate('FinancialInfo_Entrust')
    # print financialInfoInduce.creditVelocity('FinancialInfo_Entrust')
    # print financialInfoInduce.stockVelocity('FinancialInfo_Entrust')
    # print financialInfoInduce.grossProfitRate('FinancialInfo_Entrust')

    # # 委托企业模型----担保公司财务信息
    # financialInfoInduce = FinancialInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'buy')
    # print financialInfoInduce.assetLiabilityRatio('FinancialInfo_Guarantee')
    # print financialInfoInduce.liquidityRatio('FinancialInfo_Guarantee')
    # print financialInfoInduce.quickRatio('FinancialInfo_Guarantee')
    # print financialInfoInduce.interestProtection('FinancialInfo_Guarantee')
    # print financialInfoInduce.cashFlow('FinancialInfo_Guarantee')
    # print financialInfoInduce.netProfit('FinancialInfo_Guarantee')
    # print financialInfoInduce.peRatio('FinancialInfo_Guarantee')
    # print financialInfoInduce.pbRatio('FinancialInfo_Guarantee')
    # print financialInfoInduce.cashGrowthRate('FinancialInfo_Guarantee')
    # print financialInfoInduce.profitGrowthRate('FinancialInfo_Guarantee')
    # print financialInfoInduce.creditVelocity('FinancialInfo_Guarantee')
    # print financialInfoInduce.stockVelocity('FinancialInfo_Guarantee')

    # # 供货商企业模型----财务信息
    # financialInfoInduce = FinancialInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'buy')
    # print financialInfoInduce.assetLiabilityRatio('FinancialInfo_Supplier')
    # print financialInfoInduce.liquidityRatio('FinancialInfo_Supplier')
    # print financialInfoInduce.quickRatio('FinancialInfo_Supplier')
    # print financialInfoInduce.interestProtection('FinancialInfo_Supplier')
    # print financialInfoInduce.cashFlow('FinancialInfo_Supplier')
    # print financialInfoInduce.netProfit('FinancialInfo_Supplier')
    # print financialInfoInduce.peRatio('FinancialInfo_Supplier')
    # print financialInfoInduce.pbRatio('FinancialInfo_Supplier')
    # print financialInfoInduce.cashGrowthRate('FinancialInfo_Supplier')
    # print financialInfoInduce.profitGrowthRate('FinancialInfo_Supplier')
    # print financialInfoInduce.creditVelocity('FinancialInfo_Supplier')
    # print financialInfoInduce.stockVelocity('FinancialInfo_Supplier')


    # # 委托企业模型----企业征信
    # creditReportInduce = CreditReportInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'buy')
    # print creditReportInduce.creditLife('CreditReport_Entrust')
    # print creditReportInduce.cooperativeInstitution('CreditReport_Entrust')
    # print creditReportInduce.unclearedInstitution('CreditReport_Entrust')
    # print creditReportInduce.unclearedCreditAmount('CreditReport_Entrust')
    # print creditReportInduce.ratioOfUnliquidatedLoans('CreditReport_Entrust')

    # # 委托企业模型----经营信息
    # managementInfoInduce = ManagementInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'buy')
    # print managementInfoInduce.deviceType('ManagementInfo_Entrust')
    # print managementInfoInduce.deviceQuantity('ManagementInfo_Entrust')
    # print managementInfoInduce.obsoleteDeviceRate('ManagementInfo_Entrust')
    # print managementInfoInduce.dailyCapacity('ManagementInfo_Entrust')
    # print managementInfoInduce.dailyConsume('ManagementInfo_Entrust')
    # print managementInfoInduce.outputConsume('ManagementInfo_Entrust')
    # print managementInfoInduce.sixMonFailRate('ManagementInfo_Entrust')
    # print managementInfoInduce.workingNormal('ManagementInfo_Entrust')
    # print managementInfoInduce.safetyEvaluationTime('ManagementInfo_Entrust')
    # print managementInfoInduce.operatingRate('ManagementInfo_Entrust')
    # print managementInfoInduce.corporeInventory('ManagementInfo_Entrust')

    # # 供货商企业模型----经营信息
    # managementInfoInduce = ManagementInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'buy')
    # print managementInfoInduce.supplierTimeDelta('ManagementInfo_Supplier')
    # print managementInfoInduce.inventoryRequirement('ManagementInfo_Supplier')

    # 货代公司模型----标的物
    #subjectMatterInfoInduce = SubjectMatterInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'buy')
    #print subjectMatterInfoInduce.sourceToMoney('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.sourceConsumable('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.sourceStabilization('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.bigType('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.coefficientPrice('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.monthPriceDown('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.priceVariable('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.monthPriceVariable('SubjectMatterInfo_Goods')

    ######################################################
    # 委托销售
    ######################################################
    # 委托企业模型----基本信息
    # companyBaseInfoInduce = CompanyBaseInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'sell')
    # print companyBaseInfoInduce.businessLife('BaseInfo_Entrust')
    # print companyBaseInfoInduce.registeredCapital('BaseInfo_Entrust')
    # print companyBaseInfoInduce.enterpriSharehld('BaseInfo_Entrust')
    # print companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Entrust')
    # print companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Entrust')
    # print companyBaseInfoInduce.shareRatioOfLegalPersonsEquity('BaseInfo_Entrust')
    # print companyBaseInfoInduce.largestShareholders('BaseInfo_Entrust')

    # # 委托企业模型----财务信息
    # financialInfoInduce = FinancialInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'sell')
    # print financialInfoInduce.assetLiabilityRatio('FinancialInfo_Entrust')
    # print financialInfoInduce.liquidityRatio('FinancialInfo_Entrust')
    # print financialInfoInduce.quickRatio('FinancialInfo_Entrust')
    # print financialInfoInduce.interestProtection('FinancialInfo_Entrust')
    # print financialInfoInduce.cashFlow('FinancialInfo_Entrust')
    # print financialInfoInduce.netProfit('FinancialInfo_Entrust')
    # print financialInfoInduce.cashGrowthRate('FinancialInfo_Entrust')
    # print financialInfoInduce.profitGrowthRate('FinancialInfo_Entrust')
    # print financialInfoInduce.creditVelocity('FinancialInfo_Entrust')
    # print financialInfoInduce.stockVelocity('FinancialInfo_Entrust')

    # # 委托企业模型----企业征信
    # creditReportInduce = CreditReportInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'sell')
    # print creditReportInduce.creditLife('CreditReport_Entrust')
    # print creditReportInduce.cooperativeInstitution('CreditReport_Entrust')
    # print creditReportInduce.unclearedInstitution('CreditReport_Entrust')
    # print creditReportInduce.unclearedCreditAmount('CreditReport_Entrust')
    # print creditReportInduce.ratioOfUnliquidatedLoans('CreditReport_Entrust')

    # # 委托企业模型----经营信息
    # managementInfoInduce = ManagementInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'sell')
    # companyBaseInfoInduce = CompanyBaseInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'sell')
    # print managementInfoInduce.supplierTimeDelta('ManagementInfo_Entrust')
    # print managementInfoInduce.inventoryRequirement('ManagementInfo_Entrust')
    # print companyBaseInfoInduce.indexVariable('BaseInfo_Entrust')

    # # 购货商模型----基本信息
    # companyBaseInfoInduce = CompanyBaseInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'sell')
    # print companyBaseInfoInduce.businessLife('BaseInfo_Buier')
    # print companyBaseInfoInduce.registeredCapital('BaseInfo_Buier')
    # print companyBaseInfoInduce.enterpriSharehld('BaseInfo_Buier')
    # print companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Buier')
    # print companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Buier')
    # print companyBaseInfoInduce.shareRatioOfLegalPersonsEquity('BaseInfo_Buier')
    # print companyBaseInfoInduce.largestShareholders('BaseInfo_Buier')
    # print companyBaseInfoInduce.isCoreCompany('BaseInfo_Buier')
    # print companyBaseInfoInduce.isPublicCompany('BaseInfo_Buier')
    # print companyBaseInfoInduce.isImportCompany('BaseInfo_Buier')
    # print companyBaseInfoInduce.topCompanyRank('BaseInfo_Buier')

    # # 购货商模型----财务信息
    # financialInfoInduce = FinancialInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'sell')
    # print financialInfoInduce.assetLiabilityRatio('FinancialInfo_Buier')
    # print financialInfoInduce.liquidityRatio('FinancialInfo_Buier')
    # print financialInfoInduce.quickRatio('FinancialInfo_Buier')
    # print financialInfoInduce.interestProtection('FinancialInfo_Buier')
    # print financialInfoInduce.cashFlow('FinancialInfo_Buier')
    # print financialInfoInduce.netProfit('FinancialInfo_Buier')
    # print financialInfoInduce.peRatio('FinancialInfo_Buier')
    # print financialInfoInduce.pbRatio('FinancialInfo_Buier')
    # print financialInfoInduce.cashGrowthRate('FinancialInfo_Buier')
    # print financialInfoInduce.profitGrowthRate('FinancialInfo_Buier')
    # print financialInfoInduce.creditVelocity('FinancialInfo_Buier')
    # print financialInfoInduce.stockVelocity('FinancialInfo_Buier')
    # print financialInfoInduce.grossProfitRate('FinancialInfo_Buier')

    # # 购货商模型----经营信息
    # managementInfoInduce = ManagementInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'sell')
    # print managementInfoInduce.deviceType('ManagementInfo_Buier')
    # print managementInfoInduce.deviceQuantity('ManagementInfo_Buier')
    # print managementInfoInduce.dailyCapacity('ManagementInfo_Buier')
    # print managementInfoInduce.dailyConsume('ManagementInfo_Buier')
    # print managementInfoInduce.outputConsume('ManagementInfo_Buier')

    # # 货代公司模型----基本信息
    # companyBaseInfoInduce = CompanyBaseInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'sell')
    # print companyBaseInfoInduce.businessLife('BaseInfo_Goods')
    # print companyBaseInfoInduce.registeredCapital('BaseInfo_Goods')
    # print companyBaseInfoInduce.enterpriSharehld('BaseInfo_Goods')
    # print companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Goods')
    # print companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Goods')
    # print companyBaseInfoInduce.largestShareholders('BaseInfo_Goods')
    # print companyBaseInfoInduce.largestShareholdersIsLegalPerson('BaseInfo_Goods')
    # print companyBaseInfoInduce.isImportCompany('BaseInfo_Goods')

    # 货代公司模型----标的物
    #subjectMatterInfoInduce = SubjectMatterInfoInduce(u'阿里巴巴(中国)网络技术有限公司', u'铬铁', 'buy')
    #print subjectMatterInfoInduce.sourceToMoney('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.sourceConsumable('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.sourceStabilization('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.bigType('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.coefficientPrice('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.monthPriceDown('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.priceVariable('SubjectMatterInfo_Goods')
    #print subjectMatterInfoInduce.monthPriceVariable('SubjectMatterInfo_Goods')

