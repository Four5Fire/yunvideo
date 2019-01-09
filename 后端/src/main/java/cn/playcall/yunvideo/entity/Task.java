package cn.playcall.yunvideo.entity;

import javax.persistence.*;

@Table(name = "t_task")
@Entity
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;

    @Column(name = "openId")
    private String openId;
    @Column(name = "fileName")
    private String fileName;
    @Column(name = "targetFormat")
    private String targetFormat;
    @Column(name = "fileId")
    private String fileId;
    @Column(name = "status")
    private String status;
    @Column(name = "task_time")
    private String time;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOpenId() {
        return openId;
    }

    public String getTargetFormat() {
        return targetFormat;
    }

    public void setTargetFormat(String targetFormat) {
        this.targetFormat = targetFormat;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    @Override
    public String toString() {
        return "Task{" +
                "id=" + id +
                ", openId='" + openId + '\'' +
                ", fileName='" + fileName + '\'' +
                ", targetFormat='" + targetFormat + '\'' +
                ", fileId='" + fileId + '\'' +
                ", status='" + status + '\'' +
                ", time='" + time + '\'' +
                '}';
    }
}
