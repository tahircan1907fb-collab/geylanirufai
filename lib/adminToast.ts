const TOAST_DURATION_MS = 3500;
const TOAST_CONTAINER_ID = 'admin-toast-container';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const TOAST_STYLES: Record<ToastType, { bg: string; border: string; icon: string }> = {
     success: { bg: 'rgba(6,78,59,0.95)', border: '#D4AF37', icon: '✓' },
     error: { bg: 'rgba(153,27,27,0.95)', border: '#ef4444', icon: '✕' },
     warning: { bg: 'rgba(146,64,14,0.95)', border: '#f59e0b', icon: '⚠' },
     info: { bg: 'rgba(15,23,42,0.95)', border: '#3b82f6', icon: 'ℹ' },
};

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

export function adminToast(message: string, type: ToastType = 'success') {
     const container = getOrCreateContainer();
     const style = TOAST_STYLES[type];

     const toast = document.createElement('div');
     toast.className = 'toast';
     toast.style.background = style.bg;
     toast.style.borderLeft = `4px solid ${style.border}`;
     toast.innerHTML = `<span style="font-size:16px">${style.icon}</span><span>${message}</span>`;

     container.appendChild(toast);

     setTimeout(() => {
          toast.classList.add('toast-out');
          toast.addEventListener('animationend', () => toast.remove());
     }, TOAST_DURATION_MS);
}

export default adminToast;
