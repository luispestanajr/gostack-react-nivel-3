import React, { useState, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { Link } from 'react-router-dom';
import moment from 'moment';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Result {
  transactions: Transaction[];
  balance: Balance;
}

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const transactionsResult = await api.get<Result>('transactions');

      setTransactions(transactionsResult.data.transactions);
      setBalance(transactionsResult.data.balance);
    }

    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">
              <NumberFormat
                value={balance.income}
                displayType="text"
                prefix="R$ "
                decimalSeparator=","
                fixedDecimalScale
                thousandSeparator="."
                allowLeadingZeros
                decimalScale={2}
              />
            </h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">
              <NumberFormat
                value={balance.outcome}
                displayType="text"
                prefix="R$ "
                decimalSeparator=","
                fixedDecimalScale
                thousandSeparator="."
                allowLeadingZeros
                decimalScale={2}
              />
            </h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">
              <NumberFormat
                value={balance.total}
                displayType="text"
                prefix="R$ "
                decimalSeparator=","
                fixedDecimalScale
                thousandSeparator="."
                allowLeadingZeros
                decimalScale={2}
              />
            </h1>
          </Card>
        </CardContainer>

        {transactions.length && (
          <TableContainer>
            <Link to="import">Importar</Link>
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Data</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      <NumberFormat
                        value={transaction.value}
                        displayType="text"
                        prefix={
                          transaction.type === 'outcome' ? '- R$ ' : 'R$ '
                        }
                        decimalSeparator=","
                        fixedDecimalScale
                        thousandSeparator="."
                        allowLeadingZeros
                        decimalScale={2}
                      />
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>
                      {moment(
                        new Date(transaction.created_at),
                        'DD/MM/YYYY',
                      ).format('DD/MM/YYYY')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
