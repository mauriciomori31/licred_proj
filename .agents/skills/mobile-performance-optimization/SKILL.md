---
name: mobile-performance-optimization
description: "Skills for optimizing React/WebGL applications for mobile devices to prevent freezing and performance issues"
risk: low
source: community
date_added: "2026-03-27"
---

# Mobile Performance Optimization

Prevent freezing and performance issues in mobile browsers by optimizing animations, effects, and resource-intensive components.

## 📱 Problem Diagnosis

Common mobile performance issues:
- Continuous requestAnimationFrame loops consuming battery/CPU
- WebGL/Canvas animations running at full speed on mobile
- Heavy computations blocking the main thread
- Lack of visibility awareness (animating in background tabs)

## 🔧 Solution Patterns

### 1. Visibility-Aware Animations

```javascript
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const handleVisibilityChange = () => {
    setIsVisible(!document.hidden);
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  setIsVisible(!document.hidden);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);

// In animation loop:
const update = (t) => {
  if (isVisible) {
    animateIdRef.current = requestAnimationFrame(update);
    // ... animation logic
  }
};
```

### 2. Mobile-Specific Frame Rate Reduction

```javascript
const [isMobile, setIsMobile] = useState(false);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
  };
  checkMobile();
  window.addEventListener('resize', checkMobile);
  return () => window.removeEventListener('resize', checkMobile);
}, []);

// In animation loop:
const update = (t) => {
  // Reduce frame rate on mobile to save battery
  const delay = isMobile ? 2 : 1; // Half frame rate on mobile
  if (Math.floor(t / 16) % delay === 0) { // ~60fps desktop, ~30fps mobile
    animateIdRef.current = requestAnimationFrame(update);
    // ... animation logic
  }
};
```

### 3. Progressive Enhancement for Effects

```javascript
// Check if device can handle the effect
const canUseWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!window.WebGLRenderingContext && 
           (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch (e) {
    return false;
  }
};

// Fallback to lighter effect
const AuroraFallback = () => (
  <div className="bg-gradient-to-br from-primary/10 to-accent/10">
    {/* Lighter fallback content */}
  </div>
);

// Usage:
{canUseWebGL() ? <Aurora {...props} /> : <AuroraFallback />}
```

### 4. Debounce Resize and Scroll Events

```javascript
// Use requestAnimationFrame for resize handlers
let resizeRequestId = null;
const handleResize = () => {
  cancelAnimationFrame(resizeRequestId);
  resizeRequestId = requestAnimationFrame(() => {
    // Actual resize logic
  });
};
window.addEventListener('resize', handleResize);
```

## 📋 Implementation Checklist

When implementing mobile-heavy components:

- [ ] Add visibility detection (`document.hidden`)
- [ ] Implement mobile frame rate reduction
- [ ] Provide lighter fallbacks for low-end devices
- [ ] Debounce resize/scroll events with requestAnimationFrame
- [ ] Test on real mobile devices or emulators
- [ ] Monitor performance with Lighthouse Mobile profile

## 📊 Performance Metrics to Monitor

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint (Mobile) | < 1.8s | Lighthouse |
| Time to Interactive (Mobile) | < 3.5s | Lighthouse |
| Total Blocking Time (Mobile) | < 150ms | Lighthouse |
| Animation Frame Rate | Consistent 30fps+ | DevTools Performance |
| Battery Impact | Minimal | Battery API (if available) |

## 🛠️ Utilities

Helper functions for mobile optimization:

```javascript
// Mobile detection utility
export const isMobileDevice = () => 
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Visibility hook
export const useVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);
  
  useEffect(() => {
    const handleChange = () => setIsVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleChange);
    return () => document.removeEventListener('visibilitychange', handleChange);
  }, []);
  
  return isVisible;
};

// Animation frame rate controller
export const useAnimationFrame = (callback, options = {}) => {
  const { mobileFrameRate = 2 } = options; // Default to half rate on mobile
  const isMobile = isMobileDevice();
  const frameDelay = isMobile ? mobileFrameRate : 1;
  let lastFrameTime = 0;
  
  const animate = (timestamp) => {
    if (timestamp - lastFrameTime >= (16 * frameDelay)) { // 16ms = ~60fps base
      lastFrameTime = timestamp;
      callback(timestamp);
    }
    requestAnimationFrame(animate);
  };
  
  return () => requestAnimationFrame(animate);
};
```

## 📱 Testing Recommendations

1. **Device Testing**: Test on real Android/iOS devices
2. **Emulation**: Use Chrome DevTools mobile emulation
3. **Network Throttling**: Test on 3G/4G simulated connections
4. **Performance Profiling**: Use React Profiler + Chrome Performance tab
5. **Battery Impact**: Monitor battery drain during extended usage

## 🔄 When to Apply This Skill

Apply this skill when:
- Using requestAnimationFrame for continuous animations
- Implementing WebGL/Canvas effects
- Building interactive mobile-first experiences
- Creating background animations or particle effects
- Developing with Three.js, OGL, or similar WebGL libraries

> **Remember**: The most performant animation is the one that doesn't run when not needed. Always optimize for mobile first!