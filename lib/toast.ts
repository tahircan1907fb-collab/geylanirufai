const TOAST_DURATION_MS = 3000;
const TOAST_CONTAINER_ID = 'toast-container';

type ToastType = 'success' | 'info';

function getOrCreateContainer(): HTMLElement {
     let container = document.getElementById(TOAST_CONTAINER_ID);
     if (!container) {
          container = document.createElement('div');
          container.id = TOAST_CONTAINER_ID;
          container.className = 'toast-container';
          document.body.appendChild(container);
     }
     return container;
}

/**
 * Shows a toast notification.
 */
export function showToast(message: string, type: ToastType = 'success') {
     const container = getOrCreateContainer();

     const toast = document.createElement('div');
     toast.className = `toast toast-${type}`;

     const icon = type === 'success' ? '✓' : 'ℹ';
     toast.innerHTML = `<span style="font-size:16px">${icon}</span><span>${message}</span>`;

     container.appendChild(toast);

     setTimeout(() => {
          toast.classList.add('toast-out');
          toast.addEventListener('animationend', () => toast.remove());
     }, TOAST_DURATION_MS);
}

export default showToast;
