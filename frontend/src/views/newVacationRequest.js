// src/views/newVacationRequest.js
import { auth } from '../services/auth.js';
import { vacationService } from '../services/requestService.js';
import { router } from '../router/router.js';

export async function showVacationRequestPage() {
    const user = auth.getUser();
    
    const container = document.createElement('div');
    container.className = 'vacation-request-container';

    // Mostrar loading mientras se cargan los datos
    container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Cargando datos de vacaciones...</p>
        </div>
    `;

    try {
        // Obtener datos del empleado para mostrar días disponibles
        const employeeData = await vacationService.getEmployeeVacationData(user.id);
        renderVacationForm(container, user, employeeData);
    } catch (error) {
        container.innerHTML = `
            <div class="error-container">
                <h2>Error al cargar los datos</h2>
                <p>${error.message}</p>
                <button onclick="window.location.reload()" class="btn btn-primary">Reintentar</button>
            </div>
        `;
    }

    return container;
}

function renderVacationForm(container, user, employeeData) {

    container.innerHTML = `
        <div class="main-header">
            <h1>Nueva Solicitud de Vacaciones</h1>
            <div class="vacation-summary">
                <div class="summary-card">
                    <h3>Días Disponibles</h3>
                    <span class="days-count available">${employeeData.available_days}</span>
                </div>
                <div class="summary-card">
                    <h3>Días Utilizados</h3>
                    <span class="days-count used">${employeeData.used_days}</span>
                </div>
                <div class="summary-card">
                    <h3>Días Pendientes</h3>
                    <span class="days-count pending">${employeeData.pending_days}</span>
                </div>
            </div>
        </div>

        <div class="content-section">
            <form id="vacation-request-form" class="vacation-form">
                <div class="form-grid">
                    <div class="form-group">
                        <label for="start-date">Fecha de Inicio</label>
                        <input type="date" id="start-date" required min="${getTodayDate()}">
                    </div>
                    
                    <div class="form-group">
                        <label for="end-date">Fecha de Fin</label>
                        <input type="date" id="end-date" required min="${getTodayDate()}">
                    </div>

                    <div class="form-group full-width">
                        <label for="vacation-type">Tipo de Vacaciones</label>
                        <select id="vacation-type" required>
                            <option value="">Seleccionar tipo</option>
                            <option value="vacation">Vacaciones Regulares</option>
                            <option value="compensatory">Tiempo Compensatorio</option>
                            <option value="personal">Días Personales</option>
                        </select>
                    </div>

                    <div class="form-group full-width">
                        <label for="comments">Comentarios (Opcional)</label>
                        <textarea id="comments" rows="4" placeholder="Agregue cualquier comentario adicional sobre su solicitud..."></textarea>
                    </div>
                </div>

                <div class="calculated-info">
                    <div class="info-row">
                        <span class="label">Días solicitados:</span>
                        <span id="requested-days" class="value">0</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Días restantes después de la solicitud:</span>
                        <span id="remaining-days" class="value">${employeeData.available_days}</span>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" id="cancel-btn">Cancelar</button>
                    <button type="submit" class="btn btn-primary" id="submit-btn">Enviar Solicitud</button>
                </div>
            </form>

            <div id="validation-errors" class="error-message" style="display: none;"></div>
            <div id="success-message" class="success-message" style="display: none;"></div>
        </div>
    `;

    // Configurar event listeners
    setupFormValidation(container, user, employeeData);
    setupDateCalculation(container, employeeData);
    setupFormSubmission(container, user);

    return container;
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function setupFormValidation(container, user, employeeData) {
    const startDateInput = container.querySelector('#start-date');
    const endDateInput = container.querySelector('#end-date');
    const requestedDaysSpan = container.querySelector('#requested-days');
    const remainingDaysSpan = container.querySelector('#remaining-days');
    const submitBtn = container.querySelector('#submit-btn');
    const errorDiv = container.querySelector('#validation-errors');

    async function validateDates() {
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);
        
        // Limpiar errores previos
        errorDiv.style.display = 'none';
        submitBtn.disabled = false;

        if (startDate && endDate) {
            if (endDate < startDate) {
                showError('La fecha de fin no puede ser anterior a la fecha de inicio');
                return false;
            }

            try {
                const requestedDays = await vacationService.calculateBusinessDays(startDate, endDate);
                
                if (requestedDays > employeeData.available_days) {
                    showError(`No tiene suficientes días disponibles. Días solicitados: ${requestedDays}, Días disponibles: ${employeeData.available_days}`);
                    return false;
                }

                // Verificar solapamiento con solicitudes existentes
                const hasOverlap = await vacationService.checkDateOverlap(user.id, startDate, endDate);
                if (hasOverlap) {
                    showError('Las fechas seleccionadas se solapan con una solicitud existente');
                    return false;
                }
            } catch (error) {
                showError('Error al validar las fechas: ' + error.message);
                return false;
            }
        }

        return true;
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        submitBtn.disabled = true;
    }

    startDateInput.addEventListener('change', validateDates);
    endDateInput.addEventListener('change', validateDates);
}

function setupDateCalculation(container, employeeData) {
    const startDateInput = container.querySelector('#start-date');
    const endDateInput = container.querySelector('#end-date');
    const requestedDaysSpan = container.querySelector('#requested-days');
    const remainingDaysSpan = container.querySelector('#remaining-days');

    async function updateCalculation() {
        const startDate = startDateInput.value;
        const endDate = endDateInput.value;

        if (startDate && endDate) {
            try {
                const days = await vacationService.calculateBusinessDays(new Date(startDate), new Date(endDate));
                requestedDaysSpan.textContent = days;
                remainingDaysSpan.textContent = Math.max(0, employeeData.available_days - days);
            } catch (error) {
                console.error('Error calculating days:', error);
                requestedDaysSpan.textContent = '0';
                remainingDaysSpan.textContent = employeeData.available_days;
            }
        } else {
            requestedDaysSpan.textContent = '0';
            remainingDaysSpan.textContent = employeeData.available_days;
        }
    }

    startDateInput.addEventListener('change', updateCalculation);
    endDateInput.addEventListener('change', updateCalculation);
}

function setupFormSubmission(container, user) {
    const form = container.querySelector('#vacation-request-form');
    const cancelBtn = container.querySelector('#cancel-btn');
    const successDiv = container.querySelector('#success-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            employeeId: user.id,
            startDate: container.querySelector('#start-date').value,
            endDate: container.querySelector('#end-date').value,
            type: container.querySelector('#vacation-type').value,
            comments: container.querySelector('#comments').value,
            requestedDays: parseInt(container.querySelector('#requested-days').textContent),
            status: 'pending',
            requestDate: new Date().toISOString(),
            leaderId: user.leaderId || 'leader-001' // En producción vendría de la base de datos
        };

        try {
            const result = vacationService.createVacationRequest(formData);
            
            if (result.success) {
                successDiv.textContent = 'Solicitud de vacaciones enviada correctamente. Será revisada por su líder directo.';
                successDiv.style.display = 'block';
                
                // Redirigir después de 2 segundos
                setTimeout(() => {
                    router.navigate('/requests/my');
                }, 2000);
            }
        } catch (error) {
            const errorDiv = container.querySelector('#validation-errors');
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        }
    });

    cancelBtn.addEventListener('click', () => {
        router.navigate('/requests/my');
    });
}

function calculateBusinessDays(startDate, endDate) {
    let count = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        // 0 = Domingo, 6 = Sábado
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            count++;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return count;
}