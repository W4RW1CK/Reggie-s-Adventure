import React, { useState, useEffect, useRef } from 'react';

interface NameEditorProps {
    currentName: string;
    onSave: (newName: string) => void;
    canRename: boolean;
}

export default function NameEditor({ currentName, onSave, canRename }: NameEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(currentName);
    const [error, setError] = useState('');
    const editorRef = useRef<HTMLDivElement>(null);

    const handleEdit = () => {
        if (!canRename) return;
        setIsEditing(true);
        setName(currentName);
        setError('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setName(currentName);
        setError('');
    };

    const handleSave = () => {
        const trimmedName = name.trim();
        if (trimmedName.length < 2) {
            setError('Mínimo 2 caracteres');
            return;
        }
        if (trimmedName.length > 15) {
            setError('Máximo 15 caracteres');
            return;
        }

        onSave(trimmedName);
        setIsEditing(false);
    };

    // Click outside editing area = cancel
    useEffect(() => {
        if (!isEditing) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (editorRef.current && !editorRef.current.contains(e.target as Node)) {
                handleCancel();
            }
        };

        // Delay to avoid the opening click triggering this
        const timer = setTimeout(() => {
            document.addEventListener('mousedown', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing]);

    if (isEditing) {
        return (
            <div ref={editorRef} className="flex flex-col items-center gap-2 animate-fadeIn">
                <div className="text-[10px] text-yellow-400 blink">
                    ⚠ ÚNICA OPORTUNIDAD
                </div>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="nes-input is-dark h-8 py-0 px-2 text-sm min-w-[200px] text-center"
                        maxLength={15}
                        autoFocus
                        aria-label="Editar nombre del Regenmon"
                    />
                </div>

                {error && <span className="text-[10px] text-red-500">{error}</span>}

                <div className="flex gap-2 mt-1">
                    <button
                        onClick={handleCancel}
                        className="nes-btn is-error text-[10px] py-1 px-2 h-8"
                        aria-label="Cancelar edición"
                    >
                        ❌
                    </button>
                    <button
                        onClick={handleSave}
                        className="nes-btn is-success text-[10px] py-1 px-2 h-8"
                        aria-label="Guardar nuevo nombre"
                    >
                        💾 GUARDAR
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 group">
            <h2 className="text-xl text-white font-bold tracking-widest uppercase">
                {currentName}
            </h2>
            {canRename && (
                <button
                    onClick={handleEdit}
                    className="opacity-50 hover:opacity-100 transition-opacity animate-pulse text-sm"
                    title="Renombrar (Solo una vez)"
                    aria-label="Renombrar Regenmon"
                >
                    ✏️
                </button>
            )}
        </div>
    );
}
