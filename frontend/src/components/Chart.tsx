'use client';

import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartProps {
    data: { name: string; payments: number; invoices: number }[];
}

export default function Chart({ data }: ChartProps) {
    return (
        <Card elevation={0}>
            <CardContent>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                    Monthly Financial Overview
                </Typography>
                <Box sx={{ height: 300, width: '100%', mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                cursor={{ fill: '#f9fafb' }}
                            />
                            <Legend />
                            <Bar dataKey="payments" fill="#2563eb" radius={[8, 8, 0, 0]} name="Payments" />
                            <Bar dataKey="invoices" fill="#10b981" radius={[8, 8, 0, 0]} name="Invoices" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
}

// Add Box import
import { Box } from '@mui/material';
