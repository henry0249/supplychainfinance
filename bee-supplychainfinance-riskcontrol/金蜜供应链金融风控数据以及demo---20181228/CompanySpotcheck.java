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
 * 抽查检查CompanySpotcheck
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_spotcheck", type = "company_spotcheck" , shards = 4, replicas = 1)
public class CompanySpotcheck {


    /**
     * 抽查检查表id
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
     * 登记编号
     */
    @Field(type = FieldType.Text)
    private String no;
    /**
     * 检查实施机关 
     */
    @Field(type = FieldType.Text)
    private String executiveOrg;
    /**
     * 类型
     */
    @Field(type = FieldType.Text)
    private String type;
    /**
     * 日期
     */
    @Field(type = FieldType.Date)
    private Date date;
    /**
     * 结果
     */
    @Field(type = FieldType.Text)
    private String consequence;
    /**
     * 备注
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String remark;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
