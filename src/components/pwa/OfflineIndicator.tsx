import React, { useEffect, useState } from 'react';
import { WifiOff, CheckCircle } from 'lucide-react';
import { StorageService } from '../../utils/storage';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [queuedCount, setQueuedCount] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const checkQueue = async () => {
      const queue = await StorageService.getOfflineQueue();
      setQueuedCount(queue.filter((q) => !q.answered).length);
    };

    checkQueue();
    const interval = setInterval(checkQueue, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && queuedCount === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 z-40 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-200">
      {!isOnline ? (
        <div className="flex items-center gap-2 rounded-xl bg-slate-800 text-slate-100 px-3 py-2 text-xs font-medium shadow-lg border border-slate-700">
          <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Modo Offline: Lecciones y práctica 100% disponibles.</span>
        </div>
      ) : queuedCount > 0 ? (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-800 text-emerald-100 px-3 py-2 text-xs font-medium shadow-lg border border-emerald-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Conectado: {queuedCount} duda(s) pendientes de sincronizar con el tutor.</span>
        </div>
      ) : null}
    </div>
  );
};
