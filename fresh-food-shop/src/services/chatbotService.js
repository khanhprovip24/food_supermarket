// n8n Chatbot Service - Direct connection
const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook-test/food-chatbot';

export const sendChatToBotAPI = async (userMessage) => {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage
      })
    });

    const data = await response.json();
    return data.message || 'Không thể xử lý câu trả lời';
  } catch (error) {
    console.error('Chatbot API error:', error);
    return '❌ Xin lỗi, không thể kết nối. Kiểm tra n8n localhost:5678 có chạy không?';
  }
};

