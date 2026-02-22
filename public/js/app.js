// API Base URL
const API_BASE_URL = '/api';

// Auth Functions
async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      showAlert('Login successful', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } else {
      showAlert(data.message, 'danger');
    }
  } catch (error) {
    showAlert('Login failed: ' + error.message, 'danger');
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
}

function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// API Helper Functions
async function apiCall(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const authToken = localStorage.getItem('token');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Patient Functions
async function getAllPatients(page = 1, search = '', limit = 10) {
  const query = new URLSearchParams({ page, search, limit });
  return apiCall(`/patients?${query}`);
}

async function getPatientById(id) {
  return apiCall(`/patients/${id}`);
}

async function createPatient(patientData) {
  return apiCall('/patients', {
    method: 'POST',
    body: JSON.stringify(patientData)
  });
}

async function updatePatient(id, patientData) {
  return apiCall(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patientData)
  });
}

// Appointment Functions
async function getAllAppointments(status = '', doctorId = '', page = 1) {
  const query = new URLSearchParams({ status, doctorId, page });
  return apiCall(`/appointments?${query}`);
}

async function bookAppointment(appointmentData) {
  return apiCall('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData)
  });
}

async function updateAppointmentStatus(id, status, notes = '') {
  return apiCall(`/appointments/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes })
  });
}

async function rescheduleAppointment(id, appointmentDate, timeSlot) {
  return apiCall(`/appointments/${id}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify({ appointmentDate, timeSlot })
  });
}

async function cancelAppointment(id, cancellationReason) {
  return apiCall(`/appointments/${id}/cancel`, {
    method: 'PUT',
    body: JSON.stringify({ cancellationReason })
  });
}

// Medical Waste Functions
async function getAllWaste(category = '', status = '', page = 1) {
  const query = new URLSearchParams({ category, status, page });
  return apiCall(`/medical-waste?${query}`);
}

async function createWasteEntry(wasteData) {
  return apiCall('/medical-waste', {
    method: 'POST',
    body: JSON.stringify(wasteData)
  });
}

async function updateWasteStatus(id, statusData) {
  return apiCall(`/medical-waste/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData)
  });
}

async function getWasteReport(startDate = '', endDate = '', category = '') {
  const query = new URLSearchParams({ startDate, endDate, category });
  return apiCall(`/medical-waste/report/generate?${query}`);
}

// Invoice Functions
async function getAllInvoices(page = 1, status = '', patientId = '') {
  const query = new URLSearchParams({ page, status, patientId });
  return apiCall(`/invoices?${query}`);
}

async function getInvoiceById(id) {
  return apiCall(`/invoices/${id}`);
}

async function createInvoice(invoiceData) {
  return apiCall('/invoices', {
    method: 'POST',
    body: JSON.stringify(invoiceData)
  });
}

async function recordPayment(id, paymentData) {
  return apiCall(`/invoices/${id}/payment`, {
    method: 'PUT',
    body: JSON.stringify(paymentData)
  });
}

// Doctor Functions
async function getAllDoctors(department = '', page = 1) {
  const query = new URLSearchParams({ department, page });
  return apiCall(`/doctors?${query}`);
}

async function getDoctorById(id) {
  return apiCall(`/doctors/${id}`);
}

// Inventory Functions
async function getAllInventory(page = 1, category = '', search = '') {
  const query = new URLSearchParams({ page, category, search });
  return apiCall(`/inventory?${query}`);
}

async function createInventoryItem(data) {
  return apiCall('/inventory', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

async function getLowStockItems() {
  return apiCall('/inventory/low-stock');
}

async function updateInventoryQuantity(id, quantity, action) {
  return apiCall(`/inventory/${id}/quantity`, {
    method: 'PUT',
    body: JSON.stringify({ quantity, action })
  });
}

// Department Functions
async function getAllDepartments() {
  return apiCall('/departments');
}

// UI Helper Functions
function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type}`;
  alertDiv.textContent = message;
  alertDiv.style.position = 'fixed';
  alertDiv.style.top = '80px';
  alertDiv.style.right = '20px';
  alertDiv.style.zIndex = '10000';
  alertDiv.style.maxWidth = '400px';

  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.remove();
  }, 4000);
}

function showLoading() {
  const loader = document.createElement('div');
  loader.className = 'loading';
  loader.id = 'loader';
  loader.innerHTML = '<div class="spinner"></div>';
  document.body.appendChild(loader);
}

function hideLoading() {
  const loader = document.getElementById('loader');
  if (loader) loader.remove();
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

function formatStatus(status) {
  const statusMap = {
    'Scheduled': 'badge-primary',
    'Confirmed': 'badge-success',
    'Completed': 'badge-success',
    'Cancelled': 'badge-danger',
    'Pending': 'badge-warning',
    'Partial': 'badge-warning',
    'Paid': 'badge-success',
    'Collected': 'badge-primary',
    'Disposed': 'badge-success'
  };
  return `<span class="badge ${statusMap[status] || 'badge-secondary'}">${status}</span>`;
}

// Table Functions
function createTable(data, columns) {
  let html = '<table><thead><tr>';
  columns.forEach(col => {
    html += `<th>${col.label}</th>`;
  });
  html += '</tr></thead><tbody>';

  data.forEach(row => {
    html += '<tr>';
    columns.forEach(col => {
      const value = eval(`row.${col.key}`);
      html += `<td>${col.format ? col.format(value) : value}</td>`;
    });
    html += '</tr>';
  });

  html += '</tbody></table>';
  return html;
}

// Form Functions
function getFormData(formId) {
  const form = document.getElementById(formId);
  const formData = new FormData(form);
  const data = {};
  formData.forEach((value, key) => {
    data[key] = value;
  });
  return data;
}

function resetForm(formId) {
  const form = document.getElementById(formId);
  if (form) form.reset();
}

// Chart Helper (using simple bars)
function drawSimpleChart(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '<div style="display: flex; gap: 1rem; align-items: flex-end; height: 200px; margin: 1rem 0;">';
  const maxValue = Math.max(...Object.values(data));

  Object.entries(data).forEach(([label, value]) => {
    const percentage = (value / maxValue) * 100;
    html += `
      <div style="flex: 1; text-align: center;">
        <div style="background: #667eea; height: ${percentage}%; border-radius: 4px; margin-bottom: 0.5rem;"></div>
        <small>${label}: ${value}</small>
      </div>
    `;
  });

  html += '</div>';
  container.innerHTML = html;
}

// Check Authentication
function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
      window.location.href = '/login';
    }
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', checkAuth);
