// 工具类提示信息
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import "element-plus/theme-chalk/src/message-box.scss";
import "element-plus/theme-chalk/src/message.scss";
import "element-plus/theme-chalk/src/notification.scss";
import { emoji } from "@/utils/emoji";

type MessageType = "info" | "success" | "error" | "warning";

/** 封装提示信息，默认info */
export function meowMsgInfo(
  message: string,
  plain = false,
  duration = 2000,
  type: MessageType = "info",
  parseHtml = false
) {
  ElMessage.closeAll();
  ElMessage({
    message,
    plain: plain,
    duration: duration,
    type,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml,
  });
}

/** 封装提示信息，默认error */
export function meowMsgError(
  message: string,
  plain = false,
  duration = 2000,
  type: MessageType = "error",
  parseHtml = false
) {
  ElMessage.closeAll();
  ElMessage({
    message: message + emoji("枫叶"),
    plain: plain,
    duration: duration,
    type,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml,
  });
}

/** 封装提示信息，默认success */
export function meowMsgSuccess(
  message: string,
  plain = false,
  duration = 2000,
  type: MessageType = "success",
  parseHtml = false
) {
  ElMessage.closeAll();
  ElMessage({
    message: message + emoji("小猫咪"),
    plain: plain,
    duration: duration,
    type,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml,
  });
}

/** 封装提示信息，默认warning */
export function meowMsgWarning(
  message: string,
  plain = false,
  duration = 2000,
  type: MessageType = "warning",
  parseHtml = false
) {
  ElMessage.closeAll();
  ElMessage({
    message: message + emoji("喵喵喵"),
    plain: plain,
    duration: duration,
    type,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml,
  });
}
/** 封装通知信息，默认info */
export function meowNoticeInfo(
  message: any,
  title = "温馨提示",
  duration = 2000,
  type: MessageType = "info",
  parseHtml = false
) {
  ElNotification.closeAll();
  ElNotification({
    message: message + emoji("喵喵喵"),
    title,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml,
  });
}
/** 封装通知信息，默认error */
export function meowNoticeError(
  message: any,
  title = "温馨提示",
  duration = 2000,
  type: MessageType = "error",
  parseHtml = false
) {
  ElNotification.closeAll();
  ElNotification({
    message: message + emoji("喵喵喵"),
    title,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml,
  });
}
/** 封装通知信息，默认success */
export function meowNoticeSuccess(
  message: any,
  title = "温馨提示",
  duration = 2000,
  type: MessageType = "success",
  parseHtml = false
) {
  ElNotification.closeAll();
  ElNotification({
    message: message + emoji("喵喵喵"),
    title,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml,
  });
} /** 封装通知信息，默认warning */
export function meowNoticeWarning(
  message: any,
  title = "温馨提示",
  duration = 2000,
  type: MessageType = "warning",
  parseHtml = false
) {
  ElNotification.closeAll();
  ElNotification({
    message: message + emoji("喵喵喵"),
    title,
    type,
    duration: duration,
    showClose: true,
    dangerouslyUseHTMLString: parseHtml,
  });
} /** 封装确认信息，默认warning */
export function meowMsgBox(
  message: any = "您确定进行关闭么？",
  title: string = "温馨提示：",
  confirmButtonText: string = "确定",
  cancelButtonText: string = "取消",
  type: string = "warning"
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    ElMessageBox.confirm(
      message as any,
      title as any,
      {
        confirmButtonText,
        cancelButtonText,
        type,
        draggable: true,
        dangerouslyUseHTMLString: true,
      } as any
    )
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
}
