import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const translations = {
  en: {
    language: 'Language',
    addUser: 'Add User',
    light: 'Light',
    dark: 'Dark',
    userList: 'User List',
    loadingUsers: 'Loading users...',
    failedToLoadUsers: 'Failed to load users.',
    filter: 'Filter',
    searchByNameOrEmail: 'Search by name or email',
    pageSize: 'Page size',
    id: 'ID',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    age: 'Age',
    phone: 'Phone',
    country: 'Country',
    noUsersFound: 'No users found',
    prev: 'Prev',
    next: 'Next',
    aboutUs: 'About us',
    contactUs: 'Contact us',
    cookieSettings: 'Cookie settings',
  },
  es: {
    language: 'Idioma',
    addUser: 'Agregar usuario',
    light: 'Claro',
    dark: 'Oscuro',
    userList: 'Lista de usuarios',
    loadingUsers: 'Cargando usuarios...',
    failedToLoadUsers: 'No se pudieron cargar los usuarios.',
    filter: 'Filtro',
    searchByNameOrEmail: 'Buscar por nombre o correo',
    pageSize: 'Tamaño de página',
    id: 'ID',
    firstName: 'Nombre',
    lastName: 'Apellido',
    email: 'Correo',
    age: 'Edad',
    phone: 'Teléfono',
    country: 'País',
    noUsersFound: 'No se encontraron usuarios',
    prev: 'Anterior',
    next: 'Siguiente',
    aboutUs: 'Sobre nosotros',
    contactUs: 'Contáctanos',
    cookieSettings: 'Configuración de cookies',
  },
  de: {
    language: 'Sprache',
    addUser: 'Benutzer hinzufügen',
    light: 'Hell',
    dark: 'Dunkel',
    userList: 'Benutzerliste',
    loadingUsers: 'Benutzer werden geladen...',
    failedToLoadUsers: 'Benutzer konnten nicht geladen werden.',
    filter: 'Filter',
    searchByNameOrEmail: 'Nach Name oder E-Mail suchen',
    pageSize: 'Seitengröße',
    id: 'ID',
    firstName: 'Vorname',
    lastName: 'Nachname',
    email: 'E-Mail',
    age: 'Alter',
    phone: 'Telefon',
    country: 'Land',
    noUsersFound: 'Keine Benutzer gefunden',
    prev: 'Zurück',
    next: 'Weiter',
    aboutUs: 'Über uns',
    contactUs: 'Kontakt',
    cookieSettings: 'Cookie-Einstellungen',
  },
  zh: {
    language: '语言',
    addUser: '添加用户',
    light: '浅色',
    dark: '深色',
    userList: '用户列表',
    loadingUsers: '正在加载用户...',
    failedToLoadUsers: '加载用户失败。',
    filter: '筛选',
    searchByNameOrEmail: '按姓名或邮箱搜索',
    pageSize: '每页数量',
    id: '编号',
    firstName: '名',
    lastName: '姓',
    email: '邮箱',
    age: '年龄',
    phone: '电话',
    country: '国家',
    noUsersFound: '未找到用户',
    prev: '上一页',
    next: '下一页',
    aboutUs: '关于我们',
    contactUs: '联系我们',
    cookieSettings: 'Cookie 设置',
  },
};

const defaultLanguage = 'en';

const I18nContext = createContext({
  language: defaultLanguage,
  setLanguage: () => {},
  t: key => translations[defaultLanguage][key] || key,
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider = ({ children }) => {
  const [language, setLanguage] = useState(defaultLanguage);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);

  const onSetLanguage = nextLanguage => {
    if (!translations[nextLanguage]) {
      return;
    }
    setLanguage(nextLanguage);
    localStorage.setItem('language', nextLanguage);
  };

  const value = useMemo(() => {
    const t = key => translations[language]?.[key] || translations[defaultLanguage][key] || key;
    return { language, setLanguage: onSetLanguage, t };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};
