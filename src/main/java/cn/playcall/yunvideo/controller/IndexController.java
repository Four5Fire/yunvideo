package cn.playcall.yunvideo.controller;

import cn.playcall.yunvideo.dao.TaskDao;
import cn.playcall.yunvideo.dao.UserDao;
import cn.playcall.yunvideo.entity.Task;
import cn.playcall.yunvideo.entity.UserInfo;
import cn.playcall.yunvideo.server.RequestLogin;
import cn.playcall.yunvideo.thread.ChangeFormat;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

@EnableRedisHttpSession
@CrossOrigin
@Controller
@RequestMapping
public class IndexController {

    @Autowired
    private UserDao userDao;

    @Autowired
    private TaskDao taskDao;

    @Autowired
    private StringRedisTemplate redisClient;

    @RequestMapping(value = "/login")
    public ResponseEntity<JSONObject> login(@RequestBody JSONObject codeJson){
        JSONObject resultJson = new JSONObject();
        System.out.println(codeJson);

        JSONObject requestJson = RequestLogin.getLoginOpenId(codeJson.getString("code"));
        System.out.println(requestJson);

        if (requestJson.getString("openid") == null){
            resultJson.put("code","001");
            resultJson.put("desc","授权失败");
            return new ResponseEntity<JSONObject>(resultJson, HttpStatus.OK);
        }

        UserInfo userInfo = userDao.findByOpenId(requestJson.getString("openid"));
        if (userInfo == null){
            userInfo = new UserInfo();
            userInfo.setOpenId(requestJson.getString("openid"));
            userDao.save(userInfo);
        }

        String sessionKey = requestJson.getString("session_key");

        redisClient.opsForValue().set(sessionKey,userInfo.getOpenId(),60*30, TimeUnit.SECONDS);
        resultJson.put("sessionId",sessionKey);
        resultJson.put("code","000");
        resultJson.put("desc","登录成功");

        return new ResponseEntity<JSONObject>(resultJson, HttpStatus.OK);
    }

    @RequestMapping(value = "/q_taskFile")
    public ResponseEntity<JSONObject> qTaskFileList(HttpServletRequest request){
        JSONObject resultJson = new JSONObject();
        String sessionKey = request.getHeader("sessionId");
        if (!redisClient.expire(sessionKey,60*30,TimeUnit.SECONDS)){
            resultJson.put("code","004");
            resultJson.put("desc","会话过期，请重新登录");
            return new ResponseEntity<JSONObject>(resultJson,HttpStatus.OK);
        }
        System.out.println(sessionKey);
        String openId = redisClient.opsForValue().get(sessionKey);
        List<Task> taskList = taskDao.findAllByOpenId(openId);
        JSONArray jsonArray = new JSONArray();
        for (Task tk:taskList) {
            JSONObject task = new JSONObject();
            task.put("fileName",tk.getFileName());
            task.put("fileId",tk.getFileId());
            task.put("status",tk.getStatus());
            task.put("time",tk.getTime());
            jsonArray.add(task);
        }
        resultJson.put("code","000");
        resultJson.put("taskFile",jsonArray);
        return new ResponseEntity<JSONObject>(resultJson,HttpStatus.OK);
    }

    @RequestMapping(value = "/uploadFile")
    public ResponseEntity<JSONObject> uploadFile(HttpServletRequest request,@RequestParam("file") MultipartFile upFile) throws IOException {
        JSONObject resultJson = new JSONObject();
        String sessionKey = request.getHeader("sessionId");
        String openId = redisClient.opsForValue().get(sessionKey);
        String fileName = request.getParameter("fileName");
		System.out.println(fileName);
        String targetFormat = request.getParameter("targetFormat");
        long fileId = System.currentTimeMillis();

        Task task = new Task();
        task.setOpenId(openId);
        task.setFileName(fileName);
        task.setFileId(String.valueOf(fileId));
        task.setStatus("0");
        task.setTargetFormat(targetFormat);
        task.setTime(getCutTime());

        String path1 = System.getProperty("user.dir")+"/src/main/resources/static/user/"+openId+"/upload/"+fileId;
        String path2 = System.getProperty("user.dir")+"/src/main/resources/static/user/"+openId+"/download/"+fileId;
        File userStoragePath = new File(path1);
        File userDownloadPath = new File(path2);
        if (!userStoragePath.exists()){
            userStoragePath.mkdirs();
            userDownloadPath.mkdirs();
        }

        File path = new File(userStoragePath+"/"+fileName);

        BufferedOutputStream receiveFile = new BufferedOutputStream(new FileOutputStream(path));
        receiveFile.write(upFile.getBytes());
        receiveFile.flush();
        receiveFile.close();
        taskDao.save(task);
        task = taskDao.findByOpenIdAndFileId(task.getOpenId(),task.getFileId());
        new Thread(new ChangeFormat(path1+"/"+fileName,path2+"/"+fileName.split("\\.")[0]+"."+targetFormat,task,taskDao)).start();
        resultJson.put("code","000");
        resultJson.put("desc","上传成功");
		resultJson.put("fileId",fileId);
        return new ResponseEntity<JSONObject>(resultJson,HttpStatus.OK);
    }

    @RequestMapping(value = "/downloadFile/{fileId}")
    public void downloadFile(HttpServletRequest request, HttpServletResponse response, @PathVariable String fileId) throws IOException {

        String sessionKey = request.getHeader("sessionId");
        String openId = redisClient.opsForValue().get(sessionKey);
        Task task = taskDao.findByOpenIdAndFileId(openId,fileId);
        if (task == null){
            JSONObject resultJson = new JSONObject();
            resultJson.put("code","005");
            resultJson.put("desc","无此视频文件");
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json;charset=utf-8");
            PrintWriter out = response.getWriter();
            out.append(resultJson.toString());
            out.close();
            return ;
        }
        if (task.getStatus().equals("0")){
            JSONObject resultJson = new JSONObject();
            resultJson.put("code","006");
            resultJson.put("desc","视频正在转码");
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json;charset=utf-8");
            PrintWriter out = response.getWriter();
            out.append(resultJson.toString());
            out.close();
            return ;
        }
        File file = new File(System.getProperty("user.dir")+"/src/main/resources/static/user/"+openId+"/download/"+fileId+"/"+(task.getFileName()).split("\\.")[0]+"."+task.getTargetFormat());
        response.setContentType("application/force-download");
        response.addHeader("Content-Disposition","attachment;fileName="+task.getFileName());
        BufferedInputStream bufferedInputStream = new BufferedInputStream(new FileInputStream(file));
        OutputStream downloadFile = response.getOutputStream();
        byte[] buffer = new byte[1024];
        for (int i = 0; ;) {
            i = bufferedInputStream.read(buffer);
            if (i == -1)
                break;
            downloadFile.write(buffer,0,i);
        }
        downloadFile.close();
        return ;
    }

    @RequestMapping(value = "/q_taskStatus/{fileId}")
    public void getTaskStatus(HttpServletRequest request,HttpServletResponse response,@PathVariable String fileId) throws IOException {
        String sessionKey = request.getHeader("sessionId");
        String openId = redisClient.opsForValue().get(sessionKey);
        Task task = taskDao.findByOpenIdAndFileId(openId,fileId);
		if (task == null){
			JSONObject resultJson = new JSONObject();
			resultJson.put("code","001");
			resultJson.put("desc","该资源不存在");
			response.setCharacterEncoding("utf-8");
			response.setContentType("application/json;charset=utf-8");
			PrintWriter out = response.getWriter();
			out.append(resultJson.toString());
			out.close();
			return;
		}
        if (task.getStatus().equals("0")){
            JSONObject resultJson = new JSONObject();
            resultJson.put("code","006");
            resultJson.put("desc","视频正在转码");
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json;charset=utf-8");
            PrintWriter out = response.getWriter();
            out.append(resultJson.toString());
            out.close();
            return ;
        }else if (task.getStatus().equals("1")){
            JSONObject resultJson = new JSONObject();
            resultJson.put("code","000");
            resultJson.put("desc","视频转码完成");
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json;charset=utf-8");
            PrintWriter out = response.getWriter();
            out.append(resultJson.toString());
            out.close();
            return ;
        }else {
			JSONObject resultJson = new JSONObject();
			resultJson.put("code","002");
			resultJson.put("desc","服务器错误");
			response.setCharacterEncoding("utf-8");
			response.setContentType("application/json;charset=utf-8");
			PrintWriter out = response.getWriter();
			out.append(resultJson.toString());
			out.close();
            return ;
		}
    }

    private String getCutTime(){
        Date date = new Date();//获得系统时间.
        String dateStr = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(date);
        return dateStr;
    }
}
