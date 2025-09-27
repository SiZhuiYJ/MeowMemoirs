// ani-cursor-plus.ts
// ANI光标动画工具类 - 无依赖版本

/**
 * 帧信息接口
 */
interface FrameInfo {
    frameIndex: number;    // 帧索引
    framDuration: number;  // 帧持续时间（毫秒）
}

/**
 * ANI文件信息接口
 */
interface ANIInfo {
    KeyFrameContent: string;      // CSS关键帧动画内容
    aniURLRegexClassName: string; // 生成的CSS类名
    keyframesName: string;        // 关键帧动画名称
    totalRoundTime: number;       // 动画总时长（毫秒）
}

/**
 * RIFF块信息接口
 */
interface RIFFChunk {
    id: string;           // 块标识（4字符）
    size: number;         // 块大小
    start: number;        // 块数据起始位置
    subChunks?: RIFFChunk[]; // 子块列表（仅LIST块有）
}

/**
 * ANI鼠标光标动画类
 * 支持加载和显示Windows ANI格式的光标动画文件
 */
class ANIMousePlus {
    private LoadedANIs: ANIInfo[] = []; // 已加载的ANI文件缓存
    private URLPathReg: RegExp = /[^a-zA-Z0-9-]+/g; // URL路径正则，用于生成类名

    constructor() {
        // 绑定方法上下文
        this.LoadANICursorPromise = this.LoadANICursorPromise.bind(this);
        this.setLoadedCursorToElement = this.setLoadedCursorToElement.bind(this);
        this.setLoadedCursorDefault = this.setLoadedCursorDefault.bind(this);
        this.setANICursor = this.setANICursor.bind(this);
        this.setANICursorWithGroupElement = this.setANICursorWithGroupElement.bind(this);
    }

    /**
     * 解析RIFF文件结构
     * @param buffer ArrayBuffer格式的文件数据
     * @returns RIFF块结构数组
     */
    private parseRIFF(buffer: ArrayBuffer): RIFFChunk[] {
        const chunks: RIFFChunk[] = [];
        const view = new DataView(buffer);
        let offset = 0;

        // 检查文件头签名
        const signature = this.readString(view, 0, 4);
        if (signature !== 'RIFF') {
            throw new Error('Invalid RIFF file signature');
        }

        const fileSize = view.getUint32(4, true);
        const fileType = this.readString(view, 8, 4);

        if (fileType !== 'ACON') {
            throw new Error('Not an ANI file (ACON signature missing)');
        }

        offset = 12; // 跳过RIFF头

        // 解析所有块
        while (offset < buffer.byteLength - 8) {
            const chunkId = this.readString(view, offset, 4);
            const chunkSize = view.getUint32(offset + 4, true);

            const chunk: RIFFChunk = {
                id: chunkId,
                size: chunkSize,
                start: offset + 8
            };

            // 如果是LIST块，解析子块
            if (chunkId === 'LIST') {
                const listType = this.readString(view, chunk.start, 4);
                chunk.subChunks = this.parseListChunks(view, chunk.start + 4, chunkSize - 4);
            }

            chunks.push(chunk);
            offset += 8 + chunkSize;

            // 块数据需要2字节对齐
            if (offset % 2 !== 0) offset++;
        }

        return chunks;
    }

    /**
     * 解析LIST块中的子块
     * @param view DataView对象
     * @param startOffset 起始偏移量
     * @param listSize LIST块大小
     * @returns 子块数组
     */
    private parseListChunks(view: DataView, startOffset: number, listSize: number): RIFFChunk[] {
        const subChunks: RIFFChunk[] = [];
        let offset = startOffset;
        const endOffset = startOffset + listSize;

        while (offset < endOffset - 8) {
            const chunkId = this.readString(view, offset, 4);
            const chunkSize = view.getUint32(offset + 4, true);

            subChunks.push({
                id: chunkId,
                size: chunkSize,
                start: offset + 8
            });

            offset += 8 + chunkSize;
            if (offset % 2 !== 0) offset++;
        }

        return subChunks;
    }

    /**
     * 从DataView读取字符串
     * @param view DataView对象
     * @param offset 偏移量
     * @param length 长度
     * @returns 读取的字符串
     */
    private readString(view: DataView, offset: number, length: number): string {
        let result = '';
        for (let i = 0; i < length; i++) {
            const charCode = view.getUint8(offset + i);
            if (charCode === 0) break;
            result += String.fromCharCode(charCode);
        }
        return result;
    }

    /**
     * 查找指定ID的块
     * @param chunks 块数组
     * @param chunkId 要查找的块ID
     * @returns 找到的块或null
     */
    private findChunk(chunks: RIFFChunk[], chunkId: string): RIFFChunk | null {
        for (const chunk of chunks) {
            if (chunk.id === chunkId) {
                return chunk;
            }
            // 递归查找子块
            if (chunk.subChunks) {
                const found = this.findChunk(chunk.subChunks, chunkId);
                if (found) return found;
            }
        }
        return null;
    }

    /**
     * 查找所有指定ID的块
     * @param chunks 块数组
     * @param chunkId 要查找的块ID
     * @returns 找到的块数组
     */
    private findAllChunks(chunks: RIFFChunk[], chunkId: string): RIFFChunk[] {
        const result: RIFFChunk[] = [];

        for (const chunk of chunks) {
            if (chunk.id === chunkId) {
                result.push(chunk);
            }
            // 递归查找子块
            if (chunk.subChunks) {
                result.push(...this.findAllChunks(chunk.subChunks, chunkId));
            }
        }

        return result;
    }

    /**
     * 调整ICO图标尺寸
     * @param blobUrl 原始图标Blob URL
     * @param newWidth 新宽度
     * @param newHeight 新高度
     * @returns 调整后的Blob URL
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
                try {
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
                } catch (error) {
                    reject(error);
                }
            };

            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = blobUrl;
        });
    }

    /**
     * 加载ANI光标文件并解析为动画信息
     * @param aniURL ANI文件URL
     * @param cursorType 光标类型（默认auto）
     * @param width 光标宽度（默认32）
     * @param height 光标高度（默认32）
     * @returns 解析后的ANI信息Promise
     */
    public LoadANICursorPromise(
        aniURL: string,
        cursorType: string = "auto",
        width: number = 32,
        height: number = 32
    ): Promise<ANIInfo> {
        return new Promise((resolve, reject) => {
            // 生成唯一的CSS类名
            const aniURLRegexClassName = "cursor-animation-" + aniURL.replace(this.URLPathReg, "-");

            // 检查是否已加载过该ANI文件
            for (const aniInfo of this.LoadedANIs) {
                if (aniInfo.aniURLRegexClassName === aniURLRegexClassName) {
                    resolve(aniInfo);
                    return;
                }
            }

            // 获取ANI文件
            fetch(aniURL)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Network response was not ok: ${response.status}`);
                    }
                    return response.arrayBuffer();
                })
                .then((arrayBuffer) => {
                    try {
                        // 解析RIFF结构
                        const chunks = this.parseRIFF(arrayBuffer);
                        const view = new DataView(arrayBuffer);

                        // 查找anih块（ANI头信息）
                        const anihChunk = this.findChunk(chunks, 'anih');
                        if (!anihChunk) {
                            throw new Error("ANI header chunk (anih) not found");
                        }

                        const anihStart = anihChunk.start;

                        // 读取ANI头信息
                        const frameNum = view.getUint32(anihStart + 4, true);           // 帧数
                        const cursorPlayOrderNum = view.getUint32(anihStart + 8, true); // 播放顺序数
                        const frameDurationInHead = view.getUint32(anihStart + 28, true); // 帧持续时间

                        const frameInfo: FrameInfo[] = [];
                        const frameURLs: string[] = [];

                        // 解析序列信息（如果有seq块）
                        const seqChunk = this.findChunk(chunks, 'seq');
                        const rateChunk = this.findChunk(chunks, 'rate');

                        if (seqChunk) {
                            const seqStart = seqChunk.start;

                            if (rateChunk) {
                                // 有seq和rate块：使用自定义时序
                                const rateStart = rateChunk.start;
                                for (let i = 0; i < cursorPlayOrderNum; i++) {
                                    frameInfo.push({
                                        frameIndex: view.getUint32(seqStart + i * 4, true),
                                        framDuration: (view.getUint32(rateStart + i * 4, true) * 1000) / 60,
                                    });
                                }
                            } else {
                                // 只有seq块：使用统一时序
                                for (let i = 0; i < cursorPlayOrderNum; i++) {
                                    frameInfo.push({
                                        frameIndex: view.getUint32(seqStart + i * 4, true),
                                        framDuration: (frameDurationInHead * 1000) / 60,
                                    });
                                }
                            }
                        } else {
                            // 无seq块：简单顺序播放
                            for (let i = 0; i < frameNum; i++) {
                                frameInfo.push({
                                    frameIndex: i,
                                    framDuration: (frameDurationInHead * 1000) / 60,
                                });
                            }
                        }

                        // 查找所有图标帧
                        const iconChunks = this.findAllChunks(chunks, 'icon');
                        if (iconChunks.length === 0) {
                            throw new Error("No icon frames found in ANI file");
                        }

                        // 调整图标尺寸
                        const resizePromises: Promise<{ index: number; url: string }>[] = [];

                        for (let i = 0; i < Math.min(cursorPlayOrderNum, iconChunks.length); i++) {
                            const iconChunk = iconChunks[i];
                            const iconData = new Uint8Array(arrayBuffer, iconChunk.start, iconChunk.size);
                            const iconBlob = new Blob([iconData], { type: "image/x-icon" });
                            const icourl = URL.createObjectURL(iconBlob);

                            resizePromises.push(
                                this.resizeIco(icourl, width, height).then((resizedUrl) => ({
                                    index: i,
                                    url: resizedUrl,
                                }))
                            );
                        }

                        // 等待所有图标调整完成
                        Promise.all(resizePromises).then((results) => {
                            // 组织帧URL
                            results.forEach((result) => {
                                frameURLs[result.index] = result.url;
                            });

                            // 计算动画总时长
                            let totalRoundTime = frameInfo.reduce((total, frame) => total + frame.framDuration, 0);

                            // 生成CSS关键帧动画
                            const keyframesName = `${aniURLRegexClassName}-keyframes`;
                            const keyframeContent = this.generateKeyframesCSS(
                                frameInfo,
                                frameURLs,
                                keyframesName,
                                cursorType,
                                totalRoundTime
                            );

                            // 创建ANI信息对象
                            const ANIInfo: ANIInfo = {
                                KeyFrameContent: keyframeContent,
                                aniURLRegexClassName,
                                keyframesName,
                                totalRoundTime,
                            };

                            // 缓存并返回结果
                            this.LoadedANIs.push(ANIInfo);
                            resolve(ANIInfo);
                        }).catch(reject);

                    } catch (error) {
                        reject(error);
                    }
                })
                .catch(reject);
        });
    }

    /**
     * 生成CSS关键帧动画
     * @param frameInfo 帧信息数组
     * @param frameURLs 帧URL数组
     * @param keyframesName 关键帧名称
     * @param cursorType 光标类型
     * @param totalRoundTime 总时长
     * @returns CSS关键帧动画字符串
     */
    private generateKeyframesCSS(
        frameInfo: FrameInfo[],
        frameURLs: string[],
        keyframesName: string,
        cursorType: string,
        totalRoundTime: number
    ): string {
        let styleContent = `@keyframes ${keyframesName} { `;
        let accumulatedPercent = 0;

        for (let i = 0; i < frameInfo.length; i++) {
            const frame = frameInfo[i];
            const percent = accumulatedPercent;

            styleContent += `${percent}% { cursor: url(${frameURLs[frame.frameIndex]}), ${cursorType}; } `;

            // 计算下一帧的百分比位置
            accumulatedPercent += (frame.framDuration / totalRoundTime) * 100;
        }

        // 添加100%关键帧确保动画循环平滑
        styleContent += `100% { cursor: url(${frameURLs[frameInfo[0].frameIndex]}), ${cursorType}; } `;
        styleContent += '}';

        return styleContent;
    }

    /**
     * 将已加载的光标动画应用到指定元素
     * @param elementSelector CSS选择器
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
                // 创建样式并插入到文档中
                const styleContent = `${KeyFrameContent}
          ${elementSelector} { 
            animation: ${keyframesName} ${totalRoundTime}ms step-end infinite; 
          }
          .${aniURLRegexClassName} { 
            animation: ${keyframesName} ${totalRoundTime}ms step-end infinite; 
          }`;

                this.injectStyle(styleContent);
            }
        ).catch(console.error);
    }

    /**
     * 设置默认光标样式
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
                const styleContent = `${KeyFrameContent}
          .${aniURLRegexClassName} { 
            animation: ${keyframesName} ${totalRoundTime}ms step-end infinite; 
          }`;

                this.injectStyle(styleContent);
                defaultClass = aniURLRegexClassName;
            }
        ).catch(console.error);

        return defaultClass;
    }

    /**
     * 直接将ANI光标应用到元素
     * @param elementSelector CSS选择器
     * @param aniURL ANI文件URL
     * @param cursorType 光标类型
     * @param width 宽度
     * @param height 高度
     */
    public setANICursor(
        elementSelector: string,
        aniURL: string,
        cursorType: string = "auto",
        width: number = 32,
        height: number = 32
    ): void {
        this.setLoadedCursorToElement(
            elementSelector,
            this.LoadANICursorPromise(aniURL, cursorType, width, height)
        );
    }

    /**
     * 将ANI光标应用到多个元素
     * @param elementSelectorGroup 元素选择器数组
     * @param aniURL ANI文件URL
     * @param cursorType 光标类型
     * @param width 宽度
     * @param height 高度
     */
    public setANICursorWithGroupElement(
        elementSelectorGroup: string[],
        aniURL: string,
        cursorType: string = "auto",
        width: number = 32,
        height: number = 32
    ): void {
        const allElements = elementSelectorGroup.join(",");
        this.setANICursor(allElements, aniURL, cursorType, width, height);
    }

    /**
     * 向文档中注入CSS样式
     * @param styleContent CSS样式内容
     */
    private injectStyle(styleContent: string): void {
        // 检查是否已存在相同样式
        const existingStyle = document.querySelector(`style[data-ani-cursor]`);
        if (existingStyle) {
            existingStyle.innerHTML += styleContent;
            return;
        }

        // 创建新样式元素
        const style = document.createElement("style");
        style.setAttribute('data-ani-cursor', 'true');
        style.innerHTML = styleContent;
        document.head.appendChild(style);
    }

    /**
     * 清除所有已加载的ANI缓存
     */
    public clearCache(): void {
        this.LoadedANIs = [];
    }

    /**
     * 获取已加载的ANI数量
     * @returns 已加载的ANI文件数量
     */
    public getLoadedCount(): number {
        return this.LoadedANIs.length;
    }
}

// 创建单例实例
const instance = new ANIMousePlus();

// 导出方法和实例
export const {
    LoadANICursorPromise,
    setLoadedCursorToElement,
    setLoadedCursorDefault,
    setANICursor,
    setANICursorWithGroupElement,
    clearCache,
    getLoadedCount,
} = instance;

export default instance;