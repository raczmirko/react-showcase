import { useTranslation } from 'react-i18next'
export function AccessDeniedPage() {
  const { t } = useTranslation()
  return <div>{t('auth.accessDenied')}</div>
}