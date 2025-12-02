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
    const [statusCode, setStatusCode] = useState<number>(200);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('/api/projects');
                
                setStatusCode(response.status);
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `API error: ${response.statusText}`);
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
            <CodeBlock
                statusCode={statusCode}
                code={JSON.stringify({
                    error: error,
                    statusCode: statusCode,
                    timestamp: new Date().toISOString()
                }, null, 2)}
            />
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
                    statusCode={statusCode}
                />
            </div>
        </div>
    );
};
