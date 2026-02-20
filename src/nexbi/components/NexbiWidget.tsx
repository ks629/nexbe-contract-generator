'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Phone, ChevronDown, ExternalLink } from 'lucide-react';
import NexbiCharacter from './NexbiCharacter';
import { useNexbi } from './NexbiProvider';
import { processMessage } from '../engine/message-processor';
import type { ChatMessage, KnowledgeEntry, QuickSuggestion, NexbiCostume } from '../engine/types';

const COSTUME_SUBTITLES: Record<NexbiCostume, string> = {
  none: 'Asystent Energetyczny',
  doradca: 'Doradca Energetyczny',
  naukowiec: 'Ekspert Techniczny',
  inzynier: 'Specjalista Montażu',
  superhero: 'Strażnik Oszczędności',
  ekolog: 'Eko Doradca',
  nauczyciel: 'Przewodnik Wiedzy',
};

interface Props {
  knowledge: KnowledgeEntry[];
}

export default function NexbiWidget({ knowledge }: Props) {
  const nexbi = useNexbi();
  const { config, isOpen, messages, addMessage, currentEmotion, setEmotion, currentCostume, setCostume, isTyping, setIsTyping, hasInteracted, setHasInteracted, showLeadForm, setShowLeadForm, leadSubmitted, setLeadSubmitted, aiCallCount, incrementAiCalls } = nexbi;

  const [inputValue, setInputValue] = useState('');
  const [showBubble, setShowBubble] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [leadPhone, setLeadPhone] = useState('');
  const [leadName, setLeadName] = useState('');
  const [leadConsent, setLeadConsent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    const delay = config.bubbleDelay ?? 3000;
    const timer = setTimeout(() => {
      if (!dismissed && !isOpen) setShowBubble(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [dismissed, isOpen, config.bubbleDelay]);

  useEffect(() => {
    if (showBubble && !isOpen) {
      const timer = setTimeout(() => setShowBubble(false), 12000);
      return () => clearTimeout(timer);
    }
  }, [showBubble, isOpen]);

  // Idle timer: return to default costume + happy after 8s
  useEffect(() => {
    if (!isOpen || messages.length === 0) return;
    const timer = setTimeout(() => {
      setEmotion('happy');
      if (config.dynamicCostumes) {
        setCostume(config.defaultCostume ?? 'none');
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [messages, isOpen, setEmotion, setCostume, config.dynamicCostumes, config.defaultCostume]);

  const handleOpen = useCallback(() => {
    nexbi.open();
    setShowBubble(false);
    setHasInteracted(true);

    if (messages.length === 0) {
      setIsTyping(true);
      setEmotion('waving');
      setTimeout(() => {
        setIsTyping(false);
        addMessage({
          id: `nexbi-${Date.now()}`,
          text: config.greeting,
          sender: 'nexbi',
          emotion: 'waving',
          suggestions: config.suggestions,
        });
      }, 800);
    }
  }, [nexbi, messages.length, config.greeting, config.suggestions, addMessage, setIsTyping, setEmotion, setHasInteracted]);

  const handleClose = useCallback(() => {
    nexbi.close();
    setDismissed(true);
  }, [nexbi]);

  const handleScrollTo = useCallback((target: string) => {
    nexbi.close();
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [nexbi]);

  const processUserMessage = useCallback(async (text: string) => {
    const userMsg: ChatMessage = { id: `user-${Date.now()}`, text, sender: 'user' };
    addMessage(userMsg);
    setInputValue('');
    setIsTyping(true);
    setEmotion('thinking');

    const maxAiCalls = config.maxAiCallsPerSession ?? 10;
    const canUseAi = (config.enableAiFallback ?? false) && aiCallCount < maxAiCalls;

    const result = await processMessage(text, {
      knowledge,
      fallbackMessage: config.fallbackMessage,
      persona: config.persona,
      history: messages.map(m => ({ text: m.text, sender: m.sender })),
      enableAiFallback: canUseAi,
      apiEndpoint: config.apiEndpoint ?? '/api/nexbi/chat',
      confidenceThreshold: config.confidenceThreshold ?? 4,
    });

    if (result.source === 'ai') incrementAiCalls();

    const delay = 600 + Math.random() * 800;

    setTimeout(() => {
      setIsTyping(false);
      setEmotion(result.emotion);

      // Update costume (only if dynamic costumes enabled)
      if (config.dynamicCostumes && result.costume) {
        setCostume(result.costume);
      }

      let fullAnswer = result.answer;
      if (result.followUp) fullAnswer += '\n\n' + result.followUp;

      addMessage({
        id: `nexbi-${Date.now()}-${Math.random()}`,
        text: fullAnswer,
        sender: 'nexbi',
        emotion: result.emotion,
        costume: result.costume,
        scrollTarget: result.scrollTarget,
        suggestions: result.source === 'fallback' ? config.suggestions.slice(0, 4) : undefined,
        suggestConfigurator: result.suggestConfigurator,
      });

      // Lead form trigger
      if (config.enableLeadForm !== false && !leadSubmitted && !showLeadForm) {
        const nexbiMsgs = [...messages, userMsg].filter(m => m.sender === 'nexbi');
        const shouldPrompt = (result.showLeadPrompt && nexbiMsgs.length >= 2) || nexbiMsgs.length >= 3;
        if (shouldPrompt) {
          setTimeout(() => {
            setIsTyping(true);
            setTimeout(() => {
              setIsTyping(false);
              setShowLeadForm(true);
              const prompts = config.leadPromptMessages;
              addMessage({
                id: `nexbi-lead-${Date.now()}`,
                text: prompts[Math.floor(Math.random() * prompts.length)],
                sender: 'nexbi',
                emotion: 'excited',
              });
            }, 600);
          }, 1500);
        }
      }
    }, delay);
  }, [addMessage, setIsTyping, setEmotion, messages, knowledge, config, aiCallCount, incrementAiCalls, leadSubmitted, showLeadForm, setShowLeadForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    processUserMessage(inputValue.trim());
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadPhone.trim() || !leadConsent) return;
    setLeadSubmitted(true);
    setShowLeadForm(false);

    addMessage({
      id: `user-lead-${Date.now()}`,
      text: `${leadName ? leadName + ', ' : ''}${leadPhone}`,
      sender: 'user',
    });

    if (config.onLeadSubmit) {
      await config.onLeadSubmit({
        phone: leadPhone,
        name: leadName || undefined,
        consent: true,
        persona: config.persona,
        timestamp: new Date().toISOString(),
      });
    }

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({
        id: `nexbi-thanks-${Date.now()}`,
        text: `Dziękuję${leadName ? ', ' + leadName : ''}! Twój numer ${leadPhone} został zapisany. Nasz ekspert skontaktuje się w ciągu 24h. Do usłyszenia!`,
        sender: 'nexbi',
        emotion: 'excited',
      });
    }, 800);
  };

  const phoneNumber = config.phoneNumber ?? '732 080 101';
  const configuratorUrl = config.configuratorUrl ?? 'https://dotacjenamagazyny.nexbe.pl';
  const position = config.position ?? 'bottom-right';
  const positionClass = position === 'bottom-left' ? 'left-6' : 'right-6';

  return (
    <div className={`fixed bottom-4 sm:bottom-6 ${positionClass} z-50 flex flex-col items-end gap-3 nexbi-widget`}>
      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-[340px] sm:w-[380px] rounded-2xl overflow-hidden shadow-2xl shadow-black/40 mb-2 flex flex-col"
            style={{
              background: 'linear-gradient(145deg, rgba(26, 10, 46, 0.98), rgba(13, 0, 25, 0.99))',
              maxHeight: 'min(580px, calc(100vh - 120px))',
            }}
          >
            {/* Header */}
            <div className="relative px-5 py-4 bg-gradient-to-r from-[#B5005D] to-[#FF004E] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-[72px] h-[72px] rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm overflow-hidden border border-white/10">
                  <NexbiCharacter size={68} emotion={currentEmotion} costume={currentCostume} enableEyeTracking />
                </div>
                <div>
                  <p className="font-bold text-sm text-white tracking-wide">NEXBI</p>
                  <p className="text-[10px] text-white/70 uppercase tracking-wider">
                    {config.dynamicCostumes
                      ? COSTUME_SUBTITLES[currentCostume] || config.subtitle || 'Asystent Energetyczny'
                      : config.subtitle ?? 'Asystent Energetyczny'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[9px] text-white/50">Online</span>
                  </div>
                </div>
              </div>
              <button onClick={handleClose} className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors" aria-label="Zamknij czat">
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0" style={{ maxHeight: '320px' }}>
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.sender === 'nexbi' ? (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#B5005D] to-[#FF004E] flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                        <NexbiCharacter size={24} emotion={msg.emotion || 'happy'} costume={msg.costume} />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="bg-white/[0.08] rounded-2xl rounded-tl-md px-4 py-3 text-[13px] text-white/90 leading-relaxed whitespace-pre-line">
                          {msg.text}
                        </div>
                        {(msg.scrollTarget || msg.suggestConfigurator) && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {msg.suggestConfigurator && config.enableSuggestConfigurator !== false && (
                              <a href={configuratorUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#B5005D]/20 to-[#FF004E]/15 border border-[#B5005D]/30 text-[11px] text-[#FF004E] font-semibold hover:from-[#B5005D]/30 hover:to-[#FF004E]/25 transition-all">
                                <ExternalLink className="w-3 h-3" />
                                <span>Otwórz konfigurator</span>
                              </a>
                            )}
                            {msg.scrollTarget && config.enableScrollTo !== false && (
                              <button onClick={() => handleScrollTo(msg.scrollTarget!)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-white/60 hover:bg-white/10 hover:text-white/80 transition-all">
                                <ChevronDown className="w-3 h-3" />
                                <span>Przejdź do sekcji</span>
                              </button>
                            )}
                          </div>
                        )}
                        {msg.suggestions && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {msg.suggestions.map((s: QuickSuggestion, i: number) => (
                              <button key={i} onClick={() => processUserMessage(s.label)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/70 hover:bg-white/10 hover:text-white hover:border-[#B5005D]/30 transition-all">
                                <span>{s.icon}</span>
                                <span>{s.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex justify-end">
                      <div className="bg-gradient-to-r from-[#B5005D]/30 to-[#FF004E]/20 border border-[#B5005D]/20 rounded-2xl rounded-tr-md px-4 py-3 text-[13px] text-white/90 leading-relaxed max-w-[85%]">
                        {msg.text}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#B5005D] to-[#FF004E] flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                    <NexbiCharacter size={24} emotion="thinking" costume={currentCostume} />
                  </div>
                  <div className="bg-white/[0.08] rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
                    <motion.span className="w-1.5 h-1.5 rounded-full bg-white/50" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
                    <motion.span className="w-1.5 h-1.5 rounded-full bg-white/50" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
                    <motion.span className="w-1.5 h-1.5 rounded-full bg-white/50" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
                  </div>
                </motion.div>
              )}

              {/* Lead form */}
              {showLeadForm && !leadSubmitted && config.enableLeadForm !== false && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mx-1">
                  <form onSubmit={handleLeadSubmit} className="bg-white/5 border border-[#B5005D]/20 rounded-xl p-4 space-y-3">
                    <p className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">Zostaw dane — oddzwonimy!</p>
                    <input type="text" placeholder="Imię (opcjonalne)" value={leadName} onChange={(e) => setLeadName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-white/[0.08] border border-white/10 text-sm text-white placeholder-white/30 focus:border-[#B5005D]/50 focus:outline-none transition-colors" />
                    <input type="tel" placeholder="Numer telefonu *" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-white/[0.08] border border-white/10 text-sm text-white placeholder-white/30 focus:border-[#B5005D]/50 focus:outline-none transition-colors" />
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input type="checkbox" checked={leadConsent} onChange={(e) => setLeadConsent(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 rounded border-white/20 bg-white/5 accent-[#B5005D]" />
                      <span className="text-[10px] text-white/40 leading-snug">
                        Zgadzam się na przetwarzanie danych zgodnie z{' '}
                        <a href="/polityka-prywatnosci" target="_blank" rel="noopener noreferrer" className="text-[#FF004E]/70 hover:text-[#FF004E] underline">Polityką Prywatności</a>. *
                      </span>
                    </label>
                    <button type="submit" disabled={!leadConsent} className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#B5005D] to-[#FF004E] text-white text-sm font-semibold hover:shadow-lg hover:shadow-[#B5005D]/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                      Zadzwońcie do mnie
                    </button>
                  </form>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-white/5 px-4 py-3 bg-black/20">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={config.inputPlaceholder ?? 'Zadaj pytanie...'} className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.08] border border-white/10 text-sm text-white placeholder-white/30 focus:border-[#B5005D]/40 focus:outline-none transition-colors" />
                <button type="submit" disabled={!inputValue.trim()} className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#B5005D] to-[#FF004E] flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#B5005D]/30 transition-all">
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {config.phoneNumber && (
                <a href={`tel:+48${phoneNumber.replace(/\s/g, '')}`} className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 text-[11px] text-white/40 hover:text-white/70 transition-colors">
                  <Phone className="w-3 h-3" />
                  <span>Wolisz zadzwonić? {phoneNumber}</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble hint */}
      <AnimatePresence>
        {showBubble && !isOpen && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="relative bg-white text-gray-900 rounded-2xl rounded-br-sm px-4 py-3 text-sm shadow-xl max-w-[240px] cursor-pointer mb-1" onClick={handleOpen}>
            <p className="font-medium leading-snug">
              {config.bubbleText ?? 'Masz pytanie? '}<span className="text-[#B5005D] font-semibold">Zapytaj mnie!</span>
            </p>
            <button onClick={(e) => { e.stopPropagation(); setShowBubble(false); setDismissed(true); }} className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] hover:bg-gray-300" aria-label="Zamknij">
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={isOpen ? handleClose : handleOpen}
        className="relative w-[88px] h-[88px] md:w-[176px] md:h-[176px] rounded-full bg-gradient-to-br from-[#FF004E]/15 to-[#B5005D]/10 flex items-center justify-center transition-all cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isOpen ? 'Zamknij NEXBI' : 'Otwórz NEXBI'}
        style={{ filter: 'drop-shadow(0 4px 20px rgba(255, 0, 78, 0.4)) drop-shadow(0 0 40px rgba(181, 0, 93, 0.25))', boxShadow: '0 0 30px rgba(255, 0, 78, 0.2), inset 0 0 20px rgba(255, 0, 78, 0.05)' }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#B5005D] to-[#FF004E] flex items-center justify-center shadow-lg shadow-[#B5005D]/40">
              <X className="w-5 h-5 md:w-10 md:h-10 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.2 }} className="md:scale-[2]">
              <NexbiCharacter size={80} emotion="happy" costume={currentCostume} enableEyeTracking />
            </motion.div>
          )}
        </AnimatePresence>
        {!hasInteracted && !isOpen && <span className="absolute inset-0 rounded-full animate-ping bg-[#FF004E]/30 pointer-events-none" />}
        {!hasInteracted && !isOpen && <span className="absolute inset-2 md:inset-4 rounded-full animate-pulse bg-[#B5005D]/15 pointer-events-none" />}
        {!hasInteracted && !isOpen && (
          <span className="absolute top-0 right-0 w-5 h-5 md:w-8 md:h-8 rounded-full bg-[#FF004E] border-2 md:border-[3px] border-white flex items-center justify-center shadow-[0_0_8px_rgba(255,0,78,0.6)]">
            <span className="w-1.5 h-1.5 md:w-3 md:h-3 rounded-full bg-white" />
          </span>
        )}
      </motion.button>
    </div>
  );
}
