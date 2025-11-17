import React, { useMemo } from 'react';
import { Settings } from 'lucide-react';
import type { AiMode, View, Persona, CallState } from '@/src/lib/types';
import { ALL_APP_MANIFESTS } from '@/src/apps/registry';
import { Logo } from './Logo';

interface GlobalModeSelectorProps {
    aiMode: AiMode;
    setAiMode: (mode: AiMode) => void;
    callState: CallState;
}

const GlobalModeSelector: React.FC<GlobalModeSelectorProps> = ({ aiMode, setAiMode, callState }) => {
    const isCallActive = callState !== 'idle' && callState !== 'standby';

    return (
        <div className="relative z-20 flex justify-center py-2 flex-shrink-0 bg-black/10">
            <div className="flex items-center gap-1 bg-black/30 border border-cyan-500/20 p-1 rounded-xl backdrop-blur-sm shadow-lg">
                {ALL_APP_MANIFESTS.map(appManifest => {
                    const Icon = appManifest.iconComponent;
                    const isActive = aiMode === appManifest.mode;
                    return (
                        <button
                            key={appManifest.mode}
                            onClick={() => setAiMode(appManifest.mode)}
                            disabled={isCallActive}
                            title={appManifest.name}
                            className={`flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-all duration-200 relative group min-w-[60px] h-12 sm:px-3 sm:min-w-[70px] sm:h-14 ${isActive ? 'bg-cyan-900/50' : 'hover:bg-gray-800'} ${isCallActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <span className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase transition-colors ${isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-gray-200'}`}>{appManifest.name}</span>
                            <Icon className={`h-4 w-4 sm:h-5 sm:w-5 mt-1 transition-colors ${isActive ? 'text-cyan-300' : 'text-gray-400 group-hover:text-white'}`} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default GlobalModeSelector;