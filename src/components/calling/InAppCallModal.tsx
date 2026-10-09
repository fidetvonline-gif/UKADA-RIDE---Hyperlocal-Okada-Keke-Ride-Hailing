import React, { useState, useEffect, useRef } from 'react';
import { useUkada } from '../../context/UkadaContext';
import { callAudioEngine } from '../../utils/callAudioEngine';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  Grid,
  ShieldCheck,
  Radio,
  Sparkles,
  MessageSquare,
  AlertCircle,
  X,
  User,
} from 'lucide-react';

export const InAppCallModal: React.FC = () => {
  const {
    activeCall,
    endCall,
    answerCall,
    declineCall,
    toggleCallMute,
    toggleCallSpeaker,
    toggleCallMinimized,
    sendCallQuickVoiceMessage,
  } = useUkada();

  const [showKeypad, setShowKeypad] = useState(false);
  const [typedDigits, setTypedDigits] = useState('');
  const [audioBars, setAudioBars] = useState<number[]>([15, 25, 45, 60, 35, 20, 50, 75, 40, 20]);
  const visualizerTimerRef = useRef<number | null>(null);

  // Audio waveform animation loop
  useEffect(() => {
    if (activeCall?.status === 'connected') {
      visualizerTimerRef.current = window.setInterval(() => {
        const realFreq = callAudioEngine.getAudioFrequencyData();
        if (realFreq && realFreq.length > 0) {
          const sample = Array.from(realFreq.slice(0, 10)).map((v) => Math.max(8, (v / 255) * 100));
          setAudioBars(sample);
        } else {
          // Dynamic simulated oscillation if microphone hardware is muted/restricted
          if (activeCall.isDriverSpeaking) {
            setAudioBars([
              Math.floor(25 + Math.random() * 65),
              Math.floor(35 + Math.random() * 60),
              Math.floor(50 + Math.random() * 50),
              Math.floor(65 + Math.random() * 35),
              Math.floor(80 + Math.random() * 20),
              Math.floor(70 + Math.random() * 30),
              Math.floor(55 + Math.random() * 45),
              Math.floor(40 + Math.random() * 50),
              Math.floor(30 + Math.random() * 55),
              Math.floor(20 + Math.random() * 40),
            ]);
          } else if (!activeCall.isMuted) {
            setAudioBars([
              Math.floor(10 + Math.random() * 30),
              Math.floor(15 + Math.random() * 35),
              Math.floor(20 + Math.random() * 40),
              Math.floor(25 + Math.random() * 45),
              Math.floor(30 + Math.random() * 50),
              Math.floor(25 + Math.random() * 45),
              Math.floor(20 + Math.random() * 40),
              Math.floor(15 + Math.random() * 35),
              Math.floor(12 + Math.random() * 28),
              Math.floor(10 + Math.random() * 20),
            ]);
          } else {
            setAudioBars([6, 6, 6, 6, 6, 6, 6, 6, 6, 6]);
          }
        }
      }, 90);
    } else {
      if (visualizerTimerRef.current) {
        clearInterval(visualizerTimerRef.current);
        visualizerTimerRef.current = null;
      }
    }

    return () => {
      if (visualizerTimerRef.current) {
        clearInterval(visualizerTimerRef.current);
      }
    };
  }, [activeCall?.status, activeCall?.isDriverSpeaking, activeCall?.isMuted]);

  if (!activeCall) return null;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeypadPress = (key: string) => {
    callAudioEngine.playDTMFTone(key);
    setTypedDigits((prev) => (prev + key).slice(-14));
  };

  const quickPhrases = [
    'Where are you currently?',
    'I am waiting at the gate',
    'Please bring safety helmet',
    'How long will it take?',
    'I have cash ready for fare',
  ];

  // 1. MINIMIZED PICTURE-IN-PICTURE FLOATING CALL BAR
  if (activeCall.isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900/95 backdrop-blur-md border border-amber-500/40 shadow-2xl p-2.5 sm:p-3 rounded-2xl animate-in slide-in-from-bottom-3 max-w-sm">
        <div className="relative">
          <img
            src={activeCall.receiverPhoto}
            alt={activeCall.receiverName}
            className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
        </div>

        <div className="flex flex-col min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-white truncate max-w-[120px]">
              {activeCall.receiverName}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              {activeCall.status === 'connected' ? formatDuration(activeCall.durationSeconds) : 'Calling...'}
            </span>
          </div>
          <p className="text-[10px] text-amber-400/90 font-medium">Direct In-App Call</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleCallMute}
            className={`p-2 rounded-lg text-xs transition-colors ${
              activeCall.isMuted
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
            title={activeCall.isMuted ? 'Unmute' : 'Mute'}
          >
            {activeCall.isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={toggleCallMinimized}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Expand Full Call Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={endCall}
            className="p-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors"
            title="End Call"
          >
            <PhoneOff className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 2. FULL IN-APP CALL SCREEN MODAL
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative bg-slate-950 border border-slate-800 w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col items-center justify-between min-h-[580px] overflow-hidden">
        {/* Top Header Bar */}
        <div className="w-full flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div className="text-left">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400" />
                UKADA Direct In-App VoIP
              </span>
              <p className="text-[10px] text-slate-400">No airtime or 3rd-party apps required</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleCallMinimized}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="Minimize to floating bar"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Calling / Connected Profile Area */}
        <div className="flex flex-col items-center text-center my-auto py-4 w-full">
          {/* Animated Avatar Radar */}
          <div className="relative my-3">
            {activeCall.status === 'outgoing_ringing' && (
              <>
                <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
                <div className="absolute -inset-4 rounded-full border border-amber-500/30 animate-pulse" />
              </>
            )}

            {activeCall.status === 'connected' && (
              <div
                className={`absolute -inset-3 rounded-full transition-all duration-300 ${
                  activeCall.isDriverSpeaking
                    ? 'border-2 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.4)] animate-pulse'
                    : 'border border-emerald-500/40'
                }`}
              />
            )}

            <img
              src={activeCall.receiverPhoto}
              alt={activeCall.receiverName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-slate-800 shadow-2xl relative z-10"
            />

            <div className="absolute bottom-0 right-1 z-20 w-7 h-7 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-slate-950 shadow-md">
              <Phone className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Receiver Info */}
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-2">
            {activeCall.receiverName}
          </h2>

          <div className="flex items-center gap-2 mt-1">
            {activeCall.receiverCode && (
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-semibold border border-slate-700">
                {activeCall.receiverCode}
              </span>
            )}
            {activeCall.vehiclePlate && (
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-semibold border border-slate-800">
                {activeCall.vehiclePlate}
              </span>
            )}
          </div>

          {activeCall.vehicleInfo && (
            <p className="text-xs text-slate-400 mt-1">{activeCall.vehicleInfo}</p>
          )}

          {/* Live Status Call Pill */}
          <div className="mt-3">
            {activeCall.status === 'outgoing_ringing' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs text-amber-300 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Ringing Driver Handset...</span>
              </div>
            )}

            {activeCall.status === 'connected' && (
              <div className="flex flex-col items-center gap-1.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-mono font-bold tabular-nums">
                    {formatDuration(activeCall.durationSeconds)}
                  </span>
                  <span>&middot; HD In-App Audio</span>
                </div>

                {activeCall.isDriverSpeaking && (
                  <span className="text-[11px] font-semibold text-amber-400 animate-pulse flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Driver speaking...
                  </span>
                )}
              </div>
            )}

            {activeCall.status === 'ended' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full text-xs text-rose-300">
                <span>Call Ended</span>
              </div>
            )}
          </div>

          {/* Live Audio Frequency Visualizer (Connected state) */}
          {activeCall.status === 'connected' && (
            <div className="w-full max-w-xs mt-4 p-3 bg-slate-900/60 rounded-2xl border border-slate-800/80 flex flex-col items-center gap-2">
              <div className="flex items-center justify-between w-full text-[10px] text-slate-400 px-1">
                <span>Live Audio Stream</span>
                <span>{activeCall.isMuted ? 'Mic Muted' : 'Encrypted VoIP'}</span>
              </div>

              <div className="flex items-end justify-center gap-1.5 h-10 w-full px-4">
                {audioBars.map((height, idx) => (
                  <div
                    key={idx}
                    className={`w-1.5 rounded-full transition-all duration-75 ${
                      activeCall.isDriverSpeaking
                        ? 'bg-amber-400'
                        : activeCall.isMuted
                        ? 'bg-slate-700'
                        : 'bg-emerald-400'
                    }`}
                    style={{ height: `${Math.max(6, height)}%` }}
                  />
                ))}
              </div>

              {/* Driver Voice Transcript Bubble */}
              {activeCall.lastSpeechText && (
                <div className="mt-1 w-full p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-left flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-amber-400 block">
                      Driver Samuel:
                    </span>
                    <p className="text-xs text-slate-200 italic leading-snug">
                      &ldquo;{activeCall.lastSpeechText}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Interactive Quick Conversation Buttons */}
          {activeCall.status === 'connected' && (
            <div className="w-full mt-3 flex flex-wrap justify-center gap-1.5 max-w-sm">
              {quickPhrases.map((phrase, i) => (
                <button
                  key={i}
                  onClick={() => sendCallQuickVoiceMessage(phrase)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors"
                >
                  💬 {phrase}
                </button>
              ))}
            </div>
          )}

          {/* DTMF Keypad View (if opened) */}
          {showKeypad && (
            <div className="mt-3 p-3 bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xs animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-mono text-amber-400">
                  {typedDigits || 'Press dialpad keys'}
                </span>
                <button
                  onClick={() => setShowKeypad(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                  <button
                    key={k}
                    onClick={() => handleKeypadPress(k)}
                    className="py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-sm font-mono font-bold text-white active:bg-amber-500 active:text-slate-950 transition-colors"
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Call Action Controls (Bottom Bar) */}
        <div className="w-full pt-4 border-t border-slate-800/80 flex flex-col items-center gap-3">
          <div className="flex items-center justify-center gap-4 sm:gap-6 w-full">
            {/* Mute Button */}
            <button
              onClick={toggleCallMute}
              disabled={activeCall.status !== 'connected'}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-colors ${
                activeCall.isMuted
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              } ${activeCall.status !== 'connected' ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {activeCall.isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="text-[10px] font-medium">{activeCall.isMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            {/* Speaker Button */}
            <button
              onClick={toggleCallSpeaker}
              disabled={activeCall.status !== 'connected'}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-colors ${
                activeCall.isSpeakerOn
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              } ${activeCall.status !== 'connected' ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {activeCall.isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[10px] font-medium">Speaker</span>
            </button>

            {/* Keypad Toggle Button */}
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              disabled={activeCall.status !== 'connected'}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl bg-slate-900 text-slate-300 hover:bg-slate-800 transition-colors ${
                showKeypad ? 'border border-amber-500/40 text-amber-300' : ''
              } ${activeCall.status !== 'connected' ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <Grid className="w-5 h-5" />
              <span className="text-[10px] font-medium">Keypad</span>
            </button>

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 active:scale-95 transition-all"
            >
              <PhoneOff className="w-5 h-5" />
              <span className="text-[10px] font-bold">End Call</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted In-App Audio &middot; High Definition &middot; Direct Link</span>
          </div>
        </div>
      </div>
    </div>
  );
};
