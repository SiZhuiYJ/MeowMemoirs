// src/directives/progressive.ts
import type { Directive, DirectiveBinding } from "vue";
// import { getCurrentInstance } from "vue";

interface ProgressiveImageBinding extends DirectiveBinding {
  value: string; // 小图（预览图）URL
  modifiers: {
    lazy?: boolean; // 使用 v-progressive.lazy 启用懒加载
  };
}

const ProgressiveDirective: Directive = {
  mounted(el: HTMLImageElement, binding: ProgressiveImageBinding) {
    const { value: previewUrl, modifiers } = binding;
    const mainUrl = el.src;

    // 如果已经是预览图，不需要处理
    if (el.src === previewUrl) return;

    // 先设置src为预览图
    el.src = previewUrl;
    el.classList.add("progressive-preview");

    if (modifiers.lazy) {
      setupLazyLoad(el, mainUrl);
    } else {
      loadMainImage(el, mainUrl);
    }
  },
};

/**
 * 加载主图并应用过渡效果
 */
function loadMainImage(el: HTMLImageElement, mainUrl: string) {
  const img = new Image();
  img.src = mainUrl;

  img.onload = () => {
    // 添加淡入效果
    el.classList.add("progressive-fade");
    el.src = mainUrl;

    // 图片加载完成后移除预览类
    el.addEventListener(
      "transitionend",
      () => {
        el.classList.remove("progressive-preview", "progressive-fade");
      },
      { once: true }
    );
  };

  img.onerror = () => {
    console.error(`Failed to load image: ${mainUrl}`);
    el.classList.remove("progressive-preview");
  };
}

/**
 * 设置IntersectionObserver实现懒加载
 */
function setupLazyLoad(el: HTMLImageElement, mainUrl: string) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // 当元素进入视口时加载主图
        if (entry.isIntersecting) {
          loadMainImage(el, mainUrl);
          observer.unobserve(el); // 加载后停止观察
        }
      });
    },
    {
      rootMargin: "100px", // 提前100px加载
      threshold: 0.01, // 只要有1%可见就触发
    }
  );

  observer.observe(el);

  // 组件卸载时清除观察者
  //   const vm = getCurrentInstance();
  //   vm?.proxy?.$on("hook:unmounted", () => {
  //     observer.unobserve(el);
  //   });
}

export default ProgressiveDirective;
