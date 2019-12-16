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
 * 股权出质表CompanyPledge
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-26
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-company_pledge", type = "company_pledge" , shards = 4, replicas = 1)
public class CompanyPledge{


    /**
     * 股权出质表id
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
     * 三方api接口返回公司id
     */
	@Field(type = FieldType.Text)
    private String companyId;
    /**
     * 质权登记编号
     */
	@Field(type = FieldType.Text)
    private String registNo;
    /**
     * 出质人
     */
	@Field(type = FieldType.Text)
    private String pledgor;
    /**
     * 出质人证照编号
     */
	@Field(type = FieldType.Text)
    private String pledgorNo;
    /**
     * 质权人
     */
	@Field(type = FieldType.Text)
    private String pledgee;
    /**
     * 质权人证照编号
     */
	@Field(type = FieldType.Text)
    private String pledgeeNo;
    /**
     * 出质股权数额单位：万（人民币，2位小数）
     */
	@Field(type = FieldType.Double)
    private BigDecimal pledgedAmount;
    /**
     * 股权出质设立登记日期
     */
	@Field(type = FieldType.Date)
    private Date regDate;
    /**
     * 公示时间
     */
	@Field(type = FieldType.Date)
    private Date publicDate;
    /**
     * 出质状态
     */
	@Field(type = FieldType.Text)
    private String status;
    /**
     * 创建时间
     */
	@Field(type = FieldType.Date)
    private Date createTime;


}
