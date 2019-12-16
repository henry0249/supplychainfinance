package com.bee.supply.chain.finance.common.entity.es.thirdInterfaceForES;

import java.util.Date;

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
 * 环保失信黑名单
 * </p>
 *
 * @author chenxm66777123
 * @since 2018-12-28
 */
@TableName("lose_credit_list")
@NoArgsConstructor
@Data
@Accessors(chain = true)
@Document(indexName = "index-risk-lose_credit_list", type = "lose_credit_list" , shards = 4, replicas = 1)
public class LoseCreditList  {

    /**
     * 统一社会信用代码
     */
	@Id
    @Field(type = FieldType.Keyword)
    private String creditId;
    /**
     * 法定代表人
     */
    @Field(type = FieldType.Text)
    private String legalRepresentative;
    /**
     * 违法行为
     */
    @Field(type = FieldType.Text)
    private String unlawfulActive;
    /**
     * 行政处罚决定书文号
     */
    @Field(type = FieldType.Text)
    private String punishmentBook;
    /**
     * 下达执法文书时间
     */
    @Field(type = FieldType.Date)
    private Date issuedTime;


    public String getCreditId() {
        return creditId;
    }

    public void setCreditId(String creditId) {
        this.creditId = creditId;
    }

    public String getLegalRepresentative() {
        return legalRepresentative;
    }

    public void setLegalRepresentative(String legalRepresentative) {
        this.legalRepresentative = legalRepresentative;
    }

    public String getUnlawfulActive() {
        return unlawfulActive;
    }

    public void setUnlawfulActive(String unlawfulActive) {
        this.unlawfulActive = unlawfulActive;
    }

    public String getPunishmentBook() {
        return punishmentBook;
    }

    public void setPunishmentBook(String punishmentBook) {
        this.punishmentBook = punishmentBook;
    }

    public Date getIssuedTime() {
        return issuedTime;
    }

    public void setIssuedTime(Date issuedTime) {
        this.issuedTime = issuedTime;
    }


    @Override
    public String toString() {
        return "LoseCreditList{" +
        ", creditId=" + creditId +
        ", legalRepresentative=" + legalRepresentative +
        ", unlawfulActive=" + unlawfulActive +
        ", punishmentBook=" + punishmentBook +
        ", issuedTime=" + issuedTime +
        "}";
    }
}
