package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.math.BigDecimal;
import java.util.Date;

/**
 * <p>
 * 动产抵押表CompanyMpledge
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_mpledge", type = "company_mpledge" , shards = 4, replicas = 1)
public class CompanyMpledge {

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
    private String registerNo;
    /**
     * 登记时间
     */
    @Field(type = FieldType.Date)
    private Date registerDate;
    /**
     * 公示时间
     */
    @Field(type = FieldType.Date)
    private Date publicDate;
    /**
     * 登记机关
     */
    @Field(type = FieldType.Text)
    private String registerOffice;
    /**
     * 被担保债权数额单位：万（人民币，2位小数）
     */
    @Field(type = FieldType.Double)
    private BigDecimal debtSecuredAmount;
    /**
     * 状态
     */
    @Field(type = FieldType.Text)
    private String status;
    /**
     * 创建时间
     */
    @Field(type = FieldType.Date)
    private Date createTime;

}
