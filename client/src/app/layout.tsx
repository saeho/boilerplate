import App from '../containers/App';
import './globals.css'

/**
 * Types
 */

type LayoutProps = {
  children: React.ReactNode;
};

/**
 * Meta data
 */

export const metadata = {
  title: 'ClassKick',
  description: 'Engineering Take Home Project',
};

/**
 * Layout; root
 */

async function RootLayout(p: LayoutProps) {
  const { children } = p;

  return (
    <html lang="en">
      <body data-theme='normal'>
        <App>
          {children}
        </App>
      </body>
    </html>
  )
}

export default RootLayout;
