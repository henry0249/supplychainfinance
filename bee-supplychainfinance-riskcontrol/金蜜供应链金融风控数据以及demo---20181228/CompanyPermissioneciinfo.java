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
 * 行政许可【工商局】表CompanyPermissioneciinfo
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_permissioneciinfo", type = "company_permissioneciinfo" , shards = 4, replicas = 1)
public class CompanyPermissioneciinfo{

    /**
     * 行政许可【工商局】表id
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
     * 许可文件编号
     */
    @Field(type = FieldType.Text)
    private String licensDocNo;
    /**
     * 许可文件名称
     */
    @Field(type = FieldType.Text)
    private String licensDocName;
    /**
     * 有效期自
     */
    @Field(type = FieldType.Date)
    private Date validityFrom;
    /**
     * 有效期至
     */
    @Field(type = FieldType.Date)
    private Date validityTo;
    /**
     * 许可机关
     */
    @Field(type = FieldType.Text)
    private String licensOffice;
    /**
     * 许可内容
     */
    @Field(type = FieldType.Text, searchAnalyzer = "ik", analyzer = "ik")
    private String licensContent;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Text)
    private Date createTime;

}
