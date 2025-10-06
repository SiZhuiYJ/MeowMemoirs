/**
 * ANI光标导出工具
 * 提供将ANI光标数据导出为HTML文件的功能，包含动画参数和帧图片
 */

/**
 * 帧信息接口
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
 * ANI信息接口
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
    
    /**
     * 帧图片数据URL数组
     */
    frameImages: string[];
    
    /**
     * 帧信息数组
     */
    frameInfo: FrameInfo[];
}

/**
 * ANI导出工具类
 */
class ANIExportTool {
    /**
     * 查找缓冲区中的块
     * @param buffer 数据缓冲区
     * @param chunkId 要查找的块ID
     * @param startIndex 开始查找的位置
     * @returns 找到的块信息
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
     * 查找缓冲区中的LIST块及其子块
     * @param buffer 数据缓冲区
     * @returns LIST块信息数组
     */
    private findListChunks(buffer: Uint8Array): { start: number; size: number; subChunks: Array<{ chunkData: { start: number }, chunkSize: number }> }[] {
        const lists: Array<{ start: number; size: number; subChunks: Array<{ chunkData: { start: number }, chunkSize: number }> }> = [];
        let currentIndex = 0;

        while (true) {
            const listChunk = this.findChunk(buffer, "LIST", currentIndex);
            if (!listChunk) break;

            const subChunks: Array<{ chunkData: { start: number }, chunkSize: number }> = [];
            let subIndex = listChunk.start;

            while (subIndex < listChunk.start + listChunk.size - 8) {
                const framChunk = this.findChunk(buffer, "fram", subIndex);
                if (!framChunk) break;

                subChunks.push({
                    chunkData: { start: framChunk.start },
                    chunkSize: framChunk.size
                });

                subIndex = framChunk.start + framChunk.size;
            }

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
     * 调整图标大小
     * @param blobUrl 图标Blob URL
     * @param newWidth 新宽度
     * @param newHeight 新高度
     * @returns 调整大小后的图标URL Promise
     */
    private resizeIco = (
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
            img.src = blobUrl;
        });
    };

    /**
     * 解析ANI缓冲区数据
     * @param arrayBuffer ANI文件的ArrayBuffer
     * @param width 光标宽度
     * @param height 光标高度
     * @returns 解析后的ANI信息Promise
     */
    public async parseANIBuffer(
        arrayBuffer: ArrayBuffer,
        width: number = 32,
        height: number = 32
    ): Promise<ANIInfo> {
        const buffer = new Uint8Array(arrayBuffer);
        const view = new DataView(arrayBuffer);

        // 查找并解析anih块（ANI头信息）
        const anihChunk = this.findChunk(buffer, "anih");
        if (!anihChunk) {
            throw new Error("Invalid ANI file: anih chunk not found");
        }

        // 读取ANI头信息
        const startIndex = anihChunk.start;
        const frameNum = view.getUint32(startIndex + 1 * 4, true);
        const cursorPlayOrderNum = view.getUint32(startIndex + 2 * 4, true);
        const frameDurationInHead = view.getUint32(startIndex + 7 * 4, true);

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
                    this.resizeIco(icourl, width, height).then((resizedUrl) => ({
                        index: frameCounter,
                        url: resizedUrl,
                    }))
                );
                frameCounter++;
            }
            if (frameCounter >= cursorPlayOrderNum) break;
        }

        // 等待所有图标调整大小完成
        const results = await Promise.all(ResizeIconGroup);
        results.forEach((result) => {
            frameURLs[result.index] = result.url;
        });

        let totalRoundTime = 0;
        frameInfo.forEach((frame) => {
            totalRoundTime += frame.framDuration;
        });

        // 生成关键帧动画名称
        const aniURLRegexClassName = "cursor-animation-export";
        const keyframesName = `${aniURLRegexClassName}-keyframes`;

        // 生成关键帧CSS内容
        let KeyFrameContent = "@keyframes " + keyframesName + " { ";
        let pos = 0;

        frameInfo.forEach((frame) => {
            KeyFrameContent += `${pos}% { cursor: url(${frameURLs[frame.frameIndex]}), auto;}\n`;
            pos += (frame.framDuration / totalRoundTime) * 100;
        });

        KeyFrameContent += " }";

        return {
            KeyFrameContent,
            aniURLRegexClassName,
            keyframesName,
            totalRoundTime,
            frameImages: frameURLs,
            frameInfo
        };
    }

    /**
     * 生成导出HTML内容
     * @param aniInfo ANI信息对象
     * @returns HTML内容字符串
     */
    public generateExportHTML(aniInfo: ANIInfo): string {
        const { frameImages, frameInfo, KeyFrameContent, keyframesName, totalRoundTime } = aniInfo;

        // 生成帧图片展示部分
        let frameImagesHTML = "";
        frameImages.forEach((imageUrl, index) => {
            frameImagesHTML += `
                <div class="frame-container">
                    <h3>Frame ${index}</h3>
                    <img src="${imageUrl}" alt="Frame ${index}" class="frame-image" />
                    <p>Duration: ${frameInfo[index].framDuration}ms</p>
                </div>`;
        });

        // 生成参数信息部分
        let parametersInfo = "";
        frameInfo.forEach((frame, index) => {
            parametersInfo += `
                <tr>
                    <td>${index}</td>
                    <td>${frame.frameIndex}</td>
                    <td>${frame.framDuration}ms</td>
                </tr>`;
        });

        // 生成完整的HTML内容
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ANI Cursor Export</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1, h2 {
            color: #333;
        }
        .parameters-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .parameters-table th,
        .parameters-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .parameters-table th {
            background-color: #f2f2f2;
        }
        .frame-container {
            display: inline-block;
            margin: 10px;
            text-align: center;
            vertical-align: top;
            background-color: #f9f9f9;
            padding: 10px;
            border-radius: 4px;
        }
        .frame-image {
            width: 64px;
            height: 64px;
            object-fit: contain;
            background: linear-gradient(45deg, #ccc 25%, transparent 25%), 
                        linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                        linear-gradient(45deg, transparent 75%, #ccc 75%), 
                        linear-gradient(-45deg, transparent 75%, #ccc 75%);
            background-size: 10px 10px;
            background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
        }
        .animation-preview {
            width: 100px;
            height: 100px;
            margin: 20px 0;
            border: 1px solid #ccc;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f0f0f0;
        }
        .keyframes-code {
            background-color: #f8f8f8;
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            margin: 20px 0;
        }
        .export-info {
            background-color: #e8f4f8;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>ANI Cursor Export</h1>
        
        <div class="export-info">
            <h2>导出信息</h2>
            <p><strong>总帧数:</strong> ${frameImages.length}</p>
            <p><strong>总时长:</strong> ${totalRoundTime}ms</p>
            <p><strong>动画名称:</strong> ${keyframesName}</p>
        </div>

        <h2>动画参数</h2>
        <table class="parameters-table">
            <thead>
                <tr>
                    <th>帧序号</th>
                    <th>帧索引</th>
                    <th>持续时间</th>
                </tr>
            </thead>
            <tbody>
                ${parametersInfo}
            </tbody>
        </table>

        <h2>关键帧动画CSS</h2>
        <div class="keyframes-code">${KeyFrameContent}</div>

        <h2>动画预览</h2>
        <div class="animation-preview" style="animation: ${keyframesName} ${totalRoundTime}ms step-end infinite;">
            鼠标动画预览
        </div>

        <h2>帧图片</h2>
        <div class="frames-container">
            ${frameImagesHTML}
        </div>
    </div>
</body>
</html>`;

        return htmlContent;
    }

    /**
     * 导出ANI信息为HTML文件
     * @param arrayBuffer ANI文件的ArrayBuffer
     * @param filename 导出的文件名
     * @param width 光标宽度
     * @param height 光标高度
     */
    public async exportToHTML(
        arrayBuffer: ArrayBuffer,
        filename: string = "ani-export.html",
        width: number = 32,
        height: number = 32
    ): Promise<void> {
        try {
            // 解析ANI数据
            const aniInfo = await this.parseANIBuffer(arrayBuffer, width, height);
            
            // 生成HTML内容
            const htmlContent = this.generateExportHTML(aniInfo);
            
            // 创建并下载文件
            const blob = new Blob([htmlContent], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            
            // 清理
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
        } catch (error) {
            console.error("导出ANI文件时出错:", error);
            throw error;
        }
    }
}

// 创建实例并导出
const aniExportTool = new ANIExportTool();

export default aniExportTool;

/**
 * 解析ANI缓冲区并生成导出信息
 */
export const parseANIBuffer = aniExportTool.parseANIBuffer.bind(aniExportTool);

/**
 * 生成导出HTML内容
 */
export const generateExportHTML = aniExportTool.generateExportHTML.bind(aniExportTool);

/**
 * 导出ANI为HTML文件
 */
export const exportToHTML = aniExportTool.exportToHTML.bind(aniExportTool);