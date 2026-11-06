'use client';
import { useState } from 'react';
import { useJamStore } from '@/stores/jam.store';
import { useAuthStore } from '@/stores/auth.store';
import { usePlayerStore } from '@/stores/player.store';
import { jamApi } from '@/lib/api';
import { toast } from '@/stores/toast.store';
import { sendJamReaction, broadcastJamAction } from '@/hooks/useJamSocket';
import {
  Radio,
  Users,
  Copy,
  Check,
  Crown,
  X,
  LogOut,
  Sparkles,
  Shield,
  Music,
} from 'lucide-react';

export function JamModal() {
  const { isModalOpen, closeModal, isInJam, jamCode, isHost, hostName, hostControlsOnly, participants, setJamSession, leaveJam, setHostControlsOnly } = useJamStore();
  const { user } = useAuthStore();
  const currentSong = usePlayerStore((s) => s.currentSong);

  const [copied, setCopied] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  if (!isModalOpen) return null;

  const handleCreateJam = async () => {
    setIsCreating(true);
    try {
      const res = await jamApi.createJam({
        hostControlsOnly: false,
        initialSongId: currentSong?.id,
      });
      setJamSession(res.data, true);
      toast.success(`Jam started! Code: ${res.data.code}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start Jam');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinJam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    setIsJoining(true);
    try {
      const res = await jamApi.joinJam(joinCodeInput.trim().toUpperCase());
      setJamSession(res.data, res.data.hostId === user?.id);
      toast.success(`Joined ${res.data.host?.displayName || 'Host'}'s Jam!`);
      setJoinCodeInput('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Jam session not found');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveJam = async () => {
    if (!jamCode) return;
    try {
      await jamApi.leaveJam(jamCode);
      leaveJam();
      toast.info('Left the Jam');
      closeModal();
    } catch {
      leaveJam();
      closeModal();
    }
  };

  const handleCopyLink = () => {
    if (!jamCode) return;
    const url = `${window.location.origin}/jam/${jamCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Invite link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleHostControls = async () => {
    if (!isHost || !jamCode) return;
    const nextVal = !hostControlsOnly;
    setHostControlsOnly(nextVal);
    try {
      await jamApi.updateJam(jamCode, { hostControlsOnly: nextVal });
      toast.success(nextVal ? 'Only host can control playback' : 'Anyone in the Jam can control playback');
    } catch {}
  };

  const emojis = ['🔥', '❤️', '🎉', '💃', '👏', '🎵'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0f1422] p-6 shadow-2xl text-white">
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 h-36 w-36 rounded-full bg-[#E2720A]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-[#0F6B45]/20 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#E2720A] to-[#ff9838] text-white shadow-lg shadow-orange-500/20">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Sonicly Jam</h2>
              <p className="text-xs text-neutral-400">Synchronized group listening</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-5 space-y-5 relative z-10">
          {!isInJam ? (
            /* Start or Join view */
            <div className="space-y-6">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                <Sparkles className="mx-auto h-7 w-7 text-[#E2720A] mb-2" />
                <h3 className="font-semibold text-sm">Listen together in real-time</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Invite friends to listen to the same music in sync, queue up tracks collaboratively, and react live.
                </p>
                <button
                  onClick={handleCreateJam}
                  disabled={isCreating}
                  className="mt-4 w-full py-2.5 px-4 rounded-xl font-medium text-sm bg-gradient-to-r from-[#E2720A] to-[#f0851f] hover:brightness-110 active:scale-[0.98] transition shadow-lg shadow-[#E2720A]/25 disabled:opacity-50"
                >
                  {isCreating ? 'Starting Jam...' : 'Start a Jam'}
                </button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0f1422] px-3 text-neutral-500">or join a friend</span>
                </div>
              </div>

              <form onSubmit={handleJoinJam} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Jam code (e.g. JAM-9281)"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E2720A] transition uppercase tracking-wider font-mono"
                />
                <button
                  type="submit"
                  disabled={isJoining || !joinCodeInput.trim()}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition disabled:opacity-50"
                >
                  {isJoining ? 'Joining...' : 'Join'}
                </button>
              </form>
            </div>
          ) : (
            /* Active Jam view */
            <div className="space-y-5">
              {/* Jam Code Banner */}
              <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-orange-500/10 to-emerald-500/10 border border-white/10 p-3.5">
                <div>
                  <span className="text-[11px] font-medium tracking-wide text-neutral-400 uppercase">Jam Code</span>
                  <div className="text-xl font-bold font-mono tracking-widest text-[#E2720A]">{jamCode}</div>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-white transition active:scale-95"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Invite Link'}
                </button>
              </div>

              {/* Host Permissions Toggle */}
              {isHost && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-neutral-400" />
                    <div>
                      <div className="font-medium text-neutral-200">Host Controls Only</div>
                      <div className="text-[11px] text-neutral-400">Only you can play, pause, and seek</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleHostControls}
                    className={`w-10 h-5 rounded-full transition p-0.5 flex items-center ${hostControlsOnly ? 'bg-[#E2720A] justify-end' : 'bg-white/20 justify-start'}`}
                  >
                    <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              )}

              {/* Live Reactions Bar */}
              <div>
                <span className="text-[11px] font-medium tracking-wide text-neutral-400 uppercase">React in real-time</span>
                <div className="flex items-center justify-between gap-1 mt-1.5 p-2 rounded-xl bg-white/5 border border-white/10">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => sendJamReaction(emoji)}
                      className="text-xl p-2 rounded-lg hover:bg-white/10 hover:scale-125 active:scale-95 transition"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Participants list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium tracking-wide text-neutral-400 uppercase flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    Listeners ({participants.length})
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">● Synchronized</span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {participants.map((p) => (
                    <div
                      key={p.userId}
                      className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-white/5 border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-[10px] uppercase overflow-hidden">
                          {p.userAvatar ? (
                            <img src={p.userAvatar} alt="" className="h-full w-full object-cover" />
                          ) : (
                            p.userName.slice(0, 2)
                          )}
                        </div>
                        <span className="font-medium text-neutral-200">{p.userName}</span>
                        {p.userId === user?.id && <span className="text-[10px] text-neutral-400">(You)</span>}
                      </div>
                      {p.isHost && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#E2720A] bg-[#E2720A]/10 px-2 py-0.5 rounded-full border border-[#E2720A]/30">
                          <Crown className="h-3 w-3" /> Host
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Leave Jam button */}
              <button
                onClick={handleLeaveJam}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition"
              >
                <LogOut className="h-4 w-4" />
                {isHost && participants.length === 1 ? 'End Jam' : 'Leave Jam'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

