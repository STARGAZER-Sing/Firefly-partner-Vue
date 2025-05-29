<template>
  <div class="page-wrapper">
  <div class="auth-container">
    <h2>修改个人信息</h2>
    <input v-model="user.name" placeholder="用户名" />
    <input v-model="user.password" placeholder="密码" />

    <button @click="update">保存修改</button>
  </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const user = ref({
  name: '',
  password: ''
})

onMounted(() => {
  const username = localStorage.getItem('username')
  if (!username) {
    alert('未登录')
    router.push('/login')
    return
  }
  user.value.name = username
})

async function update() {
  try {
    const res = await axios.post('http://localhost:8080/firefly/api/user/update', user.value)
    alert(res.data)
  } catch (err) {
    alert('更新失败')
    console.error(err)
  }
}
</script>


<style scoped>
.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.auth-container {
  width: 100%;
  max-width: 360px;
  padding: 40px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: #333;
}

.auth-container h2 {
  text-align: center;
}

.auth-container input {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #fff;
  font-size: 16px;
  color: #000;
  outline: none;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
}

.auth-container button {
  padding: 12px;
  background-color: #4fc3f7;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-container button:hover {
  background-color: #3db1e3;
}

.auth-container p {
  text-align: center;
  cursor: pointer;
  color: #4fc3f7;
  font-size: 0.9em;
}

</style>
