interface ContactFormState {
  isSubmitting: boolean;
  fieldErrors: Record<string, string>;
  formError: string | null;
  successMessage: string | null;
}

export class ContactForm {
  private form: HTMLFormElement;
  private submitBtn: HTMLButtonElement;
  private state: ContactFormState;
  private fields: Record<string, HTMLInputElement | HTMLTextAreaElement>;

  constructor(formSelector: string) {
    this.form = document.querySelector(formSelector) as HTMLFormElement;
    if (!this.form) return;

    this.submitBtn = this.form.querySelector('button[type="submit"]') as HTMLButtonElement;
    this.fields = {
      name: this.form.querySelector('#name') as HTMLInputElement,
      email: this.form.querySelector('#email') as HTMLInputElement,
      message: this.form.querySelector('#message') as HTMLTextAreaElement,
    };
    this.state = {
      isSubmitting: false,
      fieldErrors: {},
      formError: null,
      successMessage: null,
    };

    this.init();
  }

  private init(): void {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    Object.values(this.fields).forEach((field) => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearFieldError(field));
    });
  }

  private validateField(field: HTMLInputElement | HTMLTextAreaElement): boolean {
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

  private showFieldError(field: HTMLInputElement | HTMLTextAreaElement, error: string): void {
    const container = field.closest('div') as HTMLElement;
    let errorEl = container.querySelector('.field-error') as HTMLElement;
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'field-error text-sm text-red-400 mt-1';
      container.appendChild(errorEl);
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

  private clearFieldError(field: HTMLInputElement | HTMLTextAreaElement): void {
    const name = field.name;
    if (this.state.fieldErrors[name]) {
      this.state.fieldErrors[name] = '';
      this.showFieldError(field, '');
    }
  }

  private async handleSubmit(e: Event): Promise<void> {
    e.preventDefault();
    if (this.state.isSubmitting) return;

    let isValid = true;
    Object.values(this.fields).forEach((field) => {
      if (!this.validateField(field)) isValid = false;
    });
    if (!isValid) return;

    this.state.isSubmitting = true;
    this.state.formError = null;
    this.state.successMessage = null;
    this.updateUI();

    try {
      await this.mockSubmit();
      this.state.successMessage = 'Message sent successfully! I will get back to you soon.';
      this.form.reset();
    } catch {
      this.state.formError = 'Something went wrong. Please try again later.';
    } finally {
      this.state.isSubmitting = false;
      this.updateUI();
    }
  }

  private mockSubmit(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1500);
    });
  }

  private updateUI(): void {
    const { isSubmitting, formError, successMessage } = this.state;

    this.submitBtn.disabled = isSubmitting;
    this.submitBtn.textContent = isSubmitting ? 'Sending...' : 'Send message';

    let statusEl = this.form.querySelector('.form-status') as HTMLElement;
    if (!statusEl) {
      statusEl = document.createElement('div');
      statusEl.className = 'form-status mt-4';
      this.form.appendChild(statusEl);
    }

    if (formError) {
      statusEl.className = 'form-status mt-4 p-4 rounded-md bg-red-900/20 border border-red-400 text-red-400';
      statusEl.textContent = formError;
      statusEl.setAttribute('role', 'alert');
    } else if (successMessage) {
      statusEl.className = 'form-status mt-4 p-4 rounded-md bg-green-900/20 border border-green-400 text-green-400';
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
