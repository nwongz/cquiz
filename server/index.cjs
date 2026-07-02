const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const rooms = new Map();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', rooms: rooms.size });
});

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

const ROLE_TH = {
  villager: 'ชาวบ้าน',
  werewolf: 'หมาป่า',
  seer: 'หมอดู',
  doctor: 'หมอ',
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRoleDistribution(playerCount) {
  const dist = { werewolf: 0, villager: 0, seer: 0, doctor: 0 };
  if (playerCount <= 5) {
    dist.werewolf = 1; dist.villager = playerCount - 3; dist.seer = 1; dist.doctor = 1;
  } else if (playerCount <= 8) {
    dist.werewolf = 2; dist.villager = playerCount - 4; dist.seer = 1; dist.doctor = 1;
  } else {
    dist.werewolf = 2; dist.villager = playerCount - 4; dist.seer = 1; dist.doctor = 1;
  }
  return dist;
}

function assignRoles(players) {
  const dist = getRoleDistribution(players.length);
  const roles = [];
  for (let i = 0; i < dist.werewolf; i++) roles.push('werewolf');
  for (let i = 0; i < dist.villager; i++) roles.push('villager');
  if (dist.seer) roles.push('seer');
  if (dist.doctor) roles.push('doctor');
  const shuffled = shuffle(roles);
  return players.map((p, i) => ({ ...p, role: shuffled[i], alive: true }));
}

function checkWin(room) {
  const alive = room.players.filter((p) => p.alive);
  const wolves = alive.filter((p) => p.role === 'werewolf');
  const villagers = alive.filter((p) => p.role !== 'werewolf');
  if (wolves.length === 0) return 'village';
  if (wolves.length >= villagers.length) return 'werewolf';
  return null;
}

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('create-room', ({ playerName }, cb) => {
    const code = generateRoomCode();
    rooms.set(code, {
      code,
      hostId: socket.id,
      players: [{ id: socket.id, name: playerName }],
      phase: 'lobby',
      round: 0,
      votes: {},
      actions: {},
      messages: [],
      winner: null,
    });
    socket.join(code);
    cb({ success: true, code });
    io.to(code).emit('room-update', rooms.get(code));
  });

  socket.on('join-room', ({ code, playerName }, cb) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return cb({ success: false, error: 'Room not found' });
    if (room.phase !== 'lobby') return cb({ success: false, error: 'Game already started' });
    if (room.players.find((p) => p.id === socket.id)) {
      return cb({ success: false, error: 'Already in room' });
    }
    room.players.push({ id: socket.id, name: playerName });
    socket.join(room.code);
    cb({ success: true, code: room.code });
    io.to(room.code).emit('room-update', room);
  });

  socket.on('start-game', ({ code }, cb) => {
    const room = rooms.get(code);
    if (!room) return cb({ success: false });
    if (room.hostId !== socket.id) return cb({ success: false });
    if (room.players.length < 4) return cb({ success: false, error: 'ต้องมีผู้เล่นอย่างน้อย 4 คน' });

    room.players = assignRoles(room.players);
    room.phase = 'day';
    room.round = 1;
    room.votes = {};
    room.actions = {};
    room.winner = null;
    room.messages = [{ text: 'วันแรกเริ่มต้น... ทุกคนลืมตา!', type: 'system', time: Date.now() }];

    cb({ success: true });
    io.to(code).emit('game-started', room);

    room.players.forEach((p) => {
      const socketId = p.id;
      io.to(socketId).emit('your-role', { role: p.role });
    });
  });

  socket.on('night-action', ({ code, action, targetId }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'night') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.alive) return;

    room.actions[socket.id] = { action, targetId };

    const aliveWerewolves = room.players.filter((p) => p.alive && p.role === 'werewolf');
    const aliveSpecial = room.players.filter((p) => p.alive && ['seer', 'doctor'].includes(p.role));
    const werewolfActions = aliveWerewolves.filter((w) => room.actions[w.id]);
    const specialActions = aliveSpecial.filter((s) => room.actions[s.id]);

    const allWerewolvesDone = aliveWerewolves.length > 0 && werewolfActions.length === aliveWerewolves.length;
    const allSpecialDone = aliveSpecial.length === specialActions.length;

    if (allWerewolvesDone && allSpecialDone) {
      resolveNight(room);
      io.to(code).emit('phase-change', room);
    }
  });

  socket.on('day-vote', ({ code, targetId }) => {
    const room = rooms.get(code);
    if (!room || room.phase !== 'day') return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.alive) return;

    room.votes[socket.id] = targetId;

    const alivePlayers = room.players.filter((p) => p.alive);
    const votedCount = Object.keys(room.votes).length;

    if (votedCount === alivePlayers.length) {
      resolveDay(room);
      io.to(code).emit('phase-change', room);
    } else {
      io.to(code).emit('vote-update', { votes: room.votes, total: alivePlayers.length, voted: votedCount });
    }
  });

  socket.on('send-message', ({ code, text }) => {
    const room = rooms.get(code);
    if (!room) return;
    const player = room.players.find((p) => p.id === socket.id);
    if (!player || !player.alive) return;
    if (room.phase === 'night' && player.role !== 'werewolf') return;

    const msg = { name: player.name, text, time: Date.now(), id: socket.id };
    room.messages.push(msg);
    io.to(code).emit('new-message', msg);
  });

  socket.on('disconnect', () => {
    for (const [code, room] of rooms) {
      const idx = room.players.findIndex((p) => p.id === socket.id);
      if (idx !== -1) {
        if (room.phase === 'lobby') {
          room.players.splice(idx, 1);
          if (room.players.length === 0) {
            rooms.delete(code);
          } else {
            if (room.hostId === socket.id) room.hostId = room.players[0].id;
            io.to(code).emit('room-update', room);
          }
        } else {
          room.players[idx].alive = false;
          const winner = checkWin(room);
          if (winner) {
            room.phase = 'ended';
            room.winner = winner;
            room.messages.push({
              text: winner === 'village' ? 'ชาวบ้านชนะ!' : 'หมาป่าชนะ!',
              type: 'system',
              time: Date.now(),
            });
          }
          io.to(code).emit('player-disconnected', { playerId: socket.id, room });
        }
        break;
      }
    }
  });
});

function resolveNight(room) {
  const wolves = room.players.filter((p) => p.alive && p.role === 'werewolf');
  const seer = room.players.find((p) => p.alive && p.role === 'seer');
  const doctor = room.players.find((p) => p.alive && p.role === 'doctor');

  let killTarget = null;
  const wolfVotes = {};
  wolves.forEach((w) => {
    const act = room.actions[w.id];
    if (act && act.targetId) {
      wolfVotes[act.targetId] = (wolfVotes[act.targetId] || 0) + 1;
    }
  });
  const maxVotes = Math.max(...Object.values(wolfVotes), 0);
  const targets = Object.entries(wolfVotes).filter(([, v]) => v === maxVotes);
  if (targets.length > 0) {
    killTarget = room.players.find((p) => p.id === targets[0][0]);
  }

  let saved = false;
  if (doctor) {
    const docAct = room.actions[doctor.id];
    if (docAct && docAct.targetId && killTarget && killTarget.id === docAct.targetId) {
      saved = true;
    }
  }

  let seerResult = null;
  if (seer) {
    const seerAct = room.actions[seer.id];
    if (seerAct && seerAct.targetId) {
      const target = room.players.find((p) => p.id === seerAct.targetId);
      if (target) seerResult = { targetId: target.id, isWerewolf: target.role === 'werewolf' };
    }
  }

  if (killTarget && !saved && killTarget.role !== 'werewolf') {
    killTarget.alive = false;
    room.messages.push({
      text: `${killTarget.name} ถูกพบว่าตายในเช้าวันนี้`,
      type: 'system',
      time: Date.now(),
    });
  } else if (killTarget && saved) {
    room.messages.push({
      text: 'มีคนถูกโจมตีแต่รอดชีวิต!',
      type: 'system',
      time: Date.now(),
    });
  }

  room.actions = {};
  room.phase = 'day';

  const winner = checkWin(room);
  if (winner) {
    room.phase = 'ended';
    room.winner = winner;
    room.messages.push({
      text: winner === 'village' ? 'ชาวบ้านชนะ!' : 'หมาป่าชนะ!',
      type: 'system',
      time: Date.now(),
    });
  }

  if (seerResult) {
    io.to(seer.id).emit('seer-result', seerResult);
  }
}

function resolveDay(room) {
  const voteCounts = {};
  Object.values(room.votes).forEach((targetId) => {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  });

  const max = Math.max(...Object.values(voteCounts), 0);
  const top = Object.entries(voteCounts).filter(([, c]) => c === max);

  if (top.length === 1) {
    const target = room.players.find((p) => p.id === top[0][0]);
    if (target) {
      target.alive = false;
      room.messages.push({
        text: `${target.name} ถูกโหวตออก`,
        type: 'system',
        time: Date.now(),
      });
    }
  } else {
    room.messages.push({
      text: 'โหวตเสมอ! ไม่มีใครถูกจับ',
      type: 'system',
      time: Date.now(),
    });
  }

  room.votes = {};
  room.phase = 'night';
  room.round += 1;

  const winner = checkWin(room);
  if (winner) {
    room.phase = 'ended';
    room.winner = winner;
    room.messages.push({
      text: winner === 'village' ? 'ชาวบ้านชนะ!' : 'หมาป่าชนะ!',
      type: 'system',
      time: Date.now(),
    });
  } else {
    room.messages.push({
      text: `กลางคืนรอบ ${room.round}...`,
      type: 'system',
      time: Date.now(),
    });
  }
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Werewolf server รันที่พอร์ต ${PORT}`);
});
