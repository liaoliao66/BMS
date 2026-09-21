/* CRM 弹窗与 Toast（并入 BMS 壳，不含独立侧栏） */
const MODAL_SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-5xl'
};

function injectModalStyles() {
  if (document.getElementById('crm-modal-styles')) return;
  const style = document.createElement('style');
  style.id = 'crm-modal-styles';
  style.textContent = `
    @keyframes crmModalIn { from { opacity: 0; transform: scale(0.96) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    @keyframes crmOverlayIn { from { opacity: 0; } to { opacity: 1; } }
    #crm-modal-overlay { animation: crmOverlayIn .2s ease; }
    #crm-modal-panel { animation: crmModalIn .25s ease; box-shadow: 0 12px 40px rgba(0,0,0,0.12); }
    .crm-field input, .crm-field select, .crm-field textarea { width: 100%; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 0.625rem 0.75rem; font-size: 0.875rem; outline: none; }
    .crm-field input:focus, .crm-field select:focus, .crm-field textarea:focus { box-shadow: 0 0 0 2px rgba(13,148,136,0.25); border-color: #0d9488; }
    .crm-label { display: block; font-size: 0.875rem; color: #475569; margin-bottom: 0.25rem; }
    .crm-req { color: #ef4444; }
  `;
  document.head.appendChild(style);
}

function openModal({ title, body, footer = '', size = 'lg', onClose }) {
  injectModalStyles();
  closeModal(false);
  const overlay = document.createElement('div');
  overlay.id = 'crm-modal-overlay';
  overlay.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4';
  overlay.innerHTML = `
    <div class="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" data-close-modal></div>
    <div id="crm-modal-panel" class="relative bg-white rounded-2xl w-full flex flex-col max-h-[90vh] ${MODAL_SIZES[size] || MODAL_SIZES.lg}">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
        <h3 class="font-semibold text-lg text-slate-900">${title}</h3>
        <button type="button" data-close-modal class="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="overflow-y-auto flex-1 px-6 py-5 text-sm">${body}</div>
      ${footer ? `<div class="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-end gap-3 bg-slate-50/50 rounded-b-2xl">${footer}</div>` : ''}
    </div>`;
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  overlay._onClose = onClose;
  overlay.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', () => closeModal()));
}

function openModalFromTemplate(templateId, { title, size = 'lg', footer = '', onClose } = {}) {
  const tpl = document.getElementById(templateId);
  if (!tpl) return;
  openModal({ title, body: tpl.innerHTML, footer, size, onClose });
}

function modalFooter(cancelText = '取消', confirmText = '保存', confirmClass = 'bg-teal-600 hover:bg-teal-700 text-white', onConfirm = 'closeModal(); showToast(\'保存成功\')') {
  return `
    <button type="button" data-close-modal class="px-5 py-2.5 border border-slate-200 rounded-xl text-sm hover:bg-white transition active:scale-95">${cancelText}</button>
    <button type="button" onclick="${onConfirm}" class="px-5 py-2.5 ${confirmClass} rounded-xl text-sm font-medium transition active:scale-95">${confirmText}</button>`;
}

function closeModal(triggerCallback = true) {
  const overlay = document.getElementById('crm-modal-overlay');
  if (overlay) {
    if (triggerCallback && overlay._onClose) overlay._onClose();
    overlay.remove();
  }
  document.body.style.overflow = '';
}

function openModalByParam() {
  const modal = new URLSearchParams(location.search).get('modal');
  if (!modal) return;
  const fn = window.CRM_MODALS && window.CRM_MODALS[modal];
  if (typeof fn === 'function') fn();
  history.replaceState(null, '', location.pathname);
}

function showToast(msg, type = 'success') {
  const el = document.createElement('div');
  const colors = { success: 'bg-emerald-600', error: 'bg-red-500', info: 'bg-slate-700' };
  el.className = `fixed top-6 right-6 z-[110] ${colors[type] || colors.info} text-white px-5 py-3 rounded-xl shadow-lg text-sm`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

function addBillingRow(btn) {
  const tbody = btn.closest('table').querySelector('tbody');
  const tr = document.createElement('tr');
  tr.className = 'border-b border-slate-100';
  tr.innerHTML = `<td class="py-2 pr-2"><select class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs w-full"><option>装卸费</option><option>堆存费</option><option>停泊费</option><option>港务费</option><option>铁水联运代理费</option><option>铁路衔接费</option><option>其他</option></select></td><td class="py-2 pr-2"><select class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs w-full"><option>元/吨</option><option>元/次</option><option>包干</option></select></td><td class="py-2 pr-2"><input type="number" class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs w-full"></td><td class="py-2 pr-2"><input class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs w-full" placeholder="免费天数等"></td><td class="py-2 pr-2"><select class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs w-full"><option>铁矿</option><option>煤炭</option><option>钢材</option></select></td><td class="py-2 pr-2"><select class="border border-slate-200 rounded-lg px-2 py-1.5 text-xs w-full"><option>卸船</option><option>装船</option><option>铁水联运</option><option>堆存</option></select></td><td class="py-2"><button type="button" class="text-red-400 hover:text-red-600 text-xs" onclick="this.closest('tr').remove()"><i class="fa-solid fa-trash"></i></button></td>`;
  tbody.appendChild(tr);
}

document.addEventListener('DOMContentLoaded', openModalByParam);
