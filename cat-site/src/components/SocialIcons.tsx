import type { ContactInfo } from '../data/types';

/**
 * SocialIcons — Social media icon links for the contact page and footer.
 *
 * Renders clickable text-based icons for each social platform present in
 * the contact data. Links open in a new tab.
 */
interface SocialIconsProps {
  contact: ContactInfo;
  size?: 'small' | 'large';
}

export function SocialIcons({ contact, size = 'large' }: SocialIconsProps) {
  const links: { platform: string; url: string; label: string }[] = [];

  if (contact.instagram) {
    const handle = contact.instagram.replace('@', '');
    links.push({
      platform: 'Instagram',
      url: `https://instagram.com/${handle}`,
      label: `Follow us on Instagram ${contact.instagram}`,
    });
  }

  if (contact.facebook) {
    links.push({
      platform: 'Facebook',
      url: `https://facebook.com/${contact.facebook}`,
      label: `Visit us on Facebook`,
    });
  }

  if (contact.email) {
    links.push({
      platform: 'Email',
      url: `mailto:${contact.email}`,
      label: `Email us at ${contact.email}`,
    });
  }

  if (links.length === 0) return null;

  return (
    <div className={`social-icons social-icons--${size}`} role="list" aria-label="Social media links">
      {links.map(link => (
        <a
          key={link.platform}
          href={link.url}
          className="social-icon-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={link.label}
          role="listitem"
        >
          {link.platform}
        </a>
      ))}
    </div>
  );
}
