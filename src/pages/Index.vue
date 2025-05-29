<script setup>
import BackGround from '@/components/BackGround.vue';
import Live2d from '@/components/Live2d.vue';
import ChatFrame from '@/components/ChatFrame.vue';
import UserActivity from '@/components/UserActivity.vue';

import { ref } from 'vue';

const Live2dRef = ref(null);
let isPlaying = false;

async function playExpressionQueue(expressions) {
  if (!Live2dRef.value || typeof Live2dRef.value.applyExpression !== 'function') {
    console.warn('Live2dRef 未加载或 applyExpression 方法未定义');
    return;
  }

  isPlaying = true;

  for (const expression of expressions) {
    Live2dRef.value.applyExpression(expression);

    await wait(1600); // 每个表情持续 1 秒

    Live2dRef.value.resetExpression();

    await wait(300); // 稍作停顿（避免重叠）
  }

  isPlaying = false;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function handleExpression(expressionInput) {
  // 保证输入是数组
  const expressions = Array.isArray(expressionInput) ? expressionInput : [expressionInput];

  if (isPlaying) {
    console.log('表情播放中，忽略新请求');
    return;
  }

  playExpressionQueue(expressions);
}

</script>

<template>
  <div class="container">
    <BackGround/>

    <div class="live2d-area">
      <Live2d ref="Live2dRef"/>
    </div>

    <!-- 聊天区域 -->
    <div class="middle-area">
      <div class="non-chat-area"></div>
      <div class="chat-area">
        <ChatFrame @trigger-expression="handleExpression"/>
      </div>
    </div>

    <!-- 用户信息区域 -->
    <div class="user-area">
      <UserActivity />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  width: 80vw;
  height: 100vh;
  overflow: hidden;
}

.live2d-area {
  flex: 0.8;
  min-width: 10px;
  max-width: 300px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 20px 10px;
  box-sizing: border-box;
}

.middle-area {
  flex: 200;
  display: flex;
  flex-direction: column;
  padding: 100px 10px;
  box-sizing: border-box;
}

.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.user-area {
  flex: 1;
  min-width: 180px;
  max-width: 240px;
  padding: 20px;
  box-sizing: border-box;
}
</style>
