import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Load Data Button Text', () => {
  render(<App />);
  const linkElement = screen.getByText(/load data/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders Blocks Text', () => {
  render(<App />);
  const linkElement = screen.getByText(/blocks/i);
  expect(linkElement).toBeInTheDocument();
});
