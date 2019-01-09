package cn.playcall.yunvideo.entity;

import javax.persistence.*;

@Table(name = "t_user")
@Entity
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "openId")
    private String openId;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    @Override
    public String toString() {
        return "UserInfo{" +
                "id=" + id +
                ", openId='" + openId + '\'' +
                '}';
    }
}
