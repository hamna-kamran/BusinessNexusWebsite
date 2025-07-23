require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Route imports
const authRoutes = require('./routes/auth');
const entrepreneurRoutes = require('./routes/EntrepreneurProfile');
const investorRoutes = require('./routes/InvestorProfile');
const requestRoutes = require('./routes/collaborationRequest');
const chatRoutes = require('./routes/Chat');

const app = express();

// ✅ CORS Setup: Allow both localhost (for testing) and Vercel
const allowedOrigins = [
  'http://localhost:3000',
  'https://business-nexus-website-frontend.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
  if (!origin) return callback(null, true); // Allow requests with no origin (like Postman or mobile apps)
  if (allowedOrigins.includes(origin)) {
    return callback(null, true);
  } else {
    return callback(new Error('Not allowed by CORS'));
  }
},

  credentials: true
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/entrepreneur', entrepreneurRoutes);
app.use('/api/investor', investorRoutes);
app.use('/api', requestRoutes);
app.use('/api/chat', chatRoutes);

// Server + Socket.IO setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Map to store connected users
const users = new Map();

// Socket.IO Events
io.on('connection', (socket) => {
  socket.on('join', ({ userId }) => {
    users.set(userId, socket.id);
  });

  socket.on('send_message', ({ senderId, receiverId, message }) => {
    const receiverSocketId = users.get(receiverId);
    const msgData = {
      senderId,
      receiverId,
      message,
      timestamp: new Date()
    };

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', msgData);
    }

    io.emit('messageReceived', msgData);
  });

  socket.on('disconnect', () => {
    for (const [userId, id] of users.entries()) {
      if (id === socket.id) {
        users.delete(userId);
        break;
      }
    }
    console.log(' Client disconnected:', socket.id);
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
