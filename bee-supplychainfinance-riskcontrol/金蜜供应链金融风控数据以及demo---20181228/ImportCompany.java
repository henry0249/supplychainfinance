package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import com.baomidou.mybatisplus.annotations.TableName;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * 国企、央企名单
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-28
 */
@TableName("import_company")
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-import_company", type = "import_company" , shards = 4, replicas = 1)
public class ImportCompany  {
	
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
	@Field(type = FieldType.Text)
    private String companyType;


    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getCompanyType() {
        return companyType;
    }

    public void setCompanyType(String companyType) {
        this.companyType = companyType;
    }


    @Override
    public String toString() {
        return "ImportCompany{" +
        ", companyName=" + companyName +
        ", companyType=" + companyType +
        "}";
    }
}
