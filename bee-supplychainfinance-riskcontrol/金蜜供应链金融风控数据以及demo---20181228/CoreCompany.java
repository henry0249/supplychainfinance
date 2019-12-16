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
 * 供应链平台核心企业白名单
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-28
 */
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-core_company", type = "core_company" , shards = 4, replicas = 1)
public class CoreCompany {

	@Id
    @Field(type = FieldType.Keyword)
    private Long id;
	
    /**
     * 企业名
     */
    @Field(type = FieldType.Text)
    private String companyName;
    /**
     * 角色类型
     */
    @Field(type = FieldType.Text)
    private String roleType;


    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getRoleType() {
        return roleType;
    }

    public void setRoleType(String roleType) {
        this.roleType = roleType;
    }

    @Override
    public String toString() {
        return "CoreCompany{" +
        ", companyName=" + companyName +
        ", roleType=" + roleType +
        "}";
    }
}
