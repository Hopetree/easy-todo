import { useState, useRef } from 'react';
import styles from './index.module.css';

interface Props {
  onAdd: (title: string) => void;
}

export function TaskEditor({ onAdd }: Props) {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const t = title.trim();
    if (!t) return;
    onAdd(t);
    setTitle('');
    inputRef.current?.focus();
  };

  return (
    <div className={styles.container}>
      <input
        ref={inputRef}
        className={styles.input}
        placeholder="添加任务..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmit();
        }}
      />
      <button className={styles.btn} onClick={handleSubmit}>
        +
      </button>
    </div>
  );
}
