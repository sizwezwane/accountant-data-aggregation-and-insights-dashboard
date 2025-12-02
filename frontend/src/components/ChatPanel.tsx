'use client';

import { useState, useRef, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Box,
    TextField,
    IconButton,
    Avatar,
    Typography,
    CircularProgress,
    Paper
} from '@mui/material';
import { Send } from '@mui/icons-material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { useMutation } from '@tanstack/react-query';
import { chatWithAssistant } from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatPanel() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I can help you analyze your financial data. Ask me about invoices or payments.',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    const mutation = useMutation({
        mutationFn: chatWithAssistant,
        onSuccess: (data) => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response,
                timestamp: new Date(data.timestamp)
            }]);
        },
        onError: () => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error.',
                timestamp: new Date()
            }]);
        }
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        mutation.mutate(input);
        setInput('');
    };

    return (
        <Card elevation={0} sx={{ height: 500, display: 'flex', flexDirection: 'column' }}>
            <CardHeader
                avatar={<SmartToyIcon color="primary" />}
                title={<Typography variant="h6" fontWeight={600}>AI Assistant</Typography>}
                sx={{ bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}
            />

            <Box
                ref={scrollRef}
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    bgcolor: 'background.default'
                }}
            >
                {messages.map((msg, idx) => (
                    <Box
                        key={idx}
                        display="flex"
                        gap={1.5}
                        justifyContent={msg.role === 'user' ? 'flex-end' : 'flex-start'}
                    >
                        {msg.role === 'assistant' && (
                            <Avatar sx={{ bgcolor: 'success.light', width: 32, height: 32 }}>
                                <SmartToyIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                        )}
                        <Paper
                            elevation={0}
                            sx={{
                                maxWidth: '80%',
                                p: 1.5,
                                bgcolor: msg.role === 'user' ? 'primary.main' : 'background.paper',
                                color: msg.role === 'user' ? 'white' : 'text.primary',
                                borderRadius: 2,
                                ...(msg.role === 'user' ? { borderTopRightRadius: 4 } : { borderTopLeftRadius: 4 })
                            }}
                        >
                            <Typography variant="body2">{msg.content}</Typography>
                        </Paper>
                        {msg.role === 'user' && (
                            <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                                <PersonIcon sx={{ fontSize: 18 }} />
                            </Avatar>
                        )}
                    </Box>
                ))}
                {mutation.isPending && (
                    <Box display="flex" gap={1.5} alignItems="center">
                        <Avatar sx={{ bgcolor: 'success.light', width: 32, height: 32 }}>
                            <SmartToyIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Paper elevation={0} sx={{ p: 1.5, borderRadius: 2, borderTopLeftRadius: 4 }}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <CircularProgress size={16} />
                                <Typography variant="body2" color="text.secondary">
                                    Thinking...
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                )}
            </Box>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}
            >
                <TextField
                    fullWidth
                    size="small"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    variant="outlined"
                />
                <IconButton
                    type="submit"
                    disabled={mutation.isPending || !input.trim()}
                    color="primary"
                    sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
                >
                    <Send sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>
        </Card>
    );
}
