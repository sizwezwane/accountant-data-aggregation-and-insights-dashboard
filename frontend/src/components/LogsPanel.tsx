'use client';

import { Card, CardContent, CardHeader, Typography, Box, Chip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchLogs } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface Log {
    id: number;
    timestamp: string;
    event_type: string;
    details: string;
    error: string | null;
}

export default function LogsPanel() {
    const { data: logs, isLoading } = useQuery<Log[]>({
        queryKey: ['logs'],
        queryFn: () => fetchLogs(20),
        refetchInterval: 5000,
    });

    const getEventColor = (eventType: string) => {
        switch (eventType) {
            case 'agent_request':
                return 'info';
            case 'summary_call':
                return 'success';
            case 'assistant_query':
                return 'secondary';
            default:
                return 'default';
        }
    };

    return (
        <Card elevation={0}>
            <CardHeader
                title={<Typography variant="h6" fontWeight={600}>Activity Logs</Typography>}
                sx={{ bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}
            />
            <CardContent sx={{ maxHeight: 400, overflowY: 'auto', p: 0 }}>
                {isLoading ? (
                    <Box p={3} textAlign="center">
                        <Typography color="text.secondary">Loading logs...</Typography>
                    </Box>
                ) : !logs || logs.length === 0 ? (
                    <Box p={3} textAlign="center">
                        <Typography color="text.secondary">No logs available</Typography>
                    </Box>
                ) : (
                    <Box>
                        {logs.map((log) => (
                            <Box
                                key={log.id}
                                p={2}
                                borderBottom={1}
                                borderColor="divider"
                                sx={{ '&:hover': { bgcolor: 'grey.50' } }}
                            >
                                <Box display="flex" justifyContent="space-between" alignItems="start" mb={0.5}>
                                    <Chip
                                        label={log.event_type.replace('_', ' ').toUpperCase()}
                                        size="small"
                                        color={getEventColor(log.event_type) as any}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" mt={1}>
                                    {log.details}
                                </Typography>
                                {log.error && (
                                    <Typography variant="caption" color="error.main" mt={0.5} display="block">
                                        Error: {log.error}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
