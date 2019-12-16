package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import java.math.BigDecimal;
import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 企业经营信息
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-29
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_management_info", type = "company_management_info" , shards = 4, replicas = 1)
public class ManagementInfo {

    /**
     * 企业经营信息id
     */
	@Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 关联企业基础信息表id
     */
	  @Field(type = FieldType.Long)
    private Long companyBaseId;
    /**
     * 设备类型
     */
	  @Field(type = FieldType.Text)
    private String deviceType;
    /**
     * 设备数量
     */
	  @Field(type = FieldType.Double)
    private BigDecimal deviceQuantity;
    /**
     * 每日产能
     */
	  @Field(type = FieldType.Double)
    private BigDecimal dailyCapacity;
    /**
     * 每日标的物消耗
     */
	  @Field(type = FieldType.Double)
    private BigDecimal dailyConsume;
    /**
     * 单位产出耗电量
     */
	  @Field(type = FieldType.Double)
    private BigDecimal outputConsume;
    /**
     * 设备老化率
     */
	  @Field(type = FieldType.Double)
    private BigDecimal obsoleteDeviceRate;
    /**
     * 近六个月环保设备故障率
     */
	  @Field(type = FieldType.Double)
    private BigDecimal sixMonFailRate;
    /**
     * 当前环保设备是否正常运行
     */
	  @Field(type = FieldType.Text)
    private String workingNormal;
    /**
     * 最近三年进行安全评价的次数
     */
	  @Field(type = FieldType.Double)
    private BigDecimal safetyEvaluationTime;
    /**
     * 最近3个月开工率
     */
	  @Field(type = FieldType.Double)
    private BigDecimal operatingRate;
    /**
     * 标的物库存量
     */
	  @Field(type = FieldType.Double)
    private BigDecimal corporeInventory;
    /**
     * 标的物需求量
     */
	  @Field(type = FieldType.Double)
    private BigDecimal corporeRequirement;
    /**
     * 供货方每日产能
     */
	  @Field(type = FieldType.Double)
    private BigDecimal supplierDailyCapacity;
    /**
     * 预计供货时间
     */
	  @Field(type = FieldType.Date)
    private Date expectDeliveryTime;
    /**
     * 合同约定供货时间
     */
	  @Field(type = FieldType.Date)
    private Date agreeDeliveryTime;
    /**
     * 创建时间
     */
	  @Field(type = FieldType.Date)
    private Date createTime;


}
