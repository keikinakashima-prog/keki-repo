'use client';
import { useState, useRef, useEffect } from 'react';

type Choice = 'rock' | 'paper' | 'scissors' | null;
type Result = 'win' | 'lose' | 'draw' | null;

export default function RockPaperScissors() {
    // language state and translations
    const availableLanguages = [
        { code: 'en', name: 'English' },
        { code: 'ja', name: '日本語' },
        { code: 'es', name: 'Español' },
        { code: 'fr', name: 'Français' },
        { code: 'de', name: 'Deutsch' },
        { code: 'zh', name: '简体中文' },
        { code: 'ko', name: '한국어' },
        { code: 'pt', name: 'Português' },
        { code: 'ru', name: 'Русский' }
    ];

    const translations: Record<string, any> = {
        en: {
            title: 'Rock Paper Scissors',
            choices: { rock: 'Rock', paper: 'Paper', scissors: 'Scissors' },
            you: 'You',
            computer: 'Computer',
            youWin: 'You win!',
            youLose: 'You lose',
            draw: 'Draw',
            score: 'Score',
            wins: 'Wins',
            draws: 'Draws',
            losses: 'Losses',
            reset: 'Reset'
        },
        ja: {
            title: 'じゃんけん',
            choices: { rock: 'グー', paper: 'パー', scissors: 'チョキ' },
            you: 'あなた',
            computer: 'コンピュータ',
            youWin: '勝ち！',
            youLose: '負け',
            draw: 'あいこ',
            score: '成績',
            wins: '勝',
            draws: '分',
            losses: '負',
            reset: 'リセット'
        },
        es: {
            title: 'Piedra Papel Tijeras',
            choices: { rock: 'Piedra', paper: 'Papel', scissors: 'Tijeras' },
            you: 'Tú',
            computer: 'Computadora',
            youWin: '¡Has ganado!',
            youLose: 'Has perdido',
            draw: 'Empate',
            score: 'Puntuación',
            wins: 'Ganadas',
            draws: 'Empates',
            losses: 'Perdidas',
            reset: 'Reiniciar'
        },
        fr: {
            title: 'Pierre Feuille Ciseaux',
            choices: { rock: 'Pierre', paper: 'Feuille', scissors: 'Ciseaux' },
            you: 'Vous',
            computer: 'Ordinateur',
            youWin: 'Vous avez gagné !',
            youLose: 'Vous avez perdu',
            draw: 'Égalité',
            score: 'Score',
            wins: 'Victoires',
            draws: 'Nuls',
            losses: 'Défaites',
            reset: 'Réinitialiser'
        },
        de: {
            title: 'Stein Papier Schere',
            choices: { rock: 'Stein', paper: 'Papier', scissors: 'Schere' },
            you: 'Du',
            computer: 'Computer',
            youWin: 'Du gewinnst!',
            youLose: 'Du verlierst',
            draw: 'Unentschieden',
            score: 'Punktestand',
            wins: 'Siege',
            draws: 'Unentsch.',
            losses: 'Niederlagen',
            reset: 'Zurücksetzen'
        },
        zh: {
            title: '石头 剪刀 布',
            choices: { rock: '石头', paper: '布', scissors: '剪刀' },
            you: '你',
            computer: '电脑',
            youWin: '你赢了！',
            youLose: '你输了',
            draw: '平局',
            score: '得分',
            wins: '胜',
            draws: '平',
            losses: '负',
            reset: '重置'
        },
        ko: {
            title: '가위 바위 보',
            choices: { rock: '주먹', paper: '보', scissors: '가위' },
            you: '당신',
            computer: '컴퓨터',
            youWin: '당신이 이겼습니다!',
            youLose: '당신이 졌습니다',
            draw: '비김',
            score: '점수',
            wins: '승',
            draws: '무',
            losses: '패',
            reset: '리셋'
        },
        pt: {
            title: 'Pedra Papel Tesoura',
            choices: { rock: 'Pedra', paper: 'Papel', scissors: 'Tesoura' },
            you: 'Você',
            computer: 'Computador',
            youWin: 'Você ganhou!',
            youLose: 'Você perdeu',
            draw: 'Empate',
            score: 'Pontuação',
            wins: 'Vitórias',
            draws: 'Empates',
            losses: 'Derrotas',
            reset: 'Reiniciar'
        },
        ru: {
            title: 'Камень Ножницы Бумага',
            choices: { rock: 'Камень', paper: 'Бумага', scissors: 'Ножницы' },
            you: 'Вы',
            computer: 'Компьютер',
            youWin: 'Вы победили!',
            youLose: 'Вы проиграли',
            draw: 'Ничья',
            score: 'Счет',
            wins: 'Победы',
            draws: 'Ничьи',
            losses: 'Поражения',
            reset: 'Сброс'
        }
    };

    const [lang, setLang] = useState<string>(() => {
        try {
            const saved = localStorage.getItem('rps_lang');
            if (saved) return saved;
        } catch (e) {}
        return navigator.language?.slice(0, 2) || 'en';
    });

    useEffect(() => {
        try {
            localStorage.setItem('rps_lang', lang);
        } catch (e) {}
    }, [lang]);

    const t = (key: string) => (translations[lang] && translations[lang][key]) || translations['en'][key];
    const [playerChoice, setPlayerChoice] = useState<Choice>(null);
    const [computerChoice, setComputerChoice] = useState<Choice>(null);
    const [result, setResult] = useState<Result>(null);
    const [score, setScore] = useState({ wins: 0, losses: 0, draws: 0 });

    const choices: Choice[] = ['rock', 'paper', 'scissors'];
    const choiceEmoji = {
        rock: '✊',
        paper: '✋',
        scissors: '✌️',
    };

    const getComputerChoice = (): Choice => {
        return choices[Math.floor(Math.random() * 3)];
    };

    const judgeGame = (player: Choice, computer: Choice): Result => {
        if (player === computer) return 'draw';
        if (
            (player === 'rock' && computer === 'scissors') ||
            (player === 'paper' && computer === 'rock') ||
            (player === 'scissors' && computer === 'paper')
        ) {
            return 'win';
        }
        return 'lose';
    };

    const animationIntervalRef = useRef<number | null>(null);
    const animationTimeoutRef = useRef<number | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [confetti, setConfetti] = useState<Array<{
        id: string;
        left: number;
        color: string;
        rotate: number;
        delay: number;
        duration: number;
    }>>([]);

    const play = (choice: Choice) => {
        if (!choice || isAnimating) return;

        // ゲーム開始時に前回の結果をクリア
        setResult(null);
        setPlayerChoice(choice);
        // すぐにランダムな表示を出してロール感を開始
        setComputerChoice(choices[Math.floor(Math.random() * choices.length)]);
        setIsAnimating(true);

        // アニメーション: 迅速に表示を切り替え、滑らかに見せる
        animationIntervalRef.current = window.setInterval(() => {
            setComputerChoice(choices[Math.floor(Math.random() * choices.length)]);
        }, 70);

        // 0.9秒後にアニメーションを止めて最終結果を決定する
        animationTimeoutRef.current = window.setTimeout(() => {
            if (animationIntervalRef.current) {
                clearInterval(animationIntervalRef.current);
                animationIntervalRef.current = null;
            }

            const computer = getComputerChoice();
            const gameResult = judgeGame(choice, computer);

            setComputerChoice(computer);
            setResult(gameResult);

            // If player wins, spawn confetti/party ribbons
            if (gameResult === 'win') {
                spawnConfetti(60);
            }

            setScore((prev) => {
                const newScore = {
                    ...prev,
                    wins: gameResult === 'win' ? prev.wins + 1 : prev.wins,
                    losses: gameResult === 'lose' ? prev.losses + 1 : prev.losses,
                    draws: gameResult === 'draw' ? prev.draws + 1 : prev.draws,
                };
                if (newScore.losses >= 10) {
                    // show game over screen (English message)
                    setGameOver(true);
                    // stop any ongoing animations/confetti
                    setIsAnimating(false);
                    setConfetti([]);
                }
                return newScore;
            });

            // 少しだけ余韻を残してフェードイン
            setTimeout(() => setIsAnimating(false), 120);
            animationTimeoutRef.current = null;
        }, 900);
    };

    useEffect(() => {
        return () => {
            if (animationIntervalRef.current) {
                clearInterval(animationIntervalRef.current);
            }
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
            // clear any confetti timers by clearing list
            setConfetti([]);
        };
    }, []);

    const spawnConfetti = (count = 40) => {
        const colors = ['#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA', '#007AFF', '#5856D6', '#ff66cc'];
        const pieces = Array.from({ length: count }).map((_, i) => ({
            id: `${Date.now()}-${i}`,
            left: Math.random() * 100,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotate: Math.floor(Math.random() * 360),
            delay: Math.random() * 0.5,
            duration: 1.8 + Math.random() * 1.2,
        }));
        setConfetti(pieces);

        // remove confetti after the longest animation finishes
        const maxDur = Math.max(...pieces.map((p) => p.duration)) + 0.6;
        setTimeout(() => setConfetti([]), maxDur * 1000);
    };

    const reset = () => {
        setPlayerChoice(null);
        setComputerChoice(null);
        setResult(null);
        setScore({ wins: 0, losses: 0, draws: 0 });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
                <div className="flex justify-end mb-4">
                    <label className="sr-only">Language</label>
                    <select
                        aria-label="Language selector"
                        value={lang}
                        onChange={(e) => setLang(e.target.value)}
                        className="text-sm border rounded px-2 py-1"
                    >
                        {availableLanguages.map((l) => (
                            <option key={l.code} value={l.code}>
                                {l.name}
                            </option>
                        ))}
                    </select>
                </div>

                <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
                    {t('title')}
                </h1>

                <div className="grid grid-cols-3 gap-4 mb-8">
                    {(choices as Choice[]).map((c) => {
                        const choice = c as Exclude<Choice, null>;
                        return (
                            <button
                                key={choice}
                                onClick={() => play(choice)}
                                disabled={isAnimating}
                                className={`p-6 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-3xl font-bold ${isAnimating ? 'opacity-60 cursor-not-allowed' : ''}`}
                            >
                                {choiceEmoji[choice]}
                                <p className="text-xs mt-2 text-gray-700">
                                    {translations[lang]?.choices?.[choice] ?? translations['en'].choices[choice]}
                                </p>
                            </button>
                        );
                    })}
                </div>

                {/* confetti overlay */}
                {confetti.length > 0 && (
                    <div className="confetti-container">
                        {confetti.map((p) => (
                            <span
                                key={p.id}
                                className="confetti-piece"
                                style={{
                                    left: `${p.left}%`,
                                    background: p.color,
                                    transform: `rotate(${p.rotate}deg)`,
                                    animationDuration: `${p.duration}s, ${0.6 + (p.duration / 2)}s`,
                                    animationDelay: `${p.delay}s, ${p.delay}s`,
                                }}
                            />
                        ))}
                    </div>
                )}

                {playerChoice && (
                    <div className="mb-8 text-center">
                        <div className="flex justify-around mb-4">
                            <div>
                                <p className="text-sm text-gray-600">{t('you')}</p>
                                <p className="text-5xl">{choiceEmoji[playerChoice]}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{t('computer')}</p>
                                <p className={`text-5xl ${isAnimating ? 'rolling' : 'finalReveal'}`}>
                                    {computerChoice ? choiceEmoji[computerChoice] : '❓'}
                                </p>
                            </div>
                        </div>

                        {result && (
                            <p
                                className={`text-2xl font-bold ${
                                    result === 'win'
                                        ? 'text-green-600'
                                        : result === 'lose'
                                            ? 'text-red-600'
                                            : 'text-yellow-600'
                                }`}
                            >
                                {result === 'win' ? t('youWin') : result === 'lose' ? t('youLose') : t('draw')}
                            </p>
                        )}
                    </div>
                )}

                <div className="bg-gray-100 rounded-lg p-4 mb-8">
                    <p className="text-center text-sm text-gray-600">{t('score')}</p>
                    <div className="flex justify-around mt-2">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{score.wins}</p>
                            <p className="text-xs text-gray-600">{t('wins')}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">{score.draws}</p>
                            <p className="text-xs text-gray-600">{t('draws')}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-600">{score.losses}</p>
                            <p className="text-xs text-gray-600">{t('losses')}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={reset}
                    className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                    {t('reset')}
                </button>
            </div>
        </div>
    );
}