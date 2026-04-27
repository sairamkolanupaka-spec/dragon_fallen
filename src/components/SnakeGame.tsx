import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useTime } from 'motion/react';
import { GameStatus, Point } from '../types';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [foodPulse, setFoodPulse] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  // Refs for smooth rendering loop to avoid stale closures
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const directionRef = useRef(direction);
  const foodPulseRef = useRef(foodPulse);

  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { foodPulseRef.current = foodPulse; }, [foodPulse]);

  // Use motion's useTime for a smooth, synced pulse
  const time = useTime();
  
  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(seg => seg.x === newFood!.x && seg.y === newFood!.y)) break;
    }
    setFoodPulse(1); // Trigger neon pulse animation
    return newFood;
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    setSnake(initialSnake);
    setFood(generateFood(initialSnake));
    setDirection({ x: 0, y: -1 });
    setStatus(GameStatus.PLAYING);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
        case ' ':
          if (status === GameStatus.IDLE || status === GameStatus.GAME_OVER) resetGame();
          else setStatus(prev => prev === GameStatus.PLAYING ? GameStatus.PAUSED : GameStatus.PLAYING);
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  const update = useCallback((time: number) => {
    if (status !== GameStatus.PLAYING) return;
    
    const speed = Math.max(50, INITIAL_SPEED - (score * SPEED_INCREMENT));
    if (time - lastUpdateRef.current < speed) {
      gameLoopRef.current = requestAnimationFrame(update);
      return;
    }
    lastUpdateRef.current = time;

    setSnake(prev => {
      const head = prev[0];
      const newHead = { x: head.x + direction.x, y: head.y + direction.y };

      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setStatus(GameStatus.GAME_OVER);
        return prev;
      }

      if (prev.some((seg, idx) => idx !== 0 && seg.x === newHead.x && seg.y === newHead.y)) {
        setStatus(GameStatus.GAME_OVER);
        return prev;
      }

      const newSnake = [newHead, ...prev];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });

    gameLoopRef.current = requestAnimationFrame(update);
  }, [direction, food, status, score, generateFood]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      gameLoopRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [status, update]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  // Food Pulse Animation Effect
  useEffect(() => {
    if (foodPulse > 0) {
      const timer = setTimeout(() => setFoodPulse(p => Math.max(0, p - 0.1)), 50);
      return () => clearTimeout(timer);
    }
  }, [foodPulse]);

  // Continuous Render Loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentSnake = snakeRef.current;
    const currentFood = foodRef.current;
    const currentDirection = directionRef.current;
    const currentFoodPulse = foodPulseRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle Grid
    ctx.strokeStyle = '#0a0a0a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL_SIZE, 0); ctx.lineTo(i * CELL_SIZE, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * CELL_SIZE); ctx.lineTo(canvas.width, i * CELL_SIZE); ctx.stroke();
    }

    // Goat (Food) Rendering
    const fx = currentFood.x * CELL_SIZE;
    const fy = currentFood.y * CELL_SIZE;
    
    if (currentFoodPulse > 0) {
        ctx.strokeStyle = `rgba(239, 68, 68, ${currentFoodPulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(fx + CELL_SIZE/2, fy + CELL_SIZE/2, (CELL_SIZE * (1 + (1-currentFoodPulse))), 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.fillStyle = '#e2e8f0';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#fff';
    ctx.beginPath();
    ctx.roundRect(fx + 4, fy + 6, 12, 10, 2);
    ctx.fill();
    ctx.roundRect(fx + 12, fy + 2, 6, 6, 1);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(fx + 14, fy + 2); ctx.lineTo(fx + 12, fy - 1);
    ctx.moveTo(fx + 16, fy + 2); ctx.lineTo(fx + 18, fy - 1);
    ctx.stroke();

    // Dragon Rendering with Pulsing Aura
    const head = currentSnake[0];
    const distToFood = Math.sqrt(Math.pow(head.x - currentFood.x, 2) + Math.pow(head.y - currentFood.y, 2));
    const auraIntensity = Math.max(0, 1 - distToFood / 8); 
    const pulseTime = time.get() / 1000;
    const pulse = (Math.sin(pulseTime * (4 + auraIntensity * 12)) + 1) / 2;

    currentSnake.forEach((seg, i) => {
      const isHead = i === 0;
      const x = seg.x * CELL_SIZE;
      const y = seg.y * CELL_SIZE;

      if (isHead) {
        const auraRadius = CELL_SIZE * (1.2 + pulse * 0.8 * (1 + auraIntensity));
        const auraGrad = ctx.createRadialGradient(
          x + CELL_SIZE/2, y + CELL_SIZE/2, 0,
          x + CELL_SIZE/2, y + CELL_SIZE/2, auraRadius
        );
        auraGrad.addColorStop(0, `rgba(239, 68, 68, ${0.3 + auraIntensity * 0.5})`);
        auraGrad.addColorStop(0.5, `rgba(249, 115, 22, ${0.1 + auraIntensity * 0.3})`);
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(x + CELL_SIZE/2, y + CELL_SIZE/2, auraRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.shadowBlur = isHead ? 25 : 8;
      ctx.shadowColor = isHead ? '#ff0000' : 'rgba(255, 0, 0, 0.1)';
      
      const grad = ctx.createRadialGradient(
        x + CELL_SIZE/2, y + CELL_SIZE/2, 2,
        x + CELL_SIZE/2, y + CELL_SIZE/2, CELL_SIZE/2
      );
      grad.addColorStop(0, isHead ? '#222' : '#0a0a0a');
      grad.addColorStop(0.8, '#000');
      grad.addColorStop(1, '#111');

      ctx.fillStyle = grad;
      ctx.beginPath();
      if (isHead) {
        ctx.arc(x + CELL_SIZE/2, y + CELL_SIZE/2, CELL_SIZE/2, 0, Math.PI * 2);
      } else {
        ctx.roundRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2, 4);
      }
      ctx.fill();

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.05)';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      if (isHead) {
        ctx.fillStyle = '#ff0000';
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff0000';
        let eyeOffsets = [{dx: 6, dy: 6}, {dx: 14, dy: 6}];
        if (currentDirection.x === 1) eyeOffsets = [{dx: 14, dy: 6}, {dx: 14, dy: 14}];
        else if (currentDirection.x === -1) eyeOffsets = [{dx: 6, dy: 6}, {dx: 6, dy: 14}];
        else if (currentDirection.y === 1) eyeOffsets = [{dx: 6, dy: 14}, {dx: 14, dy: 14}];
        else if (currentDirection.y === -1) eyeOffsets = [{dx: 6, dy: 6}, {dx: 14, dy: 6}];

        eyeOffsets.forEach(eye => {
          ctx.beginPath();
          ctx.arc(x + eye.dx, y + eye.dy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + CELL_SIZE/2, y + CELL_SIZE/2);
        ctx.lineTo(x + CELL_SIZE/2 - currentDirection.x * 10, y + CELL_SIZE/2 - currentDirection.y * 10);
        ctx.stroke();
      }
    });

    ctx.shadowBlur = 0;
    requestRef.current = requestAnimationFrame(render);
  }, [time]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(render);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [render]);

  return (
    <div className="relative flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden group">
      <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex w-full justify-between items-end px-2">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-widest text-white/40 font-mono">Hunt Score</p>
          <p className="text-4xl font-bold text-white font-mono">{score.toString().padStart(4, '0')}</p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-xs uppercase tracking-widest text-white/40 font-mono flex items-center justify-end gap-2">
            <Trophy className="w-3 h-3 text-red-500" /> Best Kill
          </p>
          <p className="text-xl font-bold text-red-600 font-mono">{highScore.toString().padStart(4, '0')}</p>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="rounded-xl bg-black shadow-[0_0_80px_rgba(239,68,68,0.05)] border border-white/5"
        />

        <AnimatePresence>
          {status !== GameStatus.PLAYING && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md rounded-xl"
            >
              <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-2 italic drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]">
                {status === GameStatus.GAME_OVER ? 'Dragon Fallen' : 'Neon Dragon'}
              </h2>
              <p className="text-red-500/60 text-sm mb-8 font-mono uppercase tracking-[0.2em]">
                {status === GameStatus.GAME_OVER ? `Total Goats: ${score / 10}` : 'Hunt the goat to survive'}
              </p>
              
              <button
                onClick={resetGame}
                className="group relative flex items-center gap-3 px-10 py-5 bg-red-600 hover:bg-red-500 text-white rounded-full transition-all hover:scale-105 active:scale-95"
              >
                <div className="absolute inset-0 bg-red-400 blur-2xl opacity-0 group-hover:opacity-60 transition-opacity" />
                {status === GameStatus.GAME_OVER ? <RotateCcw className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
                <span className="font-bold uppercase tracking-widest">{status === GameStatus.GAME_OVER ? 'Re-awaken' : 'Initiate Hunt'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {status === GameStatus.PLAYING && (
          <button 
            onClick={() => setStatus(GameStatus.PAUSED)}
            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/30 hover:text-white transition-colors"
          >
            <Pause className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-4 text-white/20 text-[10px] font-mono uppercase tracking-[0.3em]">
        <span>[ARROWS] Slither</span>
        <span>[SPACE] Stasis</span>
      </div>
    </div>
  );
}
