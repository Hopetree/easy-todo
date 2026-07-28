import { useState, useRef, useEffect } from 'react';
import { IconHome, IconClipboard, IconCheck } from '@/components/Icon';
import styles from './index.module.css';

interface Props {
  onGenerateWeekly: () => string;
  onBack: () => void;
}

export function WeeklyReport({ onGenerateWeekly, onBack }: Props) {
  const [weeklyText, setWeeklyText] = useState<string>(() => onGenerateWeekly());
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
  }, [weeklyText]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <IconHome size={16} />
        </button>
        <h2 className={styles.title}>周报</h2>
        <button
          className={styles.regenerateBtn}
          onClick={() => setWeeklyText(onGenerateWeekly())}
        >
          <IconClipboard size={14} /> 重新生成
        </button>
      </header>

      <div className={styles.body}>
        <div className={styles.toolbar}>
          <button
            className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(weeklyText);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch {
                // clipboard API 不可用，静默失败
              }
            }}
          >
            {copied ? <><IconCheck size={14} /> 已复制</> : '复制'}
          </button>
        </div>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={weeklyText}
          onChange={(e) => {
            setWeeklyText(e.target.value);
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
          }}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
          }}
        />
      </div>
    </div>
  );
}
