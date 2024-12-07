import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab, Button } from '@mui/material';
import LoanList from '../components/loan/LoanList';
import LoanForm from '../components/loan/LoanForm';
import BankOffersView from '../components/loan/BankOffersView';
import FDRatesView from '../components/loan/FDRatesView';
import RiskAnalysis from '../components/loan/RiskAnalysis';

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
    end_date: ''
  });

  useEffect(() => {
    fetchMyLoans();
  }, []);

  const fetchMyLoans = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/farmer-loans');
      const data = await response.json();
      setMyLoans(data);
    } catch (err) {
      console.error('Error fetching loans:', err);
    }
  };

  const handleAddLoan = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/farmer-loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newLoan,
          farmer_id: 1, // Replace with actual farmer ID from auth
          amount: Number(newLoan.amount),
          interest_rate: Number(newLoan.interest_rate)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add loan');
      }

      const data = await response.json();
      console.log('Loan added:', data);
      
      setOpenLoanDialog(false);
      setNewLoan({
        bank_name: '',
        loan_type: '',
        amount: '',
        interest_rate: '',
        start_date: '',
        end_date: ''
      });
      fetchMyLoans();
    } catch (err) {
      console.error('Error adding loan:', err);
      alert('Failed to add loan. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
        <Tab label={t('loans.myLoans')} />
        <Tab label={t('loans.bankOffers')} />
        <Tab label={t('loans.fdRates')} />
        <Tab label={t('loans.riskAnalysis')} />
      </Tabs>

      {activeTab === 0 && (
        <div className="mt-6">
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => setOpenLoanDialog(true)}
          >
            {t('loans.addNew')}
          </Button>
          <LoanList loans={myLoans} />
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
