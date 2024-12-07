import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Paper, Typography, IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { bankLoanOffers } from '../../data/bankData';

const LoanForm = ({ open, onClose, onSubmit, formData, onChange }) => {
  const { t } = useTranslation();
  const [previewEMI, setPreviewEMI] = useState(0);
  const [selectedBank, setSelectedBank] = useState(null);

  const validateForm = () => {
    const errors = [];
    if (!formData.bank_name) errors.push('Bank name is required');
    if (!formData.amount || formData.amount <= 0) errors.push('Valid amount is required');
    if (!formData.interest_rate || formData.interest_rate <= 0) errors.push('Valid interest rate is required');
    if (!formData.tenure || formData.tenure <= 0) errors.push('Valid tenure is required');
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }
    onSubmit(e);
  };

  useEffect(() => {
    if (formData.bank_name) {
      setSelectedBank(bankLoanOffers.find(bank => bank.bank_name === formData.bank_name));
    }
  }, [formData.bank_name]);

  useEffect(() => {
    if (formData.amount && formData.interest_rate && formData.start_date && formData.end_date) {
      const monthlyRate = formData.interest_rate / 12 / 100;
      const durationMonths = Math.ceil(
        (new Date(formData.end_date) - new Date(formData.start_date)) / (30 * 24 * 60 * 60 * 1000)
      );
      const emi = (formData.amount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) / 
                 (Math.pow(1 + monthlyRate, durationMonths) - 1);
      setPreviewEMI(Math.round(emi));
    }
  }, [formData]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      fullScreen={window.innerWidth < 600} // Make fullscreen on mobile
    >
      <DialogTitle>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏦</span>
            {t('loans.addNew')}
          </div>
          {window.innerWidth < 600 && (
            <IconButton edge="end" onClick={onClose}>
              <span>✕</span>
            </IconButton>
          )}
        </div>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('loans.form.bankName')}</InputLabel>
                <Select
                  value={formData.bank_name}
                  onChange={(e) => {
                    const bank = bankLoanOffers.find(b => b.bank_name === e.target.value);
                    onChange({
                      ...formData,
                      bank_name: e.target.value,
                      interest_rate: bank ? bank.interest_rate_min : '',
                      loan_type: bank ? bank.loan_type.en : ''
                    });
                  }}
                  required
                >
                  {bankLoanOffers.map(bank => (
                    <MenuItem key={bank.bank_name} value={bank.bank_name}>
                      <div className="flex items-center gap-2">
                        <span>{bank.bank_logo}</span>
                        <span>{bank.bank_name}</span>
                      </div>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('loans.form.amount')}
                type="number"
                value={formData.amount}
                onChange={(e) => onChange({...formData, amount: e.target.value})}
                InputProps={{
                  startAdornment: <span className="text-gray-500">₹</span>
                }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('loans.form.interestRate')}
                type="number"
                value={formData.interest_rate}
                onChange={(e) => onChange({...formData, interest_rate: e.target.value})}
                InputProps={{
                  endAdornment: <span className="text-gray-500">%</span>
                }}
                required
                helperText={selectedBank && 
                  `Range: ${selectedBank.interest_rate_min}% - ${selectedBank.interest_rate_max}%`}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('loans.form.tenureMonths')}
                value={formData.tenure}
                onChange={(e) => {
                  const months = Number(e.target.value);
                  const startDate = new Date();
                  const endDate = new Date();
                  endDate.setMonth(endDate.getMonth() + months);
                  onChange({
                    ...formData,
                    tenure: e.target.value,
                    start_date: startDate.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0]
                  });
                }}
                required
              />
            </Grid>

            {/* Loan Preview Section */}
            {previewEMI > 0 && selectedBank && (
              <Grid item xs={12}>
                <Paper className="p-4 bg-blue-50">
                  <Typography variant="h6" className="mb-2 flex items-center gap-2">
                    {selectedBank.loan_icon} {t('loans.preview.title')}
                  </Typography>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Typography>{t('loans.preview.amount')}:</Typography>
                      <Typography>₹{Number(formData.amount).toLocaleString()}</Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography>{t('loans.preview.monthlyPayment')}:</Typography>
                      <Typography className="text-green-700 font-bold">
                        ₹{previewEMI.toLocaleString()}
                      </Typography>
                    </div>
                    <div className="flex justify-between">
                      <Typography>{t('loans.preview.duration')}:</Typography>
                      <Typography>
                        {Math.ceil(
                          (new Date(formData.end_date) - new Date(formData.start_date)) / 
                          (30 * 24 * 60 * 60 * 1000)
                        )} {t('loans.preview.months')}
                      </Typography>
                    </div>
                    
                    {/* Additional Preview Info */}
                    <div className="mt-3 bg-white p-3 rounded">
                      <Typography variant="subtitle2" className="mb-2">
                        {t('loans.preview.features')}:
                      </Typography>
                      {selectedBank.special_features.en.map((feature, idx) => (
                        <div key={idx} className="text-sm text-gray-600">{feature}</div>
                      ))}
                    </div>
                  </div>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t('common.cancel')}</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={!formData.amount || !formData.interest_rate || !formData.tenure}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LoanForm;