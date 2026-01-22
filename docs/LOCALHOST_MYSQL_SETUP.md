# Localhost MySQL Setup - हिंदी में

## 🎯 क्या करना होगा?

**हां, localhost पर MySQL database बनाना होगा**, लेकिन यह बहुत आसान है!

## ✅ Option 1: XAMPP Use करें (सबसे आसान - Recommended)

### Step 1: XAMPP Install करें
1. **Download करें**: https://www.apachefriends.org/
2. **Install करें** (Next, Next, Next...)
3. **XAMPP Control Panel** खोलें

### Step 2: MySQL Start करें
1. XAMPP Control Panel में
2. **MySQL** के सामने **"Start"** button click करें
3. ✅ Green हो जाएगा - MySQL running है!

### Step 3: Database Auto-Create होगा!
**अच्छी खबर**: आपको manually database बनाने की जरूरत नहीं है!
- जब आप `npm run test-db` run करेंगे
- Database automatically create हो जाएगा
- Tables भी automatically create होंगे

### Step 4: .env File Update करें
`backend/.env` file में ये add करें:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=meesho

PORT=5000
JWT_SECRET=your_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Note**: XAMPP में default password **खाली** होता है, इसलिए `DB_PASSWORD=` खाली रखें!

### Step 5: Run Commands
```bash
cd backend
npm install          # Dependencies install करें
npm run test-db      # Database test करें (auto-create होगा)
npm run seed-all     # Sample data add करें
npm start            # Server start करें
```

---

## ✅ Option 2: MySQL Direct Install

### Step 1: MySQL Install करें
1. **Download**: https://dev.mysql.com/downloads/installer/
2. **MySQL Installer** download करें
3. **Install करें**:
   - Choose: "Developer Default" या "Server only"
   - Root password set करें (याद रखें!)

### Step 2: MySQL Service Start करें
**Windows Services से:**
1. `Win + R` press करें
2. `services.msc` type करें
3. **"MySQL80"** या **"MySQL"** find करें
4. Right-click → **Start**

### Step 3: .env File Update करें
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_NAME=meesho

PORT=5000
JWT_SECRET=your_secret_jwt_key
NODE_ENV=development
```

### Step 4: Run Commands
```bash
cd backend
npm install
npm run test-db      # Database auto-create होगा
npm run seed-all
npm start
```

---

## 🚀 Quick Start (XAMPP के साथ)

### Complete Steps:
1. **XAMPP install करें** → https://www.apachefriends.org/
2. **XAMPP Control Panel** खोलें
3. **MySQL Start** करें (Start button click)
4. **backend/.env** file में ये add करें:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=meesho
   ```
5. **Run commands**:
   ```bash
   cd backend
   npm install
   npm run test-db
   npm run seed-all
   npm start
   ```

---

## ❓ FAQ

### Q: Database manually बनाना पड़ेगा?
**A: नहीं!** Database automatically create हो जाएगा जब आप `npm run test-db` run करेंगे।

### Q: Tables manually बनाने पड़ेंगे?
**A: नहीं!** Tables भी automatically create होंगे।

### Q: XAMPP में password क्या है?
**A: Default password खाली है** - `.env` में `DB_PASSWORD=` खाली रखें।

### Q: MySQL service start नहीं हो रहा?
**A:** 
- XAMPP: Control Panel में Start button click करें
- MySQL: Services.msc में MySQL service start करें
- Port 3306 check करें (किसी और app ने use तो नहीं किया?)

---

## ✅ Success Checklist

- [ ] XAMPP/MySQL installed
- [ ] MySQL service running (green in XAMPP)
- [ ] `.env` file में MySQL credentials
- [ ] `npm install` successful
- [ ] `npm run test-db` shows ✅ success
- [ ] Database और tables auto-created
- [ ] `npm run seed-all` successful
- [ ] `npm start` - server running

---

## 🎉 After Setup

एक बार setup complete होने के बाद:
- ✅ Database localhost पर ready होगा
- ✅ सभी tables automatically create होंगे
- ✅ Sample data add हो जाएगा
- ✅ Backend server चलने लगेगा
- ✅ Frontend से connect हो जाएगा

**अब आप project run कर सकते हैं! 🚀**

