import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        const { name, email, message } = data;

        // Validación básica
        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({ error: 'All fields are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Validación de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ error: 'Invalid email format' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Variable de entorno para Resend
        const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
        const CONTACT_EMAIL = import.meta.env.CONTACT_EMAIL;
        
        if (!RESEND_API_KEY || !CONTACT_EMAIL) {
            return new Response(
                JSON.stringify({ 
                    error: 'Email service not configured. Add RESEND_API_KEY and CONTACT_EMAIL in .env' 
                }),
                { status: 501, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Inicializar Resend
        const resend = new Resend(RESEND_API_KEY);

        // Enviar correo
        try {
            const result = await resend.emails.send({
                from: 'Portfolio Contact <onboarding@resend.dev>', // Dominio verificado de Resend
                to: CONTACT_EMAIL,
                replyTo: email,
                subject: `New message from ${name} - JosliBlue Portfolio`,
                html: `
                    <h2>New message from JosliBlue Portfolio</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.replace(/\n/g, '<br/>')}</p>
                `,
            });

            // Verificar si Resend devolvió un error
            if (result.error) {
                console.error('Resend API error:', result.error);
                return new Response(
                    JSON.stringify({ 
                        error: `Resend API error: ${result.error.message || 'Unknown error'}` 
                    }),
                    { status: 502, headers: { 'Content-Type': 'application/json' } }
                );
            }
        } catch (sendErr: any) {
            console.error('Resend error:', sendErr);
            return new Response(
                JSON.stringify({ 
                    error: `Error sending email: ${sendErr.message || sendErr.toString()}` 
                }),
                { status: 502, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ 
                success: true,
                message: 'Message sent successfully' 
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        console.error('Unexpected API error in sendMail:', error);
        return new Response(
            JSON.stringify({ 
                error: error?.message || 'Unexpected error' 
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
