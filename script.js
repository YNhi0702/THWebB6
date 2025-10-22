// JS cho trang sản phẩm (bản ghi chú kiểu học sinh)
// Ghi chú ngắn: file này xử lý tìm kiếm, mở form thêm, validate và thêm sản phẩm mới vào trang

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  // Hàm tìm kiếm: mỗi lần chạy lấy danh sách hiện tại trong DOM
  // Vì vậy sản phẩm mới thêm vào cũng sẽ được tìm thấy
  function doSearch() {
    const q = searchInput.value.trim().toLowerCase();
    const productItems = document.querySelectorAll('.product-item');
    productItems.forEach(item => {
      const nameEl = item.querySelector('.product-name');
      const name = nameEl ? nameEl.textContent.toLowerCase() : '';
      if (name.includes(q)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }

  // Sự kiện: bấm nút Tìm hoặc Enter thì tìm
  searchBtn.addEventListener('click', doSearch);
  searchInput.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') doSearch();
  });

  // Xử lý nút Thêm sản phẩm: hiện/ẩn form
  const addProductBtn = document.getElementById('addProductBtn');
  const addProductForm = document.getElementById('addProductForm');

  addProductBtn.addEventListener('click', function () {
    // bật/tắt form và focus vào tên
    addProductForm.classList.toggle('hidden');
    if (!addProductForm.classList.contains('hidden')) {
      document.getElementById('newName').focus();
      // ẩn lỗi cũ (nếu có)
      const err = document.getElementById('errorMsg'); if (err) { err.style.display = 'none'; err.textContent = ''; }
    }
  });

  // Khi submit form thêm sản phẩm: validate + thêm vào đầu danh sách
  addProductForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const nameEl = document.getElementById('newName');
    const descEl = document.getElementById('newDesc');
    const priceEl = document.getElementById('newPrice');
    const err = document.getElementById('errorMsg');

    const name = nameEl.value.trim();
    const desc = descEl.value.trim();
    const priceRaw = priceEl.value.trim();
    const priceNum = Number(priceRaw);

    // Kiểm tra nhanh: tên không rỗng
    if (!name) {
      err.textContent = 'Vui lòng nhập tên sản phẩm.';
      err.style.display = '';
      nameEl.focus();
      return;
    }
    // Giá phải là số > 0
    if (priceRaw === '' || isNaN(priceNum) || priceNum <= 0) {
      err.textContent = 'Vui lòng nhập giá hợp lệ (số lớn hơn 0).';
      err.style.display = '';
      priceEl.focus();
      return;
    }
    // OK thì ẩn lỗi
    err.textContent = '';
    err.style.display = 'none';

    // Tạo phần tử product mới và đưa lên đầu (nhìn giống các sản phẩm khác)
    const article = document.createElement('article');
    article.className = 'product-item';
    article.innerHTML = `<h3 class="product-name">${escapeHtml(name)}</h3>
      <p class="product-desc">${escapeHtml(desc)}</p>
      <p class="price">Giá: ${escapeHtml(formatPrice(priceNum))}</p>`;

    const list = document.querySelector('.products-list');
    list.prepend(article); // thêm lên đầu

    // reset form và ẩn lại
    addProductForm.reset();
    addProductForm.classList.add('hidden');

    // nếu đang có tìm kiếm thì gọi lại để cập nhật hiển thị
    if (searchInput.value.trim() !== '') doSearch();
  });

  // Nút Hủy: chỉ reset và ẩn form thôi
  const cancelBtn = document.getElementById('cancelBtn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function () {
      addProductForm.reset();
      addProductForm.classList.add('hidden');
      const err = document.getElementById('errorMsg'); if (err) { err.style.display = 'none'; err.textContent = ''; }
    });
  }

  // Hàm nhỏ: format số thành định dạng VN và thêm ₫
  function formatPrice(n) {
    try {
      return n.toLocaleString('vi-VN') + '₫';
    } catch (e) {
      return n + '₫';
    }
  }

  // Hàm nhỏ: escape HTML (đỡ chèn mã độc dạng cơ bản)
  function escapeHtml(str) {
    return str.replace(/[&<>\"']/g, function (m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      })[m];
    });
  }
});
