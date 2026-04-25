const LANG_MAP: Record<string, string> = {
  en: "en-US",
  ms: "ms-MY",
  zh: "zh-CN",
  "zh-HK": "zh-HK",
  ta: "ta-IN",
};

// Prefer natural/premium voices when available (Chrome on macOS/Windows has these)
const PREFERRED_VOICES: Record<string, string[]> = {
  "en-US": ["Samantha", "Google US English", "Microsoft Aria", "Karen", "Moira"],
  "ms-MY": ["Google Bahasa Melayu", "Amira"],
  "zh-CN": ["Tingting", "Google 普通话", "Microsoft Xiaoxiao"],
  "zh-HK": ["Sinji", "Google 粤語"],
  "ta-IN": ["Google தமிழ்"],
};

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const preferred = PREFERRED_VOICES[lang] || [];
  // Try preferred voices first
  for (const name of preferred) {
    const v = voices.find(v => v.name.includes(name));
    if (v) return v;
  }
  // Fallback: any voice matching the language
  return voices.find(v => v.lang === lang || v.lang.startsWith(lang.split("-")[0])) || null;
}

export function speak(text: string, language: string = "en"): Promise<void> {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const lang = LANG_MAP[language] || "en-US";
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    const voice = pickVoice(lang);
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  window.speechSynthesis?.cancel();
}
