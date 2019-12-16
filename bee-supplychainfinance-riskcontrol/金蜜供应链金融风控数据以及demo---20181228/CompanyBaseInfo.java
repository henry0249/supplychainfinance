package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import java.io.Serializable;
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
 * 企业基础信息表
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
/**
 * index这个属性，no代表不建索引
 * not_analyzed，建索引不分词
 * analyzed 即分词，又建立索引
 * expected [no], [not_analyzed] or [analyzed]
 * @throws IOException
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_base_info", type = "company_base_info" , shards = 4, replicas = 1)
public class CompanyBaseInfo implements Serializable {

	private static final long serialVersionUID = -1455520143150646493L;
	/**
     * 企业基础信息表id
     */
	@Id
    @Field(type = FieldType.Keyword)
    private Long id;
    /**
     * 根据此字段获取详细信息
     */
	@Field(type = FieldType.Text)
    private String keyNo;
    /**
     * 公司名称
     */
    @Field(type = FieldType.Text)
    private String name;
    /**
     * 注册号
     */
	@Field(type = FieldType.Text)
    private String no;
    /**
     * 登记机关
     */
	@Field(type = FieldType.Text)
    private String belongOrg;
    /**
     * 法人
     */
	@Field(type = FieldType.Text)
    private String operName;
    /**
     * 成功日期
     */
	@Field(type = FieldType.Date)
    private Date startDate;
    /**
     * 吊销日期
     */
	@Field(type = FieldType.Date)
    private Date endDate;
    /**
     * 状态
     */
	@Field(type = FieldType.Text)
    private String status;
    /**
     * 省份
     */
	@Field(type = FieldType.Text)
    private String province;
    /**
     * 更新日期
     */
	@Field(type = FieldType.Date)
    private Date updatedDate;
    /**
     * 信用代码
     */
	@Field(type = FieldType.Text)
    private String creditCode;
    /**
     * 注册资本
     */
	@Field(type = FieldType.Double)
    private BigDecimal registCapi;
    /**
     * 类型
     */
	@Field(type = FieldType.Text)
    private String econKind;
    /**
     * 地址
     */
	@Field(type = FieldType.Text)
    private String address;
    /**
     * 营业范围
     */
	@Field(type = FieldType.Text)
    private String scope;
    /**
     * 营业期限始
     */
	@Field(type = FieldType.Date)
    private Date termStart;
    /**
     * 营业期限至
     */
	@Field(type = FieldType.Date)
    private Date teamEnd;
    /**
     * 发照日期
     */
	@Field(type = FieldType.Date)
    private Date checkDate;
    /**
     * 组织机构代码
     */
	@Field(type = FieldType.Text)
    private String orgNo;
    /**
     * 是否上市
     */
	@Field(type = FieldType.Text)
    private String isOnStock;
    /**
     * 证券号
     */
	@Field(type = FieldType.Text)
    private String stockNumber;
    /**
     * 证券类型
     */
	@Field(type = FieldType.Text)
    private String stockType;
    /**
     * Logo地址
     */
	@Field(type = FieldType.Text)
    private String imageUrl;
    /**
     * 创建时间
     */
	@Field(type = FieldType.Date)
    private Date createTime;

}
