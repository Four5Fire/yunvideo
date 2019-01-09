package cn.playcall.yunvideo.dao;

import cn.playcall.yunvideo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Repository
public interface TaskDao extends JpaRepository<Task,Integer> {

    public List<Task> findAllByOpenId(String openId);

    public Task findByOpenIdAndFileId(String openId,String fileId);
}
