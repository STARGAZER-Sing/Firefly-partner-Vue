<template>
  <div class="page-wrapper">
  <div class="auth-container">
    <h2>登录</h2>
    <input v-model="name" placeholder="用户名" />
    <input v-model="password" type="password" placeholder="密码" />
    <button @click="login">登录</button>
    <p @click="$router.push('/register')">没有账号？去注册</p>
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

async function login() {
  try {
    const res = await axios.post('http://localhost:8080/firefly/api/user/login', {
      name: name.value,
      password: password.value
    })
    if (res.data === '登录成功') {
      localStorage.setItem('username', name.value) // 保存用户名
      router.push('/index')
    } else {
      alert(res.data)
    }
  } catch (err) {
    alert('服务器错误，请稍后再试')
    console.error(err)
  }
}
</script>


<style scoped>

.page-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.auth-container {
  width: 100%;
  max-width: 360px;
  padding: 40px;
  border-radius: 12px;
  background-color: white; /* 卡片背景白色 */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: #333;
}

.auth-container h2 {
  text-align: center;
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
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

.auth-container input::placeholder {
  color: #aaa;
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
  margin-top: 10px;
}


</style>
