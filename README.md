# Home Test Frontend Web Developer – Blog Management Web

Aplikasi **manajemen artikel** berbasis **Next.js** dengan role **User** dan **Admin**. Aplikasi mendukung autentikasi dan otorisasi, sehingga tiap role hanya dapat mengakses fitur yang sesuai. Tampilan dibuat responsif dan terintegrasi dengan API yang disediakan ([Base URL](https://test-fe.mysellerpintar.com/api)).

## Demo
URL Hosting: [https://articles-next-js-2exa.vercel.app/login](https://articles-next-js-2exa.vercel.app/login)

## Fitur

### 1. User
- **Authentication**
  - Login dan Register dengan validasi form
  - Redirect ke list artikel setelah login/register sukses
  - Logout dengan redirect ke halaman login
- **List Artikel**
  - Filter artikel berdasarkan kategori
  - Searching artikel dengan debounce 300-500ms
  - Pagination jika data lebih dari 9 item
- **Detail Artikel**
  - Menampilkan konten artikel lengkap
  - Menampilkan maksimal 3 artikel dari kategori yang sama sebagai "Other Articles"

### 2. Admin
- **Authentication**
  - Login dan Register dengan validasi form
  - Redirect ke list artikel setelah login/register sukses
  - Logout dengan redirect ke halaman login
- **List Categories**
  - Searching category dengan debounce 300-500ms
  - Pagination jika data lebih dari 10 item
- **Create/Edit Category**
  - Form validation menggunakan Zod + React Hook Form
  - Editor Tiptap untuk konten artikel
- **List Artikel**
  - Filter artikel berdasarkan kategori
  - Searching artikel dengan debounce 300-500ms
  - Pagination jika data lebih dari 10 item
- **Create/Edit Artikel**
  - Form validation menggunakan Zod + React Hook Form
  - Preview sebelum submit (fetch API)

## Teknologi
- **Framework**: Next.js 
- **Styling**: Tailwind CSS 
- **API**: Axios
- **Form Validation**: Zod + React Hook Form
- **Version Control**: Git + GitHub

## Cara Menjalankan Lokal
1. Clone repository:
   ```bash
   gh repo clone shalunafasya/Articles-Next.js
   cd repo
