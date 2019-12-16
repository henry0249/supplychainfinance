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
 * 订单-企业相关信息(金融仓储)
 * </p>
 *
 * @author zhigang.zhou123
 * @since 2018-12-29
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-order_company_info_storage", type = "order_company_info_storage", shards = 4, replicas = 1)
public class OrderCompanyInfoStorage {


    /**
     * 业务id
     */
	@Id
	@Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 金融仓储信息id
     */
	@Field(type = FieldType.Long)
    private Long financeStorageDetailId;
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
	@Field(type = FieldType.Integer)
    private Integer workingNormal;
    /**
     * 最近三年进行安全评价的次数
     */
	@Field(type = FieldType.Integer)
    private Integer safetyEvaluationTime;
    /**
     * 最近3个月开工率
     */
	@Field(type = FieldType.Double)
    private BigDecimal operatingRate;
    /**
     * 企业环评手续是否齐全
     */
	@Field(type = FieldType.Integer)
    private Integer eiaComplete;
    /**
     * 企业是否具有生产许可证
     */
	@Field(type = FieldType.Integer)
    private Integer productionCertificate;
    /**
     * 企业是否通过最近一次安全评价
     */
	@Field(type = FieldType.Integer)
    private Integer latestSafety;
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
