import { useCatData } from '../hooks/useCatData';
import { usePageTitle } from '../hooks/usePageTitle';
import { HeroBanner } from '../components/HeroBanner';
import { SocialIcons } from '../components/SocialIcons';

/**
 * ContactPage — Contact information and social media links.
 *
 * Displays the cattery's contact details (email, phone, WeChat),
 * social media links via SocialIcons, and a note about preferred
 * contact methods.
 */
export function ContactPage() {
  const { siteConfig, loading, error } = useCatData();
  usePageTitle('Contact Us');

  if (loading) {
    return <div className="loading">Loading contact info...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const contact = siteConfig?.contact;

  return (
    <div className="contact-page">
      <HeroBanner
        title="Contact Us"
        backgroundImage="/images/machi-2-banner.jpg"
      />

      <div className="contact-content">
        <div className="contact-card">
          <h2>Get in Touch</h2>
          <p className="contact-intro">
            Interested in one of our kittens or have questions about our cattery?
            We'd love to hear from you!
          </p>

          <div className="contact-details">
            {contact?.email && (
              <div className="contact-item">
                <span className="contact-label">Email</span>
                <a href={`mailto:${contact.email}`} className="contact-value contact-link">
                  {contact.email}
                </a>
              </div>
            )}

            {contact?.phone && (
              <div className="contact-item">
                <span className="contact-label">Phone</span>
                <a href={`tel:${contact.phone}`} className="contact-value contact-link">
                  {contact.phone}
                </a>
              </div>
            )}

            {contact?.wechat && (
              <div className="contact-item">
                <span className="contact-label">WeChat</span>
                <span className="contact-value">{contact.wechat}</span>
              </div>
            )}

            {contact?.instagram && (
              <div className="contact-item">
                <span className="contact-label">Instagram</span>
                <a
                  href={`https://instagram.com/${contact.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-value contact-link"
                >
                  {contact.instagram}
                </a>
              </div>
            )}
          </div>

          {contact && <SocialIcons contact={contact} />}

          {contact?.note && (
            <div className="contact-note">
              <p>{contact.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
