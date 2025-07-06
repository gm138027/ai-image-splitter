import { GetStaticProps, GetStaticPaths } from 'next'
import HomePage from '../index'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import nextI18NextConfig from '../../../next-i18next.config'

export default HomePage

export const getStaticPaths: GetStaticPaths = async () => {
  const locales = nextI18NextConfig.i18n.locales
  return {
    paths: locales.map(lng => ({ params: { lng } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const locale = params?.lng as string
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
} 