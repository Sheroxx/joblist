'use client'
import i18n from '@/i18n/i18n'
import React from 'react'
import { I18nextProvider } from 'react-i18next'

export default function I18nProvider({children}:any) {
  return (
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  )
}
