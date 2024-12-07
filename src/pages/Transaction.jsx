import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper, Select, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';

const Transaction = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');

  // Mock data - replace with actual data from your backend
  const transactions = [
    { id: 1, date: '2024-01-20', type: 'credit', amount: 5000, description: t('transactions.milkSale') },
    { id: 2, date: '2024-01-19', type: 'debit', amount: 2000, description: t('transactions.feedPurchase') },
    { id: 3, date: '2024-01-18', type: 'credit', amount: 15000, description: t('transactions.cropSale') },
  ];

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          {t('sidebar.transactions')}
        </Typography>
        <Select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="credit">{t('transactions.type.credit')}</MenuItem>
          <MenuItem value="debit">{t('transactions.type.debit')}</MenuItem>
        </Select>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Amount (₹)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions
              .filter(tx => filter === 'all' || tx.type === filter)
              .map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={t(`transactions.type.${transaction.type}`)}
                      color={transaction.type === 'credit' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ color: transaction.type === 'credit' ? 'success.main' : 'error.main' }}>
                    {transaction.type === 'credit' ? '+' : '-'} ₹{transaction.amount}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Transaction;
