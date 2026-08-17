import './globals.css';
import AnalyticsTracker from './AnalyticsTracker';
export const metadata = {
  title: 'Right Choice Auto Repair & Car Sales',
  description: 'Used cars and auto repair in Winnipeg, Manitoba.'
};
export default function RootLayout({ children }) {
  return <html lang="en"><body><AnalyticsTracker/>{children}</body></html>;
}
