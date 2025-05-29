
<!--<script setup>-->
<!--import BackGround from '@/components/BackGround.vue';-->
<!--import Live2d from '@/components/Live2d.vue';-->
<!--import ChatFrame from '@/components/ChatFrame.vue';-->
<!--import UserActivity from '@/components/UserActivity.vue';-->

<!--</script>-->


<!--<template>-->
<!--  <div class="container">-->
<!--    <BackGround/>-->

<!--    <div class="live2d-area">-->
<!--      <Live2d/>-->
<!--    </div>-->

<!--    &lt;!&ndash; 聊天区域 &ndash;&gt;-->
<!--    <div class="middle-area">-->
<!--      <div class="non-chat-area"></div>-->
<!--      <div class="chat-area">-->
<!--        <ChatFrame />-->
<!--      </div>-->
<!--    </div>-->

<!--    &lt;!&ndash; 用户信息区域 &ndash;&gt;-->
<!--    <div class="user-area">-->
<!--      <UserActivity />-->
<!--    </div>-->

<!--  </div>-->
<!--</template>-->



<!--<style scoped>-->
<!--.container {-->
<!--  display: flex;-->
<!--  width: 80vw;-->
<!--  height: 100vh;-->
<!--  overflow: hidden;-->
<!--}-->

<!--/* 左侧 Live2D 区域 */-->
<!--.live2d-area {-->
<!--  flex: 0.8;-->
<!--  min-width: 10px; /* 最小宽度限制 */-->
<!--  max-width: 300px; /* 可选：防止太宽 */-->
<!--  display: flex;-->
<!--  align-items: flex-end;-->
<!--  justify-content: center;-->
<!--  padding: 20px 10px;-->
<!--  box-sizing: border-box;-->
<!--}-->

<!--/* 中间聊天区域 */-->
<!--.middle-area {-->
<!--  flex: 200;-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  padding: 100px 10px;-->
<!--  box-sizing: border-box;-->
<!--}-->
<!--/* 聊天框容器区域 */-->
<!--.chat-area {-->
<!--  flex: 1; /* ✅ 让它自动填满剩余空间 */-->
<!--  display: flex;-->
<!--  flex-direction: column;-->
<!--  justify-content: flex-end;-->
<!--}-->

<!--/* 右侧用户区域 */-->
<!--.user-area {-->
<!--  flex: 1;-->
<!--  min-width: 180px; /* 更窄些 */-->
<!--  max-width: 240px;-->
<!--  padding: 20px;-->
<!--  box-sizing: border-box;-->
<!--}-->

<!--</style>-->


<template>
  <router-view />
</template>

<script setup>

</script>
