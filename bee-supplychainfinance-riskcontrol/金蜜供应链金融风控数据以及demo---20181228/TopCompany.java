package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 历年世界500强企业名单
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-28
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-top_company", type = "top_company" , shards = 4, replicas = 1)
public class TopCompany{

	@Id
    @Field(type = FieldType.Keyword)
    private Long id;

    /**
     * 年份
     */
	 @Field(type = FieldType.Text)
    private String years;
    /**
     * 排名
     */
	 @Field(type = FieldType.Integer)
    private Integer rank;
    /**
     * 企业名（中文）
     */
	 @Field(type = FieldType.Text)
    private String companyCname;
    /**
     * 企业名（英文）
     */
	 @Field(type = FieldType.Integer)
    private Integer companyEname;


    public String getYears() {
        return years;
    }

    public void setYears(String years) {
        this.years = years;
    }

    public Integer getRank() {
        return rank;
    }

    public void setRank(Integer rank) {
        this.rank = rank;
    }

    public String getCompanyCname() {
        return companyCname;
    }

    public void setCompanyCname(String companyCname) {
        this.companyCname = companyCname;
    }

    public Integer getCompanyEname() {
        return companyEname;
    }

    public void setCompanyEname(Integer companyEname) {
        this.companyEname = companyEname;
    }


    @Override
    public String toString() {
        return "TopCompany{" +
        ", years=" + years +
        ", rank=" + rank +
        ", companyCname=" + companyCname +
        ", companyEname=" + companyEname +
        "}";
    }
}
