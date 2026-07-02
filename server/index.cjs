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
  guardian: 'ผู้ปกป้อง',
  jester: 'ยาจก',
  cub: 'ลูกหมาป่า',
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
  const dist = { werewolf: 0, villager: 0, seer: 0, guardian: 0, jester: 0, cub: 0 };
  if (playerCount <= 5) {
    dist.werewolf = 1; dist.villager = playerCount - 3; dist.seer = 1; dist.guardian = 1;
  } else if (playerCount <= 7) {
    dist.werewolf = 1; dist.villager = playerCount - 4; dist.seer = 1; dist.guardian = 1; dist.jester = 1;
  } else {
    dist.werewolf = 2; dist.villager = playerCount - 6; dist.seer = 1; dist.guardian = 1; dist.jester = 1; dist.cub = 1;
  }
  return dist;
}

function assignRoles(players) {
  const dist = getRoleDistribution(players.length);
  const roles = [];
  for (let i = 0; i < dist.werewolf; i++) roles.push('werewolf');
  for (let i = 0; i < dist.villager; i++) roles.push('villager');
  if (dist.seer) roles.push('seer');
  if (dist.guardian) roles.push('guardian');
  if (dist.jester) roles.push('jester');
  if (dist.cub) roles.push('cub');
  const shuffled = shuffle(roles);
  return players.map((p, i) => ({ ...p, role: shuffled[i], alive: true }));
}

function checkWin(room) {
  if (room.winner === 'jester') return 'jester';
  const alive = room.players.filter((p) => p.alive);
  const wolves = alive.filter((p) => p.role === 'werewolf' || p.role === 'cub');
  const villagers = alive.filter((p) => p.role !== 'werewolf' && p.role !== 'cub');
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
      cubRevenge: false,
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
    room.cubRevenge = false;
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

    const aliveWolves = room.players.filter((p) => p.alive && (p.role === 'werewolf' || p.role === 'cub'));
    const aliveSpecial = room.players.filter((p) => p.alive && ['seer', 'guardian'].includes(p.role));
    const wolfActions = aliveWolves.filter((w) => room.actions[w.id]);
    const specialActions = aliveSpecial.filter((s) => room.actions[s.id]);

    const allWolvesDone = aliveWolves.length > 0 && wolfActions.length === aliveWolves.length;
    const allSpecialDone = aliveSpecial.length === specialActions.length;

    if (allWolvesDone && allSpecialDone) {
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
    if (room.phase === 'night' && player.role !== 'werewolf' && player.role !== 'cub') return;

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
          if (room.players[idx].role === 'cub') {
            room.cubRevenge = true;
            room.messages.push({
              text: 'ลูกหมาป่าตาย! หมาป่าโกรธจัด พร้อมฆ่า 2 คนในกลางคืนหน้า',
              type: 'system',
              time: Date.now(),
            });
          }
          const winner = checkWin(room);
          if (winner) {
            room.phase = 'ended';
            room.winner = winner;
            const winText = winner === 'village' ? 'ชาวบ้านชนะ!' : winner === 'jester' ? 'ยาจกชนะ!' : 'หมาป่าชนะ!';
            room.messages.push({
              text: winText,
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
  const wolves = room.players.filter((p) => p.alive && (p.role === 'werewolf' || p.role === 'cub'));
  const seer = room.players.find((p) => p.alive && p.role === 'seer');
  const guardian = room.players.find((p) => p.alive && p.role === 'guardian');

  // Collect wolf votes
  const wolfVotes = {};
  wolves.forEach((w) => {
    const act = room.actions[w.id];
    if (act && act.targetId) {
      wolfVotes[act.targetId] = (wolfVotes[act.targetId] || 0) + 1;
    }
  });

  // Sort targets by votes
  const sortedTargets = Object.entries(wolfVotes)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => room.players.find((p) => p.id === id))
    .filter(Boolean);

  const killTarget1 = sortedTargets[0] || null;
  let killTarget2 = room.cubRevenge ? (sortedTargets[1] || null) : null;

  // If cubRevenge and no second target, pick random alive non-wolf
  if (room.cubRevenge && !killTarget2) {
    const candidates = room.players.filter(
      (p) => p.alive && p.role !== 'werewolf' && p.role !== 'cub' && p.id !== killTarget1?.id
    );
    if (candidates.length > 0) {
      killTarget2 = candidates[Math.floor(Math.random() * candidates.length)];
    }
  }

  // Guardian save
  let savedTarget = null;
  if (guardian) {
    const guardAct = room.actions[guardian.id];
    if (guardAct && guardAct.targetId) {
      savedTarget = room.players.find((p) => p.id === guardAct.targetId);
    }
  }

  // Seer investigate
  let seerResult = null;
  if (seer) {
    const seerAct = room.actions[seer.id];
    if (seerAct && seerAct.targetId) {
      const target = room.players.find((p) => p.id === seerAct.targetId);
      if (target) seerResult = { targetId: target.id, isWerewolf: target.role === 'werewolf' || target.role === 'cub' };
    }
  }

  // Apply kills
  const killed = [];

  if (killTarget1 && killTarget1.alive) {
    const isSaved = savedTarget && savedTarget.id === killTarget1.id;
    if (!isSaved && killTarget1.role !== 'werewolf' && killTarget1.role !== 'cub') {
      killTarget1.alive = false;
      killed.push(killTarget1);
    }
  }

  if (killTarget2 && killTarget2.alive && killTarget2.id !== killTarget1?.id) {
    const isSaved = savedTarget && savedTarget.id === killTarget2.id;
    if (!isSaved && killTarget2.role !== 'werewolf' && killTarget2.role !== 'cub') {
      killTarget2.alive = false;
      killed.push(killTarget2);
    }
  }

  // Death messages
  if (killed.length === 1) {
    room.messages.push({
      text: `${killed[0].name} ถูกพบว่าตายในเช้าวันนี้`,
      type: 'system',
      time: Date.now(),
    });
  } else if (killed.length === 2) {
    room.messages.push({
      text: `${killed[0].name} และ ${killed[1].name} ถูกพบว่าตายในเช้าวันนี้`,
      type: 'system',
      time: Date.now(),
    });
  } else if ((killTarget1 || killTarget2) && savedTarget) {
    room.messages.push({
      text: 'มีคนถูกโจมตีแต่รอดชีวิต!',
      type: 'system',
      time: Date.now(),
    });
  }

  // Check if cub died → trigger revenge for next night
  killed.forEach((p) => {
    if (p.role === 'cub') {
      room.cubRevenge = true;
      room.messages.push({
        text: 'ลูกหมาป่าตาย! หมาป่าโกรธจัด พร้อมฆ่า 2 คนในกลางคืนหน้า',
        type: 'system',
        time: Date.now(),
      });
    }
  });

  // Clear cubRevenge after use
  if (room.cubRevenge && killed.length > 0) {
    room.cubRevenge = false;
  }

  room.actions = {};
  room.phase = 'day';

  const winner = checkWin(room);
  if (winner) {
    room.phase = 'ended';
    room.winner = winner;
    const winText = winner === 'village' ? 'ชาวบ้านชนะ!' : winner === 'jester' ? 'ยาจกชนะ!' : 'หมาป่าชนะ!';
    room.messages.push({
      text: winText,
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
      // Jester wins if voted out during day
      if (target.role === 'jester') {
        room.phase = 'ended';
        room.winner = 'jester';
        room.messages.push({
          text: `${target.name} ถูกโหวตออก ยาจกชนะ!`,
          type: 'system',
          time: Date.now(),
        });
        room.votes = {};
        return;
      }
      target.alive = false;
      room.messages.push({
        text: `${target.name} ถูกโหวตออก`,
        type: 'system',
        time: Date.now(),
      });
      // If cub dies by day vote, trigger revenge
      if (target.role === 'cub') {
        room.cubRevenge = true;
        room.messages.push({
          text: 'ลูกหมาป่าตาย! หมาป่าโกรธจัด พร้อมฆ่า 2 คนในกลางคืนหน้า',
          type: 'system',
          time: Date.now(),
        });
      }
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
    const winText = winner === 'village' ? 'ชาวบ้านชนะ!' : winner === 'jester' ? 'ยาจกชนะ!' : 'หมาป่าชนะ!';
    room.messages.push({
      text: winText,
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
