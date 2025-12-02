import { Card, CardContent, Typography, Avatar, Box } from '@mui/material';

interface SummaryCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: string;
    subtext?: string;
}

export default function SummaryCard({ title, value, icon, color = 'primary.main', subtext }: SummaryCardProps) {
    return (
        <Card elevation={0} sx={{ height: '100%' }}>
            <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
                        {icon}
                    </Avatar>
                    <Box flex={1}>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
                            {title}
                        </Typography>
                        <Typography variant="h4" fontWeight={700} color="text.primary" mt={0.5}>
                            {value}
                        </Typography>
                        {subtext && (
                            <Typography variant="caption" color="text.secondary" mt={0.5}>
                                {subtext}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}
