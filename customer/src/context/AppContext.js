import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  const [basket, setBasket] = useState([]);

  const [currentOrderId, setCurrentOrderId] = useState(
    () => localStorage.getItem('currentOrderId') || null
  );

  const [arrivalTime, setArrivalTime] = useState(
    () => sessionStorage.getItem('arrivalTime') || ''
  );

  function setAndPersistOrderId(id) {
    if (id) localStorage.setItem('currentOrderId', id);
    else localStorage.removeItem('currentOrderId');
    setCurrentOrderId(id);
  }

  function setAndPersistArrivalTime(time) {
    if (time) sessionStorage.setItem('arrivalTime', time);
    else sessionStorage.removeItem('arrivalTime');
    setArrivalTime(time);
  }

  function login(userData, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }

  async function logout() {
    const token = localStorage.getItem('token');
    if (token) {
      await fetch('http://localhost:8080/api/v1/auth/logout', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  function addToBasket(item) {
    setBasket(prev => {
      const existing = prev.find(
        i => i.menuItemId === item.menuItemId && i.size === item.size
      );

      if (existing) {
        return prev.map(i =>
          i.menuItemId === item.menuItemId && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }

      return [...prev, item];
    });
  }

  function increaseBasketItem(menuItemId, size) {
    setBasket(prev =>
      prev.map(item =>
        item.menuItemId === menuItemId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }

  function decreaseBasketItem(menuItemId, size) {
    setBasket(prev =>
      prev
        .map(item =>
          item.menuItemId === menuItemId && item.size === size
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  }

  function removeBasketItem(menuItemId, size) {
    setBasket(prev =>
      prev.filter(
        item => !(item.menuItemId === menuItemId && item.size === size)
      )
    );
  }

  function clearBasket() {
    setBasket([]);
  }

  const basketCount = basket.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      basket,
      addToBasket,
      increaseBasketItem,
      decreaseBasketItem,
      removeBasketItem,
      clearBasket,
      basketCount,
      currentOrderId,
      setCurrentOrderId: setAndPersistOrderId,
      arrivalTime,
      setArrivalTime: setAndPersistArrivalTime
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}