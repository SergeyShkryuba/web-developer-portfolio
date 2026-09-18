interface ContactFormState {
  isSubmitting: boolean;
  fieldErrors: Record<string, string>;
  formError: string | null;
  successMessage: string | null;
}

type FormField = HTMLInputElement | HTMLTextAreaElement;

/** Set in `.env` / the host's environment variables. See `.env.example`. */
const CONTACT_ENDPOINT = import.meta.env['VITE_CONTACT_ENDPOINT'] ?? '';
export const CONTACT_EMAIL = 'serj.shkryuba@gmail.com';

export class ContactForm {
  private readonly form: HTMLFormElement;
  private readonly submitBtn: HTMLButtonElement | null;
  private readonly fields: Record<string, FormField>;
  private state: ContactFormState = {
    isSubmitting: false,
    fieldErrors: {},
    formError: null,
    successMessage: null,
  };

  /**
   * Throws when the form is missing, rather than leaving a half-built instance
   * behind: the previous constructor returned early, so every field was
   * `undefined` and the first interaction failed with an unhelpful error.
   */
  constructor(formSelector: string) {
    const form = document.querySelector<HTMLFormElement>(formSelector);
    if (!form) {
      throw new Error(`ContactForm: no form matched "${formSelector}"`);
    }
    this.form = form;
    this.submitBtn = this.form.querySelector<HTMLButtonElement>('button[type="submit"]');

    const fields: Record<string, FormField> = {};
    for (const id of ['name', 'email', 'message'] as const) {
      const field = this.form.querySelector<FormField>(`#${id}`);
      if (field) fields[id] = field;
    }
    this.fields = fields;

    this.init();
  }

  private init(): void {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    Object.values(this.fields).forEach((field) => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearFieldError(field));
    });
  }

  private validateField(field: FormField): boolean {
    const name = field.name;
    const value = field.value.trim();
    let error = '';

    if (!value) {
      error = 'This field is required';
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = 'Please enter a valid email address';
      }
    } else if (name === 'name' && value.length < 2) {
      error = 'Name must be at least 2 characters';
    } else if (name === 'message' && value.length < 10) {
      error = 'Message must be at least 10 characters';
    }

    this.state.fieldErrors[name] = error;
    this.showFieldError(field, error);
    return !error;
  }

  private showFieldError(field: FormField, error: string): void {
    // Fall back to the field's own parent: `closest('div')` returns null when
    // the input is not wrapped in one, which used to throw here.
    const container = field.closest('div') ?? field.parentElement;
    if (!container) return;

    let errorEl = container.querySelector<HTMLElement>('.field-error');
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'field-error text-sm text-red-400 mt-1';
      errorEl.id = `${field.name}-error`;
      errorEl.setAttribute('aria-live', 'polite');
      container.appendChild(errorEl);
      field.setAttribute('aria-describedby', errorEl.id);
    }
    errorEl.textContent = error;
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    if (error) {
      field.classList.add('border-red-400');
      field.classList.remove('border-line');
    } else {
      field.classList.remove('border-red-400');
      field.classList.add('border-line');
    }
  }

  private clearFieldError(field: FormField): void {
    const name = field.name;
    if (this.state.fieldErrors[name]) {
      this.state.fieldErrors[name] = '';
      this.showFieldError(field, '');
    }
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    if (this.state.isSubmitting) return;

    const invalid = Object.values(this.fields).filter((field) => !this.validateField(field));
    if (invalid.length > 0) {
      // Move focus to the first problem so keyboard and screen reader users are
      // not left guessing which field was rejected.
      invalid[0]?.focus();
      return;
    }

    this.state.isSubmitting = true;
    this.state.formError = null;
    this.state.successMessage = null;
    this.updateUI();

    try {
      await this.send();
      this.state.successMessage = 'Message sent. I will get back to you soon.';
      this.form.reset();
    } catch (error) {
      console.error('Contact form submission failed', error);
      this.state.formError = `Could not send the message. Please email me directly at ${CONTACT_EMAIL}.`;
    } finally {
      this.state.isSubmitting = false;
      this.updateUI();
    }
  }

  /**
   * Posts the message to a form-backend endpoint (Formspree, Web3Forms, a
   * serverless function — anything that accepts JSON).
   *
   * The previous implementation was `mockSubmit()`: a 1.5s timeout that
   * resolved or rejected on `Math.random() > 0.5`. On a portfolio whose whole
   * purpose is being contacted, that reported success to half of all visitors
   * and delivered nothing to any of them.
   *
   * With no endpoint configured, this refuses to claim success — the UI falls
   * back to the mailto link instead of lying.
   */
  private async send(): Promise<void> {
    if (!CONTACT_ENDPOINT) {
      throw new Error('VITE_CONTACT_ENDPOINT is not configured');
    }

    const payload = Object.fromEntries(
      Object.entries(this.fields).map(([name, field]) => [name, field.value.trim()])
    );

    const response = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Form endpoint responded with ${response.status}`);
    }
  }

  private updateUI(): void {
    const { isSubmitting, formError, successMessage } = this.state;

    if (this.submitBtn) {
      this.submitBtn.disabled = isSubmitting;
      this.submitBtn.textContent = isSubmitting ? 'Sending…' : 'Send message';
    }

    let statusEl = this.form.querySelector<HTMLElement>('.form-status');
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = 'form-status mt-4';
      // aria-live so the result is announced without stealing focus.
      statusEl.setAttribute('aria-live', 'polite');
      this.form.appendChild(statusEl);
    }

    if (formError) {
      statusEl.className =
        'form-status mt-4 p-4 rounded-md bg-red-900/20 border border-red-400 text-red-400';
      statusEl.textContent = formError;
      statusEl.setAttribute('role', 'alert');
    } else if (successMessage) {
      statusEl.className =
        'form-status mt-4 p-4 rounded-md bg-green-900/20 border border-green-400 text-green-400';
      statusEl.textContent = successMessage;
      statusEl.setAttribute('role', 'status');
    } else {
      statusEl.className = 'form-status mt-4 hidden';
      statusEl.textContent = '';
      statusEl.removeAttribute('role');
    }
  }
}

export function initContactForm(selector: string = '#contactForm'): ContactForm {
  return new ContactForm(selector);
}

export default initContactForm;
