import { mockMenu } from "./data/mockMenu";

const BASE_URL = 'http://localhost:8080';
const HORSEPAY_URL =
  'http://homepages.cs.ncl.ac.uk/daniel.nesbitt/CSC8019/HorsePay/HorsePay.php';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }

  if (res.status === 204) return null;

  return res.json();
}

export async function getMenu() {
  try {
    return await apiFetch('/api/menu');
  } catch (error) {
    console.warn('Backend unavailable. Using mock menu data.');
    return mockMenu;
  }
}

export async function getMenuItem(itemId) {
  const menu = await getMenu();
  return menu.find(item => String(item.itemId) === String(itemId));
}

export async function makeHorsePayPayment(paymentPayload) {
  const res = await fetch(HORSEPAY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentPayload),
  });

  if (!res.ok) {
    throw new Error('HorsePay payment request failed.');
  }

  return res.json();
}