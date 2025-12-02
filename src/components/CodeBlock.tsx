import React, { useState } from 'react';
import { Icon } from '@iconify/react';

interface CodeBlockProps {
    code: string;
    skillIcons?: Record<string, string>;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, skillIcons = {} }) => {
    const [hoveredSkill, setHoveredSkill] = useState<{ name: string; x: number; y: number } | null>(
        null
    );
    const highlightJson = (json: string) => {
        if (!json) return '';
        return json.replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
            function (match) {
                let cls = 'syntax-number';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'syntax-key';
                    } else {
                        cls = 'syntax-string';
                        const content = match.slice(1, -1);
                        if (content.startsWith('http://') || content.startsWith('https://')) {
                            return `<span class="${cls}">"<a href="${content}" target="_blank" rel="noopener noreferrer" class="hover:underline inline-flex items-center gap-2">${content}<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bg-bg-secondary border border-border rounded p-0.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>"</span>`;
                        }
                        if (content.startsWith('/certificates/') && content.endsWith('.pdf')) {
                            return `<span class="${cls}">"<a href="${content}" target="_blank" rel="noopener noreferrer" class="hover:underline inline-flex items-center gap-2">${content}<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="bg-bg-secondary border border-border rounded p-0.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>"</span>`;
                        }
                        if (skillIcons[content]) {
                            return `<span class="${cls} skill-item hover:text-accent cursor-help transition-colors underline decoration-[#4ade80]/50 decoration-1 underline-offset-2" data-skill="${content}">${match}</span>`;
                        }
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'syntax-boolean';
                } else if (/null/.test(match)) {
                    cls = 'syntax-null';
                }
                return `<span class="${cls}">${match}</span>`;
            }
        );
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('skill-item')) {
            const skillName = target.getAttribute('data-skill');
            if (skillName && skillIcons[skillName]) {
                const rect = target.getBoundingClientRect();
                setHoveredSkill({
                    name: skillName,
                    x: rect.left + rect.width / 2,
                    y: rect.top,
                });
            }
        } else {
            setHoveredSkill(null);
        }
    };

    return (
        <div className="rounded-md overflow-hidden border border-(--code-border) bg-(--bg-code) my-6 shadow-sm group relative">
            <div className="flex justify-end items-center px-4 py-2 bg-(--code-header-bg) border-b border-(--code-border)">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary font-mono font-medium tracking-tight">
                        200 OK
                    </span>
                </div>
            </div>
            <div
                className="p-4"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredSkill(null)}
            >
                <pre className="font-mono text-[15px] leading-6 text-text-primary/90 whitespace-pre-wrap break-all">
                    <code dangerouslySetInnerHTML={{ __html: highlightJson(code) }} />
                </pre>
            </div>

            {hoveredSkill && skillIcons[hoveredSkill.name] && (
                <div
                    className="fixed z-50 px-3 py-2 bg-bg-primary border-2 border-accent rounded-lg shadow-xl pointer-events-none"
                    style={{
                        left: `${hoveredSkill.x}px`,
                        top: `${hoveredSkill.y - 72}px`,
                        transform: 'translateX(-50%)',
                    }}
                >
                    <Icon
                        icon={skillIcons[hoveredSkill.name]}
                        width="50"
                        height="50"
                        className="text-accent"
                    />
                </div>
            )}
        </div>
    );
};
