
import React, { useState } from 'react';
import { Grid, Card, CardContent, TextField, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const RiskAnalysis = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    existingEMIs: '',
    expenses: '',
    creditScore: ''
  });
  const [analysis, setAnalysis] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/loan-risk-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error('Error analyzing loan risk:', err);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>{t('loans.analysis.title')}</Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('loans.analysis.monthlyIncome')}
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({...formData, monthlyIncome: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('loans.analysis.existingLoans')}
                    type="number"
                    value={formData.existingEMIs}
                    onChange={(e) => setFormData({...formData, existingEMIs: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('loans.analysis.expenses')}
                    type="number"
                    value={formData.expenses}
                    onChange={(e) => setFormData({...formData, expenses: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('loans.analysis.creditScore')}
                    type="number"
                    value={formData.creditScore}
                    onChange={(e) => setFormData({...formData, creditScore: e.target.value})}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" fullWidth>
                    {t('loans.analysis.title')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
      {analysis && (
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>{t('loans.analysis.recommendation')}</Typography>
              <Typography variant="body1">{t('loans.analysis.maximumEligible')}: {analysis.maxEligibleAmount}</Typography>
              <Typography variant="body1">{t('loans.analysis.suggestedEMI')}: {analysis.recommendedEMI}</Typography>
              <Typography variant="body1">{t('loans.analysis.risk')}: {t(`loans.analysis.risk.${analysis.riskLevel}`)}</Typography>
              {/* Add more analysis results display if needed */}
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default RiskAnalysis;