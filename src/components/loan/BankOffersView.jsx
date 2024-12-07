import React, { useState } from 'react';
import { Typography, Paper, Tooltip, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { bankLoanOffers, loanGuide } from '../../data/bankData';

const BankOffersView = () => {
  const { t, i18n } = useTranslation();
  const [selectedRisk, setSelectedRisk] = useState('all');
  const currentLanguage = i18n.language === 'kn' ? 'kn' : 'en';

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low': return 'bg-green-100 border-green-500 text-green-700';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'high': return 'bg-red-100 border-red-500 text-red-700';
      default: return 'bg-gray-100 border-gray-500 text-gray-700';
    }
  };

  const getLanguageIcon = (lang) => {
    switch(lang) {
      case 'kannada': return '🇰';
      case 'hindi': return '🇮🇳';
      case 'english': return '🇬🇧';
      default: return '📝';
    }
  };

  const filteredOffers = selectedRisk === 'all' 
    ? bankLoanOffers 
    : bankLoanOffers.filter(bank => bank.risk_level === selectedRisk);

  return (
    <div className="space-y-6">
      {/* Loan Guide Section */}
      <Paper className="p-4 bg-blue-50">
        <Typography variant="h6" className="mb-3 text-blue-800">
          💡 {t('loans.guide.howToRead')}
        </Typography>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">{t('loans.guide.interestExplanation')}</h3>
            {loanGuide.interest_explanation[currentLanguage].map((item, idx) => (
              <div key={idx} className="text-sm text-blue-700">{item}</div>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">{t('loans.guide.documents')}</h3>
            {loanGuide.documents_needed[currentLanguage].map((item, idx) => (
              <div key={idx} className="text-sm text-blue-700">{item}</div>
            ))}
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">{t('loans.guide.bestPractices')}</h3>
            {loanGuide.best_practices[currentLanguage].map((item, idx) => (
              <div key={idx} className="text-sm text-blue-700">{item}</div>
            ))}
          </div>
        </div>
      </Paper>

      {/* Risk Level Filters */}
      <div className="flex gap-2">
        <Button 
          variant={selectedRisk === 'all' ? 'contained' : 'outlined'}
          onClick={() => setSelectedRisk('all')}
        >
          👀 {t('loans.filter.all')}
        </Button>
        {['low', 'medium', 'high'].map(risk => (
          <Button
            key={risk}
            variant={selectedRisk === risk ? 'contained' : 'outlined'}
            onClick={() => setSelectedRisk(risk)}
            className={getRiskColor(risk)}
          >
            {risk === 'low' ? '✅' : risk === 'medium' ? '⚠️' : '⚡'} {t(`loans.risk.${risk}`)}
          </Button>
        ))}
      </div>

      {/* Bank Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOffers.map((bank) => (
          <Paper key={bank.bank_name} className={`p-4 border-l-4 ${getRiskColor(bank.risk_level)}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{bank.bank_logo}</span>
              <Typography variant="h6">{bank.bank_name}</Typography>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {bank.loan_icon} {bank.loan_type[currentLanguage]}
              </div>

              <Tooltip title={t('loans.tooltip.interestRate')} arrow>
                <div className="text-lg font-semibold">
                  💰 {bank.interest_rate_min}% - {bank.interest_rate_max}%
                </div>
              </Tooltip>

              <div className="text-sm bg-gray-50 p-2 rounded">
                💵 {bank.payment_example[currentLanguage]}
              </div>

              <div className="space-y-1">
                {bank.special_features[currentLanguage].map((feature, idx) => (
                  <div key={idx} className="text-sm">{feature}</div>
                ))}
              </div>

              <div className="border-t pt-2 mt-2">
                {bank.simple_eligibility[currentLanguage].map((criteria, idx) => (
                  <div key={idx} className="text-sm text-gray-600">{criteria}</div>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-2">
                {bank.local_language_support.map(lang => (
                  <Tooltip key={lang} title={t(`loans.language.${lang}`)} arrow>
                    <span className="text-xl">{getLanguageIcon(lang)}</span>
                  </Tooltip>
                ))}
              </div>

              <div className="text-sm text-blue-600 mt-2">
                📞 {bank.helpline}
              </div>
            </div>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default BankOffersView;
