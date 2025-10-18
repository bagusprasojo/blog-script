let currentPage = 1;
const perPage = 8;
let currentLabel = 'Produk';
let totalPosts = 0;

// Hitung total postingan berdasarkan label
function getTotalPosts(label) {
  const url = `https://www.tokoumi.com/feeds/posts/summary/-/${encodeURIComponent(label)}?alt=json`;
  return fetch(url)
    .then(res => res.json())
    .then(data => parseInt(data.feed.openSearch$totalResults.$t));
}

function loadProdukByLabel(label = 'Produk', page = 1) {
  currentLabel = label;
  currentPage = page;

  const container = document.getElementById('recent-produk');
  container.innerHTML = `<div class="col-12 text-center"><p>Loading...</p></div>`;

  const startIndex = (page - 1) * perPage + 1;
  const url = `https://www.tokoumi.com/feeds/posts/default/-/${encodeURIComponent(label)}?alt=json&start-index=${startIndex}&max-results=${perPage}`;

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
        const message = encodeURIComponent(`Halo, saya berminat membeli produk "${title}".\nHalaman: ${link}`);
        const link_beli = `https://wa.me/${waNumber}?text=${message}`;

        const col = document.createElement('div');
        col.className = 'col-6 col-md-4 col-lg-3';
        col.innerHTML = `
          <div class="card shadow-sm border-0 h-100">
          	<div class="card-header">
              <h6 class='card-title'><a href='${link}'>${title}</a></h6>            
            </div>
          	<div class='card-body text-center'>
              <a href='${link}'><img src='${imgSrc}' class='card-img-top' alt='${title}' style='height:auto; width:100%; object-fit:cover;' loading='lazy' /></a>
            
                          
              
            </div>
            <div class="card-footer">
              <div class='d-flex justify-content-center gap-2'>                
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
            </div>
          </div>
        `;
        container.appendChild(col);
      });

      renderPagination();
    })
    .catch(error => {
      console.error('Gagal memuat postingan:', error);
      container.innerHTML = `<div class="col-12 text-center"><p class="text-muted">Tidak ada produk ditemukan.</p></div>`;
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
      <a class="page-link" href="#" onclick="loadProdukByLabel('${currentLabel}', ${currentPage - 1})">Prev</a>
    </li>`;

  // Nomor halaman
  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <li class="page-item ${i === currentPage ? 'active' : ''}">
        <a class="page-link" href="#" onclick="loadProdukByLabel('${currentLabel}', ${i})">${i}</a>
      </li>`;
  }

  // Tombol Next
  pagination.innerHTML += `
    <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
      <a class="page-link" href="#" onclick="loadProdukByLabel('${currentLabel}', ${currentPage + 1})">Next</a>
    </li>`;
}

// Event filter label
document.querySelectorAll('.label-radio').forEach(radio => {  
  radio.addEventListener('change', async function () {
    const labelDipilih = this.value;
    totalPosts = await getTotalPosts(labelDipilih);
    loadProdukByLabel(labelDipilih, 1);
  });
});

// Muat awal dengan label default
document.addEventListener('DOMContentLoaded', async function () {
  totalPosts = await getTotalPosts('Produk');
  loadProdukByLabel('Produk', 1);
});
