import { useState } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from './CodeBlock';

interface SuccessResponse {
    name: string;
    email: string;
    message: string;
    timestamp: string;
}

interface ErrorResponse {
    error: string;
    statusCode: number;
}

export const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [successData, setSuccessData] = useState<SuccessResponse | null>(null);
    const [errorData, setErrorData] = useState<ErrorResponse | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setSuccessData(null);
        setErrorData(null);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatus('success');
                setSuccessData({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message,
                    timestamp: new Date().toISOString()
                });
                setFormData({ name: '', email: '', message: '' });
            } else {
                // Intentar parsear el error del servidor
                let errorMessage = 'Error sending message';
                try {
                    const data = await response.json();
                    errorMessage = data.error || errorMessage;
                } catch {
                    // Si no se puede parsear el JSON, usar el statusText
                    errorMessage = response.statusText || errorMessage;
                }
                
                setStatus('error');
                setErrorData({
                    error: errorMessage,
                    statusCode: response.status
                });
            }
        } catch (error) {
            // Error de red o de conexión
            setStatus('error');
            setErrorData({
                error: error instanceof Error ? error.message : 'Network error: Unable to connect to server',
                statusCode: 500
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-2">
                    Name
                </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md bg-bg-secondary border border-border text-text-primary focus:outline-none focus:border-accent transition-colors"
                    placeholder="Your name"
                />
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md bg-bg-secondary border border-border text-text-primary focus:outline-none focus:border-accent transition-colors"
                    placeholder="your.email@example.com"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-2">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 rounded-md bg-bg-secondary border border-border text-text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                    placeholder="Your message here..."
                />
            </div>

            <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full px-6 py-3 rounded-md bg-accent text-bg-primary font-medium hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {status === 'sending' ? (
                    <>
                        <Icon icon="mdi:loading" className="animate-spin" width="20" height="20" />
                        <span>Sending...</span>
                    </>
                ) : (
                    <>
                        <Icon icon="mdi:send" width="20" height="20" />
                        <span>Send Message</span>
                    </>
                )}
            </button>

            {status === 'success' && successData && (
                <CodeBlock
                    statusCode={200}
                    code={JSON.stringify({
                        status: "success",
                        data: {
                            name: successData.name,
                            email: successData.email,
                            message: successData.message,
                            sentAt: successData.timestamp
                        }
                    }, null, 2)}
                />
            )}

            {status === 'error' && errorData && (
                <CodeBlock
                    statusCode={errorData.statusCode}
                    code={JSON.stringify({
                        error: errorData.error,
                        statusCode: errorData.statusCode,
                        timestamp: new Date().toISOString()
                    }, null, 2)}
                />
            )}
        </form>
    );
};
