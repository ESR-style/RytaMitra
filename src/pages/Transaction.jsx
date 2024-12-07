import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper, Select, MenuItem, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const Transaction = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'credit',
    amount: '',
    description: ''
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const addTransaction = async (transactionData) => {
    try {
      await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });
      fetchTransactions();
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setNewTransaction({ type: 'credit', amount: '', description: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addTransaction(newTransaction);
    handleDialogClose();
  };

  return (
    <Box p={3}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          {t('sidebar.transactions')}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
            {t('transactions.add')}
          </Button>
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

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>{t('transactions.addNew')}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <Select
                fullWidth
                value={newTransaction.type}
                onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
              >
                <MenuItem value="credit">{t('transactions.type.credit')}</MenuItem>
                <MenuItem value="debit">{t('transactions.type.debit')}</MenuItem>
              </Select>
              <TextField
                fullWidth
                label={t('transactions.amount')}
                type="number"
                value={newTransaction.amount}
                onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                required
              />
              <TextField
                fullWidth
                label={t('transactions.description')}
                value={newTransaction.description}
                onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                required
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>{t('common.cancel')}</Button>
            <Button type="submit" variant="contained">{t('common.save')}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Transaction;
