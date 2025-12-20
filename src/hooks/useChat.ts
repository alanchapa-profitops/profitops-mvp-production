'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, AttachedFile } from '@/types';
import { N8N_CHAT_URL, CHAT_STORAGE_KEY, COACH_SYSTEM_PROMPT } from '@/lib/constants';

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: `Hola Alan! Soy tu Coach de Ventas B2B personal.

Estoy conectado a tu pipeline de Pipedrive y listo para ayudarte con:

- Analisis de tus llamadas de ventas (scoring 0-100)
- Coaching personalizado usando SPIN, Challenger y MEDDIC
- Preparacion para llamadas importantes
- Identificar patrones de mejora

En que te puedo ayudar hoy?`,
  timestamp: new Date(),
};

export function useChat(pipelineContext: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem(CHAT_STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        if (parsed.length > 0) {
          const messagesWithDates = parsed.map((msg: ChatMessage) => ({
            ...msg,
            timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          }));
          setMessages([WELCOME_MESSAGE, ...messagesWithDates]);
        }
      } catch (e) {
        console.error('Error loading chat history:', e);
      }
    }
  }, []);

  // Save chat history to localStorage
  const saveHistory = useCallback((msgs: ChatMessage[]) => {
    try {
      // Skip welcome message when saving
      const toSave = msgs.slice(1).slice(-50);
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(toSave));
    } catch (e) {
      console.error('Error saving chat history:', e);
    }
  }, []);

  const sendMessage = useCallback(
    async (message: string, files: AttachedFile[]) => {
      // Build full message with files
      let fullMessage = message;
      if (files.length > 0) {
        fullMessage += '\n\n';
        files.forEach((file, index) => {
          if (file.type === 'image') {
            fullMessage += `--- ARCHIVO ${index + 1}: ${file.name} (IMAGEN) ---\n[Imagen en base64: ${file.content.substring(0, 100)}...]\n\n`;
          } else {
            fullMessage += `--- ARCHIVO ${index + 1}: ${file.name} ---\n${file.content}\n\n`;
          }
        });
      }

      // Add user message
      const userMessage: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      try {
        const history = messages
          .slice(1) // Skip welcome
          .map((h) => `${h.role}: ${h.content}`)
          .join('\n');

        const response = await fetch(N8N_CHAT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system: COACH_SYSTEM_PROMPT,
            context: pipelineContext || 'No hay datos de pipeline cargados aun.',
            history,
            message: fullMessage,
          }),
        });

        const data = await response.json();

        let assistantContent = '';
        if (data.content && data.content[0]) {
          assistantContent = data.content[0].text;
        } else if (data.text) {
          assistantContent = data.text;
        } else {
          assistantContent = 'Recibi tu mensaje pero no pude procesar la respuesta. Intenta de nuevo.';
        }

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: assistantContent,
          timestamp: new Date(),
        };

        setMessages((prev) => {
          const updated = [...prev, assistantMessage];
          saveHistory(updated);
          return updated;
        });
      } catch (error) {
        console.error('Chat error:', error);
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: 'Lo siento, hubo un error al conectar con el Coach. Por favor verifica que el workflow este activo e intenta de nuevo.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [messages, pipelineContext, saveHistory]
  );

  const startNewConversation = useCallback(() => {
    if (messages.length > 1) {
      if (confirm('Iniciar nueva conversacion? El historial actual se borrara.')) {
        setMessages([WELCOME_MESSAGE]);
        localStorage.removeItem(CHAT_STORAGE_KEY);
      }
    }
  }, [messages.length]);

  const downloadConversation = useCallback(
    (format: 'md' | 'pdf') => {
      if (messages.length <= 1) {
        alert('No hay conversacion para descargar.');
        return;
      }

      const now = new Date();
      const dateStr = now.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
      });

      if (format === 'md') {
        let markdown = `# Conversacion con Coach de Ventas B2B\n`;
        markdown += `**Fecha:** ${dateStr} - ${timeStr}\n`;
        markdown += `**Usuario:** Alan Chapa\n\n`;
        markdown += `---\n\n`;

        messages.slice(1).forEach((msg) => {
          if (msg.role === 'user') {
            markdown += `## Alan\n\n${msg.content}\n\n`;
          } else {
            markdown += `## Coach\n\n${msg.content}\n\n`;
          }
          markdown += `---\n\n`;
        });

        const filename = `ProfitOps_Chat_${now.toISOString().split('T')[0]}_${now.getHours()}${String(now.getMinutes()).padStart(2, '0')}.md`;
        downloadFile(markdown, filename, 'text/markdown');
      } else {
        // PDF via print
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        let html = `<!DOCTYPE html><html><head><title>Conversacion ProfitOps - ${dateStr}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #333; line-height: 1.6; }
            h1 { color: #00d4aa; border-bottom: 2px solid #00d4aa; padding-bottom: 10px; }
            .meta { color: #666; margin-bottom: 30px; }
            .message { margin-bottom: 25px; padding: 15px; border-radius: 8px; }
            .user { background: #f0f9ff; border-left: 4px solid #0ea5e9; }
            .assistant { background: #f0fdf4; border-left: 4px solid #00d4aa; }
            .role { font-weight: bold; margin-bottom: 10px; font-size: 14px; }
            .user .role { color: #0ea5e9; }
            .assistant .role { color: #00d4aa; }
            .content { white-space: pre-wrap; font-size: 14px; }
          </style></head><body>
          <h1>Conversacion con Coach de Ventas B2B</h1>
          <div class="meta"><strong>Fecha:</strong> ${dateStr} - ${timeStr}<br><strong>Usuario:</strong> Alan Chapa</div>`;

        messages.slice(1).forEach((msg) => {
          const roleClass = msg.role === 'user' ? 'user' : 'assistant';
          const roleName = msg.role === 'user' ? 'Alan' : 'Coach';
          const content = msg.content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
          html += `<div class="message ${roleClass}"><div class="role">${roleName}</div><div class="content">${content}</div></div>`;
        });

        html += `<script>window.onload = function() { window.print(); }<\/script></body></html>`;
        printWindow.document.write(html);
        printWindow.document.close();
      }
    },
    [messages]
  );

  return {
    messages,
    isTyping,
    sendMessage,
    startNewConversation,
    downloadConversation,
  };
}

function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
