# Hướng dẫn xóa Chatbot

Nếu muốn xóa chatbot hoàn toàn khỏi website, làm theo các bước sau:

## Bước 1: Xóa các file mới
```bash
# Xóa thư mục chat components
rm -rf fresh-food-shop/src/components/chat/

# Xóa các workflow files
rm food-chatbot-workflow.json
rm simple-food-chatbot-workflow.json
rm hybrid-food-chatbot-workflow.json

# Xóa các file documentation
rm FOOD_CHATBOT_README.md
rm CHATWIDGET_INTEGRATION.md
rm n8n-environment-variables.md
rm DEPLOYMENT_GUIDE.md
rm TASK_8.3_DEPLOYMENT_NOTES.md
rm QUICK_START.md

# Xóa test scripts
rm test-n8n-webhook.ps1
rm test-simple.ps1

# Xóa spec files
rm -rf .kiro/specs/food-chatbot-n8n/
```

## Bước 2: Sửa lại 2 file gốc

### File: fresh-food-shop/src/App.jsx
Xóa 2 dòng import:
```javascript
import ChatWidget from "./components/chat/ChatWidget";
import { N8N_WEBHOOK_URL } from "./utils/constants";
```

Xóa dòng component:
```javascript
<ChatWidget n8nWebhookUrl={N8N_WEBHOOK_URL} />
```

### File: fresh-food-shop/src/utils/constants.js
Xóa 2 dòng:
```javascript
// n8n Webhook URL for chatbot
export const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/food-chatbot';
```

## Bước 3: Xóa environment variable
Xóa file `.env` trong thư mục `fresh-food-shop/` hoặc xóa dòng:
```
VITE_N8N_WEBHOOK_URL=...
```

## Tóm tắt
Chatbot chỉ ảnh hưởng tối thiểu đến code gốc:
- **2 file bị sửa**: App.jsx (thêm 2 dòng), constants.js (thêm 2 dòng)
- **Tất cả file khác**: Là file mới, có thể xóa an toàn
- **Không ảnh hưởng**: Các trang, components, services khác của website
