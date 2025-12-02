import React, { useEffect, useState } from 'react';
import { RequestLoader } from './RequestLoader';
import { CodeBlock } from './CodeBlock';
import { iconMapper } from '../utils/iconMapper';

interface Project {
    name: string;
    description: string;
    url: string;
    role?: string;
    languages: string[];
}

interface ProjectsResponse {
    projects: Project[];
}

export const ProjectsLoader: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projectsResponse, setProjectsResponse] = useState<ProjectsResponse | null>(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }

                const data = await response.json();
                
                // Simular un pequeño delay adicional para que se vea el loader
                await new Promise(resolve => setTimeout(resolve, 800));
                
                setProjectsResponse(data);
                setLoading(false);
            } catch (e) {
                console.error('Error fetching projects:', e);
                setError(e instanceof Error ? e.message : 'Unknown error');
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return <RequestLoader />;
    }

    if (error) {
        return (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
                <p className="font-mono text-sm">Error loading projects: {error}</p>
            </div>
        );
    }

    if (!projectsResponse) {
        return null;
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-text-secondary">
                Fetched pinned repositories from my GitHub
            </p>
            <div>
                <CodeBlock
                    code={JSON.stringify(projectsResponse, null, 2)}
                    skillIcons={iconMapper}
                />
            </div>
        </div>
    );
};
