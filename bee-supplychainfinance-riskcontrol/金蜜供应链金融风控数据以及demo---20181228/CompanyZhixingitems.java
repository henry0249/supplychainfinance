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
 * 执行表CompanyZhixingitems
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_zhixingitems", type = "company_zhixingitems" , shards = 4, replicas = 1)
public class CompanyZhixingitems{


    /**
     * 执行表id(此数据较为特殊因三方API接口返回了id所以主键取名为zx_id)
     */
	@Id
    @Field(type = FieldType.Keyword)
    private Long zxId;
    /**
     * 关联企业基础信息表id
     */
	@Field(type = FieldType.Long)
    private Long companyBaseId;
    /**
     * 执行返回id
     */
	@Field(type = FieldType.Text)
    private String id;
    /**
     * 官网系统ID
     */
	@Field(type = FieldType.Integer)
    private Integer sourceid;
    /**
     * 名称
     */
	@Field(type = FieldType.Text)
    private String name;
    /**
     * 立案时间
     */
	@Field(type = FieldType.Date)
    private Date liandate;
    /**
     * 立案号
     */
	@Field(type = FieldType.Text)
    private String anno;
    /**
     * 执行法院
     */
	@Field(type = FieldType.Text)
    private String executeGov;
    /**
     * 标地
     */
	@Field(type = FieldType.Text)
    private String biaodi;
    /**
     * 状态
     */
	@Field(type = FieldType.Text)
    private String status;
    /**
     * 身份证号码/组织机构代码
     */
	@Field(type = FieldType.Text)
    private String partyCardNum;
    /**
     * 数据更新时间
     */
	@Field(type = FieldType.Date)
    private Date updatedate;
    /**
     * 创建时间
     */
	@Field(type = FieldType.Date)
    private Date createTime;


}
