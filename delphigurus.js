<script>
let currentPage = 1;
const perPage = 8;
let currentLabel = 'Artikel';
let totalPosts = 0;

// Hitung total postingan berdasarkan label
async function getTotalPosts(label) {
  const url = `https://delphigurus.blogspot.com/feeds/posts/summary/-/${encodeURIComponent(label)}?alt=json`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return parseInt(data.feed.openSearch$totalResults.$t) || 0;
  } catch (err) {
    console.error('Gagal menghitung total post:', err);
    return 0;
  }
}

async function loadArtikelByLabel(label = 'Artikel', page = 1) {
  currentLabel = label;
  currentPage = page;

  const container = document.getElementById('recent-Artikel');
  container.innerHTML = `
    <div class="col-12 text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>`;

  const startIndex = (page - 1) * perPage + 1;
  const url = `https://delphigurus.blogspot.com/feeds/posts/default/-/${encodeURIComponent(label)}?alt=json&start-index=${startIndex}&max-results=${perPage}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    container.innerHTML = "";
    const posts = data.feed?.entry || [];

    if (posts.length === 0) {
      container.innerHTML = `<div class="col-12 text-center"><p class="text-muted">Tidak ada artikel ditemukan.</p></div>`;
      return;
    }

    posts.forEach(post => {
      const title = post.title.$t;
      const link = post.link.find(l => l.rel === 'alternate').href;
      const content = post.content?.$t || '';
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const imgSrc = imgMatch && imgMatch[1] ? imgMatch[1] : 'https://via.placeholder.com/300x200?text=No+Image';

      const waNumber = "62895801987058";
      const message = encodeURIComponent(`Halo, saya berminat membaca artikel "${title}".\nHalaman: ${link}`);
      const link_beli = `https://wa.me/${waNumber}?text=${message}`;

      const col = document.createElement('div');
      col.className = 'col-6 col-md-4 col-lg-3 mb-4';
      col.innerHTML = `
        <div class="card shadow-sm border-0 h-100">
          <a href="${link}" title="${title}">
            <img src="${imgSrc}" alt="${title}" class="card-img-top" style="object-fit:cover;height:180px;width:100%;" loading="lazy">
          </a>
          <div class="card-body d-flex flex-column">
            <h6 class="card-title mb-3">
              <a href="${link}" class="text-decoration-none text-dark">${title}</a>
            </h6>
            <div class="mt-auto d-flex justify-content-between align-items-center">
              <div class="btn-group">
                <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">Share</button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li><a class="dropdown-item" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}">Facebook</a></li>
                  <li><a class="dropdown-item" target="_blank" href="https://wa.me/?text=${encodeURIComponent(title + ' ' + link)}">WhatsApp</a></li>
                  <li><a class="dropdown-item" target="_blank" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title + ' ' + link)}">Twitter</a></li>
                </ul>
              </div>
              <a class="btn btn-sm btn-primary" href="${link_beli}">🛒 Beli</a>
            </div>
          </div>
        </div>`;
      container.appendChild(col);
    });

    renderPagination();

  } catch (error) {
    console.error('Gagal memuat postingan:', error);
    container.innerHTML = `<div class="col-12 text-center"><p class="text-muted">Tidak ada artikel ditemukan.</p></div>`;
  }
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = "";
  const totalPages = Math.ceil(totalPosts / perPage);

  if (totalPages <= 1) return;

  pagination.innerHTML += `
    <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="loadArtikelByLabel('${currentLabel}', ${currentPage - 1})">Prev</a>
    </li>`;

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" onclick="loadArtikelByLabel('${currentLabel}', ${i})">${i}</a>
      </li>`;
  }

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

// Muat awal
document.addEventListener('DOMContentLoaded', async function () {
  totalPosts = await getTotalPosts('Artikel');
  loadArtikelByLabel('Artikel', 1);
});
</script>
