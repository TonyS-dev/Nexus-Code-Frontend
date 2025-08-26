export const requestService = {

    getAllRequests() {
        return JSON.parse(localStorage.getItem('requests') || '[]');
    },
    getTeamRequests(leaderId) {
        const all = this.getAllRequests();
        return all.filter(req => req.leaderId === leaderId && req.status === 'pending');
    },
    getRequestsByEmployee(employeeId) {
        const all = this.getAllRequests();
        return all.filter(req => req.employeeId === employeeId);
    },

    updateRequest(id, updates) {
        const all = this.getAllRequests();
        const request = all.find(r => r.id == id);
        if (request) {
        Object.assign(request, updates);
        localStorage.setItem('requests', JSON.stringify(all));
        return request;
    }
    return null;
    }
};