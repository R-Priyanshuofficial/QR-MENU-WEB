# 🔐 Authentication Flow Documentation

## ✅ Implementation Complete

### **1. Registration Flow**

**Old Behavior:** Register → Auto-login → Dashboard  
**New Behavior:** Register → Login Page

When a user registers:
1. Account is created in backend
2. Success message: "Registration successful! Please login to continue."
3. **Redirects to Login tab** (stays on same page)
4. Email is **pre-filled** for convenience
5. User must login manually

**Code Location:** `frontend/src/shared/contexts/AuthContext.jsx` (line 106-127)

---

### **2. Remember Me Feature**

**Feature:** Keep user logged in across browser sessions

#### **How It Works:**

**When Checkbox is Checked:**
- User's email is saved to localStorage
- Remember preference is stored
- On next visit, email is auto-filled
- User stays logged in if token is valid

**When Checkbox is Unchecked:**
- Email is NOT saved
- User must enter credentials each time
- Token is still validated on page load

**Code Location:** 
- `frontend/src/shared/contexts/AuthContext.jsx` (line 55-62, 84-90)
- `frontend/src/admin/pages/Login.jsx` (line 17-23)

---

### **3. LocalStorage Keys**

| Key | Purpose | When Set | When Cleared |
|-----|---------|----------|--------------|
| `auth_token` | JWT token | On login | On logout or 401 error |
| `remember_me` | Remember preference | When checkbox checked | When checkbox unchecked |
| `user_email` | Saved email | When "Remember Me" checked | When "Remember Me" unchecked |

---

### **4. Login Flow Diagram**

```
User Opens Login Page
    ↓
Check localStorage for:
  - remember_me === 'true'?
  - user_email exists?
    ↓
    YES → Pre-fill email
    NO → Show empty email field
    ↓
User Enters Credentials
    ↓
Clicks "Remember Me" checkbox? (Optional)
    ↓
Submits Form
    ↓
Backend API Call
    ↓
Success?
    ↓
    YES → Store token
         → Remember Me checked?
             YES → Store email + preference
             NO → Clear email + preference
         → Redirect to Dashboard
    ↓
    NO → Show error message
```

---

### **5. Registration Flow Diagram**

```
User Opens Login Page
    ↓
Click "Register" Tab
    ↓
Fill Registration Form:
  - Name
  - Email
  - Password
  - Phone
  - Restaurant Name
    ↓
Submit Form
    ↓
Backend API Call
    ↓
Success?
    ↓
    YES → Success Toast: "Registration successful! Please login to continue."
         → Switch to "Login" tab
         → Pre-fill email field
         → Clear password field
         → User must login
    ↓
    NO → Show error message
```

---

### **6. Auto-Login Check**

On every page load:

```javascript
// Check if user is already authenticated
const token = localStorage.getItem('auth_token')

if (token exists) {
  if (token.startsWith('mock-jwt-token')) {
    // Demo mode - use mock user
    setUser(mockUser)
    setIsAuthenticated(true)
  } else {
    // Call API to verify token and get user
    const response = await authAPI.getMe()
    setUser(response.data.user)
    setIsAuthenticated(true)
  }
}

// If authenticated, redirect to dashboard
if (isAuthenticated) {
  navigate('/owner/dashboard')
}
```

**Code Location:** `frontend/src/shared/contexts/AuthContext.jsx` (line 17-45)

---

### **7. Logout Behavior**

**Important:** Logout does NOT clear "Remember Me" preference

```javascript
logout() {
  // Always clear token
  localStorage.removeItem('auth_token')
  
  // Keep remember_me and user_email if they exist
  // So email is pre-filled on next login
  
  setUser(null)
  setIsAuthenticated(false)
}
```

This means:
- User logs out → Email is still remembered
- User returns → Email is pre-filled
- User just needs to enter password

---

### **8. Security Considerations**

✅ **Token Expiration:** JWT tokens expire after 7 days (configurable in backend)  
✅ **Auto-Logout:** If token expires or is invalid, user is redirected to login  
✅ **Remember Me:** Only stores email (NOT password)  
✅ **Password Visibility Toggle:** Eye icon to show/hide password  

---

### **9. UI Components**

#### **Remember Me Checkbox (Login Only)**

```jsx
<label className="flex items-center space-x-2 cursor-pointer">
  <input
    type="checkbox"
    checked={rememberMe}
    onChange={(e) => setRememberMe(e.target.checked)}
    className="w-4 h-4 text-primary-600 border-gray-300 rounded"
  />
  <span className="text-sm text-gray-700 dark:text-gray-300">
    Remember me
  </span>
</label>
```

**Code Location:** `frontend/src/admin/pages/Login.jsx` (line 179-189)

---

### **10. Testing the Flow**

#### **Test Registration:**

1. Go to `http://localhost:3000/owner/login`
2. Click "Register" tab
3. Fill form:
   - Name: Test User
   - Email: newuser@test.com
   - Password: 123456
   - Restaurant: My Restaurant
4. Click "Create Account"
5. **Expected:** Stay on page, switch to Login tab, email pre-filled

#### **Test Remember Me:**

1. Go to `http://localhost:3000/owner/login`
2. Enter:
   - Email: test@test.com
   - Password: 123456
3. **Check** "Remember me" checkbox
4. Click "Login"
5. **Expected:** Redirect to dashboard
6. Logout
7. Close browser completely
8. Open `http://localhost:3000/owner/login`
9. **Expected:** Email field is pre-filled with "test@test.com"

#### **Test Without Remember Me:**

1. Go to `http://localhost:3000/owner/login`
2. Enter credentials
3. **Don't check** "Remember me"
4. Click "Login"
5. Logout
6. Return to login page
7. **Expected:** Email field shows default "demo@example.com"

---

### **11. Error Handling**

| Scenario | Behavior |
|----------|----------|
| **Backend offline** | Show error: "Backend server not running" |
| **Invalid credentials** | Show error: "Invalid email or password" |
| **Email already exists** | Show error: "User with this email already exists" |
| **Validation error** | Show specific field errors |
| **Network error** | Fallback to demo mode (if demo credentials used) |

---

### **12. Files Modified**

✅ `frontend/src/shared/contexts/AuthContext.jsx`
- Added Remember Me logic to login
- Changed register to NOT auto-login
- Updated logout to preserve Remember Me

✅ `frontend/src/admin/pages/Login.jsx`
- Added Remember Me checkbox
- Auto-fill email from localStorage
- Changed registration to switch to login tab

---

## 🎉 Summary

**Registration Flow:** Register → Login Page (email pre-filled)  
**Remember Me:** Saves email for next login (not password)  
**Auto-Login:** Token validated on page load  
**Logout:** Clears session but keeps Remember Me preference  

**Everything working as requested!** ✅
