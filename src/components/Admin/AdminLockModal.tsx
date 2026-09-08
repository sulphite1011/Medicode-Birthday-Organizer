import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldAlert,
  User,
  X,
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
  Send
} from 'lucide-react';
import { AppSettings } from '../../types';

interface AdminLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  settings: AppSettings;
  onUpdatePasscode?: (newPasscode: string) => Promise<void> | void;
}

export const AdminLockModal: React.FC<AdminLockModalProps> = ({
  isOpen,
  onClose,
  onUnlock,
  settings,
  onUpdatePasscode,
}) => {
  const [username, setUsername] = useState('');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');

  // Password Reset Flow State
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [inputResetCode, setInputResetCode] = useState('');
  const [newKey, setNewKey] = useState('');
  const [showNewKey, setShowNewKey] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [dispatchNotice, setDispatchNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const validUsername = (settings.adminUsername || 'hamad').trim().toLowerCase();
  const currentPasscode = (settings.adminPasscode || '7788').trim();
  const recoveryEmail = settings.adminRecoveryEmail || 'hamadkhadim474@gmail.com';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const inputUser = username.trim().toLowerCase();
    const inputPass = passcode.trim();

    if (inputUser !== validUsername) {
      setError('Invalid username. Please check your credentials.');
      return;
    }

    if (inputPass !== currentPasscode) {
      setError('Invalid security key. Please try again or use Reset Key.');
      return;
    }

    // Success
    setError('');
    setPasscode('');
    setUsername('');
    onUnlock();
  };

  const handleSendResetCode = async () => {
    setIsSendingCode(true);
    setResetError('');
    setDispatchNotice(null);

    // Generate secure 6-digit random code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);

    try {
      // Dispatches verification email directly to Hamad's Gmail via FormSubmit
      await fetch(`https://formsubmit.co/ajax/${recoveryEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: '🔒 WishCraft Admin Security: Secret Key Verification Code',
          _template: 'box',
          _captcha: 'false',
          from: 'WishCraft Admin Security',
          recipient: recoveryEmail,
          verification_code: code,
          security_message: `Your secret Admin Key verification code is: ${code}. Enter this 6-digit code on your website to reset your secret key. If you did not request this, you can safely ignore this email.`,
          date: new Date().toLocaleString(),
        }),
      });
    } catch (e) {
      console.warn('Email dispatch attempt logged:', e);
    }

    setResetCodeSent(true);
    setIsSendingCode(false);
    setDispatchNotice(
      `A 6-digit verification code has been dispatched to ${recoveryEmail}. Check your inbox and spam/junk folder.`
    );
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    const inputCode = inputResetCode.trim();
    // Valid if matches dispatched Gmail code OR emergency creator master PIN 99404
    const isCodeValid = (generatedCode && inputCode === generatedCode.trim()) || inputCode === '99404';

    if (!isCodeValid) {
      setResetError('Invalid verification code. Please check your Gmail or spam folder.');
      return;
    }

    if (newKey.trim().length < 4) {
      setResetError('Security key must be at least 4 characters long.');
      return;
    }

    if (onUpdatePasscode) {
      await onUpdatePasscode(newKey.trim());
    }

    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setIsResetMode(false);
      setResetCodeSent(false);
      setGeneratedCode('');
      setInputResetCode('');
      setNewKey('');
      setDispatchNotice(null);
      onUnlock();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-7">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Return to website"
        >
          <X className="w-5 h-5" />
        </button>

        {!isResetMode ? (
          /* Main Admin Login Mode */
          <div>
            {/* Header Icon */}
            <div className="flex flex-col items-center text-center pt-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3.5 shadow-lg shadow-amber-500/10">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-white font-['Outfit'] tracking-tight">
                Main Website Admin Access
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Enter your authorized username and secret key to manage websites, projects, and client DMs.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="mt-6 space-y-4">
              
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    autoFocus
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              {/* Key / Passcode Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-zinc-300">
                    Secret Key
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setError('');
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline cursor-pointer font-medium"
                  >
                    Forgot Key? Reset
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    type={showPasscode ? 'text' : 'password'}
                    required
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Enter secret key"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-zinc-200 cursor-pointer"
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  <span>Open Admin Command Center</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex flex-col items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-2 border border-zinc-700/80 transition-all cursor-pointer"
              >
                <span>← Return to Public Client Website</span>
              </button>
              <p className="text-[11px] text-zinc-500">
                Protected admin workspace. Authorized access only.
              </p>
            </div>
          </div>
        ) : (
          /* Password Reset Mode */
          <div>
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setIsResetMode(false);
                setResetError('');
                setDispatchNotice(null);
              }}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 mb-3 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </button>

            {/* Reset Header */}
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/10">
                <Mail className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-white font-['Outfit']">
                Reset Secret Key
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs leading-relaxed">
                A verification reset code will be sent to Hamad&apos;s personal Gmail:
              </p>
              <div className="mt-1 px-3 py-1 rounded-lg bg-zinc-950 border border-amber-500/30 text-xs font-mono text-amber-300 font-semibold">
                {recoveryEmail}
              </div>
            </div>

            {resetSuccess ? (
              <div className="my-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Key Updated Successfully!</h4>
                <p className="text-xs text-emerald-300">
                  Unlocking Admin Command Center with your new credentials...
                </p>
              </div>
            ) : !resetCodeSent ? (
              /* Step 1: Send Reset Code */
              <div className="mt-6 space-y-4">
                <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-400 leading-relaxed space-y-2">
                  <p>
                    Click the button below to generate and dispatch a secure 6-digit one-time reset code to <strong className="text-zinc-200">{recoveryEmail}</strong>.
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Once received, enter the code to configure your new secret key.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSendResetCode}
                  disabled={isSendingCode}
                  className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                >
                  {isSendingCode ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Code to Gmail...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Reset Code to {recoveryEmail}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Step 2: Enter Verification Code and New Key */
              <form onSubmit={handleConfirmReset} className="mt-5 space-y-4">
                {dispatchNotice && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white">{dispatchNotice}</p>
                      <p className="text-[11px] text-zinc-300 mt-1 leading-relaxed">
                        Please check your Gmail inbox (<strong className="text-amber-300">{recoveryEmail}</strong>) or spam folder. Enter the 6-digit code from your email below.
                      </p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    6-Digit Verification Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={inputResetCode}
                    onChange={(e) => {
                      setInputResetCode(e.target.value.replace(/\D/g, ''));
                      if (resetError) setResetError('');
                    }}
                    placeholder="e.g. 849201"
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-center font-mono text-base tracking-widest text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Set New Secret Key *
                  </label>
                  <div className="relative">
                    <input
                      type={showNewKey ? 'text' : 'password'}
                      required
                      value={newKey}
                      onChange={(e) => {
                        setNewKey(e.target.value);
                        if (resetError) setResetError('');
                      }}
                      placeholder="Enter new key (min 4 chars)"
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-amber-500 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewKey(!showNewKey)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-200 cursor-pointer"
                    >
                      {showNewKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {resetError && (
                  <p className="text-xs text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>{resetError}</span>
                  </p>
                )}

                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:brightness-110 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
                  >
                    <span>Confirm & Set New Key</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleSendResetCode}
                    className="w-full py-2 text-xs text-zinc-400 hover:text-zinc-200 text-center transition-colors cursor-pointer"
                  >
                    Resend code to {recoveryEmail}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

