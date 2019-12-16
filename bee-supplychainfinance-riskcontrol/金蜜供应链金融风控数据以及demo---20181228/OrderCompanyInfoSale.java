package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

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
 * 订单-企业相关信息(委托销售)
 * </p>
 *
 * @author zhigang.zhou123
 * @since 2018-12-29
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-order_company_info_sale", type = "order_company_info_sale", shards = 4, replicas = 1)
public class OrderCompanyInfoSale {

	/**
	 * 业务id
	 */
	@Id
	@Field(type = FieldType.Keyword)
	private Long id;
	/**
	 * 委托销售信息id
	 */
	@Field(type = FieldType.Long)
	private Long entrustSaleDetailId;
	/**
	 * 设备类型
	 */
	@Field(type = FieldType.Integer)
	private Integer deviceType;
	/**
	 * 设备数量
	 */
	@Field(type = FieldType.Integer)
	private Integer deviceQuantity;
	/**
	 * 每日产能
	 */
	@Field(type = FieldType.Text)
	private String dailyCapacity;
	/**
	 * 每日标的物消耗
	 */
	@Field(type = FieldType.Text)
	private String dailyConsume;
	/**
	 * 单位产出耗电量
	 */
	@Field(type = FieldType.Text)
	private String outputConsume;
	/**
	 * 标的物库存量
	 */
	@Field(type = FieldType.Text)
	private String corporeInventory;
	/**
	 * 标的物需求量
	 */
	@Field(type = FieldType.Text)
	private String corporeRequirement;
	/**
	 * 供货方每日产能
	 */
	@Field(type = FieldType.Text)
	private String supplierDailyCapacity;
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
	 * 产能竞争力指数
	 */
	@Field(type = FieldType.Text)
	private String capacityIndex;
	/**
	 * 创建人id
	 */
	@Field(type = FieldType.Long)
	private Long createId;
	/**
	 * 创建人名称
	 */
	@Field(type = FieldType.Text)
	private String creator;
	/**
	 * 创建/申请时间
	 */
	@Field(type = FieldType.Date)
	private Date createTime;
	/**
	 * 修改人id
	 */
	@Field(type = FieldType.Long)
	private Long modifyId;
	/**
	 * 修改人名称
	 */
	@Field(type = FieldType.Text)
	private String modifier;
	/**
	 * 修改时间
	 */
	@Field(type = FieldType.Date)
	private Date modifyTime;
	/**
	 * 数据状态0删除1正常
	 */
	@Field(type = FieldType.Integer)
	private Integer status;

}
