import {
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    IconButton,
    Typography,
    CircularProgress
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onNext?: () => void;
    onPrev?: () => void;
    page?: number;
    hasMore?: boolean;
    isLoading?: boolean;
}

export default function DataTable<T extends { id: number | string }>({
    data,
    columns,
    onNext,
    onPrev,
    page = 1,
    hasMore = false,
    isLoading = false
}: DataTableProps<T>) {
    return (
        <Card elevation={0}>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                            {columns.map((col, idx) => (
                                <TableCell key={idx} align={col.align || 'left'}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {col.header}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                                    <Typography color="text.secondary">No data found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item) => (
                                <TableRow
                                    key={item.id}
                                    sx={{
                                        '&:hover': { bgcolor: 'grey.50' },
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    {columns.map((col, idx) => (
                                        <TableCell key={idx} align={col.align || 'left'}>
                                            {typeof col.accessor === 'function'
                                                ? col.accessor(item)
                                                : (item[col.accessor] as React.ReactNode)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                px={2}
                py={1.5}
                borderTop={1}
                borderColor="divider"
            >
                <Typography variant="body2" color="text.secondary">
                    Page {page}
                </Typography>
                <Box>
                    <IconButton
                        onClick={onPrev}
                        disabled={page === 1 || isLoading}
                        size="small"
                    >
                        <ChevronLeft />
                    </IconButton>
                    <IconButton
                        onClick={onNext}
                        disabled={!hasMore || isLoading}
                        size="small"
                    >
                        <ChevronRight />
                    </IconButton>
                </Box>
            </Box>
        </Card>
    );
}
