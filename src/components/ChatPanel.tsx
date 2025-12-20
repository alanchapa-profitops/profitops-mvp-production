'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage, AttachedFile } from '@/types';
import { formatTime } from '@/lib/utils';

interface ChatPanelProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (message: string, files: AttachedFile[]) => void;
  onNewConversation: () => void;
  onDownload: (format: 'md' | 'pdf') => void;
}

const QUICK_ACTIONS = [
  { label: 'Analizar alertas', text: 'Analiza mis alertas de hoy y dame las 3 acciones mas urgentes' },
  { label: 'Plan semanal', text: 'Dame un plan de accion para esta semana basado en mi pipeline' },
  { label: 'Deals a cerrar', text: 'Que deals debo priorizar para cerrar este mes?' },
];

export function ChatPanel({
  messages,
  isTyping,
  onSendMessage,
  onNewConversation,
  onDownload,
}: ChatPanelProps) {
  const [inputValue, setInputValue] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() && attachedFiles.length === 0) return;
    onSendMessage(inputValue || 'Analiza estos documentos', attachedFiles);
    setInputValue('');
    setAttachedFiles([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const maxSize = 5 * 1024 * 1024;
    const maxFiles = 5;

    if (attachedFiles.length + files.length > maxFiles) {
      alert(`Maximo ${maxFiles} archivos a la vez.`);
      return;
    }

    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        alert(`El archivo "${file.name}" es muy grande. Maximo 5MB por archivo.`);
        continue;
      }

      const extension = file.name.split('.').pop()?.toLowerCase();
      let content = '';
      let type: 'text' | 'image' = 'text';

      try {
        if (extension === 'txt' || extension === 'vtt') {
          content = await readTextFile(file);
        } else if (['png', 'jpg', 'jpeg', 'webp'].includes(extension || '')) {
          content = await readImageFile(file);
          type = 'image';
        } else {
          alert(`Formato no soportado: ${file.name}`);
          continue;
        }

        setAttachedFiles((prev) => [...prev, { name: file.name, content, type }]);
      } catch {
        alert(`Error al leer: ${file.name}`);
      }
    }

    e.target.value = '';
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-[45%] max-[900px]:w-full max-[900px]:h-[50vh] max-[900px]:border-t max-[900px]:border-l-0 border-l border-[var(--border-color)] flex flex-col bg-[rgba(26,39,68,0.5)]">
      {/* Legend */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-[15px_20px] m-[15px_20px]">
        <div className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-[1.5px] mb-3">
          Leyenda de Alertas
        </div>
        <div className="flex flex-col gap-2">
          <LegendItem icon="!" color="red" text="Sin actividad | Actividad atrasada | Fecha de cierre vencida" />
          <LegendItem icon="OK" color="green" text="Actividad programada para hoy" />
          <LegendItem icon="-" color="gray" text="Actividad programada para el futuro" />
        </div>
      </div>

      {/* Chat Header */}
      <div className="p-[20px_25px] border-b border-[var(--border-color)] bg-[var(--bg-secondary)] flex justify-between items-start">
        <div className="flex-1">
          <div className="text-lg font-semibold mb-1 flex items-center gap-[10px]">
            <div className="w-7 h-7 bg-[var(--accent-gradient)] rounded-lg flex items-center justify-center text-sm">
              T
            </div>
            Coach de Ventas B2B
          </div>
          <div className="text-xs text-[var(--text-muted)]">Tu asistente de coaching personalizado</div>
          <div className="flex items-center gap-[6px] mt-2">
            <div className="w-2 h-2 bg-[var(--alert-green)] rounded-full animate-pulse-custom" />
            <span className="text-[11px] text-[var(--alert-green)] uppercase tracking-[1px]">Activo</span>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowDownloadMenu(!showDownloadMenu)}
              className="bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)] px-[14px] py-2 rounded-lg text-xs cursor-pointer flex items-center gap-[6px] transition-all duration-200 hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:bg-[rgba(0,212,170,0.1)]"
            >
              Descargar
            </button>
            {showDownloadMenu && (
              <div className="absolute top-full right-0 mt-[5px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-lg overflow-hidden z-[100] min-w-[160px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                <button
                  onClick={() => { onDownload('md'); setShowDownloadMenu(false); }}
                  className="block w-full p-[10px_15px] bg-transparent border-none text-[var(--text-secondary)] text-[13px] text-left cursor-pointer transition-all duration-200 hover:bg-[var(--bg-hover)] hover:text-[var(--accent-cyan)]"
                >
                  Markdown (.md)
                </button>
                <button
                  onClick={() => { onDownload('pdf'); setShowDownloadMenu(false); }}
                  className="block w-full p-[10px_15px] bg-transparent border-none text-[var(--text-secondary)] text-[13px] text-left cursor-pointer transition-all duration-200 hover:bg-[var(--bg-hover)] hover:text-[var(--accent-cyan)]"
                >
                  PDF (.pdf)
                </button>
              </div>
            )}
          </div>
          <button
            onClick={onNewConversation}
            className="bg-transparent border border-[var(--border-color)] text-[var(--text-secondary)] px-[14px] py-2 rounded-lg text-xs cursor-pointer flex items-center gap-[6px] transition-all duration-200 hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:bg-[rgba(0,212,170,0.1)]"
          >
            Nueva conversacion
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-[15px]">
        {messages.map((msg, idx) => (
          <Message key={idx} message={msg} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-5 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="flex gap-2 mb-3 flex-wrap">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              onClick={() => onSendMessage(action.text, [])}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[20px] px-[14px] py-2 text-xs text-[var(--text-secondary)] cursor-pointer transition-all duration-200 hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:bg-[rgba(0,212,170,0.1)]"
            >
              {action.label}
            </button>
          ))}
        </div>

        {attachedFiles.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-[var(--bg-card)] border border-[var(--accent-cyan)] rounded-lg px-3 py-2 text-xs"
              >
                <span>{file.type === 'image' ? 'IMG' : 'TXT'}</span>
                <span className="max-w-[150px] truncate text-[var(--text-primary)]">{file.name}</span>
                <button
                  onClick={() => removeFile(idx)}
                  className="bg-transparent border-none text-[var(--text-muted)] cursor-pointer text-sm p-[2px_4px] rounded transition-all duration-200 hover:bg-[rgba(239,68,68,0.2)] hover:text-[var(--alert-red)]"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-3 items-end">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.vtt,.png,.jpg,.jpeg,.webp"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-[50px] h-[50px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200 text-[var(--text-secondary)] shrink-0 hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:bg-[rgba(0,212,170,0.1)]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu mensaje o comparte un transcript de llamada..."
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-[14px_18px] text-[var(--text-primary)] text-sm resize-none min-h-[50px] max-h-[120px] transition-all duration-200 focus:outline-none focus:border-[var(--accent-cyan)] focus:shadow-[0_0_0_3px_rgba(0,212,170,0.1)] placeholder:text-[var(--text-muted)]"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() && attachedFiles.length === 0}
            className="w-[50px] h-[50px] bg-[var(--accent-gradient)] border-none rounded-xl cursor-pointer flex items-center justify-center transition-all duration-200 shrink-0 hover:scale-105 hover:shadow-[var(--shadow-glow)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[var(--bg-primary)]">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const formattedContent = message.content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  return (
    <div className={`max-w-[85%] animate-message-in ${isUser ? 'self-end' : 'self-start'}`}>
      <div
        className={`p-[14px_18px] rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-[var(--accent-gradient)] text-[var(--bg-primary)] rounded-br-[4px]'
            : 'bg-[var(--bg-card)] border border-[var(--border-color)] rounded-bl-[4px]'
        }`}
        dangerouslySetInnerHTML={{ __html: formattedContent }}
      />
      <div className={`text-[10px] text-[var(--text-muted)] mt-[5px] px-[5px] ${isUser ? 'text-right' : ''}`}>
        {formatTime(message.timestamp)}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="self-start">
      <div className="flex gap-1 p-[14px_18px] bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl rounded-bl-[4px] w-fit">
        <div className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full typing-dot" />
        <div className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full typing-dot" />
        <div className="w-2 h-2 bg-[var(--accent-cyan)] rounded-full typing-dot" />
      </div>
    </div>
  );
}

function LegendItem({ icon, color, text }: { icon: string; color: string; text: string }) {
  const colors: Record<string, string> = {
    red: 'text-[var(--alert-red)]',
    green: 'text-[var(--alert-green)]',
    gray: 'text-[var(--text-muted)]',
  };

  return (
    <div className="flex items-center gap-[10px]">
      <span className={`text-sm w-5 text-center ${colors[color]}`}>{icon}</span>
      <span className="text-xs text-[var(--text-secondary)]">{text}</span>
    </div>
  );
}

function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
