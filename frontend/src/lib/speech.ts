const LANG_MAP: Record<string, string> = {
  en: "en-US",
  ms: "ms-MY",
  zh: "zh-CN",
  ta: "ta-IN",
};

export function speak(text: string, language: string = "en"): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAP[language] || "en-US";
    utterance.rate = 0.9;
    utterance.onend = () => resolve();
    utterance.onerror = () => reject();
    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  window.speechSynthesis?.cancel();
}
