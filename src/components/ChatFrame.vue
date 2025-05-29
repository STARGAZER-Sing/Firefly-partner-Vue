
<template>
  <div class="chat-container">
    <div class="chat-messages" ref="chatWindow">
      <div
          v-for="(msg, i) in messages"
          :key="i"
          :class="['msg', msg.sender]"
      >
        {{ msg.text }}
      </div>
    </div>
    <div class="input-box">
      <input
          type="text"
          v-model="newMessage"
          @keyup.enter="sendMessage"
          placeholder="输入消息..."
      />
      <button @click="sendMessage">发送</button>
      <button @click="voiceInput">语音输入</button> <!-- 新增按钮 -->
    </div>
  </div>
</template>



<script setup>
import { ref, watch, nextTick } from 'vue';
import axios from 'axios'; // 确保你已安装 axios

//  声明 emit
const emit = defineEmits(['trigger-expression']);
const expressionKeywords = ['开心', '裂开', '生气', '猫耳', '墨镜', '问号', '眼泪', '流汗', '呆愣', '鄙夷'];

// 找expressionKeywords
function checkForExpression(msg) {
  const foundExpressions = [];

  for (const keyword of expressionKeywords) {
    if (msg.includes(keyword)) {
      foundExpressions.push(keyword);
    }
  }

  // 遍历所有找到的关键词依次触发事件
  for (const expr of foundExpressions) {
    //emit('trigger-expression', expr);
    emit('trigger-expression', foundExpressions); // 一次性传出去
  }
}



const messages = ref([
  { text: '你好！我是语音助手流萤。请问，有什么能够帮到您的？', sender: 'AI' },
]);

const newMessage = ref('');
const chatWindow = ref(null);

async function sendMessage() {
  const content = newMessage.value.trim();
  if (!content) return;

  // 用户消息入列
  messages.value.push({ text: content, sender: 'user' });
  newMessage.value = '';

// 手动输入
  try {
    const response = await axios.post(
        'http://localhost:8080/firefly/api/write/process',
        { text: content },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
    );

    // 处理返回结果并加入 AI 消息
    const aiText = response.data || '(没有收到回应)';
    messages.value.push({ text: aiText, sender: 'AI' });


    // 检查是否有表情
    if (aiText==='(没有收到回应)'){
      checkForExpression('呆愣')
    }else {checkForExpression(aiText);}

    // 语音播放
    try {
      await axios.post(
          'http://localhost:8080/firefly/api/play/voice',
          // { text: aiText },  // 发送AI文本用于语音合成
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );
      console.log('语音播放请求发送成功');
    } catch (voiceError) {
      console.error('语音播放失败:', voiceError);
      // 可以选择不显示错误给用户，因为主要功能已完成
    }

  } catch (error) {
    console.error('请求出错:', error);
    console.log('error:',error)
    messages.value.push({ text: '（AI 出错了，请稍后再试）', sender: 'AI' });
  }
}

// 自动滚动到底部
watch(messages, async () => {
  await nextTick();
  if (chatWindow.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  }
});


// 语音输入
async function voiceInput() {
  try {
    const response = await axios.get(
        'http://localhost:8080/firefly/api/speech/process',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
    );

    // 解析响应数据
    const responseData = response.data;

    // 1. 显示用户语音输入（从userInput中提取text字段）
    let userInputText = '(无法识别语音)';
    try {
      const userInputObj = JSON.parse(responseData.userInput);
      userInputText = userInputObj.text || userInputText;
    } catch (e) {
      console.warn('解析用户输入失败:', e);
    }

    // 添加到消息列表
    if (userInputText !== '(无法识别语音)') {
      messages.value.push({ text: userInputText, sender: 'user' });
    }

    // 2. 显示AI回复
    const aiSpeechText = responseData.aiResponse || '(AI 无语音回应)';
    messages.value.push({ text: aiSpeechText, sender: 'AI' });

    // 3. 检查是否有表情
    if (aiSpeechText === '(AI 无语音回应)') {
      checkForExpression('呆愣');
    } else {
      checkForExpression(aiSpeechText);
    }



    //  播放语音
    try {
      await axios.post(
          'http://localhost:8080/firefly/api/play/voice',
          // { text: aiText },  // 发送AI文本用于语音合成
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );
      console.log('语音播放请求发送成功');
    } catch (voiceError) {
      console.error('语音播放失败:', voiceError);
      // 可以选择不显示错误给用户，因为主要功能已完成
    }

    // 4. 自动滚动到底部
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50);


  } catch (error) {
    console.error('语音接口出错:', error);
    messages.value.push({
      text: '（语音识别失败，请重试）',
      sender: 'AI'
    });
    checkForExpression('呆滞');
  }
}


</script>



<style scoped>
.chat-container {
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}


.chat-messages {
  flex: 1;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  min-height: 500px;
  margin: 10px 20px 20px; /* ✅ 增加顶部间距，让聊天框整体更高 */
  padding: 15px;
  overflow-y: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}



.msg {
  margin: 8px 0;
  padding: 10px 15px;
  border-radius: 18px;
  max-width: 80%;
  word-break: break-word;
  color: black; /* ✅ 让文字变为黑色 */
}

.msg.AI {
  background: #f0f9ff;
  align-self: flex-start;
}

.msg.user {
  background: #e3f2fd;
  align-self: flex-end;
}

.input-box {
  display: flex;
  padding: 0 20px 20px;
  gap: 10px;
}

.input-box input {
  flex: 1;
  padding: 10px 15px;
  border: none;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.9);
}

.input-box button {
  padding: 0 20px;
  border: none;
  border-radius: 24px;
  background: #4fc3f7;
  color: white;
  cursor: pointer;
  user-select: none;
}
</style>

