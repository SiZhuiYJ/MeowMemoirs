// ani-cursor-plus.ts

/**
 * 帧信息接口
 * 定义ANI动画中每一帧的基本信息
 */
interface FrameInfo {
    frameIndex: number; // 帧索引
    framDuration: number; // 帧持续时间
}

/**
 * ANI信息接口
 * 存储已加载ANI文件的相关信息
 */
interface ANIInfo {
    KeyFrameContent: string;// 关键帧内容
    aniURLRegexClassName: string;// 用于CSS类名的正则化URL
    keyframesName: string;// 关键帧动画名称
    totalRoundTime: number;// 总循环时间
}

/**
 * ANI光标加载和管理类
 * 负责加载ANI光标文件，解析其内容，并应用到指定元素上
 */
class ANIMousePlus {
    /**
     * 已加载的ANI文件信息数组
     * 用于缓存已加载的ANI光标，避免重复加载
     */
    private LoadedANIs: ANIInfo[] = [];

    /**
     * URL路径正则表达式
     * 用于将URL转换为合法的CSS类名
     */
    private URLPathReg: RegExp = /[^a-zA-Z0-9-]+/g;

    /**
     * 构造函数
     * 绑定类方法到当前实例，确保方法中的this指向正确
     */
    constructor() {
        // 绑定方法
        this.LoadANICursorPromise = this.LoadANICursorPromise.bind(this);
        this.setLoadedCursorToElement = this.setLoadedCursorToElement.bind(this);
        this.setLoadedCursorDefault = this.setLoadedCursorDefault.bind(this);
        this.setANICursor = this.setANICursor.bind(this);
        this.setANICursorWithGroupElement = this.setANICursorWithGroupElement.bind(this);
    }

    /**
     * 查找RIFF文件中的指定块
     * @param buffer 文件数据缓冲区
     * @param chunkId 要查找的块ID
     * @param startIndex 查找起始位置，默认为0
     * @returns 返回找到的块信息，包括起始位置和大小，未找到返回null
     */
    private findChunk(buffer: Uint8Array, chunkId: string, startIndex: number = 0): { start: number; size: number } | null {
        const idBytes = new TextEncoder().encode(chunkId);
        for (let i = startIndex; i < buffer.length - 8; i++) {
            let match = true;
            for (let j = 0; j < 4; j++) {
                if (buffer[i + j] !== idBytes[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                const size = new DataView(buffer.buffer).getUint32(i + 4, true);
                return { start: i + 8, size };
            }
        }
        return null;
    }

    /**
     * 查找LIST块中的所有子块
     * @param buffer 文件数据缓冲区
     * @param listStart LIST块起始位置
     * @returns 返回所有子块的信息数组
     */
    private findListSubChunks(buffer: Uint8Array, listStart: number): { start: number; size: number }[] {
        const subChunks: { start: number; size: number }[] = [];
        let position = listStart + 4; // 跳过 'LIST' 类型标识

        while (position < buffer.length - 8) {
            const chunkId = String.fromCharCode(...buffer.slice(position, position + 4));
            if (chunkId === 'fram') {
                const size = new DataView(buffer.buffer).getUint32(position + 4, true);
                subChunks.push({ start: position + 8, size });
                position += 8 + size;
                // 对齐到偶数字节
                if (size % 2 !== 0) position++;
            } else {
                break;
            }
        }

        return subChunks;
    }

    /**
     * 调整ICO图像大小
     * @param blobUrl 原始ICO图像的Blob URL
     * @param newWidth 新宽度
     * @param newHeight 新高度
     * @returns 返回调整大小后的新图像Blob URL
     */
    private resizeIco(blobUrl: string, newWidth: number, newHeight: number): Promise<string> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (!ctx) {
                reject(new Error("Failed to get canvas context"));
                return;
            }

            img.onload = () => {
                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, 0, 0, newWidth, newHeight);
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error("Failed to create blob"));
                        return;
                    }
                    const url = URL.createObjectURL(blob);
                    resolve(url);
                }, "image/x-icon");
            };

            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = blobUrl;
        });
    }

    /**
     * 加载ANI光标文件并返回Promise
     * @param aniURL ANI文件URL地址
     * @param cursorType 光标类型，默认为"auto"
     * @param width 光标宽度，默认为32像素
     * @param height 光标高度，默认为32像素
     * @returns 返回包含ANI信息的Promise对象
     */
    public LoadANICursorPromise(
        aniURL: string,
        cursorType: string = "auto",
        width: number = 32,
        height: number = 32
    ): Promise<ANIInfo> {
        return new Promise((topResolve, topReject) => {
            // 将URL转换为合法的CSS类名
            const aniURLRegexClassName = "cursor-animation-" + aniURL.replace(this.URLPathReg, "-");

            // 检查是否已加载，避免重复加载同一ANI文件
            for (const aniInfo of this.LoadedANIs) {
                if (aniInfo.aniURLRegexClassName === aniURLRegexClassName) {
                    topResolve(aniInfo);
                    return;
                }
            }

            // 获取ANI文件数据
            fetch(aniURL)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.arrayBuffer();
                })
                .then((arrayBuffer) => {
                    const buffer = new Uint8Array(arrayBuffer);
                    const view = new DataView(arrayBuffer);

                    // 验证文件头，确保是有效的RIFF文件
                    const header = String.fromCharCode(...buffer.slice(0, 4));
                    if (header !== 'RIFF') {
                        throw new Error("Invalid ANI file: Not a RIFF file");
                    }

                    // 查找 anih 块（ANI文件头信息块）
                    const anihChunk = this.findChunk(buffer, 'anih');
                    if (!anihChunk) {
                        throw new Error("Invalid ANI file: anih chunk not found");
                    }

                    // 解析ANI文件头信息
                    const anihStart = anihChunk.start;
                    const frameNum = view.getUint32(anihStart + 4, true);           // 帧数量
                    const cursorPlayOrderNum = view.getUint32(anihStart + 8, true); // 播放顺序中的帧数
                    const frameDurationInHead = view.getUint32(anihStart + 28, true); // 头部定义的帧持续时间

                    const frameInfo: FrameInfo[] = [];  // 存储帧信息
                    const frameURLs: string[] = [];     // 存储帧图像URL

                    // 处理序列和速率信息
                    const seqChunk = this.findChunk(buffer, 'seq ');  // 序列块
                    const rateChunk = this.findChunk(buffer, 'rate'); // 速率块

                    // 如果存在序列块
                    if (seqChunk) {
                        const seqStart = seqChunk.start;

                        // 如果存在速率块
                        if (rateChunk) {
                            const rateStart = rateChunk.start;
                            for (let i = 0; i < cursorPlayOrderNum; i++) {
                                frameInfo.push({
                                    frameIndex: view.getUint32(seqStart + i * 4, true),
                                    framDuration: (view.getUint32(rateStart + i * 4, true) * 1000) / 60,
                                });
                            }
                        } else {
                            // 使用头部定义的帧持续时间
                            for (let i = 0; i < cursorPlayOrderNum; i++) {
                                frameInfo.push({
                                    frameIndex: view.getUint32(seqStart + i * 4, true),
                                    framDuration: (frameDurationInHead * 1000) / 60,
                                });
                            }
                        }
                    } else {
                        // 没有序列块，按顺序使用所有帧
                        for (let i = 0; i < frameNum; i++) {
                            frameInfo.push({
                                frameIndex: i,
                                framDuration: (frameDurationInHead * 1000) / 60,
                            });
                        }
                    }

                    // 查找并处理图标帧
                    const listChunks: { start: number; size: number }[] = [];
                    let position = 12; // RIFF头之后开始搜索

                    // 查找LIST块中的帧数据
                    while (position < buffer.length - 8) {
                        const chunk = this.findChunk(buffer, 'LIST', position);
                        if (!chunk) break;

                        const listType = String.fromCharCode(...buffer.slice(chunk.start - 4, chunk.start));
                        if (listType === 'fram') {
                            const subChunks = this.findListSubChunks(buffer, chunk.start - 4);
                            listChunks.push(...subChunks);
                        }

                        position = chunk.start + chunk.size;
                    }

                    // 如果没有找到LIST块，尝试直接查找图标数据
                    if (listChunks.length === 0) {
                        let iconPosition = 12;
                        while (iconPosition < buffer.length - 8) {
                            const chunkId = String.fromCharCode(...buffer.slice(iconPosition, iconPosition + 4));
                            if (chunkId === 'icon') {
                                const size = view.getUint32(iconPosition + 4, true);
                                listChunks.push({ start: iconPosition + 8, size });
                            }
                            iconPosition += 8;
                        }
                    }

                    // 调整图标大小的Promise数组
                    const ResizeIconGroup: Promise<{ index: number; url: string }>[] = [];
                    const frameCount = Math.min(cursorPlayOrderNum, listChunks.length);

                    // 处理每一帧图标数据
                    for (let i = 0; i < frameCount; i++) {
                        const chunk = listChunks[i];
                        const icoData = new Uint8Array(arrayBuffer, chunk.start, chunk.size);
                        const icourl = URL.createObjectURL(
                            new Blob([icoData], { type: "image/x-icon" })
                        );

                        // 调整图标大小并添加到Promise数组
                        ResizeIconGroup.push(
                            this.resizeIco(icourl, width, height).then((resizedUrl) => ({
                                index: i,
                                url: resizedUrl,
                            })).catch(() => ({ index: i, url: icourl })) // 如果调整大小失败，使用原始URL
                        );
                    }

                    // 等待所有图标处理完成
                    Promise.all(ResizeIconGroup).then((results) => {
                        results.forEach((result) => {
                            frameURLs[result.index] = result.url;
                        });

                        let totalRoundTime = 0;

                        /**
                         * 生成帧动画关键帧CSS内容
                         * @returns 返回关键帧CSS内容字符串
                         */
                        function generateFrameAnimation(): string {
                            let styleContent = "";
                            let pos = 0;

                            // 计算总动画时间
                            frameInfo.forEach((frame) => {
                                totalRoundTime += frame.framDuration;
                            });

                            // 生成每一帧的关键帧定义
                            frameInfo.forEach((frame) => {
                                if (frameURLs[frame.frameIndex]) {
                                    styleContent += `${pos}% { cursor: url(${frameURLs[frame.frameIndex]
                                        }),${cursorType};}\n`;
                                    pos += (frame.framDuration / totalRoundTime) * 100;
                                }
                            });

                            // 确保动画循环，添加最后一帧
                            if (pos < 100) {
                                styleContent += `100% { cursor: url(${frameURLs[0]}),${cursorType};}\n`;
                            }

                            return styleContent;
                        }

                        // 生成关键帧动画名称和内容
                        const keyframesName = `${aniURLRegexClassName}-keyframes`;
                        const KeyFrameContent = `@keyframes ${keyframesName} { ${generateFrameAnimation()} }`;

                        // 创建ANI信息对象
                        const ANIInfo: ANIInfo = {
                            KeyFrameContent,
                            aniURLRegexClassName,
                            keyframesName,
                            totalRoundTime,
                        };

                        // 添加到已加载数组并返回
                        this.LoadedANIs.push(ANIInfo);
                        topResolve(ANIInfo);
                    }).catch(topReject);
                })
                .catch(topReject);
        });
    }

    /**
     * 将已加载的光标应用到指定元素
     * @param elementSelector 元素选择器
     * @param loadedCursorPromise 已加载光标的Promise对象
     */
    public setLoadedCursorToElement(
        elementSelector: string,
        loadedCursorPromise: Promise<ANIInfo>
    ): void {
        loadedCursorPromise.then(
            ({
                KeyFrameContent,
                aniURLRegexClassName,
                keyframesName,
                totalRoundTime,
            }) => {
                // 构造CSS样式内容
                const styleContent = `${KeyFrameContent}
          ${elementSelector} { animation: ${keyframesName} ${totalRoundTime}ms step-end infinite; }
          .${aniURLRegexClassName} { animation: ${keyframesName} ${totalRoundTime}ms step-end infinite; }`;

                // 创建并添加样式元素到页面头部
                const style = document.createElement("style");
                style.innerHTML = styleContent;
                document.head.appendChild(style);
            }
        );
    }

    /**
     * 设置默认光标类
     * @param loadedCursorPromise 已加载光标的Promise对象
     * @returns 返回生成的CSS类名
     */
    public setLoadedCursorDefault(loadedCursorPromise: Promise<ANIInfo>): string {
        let defaultClass = "";

        loadedCursorPromise.then(
            ({
                KeyFrameContent,
                aniURLRegexClassName,
                keyframesName,
                totalRoundTime,
            }) => {
                // 构造CSS样式内容
                const styleContent = `${KeyFrameContent}
          .${aniURLRegexClassName} { animation: ${keyframesName} ${totalRoundTime}ms step-end infinite; }`;

                // 创建并添加样式元素到页面头部
                const style = document.createElement("style");
                style.innerHTML = styleContent;
                document.head.appendChild(style);

                defaultClass = aniURLRegexClassName;
            }
        );

        return defaultClass;
    }

    /**
     * 设置ANI光标到指定元素
     * @param elementSelector 元素选择器
     * @param aniURL ANI文件URL
     * @param cursorType 光标类型
     * @param width 光标宽度
     * @param height 光标高度
     */
    public setANICursor(
        elementSelector: string,
        aniURL: string,
        cursorType: string = "auto",
        width: number = 32,
        height: number = 32
    ): void {
        // 调用setLoadedCursorToElement方法应用光标
        this.setLoadedCursorToElement(
            elementSelector,
            this.LoadANICursorPromise(aniURL, cursorType, width, height)
        );
    }

    /**
     * 为一组元素设置ANI光标
     * @param elementSelectorGroup 元素选择器数组
     * @param aniURL ANI文件URL
     * @param cursorType 光标类型
     * @param width 光标宽度
     * @param height 光标高度
     */
    public setANICursorWithGroupElement(
        elementSelectorGroup: string[],
        aniURL: string,
        cursorType: string = "auto",
        width: number = 32,
        height: number = 32
    ): void {
        // 将选择器数组合并为一个选择器字符串
        const allElements = elementSelectorGroup.join(",");
        this.setANICursor(allElements, aniURL, cursorType, width, height);
    }

    /**
     * 清理已加载的ANI光标资源
     * 释放内存中已加载的ANI文件信息
     */
    public cleanup(): void {
        this.LoadedANIs = [];
        // 这里可以添加更多清理逻辑，如撤销URL对象
    }
}

// 创建ANIMousePlus实例
const instance = new ANIMousePlus();

// 导出实例方法和默认实例
export const {
    LoadANICursorPromise,
    setLoadedCursorToElement,
    setLoadedCursorDefault,
    setANICursor,
    setANICursorWithGroupElement,
    cleanup,
} = instance;

export default instance;