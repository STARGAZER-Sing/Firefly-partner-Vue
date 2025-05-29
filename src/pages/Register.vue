<template>
  <div class="page-wrapper">
  <div class="auth-container">
    <h2>注册</h2>
    <input v-model="name" placeholder="用户名" />
    <input v-model="password" type="password" placeholder="密码" />
    <button @click="register">注册</button>
    <p @click="$router.push('/login')">已有账号？去登录</p>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const name = ref('')
const password = ref('')
const router = useRouter()

async function register() {
  try {
    const res = await axios.post('http://localhost:8080/firefly/api/user/register', {
      name: name.value,
      password: password.value
    })
    alert(res.data)
    if (res.data === '注册成功') {
      router.push('/login')
    }
  } catch (err) {
    alert('注册失败，请稍后再试')
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
