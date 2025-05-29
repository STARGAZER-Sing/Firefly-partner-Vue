<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import axios from 'axios'

const router = useRouter()

const user = ref({
  name: '',
  status: '在线',
  avatar: ''
})

onMounted(async () => {
  const username = localStorage.getItem('username')
  if (!username) {
    router.push('/login')
    return
  }

  try {
    const res = await axios.post('http://localhost:8080/firefly/api/user/select', username, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    user.value.name = res.data.name
    user.value.avatar = res.data.profilePhoto || '/default-avatar.png' // 如果后端没头像地址，可设默认图
  } catch (err) {
    console.error('获取用户信息失败:', err)
    router.push('/login')
  }
})

function logout() {
  localStorage.removeItem('username')
  router.push('/login')
}
</script>

<template>
  <div class="user-container">
    <div class="avatar-circle" @click="$router.push('/user')">
      <template v-if="user.avatar">
        <img
            v-if="user.avatar"
            :src="user.avatar"
            alt="用户头像"
            @error="user.avatar = ''"
        />

      </template>
      <template v-else>
        <div class="null-avatar">NULL</div>
      </template>
    </div>
    <div class="username-display">
      {{ user.name }}
    </div>
    <button class="logout-button" @click="logout">退出登录</button>
  </div>
</template>



<style scoped>
.user-container {
  flex: 1;
  min-width: 200px;
  padding: 20px;
  border-left: 1px solid rgba(0, 0, 0, 0.1);
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  cursor: pointer;
  background-color: #ffe6ee; /* 淡粉色背景 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.username-display {
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
  color: #333;
  font-size: 16px;
}


.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.null-avatar {
  color: #88c5f7; /* 淡蓝色字体 */
  font-weight: bold;
  font-size: 16px;
}

.user-panel {
  text-align: center;
  margin-top: 15px;
}

.user-panel h3 {
  color: #333;
  margin-bottom: 5px;
}

.user-panel p {
  color: #666;
  font-size: 0.9em;
}

.logout-button {
  display: block;
  margin: 15px auto 0;
  padding: 8px 16px;
  background-color: #ff5252;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.3s ease;
}

.logout-button:hover {
  background-color: #e53935;
}
</style>
