// ani-cursor-pure.ts

/**
 * 帧信息接口
 * 定义动画中每一帧的基本信息
 */
interface FrameInfo {
    /**
     * 帧索引
     */
    frameIndex: number;

    /**
     * 帧持续时间（毫秒）
     */
    framDuration: number;
}

/**
 * ANI动画信息接口
 * 存储ANI光标文件解析后的关键信息
 */
interface ANIInfo {
    /**
     * 关键帧CSS内容
     */
    KeyFrameContent: string;

    /**
     * 经过处理的URL类名
     */
    aniURLRegexClassName: string;

    /**
     * 关键帧动画名称
     */
    keyframesName: string;

    /**
     * 总循环时间
     */
    totalRoundTime: number;
}

/**
 * ANI JSON数据接口
 * 用于直接提供已解析的ANI数据，避免重新解析ANI文件
 */
interface ANIJsonData {
    /**
     * 帧信息数组
     */
    frameInfos: FrameInfo[];
    
    /**
     * 帧图片数据数组，每个元素为Base64编码的图片数据
     */
    frameImages: string[];
    
    /**
     * 光标类型，默认为"auto"
     */
    cursorType?: string;
    
    /**
     * 光标宽度
     */
    width?: number;
    
    /**
     * 光标高度
     */
    height?: number;
    
    /**
     * 可选的标识符，用于生成唯一的CSS类名
     */
    identifier?: string;
}

/**
 * ANI光标动画处理类
 * 用于加载和处理Windows ANI光标文件，并将其转换为CSS动画
 */
class ANIMousePure {
    /**
     * 已加载的ANI信息数组
     */
    private LoadedANIs: ANIInfo[] = [];

    /**
     * URL路径正则表达式，用于生成合法的CSS类名
     */
    private URLPathReg: RegExp = /[^a-zA-Z0-9-]+/g;

    /**
     * 构造函数，绑定类方法的this上下文
     */
    constructor() {
        this.LoadANICursorPromise = this.LoadANICursorPromise.bind(this);
        this.LoadANICursorFromJson = this.LoadANICursorFromJson.bind(this);
        this.setLoadedCursorToElement = this.setLoadedCursorToElement.bind(this);
        this.setLoadedCursorDefault = this.setLoadedCursorDefault.bind(this);
        this.setANICursor = this.setANICursor.bind(this);
        this.setANICursorWithJsonData = this.setANICursorWithJsonData.bind(this);
        this.setANICursorWithGroupElement = this.setANICursorWithGroupElement.bind(this);
    }

    /**
     * 在缓冲区中查找指定ID的块
     * @param buffer 数据缓冲区
     * @param chunkId 要查找的块ID
     * @param startIndex 开始查找的位置
     * @returns 找到的块信息，包括起始位置和大小
     */
    private findChunk(buffer: Uint8Array, chunkId: string, startIndex: number = 0): { start: number; size: number } | null {
        // 将块ID转换为字节数组
        const idBytes = new TextEncoder().encode(chunkId);

        // 遍历缓冲区查找匹配的块
        for (let i = startIndex; i < buffer.length - 8; i++) {
            let match = true;

            // 检查当前4个字节是否与块ID匹配
            for (let j = 0; j < 4; j++) {
                if (buffer[i + j] !== idBytes[j]) {
                    match = false;
                    break;
                }
            }

            // 如果匹配，读取块大小并返回块信息
            if (match) {
                const size = new DataView(buffer.buffer).getUint32(i + 4, true);
                return { start: i + 8, size };
            }
        }
        return null;
    }

    /**
     * 查找缓冲区中的LIST块及其子块
     * @param buffer 数据缓冲区
     * @returns LIST块信息数组，包含子块信息
     */
    private findListChunks(buffer: Uint8Array): { start: number; size: number; subChunks: Array<{ chunkData: { start: number }, chunkSize: number }> }[] {
        const lists: Array<{ start: number; size: number; subChunks: Array<{ chunkData: { start: number }, chunkSize: number }> }> = [];
        let currentIndex = 0;

        // 循环查找所有LIST块
        while (true) {
            const listChunk = this.findChunk(buffer, "LIST", currentIndex);
            if (!listChunk) break;

            const subChunks: Array<{ chunkData: { start: number }, chunkSize: number }> = [];
            let subIndex = listChunk.start;

            // 在LIST块中查找'fram'子块
            while (subIndex < listChunk.start + listChunk.size - 8) {
                const framChunk = this.findChunk(buffer, "fram", subIndex);
                if (!framChunk) break;

                // 将找到的fram块添加到子块列表
                subChunks.push({
                    chunkData: { start: framChunk.start },
                    chunkSize: framChunk.size
                });

                subIndex = framChunk.start + framChunk.size;
            }

            // 将LIST块及其子块信息添加到结果数组
            lists.push({
                start: listChunk.start,
                size: listChunk.size,
                subChunks
            });

            currentIndex = listChunk.start + listChunk.size;
        }

        return lists;
    }

    /**
     * 加载ANI光标文件并解析为Promise
     * @param aniURL ANI文件URL
     * @param cursorType 光标类型，默认为"auto"
     * @param width 光标宽度，默认为32px
     * @param height 光标高度，默认为32px
     * @returns 解析后的ANI信息Promise
     */
    public LoadANICursorPromise(
        aniURL: string,
        cursorType: string = "auto",
        width: number = 32,
        height: number = 32
    ): Promise<ANIInfo> {
        return new Promise((topResolve, topReject) => {
            // 生成合法的CSS类名
            const aniURLRegexClassName =
                "cursor-animation-" + aniURL.replace(this.URLPathReg, "-");

            // 检查是否已经加载过该ANI文件
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
                    /**
                     * 调整图标大小的辅助函数
                     * @param blobUrl 图标Blob URL
                     * @param newWidth 新宽度
                     * @param newHeight 新高度
                     * @returns 调整大小后的图标URL Promise
                     */
                    const resizeIco = (
                        blobUrl: string,
                        newWidth: number,
                        newHeight: number
                    ): Promise<string> => {
                        return new Promise((resolve) => {
                            const img = new Image();
                            const canvas = document.createElement("canvas");
                            const ctx = canvas.getContext("2d");

                            if (!ctx) {
                                throw new Error("Failed to get canvas context");
                            }

                            img.onload = () => {
                                // 设置canvas尺寸并绘制调整大小后的图标
                                canvas.width = newWidth;
                                canvas.height = newHeight;
                                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                                // 将canvas转换为Blob并生成URL
                                canvas.toBlob((blob) => {
                                    if (!blob) {
                                        throw new Error("Failed to create blob");
                                    }
                                    const url = URL.createObjectURL(blob);
                                    resolve(url);
                                }, "image/x-icon");
                            };
                            img.src = blobUrl;
                        });
                    };

                    // 创建数据视图用于读取二进制数据
                    const buffer = new Uint8Array(arrayBuffer);
                    const view = new DataView(arrayBuffer);

                    // 查找并解析anih块（ANI头信息）
                    const anihChunk = this.findChunk(buffer, "anih");
                    if (!anihChunk) {
                        throw new Error("Invalid ANI file: anih chunk not found");
                    }

                    // 读取ANI头信息
                    const startIndex = anihChunk.start;
                    const frameNum = view.getUint32(startIndex + 1 * 4, true); // 帧数量
                    const cursorPlayOrderNum = view.getUint32(startIndex + 2 * 4, true); // 播放顺序中的帧数
                    const frameDurationInHead = view.getUint32(startIndex + 7 * 4, true); // 头部定义的帧持续时间

                    // 初始化帧信息和URL数组
                    const frameInfo: FrameInfo[] = [];
                    const frameURLs: string[] = [];

                    // 查找seq块（播放顺序）和rate块（帧速率）
                    const seqChunk = this.findChunk(buffer, "seq ");
                    const rateChunk = this.findChunk(buffer, "rate");

                    // 根据是否存在seq块处理帧信息
                    if (seqChunk) {
                        const seqStart = seqChunk.start;

                        // 如果存在rate块，则使用rate块中的速率信息
                        if (rateChunk) {
                            const rateStart = rateChunk.start;
                            for (let i = 0; i < cursorPlayOrderNum; i++) {
                                frameInfo.push({
                                    frameIndex: view.getUint32(seqStart + i * 4, true),
                                    framDuration:
                                        (view.getUint32(rateStart + i * 4, true) * 1000) / 60,
                                });
                            }
                        } else {
                            // 否则使用头部定义的帧持续时间
                            for (let i = 0; i < cursorPlayOrderNum; i++) {
                                frameInfo.push({
                                    frameIndex: view.getUint32(seqStart + i * 4, true),
                                    framDuration: (frameDurationInHead * 1000) / 60,
                                });
                            }
                        }
                    } else {
                        // 如果没有seq块，则按顺序使用所有帧
                        for (let i = 0; i < frameNum; i++) {
                            frameInfo.push({
                                frameIndex: i,
                                framDuration: (frameDurationInHead * 1000) / 60,
                            });
                        }
                    }

                    // 查找包含帧数据的LIST块
                    const listChunks = this.findListChunks(buffer);
                    if (listChunks.length === 0) {
                        throw new Error("No LIST chunks found in ANI file");
                    }

                    // 处理帧图像数据
                    const ResizeIconGroup: Promise<{ index: number; url: string }>[] = [];
                    let frameCounter = 0;

                    // 遍历LIST块和子块，处理帧图像
                    for (const listChunk of listChunks) {
                        for (const subChunk of listChunk.subChunks) {
                            if (frameCounter >= cursorPlayOrderNum) break;

                            // 创建帧图像的Blob URL
                            const icourl = URL.createObjectURL(
                                new Blob(
                                    [
                                        new Uint8Array(
                                            arrayBuffer,
                                            subChunk.chunkData.start,
                                            subChunk.chunkSize
                                        ),
                                    ],
                                    { type: "image/x-icon" }
                                )
                            );

                            // 调整图标大小并添加到处理队列
                            ResizeIconGroup.push(
                                resizeIco(icourl, width, height).then((resizedUrl) => ({
                                    index: frameCounter,
                                    url: resizedUrl,
                                }))
                            );
                            frameCounter++;
                        }
                        if (frameCounter >= cursorPlayOrderNum) break;
                    }

                    // 等待所有图标调整大小完成后生成动画信息
                    Promise.all(ResizeIconGroup).then((results) => {
                        results.forEach((result) => {
                            frameURLs[result.index] = result.url;
                        });

                        let totalRoundTime = 0;

                        /**
                         * 生成帧动画CSS内容
                         * @returns CSS关键帧动画内容
                         */
                        function generateFrameAnimation(): string {
                            let styleContent = "";
                            let pos = 0;

                            // 计算总动画时间
                            frameInfo.forEach((frame) => {
                                totalRoundTime += frame.framDuration;
                            });

                            // 生成每个帧的关键帧
                            frameInfo.forEach((frame) => {
                                styleContent += `${pos}% { cursor: url(${frameURLs[frame.frameIndex]
                                    }),${cursorType};}\n`;
                                pos += (frame.framDuration / totalRoundTime) * 100;
                            });

                            return styleContent;
                        }

                        // 生成关键帧名称和内容
                        const keyframesName = `${aniURLRegexClassName}-keyframes`;
                        const KeyFrameContent = `@keyframes ${keyframesName} { ${generateFrameAnimation()} }`;

                        // 创建ANI信息对象
                        const ANIInfo: ANIInfo = {
                            KeyFrameContent,
                            aniURLRegexClassName,
                            keyframesName,
                            totalRoundTime,
                        };

                        // 将解析后的ANI信息添加到已加载列表
                        this.LoadedANIs.push(ANIInfo);
                        topResolve(ANIInfo);
                    }).catch(topReject);
                })
                .catch(topReject);
        });
    }

    /**
     * 从JSON数据创建ANI光标动画
     * @param jsonData 包含帧信息和图片数据的JSON对象
     * @param cursorType 光标类型，默认为"auto"
     * @param width 光标宽度，默认为32px
     * @param height 光标高度，默认为32px
     * @returns 解析后的ANI信息Promise
     */
    public LoadANICursorFromJson(
        jsonData: ANIJsonData,
        cursorType: string = "auto",
        width: number = 32,
        height: number = 32
    ): Promise<ANIInfo> {
        return new Promise((resolve, reject) => {
            try {
                // 使用identifier或生成默认类名
                const className = jsonData.identifier 
                    ? "cursor-animation-" + jsonData.identifier.replace(this.URLPathReg, "-")
                    : "cursor-animation-json-" + Date.now();

                // 应用默认值
                const actualCursorType = jsonData.cursorType || cursorType;
                const actualWidth = jsonData.width || width;
                const actualHeight = jsonData.height || height;

                // 调整图片大小的辅助函数
                const resizeImage = (
                    imageData: string,
                    newWidth: number,
                    newHeight: number
                ): Promise<string> => {
                    return new Promise((resolve) => {
                        const img = new Image();
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        if (!ctx) {
                            throw new Error("Failed to get canvas context");
                        }

                        img.onload = () => {
                            canvas.width = newWidth;
                            canvas.height = newHeight;
                            ctx.drawImage(img, 0, 0, newWidth, newHeight);
                            canvas.toBlob((blob) => {
                                if (!blob) {
                                    throw new Error("Failed to create blob");
                                }
                                const url = URL.createObjectURL(blob);
                                resolve(url);
                            }, "image/x-icon");
                        };
                        img.src = imageData;
                    });
                };

                // 调整所有帧图片的大小
                const resizePromises: Promise<{ index: number; url: string }>[] = [];
                
                jsonData.frameImages.forEach((imageData, index) => {
                    resizePromises.push(
                        resizeImage(imageData, actualWidth, actualHeight).then((resizedUrl) => ({
                            index,
                            url: resizedUrl,
                        }))
                    );
                });

                // 等待所有图片调整大小完成
                Promise.all(resizePromises).then((results) => {
                    // 按索引排序结果
                    results.sort((a, b) => a.index - b.index);
                    
                    // 提取URL
                    const frameURLs = results.map(result => result.url);
                    
                    // 计算总动画时间
                    let totalRoundTime = 0;
                    jsonData.frameInfos.forEach((frame) => {
                        totalRoundTime += frame.framDuration;
                    });

                    /**
                     * 生成帧动画CSS内容
                     * @returns CSS关键帧动画内容
                     */
                    const generateFrameAnimation = (): string => {
                        let styleContent = "";
                        let pos = 0;

                        jsonData.frameInfos.forEach((frame) => {
                            styleContent += `${pos}% { cursor: url(${frameURLs[frame.frameIndex]}),${actualCursorType};}\n`;
                            pos += (frame.framDuration / totalRoundTime) * 100;
                        });

                        return styleContent;
                    };

                    // 生成关键帧名称和内容
                    const keyframesName = `${className}-keyframes`;
                    const KeyFrameContent = `@keyframes ${keyframesName} { ${generateFrameAnimation()} }`;

                    // 创建ANI信息对象
                    const ANIInfo: ANIInfo = {
                        KeyFrameContent,
                        aniURLRegexClassName: className,
                        keyframesName,
                        totalRoundTime,
                    };

                    // 将解析后的ANI信息添加到已加载列表
                    this.LoadedANIs.push(ANIInfo);
                    resolve(ANIInfo);
                }).catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * 将加载的光标应用到指定元素
     * @param elementSelector 元素选择器
     * @param loadedCursorPromise 已加载的光标Promise
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
                // 生成CSS样式内容
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
     * 设置默认加载光标
     * @param loadedCursorPromise 已加载的光标Promise
     * @returns 生成的CSS类名
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
                // 生成CSS样式内容
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
        // 调用设置光标方法，传入加载光标的Promise
        this.setLoadedCursorToElement(
            elementSelector,
            this.LoadANICursorPromise(aniURL, cursorType, width, height)
        );
    }

    /**
     * 使用JSON数据设置ANI光标到指定元素
     * @param elementSelector 元素选择器
     * @param jsonData ANI JSON数据
     * @param cursorType 光标类型
     * @param width 光标宽度
     * @param height 光标高度
     */
    public setANICursorWithJsonData(
        elementSelector: string,
        jsonData: ANIJsonData,
        cursorType: string = "auto",
        width: number = 32,
        height: number = 32
    ): void {
        this.setLoadedCursorToElement(
            elementSelector,
            this.LoadANICursorFromJson(jsonData, cursorType, width, height)
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
}

// 创建实例并导出
const instance = new ANIMousePure();

export const {
    LoadANICursorPromise,
    LoadANICursorFromJson,
    setLoadedCursorToElement,
    setLoadedCursorDefault,
    setANICursor,
    setANICursorWithJsonData,
    setANICursorWithGroupElement,
} = instance;

export default instance;