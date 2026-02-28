import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SocialIcons } from '../../components/SocialIcons';
import type { ContactInfo } from '../../data/types';

const fullContact: ContactInfo = {
  email: 'hello@mycattery.com',
  instagram: '@mycattery',
  facebook: 'mycattery',
  wechat: 'MyCattery_Official',
};

describe('SocialIcons', () => {
  it('renders links for Instagram, Facebook, and Email', () => {
    render(<SocialIcons contact={fullContact} />);

    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.getByText('Facebook')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('links to correct URLs', () => {
    render(<SocialIcons contact={fullContact} />);

    const igLink = screen.getByLabelText(/Follow us on Instagram/);
    expect(igLink).toHaveAttribute('href', 'https://instagram.com/mycattery');

    const fbLink = screen.getByLabelText(/Visit us on Facebook/);
    expect(fbLink).toHaveAttribute('href', 'https://facebook.com/mycattery');

    const emailLink = screen.getByLabelText(/Email us at/);
    expect(emailLink).toHaveAttribute('href', 'mailto:hello@mycattery.com');
  });

  it('opens links in new tab with noopener', () => {
    render(<SocialIcons contact={fullContact} />);

    const igLink = screen.getByLabelText(/Follow us on Instagram/);
    expect(igLink).toHaveAttribute('target', '_blank');
    expect(igLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders nothing when no social links exist', () => {
    const { container } = render(<SocialIcons contact={{ wechat: 'test' }} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders only available platforms', () => {
    render(<SocialIcons contact={{ instagram: '@test' }} />);

    expect(screen.getByText('Instagram')).toBeInTheDocument();
    expect(screen.queryByText('Facebook')).not.toBeInTheDocument();
    expect(screen.queryByText('Email')).not.toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<SocialIcons contact={fullContact} size="small" />);
    expect(container.querySelector('.social-icons--small')).toBeInTheDocument();
  });
});
