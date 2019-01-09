package cn.playcall.yunvideo.interceptor;


import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.util.concurrent.TimeUnit;

public class SessionInterceptor extends HandlerInterceptorAdapter {

    @Autowired
    private StringRedisTemplate redisClient;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        String sessionKey = request.getHeader("sessionId");
        if (!redisClient.expire(sessionKey,60*30, TimeUnit.SECONDS)){
            JSONObject resultJson = new JSONObject();
            resultJson.put("code","004");
            resultJson.put("desc","会话过期，请重新登录");
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json; charset=utf-8");
            PrintWriter out = response.getWriter();
            out.append(resultJson.toString());
            out.close();
            return false;
        }
        else return true;
    }
}
