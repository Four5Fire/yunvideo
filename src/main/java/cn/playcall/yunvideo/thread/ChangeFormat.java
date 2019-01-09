package cn.playcall.yunvideo.thread;

import cn.playcall.yunvideo.dao.TaskDao;
import cn.playcall.yunvideo.entity.Task;
import cn.playcall.yunvideo.tool.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.context.WebApplicationContextServletContextAwareProcessor;
import org.springframework.context.ApplicationContext;

import javax.annotation.Resource;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class ChangeFormat implements Runnable {

    private String sourcePath;
    private String goalPath;
    private Task task;

    private TaskDao taskDao;

    public ChangeFormat(String sourcePath, String goalPath,Task task, TaskDao taskDao) {
        this.sourcePath = sourcePath;
        this.goalPath = goalPath;
        this.task = task;
        this.taskDao = taskDao;
    }

    @Override
    public void run() {
        String command = "ffmpeg -i "+sourcePath+" -strict -2 "+goalPath;
		System.out.println(command);
        task = taskDao.findByOpenIdAndFileId(task.getOpenId(),task.getFileId());
        try {
            Process process = Runtime.getRuntime().exec(command);
            process.waitFor();
            task.setStatus("1");
            taskDao.save(task);
            task = taskDao.findByOpenIdAndFileId(task.getOpenId(),task.getFileId());
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
