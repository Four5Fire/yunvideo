package cn.playcall.yunvideo.server;

import com.alibaba.fastjson.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.web.client.RestTemplate;

public class RequestLogin {

    private static String appId = "wxcd8c6f7bfa845f64";
    private static String secret = "7becddc112cd3bb97f49c4237e58bbe9";

    public static JSONObject getLoginOpenId(String code){
        String url = "https://api.weixin.qq.com/sns/jscode2session?appid="+appId+"&secret="+secret+"&js_code="+code+"&grant_type=authorization_code";
        HttpHeaders headers = new HttpHeaders();
        RestTemplate restTemplate = new RestTemplate();
        String getJson = restTemplate.getForEntity(url,String.class).getBody();
        JSONObject resultJson = JSONObject.parseObject(getJson);
        return resultJson;
    }

}
