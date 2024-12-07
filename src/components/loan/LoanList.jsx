
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LoanList = ({ loans }) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('loans.form.bankName')}</TableCell>
            <TableCell>{t('loans.form.loanType')}</TableCell>
            <TableCell>{t('loans.form.amount')}</TableCell>
            <TableCell>{t('loans.form.monthlyPayment')}</TableCell>
            <TableCell>{t('loans.form.remainingAmount')}</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loans.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.bank_name}</TableCell>
              <TableCell>{loan.loan_type}</TableCell>
              <TableCell>₹{loan.amount}</TableCell>
              <TableCell>₹{loan.monthly_payment}</TableCell>
              <TableCell>₹{loan.remaining_amount}</TableCell>
              <TableCell>
                <Chip
                  label={t(`loans.status.${loan.status}`)}
                  color={loan.status === 'active' ? 'success' : 'error'}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LoanList;