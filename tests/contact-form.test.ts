import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ContactForm } from '@features/contact-form/contact-form';

function mountForm(): HTMLFormElement {
  document.body.innerHTML = `
    <form id="contactForm" novalidate>
      <input id="name" name="name" />
      <input id="email" name="email" type="email" />
      <textarea id="message" name="message"></textarea>
      <button type="submit">Send message</button>
    </form>
  `;
  return document.querySelector('#contactForm') as HTMLFormElement;
}

function fill(values: { name?: string; email?: string; message?: string }): void {
  if (values.name !== undefined) {
    (document.querySelector('#name') as HTMLInputElement).value = values.name;
  }
  if (values.email !== undefined) {
    (document.querySelector('#email') as HTMLInputElement).value = values.email;
  }
  if (values.message !== undefined) {
    (document.querySelector('#message') as HTMLTextAreaElement).value = values.message;
  }
}

const VALID = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'I would like to talk about a frontend role at our company.',
};

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('ContactForm', () => {
  beforeEach(() => {
    mountForm();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('throws instead of half-constructing when the form is absent', () => {
    document.body.innerHTML = '';
    expect(() => new ContactForm('#contactForm')).toThrow(/no form matched/);
  });

  it('rejects an empty submission without calling the network', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    new ContactForm('#contactForm');

    document
      .querySelector('#contactForm')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    await flush();

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it.each([
    ['not-an-email', 'invalid address'],
    ['', 'empty address'],
  ])('rejects %s (%s)', async (email) => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    new ContactForm('#contactForm');
    fill({ ...VALID, email });

    document
      .querySelector('#contactForm')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    await flush();

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('rejects a message shorter than ten characters', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    new ContactForm('#contactForm');
    fill({ ...VALID, message: 'hi' });

    document
      .querySelector('#contactForm')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    await flush();

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('reports a failure instead of claiming success when no endpoint is configured', async () => {
    // The old implementation resolved on `Math.random() > 0.5`, so half of all
    // visitors were told their message had been sent when nothing was ever
    // transmitted. Without an endpoint the form must now say so.
    new ContactForm('#contactForm');
    fill(VALID);

    document
      .querySelector('#contactForm')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    await flush();
    await flush();

    const status = document.querySelector('.form-status');
    expect(status?.textContent).toMatch(/could not send/i);
    expect(status?.textContent).toContain('serj.shkryuba@gmail.com');
    expect(status?.getAttribute('role')).toBe('alert');
  });

  it('announces status changes politely', async () => {
    new ContactForm('#contactForm');
    fill(VALID);

    document
      .querySelector('#contactForm')
      ?.dispatchEvent(new Event('submit', { cancelable: true }));
    await flush();
    await flush();

    expect(document.querySelector('.form-status')?.getAttribute('aria-live')).toBe('polite');
  });
});
