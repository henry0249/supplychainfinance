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
 * 上市公司名单
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-28
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-public_company", type = "public_company" , shards = 4, replicas = 1)
public class PublicCompany {
	
	@Id
    @Field(type = FieldType.Keyword)
    private Long id;

    /**
     * 企业名
     */
    @Field(type = FieldType.Text)
    private String companyName;
    /**
     * 企业类型
     */
    @Field(type = FieldType.Date)
    private Date publicTime;


    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Date getPublicTime() {
        return publicTime;
    }

    public void setPublicTime(Date publicTime) {
        this.publicTime = publicTime;
    }


    @Override
    public String toString() {
        return "PublicCompany{" +
        ", companyName=" + companyName +
        ", publicTime=" + publicTime +
        "}";
    }
}
