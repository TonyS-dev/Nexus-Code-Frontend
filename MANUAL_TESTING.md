# Manual Testing Documentation - Riwi Nexus Platform

## 📋 Project Information
- **Project:** Riwi Nexus - HR Management Platform
- **Team:** Nexus-code
- **Testing Date:** [Current Date]
- **Version:** 1.0.0

---

## 🎯 Testing Objectives

This document outlines the manual testing procedures for the Riwi Nexus platform to ensure all functionalities work correctly across different user roles and scenarios.

### Testing Scope
- Authentication and authorization flows
- Employee management operations
- Request creation and approval workflows
- Role-based access control
- User interface responsiveness
- Data validation and error handling

---

## 🔐 Test Case 1: Authentication System

### TC-001: User Login
**Objective:** Verify that users can successfully log in with valid credentials

**Preconditions:** User account exists in the database

**Test Steps:**
1. Navigate to the login page
2. Enter valid email address
3. Enter correct password
4. Click "Login" button

**Expected Result:** User is redirected to dashboard based on their role

**Test Data:**
- Employee: employee@riwi.co / password123
- Leader: leader@riwi.co / password123
- HR Admin: admin@riwi.co / password123

### TC-002: Invalid Login Attempts
**Objective:** Verify system security with invalid credentials

**Test Steps:**
1. Enter invalid email
2. Enter incorrect password
3. Attempt login

**Expected Result:** Error message displayed, user remains on login page

### TC-003: Session Management
**Objective:** Verify JWT token expiration and logout functionality

**Test Steps:**
1. Login successfully
2. Wait for token expiration (or manually expire)
3. Attempt to access protected route

**Expected Result:** User redirected to login page

---

## 👥 Test Case 2: Employee Management (HR Admin Only)

### TC-004: Create New Employee
**Objective:** Verify HR Admin can create new employee profiles

**Preconditions:** Logged in as HR Admin

**Test Steps:**
1. Navigate to "Manage Users" section
2. Click "New Employee" button
3. Fill all required fields:
   - First Name: "Test"
   - Last Name: "Employee"
   - Email: "test.employee@company.com"
   - ID Number: "12345678"
   - Select Gender, Headquarters, Role, etc.
4. Submit form

**Expected Result:** New employee created successfully, confirmation message shown

### TC-005: Edit Employee Information
**Objective:** Verify employee data can be updated

**Test Steps:**
1. Navigate to employee list
2. Select an employee to edit
3. Modify employee information
4. Save changes

**Expected Result:** Employee information updated successfully

### TC-006: Employee Access Control
**Objective:** Verify only HR Admin can access employee management

**Test Steps:**
1. Login as Employee or Leader
2. Attempt to access "/manage-users" URL directly

**Expected Result:** Access denied, redirected to forbidden page

---

## 📝 Test Case 3: Request Management System

### TC-007: Create Vacation Request
**Objective:** Verify employees can create vacation requests

**Preconditions:** Logged in as Employee

**Test Steps:**
1. Navigate to "New Request"
2. Select "Vacation" as request type
3. Select vacation type (Annual Vacation)
4. Choose start date: [Future date]
5. Choose end date: [Future date after start]
6. Add comments
7. Submit request

**Expected Result:** 
- Request created successfully
- Days calculated automatically
- Status set to "Pending"
- Confirmation notification shown

### TC-008: Create Leave Request
**Objective:** Verify leave request creation with time selection

**Test Steps:**
1. Select "Leave / Permit" as request type
2. Select leave type
3. Choose start date and time
4. Choose end date and time
5. Provide reason
6. Submit request

**Expected Result:** Leave request created with proper date/time handling

### TC-009: Create Certificate Request
**Objective:** Verify certificate request functionality

**Test Steps:**
1. Select "Certificate" as request type
2. Select certificate type
3. Add comments/purpose
4. Submit request

**Expected Result:** Certificate request created successfully

### TC-010: View My Requests
**Objective:** Verify employees can view their request history

**Test Steps:**
1. Navigate to "My Requests"
2. Review list of submitted requests
3. Check request status and details

**Expected Result:** All user's requests displayed with correct information

---

## ✅ Test Case 4: Request Approval Workflow

### TC-011: Manager Request Approval
**Objective:** Verify leaders can approve/reject requests

**Preconditions:** 
- Logged in as Leader
- Pending requests exist for approval

**Test Steps:**
1. Navigate to "Approve Requests"
2. Review pending requests
3. Select a request to approve
4. Add approval comments
5. Approve or reject request

**Expected Result:** 
- Request status updated
- Employee notified of decision
- Audit trail created

### TC-012: Manager Access Control
**Objective:** Verify only Leaders and HR Admins can access approval interface

**Test Steps:**
1. Login as Employee
2. Attempt to access "/manager-requests"

**Expected Result:** Access denied, forbidden page shown

---

## 📱 Test Case 5: User Interface & Responsiveness

### TC-013: Mobile Responsiveness
**Objective:** Verify application works on mobile devices

**Test Steps:**
1. Access application on mobile device or browser mobile view
2. Test navigation menu
3. Test form interactions
4. Test table scrolling

**Expected Result:** All features functional on mobile devices

### TC-014: Cross-Browser Compatibility
**Objective:** Verify application works across different browsers

**Browsers to Test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Expected Result:** Consistent functionality across all browsers

---

## 🔍 Test Case 6: Data Validation

### TC-015: Form Validation
**Objective:** Verify client-side form validation works correctly

**Test Steps:**
1. Attempt to submit empty required fields
2. Enter invalid date ranges (end before start)
3. Test email format validation
4. Test maximum character limits

**Expected Result:** Appropriate validation messages displayed

### TC-016: Date Range Validation
**Objective:** Verify date logic in vacation/leave requests

**Test Steps:**
1. Select end date before start date
2. Select past dates
3. Select dates too far in future

**Expected Result:** Validation prevents invalid date selections

---

## 🔔 Test Case 7: Notification System

### TC-017: Real-Time Notifications
**Objective:** Verify notification bell shows unread count

**Test Steps:**
1. Create new request as Employee
2. Login as Leader
3. Check notification bell

**Expected Result:** Notification count updated, new notification visible

### TC-018: Notification Interactions
**Objective:** Verify notification marking as read

**Test Steps:**
1. Click on notification bell
2. Click on individual notification
3. Verify notification marked as read

**Expected Result:** Notification count decreases, read status updated

---

## 🎨 Test Case 8: Theme and UI Features

### TC-019: Theme Switching
**Objective:** Verify dark/light theme toggle functionality

**Test Steps:**
1. Click theme toggle button
2. Verify colors change
3. Refresh page
4. Verify theme persistence

**Expected Result:** Theme changes applied and persisted

### TC-020: Loading States
**Objective:** Verify loading indicators work properly

**Test Steps:**
1. Navigate between pages
2. Submit forms
3. Load data-heavy pages

**Expected Result:** Loading states displayed during async operations

---

## 📊 Test Case 9: Dashboard Analytics

### TC-021: Employee Dashboard
**Objective:** Verify employee dashboard displays correct information

**Test Steps:**
1. Login as Employee
2. Review dashboard metrics
3. Verify request summaries
4. Check vacation balance

**Expected Result:** Accurate personal data and metrics displayed

### TC-022: Admin Dashboard
**Objective:** Verify admin dashboard shows organizational metrics

**Test Steps:**
1. Login as HR Admin
2. Review system-wide metrics
3. Check pending approvals count
4. Verify employee statistics

**Expected Result:** Comprehensive organizational data displayed

---

## 🔄 Test Case 10: Error Handling

### TC-023: Network Error Handling
**Objective:** Verify application handles network errors gracefully

**Test Steps:**
1. Disconnect internet
2. Attempt to submit form
3. Try to navigate pages

**Expected Result:** Appropriate error messages shown, app doesn't crash

### TC-024: Server Error Handling
**Objective:** Verify handling of server-side errors

**Test Steps:**
1. Submit invalid data that triggers server error
2. Access non-existent resources

**Expected Result:** User-friendly error messages displayed

---

## 🛡️ Test Case 11: Security & Bot Attack Prevention

### TC-025: Automated Login Attack Simulation
**Objective:** Verify system prevents brute force login attempts

**Test Steps:**
1. Use automated tool or script to attempt multiple login failures
2. Try 10+ consecutive failed login attempts from same IP
3. Attempt to continue after potential lockout
4. Verify account lockout mechanisms

**Expected Result:** 
- Account temporarily locked after multiple failures
- Rate limiting prevents rapid-fire attempts
- Security logs capture attack attempts
- Legitimate user can still access after cooldown

### TC-026: SQL Injection Attack Prevention
**Objective:** Verify all form inputs are protected against SQL injection

**Test Injection Payloads:**
```sql
'; DROP TABLE employees; --
' OR '1'='1
'; INSERT INTO employees (email) VALUES ('hacker@evil.com'); --
```

**Test Steps:**
1. Input SQL injection strings in all form fields:
   - Login form (email, password)
   - Employee creation form
   - Request forms (comments, reason fields)
   - Search inputs
2. Submit forms with malicious payloads
3. Verify database integrity remains intact

**Expected Result:** 
- All malicious input sanitized
- No database corruption
- Error messages don't reveal system information
- Application continues functioning normally

### TC-027: Cross-Site Scripting (XSS) Prevention
**Objective:** Verify protection against XSS attacks

**Test XSS Payloads:**
```javascript
<script>alert('XSS')</script>
<img src="x" onerror="alert('XSS')">
javascript:alert('XSS')
<svg onload="alert('XSS')">
```

**Test Steps:**
1. Input XSS payloads in text fields and comments
2. Submit forms with script injection attempts
3. View rendered content in UI
4. Check if scripts execute

**Expected Result:** 
- No script execution occurs
- Malicious content properly escaped
- UI displays safe text only
- No JavaScript alerts triggered

### TC-028: CSRF Attack Prevention
**Objective:** Verify Cross-Site Request Forgery protection

**Test Steps:**
1. Create malicious form on external site targeting API endpoints
2. Attempt to submit unauthorized requests while user is logged in
3. Try to trick authenticated user into executing unwanted actions

**Expected Result:** 
- CSRF tokens validate properly
- Unauthorized cross-origin requests blocked
- User actions require explicit consent

### TC-029: Session Hijacking Prevention
**Objective:** Verify JWT token security and session management

**Test Steps:**
1. Capture JWT token from network requests
2. Attempt to use token from different IP/browser
3. Test token manipulation and tampering
4. Verify token expiration enforcement

**Expected Result:** 
- Tokens properly validated on each request
- Tampered tokens rejected
- Expired tokens automatically handled
- Secure token storage implemented

### TC-030: Bot Detection and Rate Limiting
**Objective:** Verify automated bot protection

**Test Tools:** Use automated testing tools or scripts

**Test Steps:**
1. **High-frequency request simulation:**
   - Send 100+ requests per minute to login endpoint
   - Attempt rapid form submissions
   - Test API endpoint flooding

2. **Automated navigation simulation:**
   - Script rapid page navigation
   - Simulate non-human browsing patterns
   - Test for CAPTCHAs or bot detection

3. **Resource exhaustion attempts:**
   - Submit large payloads
   - Attempt memory-intensive operations
   - Test concurrent connection limits

**Expected Result:** 
- Rate limiting blocks excessive requests
- Bot detection mechanisms activate
- System performance remains stable
- Legitimate users unaffected

### TC-031: Input Fuzzing Test
**Objective:** Verify application stability with malformed input

**Test Data Types:**
- Extremely long strings (10,000+ characters)
- Special characters: `!@#$%^&*()_+{}|:"<>?`
- Unicode and emoji characters: `🔥💻🚀`
- Binary data in text fields
- Null bytes and control characters

**Test Steps:**
1. Input various malformed data in all form fields
2. Submit requests with oversized payloads
3. Test file upload with corrupted files (if applicable)
4. Verify error handling doesn't crash system

**Expected Result:** 
- Application handles all input gracefully
- No system crashes or hangs
- Appropriate error messages displayed
- Input validation catches malformed data

---

## 📋 Testing Checklist

### Pre-Testing Setup
- [ ] Database seeded with test data
- [ ] All environment variables configured
- [ ] Backend API running
- [ ] Frontend application running

### Functional Testing
- [ ] Authentication flows tested
- [ ] All CRUD operations verified
- [ ] Role-based access control validated
- [ ] Request workflow end-to-end tested
- [ ] Email notifications working (if configured)

### UI/UX Testing
- [ ] Responsive design verified on multiple screen sizes
- [ ] Cross-browser compatibility confirmed
- [ ] Theme switching functional
- [ ] Loading states and animations working
- [ ] Form validation providing clear feedback

### Security Testing
- [ ] Unauthorized access properly blocked
- [ ] Token expiration handled correctly
- [ ] Input validation preventing malicious data
- [ ] CORS headers configured properly
- [ ] Bot attack simulation completed
- [ ] SQL injection attempts blocked
- [ ] XSS attack prevention verified
- [ ] CSRF protection functional
- [ ] Rate limiting effective

### Performance Testing
- [ ] Page load times acceptable
- [ ] Large data sets handled efficiently
- [ ] No memory leaks during navigation
- [ ] API responses within reasonable time

---

## 🐛 Bug Report Template

When issues are found during testing, use this template:

**Bug ID:** BUG-001
**Title:** Brief description of the issue
**Severity:** High/Medium/Low
**Priority:** High/Medium/Low
**Environment:** Browser, OS, Device
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** What should happen
**Actual Result:** What actually happened
**Screenshots:** Attach relevant screenshots
**Additional Notes:** Any extra information

---

## 📈 Test Results Summary

| Test Case | Status | Comments |
|-----------|--------|----------|
| TC-001 | ✅ Pass | Login working correctly |
| TC-002 | ✅ Pass | Error handling functional |
| TC-003 | ⚠️ Pending | Token expiration to be tested |
| ... | ... | ... |

**Overall Status:** [Pass/Fail]
**Test Coverage:** [Percentage]
**Critical Issues:** [Number]
**Total Issues Found:** [Number]

---

## 👨‍💻 Testing Team

- **Lead Tester:** [Name]
- **Test Execution:** [Team Members]
- **Review Date:** [Date]
- **Approval:** [Signature]