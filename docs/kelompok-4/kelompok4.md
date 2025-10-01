Pada kesempatan kali ini, kelompok kami berhasil melakukan beberapa konfigurasi untuk
login, mengakses menu, menambahkan menu, mengedit menu, dan menghapus menu pada
database web kami melalui postman.

1. Login
   Bagian ini berfungsi sebagai login untuk melihat role pada akun yang telah kita buat
   melalui postman.
   Untuk aksesnya masukkan link berikut ke postman: https://projekkelompok4-
   production.up.railway.app/api/login

2. Get Makanan dan Get Minuman
   Bagian ini kita bisa mengakses database menu dari web projek kami, disini akan
   ditampilkan semua menu yang ada pada web kami.
   Untuk akses Get Makanan masukkan link berikut ke postman: https://projekkelompok4-
   production.up.railway.app/api/makanan
   Untuk akses Get Minuman masukkan link berikut ke postman: https://projekkelompok4-
   production.up.railway.app/api/minuman

3. Post Makanan dan Post Minuman
   Bagian ini berfungsi sebagai metode atau cara kita menambahkan menu ke dalam
   database dan bisa diakses di web melalui postman. Untuk menambahkan menu, masuk ke
   X Form atau Raw pada bagian body lalu masukkan ‘name’, ‘description’, ‘price’,
   ‘category’ makanan atau minuman
   Untuk akses Post Makanan masukkan link berikut ke postman lalu ubah ke post:
   https://projekkelompok4-production.up.railway.app/api/makanan/
   Untuk akses Post Minuman masukkan link berikut ke postman lalu ubah ke post:
   https://projekkelompok4-production.up.railway.app/api/minuman/

4. Put Makanan dan Put Minuman
   Bagian ini berfungsi sebagai metode atau cara kita untuk mengedit menu yang telah
   tersimpan di database web kita. Untuk menambahkan menu, masuk ke X Form atau Raw
   pada bagian body lalu masukkan ‘name’, ‘description’, ‘price’, ‘category’ makanan atau
   minuman.
   Untuk akses Put Makanan masukkan link berikut ke postman lalu ubah ke Put, pilih id
   misalnya id nya 13: https://projekkelompok4-production.up.railway.app/api/makanan/13
   Untuk akses Put Makanan masukkan link berikut ke postman lalu ubah ke Put:
   https://projekkelompok4-production.up.railway.app/api/minuman/9

5. Delete Makanan dan Delete Minuman
   Bagian ini berfungsi sebagai metode atau cara kita untuk menghapus menu yang ada pada
   database web.
   Untuk akses Delete Makanan masukkan link berikut ke postman lalu ubah ke Delete,
   pilih id misalnya id nya 13: https://projekkelompok4-
   production.up.railway.app/api/makanan/13
   Untuk akses Delete Minuman masukkan link berikut ke postman lalu ubah ke Put:
   https://projekkelompok4-production.up.railway.app/api/minuman/13
