import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, Button, Typography, Alert } from '@mui/material';
import LoanList from '../components/loan/LoanList';
import LoanForm from '../components/loan/LoanForm';
import BankOffersView from '../components/loan/BankOffersView';
import FDRatesView from '../components/loan/FDRatesView';
import RiskAnalysis from '../components/loan/RiskAnalysis';
import LoanSummary from '../components/loan/LoanSummary';

const Loan = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [myLoans, setMyLoans] = useState([]);
  const [openLoanDialog, setOpenLoanDialog] = useState(false);
  const [newLoan, setNewLoan] = useState({
    bank_name: '',
    loan_type: '',
    amount: '',
    interest_rate: '',
    start_date: '',
    end_date: '',
    tenure: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMyLoans();
  }, []);

  const fetchMyLoans = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/farmer-loans');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMyLoans(data);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setError(err.message || t('loans.errors.fetchFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLoan = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      setIsLoading(true);

      // Basic validation
      if (!newLoan.bank_name || !newLoan.amount || 
          !newLoan.interest_rate || !newLoan.start_date || !newLoan.end_date) {
        throw new Error(t('loans.errors.allFieldsRequired'));
      }

      if (newLoan.amount <= 0) {
        throw new Error(t('loans.errors.invalidAmount'));
      }

      const response = await fetch('http://localhost:5000/api/farmer-loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newLoan,
          amount: Number(newLoan.amount),
          interest_rate: Number(newLoan.interest_rate),
          loan_type: newLoan.loan_type || 'General'
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || t('loans.errors.addFailed'));
      }

      setOpenLoanDialog(false);
      setNewLoan({
        bank_name: '',
        loan_type: '',
        amount: '',
        interest_rate: '',
        start_date: '',
        end_date: '',
        tenure: ''
      });
      
      await fetchMyLoans();
      alert(t('loans.success.loanAdded'));
      
    } catch (err) {
      console.error('Error adding loan:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {error && (
        <Alert severity="error" className="mb-4">
          {error}
        </Alert>
      )}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label={t('loans.myLoans')} />
        <Tab label={t('loans.bankOffers')} />
        <Tab label={t('loans.fdRates')} />
        <Tab label={t('loans.riskAnalysis')} />
      </Tabs>

      {activeTab === 0 && (
        <div className="mt-6 space-y-4">
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <>
              <LoanSummary loans={myLoans} />
              <div className="flex justify-between items-center">
                <Typography variant="h6">
                  {t('loans.activeLoansList')} ({myLoans.length})
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  startIcon={<span>➕</span>}
                  onClick={() => setOpenLoanDialog(true)}
                >
                  {t('loans.addNew')}
                </Button>
              </div>
              {myLoans.length > 0 ? (
                <LoanList loans={myLoans} />
              ) : (
                <Typography className="text-center py-4">
                  {t('loans.noLoansYet')}
                </Typography>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 1 && <BankOffersView />}
      {activeTab === 2 && <FDRatesView />}
      {activeTab === 3 && <RiskAnalysis />}

      <LoanForm
        open={openLoanDialog}
        onClose={() => setOpenLoanDialog(false)}
        onSubmit={handleAddLoan}
        formData={newLoan}
        onChange={setNewLoan}
      />
    </div>
  );
};

export default Loan;
