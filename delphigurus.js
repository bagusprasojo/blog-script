let currentPage = 1;
const perPage = 8;
let currentLabel = 'Artikel';
let totalPosts = 0;

// Hitung total postingan berdasarkan label
function getTotalPosts(label) {
  const url = `https://delphigurus.blogspot.com/feeds/posts/summary/-/${encodeURIComponent(label)}?alt=json`;
  return fetch(url)
    .then(res => res.json())
    .then(data => parseInt(data.feed.openSearch$totalResults.$t));
}

function loadArtikelByLabel(label = 'Artikel', page = 1) {
  currentLabel = label;
  currentPage = page;

  const container = document.getElementById('recent-Artikel');
  container.innerHTML = `<div class="col-12 text-center"><p>Loading...</p></div>`;

  const startIndex = (page - 1) * perPage + 1;
  const url = `https://delphigurus.blogspot.com/feeds/posts/default/-/${encodeURIComponent(label)}?alt=json&start-index=${startIndex}&max-results=${perPage}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      container.innerHTML = "";
      const posts = data.feed.entry || [];

      posts.forEach(post => {
        const title = post.title.$t;
        const link = post.link.find(l => l.rel === 'alternate').href;
        const content = post.content?.$t || '';

        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
        const imgSrc = imgMatch && imgMatch[1] ? imgMatch[1] : 'https://via.placeholder.com/300x200?text=No+Image';

        const waNumber = "62895801987058";
        const message = encodeURIComponent(`Halo, saya berminat membeli Artikel "${title}".\nHalaman: ${link}`);
        const link_beli = `https://wa.me/${waNumber}?text=${message}`;

        const col = document.createElement('div');
        col.className = 'col-12 mb-4';
        col.innerHTML = `
          <div class="card shadow-sm border-0 h-100">
            <div class="row g-3 align-items-center">
              
              <!-- Baris pertama: Judul -->
              <div class="col-12 text-start">
                <h5 class="card-title mb-2" style="font-size: 1.15rem; line-height: 1.4;">
                  <a href="${link}" class="text-decoration-none text-dark fw-bold">
                    ${title}
                  </a>
                </h4>
              </div>

              <!-- Baris kedua: Gambar + Snippet -->
              <div class="col-md-4 col-12 d-flex flex-column justify-content-start">
                <a href="${link}">
                  <img src="${imgSrc}" alt="${title}" class="img-fluid rounded" 
                       style="width:100%; object-fit:cover;" loading="lazy" />
                </a>
              </div>
              <div class="col-md-8 col-12 text-start">
                <p class="text-muted" style="font-size: 0.95rem;">
                  ${content.replace(/<[^>]+>/g, '').substring(0, 480)}...
                </p>

                <!-- Tombol share -->
                <div class="d-flex gap-2 mt-2">
                  <a class="btn btn-sm btn-outline-primary" target="_blank" 
                     href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}">
                     <i class="bi bi-facebook"></i> Facebook
                  </a>
                  <a class="btn btn-sm btn-outline-success" target="_blank" 
                     href="https://wa.me/?text=${encodeURIComponent(title + ' ' + link)}">
                     <i class="bi bi-whatsapp"></i> WhatsApp
                  </a>
                  <a class="btn btn-sm btn-outline-info" target="_blank" 
                     href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title + ' ' + link)}">
                     <i class="bi bi-twitter-x"></i> Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
        container.appendChild(col);
      });

      renderPagination();
    })
    .catch(error => {
      console.error('Gagal memuat postingan:', error);
      container.innerHTML = `<div class="col-12 text-center"><p class="text-muted">Tidak ada Artikel ditemukan.</p></div>`;
    });
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = "";
  const totalPages = Math.ceil(totalPosts / perPage);

  if (totalPages <= 1) return;

  // Tombol Prev
  pagination.innerHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="loadArtikelByLabel('${currentLabel}', ${currentPage - 1})">Prev</a>
    </li>`;

  // Nomor halaman
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" onclick="loadArtikelByLabel('${currentLabel}', ${i})">${i}</a>
      </li>`;
  }

  // Tombol Next
  pagination.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="loadArtikelByLabel('${currentLabel}', ${currentPage + 1})">Next</a>
    </li>`;
}

// Event filter label
document.querySelectorAll('.label-radio').forEach(radio => {  
  radio.addEventListener('change', async function () {
    const labelDipilih = this.value;
    totalPosts = await getTotalPosts(labelDipilih);
    loadArtikelByLabel(labelDipilih, 1);
  });
});

// Muat awal dengan label default
document.addEventListener('DOMContentLoaded', async function () {
  totalPosts = await getTotalPosts('Artikel');
  loadArtikelByLabel('Artikel', 1);
});
