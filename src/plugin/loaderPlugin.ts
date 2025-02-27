import { Dialog } from 'quasar';

let loaderInstance;
let activeRequests = 0;

const showLoader = () => {
  activeRequests += 1;
  if (loaderInstance) return;
  loaderInstance = Dialog.create({
    message: 'Aguarde...',
    progress: true,
    persistent: true,
    ok: false,
  });
};

const hideLoader = () => {
  if (activeRequests > 0) {
    activeRequests -= 1;
  }

  if (loaderInstance && activeRequests === 0) {
    loaderInstance.hide();
    loaderInstance = null;
  }
};

export { showLoader, hideLoader };