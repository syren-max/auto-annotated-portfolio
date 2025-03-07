import { useState } from 'react';

export default function Home() {
  const [userInput, setUserInput] = useState(''); // Для хранения текста пользователя
  const [messages, setMessages] = useState([]); // Для хранения сообщений чата

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    // Отображаем сообщение пользователя
    setMessages([...messages, { text: userInput, sender: 'user' }]);
    setUserInput(''); // Очищаем поле ввода

    // Отправляем запрос к OpenAI API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: userInput }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    setMessages([
      ...messages,
      { text: userInput, sender: 'user' },
      { text: data.reply, sender: 'ai' }, // Ответ ИИ
    ]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div id="chat-container">
        <div id="messages" style={{ marginBottom: '20px', height: '300px', overflowY: 'scroll' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ padding: '5px' }}>
              <strong>{msg.sender === 'user' ? 'Вы' : 'ИИ'}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Задайте вопрос..."
          style={{ padding: '10px', width: 'calc(100% - 100px)' }}
        />
        <button onClick={handleSendMessage} style={{ padding: '10px 20px' }}>Отправить</button>
      </div>
    </div>
  );
}
