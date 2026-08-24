// =============================================
// DU LIEU SAN PHAM (PHAN LOAI THEO THU MUC)
// =============================================
var products = [
  // === ĐỊNH VỊ (thư mục images/dinhvi/) ===
  { id: 1, name: "Định vị nhân vật 2 lớp trắng xanh - Filza (anti band)", price: 25000, image: "images/dinhvi/dvitrangxanh.jpg", category: "dinhvi" },
  { id: 2, name: "Định vị nhân vật 2 lớp hồng cam - Filza (anti band)", price: 25000, image: "images/dinhvi/dvihongcam.jpg", category: "dinhvi" },
  { id: 3, name: "Định vị nhân vật trắng - Filza (anti band)", price: 20000, image: "images/dinhvi/dvitrang.jpg", category: "dinhvi" },
  { id: 4, name: "Định vị nhân vật đỏ - Filza (anti band)", price: 20000, image: "images/dinhvi/dvido.jpg", category: "dinhvi" },
  { id: 5, name: "Định vị nhân vật xanh nước - Filza (anti band)", price: 20000, image: "images/dinhvi/dvixanhnuoc.jpg", category: "dinhvi" },
  { id: 6, name: "Định vị nhân vật xanh lá - Filza (anti band)", price: 20000, image: "images/dinhvi/dvixanhla.jpg", category: "dinhvi" },
  { id: 7, name: "Định vị nhân vật vàng - Filza (anti band)", price: 20000, image: "images/dinhvi/dvivang.jpg", category: "dinhvi" },
  
  // === FILE AIM (thư mục images/aim/) ===
  { id: 8, name: "File nhẹ tâm - Filza (cân rank)", price: 30000, image: "images/aim/nhetam.jpg", category: "fileaim", fileUrl: "https://www.mediafire.com/file/lufmc3gukni1681/nh%e1%ba%b9+t%c3%a2m+By+TManh+ios.zip/file" },
  { id: 9, name: "File AIM Config V2 - Pro Settings", price: 20000, image: "images/aim/file aim v2.jpg", category: "fileaim" },
  { id: 10, name: "File AIM Config V3 - Aimbot Extreme", price: 25000, image: "images/aim/file aim v3.jpg", category: "fileaim" },
  
  // === MOD (thư mục images/mod/) ===
  { id: 11, name: "Mod M1887 Rồng Ender - Full Effects", price: 5000, image: "images/mod/modm1887ender.jpg", category: "mod" },
  { id: 12, name: "Mod Skin Ninja - Legendary", price: 8000, image: "images/mod/mod skin ninja.jpg", category: "mod" },
  { id: 13, name: "Mod Skin Samurai - Epic", price: 10000, image: "images/mod/mod skin samurai.jpg", category: "mod" }
];

function $(id) { return document.getElementById(id); }
function money(n) { return n.toLocaleString("vi-VN") + "d"; }

function getProduct(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) return products[i];
  }
  return null;
}

// =============================================
// HE THONG SO DU
// =============================================

function getUserBalance(username) {
  var data = localStorage.getItem("shopCuaManhBalance_" + username);
  return data ? parseInt(data) : 0;
}

function setUserBalance(username, amount) {
  localStorage.setItem("shopCuaManhBalance_" + username, String(amount));
}

function addUserBalance(username, amount) {
  var current = getUserBalance(username);
  var newBalance = current + amount;
  setUserBalance(username, newBalance);
  return newBalance;
}

// =============================================
// TAO MA NAP TIEN (TManhios-XXXXXX)
// =============================================

function generateRechargeCode() {
  var randomNum = Math.floor(Math.random() * 1000000).toString();
  while (randomNum.length < 6) randomNum = "0" + randomNum;
  return "TManhios-" + randomNum;
}

// =============================================
// QUAN LY MA NAP (TU DONG HET HAN SAU 10 PHUT)
// =============================================

function savePendingCode(code, amount) {
  var pending = getPendingCodes();
  var newPending = [];
  for (var i = 0; i < pending.length; i++) {
    if (pending[i].code !== code) {
      newPending.push(pending[i]);
    }
  }
  newPending.push({
    code: code,
    amount: amount,
    time: Date.now()
  });
  localStorage.setItem("pendingRechargeCodes", JSON.stringify(newPending));
}

function getPendingCodes() {
  var data = localStorage.getItem("pendingRechargeCodes");
  if (data) {
    try { return JSON.parse(data); } catch(e) { return []; }
  }
  return [];
}

function cleanExpiredCodes() {
  var pending = getPendingCodes();
  var now = Date.now();
  var newPending = [];
  for (var i = 0; i < pending.length; i++) {
    if (now - pending[i].time < 600000) {
      newPending.push(pending[i]);
    }
  }
  if (newPending.length !== pending.length) {
    localStorage.setItem("pendingRechargeCodes", JSON.stringify(newPending));
  }
  return newPending;
}

function isCodeValid(code) {
  cleanExpiredCodes();
  var pending = getPendingCodes();
  for (var i = 0; i < pending.length; i++) {
    if (pending[i].code === code) {
      return true;
    }
  }
  return false;
}

function removePendingCode(code) {
  var pending = getPendingCodes();
  var newPending = [];
  for (var i = 0; i < pending.length; i++) {
    if (pending[i].code !== code) {
      newPending.push(pending[i]);
    }
  }
  localStorage.setItem("pendingRechargeCodes", JSON.stringify(newPending));
}

function getTimeLeft(code) {
  var pending = getPendingCodes();
  for (var i = 0; i < pending.length; i++) {
    if (pending[i].code === code) {
      var left = 600000 - (Date.now() - pending[i].time);
      return Math.max(0, left);
    }
  }
  return 0;
}

function formatTimeLeft(ms) {
  if (ms <= 0) return "0:00";
  var minutes = Math.floor(ms / 60000);
  var seconds = Math.floor((ms % 60000) / 1000);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

// =============================================
// QUAN LY YEU CAU NAP CHO DUYET
// =============================================

function getPendingApprovals() {
  var data = localStorage.getItem('pendingApprovals');
  if (data) {
    try { return JSON.parse(data); } catch(e) { return []; }
  }
  return [];
}

function savePendingApprovals(approvals) {
  localStorage.setItem('pendingApprovals', JSON.stringify(approvals));
}

// =============================================
// LICH SU NAP TIEN
// =============================================

function getRechargeHistory() {
  var data = localStorage.getItem('rechargeHistory');
  if (data) {
    try { return JSON.parse(data); } catch(e) { return []; }
  }
  return [];
}

function saveRechargeHistory(history) {
  localStorage.setItem('rechargeHistory', JSON.stringify(history));
}

// =============================================
// LICH SU TRU TIEN
// =============================================

function getRemoveHistory() {
  var data = localStorage.getItem('removeHistory');
  if (data) {
    try { return JSON.parse(data); } catch(e) { return []; }
  }
  return [];
}

function saveRemoveHistory(history) {
  localStorage.setItem('removeHistory', JSON.stringify(history));
}

// =============================================
// POPUP HTML
// =============================================

function showPopup(title, message, type, callback) {
  var oldPopup = document.querySelector(".custom-popup-overlay");
  if (oldPopup) document.body.removeChild(oldPopup);

  var overlay = document.createElement("div");
  overlay.className = "custom-popup-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    backdrop-filter: blur(8px);
    animation: popupFadeIn 0.3s ease;
  `;

  var modal = document.createElement("div");
  modal.style.cssText = `
    background: linear-gradient(145deg, #0b0d3b, #03051d);
    border: 1px solid #833cff;
    border-radius: 20px;
    padding: 30px 28px;
    max-width: 480px;
    width: 92%;
    text-align: center;
    box-shadow: 0 0 50px rgba(112,30,255,0.5);
    animation: popupScaleIn 0.3s ease;
    max-height: 90vh;
    overflow-y: auto;
  `;

  var icon = type === "success" ? "✅" : type === "error" ? "❌" : "🛒";

  modal.innerHTML = `
    <div style="font-size:48px;margin-bottom:8px;">${icon}</div>
    <h2 style="color:white;margin:0 0 6px;font-size:20px;">${title}</h2>
    <p style="color:#b0b8e0;margin:0 0 20px;font-size:15px;line-height:1.5;">${message}</p>
    <div id="popup-buttons" style="display:flex;gap:12px;justify-content:center;"></div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  var btnContainer = modal.querySelector("#popup-buttons");

  if (type === "confirm") {
    var cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Hủy bỏ";
    cancelBtn.style.cssText = `
      flex:1;
      padding:10px 20px;
      background:transparent;
      border:1px solid #6a3fff;
      border-radius:12px;
      color:#b0b8e0;
      font-size:15px;
      font-weight:bold;
      cursor:pointer;
      transition:0.3s;
    `;
    cancelBtn.onmouseover = function() { this.style.background = "rgba(106,63,255,0.2)"; };
    cancelBtn.onmouseout = function() { this.style.background = "transparent"; };
    cancelBtn.onclick = function() {
      document.body.removeChild(overlay);
      if (callback) callback(false);
    };

    var okBtn = document.createElement("button");
    okBtn.textContent = "Xác nhận";
    okBtn.style.cssText = `
      flex:1;
      padding:10px 20px;
      background:linear-gradient(135deg,#16a34a,#15803d);
      border:none;
      border-radius:12px;
      color:white;
      font-size:15px;
      font-weight:bold;
      cursor:pointer;
      transition:0.3s;
    `;
    okBtn.onmouseover = function() { this.style.transform = "scale(1.02)"; };
    okBtn.onmouseout = function() { this.style.transform = "scale(1)"; };
    okBtn.onclick = function() {
      document.body.removeChild(overlay);
      if (callback) callback(true);
    };

    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(okBtn);
  } else {
    var okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.style.cssText = `
      padding:10px 40px;
      background:linear-gradient(135deg,#6a3fff,#a855f7);
      border:none;
      border-radius:12px;
      color:white;
      font-size:15px;
      font-weight:bold;
      cursor:pointer;
      transition:0.3s;
    `;
    okBtn.onmouseover = function() { this.style.transform = "scale(1.02)"; };
    okBtn.onmouseout = function() { this.style.transform = "scale(1)"; };
    okBtn.onclick = function() {
      document.body.removeChild(overlay);
      if (callback) callback();
    };

    btnContainer.appendChild(okBtn);
  }

  var style = document.createElement("style");
  style.textContent = `
    @keyframes popupFadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes popupScaleIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
  `;
  document.head.appendChild(style);
}

// =============================================
// XEM LICH SU (CHO NGUOI DUNG)
// =============================================

function getUserHistory() {
  var user = currentUser();
  if (!user) {
    showPopup("Thông báo", "Vui lòng đăng nhập!", "error");
    return;
  }

  var history = getRechargeHistory();
  var userHistory = [];
  var totalAmount = 0;
  
  for (var i = 0; i < history.length; i++) {
    if (history[i].username === user.name) {
      userHistory.push(history[i]);
      if (history[i].type !== 'remove') {
        totalAmount += history[i].amount;
      }
    }
  }

  if (userHistory.length === 0) {
    showPopup("📋 Lịch sử giao dịch", "Bạn chưa có lịch sử giao dịch nào.", "success");
    return;
  }

  var html = '<div style="text-align:left;max-height:350px;overflow-y:auto;">';
  for (var i = userHistory.length - 1; i >= 0; i--) {
    var h = userHistory[i];
    var isRemove = h.type === 'remove';
    var sign = isRemove ? '' : '+';
    var color = isRemove ? '#ff6b6b' : '#51cf66';
    var label = isRemove ? 'Trừ tiền' : 'Nạp tiền';
    var codeDisplay = isRemove ? (h.reason || 'Không có lý do') : h.code;
    
    html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1a1a4a;font-size:14px;">';
    html += '<span style="color:#888;font-size:12px;">' + h.time + '</span>';
    html += '<span style="color:' + color + ';">' + sign + formatMoney(Math.abs(h.amount)) + '</span>';
    html += '<span style="color:#888;font-size:11px;">' + codeDisplay + '</span>';
    html += '<span style="font-size:11px;color:#666;">' + label + '</span>';
    html += '</div>';
  }
  html += '</div>';
  
  var totalNap = 0;
  for (var i = 0; i < userHistory.length; i++) {
    if (userHistory[i].type !== 'remove') {
      totalNap += userHistory[i].amount;
    }
  }
  
  html += '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #4e3aa2;font-weight:bold;color:#ffd43b;">';
  html += '💰 Tổng đã nạp: ' + formatMoney(totalNap);
  html += ' | 💳 Số dư hiện tại: ' + formatMoney(getUserBalance(user.name));
  html += '</div>';

  showPopup("📋 Lịch sử giao dịch", html, "success");
}

function formatMoney(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}

// =============================================
// ESCAPE HTML
// =============================================

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function(c) {
    if (c === "&") return "&amp;";
    if (c === "<") return "&lt;";
    if (c === ">") return "&gt;";
    if (c === '"') return "&quot;";
    if (c === "'") return "&#039;";
    return c;
  });
}

// =============================================
// LOC SAN PHAM THEO DANH MUC
// =============================================

var currentCategory = 'all';

function filterProducts(category) {
  currentCategory = category;
  
  var tabs = document.querySelectorAll('.category-tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].getAttribute('data-category') === category) {
      tabs[i].classList.add('active');
    }
  }
  
  var filtered = [];
  if (category === 'all') {
    filtered = products;
  } else {
    for (var i = 0; i < products.length; i++) {
      if (products[i].category === category) {
        filtered.push(products[i]);
      }
    }
  }
  
  renderProducts(filtered);
  
  var titleMap = {
    'all': 'Tất cả sản phẩm',
    'dinhvi': '📍 Định vị',
    'fileaim': '📁 File AIM',
    'mod': '🎮 Mod'
  };
  var titleEl = document.getElementById('categoryTitle');
  if (titleEl) {
    titleEl.textContent = titleMap[category] || 'Sản phẩm';
  }
}

// =============================================
// HIEN THI SAN PHAM
// =============================================

function productCard(p) {
  return '<article class="product-card">' +
    '<img class="product-image" src="' + p.image + '" alt="' + escapeHtml(p.name) + '" onerror="this.style.opacity=\'.15\'; this.alt=\'Khong tim thay anh\';">' +
    '<div class="product-info">' +
      '<h3 class="product-name">' + escapeHtml(p.name) + '</h3>' +
      '<div class="price">' + money(p.price) + '</div>' +
      '<button class="gradient-btn" onclick="buyNow(' + p.id + ')">Mua</button>' +
    '</div>' +
  '</article>';
}

function renderProducts(list) {
  if (!list) list = products;
  var grid = $("productGrid");
  if (!grid) return;
  
  if (list.length === 0) {
    grid.innerHTML = '';
    var noProducts = $("noProducts");
    if (noProducts) noProducts.hidden = false;
    return;
  }
  
  var html = "";
  for (var i = 0; i < list.length; i++) {
    html += productCard(list[i]);
  }
  grid.innerHTML = html;
  
  var noProducts = $("noProducts");
  if (noProducts) noProducts.hidden = true;
}

// =============================================
// TIM KIEM
// =============================================

function searchProducts() {
  var input = $("searchInput");
  var q = input.value.trim().toLowerCase();
  var result = [];
  
  if (currentCategory === 'all') {
    for (var i = 0; i < products.length; i++) {
      if (products[i].name.toLowerCase().includes(q)) {
        result.push(products[i]);
      }
    }
  } else {
    for (var i = 0; i < products.length; i++) {
      if (products[i].category === currentCategory && products[i].name.toLowerCase().includes(q)) {
        result.push(products[i]);
      }
    }
  }
  
  renderProducts(result);
  var noProducts = $("noProducts");
  if (noProducts) noProducts.hidden = (result.length > 0);
}

// =============================================
// MUA NGAY (DUNG SO DU + TU DONG MO FILE)
// =============================================

function buyNow(productId) {
  var user = currentUser();
  if (!user) {
    showPopup("Thông báo", "Vui lòng đăng nhập để mua hàng!", "error", function() {
      openLogin();
    });
    return;
  }

  var product = getProduct(productId);
  if (!product) return;

  var balance = getUserBalance(user.name);
  if (balance < product.price) {
    showPopup(
      "⚠️ Số dư không đủ!",
      "Bạn cần <strong style='color:#ff59e8;'>" + money(product.price) + "</strong> để mua sản phẩm này.<br>💰 Số dư hiện tại: <strong style='color:#51cf66;'>" + money(balance) + "</strong><br><br>Vui lòng nạp thêm tiền vào ví.",
      "error"
    );
    return;
  }

  showPopup(
    "Xác nhận mua hàng",
    "Bạn có chắc muốn mua <strong>" + product.name + "</strong> với giá <strong style='color:#ff59e8;'>" + money(product.price) + "</strong>?<br><br>💰 Số dư hiện tại: <strong style='color:#51cf66;'>" + money(balance) + "</strong>",
    "confirm",
    function(result) {
      if (result) {
        // Trừ tiền
        var newBalance = balance - product.price;
        setUserBalance(user.name, newBalance);
        updateBalanceUI();
        
        // Lấy link file
        var fileUrl = product.fileUrl || null;
        
        // Hiển thị popup thành công
        showPopup(
          "🎉 Mua hàng thành công!",
          "Bạn đã mua <strong>" + product.name + "</strong> với giá <strong style='color:#ff59e8;'>" + money(product.price) + "</strong><br><br>💰 Số dư còn lại: <strong style='color:#51cf66;'>" + money(newBalance) + "</strong><br><br>📥 Nhấn OK để tải file!",
          "success",
          function() {
            // MỞ FILE SAU KHI ẤN OK
            if (fileUrl) {
              window.open(fileUrl, '_blank');
            } else {
              showPopup("Thông báo", "Sản phẩm này chưa có link tải. Vui lòng liên hệ admin!", "error");
            }
          }
        );
      }
    }
  );
}

// =============================================
// POPUP NAP TIEN
// =============================================

function showRechargePopup(rechargeCode, amount) {
  var oldPopup = document.querySelector(".custom-popup-overlay");
  if (oldPopup) document.body.removeChild(oldPopup);

  var overlay = document.createElement("div");
  overlay.className = "custom-popup-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    backdrop-filter: blur(10px);
    animation: popupFadeIn 0.3s ease;
  `;

  var modal = document.createElement("div");
  modal.style.cssText = `
    background: linear-gradient(145deg, #0b0d3b, #03051d);
    border: 1px solid #833cff;
    border-radius: 20px;
    padding: 22px 22px 28px;
    max-width: 420px;
    width: 94%;
    text-align: center;
    box-shadow: 0 0 50px rgba(112,30,255,0.5);
    animation: popupScaleIn 0.3s ease;
    max-height: 95vh;
    overflow-y: auto;
  `;

  var timerId = "timer_" + rechargeCode;

  modal.innerHTML = `
    <div style="font-size:36px;margin-bottom:4px;">💰</div>
    <h2 style="color:white;margin:0 0 3px;font-size:19px;">Nap tien vao vi</h2>
    <p style="color:#b0b8e0;margin:0 0 14px;font-size:13px;">Quet ma QR de chuyen khoan</p>

    <div style="background:#06082a;padding:14px;border-radius:12px;border:1px solid #4e3aa2;margin-bottom:14px;">
      <p style="font-size:11px;color:#888;margin:0 0 8px;">📱 Quet ma QR</p>
      <img src="images/manganhang.jpg" alt="Ma QR chuyen khoan" 
        style="width:100%;max-width:200px;height:auto;border-radius:10px;display:block;margin:0 auto;border:1px solid #4e3aa2;"
        onerror="this.style.display='none'; this.parentNode.innerHTML='<p style=\\'color:#ff6b6b;font-size:13px;margin:10px;\\'>⚠️ Chua co anh QR<br><span style=\\'font-size:11px;color:#888;\\'>Vui long them images/manganhang.jpg</span></p>';">
    </div>

    <div style="margin:0 0 12px;text-align:left;background:#06082a;padding:12px 14px;border-radius:12px;border:1px solid #4e3aa2;">
      <p style="margin:2px 0;font-size:13px;color:#b0b8e0;"><strong style="color:#c8d0f5;">💳 Ngan hang:</strong> MB Bank</p>
      <p style="margin:2px 0;font-size:13px;color:#b0b8e0;"><strong style="color:#c8d0f5;">🔢 So tai khoan:</strong> 08122261152109</p>
      <p style="margin:2px 0;font-size:13px;color:#b0b8e0;"><strong style="color:#c8d0f5;">👤 Chu tai khoan:</strong> PHAM TIEN MANH</p>
      <p style="margin:2px 0;font-size:13px;color:#b0b8e0;"><strong style="color:#c8d0f5;">💰 So tien:</strong> <span style="color:#ff59e8;font-size:18px;font-weight:bold;">${money(amount)}</span></p>
    </div>

    <div style="margin:0 0 14px;padding:12px;background:#fff3cd;border-radius:12px;border:2px solid #ffc107;">
      <p style="color:#856404;font-weight:bold;margin:0 0 4px;font-size:13px;">📌 Noi dung chuyen khoan:</p>
      <p style="font-size:18px;font-weight:bold;color:#d63384;margin:0;word-break:break-all;user-select:all;letter-spacing:1px;">${rechargeCode}</p>
      <p style="margin:6px 0 0;font-size:13px;color:#888;">
        ⏰ Con <strong style="color:#ffd43b;font-size:16px;" id="${timerId}">10:00</strong> phut de chuyen khoan
      </p>
    </div>

    <button onclick="copyContent('${rechargeCode}')" 
      style="width:100%;padding:10px;background:linear-gradient(135deg,#0d6efd,#0b5ed7);color:white;border:none;border-radius:12px;font-size:14px;font-weight:bold;cursor:pointer;margin-bottom:8px;transition:0.3s;">
      📋 Copy noi dung chuyen khoan
    </button>

    <button onclick="completeRecharge('${rechargeCode}', ${amount})" 
      style="width:100%;padding:12px;background:linear-gradient(135deg,#16a34a,#15803d);color:white;border:none;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;transition:0.3s;">
      ✅ Toi da chuyen khoan
    </button>

    <button onclick="closePaymentPopup(this)" 
      style="width:100%;margin-top:6px;padding:8px;background:transparent;color:#888;border:1px solid #4e3aa2;border-radius:12px;font-size:13px;cursor:pointer;transition:0.3s;">
      ❌ Dong
    </button>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  var timerElement = document.getElementById(timerId);
  if (timerElement) {
    var pending = getPendingCodes();
    var createdTime = 0;
    for (var i = 0; i < pending.length; i++) {
      if (pending[i].code === rechargeCode) {
        createdTime = pending[i].time;
        break;
      }
    }

    function updateTimer() {
      var left = Math.max(0, 600000 - (Date.now() - createdTime));
      
      if (left <= 0) {
        timerElement.textContent = "0:00";
        timerElement.style.color = "#ff6b6b";
        setTimeout(function() {
          var popup = document.querySelector(".custom-popup-overlay");
          if (popup) {
            showPopup("⏰ Het thoi gian!", "Ma nap <strong style='color:#ff6b6b;'>" + rechargeCode + "</strong> da het hieu luc.<br><br>Vui long tao ma moi de nap tien.", "error");
            document.body.removeChild(popup);
          }
        }, 500);
        return;
      }
      
      var minutes = Math.floor(left / 60000);
      var seconds = Math.floor((left % 60000) / 1000);
      timerElement.textContent = minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
      
      timerElement.style.color = left < 60000 ? "#ff6b6b" : "#ffd43b";
      
      requestAnimationFrame(updateTimer);
    }
    
    updateTimer();
  }

  overlay.onclick = function(e) {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  };
}

function closePaymentPopup(btn) {
  var overlay = btn.closest(".custom-popup-overlay");
  if (overlay) document.body.removeChild(overlay);
}

function copyContent(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(function() {
      showPopup("✅ Da copy!", "Noi dung chuyen khoan da duoc sao chep.", "success");
    }).catch(function() {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand("copy");
    showPopup("✅ Da copy!", "Noi dung chuyen khoan da duoc sao chep.", "success");
  } catch (err) {
    showPopup("❌ Loi!", "Khong the copy, vui long copy thu cong.", "error");
  }
  document.body.removeChild(textArea);
}

// =============================================
// XAC NHAN NAP TIEN (CHO ADMIN DUYET)
// =============================================

function completeRecharge(rechargeCode, amount) {
  var user = currentUser();
  if (!user) {
    showPopup("Loi", "Vui long đăng nhập!", "error");
    return;
  }

  if (!isCodeValid(rechargeCode)) {
    showPopup("⚠️ Ma da het han!", "Ma nap tien <strong style='color:#ff6b6b;'>" + rechargeCode + "</strong> da het hieu luc sau 10 phut.<br><br>Vui long tao ma moi de nap tien.", "error");
    return;
  }

  var overlay = document.querySelector(".custom-popup-overlay");
  if (overlay) document.body.removeChild(overlay);

  var pendingApprovals = getPendingApprovals();
  pendingApprovals.push({
    code: rechargeCode,
    username: user.name,
    amount: amount,
    time: new Date().toLocaleString('vi-VN'),
    status: 'pending'
  });
  localStorage.setItem('pendingApprovals', JSON.stringify(pendingApprovals));

  showPopup(
    "⏳ Cho admin xac nhan!",
    "Ban da gui yeu cau nap <strong style='color:#ff59e8;'>" + money(amount) + "</strong>.<br><br>📌 Ma giao dich: <strong style='color:#ffd43b;'>" + rechargeCode + "</strong><br><br>⏳ Vui long doi admin xac nhan chuyen khoan.<br>💰 So du se duoc cap nhat sau khi admin duyet.",
    "success"
  );
}

// =============================================
// HE THONG DANG NHAP
// =============================================

function initUsers() {
  if (!localStorage.getItem("shopCuaManhUsers")) {
    localStorage.setItem("shopCuaManhUsers", JSON.stringify(defaultUsers));
    console.log("Da tao tai khoan mac dinh!");
  }
}

function getUsers() {
  var data = localStorage.getItem("shopCuaManhUsers");
  if (data) {
    try { return JSON.parse(data); } catch(e) { return []; }
  }
  return [];
}

function saveUsers(users) {
  localStorage.setItem("shopCuaManhUsers", JSON.stringify(users));
}

function currentUser() {
  var data = localStorage.getItem("shopCuaManhCurrentUser");
  if (data) {
    try { return JSON.parse(data); } catch(e) { return null; }
  }
  return null;
}

function setCurrentUser(user) {
  localStorage.setItem("shopCuaManhCurrentUser", JSON.stringify(user));
}

function removeCurrentUser() {
  localStorage.removeItem("shopCuaManhCurrentUser");
}

// =============================================
// CAP NHAT SO DU TREN HEADER
// =============================================

function updateBalanceUI() {
  var balanceEl = document.getElementById("userBalance");
  if (!balanceEl) {
    var navActions = document.querySelector(".nav-actions");
    if (navActions) {
      var authBtn = document.getElementById("openLoginBtn");
      if (authBtn) {
        balanceEl = document.createElement("span");
        balanceEl.id = "userBalance";
        balanceEl.style.cssText = "color:#51cf66;font-weight:bold;font-size:13px;margin-right:6px;display:none;";
        balanceEl.textContent = "0d";
        navActions.insertBefore(balanceEl, authBtn);
      }
    }
  }
  
  if (!balanceEl) return;
  
  var user = currentUser();
  if (user) {
    var balance = getUserBalance(user.name);
    balanceEl.textContent = money(balance);
    balanceEl.style.display = "inline";
    console.log("✅ So du da duoc cap nhat: " + money(balance));
  } else {
    balanceEl.style.display = "none";
  }
}

// =============================================
// NAP TIEN
// =============================================

function recharge() {
  var user = currentUser();
  if (!user) {
    showPopup("Thong bao", "Vui long dang nhap de nap tien!", "error", function() {
      openLogin();
    });
    return;
  }

  showRechargeOptions();
}

function showRechargeOptions() {
  var user = currentUser();
  if (!user) return;

  var amounts = [10000, 20000, 50000, 100000, 200000, 500000];
  
  var overlay = document.createElement("div");
  overlay.className = "custom-popup-overlay";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    backdrop-filter: blur(8px);
    animation: popupFadeIn 0.3s ease;
  `;

  var modal = document.createElement("div");
  modal.style.cssText = `
    background: linear-gradient(145deg, #0b0d3b, #03051d);
    border: 1px solid #833cff;
    border-radius: 20px;
    padding: 24px;
    max-width: 420px;
    width: 92%;
    text-align: center;
    box-shadow: 0 0 50px rgba(112,30,255,0.5);
    animation: popupScaleIn 0.3s ease;
  `;

  var html = '<div style="font-size:40px;margin-bottom:6px;">💰</div>';
  html += '<h2 style="color:white;margin:0 0 4px;font-size:20px;">Chon so tien nap</h2>';
  html += '<p style="color:#b0b8e0;margin:0 0 16px;font-size:13px;">Chon muc tien ban muon nap vao vi</p>';
  html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">';
  
  for (var i = 0; i < amounts.length; i++) {
    html += '<button onclick="selectRechargeAmount(' + amounts[i] + ')" style="';
    html += 'padding:12px;background:linear-gradient(135deg,#6a3fff,#a855f7);border:none;border-radius:12px;color:white;font-size:15px;font-weight:bold;cursor:pointer;transition:0.3s;';
    html += '" onmouseover="this.style.transform=\'scale(1.05)\'" onmouseout="this.style.transform=\'scale(1)\'">';
    html += money(amounts[i]);
    html += '</button>';
  }
  
  html += '</div>';
  html += '<button onclick="closePopupOverlay(this)" style="';
  html += 'width:100%;padding:10px;background:transparent;color:#888;border:1px solid #4e3aa2;border-radius:12px;font-size:14px;cursor:pointer;';
  html += '">❌ Dong</button>';

  modal.innerHTML = html;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  overlay.onclick = function(e) {
    if (e.target === overlay) {
      document.body.removeChild(overlay);
    }
  };
}

function closePopupOverlay(btn) {
  var overlay = btn.closest(".custom-popup-overlay");
  if (overlay) document.body.removeChild(overlay);
}

function selectRechargeAmount(amount) {
  var overlay = document.querySelector(".custom-popup-overlay");
  if (overlay) document.body.removeChild(overlay);

  var user = currentUser();
  if (!user) return;

  cleanExpiredCodes();

  var rechargeCode = generateRechargeCode();
  savePendingCode(rechargeCode, amount);
  
  showRechargePopup(rechargeCode, amount);
}

// =============================================
// DANG NHAP / DANG KY - UI
// =============================================

var loginModal = $("loginModal");
var openLoginBtn = $("openLoginBtn");
var closeLoginBtn = $("closeLoginBtn");
var closeLoginBackdrop = $("closeLoginBackdrop");
var authForm = $("authForm");
var authTitle = $("authTitle");
var authSubtitle = $("authSubtitle");
var authSubmit = $("authSubmit");
var switchAuthBtn = $("switchAuthBtn");
var loginFields = $("loginFields");
var registerFields = $("registerFields");
var loginNameInput = $("loginNameInput");
var loginPasswordInput = $("loginPasswordInput");
var registerNameInput = $("registerNameInput");
var registerPasswordInput = $("registerPasswordInput");
var registerConfirmInput = $("registerConfirmInput");
var authMessage = $("authMessage");
var loginLabel = $("loginLabel");
var logoutBtn = $("logoutBtn");

var registerMode = false;

function updateAuthFieldsState() {
  loginNameInput.disabled = registerMode;
  loginPasswordInput.disabled = registerMode;
  registerNameInput.disabled = !registerMode;
  registerPasswordInput.disabled = !registerMode;
  registerConfirmInput.disabled = !registerMode;
}

function openLogin() {
  var user = currentUser();
  if (user) {
    authForm.hidden = true;
    switchAuthBtn.hidden = true;
    logoutBtn.hidden = false;
    loginFields.hidden = true;
    registerFields.hidden = true;
    authMessage.textContent = "Xin chao: " + user.name;
    authMessage.style.color = "#ffd43b";
  } else {
    authForm.hidden = false;
    switchAuthBtn.hidden = false;
    logoutBtn.hidden = true;
    loginFields.hidden = registerMode;
    registerFields.hidden = !registerMode;
    authMessage.textContent = "";
  }
  loginModal.classList.add("open");
}

function closeLogin() {
  loginModal.classList.remove("open");
  authMessage.textContent = "";
  authForm.hidden = false;
  switchAuthBtn.hidden = false;
  logoutBtn.hidden = true;
  updateAuthFieldsState();
}

function updateAuthUI() {
  var user = currentUser();

  if (user) {
    loginLabel.textContent = user.name;
  } else {
    loginLabel.textContent = "Dang nhap";
  }

  authTitle.textContent = registerMode ? "Tao tai khoan" : "Dang nhap";
  authSubtitle.textContent = registerMode
    ? "Tao tai khoan de luu thong tin mua hang"
    : "Dang nhap de tiep tuc mua hang";
  authSubmit.textContent = registerMode ? "Dang ky" : "Dang nhap";
  loginFields.hidden = registerMode;
  registerFields.hidden = !registerMode;
  switchAuthBtn.innerHTML = registerMode
    ? 'Da co tai khoan? <b>Dang nhap</b>'
    : 'Chua co tai khoan? <b>Dang ky</b>';

  updateAuthFieldsState();
  updateBalanceUI();
}

openLoginBtn.addEventListener("click", openLogin);
closeLoginBtn.addEventListener("click", closeLogin);
closeLoginBackdrop.addEventListener("click", closeLogin);

switchAuthBtn.addEventListener("click", function() {
  registerMode = !registerMode;
  authMessage.textContent = "";
  authForm.hidden = false;
  logoutBtn.hidden = true;
  authForm.reset();
  updateAuthUI();
});

authForm.addEventListener("submit", function(e) {
  e.preventDefault();

  if (registerMode) {
    var name = registerNameInput.value.trim();
    var password = registerPasswordInput.value;
    var confirm = registerConfirmInput.value;

    if (!name || !password || !confirm) {
      authMessage.textContent = "Vui long nhap day du thong tin.";
      authMessage.style.color = "#ff6b6b";
      return;
    }
    if (password.length < 4) {
      authMessage.textContent = "Mat khau phai co it nhat 4 ky tu.";
      authMessage.style.color = "#ff6b6b";
      return;
    }
    if (password !== confirm) {
      authMessage.textContent = "Mat khau xac minh khong khop!";
      authMessage.style.color = "#ff6b6b";
      return;
    }

    var users = getUsers();
    for (var i = 0; i < users.length; i++) {
      if (users[i].name.toLowerCase() === name.toLowerCase()) {
        authMessage.textContent = "Ten hien thi nay da ton tai.";
        authMessage.style.color = "#ff6b6b";
        return;
      }
    }

    users.push({ name: name, password: password });
    saveUsers(users);
    
    if (!localStorage.getItem("shopCuaManhBalance_" + name)) {
      setUserBalance(name, 0);
    }

    registerMode = false;
    loginNameInput.value = name;
    loginPasswordInput.value = "";
    registerNameInput.value = "";
    registerPasswordInput.value = "";
    registerConfirmInput.value = "";

    authMessage.textContent = "Dang ky thanh cong! Hay nhap mat khau de dang nhap.";
    authMessage.style.color = "#51cf66";
    updateAuthUI();

    setTimeout(function() {
      loginPasswordInput.focus();
    }, 100);
  } else {
    var name = loginNameInput.value.trim();
    var password = loginPasswordInput.value;

    if (!name || !password) {
      authMessage.textContent = "Vui long nhap ten hien thi va mat khau.";
      authMessage.style.color = "#ff6b6b";
      return;
    }

    var users = getUsers();
    var user = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].name.toLowerCase() === name.toLowerCase() &&
          users[i].password === password) {
        user = users[i];
        break;
      }
    }

    if (!user) {
      authMessage.textContent = "Sai ten hien thi hoac mat khau.";
      authMessage.style.color = "#ff6b6b";
      return;
    }

    setCurrentUser({ name: user.name });
    authMessage.textContent = "Dang nhap thanh cong!";
    authMessage.style.color = "#51cf66";
    updateAuthUI();

    setTimeout(function() {
      closeLogin();
      authForm.reset();
      showPopup("Chao mung! 🎉", "Chao mung <strong>" + user.name + "</strong> quay tro lai!", "success");
    }, 500);
  }
});

logoutBtn.addEventListener("click", function() {
  showPopup("Xac nhan dang xuat", "Ban co chac muon dang xuat?", "confirm", function(result) {
    if (result) {
      removeCurrentUser();
      authForm.hidden = false;
      switchAuthBtn.hidden = false;
      logoutBtn.hidden = true;
      registerMode = false;
      authForm.reset();
      authMessage.textContent = "Da dang xuat.";
      authMessage.style.color = "#ffd43b";
      updateAuthUI();
      showPopup("Da dang xuat", "Ban da dang xuat thanh cong!", "success");
    }
  });
});

// =============================================
// MODAL LIEN HE
// =============================================

function openContact() {
  var modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  }
  return false;
}

function closeContact() {
  var modal = document.getElementById('contactModal');
  if (modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
}

// =============================================
// HIEU UNG MUA
// =============================================

var canvas = $("rainCanvas");
if (canvas) {
  var ctx = canvas.getContext("2d");
  var drops = [];
  var w = window.innerWidth, h = window.innerHeight;
  canvas.width = w; canvas.height = h;
  for (var i = 0; i < 120; i++) {
    drops.push({ x: Math.random() * w, y: Math.random() * h, speed: 3 + Math.random() * 5, len: 10 + Math.random() * 15, opacity: 0.1 + Math.random() * 0.3 });
  }
  function drawRain() {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < drops.length; i++) {
      var d = drops[i];
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - 2, d.y + d.len);
      ctx.strokeStyle = "rgba(130,185,255," + d.opacity + ")";
      ctx.lineWidth = 1;
      ctx.stroke();
      d.y += d.speed;
      if (d.y > h) { d.y = -d.len; d.x = Math.random() * w; }
    }
    requestAnimationFrame(drawRain);
  }
  drawRain();
  window.addEventListener("resize", function() {
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w; canvas.height = h;
  });
}

// =============================================
// THEM NUT NAP TIEN + LICH SU + SO DU
// =============================================

function addNavButtons() {
  var navActions = document.querySelector(".nav-actions");
  if (!navActions) return;
  
  if (document.getElementById("rechargeBtn")) return;
  
  var balanceSpan = document.createElement("span");
  balanceSpan.id = "userBalance";
  balanceSpan.style.cssText = "color:#51cf66;font-weight:bold;font-size:13px;margin-right:6px;display:none;";
  balanceSpan.textContent = "0d";
  
  var rechargeBtn = document.createElement("button");
  rechargeBtn.className = "login-top";
  rechargeBtn.id = "rechargeBtn";
  rechargeBtn.type = "button";
  rechargeBtn.style.cssText = "border-color:#ff59e8;";
  rechargeBtn.innerHTML = '💰 <span id="rechargeLabel">Nap tien</span>';
  rechargeBtn.onclick = recharge;
  
  var historyBtn = document.createElement("button");
  historyBtn.className = "login-top";
  historyBtn.id = "historyBtn";
  historyBtn.type = "button";
  historyBtn.style.cssText = "border-color:#3b82f6;";
  historyBtn.innerHTML = '📋 <span id="historyLabel">Lich su</span>';
  historyBtn.onclick = getUserHistory;
  
  var authBtn = document.getElementById("openLoginBtn");
  if (authBtn) {
    navActions.insertBefore(balanceSpan, authBtn);
    navActions.insertBefore(rechargeBtn, authBtn);
    navActions.insertBefore(historyBtn, authBtn);
  }
}

// =============================================
// KHOI CHAY
// =============================================

document.addEventListener("DOMContentLoaded", function() {
  initUsers();
  
  filterProducts('all');
  
  updateAuthUI();
  updateAuthFieldsState();
  addNavButtons();
  
  setTimeout(function() {
    updateBalanceUI();
  }, 100);
  
  var searchInput = $("searchInput");
  var searchBtn = $("searchBtn");
  if (searchInput) searchInput.addEventListener("input", searchProducts);
  if (searchBtn) searchBtn.addEventListener("click", searchProducts);
  
  var closeContactBtn = document.getElementById('closeContactBtn');
  var closeContactBackdrop = document.getElementById('closeContactBackdrop');
  if (closeContactBtn) {
    closeContactBtn.addEventListener('click', closeContact);
  }
  if (closeContactBackdrop) {
    closeContactBackdrop.addEventListener('click', closeContact);
  }
  
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      closeLogin();
      closeContact();
      var popup = document.querySelector(".custom-popup-overlay");
      if (popup) document.body.removeChild(popup);
    }
  });
  
  setInterval(function() {
    cleanExpiredCodes();
  }, 30000);
  
  console.log("Shop Cua Manh da san sang!");
  console.log("Tai khoan mac dinh:");
});