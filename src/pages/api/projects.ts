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
                                        url
                                        description
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
        
        if (!data.data?.user) {
            throw new Error('Invalid response from GitHub API');
        }
        
        // Función para obtener el contenido de blue.role
        const fetchBlueRole = async (repoName: string): Promise<string | null> => {
            try {
                const roleResponse = await fetch(
                    `https://api.github.com/repos/JosliBlue/${repoName}/contents/blue.role`,
                    {
                        headers: {
                            'Accept': 'application/vnd.github.v3.raw',
                        },
                    }
                );
                
                return roleResponse.ok ? (await roleResponse.text()).trim() : null;
            } catch (e) {
                console.error(`Error fetching blue.role for ${repoName}:`, e);
                return null;
            }
        };
        
        // Normalizar lenguajes (reemplazar PHP/Blade por Laravel)
        const normalizeLanguages = (languages: string[]): string[] => {
            const hasPhpOrBlade = languages.some(lang => lang === 'PHP' || lang === 'Blade');
            if (!hasPhpOrBlade) return languages;
            
            const filtered = languages.filter(lang => lang !== 'PHP' && lang !== 'Blade');
            return filtered.includes('Laravel') ? filtered : ['Laravel', ...filtered];
        };
        
        // Procesar repositorios y obtener roles en paralelo
        const repos = data.data.user.pinnedItems.nodes
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        
        const projects = await Promise.all(
            repos.map(async (repo) => {
                const [role, languages] = await Promise.all([
                    fetchBlueRole(repo.name),
                    Promise.resolve(normalizeLanguages(repo.languages.nodes.map(l => l.name)))
                ]);
                
                return {
                    name: repo.name,
                    url: repo.url,
                    description: repo.description || 'No description available',
                    ...(role && { role }),
                    languages,
                };
            })
        );

        // Preparar respuesta
        const projectsResponse = {
            projects,
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
