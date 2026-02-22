// Dashboard JavaScript Functions

let invoiceItems = [];

// ===== ROLE-BASED ACCESS CONTROL =====
function getUserRole() {
  const user = getCurrentUser();
  return user ? user.role : null;
}

function initializeRoleBasedUI() {
  const userRole = getUserRole();
  
  if (!userRole) {
    window.location.href = '/login';
    return;
  }
  
  // Display user role in header
  showUserRole(userRole);
  
  // Show/hide sidebar menu items based on role (only show features allowed for this role)
  const menuItems = document.querySelectorAll('.sidebar-nav li[data-role]');
  menuItems.forEach(item => {
    const allowedRoles = item.getAttribute('data-role').split(',').map(r => r.trim());
    if (allowedRoles.includes(userRole)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
  
  // Show/hide dashboard sections based on role
  const sections = document.querySelectorAll('section[data-role]');
  sections.forEach(section => {
    const allowedRoles = section.getAttribute('data-role').split(',');
    if (allowedRoles.includes(userRole)) {
      // Keep section available but hidden via CSS
      section.setAttribute('data-accessible', 'true');
    } else {
      section.setAttribute('data-accessible', 'false');
    }
  });
  
  // Show/hide action buttons based on role
  const buttons = document.querySelectorAll('button[data-role]');
  buttons.forEach(button => {
    const allowedRoles = button.getAttribute('data-role').split(',');
    if (allowedRoles.includes(userRole)) {
      button.style.display = 'inline-block';
    } else {
      button.style.display = 'none';
    }
  });
  
  // Load dashboard section initially
  loadSection('dashboard');
}

function showUserRole(role) {
  const roleElement = document.getElementById('userRole');
  if (roleElement) {
    const roleLabel = {
      'Admin': '👨‍💼 Admin',
      'Doctor': '👨‍⚕️ Doctor',
      'Receptionist': '👩‍💼 Receptionist',
      'Staff': '👷 Staff'
    };
    roleElement.textContent = roleLabel[role] || role;
  }
}

function checkRoleAccess(requiredRoles) {
  if (typeof requiredRoles === 'string') {
    requiredRoles = [requiredRoles];
  }
  
  const userRole = getUserRole();
  if (!requiredRoles.includes(userRole)) {
    showAlert('You do not have permission to access this feature.', 'danger');
    return false;
  }
  return true;
}

// ===== END ROLE-BASED ACCESS CONTROL =====

// Filter Functions for Dropdowns
function filterPatientOptions() {
  const searchInput = document.getElementById('appointmentPatientSearch').value.toLowerCase();
  const select = document.getElementById('appointmentPatientSelect');
  const options = select.querySelectorAll('option');
  
  options.forEach(option => {
    if (option.value === '') {
      option.style.display = 'block';
    } else {
      const text = option.textContent.toLowerCase();
      option.style.display = text.includes(searchInput) ? 'block' : 'none';
    }
  });
}

function filterDoctorOptions() {
  const searchInput = document.getElementById('appointmentDoctorSearch').value.toLowerCase();
  const select = document.getElementById('appointmentDoctorSelect');
  const options = select.querySelectorAll('option');
  
  options.forEach(option => {
    if (option.value === '') {
      option.style.display = 'block';
    } else {
      const text = option.textContent.toLowerCase();
      option.style.display = text.includes(searchInput) ? 'block' : 'none';
    }
  });
}

function filterInvoicePatientOptions() {
  const searchInput = document.getElementById('invoicePatientSearch').value.toLowerCase();
  const select = document.getElementById('invoicePatientSelect');
  const options = select.querySelectorAll('option');
  
  options.forEach(option => {
    if (option.value === '') {
      option.style.display = 'block';
    } else {
      const text = option.textContent.toLowerCase();
      option.style.display = text.includes(searchInput) ? 'block' : 'none';
    }
  });
}

function onInvoicePatientSelected() {
  const select = document.getElementById('invoicePatientSelect');
  const selectedText = select.options[select.selectedIndex].text;
  
  if (select.value) {
    // Show success indicator
    const indicator = document.getElementById('invoicePatientIndicator');
    if (indicator) {
      indicator.style.display = 'block';
      indicator.textContent = '✓ ' + selectedText;
    }
  }
}

function filterPatientList() {
  const searchInput = document.getElementById('patientSearchModal').value.toLowerCase();
  const select = document.getElementById('patientListSelect');
  const options = select.querySelectorAll('option');
  
  options.forEach(option => {
    if (option.value === '') {
      option.style.display = 'block';
    } else {
      const text = option.textContent.toLowerCase();
      option.style.display = text.includes(searchInput) ? 'block' : 'none';
    }
  });
}

async function selectExistingPatient() {
  const select = document.getElementById('patientListSelect');
  const patientId = select.value;
  
  if (!patientId) {
    // Create new patient mode
    resetForm('patientForm');
    document.getElementById('patientSearchModal').value = '';
    return;
  }
  
  // Get patient details and populate form
  const result = await getPatientById(patientId);
  if (result.success && result.data) {
    const patient = result.data;
    document.getElementById('patientForm').querySelector('[name="firstName"]').value = patient.firstName || '';
    document.getElementById('patientForm').querySelector('[name="lastName"]').value = patient.lastName || '';
    document.getElementById('patientForm').querySelector('[name="dateOfBirth"]').value = patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '';
    document.getElementById('patientForm').querySelector('[name="gender"]').value = patient.gender || '';
    document.getElementById('patientForm').querySelector('[name="phone"]').value = patient.phone || '';
    document.getElementById('patientForm').querySelector('[name="email"]').value = patient.email || '';
    document.getElementById('patientForm').querySelector('[name="address"]').value = patient.address || '';
    document.getElementById('patientForm').querySelector('[name="bloodType"]').value = patient.bloodType || '';
  }
}

// Load sections
function loadSection(section) {
  // Define role requirements for each section
  const roleRequirements = {
    'dashboard': ['Admin', 'Doctor', 'Receptionist', 'Staff'],
    'patients': ['Admin', 'Doctor', 'Receptionist', 'Staff'],
    'appointments': ['Admin', 'Doctor', 'Receptionist', 'Staff'],
    'medical-waste': ['Admin', 'Staff'],
    'invoices': ['Admin', 'Receptionist'],
    'inventory': ['Admin']
  };
  
  // Check role access
  const requiredRoles = roleRequirements[section] || [];
  if (requiredRoles.length > 0 && !checkRoleAccess(requiredRoles)) {
    loadSection('dashboard');
    return;
  }
  
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
  
  // Show selected section
  const sectionElement = document.getElementById(`${section}-section`);
  if (sectionElement) {
    sectionElement.style.display = 'block';
    sectionElement.classList.add('active');
  }
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  if (sectionElement) sectionElement.classList.add('active');

  // Update sidebar active state
  document.querySelectorAll('.sidebar-nav .nav-link').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('data-section') === section + '-section') a.classList.add('active');
  });

  // Show/hide header "Back to Dashboard" button
  const backBtn = document.getElementById('backToDashboardBtn');
  if (backBtn) backBtn.style.display = section === 'dashboard' ? 'none' : 'inline-flex';

  // Load data based on section
  switch(section) {
    case 'dashboard':
      loadDashboard();
      break;
    case 'patients':
      loadPatients();
      break;
    case 'appointments':
      loadAppointments();
      break;
    case 'medical-waste':
      loadWaste();
      break;
    case 'invoices':
      loadInvoices();
      break;
    case 'inventory':
      loadInventory();
      break;
    case 'reports':
      break;
  }
}

// Dashboard
async function loadDashboard() {
  showLoading();
  
  try {
    // Get stats and data (fetch completed appointments for count + list)
    const [appointments, completedRes, patients, waste, invoices, inventory] = await Promise.all([
      getAllAppointments(),
      getAllAppointments('Completed'),
      getAllPatients(1, ''),
      getAllWaste(),
      getAllInvoices(),
      getAllInventory()
    ]);

    const totalPatients = patients.data?.total ?? 0;
    const completedCount = completedRes.data?.total ?? 0;
    const completedList = completedRes.data?.appointments ?? [];
    const totalAppointments = appointments.data?.total ?? 0;

    // Display stat cards
    const statsHtml = `
      <div class="stat-card">
        <h3>Total Patients</h3>
        <div class="number primary">${totalPatients}</div>
      </div>
      <div class="stat-card">
        <h3>Total Appointments</h3>
        <div class="number">${totalAppointments}</div>
      </div>
      <div class="stat-card">
        <h3>Completed Appointments</h3>
        <div class="number secondary">${completedCount}</div>
      </div>
      <div class="stat-card">
        <h3>Pending Invoices</h3>
        <div class="number">${invoices.data?.invoices?.filter(i => i.paymentStatus === 'Pending').length ?? 0}</div>
      </div>
      <div class="stat-card">
        <h3>Medical Waste Entries</h3>
        <div class="number">${waste.data?.waste?.length ?? 0}</div>
      </div>
      <div class="stat-card">
        <h3>Low Stock Items</h3>
        <div class="number">${inventory.data?.items?.filter(i => i.quantity <= i.minimumLevel).length ?? 0}</div>
      </div>
    `;
    document.getElementById('dashboardStats').innerHTML = statsHtml;

    // Patient Statistics card
    const patientStatsHtml = `
      <div class="patient-stats-summary">
        <div class="patient-stat-row">
          <span class="label">Total Patients</span>
          <span class="value">${totalPatients}</span>
        </div>
        <div class="patient-stat-row">
          <span class="label">Completed Appointments</span>
          <span class="value">${completedCount}</span>
        </div>
        <div class="patient-stat-row">
          <span class="label">Total Appointments</span>
          <span class="value">${totalAppointments}</span>
        </div>
      </div>
    `;
    const patientStatsEl = document.getElementById('patientStats');
    if (patientStatsEl) patientStatsEl.innerHTML = patientStatsHtml;

    // Recent appointments (all statuses)
    const recentList = appointments.data?.appointments ?? [];
    if (recentList.length > 0) {
      let appointmentsHtml = '<table><thead><tr><th>Patient</th><th>Date</th><th>Time</th><th>Status</th></tr></thead><tbody>';
      recentList.slice(0, 6).forEach(apt => {
        appointmentsHtml += `
          <tr>
            <td>${apt.patient?.firstName || 'N/A'} ${apt.patient?.lastName || ''}</td>
            <td>${formatDate(apt.appointmentDate)}</td>
            <td>${apt.timeSlot || '—'}</td>
            <td>${formatStatus(apt.status)}</td>
          </tr>
        `;
      });
      appointmentsHtml += '</tbody></table>';
      document.getElementById('recentAppointments').innerHTML = appointmentsHtml;
    } else {
      document.getElementById('recentAppointments').innerHTML = '<p class="empty-state">No recent appointments</p>';
    }

    // Completed Appointments list
    const completedEl = document.getElementById('completedAppointmentsList');
    if (completedEl) {
      if (completedList.length > 0) {
        let completedHtml = '<table><thead><tr><th>Patient</th><th>Date</th><th>Time</th></tr></thead><tbody>';
        completedList.slice(0, 8).forEach(apt => {
          completedHtml += `
            <tr>
              <td>${apt.patient?.firstName || 'N/A'} ${apt.patient?.lastName || ''}</td>
              <td>${formatDate(apt.appointmentDate)}</td>
              <td>${apt.timeSlot || '—'}</td>
            </tr>
          `;
        });
        completedHtml += '</tbody></table>';
        completedEl.innerHTML = completedHtml;
      } else {
        completedEl.innerHTML = '<p class="empty-state">No completed appointments yet</p>';
      }
    }

    // Waste summary chart
    if (waste.data?.waste?.length > 0) {
      const wasteByCategory = {};
      waste.data.waste.forEach(w => {
        wasteByCategory[w.category] = (wasteByCategory[w.category] || 0) + w.quantity;
      });
      drawSimpleChart('wasteChart', wasteByCategory);
    } else {
      const wasteChartEl = document.getElementById('wasteChart');
      if (wasteChartEl) wasteChartEl.innerHTML = '<p class="empty-state">No waste data</p>';
    }
  } catch (error) {
    showAlert('Error loading dashboard: ' + error.message, 'danger');
  }

  hideLoading();
}

// Patients
async function loadPatients() {
  showLoading();
  const search = document.getElementById('patientSearch')?.value || '';
  
  try {
    const result = await getAllPatients(1, search);
    
    if (!result.success) {
      showAlert('Error loading patients', 'danger');
      hideLoading();
      return;
    }

    let html = '<table>';
    html += '<thead><tr><th>ID</th><th>Name</th><th>Phone</th><th>Blood Type</th><th>Last Visit</th><th>Actions</th></tr></thead><tbody>';

    if (result.data.patients && result.data.patients.length > 0) {
      result.data.patients.forEach(patient => {
        html += `
          <tr>
            <td>${patient.patientId}</td>
            <td>${patient.firstName} ${patient.lastName}</td>
            <td>${patient.phone}</td>
            <td>${patient.bloodType || 'N/A'}</td>
            <td>${patient.lastVisit ? formatDate(patient.lastVisit) : 'Never'}</td>
            <td>
              <button class="btn btn-primary" onclick="editPatient('${patient._id}')">Edit</button>
              <button class="btn btn-danger" onclick="deletePatient('${patient._id}')">Delete</button>
            </td>
          </tr>
        `;
      });
    } else {
      html += '<tr><td colspan="6" style="text-align: center;">No patients found</td></tr>';
    }

    html += '</tbody></table>';
    document.getElementById('patientsList').innerHTML = html;
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  }

  hideLoading();
}

// Appointments
async function loadAppointments() {
  showLoading();
  const status = document.getElementById('appointmentStatus')?.value || '';
  
  try {
    const result = await getAllAppointments(status);
    
    if (!result.success) {
      showAlert('Error loading appointments', 'danger');
      hideLoading();
      return;
    }

    let html = '<table>';
    html += '<thead><tr><th>ID</th><th>Patient</th><th>Date</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead><tbody>';

    if (result.data.appointments && result.data.appointments.length > 0) {
      result.data.appointments.forEach(apt => {
        const canComplete = apt.status !== 'Completed' && apt.status !== 'Cancelled';
        const canSetPending = apt.status === 'Completed';
        html += `
          <tr>
            <td>${apt.appointmentId}</td>
            <td>${apt.patient?.firstName || 'N/A'} ${apt.patient?.lastName || ''}</td>
            <td>${formatDate(apt.appointmentDate)}</td>
            <td>${apt.timeSlot}</td>
            <td>${formatStatus(apt.status)}</td>
            <td>
              <button class="btn btn-secondary" onclick="editAppointment('${apt._id}')">Edit</button>
              ${canComplete ? `<button class="btn btn-success" onclick="setAppointmentStatus('${apt._id}', 'Completed')">Mark Completed</button>` : ''}
              ${canSetPending ? `<button class="btn btn-warning" onclick="setAppointmentStatus('${apt._id}', 'Scheduled')">Mark Pending</button>` : ''}
              ${apt.status === 'Scheduled' || apt.status === 'Confirmed' ? `<button class="btn btn-danger" onclick="cancelAppointment('${apt._id}')">Cancel</button>` : ''}
            </td>
          </tr>
        `;
      });
    } else {
      html += '<tr><td colspan="6" style="text-align: center;">No appointments found</td></tr>';
    }

    html += '</tbody></table>';
    document.getElementById('appointmentsList').innerHTML = html;
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  }

  hideLoading();
}

// Medical Waste
async function loadWaste() {
  showLoading();
  const category = document.getElementById('wasteCategory')?.value || '';
  const status = document.getElementById('wasteStatus')?.value || '';
  
  try {
    const result = await getAllWaste(category, status);
    
    if (!result.success) {
      showAlert('Error loading waste records', 'danger');
      hideLoading();
      return;
    }

    let html = '<table>';
    html += '<thead><tr><th>ID</th><th>Category</th><th>Quantity</th><th>Unit</th><th>Hazard Level</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>';

    if (result.data.waste && result.data.waste.length > 0) {
      result.data.waste.forEach(waste => {
        html += `
          <tr>
            <td>${waste.wasteId}</td>
            <td>${waste.category}</td>
            <td>${waste.quantity}</td>
            <td>${waste.unit}</td>
            <td><span class="badge badge-${waste.hazardLevel === 'High' ? 'danger' : waste.hazardLevel === 'Medium' ? 'warning' : 'success'}">${waste.hazardLevel}</span></td>
            <td>${formatStatus(waste.status)}</td>
            <td>${formatDate(waste.date)}</td>
            <td>
              <button class="btn btn-secondary" onclick="updateWasteStatusBtn('${waste._id}')">Update</button>
            </td>
          </tr>
        `;
      });
    } else {
      html += '<tr><td colspan="8" style="text-align: center;">No waste records found</td></tr>';
    }

    html += '</tbody></table>';
    document.getElementById('wasteList').innerHTML = html;
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  }

  hideLoading();
}

// Invoices
async function loadInvoices() {
  showLoading();
  const status = document.getElementById('invoiceStatus')?.value || '';
  
  try {
    const result = await getAllInvoices(1, status);
    
    if (!result.success) {
      showAlert('Error loading invoices', 'danger');
      hideLoading();
      return;
    }

    let html = '<table>';
    html += '<thead><tr><th>ID</th><th>Patient</th><th>Total</th><th>Amount Paid</th><th>Balance</th><th>Status</th><th>Actions</th></tr></thead><tbody>';

    if (result.data.invoices && result.data.invoices.length > 0) {
      result.data.invoices.forEach(invoice => {
        const isPaid = invoice.paymentStatus === 'Paid';
        const hasBalance = (invoice.balanceDue || 0) > 0;
        html += `
          <tr>
            <td>${invoice.invoiceId}</td>
            <td>${invoice.patient?.firstName || 'N/A'} ${invoice.patient?.lastName || ''}</td>
            <td>${formatCurrency(invoice.totalAmount)}</td>
            <td>${formatCurrency(invoice.amountPaid || 0)}</td>
            <td>${formatCurrency(invoice.balanceDue)}</td>
            <td>${formatStatus(invoice.paymentStatus)}</td>
            <td>
              ${hasBalance ? `<button class="btn btn-secondary" onclick="recordPaymentBtn('${invoice._id}')">Record Payment</button>` : ''}
              <button class="btn btn-primary" onclick="viewReceipt('${invoice._id}')">View Receipt</button>
            </td>
          </tr>
        `;
      });
    } else {
      html += '<tr><td colspan="7" style="text-align: center;">No invoices found</td></tr>';
    }

    html += '</tbody></table>';
    document.getElementById('invoicesList').innerHTML = html;
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  }

  hideLoading();
}

// Inventory
async function loadInventory() {
  showLoading();
  const search = document.getElementById('inventorySearch')?.value || '';
  
  try {
    const result = await getAllInventory(1, '', search);
    
    if (!result.success) {
      showAlert('Error loading inventory', 'danger');
      hideLoading();
      return;
    }

    let html = '<table>';
    html += '<thead><tr><th>Item ID</th><th>Name</th><th>Category</th><th>Department</th><th>Quantity</th><th>Unit Price</th><th>Actions</th></tr></thead><tbody>';

    if (result.data.items && result.data.items.length > 0) {
      result.data.items.forEach(item => {
        const deptName = item.department?.name || '—';
        html += `
          <tr>
            <td>${item.itemId}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${deptName}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.unitPrice || 0)}</td>
            <td>
              <button class="btn btn-secondary" onclick="updateInventoryBtn('${item._id}')">Update</button>
            </td>
          </tr>
        `;
      });
    } else {
      html += '<tr><td colspan="7" style="text-align: center;">No items found</td></tr>';
    }

    html += '</tbody></table>';
    document.getElementById('inventoryList').innerHTML = html;
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  }

  hideLoading();
}

async function loadLowStockItems() {
  showLoading();
  
  try {
    const result = await getLowStockItems();
    
    if (!result.success) {
      showAlert('Error loading low stock items', 'danger');
      hideLoading();
      return;
    }

    let html = '<div class="alert alert-warning">Low Stock Items Alert</div>';
    html += '<table>';
    html += '<thead><tr><th>Item ID</th><th>Name</th><th>Current Quantity</th><th>Minimum Required</th><th>Actions</th></tr></thead><tbody>';

    if (result.data && result.data.length > 0) {
      result.data.forEach(item => {
        html += `
          <tr style="background: #ffe6e6">
            <td>${item.itemId}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.minimumLevel}</td>
            <td>
              <button class="btn btn-warning" onclick="restockItem('${item._id}')">Restock</button>
            </td>
          </tr>
        `;
      });
    } else {
      html += '<tr><td colspan="5" style="text-align: center;">All items have sufficient stock</td></tr>';
    }

    html += '</tbody></table>';
    document.getElementById('inventoryList').innerHTML = html;
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  }

  hideLoading();
}

// Modal Functions
async function openPatientModal() {
  if (!checkRoleAccess(['Admin', 'Receptionist', 'Doctor', 'Staff'])) return;
  resetForm('patientForm');
  
  // Load patients list
  const patientsResult = await getAllPatients();
  const patientListSelect = document.getElementById('patientListSelect');
  patientListSelect.innerHTML = '<option value="">-- Create New Patient --</option>';
  
  if (patientsResult.success && patientsResult.data.patients) {
    patientsResult.data.patients.forEach(patient => {
      const option = document.createElement('option');
      option.value = patient._id;
      option.textContent = `${patient.firstName} ${patient.lastName} (${patient.patientId})`;
      patientListSelect.appendChild(option);
    });
  }
  
  document.getElementById('patientModal').style.display = 'block';
}

async function openAppointmentModal() {
  if (!checkRoleAccess(['Admin', 'Receptionist', 'Doctor', 'Staff'])) return;
  resetForm('appointmentForm');
  
  // Load patients
  const patientsResult = await getAllPatients();
  const patientSelect = document.getElementById('appointmentPatientSelect');
  patientSelect.innerHTML = '<option value="">-- Select Patient --</option>';
  if (patientsResult.success && patientsResult.data.patients) {
    patientsResult.data.patients.forEach(patient => {
      const option = document.createElement('option');
      option.value = patient._id;
      option.textContent = `${patient.firstName} ${patient.lastName} (${patient.patientId})`;
      patientSelect.appendChild(option);
    });
  }
  
  // Load doctors
  const doctorsResult = await getAllDoctors();
  const doctorSelect = document.getElementById('appointmentDoctorSelect');
  doctorSelect.innerHTML = '<option value="">-- Select Doctor --</option>';
  if (doctorsResult.success && doctorsResult.data.doctors) {
    doctorsResult.data.doctors.forEach(doctor => {
      const option = document.createElement('option');
      option.value = doctor._id;
      const firstName = doctor.userId?.firstName || 'N/A';
      const lastName = doctor.userId?.lastName || 'N/A';
      option.textContent = `Dr. ${firstName} ${lastName}`;
      doctorSelect.appendChild(option);
    });
  }
  
  document.getElementById('appointmentModal').style.display = 'block';
}

async function openWasteModal() {
  if (!checkRoleAccess(['Admin', 'Staff'])) return;
  resetForm('wasteForm');
  const deptSelect = document.getElementById('wasteDepartmentSelect');
  if (deptSelect) {
    deptSelect.innerHTML = '<option value="">Select department</option>';
    const result = await getAllDepartments();
    const departments = result.success && Array.isArray(result.data) ? result.data : [];
    departments.forEach(dept => {
      const option = document.createElement('option');
      option.value = dept._id;
      option.textContent = dept.name || dept._id;
      deptSelect.appendChild(option);
    });
  }
  document.getElementById('wasteModal').style.display = 'block';
}

async function openInvoiceModal() {
  if (!checkRoleAccess(['Admin', 'Receptionist'])) return;
  // Clear form and items
  resetForm('invoiceForm');
  invoiceItems = [];
  document.getElementById('invoiceItems').innerHTML = '';
  document.getElementById('invoiceItemDesc').value = '';
  document.getElementById('invoiceAmount').value = '';
  document.getElementById('invoicePatientSearch').value = '';
  
  // Load patients
  const patientsResult = await getAllPatients();
  const patientSelect = document.getElementById('invoicePatientSelect');
  patientSelect.innerHTML = '<option value="">-- Select Patient --</option>';
  if (patientsResult.success && patientsResult.data.patients) {
    patientsResult.data.patients.forEach(patient => {
      const option = document.createElement('option');
      option.value = patient._id;
      option.textContent = `${patient.firstName} ${patient.lastName} (${patient.patientId})`;
      patientSelect.appendChild(option);
    });
  }
  
  document.getElementById('invoiceModal').style.display = 'block';
}

async function openInventoryModal() {
  if (!checkRoleAccess(['Admin'])) return;
  resetForm('inventoryForm');
  const select = document.getElementById('inventoryDepartmentSelect');
  if (select) {
    select.innerHTML = '<option value="">No department</option>';
    const result = await getAllDepartments();
    if (result.success && result.data && result.data.length > 0) {
      result.data.forEach(dept => {
        const opt = document.createElement('option');
        opt.value = dept._id;
        opt.textContent = dept.name || dept._id;
        select.appendChild(opt);
      });
    }
  }
  document.getElementById('inventoryModal').style.display = 'block';
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

// Save Functions
async function savePatient(event) {
  event.preventDefault();
  const data = getFormData('patientForm');
  
  const result = await createPatient(data);
  if (result.success) {
    showAlert('Patient created successfully', 'success');
    closeModal('patientModal');
    loadPatients();
  } else {
    showAlert('Error: ' + result.data?.message || 'Failed to create patient', 'danger');
  }
}

async function saveAppointment(event) {
  event.preventDefault();
  const data = getFormData('appointmentForm');
  
  const result = await bookAppointment(data);
  if (result.success) {
    showAlert('Appointment booked successfully', 'success');
    closeModal('appointmentModal');
    loadAppointments();
  } else {
    showAlert('Error: ' + result.data?.message || 'Failed to book appointment', 'danger');
  }
}

async function saveWaste(event) {
  event.preventDefault();
  const data = getFormData('wasteForm');
  
  const result = await createWasteEntry(data);
  if (result.success) {
    showAlert('Waste entry recorded successfully', 'success');
    closeModal('wasteModal');
    loadWaste();
  } else {
    showAlert('Error: ' + result.data?.message || 'Failed to record waste', 'danger');
  }
}

function addInvoiceItem() {
  const desc = document.getElementById('invoiceItemDesc').value;
  const amount = document.getElementById('invoiceAmount').value;
  
  if (!desc || !amount) {
    showAlert('Please fill in item description and amount', 'warning');
    return;
  }

  invoiceItems.push({ description: desc, amount: parseFloat(amount) });
  
  document.getElementById('invoiceItemDesc').value = '';
  document.getElementById('invoiceAmount').value = '';
  
  updateInvoiceItemsDisplay();
}

function updateInvoiceItemsDisplay() {
  let html = '';
  let total = 0;
  
  if (invoiceItems.length === 0) {
    document.getElementById('invoiceItems').innerHTML = '<em style="color: #999;">No items added yet</em>';
    return;
  }
  
  invoiceItems.forEach((item, index) => {
    total += item.amount;
    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; padding: 0.75rem; background: white; border-radius: 4px;">
        <div>
          <strong>${item.description}</strong><br>
          <small style="color: #666;">₹${formatCurrency(item.amount).replace('₹', '')}</small>
        </div>
        <button type="button" class="btn btn-danger" style="padding: 0.25rem 0.75rem; white-space: nowrap;" onclick="removeInvoiceItem(${index})">✕ Remove</button>
      </div>
    `;
  });
  
  html += `
    <div style="border-top: 2px solid #ddd; padding-top: 0.75rem; margin-top: 0.75rem; font-weight: bold; font-size: 1.1rem; color: #667eea;">
      Total Amount: ${formatCurrency(total)}
    </div>
  `;
  document.getElementById('invoiceItems').innerHTML = html;
}

function removeInvoiceItem(index) {
  invoiceItems.splice(index, 1);
  updateInvoiceItemsDisplay();
}

async function saveInvoice(event) {
  event.preventDefault();
  
  // Get patient ID
  const patientId = document.getElementById('invoiceForm').querySelector('[name="patientId"]').value;
  
  // Validate patient selection
  if (!patientId) {
    showAlert('Please select a patient', 'warning');
    return;
  }
  
  // Validate invoice items
  if (invoiceItems.length === 0) {
    showAlert('Please add at least one item to the invoice', 'warning');
    return;
  }

  const invoiceData = {
    patientId: patientId,
    items: invoiceItems.map(item => ({
      description: item.description,
      quantity: 1,
      unitPrice: item.amount,
      total: item.amount,
      category: 'Other'
    }))
  };

  const result = await createInvoice(invoiceData);
  if (result.success) {
    showAlert('Invoice created successfully!', 'success');
    
    // Clear form and items
    invoiceItems = [];
    resetForm('invoiceForm');
    document.getElementById('invoiceItemDesc').value = '';
    document.getElementById('invoiceAmount').value = '';
    document.getElementById('invoiceItems').innerHTML = '';
    document.getElementById('invoicePatientSearch').value = '';
    document.getElementById('invoicePatientSelect').value = '';
    
    closeModal('invoiceModal');
    loadInvoices();
  } else {
    showAlert('Error: ' + result.data?.message || 'Failed to create invoice', 'danger');
  }
}

async function saveInventory(event) {
  event.preventDefault();
  const data = getFormData('inventoryForm');
  if (!data.departmentId) delete data.departmentId;
  
  const result = await createInventoryItem(data);
  if (result.success) {
    showAlert('Inventory item added successfully', 'success');
    closeModal('inventoryModal');
    loadInventory();
  } else {
    showAlert('Error: ' + result.data?.message || 'Failed to add item', 'danger');
  }
}

// Action Functions
async function deletePatient(id) {
  if (confirm('Are you sure you want to delete this patient?')) {
    const result = await apiCall(`/patients/${id}`, { method: 'DELETE' });
    if (result.success) {
      showAlert('Patient deleted successfully', 'success');
      loadPatients();
    } else {
      showAlert('Error deleting patient', 'danger');
    }
  }
}

async function cancelAppointment(id) {
  const reason = prompt('Enter cancellation reason:');
  if (reason) {
    const result = await cancelAppointment(id, reason);
    if (result.success) {
      showAlert('Appointment cancelled successfully', 'success');
      loadAppointments();
    } else {
      showAlert('Error cancelling appointment', 'danger');
    }
  }
}

function editPatient(id) {
  showAlert('Edit functionality coming soon', 'info');
}

function editAppointment(id) {
  showAlert('Edit functionality coming soon', 'info');
}

function updateWasteStatusBtn(id) {
  showAlert('Update waste status functionality coming soon', 'info');
}

async function setAppointmentStatus(id, status) {
  showLoading();
  const result = await updateAppointmentStatus(id, status);
  hideLoading();
  if (result.success) {
    showAlert('Appointment status updated to ' + status, 'success');
    loadAppointments();
  } else {
    showAlert(result.data?.message || 'Failed to update status', 'danger');
  }
}

function recordPaymentBtn(id) {
  document.getElementById('paymentModalInvoiceId').value = id;
  document.getElementById('paymentAmount').value = '';
  document.getElementById('paymentMethod').value = 'Cash';
  document.getElementById('paymentModal').style.display = 'block';
}

async function submitPayment(event) {
  event.preventDefault();
  const id = document.getElementById('paymentModalInvoiceId').value;
  const amountPaid = parseFloat(document.getElementById('paymentAmount').value);
  const paymentMethod = document.getElementById('paymentMethod').value;
  if (!id || !amountPaid || amountPaid <= 0) {
    showAlert('Please enter a valid amount', 'warning');
    return;
  }
  showLoading();
  const result = await recordPayment(id, { amountPaid, paymentMethod, paymentDate: new Date().toISOString() });
  hideLoading();
  if (result.success) {
    showAlert('Payment recorded successfully', 'success');
    closeModal('paymentModal');
    loadInvoices();
  } else {
    showAlert(result.data?.message || 'Failed to record payment', 'danger');
  }
}

async function viewReceipt(invoiceId) {
  showLoading();
  const result = await getInvoiceById(invoiceId);
  hideLoading();
  if (!result.success || !result.data) {
    showAlert('Could not load invoice', 'danger');
    return;
  }
  const inv = result.data;
  const patientName = inv.patient ? (inv.patient.firstName || '') + ' ' + (inv.patient.lastName || '') : 'N/A';
  let itemsHtml = (inv.items || []).map(i => `<tr><td>${i.description || '-'}</td><td>${i.quantity || 1}</td><td>${formatCurrency(i.unitPrice || 0)}</td><td>${formatCurrency(i.total || 0)}</td></tr>`).join('');
  const receiptContent = document.getElementById('receiptContent');
  receiptContent.innerHTML = `
    <div class="receipt-print">
      <h2 style="margin-bottom: 0.5rem;">Hospital Bill Receipt</h2>
      <p style="color: var(--text-muted); margin-bottom: 1rem;">Invoice #${inv.invoiceId || inv._id}</p>
      <table style="width: 100%; margin-bottom: 1rem;">
        <tr><td><strong>Patient</strong></td><td>${patientName}</td></tr>
        <tr><td><strong>Bill Date</strong></td><td>${formatDate(inv.billDate)}</td></tr>
        <tr><td><strong>Status</strong></td><td>${inv.paymentStatus || 'Pending'}</td></tr>
      </table>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
        <thead><tr><th style="text-align: left;">Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <table style="width: 100%; max-width: 240px; margin-left: auto;">
        <tr><td><strong>Subtotal</strong></td><td>${formatCurrency(inv.subtotal || 0)}</td></tr>
        <tr><td>Tax</td><td>${formatCurrency(inv.taxAmount || 0)}</td></tr>
        <tr><td><strong>Total</strong></td><td>${formatCurrency(inv.totalAmount || 0)}</td></tr>
        <tr><td>Amount Paid</td><td>${formatCurrency(inv.amountPaid || 0)}</td></tr>
        <tr><td><strong>Balance Due</strong></td><td>${formatCurrency(inv.balanceDue || 0)}</td></tr>
      </table>
      <p style="margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-muted);">Thank you for choosing our hospital.</p>
    </div>
  `;
  document.getElementById('receiptModal').style.display = 'block';
}

function closeReceiptModal() {
  document.getElementById('receiptModal').style.display = 'none';
}

function printReceipt() {
  const content = document.getElementById('receiptContent').innerHTML;
  const win = window.open('', '_blank');
  win.document.write('<html><head><title>Receipt</title><link rel="stylesheet" href="/css/style.css"></head><body>' + content + '</body></html>');
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); win.close(); }, 250);
}

async function printAllPatientsReport() {
  showLoading();
  try {
    const result = await getAllPatients(1, '', 10000);
    hideLoading();
    if (!result.success || !result.data) {
      showAlert('Failed to load patients for report', 'danger');
      return;
    }
    const patients = result.data.patients || [];
    const total = result.data.total || 0;

    const formatDateReport = (d) => {
      if (!d) return '—';
      const dt = new Date(d);
      return dt.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    let rows = '';
    patients.forEach((p, i) => {
      const name = [p.firstName, p.lastName].filter(Boolean).join(' ') || '—';
      const address = [p.address, p.city, p.state, p.zipCode].filter(Boolean).join(', ') || '—';
      rows += `
        <tr>
          <td>${i + 1}</td>
          <td>${p.patientId || '—'}</td>
          <td>${name}</td>
          <td>${formatDateReport(p.dateOfBirth)}</td>
          <td>${p.gender || '—'}</td>
          <td>${p.phone || '—'}</td>
          <td>${p.email || '—'}</td>
          <td>${address}</td>
          <td>${p.bloodType || '—'}</td>
          <td>${formatDateReport(p.lastVisit)}</td>
          <td>${p.totalVisits ?? '—'}</td>
        </tr>
      `;
    });

    const printContent = `
      <div class="report-print">
        <h1>Patient Details Report</h1>
        <p class="report-meta">Shri Hospital Management System &nbsp;|&nbsp; Generated: ${new Date().toLocaleString('en-IN')} &nbsp;|&nbsp; Total Patients: ${total}</p>
        <table class="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Patient ID</th>
              <th>Name</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Blood</th>
              <th>Last Visit</th>
              <th>Visits</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p class="report-footer">End of report. Total: ${patients.length} patient(s).</p>
      </div>
    `;

    const printCss = `
      body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; padding: 12px; color: #333; background: #fff; }
      .report-print { max-width: 100%; }
      .report-print h1 { margin: 0 0 6px 0; font-size: 18px; font-weight: 700; color: #c44569; }
      .report-meta { color: #666; margin-bottom: 12px; font-size: 10px; padding-bottom: 8px; border-bottom: 1px solid #eee; }
      .report-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); table-layout: fixed; }
      .report-table th, .report-table td { border: 1px solid #e8e8e8; padding: 6px 8px; text-align: left; font-size: 10px; word-wrap: break-word; }
      .report-table thead th { background: #FFE4EC; color: #8B3A4D; font-weight: 600; font-size: 10px; text-transform: uppercase; letter-spacing: 0.2px; }
      .report-table tbody tr:nth-child(even) { background: #FDF5F7; }
      .report-table tbody tr:nth-child(odd) { background: #fff; }
      .report-table tbody tr:hover { background: #FFE4EC; }
      .report-footer { font-size: 11px; color: #666; margin-top: 12px; padding-top: 8px; border-top: 1px solid #eee; }
      @media print { body { padding: 12px; } .report-print { break-inside: avoid; } .report-table { box-shadow: none; } .report-table thead th { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .report-table tbody tr:nth-child(even) { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    `;

    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head><title>Patient Report - Shri Hospital</title><style>${printCss}</style></head>
        <body>${printContent}</body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 300);
  } catch (err) {
    hideLoading();
    showAlert('Error generating report: ' + err.message, 'danger');
  }
}

function updateInventoryBtn(id) {
  showAlert('Update inventory functionality coming soon', 'info');
}

function restockItem(id) {
  showAlert('Restock functionality coming soon', 'info');
}

async function generateWasteReport() {
  showAlert('Report generation starting...', 'info');
  
  try {
    const result = await getWasteReport();
    if (result.success) {
      showAlert('Report generated successfully', 'success');
      console.log(result.data);
    } else {
      showAlert('Error generating report', 'danger');
    }
  } catch (error) {
    showAlert('Error: ' + error.message, 'danger');
  }
}

// Close modals when clicking outside
window.onclick = function(event) {
  const modals = ['patientModal', 'appointmentModal', 'wasteModal', 'invoiceModal', 'inventoryModal', 'paymentModal', 'receiptModal'];
  modals.forEach(modalId => {
    const modal = document.getElementById(modalId);
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
};

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = '/login';
  } else {
    loadSection('dashboard');
  }
});
