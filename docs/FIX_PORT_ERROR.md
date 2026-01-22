# 🔧 Port 5000 Error Fix

## ❌ Error:
```
Error: listen EADDRINUSE: address already in use :::5000
```

## 🔍 Problem:
Port 5000 पर कोई process पहले से चल रहा है (पुराना backend server)

## ✅ Solution:

### Option 1: Automatic Fix (Recommended)
```bash
# Port 5000 पर running process को stop करें
# फिर backend start करें
cd backend
npm start
```

### Option 2: Manual Fix

**Windows:**
1. Command Prompt खोलें
2. Run करें:
   ```cmd
   netstat -ano | findstr :5000
   ```
3. PID नोट करें
4. Run करें:
   ```cmd
   taskkill /PID <PID> /F
   ```
5. फिर backend start करें:
   ```cmd
   cd backend
   npm start
   ```

**PowerShell:**
```powershell
# Find process
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess

# Stop process (replace PID)
Stop-Process -Id <PID> -Force

# Start backend
cd backend
npm start
```

## 📋 Quick Fix Command:

```bash
# Backend folder में जाएं
cd backend

# Port free करें और start करें
# (Script automatically port free करेगा)
npm start
```

## ✅ Expected Result:

```
✅ MySQL Connected Successfully!
✅ Database 'meesho' ready
✅ Database tables created successfully!
✅ Database ready!
🚀 Server running on port 5000
```

## 🎯 After Fix:

1. ✅ Server running on port 5000
2. ✅ Database connected
3. ✅ All APIs working
4. ✅ Frontend can connect

## 💡 Prevention:

- Server stop करने के लिए: `Ctrl + C` use करें
- या: `taskkill /F /IM node.exe` (सभी node processes stop करने के लिए)

---

**अब server properly start होगा! 🚀**

