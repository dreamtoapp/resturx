# 🌱 Restaurant Platform - Seed Data Guide

## 📦 What Gets Created

Running `npm run seed-restaurants` will populate your database with:

### **Countries (Cuisine Types)** - 5
1. 🇮🇳 **المطبخ الهندي** (Indian Cuisine)
2. 🇪🇬 **المطبخ المصري** (Egyptian Cuisine)
3. 🇮🇹 **المطبخ الإيطالي** (Italian Cuisine)
4. 🇨🇳 **المطبخ الصيني** (Chinese Cuisine)
5. 🌍 **المطبخ العربي** (Arabic Cuisine)

### **Restaurant Owners** - 10
- 10 users with `RESTAURANT_OWNER` role
- Credentials: `owner123` (password)
- Emails: `owner1@restaurant.sa` to `owner10@restaurant.sa`

### **Restaurants** - 13
Each with full details:
- ✅ Name, description, logo
- ✅ Contact info (phone, email, address)
- ✅ Location (GPS coordinates in Riyadh area)
- ✅ Working hours
- ✅ Delivery info (time, min order, fees)
- ✅ Status: ACTIVE
- ✅ Verification status (random)
- ✅ Popularity status (random)
- ✅ Rating (3.5 - 5.0)
- ✅ Review count (0 - 200)
- ✅ Cover image & logo

**Restaurants by Cuisine:**
- **Indian**: تاج محل، بومباي بايتس، دلهي دينرز
- **Egyptian**: مطعم النيل، فطيرة القاهرة
- **Italian**: لا بيتزا، باستا بوينا
- **Chinese**: دراغون ووك، بكين بالاس
- **Arabic**: بيت الشام، المائدة اللبنانية

### **Services** - 3-6 per restaurant
Dynamic services like:
- 📶 واي فاي مجاني (Free WiFi)
- 🚗 موقف سيارات (Parking)
- 🍽️ قاعات طعام (Dining Halls)
- ☕ جلسات خارجية (Outdoor Seating)
- 🎵 موسيقى حية (Live Music)
- 📺 شاشات رياضية (Sports Screens)
- 👶 ألعاب أطفال (Kids Area)
- 🅿️ خدمة فاليت (Valet Service)

### **Features** - 2-4 per restaurant
Highlighting what makes each restaurant special:
- ⭐ طاهٍ حائز على جوائز
- 🍽️ مكونات طازجة يومياً
- ☕ قائمة نباتية
- ✅ حلال معتمد

### **Gallery Images** - 3-8 per restaurant
Beautiful food and interior photos with captions

### **Dishes (Menu Items)** - ~130 total
Each restaurant gets 8-15 authentic dishes:
- **Indian**: بيرياني، تندوري، كاري، نان، سمبوسة، etc.
- **Egyptian**: كشري، ملوخية، محشي، فول، طعمية، etc.
- **Italian**: بيتزا، سباغيتي، لازانيا، ريزوتو، etc.
- **Chinese**: كونغ باو، نودلز، دمسم، أرز مقلي، etc.
- **Arabic**: كبسة، منسف، مشاوي، شاورما، حمص، etc.

Each dish includes:
- Name, description
- Price (15-100 SAR)
- Compare price (sometimes)
- Image
- Published status (90% published)
- Stock status (10% out of stock)
- Rating (3.5-5.0)

---

## 🚀 How to Run

### **Method 1: Quick Run** (Recommended)
```bash
npm run seed-restaurants
```

### **Method 2: Direct Run**
```bash
npx tsx prisma/restaurantSeedData.ts
```

---

## ⚠️ Important Notes

### **This Script Will:**
- ✅ **DELETE** all existing:
  - Countries
  - Restaurants
  - Restaurant Owners (users with RESTAURANT_OWNER role)
  - Dishes
  - Services, Features, Images
- ✅ **CREATE** fresh test data

### **This Script Will NOT Delete:**
- ❌ Admin users
- ❌ Customer users
- ❌ Driver users
- ❌ Orders
- ❌ Other app data

### **Safety:**
- Uses `@@map` so data goes to existing collections
- No migration needed
- Can run multiple times safely

---

## 📋 After Running Seed

### **1. Test Admin Dashboard**
```
URL: http://localhost:3000/dashboard

Login as ADMIN and navigate to:
- /dashboard/management-countries → See 5 cuisines
- /dashboard/management-categories → See 13 restaurants
```

### **2. Test Customer Frontend**
```
URL: http://localhost:3000

Homepage should show:
- 5 cuisine types
- Each with restaurant count
- Click to see restaurants
- Click restaurant to see profile
```

### **3. Test Restaurant Portal**
```
Login as restaurant owner:
Email: owner1@restaurant.sa
Password: owner123

URL: /restaurant-portal
- Dashboard with stats
- Edit profile
- View menu
```

### **4. Test Restaurant Pages**
```
Visit any restaurant:
/restaurant/indian-cuisine-مطعم-تاج-محل

Should see:
✅ Hero with cover image
✅ 4 tabs (Overview, Menu, Gallery, Info)
✅ Services & features
✅ Dishes/menu items
✅ Gallery images
✅ Google Maps
```

---

## 🎯 Test User Credentials

### **Admin**
```
Phone: 0500000000
Password: admin123
```

### **Restaurant Owners** (10 accounts)
```
Email: owner1@restaurant.sa to owner10@restaurant.sa
Password: owner123
```

### **Customers** (if you ran previous seeds)
```
Phone: 0501001xx
Password: customer123
```

---

## 🔄 Re-running the Seed

If you need to reset the data:

```bash
# Clear and reseed
npm run seed-restaurants

# Or if you need to reset everything
npx prisma migrate reset
npm run seed-restaurants
```

---

## 📊 Expected Database State

After successful seed:

| Collection | Count | Notes |
|------------|-------|-------|
| countries | 5 | Cuisine types |
| users (RESTAURANT_OWNER) | 10 | Restaurant owners |
| restaurants (categories) | 13 | Active restaurants |
| products (dishes) | ~130 | Menu items |
| restaurantservices | ~60 | 3-6 per restaurant |
| restaurantfeatures | ~40 | 2-4 per restaurant |
| restaurantimages | ~70 | 3-8 per restaurant |
| categoryproducts | ~130 | Restaurant-Dish links |

---

## 🐛 Troubleshooting

### **Error: Connection refused**
```bash
# Check if MongoDB is running
# Update .env with correct DATABASE_URL
```

### **Error: Module not found**
```bash
# Install dependencies
npm install

# Regenerate Prisma Client
npx prisma generate
```

### **Slow seed**
```bash
# Normal! Creating 130+ dishes with images
# Should take 30-60 seconds
```

### **No data showing**
```bash
# Clear browser cache
# Hard refresh (Ctrl + Shift + R)
# Check server logs for errors
```

---

## ✅ Verification Checklist

After seeding, verify:

- [ ] Homepage shows 5 cuisines
- [ ] Each cuisine shows restaurant count
- [ ] Clicking cuisine shows restaurants
- [ ] Restaurant cards show all details
- [ ] Restaurant profile has 4 tabs working
- [ ] Menu shows dishes with prices
- [ ] Gallery shows multiple images
- [ ] Admin dashboard lists countries
- [ ] Admin dashboard lists restaurants
- [ ] Restaurant portal accessible (as owner)

---

## 🎉 Next Steps

1. **Run the seed**: `npm run seed-restaurants`
2. **Open browser**: http://localhost:3000
3. **Follow the QA Test Plan**: See `QA_TEST_PLAN.md`
4. **Test all features**: Use credentials above
5. **Report bugs**: Tell me what needs fixing!

---

**Happy Testing! 🚀**




