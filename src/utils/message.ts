// 工具类提示信息
import { ElNotification, ElMessageBox, ElMessage } from "element-plus";
import { emoji } from "@/utils/emoji";

type MessageType = "info" | "success" | "error" | "warning";

/** 封装提示信息，默认info */
export function meowMsgInfo(message: string, plain = false, duration = 2000, type: MessageType = "info", parseHtml = false) {
    ElMessage.closeAll();
    ElMessage({
        message,
        plain: plain,
        duration: duration,
        type,
        showClose: true,
        dangerouslyUseHTMLString: parseHtml
    });
}

/** 封装提示信息，默认error */
export function meowMsgError(message: string, plain = false, duration = 2000, type: MessageType = "error", parseHtml = false) {
    ElMessage.closeAll();
    ElMessage({
        message: message + emoji('枫叶'),
        plain: plain,
        duration: duration,
        type,
        showClose: true,
        dangerouslyUseHTMLString: parseHtml
    })
}

/** 封装提示信息，默认success */
export function meowMsgSuccess(message: string, plain = false, duration = 2000, type: MessageType = "success", parseHtml = false) {
    ElMessage.closeAll();
    ElMessage({
        message: message + emoji('小猫咪'),
        plain: plain,
        duration: duration,
        type,
        showClose: true,
        dangerouslyUseHTMLString: parseHtml
    })
}

/** 封装提示信息，默认warning */
export function meowMsgWarning(message: string, plain = false, duration = 2000, type: MessageType = "warning", parseHtml = false) {
    ElMessage.closeAll();
    ElMessage({
        message: message + emoji('喵喵喵'),
        plain: plain,
        duration: duration,
        type,
        showClose: true,
        dangerouslyUseHTMLString: parseHtml
    })
}