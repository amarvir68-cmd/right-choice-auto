import './globals.css';
export const metadata = {
  title: 'Right Choice Auto Repair & Car Sales',
  description: 'Used cars and auto repair in Winnipeg, Manitoba.'
};
export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
