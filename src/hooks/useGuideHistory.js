import { useState, useRef, useEffect } from 'react';

function useGuideHistory(ui) {
  const [guideHistory, setGuideHistory] = useState([]);
  const lastGuideKeyRef = useRef(null);

  useEffect(() => {
    if (!ui?.guide) return;

    const msg = ui.guide.message || '';
    const shortcut = ui.guide.shortcut || '-';

    if (!msg) return;

    const guideKey = ui.guide.interaction_id || `${msg}||${shortcut}`;

    if (lastGuideKeyRef.current === guideKey) return;
    lastGuideKeyRef.current = guideKey;

    setGuideHistory(prev => [
      ...prev,
      {
        id: guideKey,
        type: 'guide',
        from: 'bot',
        text: msg,
        shortcut,
        ts: Date.now()
      },
    ]);
  }, [ui?.guide]);

  return guideHistory;
}

export default useGuideHistory;
