package cn.playcall.yunvideo.config;

import cn.playcall.yunvideo.interceptor.SessionInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

@Configuration
public class InterceptorConfig extends WebMvcConfigurationSupport {

    @Bean
    public SessionInterceptor sessionInterceptor(){
        return new SessionInterceptor();
    }

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionInterceptor()).addPathPatterns("/q_taskFile");
        registry.addInterceptor(sessionInterceptor()).addPathPatterns("/uploadFile");
//        registry.addInterceptor(sessionInterceptor()).addPathPatterns("/downloadFile");
        registry.addInterceptor(sessionInterceptor()).addPathPatterns("/conversion");
        super.addInterceptors(registry);
    }
}
