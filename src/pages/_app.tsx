import React, { useEffect, useState } from 'react';
import { appWithTranslation } from 'next-i18next';
import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import GlobalStyles from '@styles/global-styles';
import { Provider } from 'react-redux';
import { store } from 'state';
import * as gtag from '@modules/core/adsense/google-tag';
import '@fontsource/poppins';
import { useRouter } from 'next/router';
import { GoogleAnalytics } from '@components/google/google-analytics';
import { UserFragment, useMeQuery } from '@generated/graphql';
import { withApollo } from '@modules/core/apollo/apollo';
import { AuthProvider } from '@contexts/UserContext';
import mechaTheme from '@styles/theme';
import TypingGameProvider from '@contexts/typing-game.context';
import Script from 'next/script';
import { DefaultSeo } from 'next-seo';
import { __URI__ } from '@utils/constants';
import Container from 'next/app';

const MechaApp = (props: AppProps) => {
  const { Component, pageProps } = props;
  const router = useRouter();
  const [me, setMe] = useState<UserFragment>();
  const { data: meUserData, loading: meLoading } = useMeQuery({ ssr: true });

  // Me data
  useEffect(() => {
    if (meUserData?.me?.user) {
      setMe(meUserData.me.user);
    }
  }, [meUserData, meLoading]);

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <React.Fragment>
      <Provider store={store}>
        <AuthProvider>
          <TypingGameProvider>
            <ChakraProvider theme={mechaTheme}>
              <Script
                id="Adsense-id"
                async
                strategy="afterInteractive"
                onError={(e) => {
                  console.error('Script failed to load', e);
                }}
                src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
                  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE as string
                }`}
                crossOrigin="anonymous"
              />
              <GoogleAnalytics />
              <GlobalStyles />
              {/* Default SEO */}
              <DefaultSeo
                openGraph={{
                  type: 'website',
                  locale: router.locale,
                  defaultImageHeight: 512,
                  defaultImageWidth: 512,
                  images: [
                    {
                      url: 'https://via.placeholder.com/800x600',
                      alt: 'Mecha Type | The best place for improving your typing skills',
                      width: 800,
                      height: 600,
                      type: 'image/png',
                    },
                  ],
                  site_name: 'Mecha Type',
                }}
                twitter={{
                  site: '@mechatype',
                  cardType: 'summary_large_image',
                  handle: '@handle',
                }}
              />
              <Component {...pageProps} me={me ?? {}} />
            </ChakraProvider>
          </TypingGameProvider>
        </AuthProvider>
      </Provider>
    </React.Fragment>
  );
};

export default withApollo({})(appWithTranslation(MechaApp));
