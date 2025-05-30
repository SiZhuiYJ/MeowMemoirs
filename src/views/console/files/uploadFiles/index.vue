<template>
  <div class="main-content">
    <Card>
      <input type="file" accept="image/*" @change="handleFileUpload" />

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
        图片处理中...
      </div>

      <!-- 预览区域 -->
      <div v-if="previews.length" class="preview-container">
        <div v-for="(preview, index) in previews" :key="index" class="preview-item">
          <img :src="preview.url" :alt="`Preview ${preview.size}`" />
          <p>{{ preview.size }} ({{ formatFileSize(preview.file.size) }})</p>
          <p>{{ preview.format }}</p>
        </div>
      </div>
      <el-row :gutter="10">
        <AmapContainer v-if="addressShow" :lnglat="[coords.longitude, coords.latitude]" />
      </el-row>

      <!-- 操作按钮 -->
      <button @click="uploadImages" :disabled="!previews.length || loading">
        {{ loading ? "处理中..." : "上传所有图片" }}
      </button>

      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AmapContainer from "../components/AmapContainer.vue";
import { formatFileSize } from "@/utils/files";
import ExifReader from "exifreader";

interface ImagePreview {
  url: string;
  file: File;
  size: string;
  style: number;
  format: string;
}

const previews = ref<ImagePreview[]>([]);
const loading = ref(false);
const addressShow = ref(false);
const errorMessage = ref("");

const handleFileUpload = async (event: Event) => {
  addressShow.value = false;
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  console.log(file?.size);

  if (!file) return;

  loading.value = true;
  errorMessage.value = "";
  previews.value = [];

  try {
    // 验证图片类型
    if (!file.type.startsWith("image/")) {
      throw new Error("请选择有效的图片文件");
    }

    // 处理原始图片 - 无损压缩为WebP
    const originalImage = await createImage(file);

    // 1. 原始文件 (保留原始格式)
    previews.value.push({
      url: URL.createObjectURL(file),
      file: file,
      size: originalImage.width + "x" + originalImage.height,
      style: 60,
      format: `原始格式 (${file.type.split("/")[1] || "image"})`,
    });

    // 2. 无损压缩的WebP (原始尺寸)
    const originalWebP = await convertToWebp(originalImage, {
      quality: 100, // 无损质量
      maxWidth: originalImage.width,
      maxHeight: originalImage.height,
    });
    const originalWebPFile = dataURLtoFile(
      originalWebP,
      file.name,
      "original_webp",
      "webp"
    );
    previews.value.push({
      url: originalWebP,
      file: originalWebPFile,
      size: originalImage.width + "x" + originalImage.height,
      style: 60,
      format: "WebP (无损)",
    });

    // 3. 400px宽度的WebP
    const resized400 = await convertToWebp(originalImage, {
      quality: 90,
      maxWidth: 400,
    });
    const file400 = dataURLtoFile(resized400, file.name, "400", "webp");
    previews.value.push({
      url: resized400,
      file: file400,
      size: "400px 宽度",
      style: 40,
      format: "WebP (400px)",
    });

    // 4. 200px宽度的WebP
    const resized200 = await convertToWebp(originalImage, {
      quality: 85,
      maxWidth: 200,
    });
    const file200 = dataURLtoFile(resized200, file.name, "200", "webp");
    previews.value.push({
      url: resized200,
      file: file200,
      size: "200px 宽度",
      style: 20,
      format: "WebP (200px)",
    });

    // 处理EXIF信息
    handleFileExifReader(file);
  } catch (error) {
    console.error("图片处理失败:", error);
    errorMessage.value = error instanceof Error ? error.message : "图片处理失败";
  } finally {
    loading.value = false;
  }
};

const createImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => resolve(img);
    img.onerror = (e) => {
      URL.revokeObjectURL(img.src);
      reject(new Error("图片加载失败" + e.toString()));
    };
  });
};

// WebP转换函数
const convertToWebp = (
  img: HTMLImageElement,
  options: {
    quality?: number;
    maxWidth?: number;
    maxHeight?: number;
  } = {}
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // 计算缩放后的尺寸
    let width = img.width;
    let height = img.height;

    if (options.maxWidth && width > options.maxWidth) {
      const scale = options.maxWidth / width;
      width = options.maxWidth;
      height = height * scale;
    }

    if (options.maxHeight && height > options.maxHeight) {
      const scale = options.maxHeight / height;
      height = options.maxHeight;
      width = width * scale;
    }

    canvas.width = width;
    canvas.height = height;

    // 高质量缩放配置
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);

    // 生成WebP格式的图片 (质量参数可选)
    const quality = options.quality ?? 0.8;
    const dataURL = canvas.toDataURL("image/webp", quality);
    resolve(dataURL);
  });
};

interface GPSData {
  longitude?: number;
  latitude?: number;
}

const metadata = ref<Record<string, any>>();
const coords = ref<GPSData>({ longitude: 104.740034, latitude: 31.46157 });
const name = ref("");

// 获取图片的EXIF信息
const handleFileExifReader = async (file: File) => {
  name.value = file.name;
  try {
    const tags = await ExifReader.load(file);
    metadata.value = tags;

    if (tags.GPSLongitude && tags.GPSLatitude) {
      coords.value = {
        longitude: convertGPSCoordinates(tags.GPSLongitude.value as number[][]),
        latitude: convertGPSCoordinates(tags.GPSLatitude.value as number[][]),
      };
    }
    loading.value = false;
    addressShow.value = true;
  } catch (error) {
    console.error("Error reading EXIF:", error);
    coords.value = {};
  }
};

const convertGPSCoordinates = (gpsArray: number[][]): number => {
  return gpsArray[0][0] + gpsArray[1][0] / 60 + gpsArray[2][0] / 1000000 / 3600;
};

// 修改后的文件转换函数，支持指定格式
const dataURLtoFile = (
  dataUrl: string,
  originalName: string,
  suffix: string,
  format: string = "webp"
): File => {
  // 健壮的Data URL解析
  const matches = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("无效的图片数据");
  }

  // const mimeType = matches[1];
  const base64Data = matches[2];
  const byteString = atob(base64Data);

  // 处理文件名
  const cleanName = originalName.replace(/\.[^/.]+$/, "");
  const fileName = `${cleanName}_${suffix}.${format}`;

  // 转换ArrayBuffer
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  return new File([arrayBuffer], fileName, { type: `image/${format}` });
};

const uploadImages = async () => {
  if (!previews.value.length) return;

  const formData = new FormData();
  previews.value.forEach((preview) => {
    formData.append("images", preview.file);
  });

  try {
    loading.value = true;
    const response = await fetch("https://your-api-endpoint.com/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`上传失败: ${response.statusText}`);
    }

    console.log("上传成功");
    previews.value = [];
    errorMessage.value = "";
  } catch (error) {
    console.error("上传错误:", error);
    errorMessage.value = error instanceof Error ? error.message : "上传失败";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
input[type="file"] {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 改为4列显示 */
  gap: 1rem;
  margin: 1.5rem 0;
  height: 300px;
}

.preview-item {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  text-align: center;
  background: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.preview-item img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  flex-grow: 1;
}

.preview-item p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
}

button {
  padding: 0.8rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #42b983;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #ff4444;
  margin-top: 1rem;
  padding: 0.5rem;
  background: #ffecec;
  border-radius: 4px;
}
</style>
