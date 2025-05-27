<template>
  <Drawer ref="DrawerRef" title="图片上传" :footerHidden="true" size="600">
    <template #content>
      <div class="upload-container">
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
          </div>
        </div>
        <el-row :gutter="10">
          <AmapContainer
            v-if="addressShow"
            :lnglat="[coords.longitude, coords.latitude]"
          />
        </el-row>

        <!-- 操作按钮 -->
        <button @click="uploadImages" :disabled="!previews.length || loading">
          {{ loading ? "处理中..." : "上传所有图片" }}
        </button>

        <!-- 错误提示 -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
      </div>
    </template>
  </Drawer>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import Drawer from "@/components/Drawer/Index.vue";
import AmapContainer from "../../components/AmapContainer.vue";
import mittBus from "@/utils/mittBus";
import { formatFileSize } from "@/utils/files";
import ExifReader from "exifreader";
const DrawerRef = ref();
/** 打开主题配置 */
const handleUploadConfig = () => {
  nextTick(() => {
    DrawerRef.value.Open();
  });
};

/** 打开主题配置对话框，on 接收事件 */
mittBus.on("handleUploadConfig", () => {
  handleUploadConfig();
});

interface ImagePreview {
  url: string;
  file: File;
  size: string;
  style: number;
}

const previews = ref<ImagePreview[]>([]);
const loading = ref(false);
const addressShow = ref(false);
const errorMessage = ref("");

const handleFileUpload = async (event: Event) => {
  addressShow.value = false;
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  loading.value = true;
  errorMessage.value = "";
  previews.value = [];

  try {
    // 验证图片类型
    if (!file.type.startsWith("image/")) {
      throw new Error("请选择有效的图片文件");
    }

    // 处理原始图片
    const originalImage = await createImage(file);
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {};
    previews.value.push({
      url: URL.createObjectURL(file),
      file: file,
      size: img.width + "x" + img.height + "",
      style: 60,
    });

    // 生成缩略图
    const [resized400, resized200] = await Promise.all([
      resizeImage(originalImage, 400),
      resizeImage(originalImage, 200),
    ]);

    // 转换为文件对象
    const file400 = dataURLtoFile(resized400, file.name, "400");
    const file200 = dataURLtoFile(resized200, file.name, "200");

    previews.value.push(
      {
        url: resized400,
        file: file400,
        size: "400px 宽度",
        style: 40,
      },

      {
        url: resized200,
        file: file200,
        size: "200px 宽度",
        style: 20,
      }
    );
    handleFileExifReader(file);
    console.log(previews.value);
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

const resizeImage = (img: HTMLImageElement, maxWidth: number): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;

    // 计算缩放比例
    const scale = maxWidth / img.width;
    const width = maxWidth;
    const height = img.height * scale;

    canvas.width = width;
    canvas.height = height;

    // 高质量缩放配置
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, width, height);

    // 生成Data URL（默认JPEG格式，质量0.8）
    const dataURL = canvas.toDataURL("image/jpeg", 0.8);
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
    console.log("coords", coords.value);
    console.log("metadata", metadata.value);
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
const dataURLtoFile = (dataUrl: string, originalName: string, suffix: string): File => {
  // 健壮的Data URL解析
  const matches = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("无效的图片数据");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const byteString = atob(base64Data);

  // 处理文件名
  const ext = mimeType.split("/")[1] || "jpg";
  const cleanName = originalName.replace(/\.[^/.]+$/, "");
  const fileName = `${cleanName}_${suffix}.${ext}`;

  // 转换ArrayBuffer
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    uintArray[i] = byteString.charCodeAt(i);
  }

  return new File([arrayBuffer], fileName, { type: mimeType });
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
.upload-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  position: relative;
}

input[type="file"] {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.preview-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
}

.preview-item {
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  text-align: center;
  background: #f9f9f9;
}

.preview-item img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

button {
  padding: 0.8rem 1.5rem;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
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
