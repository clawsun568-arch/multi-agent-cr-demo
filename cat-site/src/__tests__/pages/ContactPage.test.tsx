import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ContactPage } from '../../pages/ContactPage';

const mockData = {
  siteConfig: {
    catteryName: 'Test Cattery',
    tagline: 'Test tagline',
    introText: 'Test intro',
    heroImages: [],
    contact: {
      email: 'hello@test.com',
      instagram: '@testcattery',
      facebook: 'testcattery',
      wechat: 'TestWeChat',
      phone: '+1 555-1234',
      note: 'We prefer email inquiries.',
    },
  },
  cats: [],
};

function renderContactPage() {
  return render(
    <MemoryRouter>
      <ContactPage />
    </MemoryRouter>
  );
}

describe('ContactPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(() => new Promise(() => {}));
    renderContactPage();
    expect(screen.getByText('Loading contact info...')).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('fail'));
    renderContactPage();
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
    });
  });

  it('renders HeroBanner with "Contact Us" title', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderContactPage();
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Contact Us' })).toBeInTheDocument();
    });
  });

  it('displays email, phone, WeChat, and Instagram', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderContactPage();
    await waitFor(() => {
      expect(screen.getByText('hello@test.com')).toBeInTheDocument();
      expect(screen.getByText('+1 555-1234')).toBeInTheDocument();
      expect(screen.getByText('TestWeChat')).toBeInTheDocument();
      expect(screen.getByText('@testcattery')).toBeInTheDocument();
    });
  });

  it('displays contact note', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderContactPage();
    await waitFor(() => {
      expect(screen.getByText('We prefer email inquiries.')).toBeInTheDocument();
    });
  });

  it('renders SocialIcons component', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderContactPage();
    await waitFor(() => {
      expect(screen.getByLabelText('Social media links')).toBeInTheDocument();
    });
  });

  it('renders email as a mailto link', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response);

    renderContactPage();
    await waitFor(() => {
      const emailLink = screen.getByText('hello@test.com');
      expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:hello@test.com');
    });
  });
});
