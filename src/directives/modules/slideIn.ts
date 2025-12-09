// directives/videoObserver.ts
import type { Directive } from "vue";
const OFFSET = 100;
const DURATION = 500;

const map = new WeakMap();

const ob = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const animation = map.get(entry.target);
      if (animation) {
        animation.play(); // 播放动画
        ob.unobserve(entry.target); // 停止监听元素
      }
    }
  });
});

function beLowViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top > window.innerHeight; // 检查元素是否在视口下方
}

const slideIn: Directive = {
  mounted(el: HTMLElement) {
    if (!beLowViewport(el)) return; // 如果元素不在视口下方，则不执行动画
    const animation = el.animate(
      [
        { transform: `translateY(${OFFSET}px)`, opacity: 0.5 },
        { transform: `translateY(0)`, opacity: 1 },
      ],
      { duration: DURATION, easing: "ease-out", fill: "forwards" }
    );
    animation.pause();
    ob.observe(el); // 监听元素进入视口
    map.set(el, animation); // 将动画实例存储在 WeakMap 中
  },
  unmounted(el: HTMLElement) {
    ob.unobserve(el); // 停止监听元素
  },
};

export default slideIn;
