
import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { bankLoanOffers } from '../../data/bankData';

const LoanForm = ({ open, onClose, onSubmit, formData, onChange }) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('loans.addNew')}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('loans.form.bankName')}</InputLabel>
                <Select
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={(e) => onChange({ ...formData, bank_name: e.target.value })}
                  required
                >
                  {bankLoanOffers.map(bank => (
                    <MenuItem key={bank.bank_name} value={bank.bank_name}>
                      {bank.bank_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('loans.form.loanType')}</InputLabel>
                <Select
                  name="loan_type"
                  value={formData.loan_type}
                  onChange={(e) => onChange({ ...formData, loan_type: e.target.value })}
                  required
                >
                  {bankLoanOffers
                    .find(bank => bank.bank_name === formData.bank_name)
                    ?.loan_types?.map(type => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    )) || []}
                </Select>
              </FormControl>
            </Grid>
            {/* Add other form fields */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button type="submit" variant="contained">{t('common.save')}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoanForm;