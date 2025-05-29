<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display/cubism4';

// 全局暴露PIXI（某些插件需要）
window.PIXI = PIXI;

const liveCanvas = ref(null);
const isModelLoaded = ref(false);
const expressionNames = ref([]);
const showControls = ref(false);


let app;
let model;
let blinkInterval;

// 修正模型路径（根据您的实际目录结构）
const modelUrl = '/live2d_models/Firefly/Firefly.model3.json';


// 表情参数映射（根据您的模型调整）
const expressionParams = {
  '墨镜': { Param: 1.0, ParamEyeLOpen: 1.0 },    // 墨镜
  '猫耳': { Param40: 1.0, ParamEyeLOpen: 1.0 },  // 猫耳
  '裂开': { Param2: 1.0,  ParamMouthForm: -1.0, ParamMouthOpenY: 1.0, ParamBrowLY: -1.0, ParamBrowRY: -1.0},    // 裂开
  '鄙夷': { Param3: 1.5 , ParamEyeLOpen: 0.6, ParamEyeROpen: 0.6, ParamBrowLForm: -1.0, ParamBrowRForm: 0.5, ParamMouthForm: -0.5, ParamAngleZ: -10.0}, // 鄙夷
  '生气': { Param4: 1.0 , ParamEyeLOpen: 1.0, ParamEyeROpen: 1.0, ParamBrowLY: -1.0, ParamBrowRY: -1.0, ParamBrowLForm: -1.0, ParamBrowRForm: -1.0, ParamMouthForm: -0.8}, // 生气
  '问号': { Param5: 1.0 , ParamEyeLOpen: 1.0, ParamEyeROpen: 1.0, ParamMouthForm: 0.5, ParamAngleZ: 10.0}, // 问号
  '眼泪': { Param8: 6.0 , ParamEyeLOpen: 0.8, ParamEyeROpen: 0.8, ParamMouthForm: -0.7, ParamMouthOpenY: 0.5, ParamBrowLY: 0.8, ParamBrowRY: 0.8}, // 眼泪
  '流汗': { Param9: 1.0 , ParamEyeLOpen: 0.8, ParamEyeROpen: 0.8, ParamMouthForm: 0.1, ParamAngleY: 8.0}, // 流汗
  '呆愣': { Param10: 1.0 , ParamMouthForm: 0.0, ParamMouthOpenY: 0.3, ParamAngleX: -5.0, ParamAngleZ: 5.0},   // 呆愣
  '开心': { Param11: 1.0 , ParamEyeLOpen: 1.0, ParamEyeROpen: 1.0, ParamEyeLSmile: 1.0, ParamEyeRSmile: 1.0, ParamMouthForm: 1.0, ParamMouthOpenY: 0.4, ParamBrowLY: 0.5, ParamBrowRY: 0.5}, // 开心
};

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


// 初始化PIXI应用
function initPIXI() {
  return new PIXI.Application({
    view: liveCanvas.value,
    width: 250,       // 根据您的布局调整
    height: 350,      // 根据您的布局调整
    transparent: true,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundAlpha: 0
  });
}

// 修复路径加载问题
async function loadModelWithRetry() {
  try {
    // 尝试直接加载
    return await Live2DModel.from(modelUrl);
  } catch (error) {
    console.warn('直接加载失败，尝试绝对路径:', error);
    // 尝试绝对路径
    const absoluteUrl = new URL(modelUrl, window.location.href).href;
    return await Live2DModel.from(absoluteUrl);
  }
}

// 加载Live2D模型（关键修复）
async function loadModel() {
  try {
    model = await loadModelWithRetry();

    app.stage.addChild(model);

    // 精确调整模型位置（根据您的需求）
    model.scale.set(0.06);
    model.anchor.set(0.5, 1.6);       // 锚点设为底部中心
    model.position.set(
        app.screen.width / 2,         // 水平居中
        app.screen.height      // 垂直位置（确保在视窗内）
    );


    return model;

  } catch (error) {
    console.error('模型加载失败:', error);
    throw error;
  }
}



// 从模型配置中提取表情名称
async function loadExpressions() {
  try {
    const response = await fetch(modelUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const modelSetting = await response.json();
    const names = [];

    // 从Motions中提取表情
    const motions = modelSetting.FileReferences?.Motions || {};
    for (const group in motions) {
      motions[group].forEach(motion => {
        if (motion.Expression) {
          const name = motion.Expression.replace(/\.exp3$/, '');
          if (!names.includes(name)) names.push(name);
        }
      });
    }

    expressionNames.value = Object.keys(expressionParams);


    console.log('加载表情完成:', names);
  } catch (error) {
    console.error('加载表情配置失败:', error);
    // 使用默认表情作为后备
    expressionNames.value = ['expression1', 'expression2', 'expression3'];
  }
}

// 应用表情
function applyExpression(name) {
  if (!model) return;

  // 优先尝试模型原生的 expression 方法
  try {
    if (typeof model.expression === 'function') {
      model.expression(name);
    }
  } catch (e) {
    console.warn('expression 方法失败:', e);
  }

  // 方法2：参数控制
  const params = expressionParams[name];
  if (params) {
    for (const [paramId, value] of Object.entries(params)) {
      model.internalModel.coreModel.setParameterValueById(paramId, value);
    }
    model.internalModel.coreModel.update();
    app.renderer.render(app.stage);
  } else {
    console.warn(`未找到参数配置: ${name}`);
  }

}

// 回正表情
function resetExpression() {
  if (!model) return;

  const coreModel = model.internalModel.coreModel;

  const resetParams = {
    ParamEyeLOpen: 1.0,
    ParamEyeROpen: 1.0,
    ParamMouthForm: 0.0,
    ParamMouthOpenY: 0.0,
    ParamBrowLY: 0.0,
    ParamBrowRY: 0.0,
    ParamBrowLForm: 0.0,
    ParamBrowRForm: 0.0,
    ParamEyeLSmile: 0.0,
    ParamEyeRSmile: 0.0,
    ParamAngleX: 0.0,
    ParamAngleY: 0.0,
    ParamAngleZ: 0.0,
    ParamBodyAngleX: 0.0,
    ParamBodyAngleY: 0.0,
    ParamBodyAngleZ: 0.0,
    Param:0.0,
    Param40: 0.0, // 猫耳/动作相关
    Param2: 0.0,   // 裂开/动作相关
    Param3: 0.0,
    Param4: 0.0,
    Param5: 0.0,
    Param6: 0.0,
    Param7: 0.0,
    Param8: 0.0,
    Param9: 0.0,
    Param10: 0.0,
    Param11: 0.0
  };

  for (const [param, value] of Object.entries(resetParams)) {
    coreModel.setParameterValueById(param, value);
  }

  coreModel.update();
  app.renderer.render(app.stage);
}




// 随机表情
function randomExpression() {
  if (!model || expressionNames.value.length === 0) return;

  // 过滤掉 expressionParams 中没有定义的表情名
  const valid = expressionNames.value.filter(name => expressionParams[name]);

  if (valid.length === 0) return;

  const index = random(0, valid.length - 1);
  applyExpression(valid[index]);
}


// 自动眨眼
function setupAutoBlink() {
  blinkInterval = setInterval(() => {
    if (model) {
      // 闭眼
      model.internalModel.coreModel.setParameterValueById('ParamEyeLOpen', 0);
      model.internalModel.coreModel.setParameterValueById('ParamEyeROpen', 0);
      model.internalModel.coreModel.update();
      app.renderer.render(app.stage);

      // 200ms后睁眼
      setTimeout(() => {
        model.internalModel.coreModel.setParameterValueById('ParamEyeLOpen', 1);
        model.internalModel.coreModel.setParameterValueById('ParamEyeROpen', 1);
        model.internalModel.coreModel.update();
        app.renderer.render(app.stage);
      }, 200);
    }
  }, 5000);
}

onMounted(async () => {
  try {
    // 初始化PIXI
    app = initPIXI();

    // 加载模型
    model = await loadModel();



    // 加载表情配置
    await loadExpressions();

    // 设置初始状态
    resetExpression();
    setupAutoBlink();

    isModelLoaded.value = true;
    console.log('模型加载完成');

    // 调试用
    window.model = model;

  } catch (error) {
    console.error('初始化失败:', error);
  }
});

onBeforeUnmount(() => {
  // 清理资源
  if (blinkInterval) clearInterval(blinkInterval);
  if (app) app.destroy(true);
});

function toggleControls() {
  showControls.value = !showControls.value;
}


const MODEL_WIDTH = ref(250);
const MODEL_HEIGHT = ref(760);

defineExpose({
  MODEL_WIDTH,
  MODEL_HEIGHT,
  applyExpression,
  resetExpression,
});

</script>

<template>
  <div class="live2d-wrapper" :style="{
    position: 'absolute',
    left: '20px',
    bottom: '20px',
    width: `${MODEL_WIDTH}px`,
    height: `${MODEL_HEIGHT}px`,
    zIndex: 10
  }">
    <!-- 画布元素 -->
    <canvas
        ref="liveCanvas"
        :style="{
        width: '100%',
        height: '100%',
        display: 'block'
      }"
    ></canvas>

    <!-- 控制按钮 -->
    <button
        v-if="isModelLoaded"
        class="control-toggle"
        @click="toggleControls"
    >
      {{ showControls ? '隐藏控制' : '显示控制' }}
    </button>

    <!-- 控制面板 -->
    <div v-if="isModelLoaded && showControls" class="control-panel">
      <div class="control-section">
        <h3>表情控制</h3>
        <div class="button-group">
          <button @click="randomExpression">🎲 随机表情</button>
          <button @click="resetExpression">🔄 回正</button>
        </div>

        <div class="expression-buttons">
          <button
              v-for="name in expressionNames"
              :key="name"
              @click="applyExpression(name)"
          >
            {{ name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.live2d-container {
  pointer-events: none;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 350px; /* 确保最小高度 */
  overflow: hidden;
}

.live2d-canvas {
  width: 100%;
  height: 100%;
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
}

.control-toggle {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 4px;
  z-index: 10;
  cursor: pointer;
  font-size: 12px;
}

.control-panel {
  position: absolute;
  bottom: 50px;
  left: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 5;
  max-height: 60vh;
  overflow-y: auto;
}

.control-section {
  margin-bottom: 12px;
}

.control-section h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #333;
}

.button-group {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.button-group button {
  padding: 6px 12px;
  background: #4a8bfc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.button-group button:hover {
  background: #3a7be4;
}

.expression-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.expression-buttons button {
  padding: 4px 8px;
  background: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.expression-buttons button:hover {
  background: #e0e0e0;
}
</style>

