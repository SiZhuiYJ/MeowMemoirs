<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useScreenStore } from "@/utils/screen";
// 获取当前为[移动端、IPad、PC端]仓库，阔以使用 watchEffect(() => {}) 进行监听。
const { isMobile } = useScreenStore();
// 定义粒子设置
const settings = {
  particles: {
    length: 500, // 最大粒子数
    duration: 2, // 粒子持续时间(秒)
    velocity: 100, // 粒子速度(像素/秒)
    effect: -0.75, // 物理效果参数
    size: 30, // 粒子大小(像素)
    scale: 1.5, // 缩放比例
  },
};

// 定义Point类
class Point {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = x !== undefined ? x : 0;
    this.y = y !== undefined ? y : 0;
  }

  clone() {
    return new Point(this.x, this.y);
  }

  length(): number;
  length(length: number): Point;
  length(length?: number): number | Point {
    if (typeof length === "undefined") {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    this.normalize();
    this.x *= length;
    this.y *= length;
    return this;
  }

  normalize() {
    const length = this.length();
    if (length === 0) return this;
    this.x /= length;
    this.y /= length;
    return this;
  }
}

// 定义Particle类
class Particle {
  position: Point;
  velocity: Point;
  acceleration: Point;
  age: number;

  constructor() {
    this.position = new Point();
    this.velocity = new Point();
    this.acceleration = new Point();
    this.age = 0;
  }

  initialize(x: number, y: number, dx: number, dy: number) {
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = dx;
    this.velocity.y = dy;
    this.acceleration.x = dx * settings.particles.effect;
    this.acceleration.y = dy * settings.particles.effect;
    this.age = 0;
  }

  update(deltaTime: number) {
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    this.velocity.x += this.acceleration.x * deltaTime;
    this.velocity.y += this.acceleration.y * deltaTime;
    this.age += deltaTime;
  }

  draw(context: CanvasRenderingContext2D, image: HTMLImageElement) {
    const ease = (t: number) => --t * t * t + 1;
    const size = image.width * ease(this.age / settings.particles.duration);
    context.globalAlpha = 1 - this.age / settings.particles.duration;
    context.drawImage(
      image,
      this.position.x - size / 2,
      this.position.y - size / 2,
      size,
      size
    );
  }
}

// 定义ParticlePool类
class ParticlePool {
  private particles: Particle[];
  private firstActive: number;
  private firstFree: number;
  private duration: number;

  constructor(length: number) {
    this.particles = new Array(length);
    for (let i = 0; i < length; i++) {
      this.particles[i] = new Particle();
    }
    this.firstActive = 0;
    this.firstFree = 0;
    this.duration = settings.particles.duration;
  }

  add(x: number, y: number, dx: number, dy: number) {
    this.particles[this.firstFree].initialize(x, y, dx, dy);
    this.firstFree++;
    if (this.firstFree === this.particles.length) this.firstFree = 0;
    if (this.firstActive === this.firstFree) this.firstActive++;
    if (this.firstActive === this.particles.length) this.firstActive = 0;
  }

  update(deltaTime: number) {
    if (this.firstActive < this.firstFree) {
      for (let i = this.firstActive; i < this.firstFree; i++) {
        this.particles[i].update(deltaTime);
      }
    }
    if (this.firstFree < this.firstActive) {
      for (let i = this.firstActive; i < this.particles.length; i++) {
        this.particles[i].update(deltaTime);
      }
      for (let i = 0; i < this.firstFree; i++) {
        this.particles[i].update(deltaTime);
      }
    }

    while (
      this.particles[this.firstActive].age >= this.duration &&
      this.firstActive !== this.firstFree
    ) {
      this.firstActive++;
      if (this.firstActive === this.particles.length) this.firstActive = 0;
    }
  }

  draw(context: CanvasRenderingContext2D, image: HTMLImageElement) {
    if (this.firstActive < this.firstFree) {
      for (let i = this.firstActive; i < this.firstFree; i++) {
        this.particles[i].draw(context, image);
      }
    }
    if (this.firstFree < this.firstActive) {
      for (let i = this.firstActive; i < this.particles.length; i++) {
        this.particles[i].draw(context, image);
      }
      for (let i = 0; i < this.firstFree; i++) {
        this.particles[i].draw(context, image);
      }
    }
  }
}

// Vue组件逻辑
const pinkboard = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number;
let resizeObserver: ResizeObserver | null = null;

// 在canvas上渲染动画
const initAnimation = (canvas: HTMLCanvasElement) => {
  const context = canvas.getContext("2d");
  if (!context) return;

  const particles = new ParticlePool(settings.particles.length);
  const particleRate = settings.particles.length / settings.particles.duration;
  let time: number | undefined;

  // 心形曲线函数
  const pointOnHeart = (t: number): Point => {
    return new Point(
      160 * Math.pow(Math.sin(t), 3),
      130 * Math.cos(t) -
        50 * Math.cos(2 * t) -
        20 * Math.cos(3 * t) -
        10 * Math.cos(4 * t) +
        25
    );
  };

  // 创建粒子图像
  const createParticleImage = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return new Image();

    canvas.width = settings.particles.size;
    canvas.height = settings.particles.size;

    const to = (t: number): Point => {
      const point = pointOnHeart(t);
      point.x = settings.particles.size / 2 + (point.x * settings.particles.size) / 350;
      point.y = settings.particles.size / 2 - (point.y * settings.particles.size) / 350;
      return point;
    };

    context.beginPath();
    let t = -Math.PI;
    let point = to(t);
    context.moveTo(point.x, point.y);

    while (t < Math.PI) {
      t += 0.01;
      point = to(t);
      context.lineTo(point.x, point.y);
    }

    context.closePath();
    context.fillStyle = "#ea80b0";
    context.fill();

    const image = new Image();
    image.src = canvas.toDataURL();
    return image;
  };

  const particleImage = createParticleImage();

  // 渲染函数
  const render = () => {
    if (!canvas || !context) return;

    animationFrameId = requestAnimationFrame(render);

    const newTime = Date.now() / 1000;
    const deltaTime = newTime - (time || newTime);
    time = newTime;

    context.clearRect(0, 0, canvas.width, canvas.height);

    // 创建新粒子
    const amount = particleRate * deltaTime;
    for (let i = 0; i < amount; i++) {
      const pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
      const dir = pos.clone().length(settings.particles.velocity) as Point;
      particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
    }

    // 更新并绘制粒子
    particles.update(deltaTime);
    particles.draw(context, particleImage);
  };

  // 调整canvas大小
  const onResize = () => {
    if (!canvas) return;
    const scale = Math.max(0.1, settings.particles.scale || 1); // 确保scale有合理最小值
    canvas.width = !isMobile.value
      ? Math.max(1, canvas.clientWidth) / scale
      : Math.max(1, canvas.clientWidth) * scale;
    canvas.height = !isMobile.value
      ? Math.max(1, canvas.clientHeight) / scale
      : Math.max(1, canvas.clientHeight) * scale;
  };

  // 使用ResizeObserver监听尺寸变化
  resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvas);

  // 初始化渲染
  setTimeout(() => {
    onResize();
    render();
  }, 10);

  return () => {
    cancelAnimationFrame(animationFrameId);
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  };
};

onMounted(() => {
  if (pinkboard.value) {
    initAnimation(pinkboard.value);
  }
});

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<template>
  <div class="love-container">
    <canvas ref="pinkboard" class="pinkboard"></canvas>
  </div>
</template>

<style scoped lang="scss">
.love-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.pinkboard {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
