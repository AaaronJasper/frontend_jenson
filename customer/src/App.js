import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CustomerMenu from './pages/CustomerMenu';
import DrinkOrderPage from './pages/DrinkOrderPage';
import BasketPage from './pages/BasketPage';
import PaymentPage from './pages/PaymentPage';
import OrderStatusPage from './pages/OrderStatusPage';
import AccountPage from './pages/AccountPage';
import SignInPage from './pages/SignInPage';
import ArrivalTimePage from './pages/ArrivalTimePage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2200,
          style: {
            background: '#3b2114',
            color: '#fff7e8',
            borderRadius: '999px',
            padding: '12px 18px',
            fontWeight: '700',
            boxShadow: '0 12px 28px rgba(59, 33, 20, 0.25)',
          },
          success: {
            iconTheme: {
              primary: '#d9a441',
              secondary: '#3b2114',
            },
          },
          error: {
            style: {
              background: '#7a2e1d',
              color: '#fff7e8',
            },
          },
        }}
      />

      <BrowserRouter>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<SignInPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/order" element={<CustomerMenu />} />
            <Route path="/arrival-time" element={<ArrivalTimePage />} />
            <Route path="/drink-order/:drinkId" element={<DrinkOrderPage />} />
            <Route path="/basket" element={<BasketPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/status" element={<OrderStatusPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/signin" element={<SignInPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;