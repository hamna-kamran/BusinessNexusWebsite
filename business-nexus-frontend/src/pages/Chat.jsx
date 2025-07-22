import React, { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import moment from 'moment';

const socket = io('http://localhost:5000');

export default function ChatPage() {
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserName, setCurrentUserName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const token = localStorage.getItem('token');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await axios.get('https://businessnexuswebsite.onrender.com/api/auth/current', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUserId(res.data._id);
      setCurrentUserName(res.data.name || res.data.username);
    } catch (err) {
      console.error('Error fetching current user:', err);
      setErrorMsg('⚠️ Failed to load current user.');
    }
  }, [token]);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`https://businessnexuswebsite.onrender.com/api/chat/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      setErrorMsg('');
    } catch (err) {
      console.error('Error fetching messages:', err);
      setErrorMsg('⚠️ Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, [token, userId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(
        'https://businessnexuswebsite.onrender.com/api/chat',
        { receiver: userId, message: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInput('');
      socket.emit('newMessage', res.data);
    } catch (err) {
      console.error('❌ Send message error:', err);
      const errorMessage =
        err.response?.data?.message ||
        `Status ${err.response?.status}: ${err.message}` ||
        'Unknown error occurred';
      alert(`Send failed: ${errorMessage}`);
    }
  };

  useEffect(() => {
    socket.on('messageReceived', (newMsg) => {
      if (
        (newMsg.sender === userId || newMsg.receiver === userId) &&
        (newMsg.sender === currentUserId || newMsg.receiver === currentUserId)
      ) {
        setMessages((prev) => [...prev, newMsg]);
      }
    });
    return () => socket.off('messageReceived');
  }, [userId, currentUserId]);

  useEffect(() => {
    if (token && userId) {
      fetchCurrentUser();
      fetchMessages();
    }
  }, [token, userId, fetchCurrentUser, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`d-flex flex-column ${darkMode ? 'bg-dark text-light' : ''}`} style={{ height: '100vh' }}>
      {/* Header */}
      <div className="container py-3 border-bottom d-flex justify-content-between align-items-center">
        <h4>💬 Chat</h4>
        <button className="btn btn-sm btn-outline-secondary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Messages */}
      <div
        className={`flex-grow-1 px-3 py-2 overflow-auto ${darkMode ? 'bg-secondary' : 'bg-light'}`}
        style={{ maxHeight: 'calc(100vh - 160px)' }} // adjust height for header + input
      >
        {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

        {loading ? (
          <div className="text-center text-muted">Loading messages...</div>
        ) : messages.length > 0 ? (
          messages.map((msg, i) => {
            const isSender =
              msg.sender === currentUserId || msg.sender?._id === currentUserId;

            return (
              <div
                key={i}
                className={`d-flex ${isSender ? 'justify-content-end' : 'justify-content-start'} mb-2`}
              >
                <div
                  className={`p-2 rounded shadow-sm ${isSender ? 'bg-success' : 'bg-primary'} text-white`}
                  style={{ maxWidth: '70%' }}
                >
                  <div className="fw-bold small mb-1">
                    {isSender ? currentUserName : msg.sender?.name || 'User'}
                  </div>
                  <div>{msg.message}</div>
                  <div className="small mt-1 text-end">
                    {moment(msg.createdAt).fromNow()}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-muted">No messages yet.</div>
        )}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="container py-3 border-top">
        <div className="d-flex">
          <input
            type="text"
            value={input}
            className="form-control me-2"
            placeholder="Type a message..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
