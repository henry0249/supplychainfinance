#!/usr/bin/env python
# -*- coding:utf-8 -*-

"""
Created on 2018/12/22
@Author: regan
"""
import os, sys, riskCode

dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.dirname(dir))

from util.confRead import confRead
from indexInduce import CompanyBaseInfoInduce, FinancialInfoInduce, CreditReportInduce, ManagementInfoInduce, \
    SubjectMatterInfoInduce


class EntrustedProcurement():
    """
    委托采购
    """

    def __init__(self, companyEntrustId, companySupplierId, companyGoodsId, companyGuaranteeId, tastId, applyId):
        """
        :param companyEntrust: 委托企业名称
        :param companySupplier: 供货商名称
        :param companyGoods: 货代公司名称
        :param companyGuarantee: 担保公司名称
        :param tast: 标的物名称
        """
        self._companyEntrustId = companyEntrustId
        self._companySupplierId = companySupplierId
        self._companyGoodsId = companyGoodsId
        self._companyGuaranteeId = companyGuaranteeId
        self._tastId = tastId
        self._applyId = applyId
        self._buyOrSell = 'buy'
        self.conf_weight = confRead('buy', 'weight')
        if companyEntrustId:
            self.entrustIndex = self._EntrustIndex()
        else:
            self.entrustIndex = (0, 0, 0, 0, 0, 0)
        if companySupplierId:
            self.supplierIndex = self._SupplierIndex()
        else:
            self.supplierIndex = (0, 0, 0)
        if tastId:
            goodsSubjectIndex = self._GoodsSubjectIndex()
        else:
            goodsSubjectIndex = 0
        if companyGoodsId:
            self.goodsIndex = (self._GoodsIndex(), goodsSubjectIndex)
        else:
            self.goodsIndex = (0, goodsSubjectIndex)
        self._adjust = riskCode.entrustBuy(companyEntrustId, companySupplierId, companyGoodsId, companyGuaranteeId,
                                           tastId, self._applyId, 1000000)
        self.adjustIndex = self._adjust[0]
        self.risks = self._adjust[1]

    def _EntrustIndex(self):
        """
        委托企业模型----委托企业指标
        :return:
        """
        companyBaseInfoInduce = CompanyBaseInfoInduce(self._companyEntrustId, self._tastId, self._buyOrSell,
                                                      self._applyId)

        # 委托企业模型----委托企业基本信息
        entrustBaseInfo_Index = (companyBaseInfoInduce.businessLife('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.registeredCapital('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.enterpriSharehld('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.shareRatioOfLegalPersonsEquity('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.largestShareholders('BaseInfo_Entrust')) * \
                                eval(self.conf_weight.get('ClassOneIndex', 'Entrust'))

        # 委托企业模型----担保公司基本信息
        if self._companyGuaranteeId:
            companyBaseInfoInduce1 = CompanyBaseInfoInduce(self._companyGuaranteeId, self._tastId, self._buyOrSell,
                                                           self._applyId)
            guaranteeBaseInfo_Index = (companyBaseInfoInduce1.businessLife('BaseInfo_Guarantee') + \
                                       companyBaseInfoInduce1.registeredCapital('BaseInfo_Guarantee') + \
                                       companyBaseInfoInduce1.enterpriSharehld('BaseInfo_Guarantee') + \
                                       companyBaseInfoInduce1.typesOfBusinessRgist('BaseInfo_Guarantee') + \
                                       companyBaseInfoInduce1.numOfLegalPersonSharehld('BaseInfo_Guarantee') + \
                                       companyBaseInfoInduce1.shareRatioOfLegalPersonsEquity('BaseInfo_Guarantee') + \
                                       companyBaseInfoInduce1.largestShareholders('BaseInfo_Guarantee') + \
                                       companyBaseInfoInduce1.isCoreCompany('BaseInfo_Guarantee') + \
                                       companyBaseInfoInduce1.isPublicCompany('BaseInfo_Guarantee') + \
                                       companyBaseInfoInduce1.isImportCompany('BaseInfo_Guarantee') + \
                                       companyBaseInfoInduce1.topCompanyRank('BaseInfo_Guarantee')) * \
                                      eval(self.conf_weight.get('ClassOneIndex', 'Entrust'))
        else:
            guaranteeBaseInfo_Index = 4.5

        # 委托企业模型----委托企业财务信息
        financialInfoInduce = FinancialInfoInduce(self._companyEntrustId, self._tastId, self._buyOrSell, self._applyId)
        entrustFinancialInfo_Index = (financialInfoInduce.assetLiabilityRatio('FinancialInfo_Entrust') + \
                                      financialInfoInduce.liquidityRatio('FinancialInfo_Entrust') + \
                                      financialInfoInduce.quickRatio('FinancialInfo_Entrust') + \
                                      financialInfoInduce.interestProtection('FinancialInfo_Entrust') + \
                                      financialInfoInduce.netOperatingCashToValueRatio('FinancialInfo_Entrust') + \
                                      financialInfoInduce.netProfitCashToGoodsRatio('FinancialInfo_Entrust') + \
                                      financialInfoInduce.cashGrowthRate('FinancialInfo_Entrust') + \
                                      financialInfoInduce.profitGrowthRate('FinancialInfo_Entrust') + \
                                      financialInfoInduce.creditVelocity('FinancialInfo_Entrust') + \
                                      financialInfoInduce.stockVelocity('FinancialInfo_Entrust') + \
                                      financialInfoInduce.grossProfitRate('FinancialInfo_Entrust')) * \
                                     eval(self.conf_weight.get('ClassOneIndex', 'Entrust'))

        # 委托企业模型----担保公司财务信息
        if self._companyGuaranteeId:
            financialInfoInduce1 = FinancialInfoInduce(self._companyGuaranteeId, self._tastId, self._buyOrSell,
                                                       self._applyId)
            guaranteeFinantialInfo_Index = (financialInfoInduce1.assetLiabilityRatio('FinancialInfo_Guarantee') + \
                                            financialInfoInduce1.liquidityRatio('FinancialInfo_Guarantee') + \
                                            financialInfoInduce1.quickRatio('FinancialInfo_Guarantee') + \
                                            financialInfoInduce1.interestProtection('FinancialInfo_Guarantee') + \
                                            financialInfoInduce1.netOperatingCashToValueRatio('FinancialInfo_Guarantee') + \
                                            financialInfoInduce1.netProfitCashToGoodsRatio('FinancialInfo_Guarantee') + \
                                            financialInfoInduce1.peRatio('FinancialInfo_Guarantee') + \
                                            financialInfoInduce1.pbRatio('FinancialInfo_Guarantee') + \
                                            financialInfoInduce1.cashGrowthRate('FinancialInfo_Guarantee') + \
                                            financialInfoInduce1.profitGrowthRate('FinancialInfo_Guarantee') + \
                                            financialInfoInduce1.creditVelocity('FinancialInfo_Guarantee') + \
                                            financialInfoInduce1.stockVelocity('FinancialInfo_Guarantee')) * \
                                           eval(self.conf_weight.get('ClassOneIndex', 'Entrust'))
        else:
            guaranteeFinantialInfo_Index = 1.5

        # 委托企业模型----企业征信
        creditReportInduce = CreditReportInduce(self._companyEntrustId, self._tastId, self._buyOrSell, self._applyId)
        entrustCreditInfo_index = (creditReportInduce.creditLife('CreditReport_Entrust') + \
                                   creditReportInduce.cooperativeInstitution('CreditReport_Entrust') + \
                                   creditReportInduce.unclearedInstitution('CreditReport_Entrust') + \
                                   creditReportInduce.unclearedCreditAmount('CreditReport_Entrust') + \
                                   creditReportInduce.ratioOfUnliquidatedLoans('CreditReport_Entrust')) * \
                                  eval(self.conf_weight.get('ClassOneIndex', 'Entrust'))

        # 委托企业模型----经营信息
        managementInfoInduce = ManagementInfoInduce(self._companyEntrustId, self._tastId, self._buyOrSell,
                                                    self._applyId)
        entrustManageInfo_index = (managementInfoInduce.deviceType('ManagementInfo_Entrust') + \
                                   managementInfoInduce.deviceQuantity('ManagementInfo_Entrust') + \
                                   managementInfoInduce.obsoleteDeviceRate('ManagementInfo_Entrust') + \
                                   managementInfoInduce.dailyCapacity('ManagementInfo_Entrust') + \
                                   managementInfoInduce.dailyConsume('ManagementInfo_Entrust') + \
                                   managementInfoInduce.outputConsume('ManagementInfo_Entrust') + \
                                   managementInfoInduce.sixMonFailRate('ManagementInfo_Entrust') + \
                                   managementInfoInduce.workingNormal('ManagementInfo_Entrust') + \
                                   managementInfoInduce.safetyEvaluationTime('ManagementInfo_Entrust') + \
                                   managementInfoInduce.operatingRate('ManagementInfo_Entrust') + \
                                   managementInfoInduce.corporeInventory('ManagementInfo_Entrust')) * \
                                  eval(self.conf_weight.get('ClassOneIndex', 'Entrust'))

        return (entrustBaseInfo_Index, guaranteeBaseInfo_Index, entrustFinancialInfo_Index,
                guaranteeFinantialInfo_Index, entrustCreditInfo_index, entrustManageInfo_index)

    def _SupplierIndex(self):
        # 供货商企业模型----基本信息
        companyBaseInfoInduce = CompanyBaseInfoInduce(self._companySupplierId, self._tastId, self._buyOrSell,
                                                      self._applyId)
        supplierBaseInfo_index = (companyBaseInfoInduce.businessLife('BaseInfo_Supplier') + \
                                  companyBaseInfoInduce.registeredCapital('BaseInfo_Supplier') + \
                                  companyBaseInfoInduce.enterpriSharehld('BaseInfo_Supplier') + \
                                  companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Supplier') + \
                                  companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Supplier') + \
                                  companyBaseInfoInduce.shareRatioOfLegalPersonsEquity('BaseInfo_Supplier') + \
                                  companyBaseInfoInduce.largestShareholders('BaseInfo_Supplier') + \
                                  companyBaseInfoInduce.isCoreCompany('BaseInfo_Supplier') + \
                                  companyBaseInfoInduce.isPublicCompany('BaseInfo_Supplier') + \
                                  companyBaseInfoInduce.isImportCompany('BaseInfo_Supplier') + \
                                  companyBaseInfoInduce.topCompanyRank('BaseInfo_Supplier') + \
                                  companyBaseInfoInduce.indexVariable('BaseInfo_Supplier')) * \
                                 eval(self.conf_weight.get('ClassOneIndex', 'Supplier'))

        # 供货商企业模型----财务信息
        financialInfoInduce = FinancialInfoInduce(self._companySupplierId, self._tastId, self._buyOrSell, self._applyId)
        supplierFinancialInfo_index = (financialInfoInduce.assetLiabilityRatio('FinancialInfo_Supplier') + \
                                       financialInfoInduce.liquidityRatio('FinancialInfo_Supplier') + \
                                       financialInfoInduce.quickRatio('FinancialInfo_Supplier') + \
                                       financialInfoInduce.interestProtection('FinancialInfo_Supplier') + \
                                       financialInfoInduce.netOperatingCashToValueRatio('FinancialInfo_Supplier') + \
                                       financialInfoInduce.netProfitCashToGoodsRatio('FinancialInfo_Supplier') + \
                                       financialInfoInduce.peRatio('FinancialInfo_Supplier') + \
                                       financialInfoInduce.pbRatio('FinancialInfo_Supplier') + \
                                       financialInfoInduce.cashGrowthRate('FinancialInfo_Supplier') + \
                                       financialInfoInduce.profitGrowthRate('FinancialInfo_Supplier') + \
                                       financialInfoInduce.creditVelocity('FinancialInfo_Supplier') + \
                                       financialInfoInduce.stockVelocity('FinancialInfo_Supplier')) * \
                                      eval(self.conf_weight.get('ClassOneIndex', 'Supplier'))

        # 供货商企业模型----经营信息
        managementInfoInduce = ManagementInfoInduce(self._companySupplierId, self._tastId, self._buyOrSell,
                                                    self._applyId)
        supplierManageInfo_index = (managementInfoInduce.supplierTimeDelta('ManagementInfo_Supplier') + \
                                    managementInfoInduce.inventoryRequirement('ManagementInfo_Supplier')) * \
                                   eval(self.conf_weight.get('ClassOneIndex', 'Supplier'))

        return (supplierBaseInfo_index, supplierFinancialInfo_index, supplierManageInfo_index)

    def _GoodsIndex(self):
        # 货代公司模型----基本信息
        companyBaseInfoInduce = CompanyBaseInfoInduce(self._companyGoodsId, self._tastId, self._buyOrSell,
                                                      self._applyId)
        goodsBaseInfo_index = (companyBaseInfoInduce.businessLife('BaseInfo_Goods') + \
                               companyBaseInfoInduce.registeredCapital('BaseInfo_Goods') + \
                               companyBaseInfoInduce.enterpriSharehld('BaseInfo_Goods') + \
                               companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Goods') + \
                               companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Goods') + \
                               companyBaseInfoInduce.largestShareholders('BaseInfo_Goods') + \
                               companyBaseInfoInduce.largestShareholdersIsLegalPerson('BaseInfo_Goods') + \
                               companyBaseInfoInduce.isImportCompany('BaseInfo_Goods')) * \
                              eval(self.conf_weight.get('ClassOneIndex', 'Goods'))
        return goodsBaseInfo_index

    def _GoodsSubjectIndex(self):
        # 货代公司模型----标的物
        subjectMatterInfoInduce = SubjectMatterInfoInduce(self._companyGoodsId, self._tastId, self._buyOrSell,
                                                          self._applyId)
        goodsSubjectInfo_index = (subjectMatterInfoInduce.sourceToMoney('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.sourceConsumable('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.sourceStabilization('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.bigType('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.coefficientPrice('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.monthPriceDown('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.priceVariable('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.monthPriceVariable('SubjectMatterInfo_Goods')) * \
                                 eval(self.conf_weight.get('ClassOneIndex', 'Goods'))

        return goodsSubjectInfo_index


class ConsignmentSales():
    def __init__(self, companyEntrustId, companyBuierId, companyGoodsId, tastId, applyId):
        """
        :param companyEntrust: 委托企业名称
        :param companyBuier: 购货商名称
        :param companyGoods: 货代公司名称
        :param tast: 标的物名称
        """
        self._companyEntrustId = companyEntrustId
        self._companyBuierId = companyBuierId
        self._companyGoodsId = companyGoodsId
        self._tastId = tastId
        self._buyOrSell = 'sell'
        self.conf_weight = confRead('sell', 'weight')
        self._applyId = applyId
        if companyEntrustId:
            self.entrustIndex = self._EntrustIndex()
        else:
            self.entrustIndex = (0, 0, 0, 0)
        if companyBuierId:
            self.buierIndex = self._BuierIndex()
        else:
            self.buierIndex = (0, 0, 0)
        if tastId:
            goodsSubjectIndex = self._GoodsSubjectIndex()
        else:
            goodsSubjectIndex = 0
        if companyGoodsId:
            self.goodsIndex = (self._GoodsIndex(), goodsSubjectIndex)
        else:
            self.goodsIndex = (4.5, goodsSubjectIndex)

        self._adjust = riskCode.entrustSale(companyEntrustId, companyBuierId, companyGoodsId, tastId, self._applyId)
        self.adjustIndex = self._adjust[0]
        self.risks = self._adjust[1]

    def _EntrustIndex(self):
        """
        委托企业模型
        :return:
        """
        companyBaseInfoInduce = CompanyBaseInfoInduce(self._companyEntrustId, self._tastId, self._buyOrSell,
                                                      self._applyId)
        entrustBaseInfo_index = (companyBaseInfoInduce.businessLife('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.registeredCapital('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.enterpriSharehld('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.shareRatioOfLegalPersonsEquity('BaseInfo_Entrust') + \
                                 companyBaseInfoInduce.largestShareholders('BaseInfo_Entrust')) * \
                                eval(self.conf_weight.get('ClassOneIndex', 'Entrust'))

        financialInfoInduce = FinancialInfoInduce(self._companyEntrustId, self._tastId, self._buyOrSell, self._applyId)
        entrustFinancialInfo_index = (financialInfoInduce.assetLiabilityRatio('FinancialInfo_Entrust') + \
                                      financialInfoInduce.liquidityRatio('FinancialInfo_Entrust') + \
                                      financialInfoInduce.quickRatio('FinancialInfo_Entrust') + \
                                      financialInfoInduce.interestProtection('FinancialInfo_Entrust') + \
                                      financialInfoInduce.netOperatingCashToValueRatio('FinancialInfo_Entrust') + \
                                      financialInfoInduce.netProfitCashToGoodsRatio('FinancialInfo_Entrust') + \
                                      financialInfoInduce.cashGrowthRate('FinancialInfo_Entrust') + \
                                      financialInfoInduce.profitGrowthRate('FinancialInfo_Entrust') + \
                                      financialInfoInduce.creditVelocity('FinancialInfo_Entrust') + \
                                      financialInfoInduce.stockVelocity('FinancialInfo_Entrust')) * \
                                     eval(self.conf_weight.get('ClassOneIndex', 'Entrust'))

        # 委托企业模型----企业征信
        creditReportInduce = CreditReportInduce(self._companyEntrustId, self._tastId, self._buyOrSell, self._applyId)
        entrustCreditInfo_index = (creditReportInduce.creditLife('CreditReport_Entrust') + \
                                   creditReportInduce.cooperativeInstitution('CreditReport_Entrust') + \
                                   creditReportInduce.unclearedInstitution('CreditReport_Entrust') + \
                                   creditReportInduce.unclearedCreditAmount('CreditReport_Entrust') + \
                                   creditReportInduce.ratioOfUnliquidatedLoans('CreditReport_Entrust')) * \
                                  eval(self.conf_weight.get('ClassOneIndex', 'Entrust'))

        # 委托企业模型----经营信息
        managementInfoInduce = ManagementInfoInduce(self._companyEntrustId, self._tastId, self._buyOrSell,
                                                    self._applyId)
        entrustManageInfo_index = (managementInfoInduce.supplierTimeDelta('ManagementInfo_Entrust') + \
                                   managementInfoInduce.inventoryRequirement('ManagementInfo_Entrust') + \
                                   managementInfoInduce.indexVariable('ManagementInfo_Entrust')) * \
                                  eval(self.conf_weight.get('ClassOneIndex', 'Entrust'))

        return (entrustBaseInfo_index, entrustFinancialInfo_index, entrustCreditInfo_index, entrustManageInfo_index)

    def _BuierIndex(self):
        """
        购货商模型
        :return:
        """
        # 购货商模型----基本信息
        companyBaseInfoInduce = CompanyBaseInfoInduce(self._companyBuierId, self._tastId, self._buyOrSell,
                                                      self._applyId)
        buierBaseInfo_index = (companyBaseInfoInduce.businessLife('BaseInfo_Buier') + \
                               companyBaseInfoInduce.registeredCapital('BaseInfo_Buier') + \
                               companyBaseInfoInduce.enterpriSharehld('BaseInfo_Buier') + \
                               companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Buier') + \
                               companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Buier') + \
                               companyBaseInfoInduce.shareRatioOfLegalPersonsEquity('BaseInfo_Buier') + \
                               companyBaseInfoInduce.largestShareholders('BaseInfo_Buier') + \
                               companyBaseInfoInduce.isCoreCompany('BaseInfo_Buier') + \
                               companyBaseInfoInduce.isPublicCompany('BaseInfo_Buier') + \
                               companyBaseInfoInduce.isImportCompany('BaseInfo_Buier') + \
                               companyBaseInfoInduce.topCompanyRank('BaseInfo_Buier')) * \
                              eval(self.conf_weight.get('ClassOneIndex', 'Buier'))

        # 购货商模型----财务信息
        financialInfoInduce = FinancialInfoInduce(self._companyBuierId, self._tastId, self._buyOrSell, self._applyId)
        buierFinancialInfo_index = (financialInfoInduce.assetLiabilityRatio('FinancialInfo_Buier') + \
                                    financialInfoInduce.liquidityRatio('FinancialInfo_Buier') + \
                                    financialInfoInduce.quickRatio('FinancialInfo_Buier') + \
                                    financialInfoInduce.interestProtection('FinancialInfo_Buier') + \
                                    financialInfoInduce.netOperatingCashToValueRatio('FinancialInfo_Buier') + \
                                    financialInfoInduce.netProfitCashToGoodsRatio('FinancialInfo_Buier') + \
                                    financialInfoInduce.peRatio('FinancialInfo_Buier') + \
                                    financialInfoInduce.pbRatio('FinancialInfo_Buier') + \
                                    financialInfoInduce.cashGrowthRate('FinancialInfo_Buier') + \
                                    financialInfoInduce.profitGrowthRate('FinancialInfo_Buier') + \
                                    financialInfoInduce.creditVelocity('FinancialInfo_Buier') + \
                                    financialInfoInduce.stockVelocity('FinancialInfo_Buier') + \
                                    financialInfoInduce.grossProfitRate('FinancialInfo_Buier')) * \
                                   eval(self.conf_weight.get('ClassOneIndex', 'Buier'))

        # 购货商模型----经营信息
        managementInfoInduce = ManagementInfoInduce(self._companyBuierId, self._tastId, self._buyOrSell, self._applyId)
        buierManageInfo_index = (managementInfoInduce.deviceType('ManagementInfo_Buier') + \
                                 managementInfoInduce.deviceQuantity('ManagementInfo_Buier') + \
                                 managementInfoInduce.dailyCapacity('ManagementInfo_Buier') + \
                                 managementInfoInduce.dailyConsume('ManagementInfo_Buier') + \
                                 managementInfoInduce.outputConsume('ManagementInfo_Buier')) * \
                                eval(self.conf_weight.get('ClassOneIndex', 'Buier'))

        return (buierBaseInfo_index, buierFinancialInfo_index, buierManageInfo_index)

    def _GoodsIndex(self):
        """
        货代公司模型
        :return:
        """
        # 货代公司模型----基本信息
        companyBaseInfoInduce = CompanyBaseInfoInduce(self._companyGoodsId, self._tastId, self._buyOrSell,
                                                      self._applyId)
        goodsBaseInfo_index = (companyBaseInfoInduce.businessLife('BaseInfo_Goods') + \
                               companyBaseInfoInduce.registeredCapital('BaseInfo_Goods') + \
                               companyBaseInfoInduce.enterpriSharehld('BaseInfo_Goods') + \
                               companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Goods') + \
                               companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Goods') + \
                               companyBaseInfoInduce.largestShareholders('BaseInfo_Goods') + \
                               companyBaseInfoInduce.largestShareholdersIsLegalPerson('BaseInfo_Goods') + \
                               companyBaseInfoInduce.isImportCompany('BaseInfo_Goods')) * \
                              eval(self.conf_weight.get('ClassOneIndex', 'Goods'))
        return goodsBaseInfo_index

    def _GoodsSubjectIndex(self):
        # 货代公司模型----标的物
        subjectMatterInfoInduce = SubjectMatterInfoInduce(self._companyGoodsId, self._tastId, self._buyOrSell,
                                                          self._applyId)
        goodsSubjectInfo_index = (subjectMatterInfoInduce.sourceToMoney('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.sourceConsumable('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.sourceStabilization('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.bigType('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.coefficientPrice('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.monthPriceDown('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.priceVariable('SubjectMatterInfo_Goods') + \
                                  subjectMatterInfoInduce.monthPriceVariable('SubjectMatterInfo_Goods')) * \
                                 eval(self.conf_weight.get('ClassOneIndex', 'Goods'))

        return goodsSubjectInfo_index


class CompanyGoods_Model():
    def __init__(self, companyGoodsId, tastId, applyId):
        """
        :param companyGoods: 货代公司名称
        :param tast: 标的物名称
        """
        self._companyGoodsId = companyGoodsId
        self._tastId = tastId
        self._buyOrSell = 'sell'
        self.conf_weight = confRead('sell', 'weight')
        self._applyId = applyId
        self.goodsIndex = self._GoodsIndex()

    def _GoodsIndex(self):
        """
        货代公司模型
        :return:
        """
        # 货代公司模型----基本信息
        companyBaseInfoInduce = CompanyBaseInfoInduce(self._companyGoodsId, self._tastId, self._buyOrSell,
                                                      self._applyId)

        goodsBaseInfo_index = companyBaseInfoInduce.businessLife('BaseInfo_Goods') + \
                              companyBaseInfoInduce.registeredCapital('BaseInfo_Goods') + \
                              companyBaseInfoInduce.enterpriSharehld('BaseInfo_Goods') + \
                              companyBaseInfoInduce.typesOfBusinessRgist('BaseInfo_Goods') + \
                              companyBaseInfoInduce.numOfLegalPersonSharehld('BaseInfo_Goods') + \
                              companyBaseInfoInduce.largestShareholders('BaseInfo_Goods') + \
                              companyBaseInfoInduce.largestShareholdersIsLegalPerson('BaseInfo_Goods') + \
                              companyBaseInfoInduce.isImportCompany('BaseInfo_Goods')

        # 货代公司模型----标的物
        subjectMatterInfoInduce = SubjectMatterInfoInduce(self._companyGoodsId, self._tastId, self._buyOrSell,
                                                          self._applyId)
        goodsSubjectInfo_index = subjectMatterInfoInduce.sourceToMoney('SubjectMatterInfo_Goods') + \
                                 subjectMatterInfoInduce.sourceConsumable('SubjectMatterInfo_Goods') + \
                                 subjectMatterInfoInduce.sourceStabilization('SubjectMatterInfo_Goods') + \
                                 subjectMatterInfoInduce.bigType('SubjectMatterInfo_Goods') + \
                                 subjectMatterInfoInduce.coefficientPrice('SubjectMatterInfo_Goods') + \
                                 subjectMatterInfoInduce.monthPriceDown('SubjectMatterInfo_Goods') + \
                                 subjectMatterInfoInduce.priceVariable('SubjectMatterInfo_Goods') + \
                                 subjectMatterInfoInduce.monthPriceVariable('SubjectMatterInfo_Goods')

        return (goodsBaseInfo_index, goodsSubjectInfo_index)


if __name__ == '__main__':
    # # 委托采购
    e = EntrustedProcurement(u'阿里巴巴(中国)网络技术有限公司', u'阿里巴巴(中国)网络技术有限公司',
                             u'阿里巴巴(中国)网络技术有限公司', u'阿里巴巴(中国)网络技术有限公司', u'烙铁', '1902210059801022')
    print e.entrustIndex, e.supplierIndex, e.goodsIndex, e.adjustIndex, e.risks
    #
    # # 委托销售
    c = ConsignmentSales(u'阿里巴巴(中国)网络技术有限公司', u'阿里巴巴(中国)网络技术有限公司',
                         u'阿里巴巴(中国)网络技术有限公司', u'烙铁', '1902210059801022')
    print c.entrustIndex, c.buierIndex, c.adjustIndex, c.risks

    # 货代公司
    d = CompanyGoods_Model('', '', '')
    print d.goodsIndex

