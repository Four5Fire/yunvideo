package cn.playcall.yunvideo.dao;

import cn.playcall.yunvideo.entity.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDao extends JpaRepository<UserInfo,Integer> {

    public UserInfo findByOpenId(String openId);

}
