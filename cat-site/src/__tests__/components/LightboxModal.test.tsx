import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LightboxModal } from '../../components/LightboxModal';
import type { Photo } from '../../data/types';

const photos: Photo[] = [
  { url: 'https://example.com/1.jpg', caption: 'Photo one' },
  { url: 'https://example.com/2.jpg', caption: 'Photo two' },
  { url: 'https://example.com/3.jpg' },
];

describe('LightboxModal', () => {
  it('renders the current photo with caption and counter', () => {
    render(
      <LightboxModal
        photos={photos}
        currentIndex={0}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/1.jpg');
    expect(img).toHaveAttribute('alt', 'Photo one');
    expect(screen.getByText('Photo one')).toBeInTheDocument();
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('uses fallback alt text when no caption', () => {
    render(
      <LightboxModal
        photos={photos}
        currentIndex={2}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Gallery photo 3');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <LightboxModal
        photos={photos}
        currentIndex={0}
        onClose={onClose}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );

    fireEvent.click(screen.getByLabelText('Close lightbox'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onPrev and onNext when nav buttons are clicked', () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(
      <LightboxModal
        photos={photos}
        currentIndex={1}
        onClose={vi.fn()}
        onPrev={onPrev}
        onNext={onNext}
      />
    );

    fireEvent.click(screen.getByLabelText('Previous image'));
    expect(onPrev).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Next image'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <LightboxModal
        photos={photos}
        currentIndex={0}
        onClose={onClose}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onPrev/onNext on ArrowLeft/ArrowRight keys', () => {
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(
      <LightboxModal
        photos={photos}
        currentIndex={1}
        onClose={vi.fn()}
        onPrev={onPrev}
        onNext={onNext}
      />
    );

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(onPrev).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(
      <LightboxModal
        photos={photos}
        currentIndex={0}
        onClose={onClose}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when content area is clicked', () => {
    const onClose = vi.fn();
    render(
      <LightboxModal
        photos={photos}
        currentIndex={0}
        onClose={onClose}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );

    // Click the image (inside content) — should not trigger overlay close
    fireEvent.click(screen.getByRole('img'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('has aria-modal and dialog role for accessibility', () => {
    render(
      <LightboxModal
        photos={photos}
        currentIndex={0}
        onClose={vi.fn()}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-label', 'Image lightbox');
  });
});
