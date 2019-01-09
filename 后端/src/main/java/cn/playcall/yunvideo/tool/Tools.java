package cn.playcall.yunvideo.tool;

import cn.playcall.yunvideo.dao.TaskDao;
import org.springframework.beans.factory.annotation.Autowired;

public class Tools {
    @Autowired
    private static TaskDao taskDao;

    public static TaskDao getTaskDao(){
        return taskDao;
    }
}
