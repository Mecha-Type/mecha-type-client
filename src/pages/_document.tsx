/* eslint-disable @next/next/no-document-import-in-page */
import React from 'react';
import { ColorModeScript } from '@chakra-ui/react';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
  DocumentProps,
} from 'next/document';
import theme from '../styles/theme';
import mechaTheme from '../styles/theme';

/**
 * Additional props depending on our App
 *
 * Must be returned by getInitialProps and will be available in render function
 */
type Props = {
  locale: string;
};

type DocumentGetInitialPropsOutput = Props & DocumentInitialProps;
type DocumentRenderProps = Props & DocumentProps;

class AppDocument extends Document<DocumentRenderProps> {
  static async getInitialProps(context: DocumentContext): Promise<DocumentGetInitialPropsOutput> {
    const initialProps: DocumentInitialProps = await Document.getInitialProps(context);
    const locale = context.locale;

    return {
      ...initialProps,
      locale,
    };
  }

  render() {
    const { locale }: DocumentRenderProps = this.props;
    return (
      <Html lang={locale}>
        <Head>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script type="text/javascript" src="/static/color-mode-fix.js" />
        </Head>

        <body>
          <ColorModeScript initialColorMode={mechaTheme.config.initialColorMode} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default AppDocument;
