import { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Users, LogIn, Play, Moon, Sun, Skull,
  MessageCircle, Send, Shield, Eye, Heart, Ghost,
  Vote, Crown, Clock
} from 'lucide-react';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

const ROLE_INFO = {
  villager: { name: 'ชาวบ้าน', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', desc: 'ค้นหาและกำจัดหมาป่าให้ได้' },
  werewolf: { name: 'หมาป่า', icon: Ghost, color: 'text-rose-600', bg: 'bg-rose-50', desc: 'กลืนกินชาวบ้านโดยไม่ให้ถูกจับได้' },
  seer: { name: 'หมอดู', icon: Eye, color: 'text-violet-600', bg: 'bg-violet-50', desc: 'ตรวจสอบว่าใครเป็นหมาป่าในเวลากลางคืน' },
  doctor: { name: 'หมอ', icon: Heart, color: 'text-sky-600', bg: 'bg-sky-50', desc: 'ปกป้องใครสักคนจากการถูกโจมตี' },
};

export default function Werewolf() {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [view, setView] = useState('home');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState(null);
  const [myRole, setMyRole] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [error, setError] = useState('');
  const [seerResult, setSeerResult] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [voteCount, setVoteCount] = useState({ voted: 0, total: 0 });
  const [actionSubmitted, setActionSubmitted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('cquiz_wolf_name');
    if (saved) setPlayerName(saved);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('room-update', (r) => setRoom(r));
    socket.on('game-started', (r) => {
      setRoom(r);
      setView('game');
      setMessages(r.messages || []);
      setActionSubmitted(false);
      setSeerResult(null);
    });
    socket.on('your-role', ({ role }) => setMyRole(role));
    socket.on('phase-change', (r) => {
      setRoom(r);
      setMessages(r.messages || []);
      setActionSubmitted(false);
      setSelectedTarget(null);
      setVoteCount({ voted: 0, total: r.players.filter((p) => p.alive).length });
    });
    socket.on('vote-update', ({ votes, total, voted }) => {
      setVoteCount({ voted, total });
    });
    socket.on('new-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    socket.on('seer-result', (res) => setSeerResult(res));
    socket.on('player-disconnected', ({ room: r }) => {
      setRoom(r);
      setMessages(r.messages || []);
    });

    return () => {
      socket.off('room-update');
      socket.off('game-started');
      socket.off('your-role');
      socket.off('phase-change');
      socket.off('vote-update');
      socket.off('new-message');
      socket.off('seer-result');
      socket.off('player-disconnected');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const connectSocket = useCallback(() => {
    if (socket) return socket;
    const s = io(SERVER_URL);
    setSocket(s);
    return s;
  }, [socket]);

  const handleCreate = () => {
    if (!playerName.trim()) return setError('กรุณาใส่ชื่อ');
    setError('');
    localStorage.setItem('cquiz_wolf_name', playerName);
    const s = connectSocket();
    s.emit('create-room', { playerName: playerName.trim() }, (res) => {
      if (res.success) {
        setRoomCode(res.code);
        setView('lobby');
      } else {
        setError(res.error || 'ไม่สามารถสร้างห้องได้');
      }
    });
  };

  const handleJoin = () => {
    if (!playerName.trim()) return setError('กรุณาใส่ชื่อ');
    if (!roomCode.trim()) return setError('กรุณาใส่รหัสห้อง');
    setError('');
    localStorage.setItem('cquiz_wolf_name', playerName);
    const s = connectSocket();
    s.emit('join-room', { code: roomCode.trim(), playerName: playerName.trim() }, (res) => {
      if (res.success) {
        setRoomCode(res.code);
        setView('lobby');
      } else {
        setError(res.error || 'ไม่สามารถเข้าห้องได้');
      }
    });
  };

  const handleStart = () => {
    if (!socket || !room) return;
    socket.emit('start-game', { code: room.code }, (res) => {
      if (!res.success) setError(res.error || 'ไม่สามารถเริ่มเกมได้');
    });
  };

  const handleNightAction = (targetId) => {
    if (!socket || !room || actionSubmitted) return;
    const me = room.players.find((p) => p.id === socket.id);
    if (!me || !me.alive) return;

    let action = 'vote';
    if (me.role === 'werewolf') action = 'kill';
    else if (me.role === 'seer') action = 'investigate';
    else if (me.role === 'doctor') action = 'heal';

    socket.emit('night-action', { code: room.code, action, targetId });
    setSelectedTarget(targetId);
    setActionSubmitted(true);
  };

  const handleDayVote = (targetId) => {
    if (!socket || !room || actionSubmitted) return;
    socket.emit('day-vote', { code: room.code, targetId });
    setSelectedTarget(targetId);
    setActionSubmitted(true);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket || !room) return;
    socket.emit('send-message', { code: room.code, text: chatInput.trim() });
    setChatInput('');
  };

  const getMe = () => room?.players.find((p) => p.id === socket?.id);
  const isHost = () => room?.hostId === socket?.id;
  const alivePlayers = () => room?.players.filter((p) => p.alive) || [];
  const deadPlayers = () => room?.players.filter((p) => !p.alive) || [];

  const roleInfo = myRole ? ROLE_INFO[myRole] : null;

  // Home view
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-stone-50 pt-20 pb-10">
        <div className="max-w-md mx-auto px-6">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-secondary-500 hover:text-primary-600 mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>กลับหน้าแรก</span>
          </button>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 mx-auto mb-4">
              <Ghost size={32} />
            </div>
            <h1 className="text-3xl font-bold text-secondary-800 mb-2">Werewolf</h1>
            <p className="text-secondary-500">เกมหมาป่าออนไลน์</p>
          </div>

          {error && (
            <div className="bg-rose-50 text-rose-700 text-sm rounded-xl p-3 mb-4">{error}</div>
          )}

          <div className="bg-white rounded-3xl shadow-sm border border-secondary-100 p-6 mb-4">
            <label className="block text-sm font-semibold text-secondary-700 mb-2">ชื่อผู้เล่น</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="ใส่ชื่อของคุณ"
              className="w-full px-4 py-3 bg-secondary-50 rounded-xl text-secondary-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 mb-4"
              maxLength={20}
            />

            <button
              onClick={handleCreate}
              className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl transition-colors mb-3"
            >
              <Crown size={18} />
              สร้างห้อง
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-secondary-100 p-6">
            <label className="block text-sm font-semibold text-secondary-700 mb-2">เข้าร่วมห้อง</label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="รหัสห้อง (เช่น ABC123)"
              className="w-full px-4 py-3 bg-secondary-50 rounded-xl text-secondary-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 mb-4"
              maxLength={8}
            />
            <button
              onClick={handleJoin}
              className="w-full flex items-center justify-center gap-2 bg-secondary-800 hover:bg-secondary-900 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <LogIn size={18} />
              เข้าร่วม
            </button>
          </div>

          <div className="mt-8 bg-amber-50 rounded-2xl p-4 text-sm text-amber-800">
            <p className="font-semibold mb-1">วิธีเล่น</p>
            <ul className="space-y-1 text-amber-700">
              <li>1. สร้างห้องหรือเข้าร่วมด้วยรหัส</li>
              <li>2. รอผู้เล่นเข้าครบ (ขั้นต่ำ 4 คน)</li>
              <li>3. เจ้าของห้องกดเริ่มเกม</li>
              <li>4. กลางคืน: หมาป่าเลือกเหยื่อ, หมอดูสืบสวน, หมอปกป้อง</li>
              <li>5. กลางวัน: ทุกคนโหวตจับหมาป่า</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Lobby view
  if (view === 'lobby' && room) {
    return (
      <div className="min-h-screen bg-stone-50 pt-20 pb-10">
        <div className="max-w-md mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-secondary-800 mb-2">ห้อง #{room.code}</h1>
            <p className="text-secondary-500 text-sm">รอผู้เล่นเข้าร่วม...</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-secondary-100 p-6 mb-6">
            <h3 className="font-semibold text-secondary-700 mb-4 flex items-center gap-2">
              <Users size={18} />
              ผู้เล่น ({room.players.length})
            </h3>
            <div className="space-y-2">
              {room.players.map((p) => (
                <div
                  key={p.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    p.id === room.hostId ? 'bg-primary-50 border border-primary-200' : 'bg-secondary-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                    p.id === room.hostId ? 'bg-primary-500' : 'bg-secondary-400'
                  }`}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-secondary-700">{p.name}</span>
                  {p.id === room.hostId && (
                    <span className="ml-auto text-xs text-primary-600 font-medium">เจ้าของห้อง</span>
                  )}
                  {p.id === socket?.id && (
                    <span className="ml-auto text-xs text-secondary-400">คุณ</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isHost() && (
            <button
              onClick={handleStart}
              disabled={room.players.length < 4}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:bg-secondary-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-2xl transition-colors mb-4"
            >
              <Play size={20} />
              เริ่มเกม
            </button>
          )}

          {!isHost() && (
            <p className="text-center text-sm text-secondary-400">รอเจ้าของห้องเริ่มเกม...</p>
          )}
        </div>
      </div>
    );
  }

  // Game view
  if (view === 'game' && room) {
    const me = getMe();
    const isNight = room.phase === 'night';
    const isDay = room.phase === 'day';
    const isEnded = room.phase === 'ended';

    return (
      <div className="min-h-screen bg-stone-50 pt-4 pb-6">
        <div className="max-w-lg mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/')}
              className="text-secondary-500 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {isNight && <Moon size={18} className="text-violet-500" />}
              {isDay && <Sun size={18} className="text-amber-500" />}
              {isEnded && <Crown size={18} className="text-amber-500" />}
              <span className="text-sm font-semibold text-secondary-700">
                {isNight && `กลางคืน รอบ ${room.round}`}
                {isDay && `กลางวัน รอบ ${room.round}`}
                {isEnded && 'เกมจบแล้ว!'}
              </span>
            </div>
            <div className="text-xs text-secondary-400">#{room.code}</div>
          </div>

          {/* Role reveal */}
          {roleInfo && (
            <div className={`rounded-2xl p-4 mb-4 ${roleInfo.bg} border`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white ${roleInfo.color}`}>
                  <roleInfo.icon size={20} />
                </div>
                <div>
                  <div className={`font-bold ${roleInfo.color}`}>{roleInfo.name}</div>
                  <div className="text-xs text-secondary-500">{roleInfo.desc}</div>
                </div>
              </div>
            </div>
          )}

          {/* Seer result */}
          {seerResult && (
            <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 mb-4">
              <div className="text-sm font-semibold text-violet-700 mb-1">ผลการสืบสวน</div>
              <div className="text-sm text-violet-600">
                {room.players.find((p) => p.id === seerResult.targetId)?.name} {' '}
                {seerResult.isWerewolf ? 'เป็นหมาป่า!' : 'ไม่ใช่หมาป่า'}
              </div>
            </div>
          )}

          {/* Winner */}
          {isEnded && room.winner && (
            <div className={`rounded-2xl p-6 mb-4 text-center ${
              room.winner === 'village' ? 'bg-emerald-50 border border-emerald-200' : 'bg-rose-50 border border-rose-200'
            }`}>
              <div className={`text-2xl font-bold mb-2 ${
                room.winner === 'village' ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {room.winner === 'village' ? 'ชาวบ้านชนะ!' : 'หมาป่าชนะ!'}
              </div>
              <p className="text-sm text-secondary-500">ขอบคุณที่เล่นเกมนี้</p>
            </div>
          )}

          {/* Players grid */}
          <div className="bg-white rounded-3xl shadow-sm border border-secondary-100 p-4 mb-4">
            <h3 className="text-sm font-semibold text-secondary-700 mb-3 flex items-center gap-2">
              <Users size={16} />
              ผู้เล่น ({alivePlayers().length} มีชีวิต)
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {room.players.map((p) => {
                const isMe = p.id === socket?.id;
                const canTarget = (isNight && me?.alive && (
                  (me.role === 'werewolf' && p.alive && p.id !== me.id) ||
                  (me.role === 'seer' && p.alive && p.id !== me.id) ||
                  (me.role === 'doctor' && p.alive)
                )) || (isDay && p.alive && p.id !== me?.id && me?.alive);
                const isSelected = selectedTarget === p.id;
                const showRole = isEnded || !p.alive || (isMe && myRole);

                return (
                  <button
                    key={p.id}
                    disabled={!canTarget || actionSubmitted || isEnded}
                    onClick={() => isNight ? handleNightAction(p.id) : handleDayVote(p.id)}
                    className={`relative p-3 rounded-xl text-left transition-all ${
                      p.alive
                        ? canTarget && !actionSubmitted && !isEnded
                          ? isSelected
                            ? 'bg-primary-100 border-2 border-primary-400'
                            : 'bg-secondary-50 border-2 border-transparent hover:bg-primary-50 hover:border-primary-200'
                          : 'bg-secondary-50 border border-secondary-100'
                        : 'bg-stone-100 border border-stone-200 opacity-60'
                    } ${canTarget && !actionSubmitted && !isEnded ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        p.alive ? 'bg-secondary-400' : 'bg-stone-400'
                      }`}>
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-secondary-800 truncate">{p.name}</div>
                        {showRole && (
                          <div className="text-xs text-secondary-400">
                            {ROLE_INFO[p.role]?.name || p.role}
                          </div>
                        )}
                      </div>
                    </div>
                    {!p.alive && (
                      <div className="absolute top-1 right-1 text-stone-400">
                        <Skull size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Vote progress */}
            {isDay && !isEnded && (
              <div className="mt-3 flex items-center gap-2 text-xs text-secondary-500">
                <Vote size={14} />
                <span>โหวตแล้ว {voteCount.voted}/{voteCount.total}</span>
              </div>
            )}

            {actionSubmitted && !isEnded && (
              <div className="mt-3 text-sm text-primary-600 font-medium text-center">
                รอผู้เล่นอื่น...
              </div>
            )}
          </div>

          {/* Dead players */}
          {deadPlayers().length > 0 && (
            <div className="bg-stone-100 rounded-2xl p-4 mb-4">
              <h3 className="text-sm font-semibold text-stone-500 mb-2 flex items-center gap-2">
                <Skull size={14} />
                ตายแล้ว ({deadPlayers().length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {deadPlayers().map((p) => (
                  <span key={p.id} className="text-xs text-stone-500 bg-white px-2 py-1 rounded-lg">
                    {p.name} ({ROLE_INFO[p.role]?.name || p.role})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Chat */}
          <div className="bg-white rounded-3xl shadow-sm border border-secondary-100 overflow-hidden">
            <div className="p-4 border-b border-secondary-100 flex items-center gap-2">
              <MessageCircle size={16} className="text-secondary-400" />
              <span className="text-sm font-semibold text-secondary-700">แชท</span>
            </div>
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`text-sm ${msg.type === 'system' ? 'text-center' : ''}`}>
                  {msg.type === 'system' ? (
                    <span className="inline-block bg-amber-50 text-amber-700 px-3 py-1.5 rounded-xl text-xs">
                      {msg.text}
                    </span>
                  ) : (
                    <div>
                      <span className="font-medium text-secondary-700">{msg.name}:</span>{' '}
                      <span className="text-secondary-600">{msg.text}</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {!isEnded && (
              <form onSubmit={handleSendMessage} className="p-3 border-t border-secondary-100 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={isNight && me?.role !== 'werewolf' ? 'กลางคืนชาวบ้านห้ามพูด...' : 'พิมพ์ข้อความ...'}
                  disabled={isNight && me?.role !== 'werewolf'}
                  className="flex-1 px-4 py-2.5 bg-secondary-50 rounded-xl text-sm text-secondary-800 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || (isNight && me?.role !== 'werewolf')}
                  className="w-10 h-10 bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-300 rounded-xl flex items-center justify-center text-white transition-colors"
                >
                  <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
