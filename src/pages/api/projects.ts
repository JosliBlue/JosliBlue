import type { APIRoute } from 'astro';

interface Language {
    name: string;
}

interface Repository {
    name: string;
    description: string;
    url: string;
    updatedAt: string;
    languages: {
        nodes: Language[];
    };
}

interface GitHubResponse {
    data: {
        user: {
            pinnedItems: {
                nodes: Repository[];
            };
        };
    };
}

export const GET: APIRoute = async () => {
    const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

    if (!GITHUB_TOKEN) {
        return new Response(
            JSON.stringify({
                error: 'GitHub token not configured',
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }

    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
            },
            body: JSON.stringify({
                query: `
                    query {
                        user(login: "JosliBlue") {
                            pinnedItems(first: 10, types: REPOSITORY) {
                                nodes {
                                    ... on Repository {
                                        name
                                        description
                                        url
                                        updatedAt
                                        languages(first: 3, orderBy: { field: SIZE, direction: DESC }) {
                                            nodes {
                                                name
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                `,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('GitHub API error:', response.status, errorText);
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const data: GitHubResponse = await response.json();
        
        if (!data.data || !data.data.user) {
            throw new Error('Invalid response from GitHub API');
        }
        
        const projects = data.data.user.pinnedItems.nodes
            .map((repo) => {
                let languages = repo.languages.nodes.map((lang) => lang.name);
                
                // Reemplazar PHP y Blade por Laravel
                if (languages.includes('PHP') || languages.includes('Blade')) {
                    languages = languages.filter(lang => lang !== 'PHP' && lang !== 'Blade');
                    if (!languages.includes('Laravel')) {
                        languages = ['Laravel', ...languages];
                    }
                }
                
                return {
                    name: repo.name,
                    description: repo.description || 'No description available',
                    url: repo.url,
                    lastUpdate: repo.updatedAt,
                    languages: languages,
                };
            })
            .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime());

        // Preparar respuesta sin la fecha para el endpoint
        const projectsResponse = {
            projects: [
                ...projects.map(({ lastUpdate, ...project }) => project),  
            ],
            more: {
                description: "Want to see more of my work? Check out all my repositories on GitHub",
                url: "https://github.com/JosliBlue?tab=repositories",
            }
        };

        return new Response(JSON.stringify(projectsResponse), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (e) {
        console.error('Error fetching GitHub projects:', e);
        return new Response(
            JSON.stringify({
                error: e instanceof Error ? e.message : 'Unknown error',
                details: e instanceof Error ? e.stack : undefined,
            }),
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    }
};
