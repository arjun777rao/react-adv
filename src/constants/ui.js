/**
 * UI Configuration and Constants
 */

export const PAGE_SIZES = [5, 10, 15, 20];
export const DEFAULT_PAGE_SIZE = 5;

export const TABLE_COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'age', label: 'Age' },
  { key: 'phone', label: 'Phone' },
  { key: 'address.country', label: 'Country' },
];

export const COMPANY_INFO = {
  name: 'Arjun Learning Company',
  email: 'arjunrao777@arjunlearn.co',
  links: [
    { label: 'About us', href: '#' },
    { label: 'Contact us', href: '#' },
    { label: 'Cookie settings', href: '#' },
  ],
};

export const SORT_INDICATORS = {
  ASCENDING: ' 🔼',
  DESCENDING: ' 🔽',
};

export const THEME_TOGGLE = {
  DARK: '🌙 Dark',
  LIGHT: '☀️ Light',
};
