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
 * 失信表CompanyShixinitems
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_shixinitems", type = "company_shixinitems" , shards = 4, replicas = 1)
public class CompanyShixinitems{
    /**
     * 失信表id
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
     * 公司名
     */
    @Field(type = FieldType.Text)
    private String name;
    /**
     * 立案日期
     */
    @Field(type = FieldType.Date)
    private Date liandate;
    /**
     * 立案文书号
     */
    @Field(type = FieldType.Text)
    private String anno;
    /**
     * 组织机构代码
     */
    @Field(type = FieldType.Text)
    private String orgno;
    /**
     * 执行依据文号
     */
    @Field(type = FieldType.Text)
    private String executeno;
    /**
     * 发布时间
     */
    @Field(type = FieldType.Date)
    private Date publicdate;
    /**
     * 被执行人的履行情况
     */
    @Field(type = FieldType.Text)
    private String executestatus;
    /**
     * 行为备注
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String actionremark;
    /**
     * 执行法院
     */
    @Field(type = FieldType.Text)
    private String executegov;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;
}
