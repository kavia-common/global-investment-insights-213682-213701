import { render } from '@testing-library/react';
import App from './App';

// Basic smoke test to ensure App renders without crashing
test('renders App without crashing', () => {
  render(<App />);
});
