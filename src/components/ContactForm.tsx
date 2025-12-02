import { useState } from 'react';
import { Icon } from '@iconify/react';

export const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');
        setErrorMessage('');

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
                setFormData({ name: '', email: '', message: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                const data = await response.json();
                setStatus('error');
                setErrorMessage(data.error || 'Error sending message');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Error connecting to server');
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

            {status === 'success' && (
                <div className="p-4 rounded-md bg-green-500/10 border border-green-500/50 text-green-400 flex items-center gap-2">
                    <Icon icon="mdi:check-circle" width="20" height="20" />
                    <span>Message sent successfully!</span>
                </div>
            )}

            {status === 'error' && (
                <div className="p-4 rounded-md bg-red-500/10 border border-red-500/50 text-red-400 flex items-center gap-2">
                    <Icon icon="mdi:alert-circle" width="20" height="20" />
                    <span>{errorMessage}</span>
                </div>
            )}
        </form>
    );
};
