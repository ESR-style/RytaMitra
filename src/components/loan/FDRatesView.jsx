
import React from 'react';
import { Typography, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { fdRates } from '../../data/bankData';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const FDRatesView = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Typography variant="h6" className="mb-4">{t('loans.fdRates')}</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="duration" />
          <YAxis />
          <Tooltip />
          <Legend />
          {fdRates.map((bank, index) => (
            <Line 
              key={bank.bank_name}
              data={bank.rates}
              type="monotone"
              dataKey="rate"
              name={bank.bank_name}
              stroke={COLORS[index % COLORS.length]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <TableContainer component={Paper} className="mt-4">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Bank</TableCell>
              {fdRates[0].rates.map(r => (
                <TableCell key={r.duration}>{r.duration}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {fdRates.map((bank) => (
              <TableRow key={bank.bank_name}>
                <TableCell>{bank.bank_name}</TableCell>
                {bank.rates.map(r => (
                  <TableCell key={r.duration}>{r.rate}%</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FDRatesView;