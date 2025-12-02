'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Container,
    Typography,
    Box,
    AppBar,
    Toolbar,
    Chip,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import {
    AccountBalance,
    Receipt,
    MoneyOff,
    TrendingUp,
} from '@mui/icons-material';
import SummaryCard from '@/components/SummaryCard';
import DataTable from '@/components/DataTable';
import Chart from '@/components/Chart';
import ChatPanel from '@/components/ChatPanel';
import LogsPanel from '@/components/LogsPanel';
import { fetchPayments, fetchInvoices, fetchSummary } from '@/lib/api';

interface Payment {
    id: number;
    amount: number;
    date: string;
    status: string;
    description: string;
}

interface Invoice {
    id: number;
    amount: number;
    date: string;
    due_date: string;
    status: string;
    customer_name: string;
}

interface Summary {
    total_payments: number;
    total_invoices: number;
    unpaid_invoices_count: number;
    unpaid_invoices_amount: number;
    monthly_breakdown: Record<string, { payments: number; invoices: number }>;
}

export default function Dashboard() {
    const [paymentPage, setPaymentPage] = useState(1);
    const [invoicePage, setInvoicePage] = useState(1);
    const [tabValue, setTabValue] = useState(0);

    const pageSize = 10;

    // Fetch summary
    const { data: summary } = useQuery<Summary>({
        queryKey: ['summary'],
        queryFn: fetchSummary,
        refetchInterval: 10000,
    });

    // Fetch payments
    const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
        queryKey: ['payments', paymentPage],
        queryFn: () => fetchPayments((paymentPage - 1) * pageSize, pageSize),
    });

    // Fetch invoices
    const { data: invoices, isLoading: invoicesLoading } = useQuery<Invoice[]>({
        queryKey: ['invoices', invoicePage],
        queryFn: () => fetchInvoices((invoicePage - 1) * pageSize, pageSize),
    });

    // Prepare chart data
    const chartData = summary
        ? Object.entries(summary.monthly_breakdown).map(([month, data]) => ({
            name: month,
            payments: Math.round(data.payments),
            invoices: Math.round(data.invoices),
        })).sort((a, b) => a.name.localeCompare(b.name))
        : [];

    const paymentColumns = [
        { header: 'ID', accessor: 'id' as const },
        {
            header: 'Amount',
            accessor: (p: Payment) => `$${p.amount.toFixed(2)}`,
            align: 'right' as const
        },
        {
            header: 'Date',
            accessor: (p: Payment) => new Date(p.date).toLocaleDateString()
        },
        {
            header: 'Status',
            accessor: (p: Payment) => (
                <Chip
                    label={p.status}
                    size="small"
                    color={p.status === 'paid' ? 'success' : p.status === 'pending' ? 'warning' : 'error'}
                />
            )
        },
        { header: 'Description', accessor: 'description' as const },
    ];

    const invoiceColumns = [
        { header: 'ID', accessor: 'id' as const },
        {
            header: 'Amount',
            accessor: (i: Invoice) => `$${i.amount.toFixed(2)}`,
            align: 'right' as const
        },
        {
            header: 'Date',
            accessor: (i: Invoice) => new Date(i.date).toLocaleDateString()
        },
        {
            header: 'Due Date',
            accessor: (i: Invoice) => new Date(i.due_date).toLocaleDateString()
        },
        {
            header: 'Status',
            accessor: (i: Invoice) => (
                <Chip
                    label={i.status}
                    size="small"
                    color={i.status === 'paid' ? 'success' : i.status === 'unpaid' ? 'warning' : 'error'}
                />
            )
        },
        { header: 'Customer', accessor: 'customer_name' as const },
    ];

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <AppBar position="static" elevation={0} sx={{ bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}>
                <Toolbar>
                    <AccountBalance sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h5" fontWeight={700} color="primary.main" flexGrow={1}>
                        Adsum Accountant Dashboard
                    </Typography>
                    <Chip label="Live" color="success" size="small" />
                </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Summary Cards */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={3} mb={4}>
                    <SummaryCard
                        title="Total Payments"
                        value={`$${summary?.total_payments.toFixed(2) || '0.00'}`}
                        icon={<TrendingUp />}
                        color="primary.main"
                    />
                    <SummaryCard
                        title="Total Invoices"
                        value={`$${summary?.total_invoices.toFixed(2) || '0.00'}`}
                        icon={<Receipt />}
                        color="success.main"
                    />
                    <SummaryCard
                        title="Unpaid Invoices"
                        value={summary?.unpaid_invoices_count || 0}
                        icon={<MoneyOff />}
                        color="warning.main"
                        subtext={`$${summary?.unpaid_invoices_amount.toFixed(2) || '0.00'} total`}
                    />
                    <SummaryCard
                        title="Monthly Average"
                        value={`$${chartData.length > 0 ? (summary!.total_payments / chartData.length).toFixed(2) : '0.00'}`}
                        icon={<AccountBalance />}
                        color="info.main"
                    />
                </Box>

                {/* Chart */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', lg: '2fr 1fr' }} gap={3} mb={4}>
                    <Chart data={chartData} />
                    <LogsPanel />
                </Box>

                {/* Data Tables and Chat */}
                <Box display="grid" gridTemplateColumns={{ xs: '1fr', lg: '2fr 1fr' }} gap={3}>
                    <Paper elevation={0} sx={{ mb: 3 }}>
                        <Tabs
                            value={tabValue}
                            onChange={(_, newValue) => setTabValue(newValue)}
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Payments" />
                            <Tab label="Invoices" />
                        </Tabs>
                        <Box p={3}>
                            {tabValue === 0 ? (
                                <DataTable
                                    data={payments || []}
                                    columns={paymentColumns}
                                    page={paymentPage}
                                    isLoading={paymentsLoading}
                                    hasMore={(payments?.length || 0) === pageSize}
                                    onNext={() => setPaymentPage(p => p + 1)}
                                    onPrev={() => setPaymentPage(p => Math.max(1, p - 1))}
                                />
                            ) : (
                                <DataTable
                                    data={invoices || []}
                                    columns={invoiceColumns}
                                    page={invoicePage}
                                    isLoading={invoicesLoading}
                                    hasMore={(invoices?.length || 0) === pageSize}
                                    onNext={() => setInvoicePage(p => p + 1)}
                                    onPrev={() => setInvoicePage(p => Math.max(1, p - 1))}
                                />
                            )}
                        </Box>
                    </Paper>
                    <ChatPanel />
                </Box>
            </Container>
        </Box>
    );
}
