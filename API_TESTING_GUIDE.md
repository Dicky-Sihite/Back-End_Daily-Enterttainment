# Panduan Lengkap Testing API Daily Entertainment

Panduan ini akan menjelaskan langkah-langkah untuk mengetes semua endpoint yang telah dibuat. Sangat disarankan untuk menggunakan alat bantu seperti **Postman** atau ekstensi **Thunder Client / REST Client** di VS Code.

> **Catatan Penting:** 
> Pastikan server backend Anda sudah menyala (`npm run dev`) dan terhubung ke database PostgreSQL. Base URL secara default adalah `http://localhost:5000/api`.

---

## 1. Flow User & Otentikasi
Untuk dapat mengakses fitur Content (Create), Bookmark, dan History, Anda harus memiliki **Access Token** yang didapatkan dari proses Login.

### 1.1. Register (Daftar Akun Baru)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/register`
- **Body (JSON):**
  ```json
  {
    "username": "testuser",
    "email": "testuser@gmail.com",
    "password": "password123"
  }
  ```

### 1.2. Login
Setelah berhasil register, lakukan login untuk mendapatkan `accessToken`.
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/login`
- **Body (JSON):**
  ```json
  {
    "email": "testuser@gmail.com",
    "password": "password123"
  }
  ```
> **Penting:** Salin token acak (string panjang) yang ada di properti `data.accessToken` pada response API. Token ini akan digunakan Authorization Header di request selanjutnya.

---

## 2. Cara Menggunakan Access Token (Authorization)
Untuk setiap request yang membutuhkan otentikasi (mempunyai tulisan **[Requires Auth]** di bawah), Anda wajib menyertakan token pada **Headers**:
- **Key:** `Authorization`
- **Value:** `Bearer <PASTE_ACCESS_TOKEN_DI_SINI>`
*(Ganti `<PASTE_ACCESS_TOKEN_DI_SINI>` dengan token yang Anda copy dari respon login).*

---

## 3. Flow Contents (Konten)

### 3.1. Create Content [Requires Auth]
Membuat konten baru.
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/contents`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "title": "Film Aksi Terbaik 2026",
    "description": "Deskripsi film yang sangat menarik.",
    "category_id": 1, 
    "thumbnail": "https://example.com/thumbnail.jpg",
    "url": "https://example.com/video"
  }
  ```
*(Catatan: pastikan `category_id` ada di tabel categories database Anda, atau hapus baris `category_id` jika tabel category masih kosong/boleh null).*

### 3.2. Get All Contents
Mendapatkan semua daftar konten (Bisa diakses tanpa token).
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/contents`

### 3.3. Get Content Detail
Mendapatkan detail dari 1 konten spesifik berdasarkan ID.
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/contents/1`
*(Ganti `1` dengan ID content yang Anda dapat dari Create / Get All).*

---

## 4. Flow Bookmarks (Favorit)

### 4.1. Add Bookmark [Requires Auth]
Menambahkan konten ke daftar bookmark user.
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/bookmarks`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "content_id": 1
  }
  ```

### 4.2. Get User Bookmarks [Requires Auth]
Melihat daftar semua konten yang sudah di-bookmark oleh user yang sedang login.
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/bookmarks`
- **Headers:** `Authorization: Bearer <TOKEN>`

### 4.3. Remove Bookmark [Requires Auth]
Menghapus bookmark dari daftar.
- **Method:** `DELETE`
- **URL:** `http://localhost:5000/api/bookmarks/1`
- **Headers:** `Authorization: Bearer <TOKEN>`
*(Angka `1` di ujung URL adalah `content_id` yang ingin dihapus dari bookmark, BUKAN id bookmark).*

---

## 5. Flow Histories (Riwayat Tontonan)

### 5.1. Track History [Requires Auth]
Mencatat riwayat tontonan saat user mengklik/menonton konten.
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/histories`
- **Headers:** `Authorization: Bearer <TOKEN>`
- **Body (JSON):**
  ```json
  {
    "content_id": 1
  }
  ```

### 5.2. Get User History [Requires Auth]
Melihat riwayat semua konten yang sudah dilihat oleh user tersebut (diurutkan dari yang paling baru dilihat).
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/histories`
- **Headers:** `Authorization: Bearer <TOKEN>`
