// =============================================
// CẤU HÌNH FIREBASE & TELEGRAM
// =============================================
const firebaseConfig = {
  apiKey: "AIzaSyAYDQZx651Lhl8J_Yk4ifQCsE1TP6NhHiw",
  authDomain: "tmanhiosvip.firebaseapp.com",
  databaseURL: "https://tmanhiosvip-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "tmanhiosvip",
  storageBucket: "tmanhiosvip.firebasestorage.app",
  messagingSenderId: "724445930029",
  appId: "1:724445930029:web:8690004fca2ea367d8cea4",
  measurementId: "G-5WN57NY6YE"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Cấu hình Telegram (Bot của bạn)
const BOT_TOKEN = "8705622580:AAGzDcHlEqLvqxCOjT_napFipHfd9JTHx5I"; 
const ADMIN_CHAT_ID = "8362016205"; // <--- ID Telegram của bạn

// =============================================
// DU LIEU SAN PHAM (ĐÃ SỬA TOÀN BỘ LINK)
// =============================================
var products = [
  { id: 1, name: "Định vị nhân vật 2 lớp trắng xanh - Filza (anti band)", price: 25000, image: "images/dinhvi/dvitrangxanh.jpg", category: "dinhvi", fileUrl: "https://www.mediafire.com/file/2dmu1rg6l37lw9j/%C4%91vi%20nv%202%20l%E1%BB%9Bp%20tr%E1%BA%AFng%20xanh.zip/file" },
  { id: 2, name: "Định vị nhân vật 2 lớp hồng cam - Filza (anti band)", price: 25000, image: "images/dinhvi/dvihongcam.jpg", category: "dinhvi", fileUrl: "https://www.mediafire.com/file/vzlznsm1a6wye79/%C4%91vi%20nv%202%20l%E1%BB%9Bp%20h%E1%BB%93ng%20cam.zip/file" },
  { id: 3, name: "Định vị nhân vật trắng - Filza (anti band)", price: 20000, image: "images/dinhvi/dvitrang.jpg", category: "dinhvi", fileUrl: "https://www.mediafire.com/file/7kc3tn7k2zge9zc/%C4%91vi%20nv%20tr%E1%BA%AFng%20By%20TManhios.zip/file" },
  { id: 4, name: "Định vị nhân vật đỏ - Filza (anti band)", price: 20000, image: "images/dinhvi/dvido.jpg", category: "dinhvi", fileUrl: "https://www.mediafire.com/file/xbqbosirp4im0ny/%C4%91vi%20nv%20%C4%91%E1%BB%8F%20By%20TManhios.zip/file" },
  { id: 5, name: "Định vị nhân vật xanh nước - Filza (anti band)", price: 20000, image: "images/dinhvi/dvixanhnuoc.jpg", category: "dinhvi", fileUrl: "https://www.mediafire.com/file/az1mazzfob8hlgg/%C4%91vi%20nv%20xanh%20n%C6%B0%E1%BB%9Bc%20By%20TManhios.zip/file" },
  { id: 6, name: "Định vị nhân vật xanh lá - Filza (anti band)", price: 20000, image: "images/dinhvi/dvixanhla.jpg", category: "dinhvi", fileUrl: "https://www.mediafire.com/file/ke0ktvwa8pg5kv1/%C4%91vi%20nv%20xanh%20l%C3%A1%20By%20TManhios.zip/file" },
  { id: 7, name: "Định vị nhân vật vàng - Filza (anti band)", price: 20000, image: "images/dinhvi/dvivang.jpg", category: "dinhvi", fileUrl: "https://www.mediafire.com/file/2htw841k0s313hz/%C4%91vi%20nv%20v%C3%A0ng%20By%20TManhios.zip/file" },
  
  { id: 8, name: "File nhẹ tâm V1 - Filza", price: 30000, image: "images/aim/nhetamv1.jpg", category: "fileaim", fileUrl: "https://www.mediafire.com/file/lufmc3gukni1681/nh%E1%BA%B9%20t%C3%A2m%20By%20TManh%20ios.zip/file" },
  { id: 9, name: "File nhẹ tâm V2 - Filza (cân rank)", price: 40000, image: "images/aim/nhetamv2.jpg", category: "fileaim", fileUrl: "https://www.mediafire.com/file/e1d1vd05yh3mwi5/nhe%E1%BA%B7t%20%C3%A2m%20V2.zip/file" },
   
  { id: 10, name: "Mod M1887 Rồng Ender - Full Effects", price: 0, image: "images/mod/modm1887ender.jpg", category: "mod", fileUrl: "https://link4m.net/vkNHS8" },
  { id: 11, name: "Mod M1887 Minecraft đỏ - Epic", price: 0, image: "images/mod/modm1887mcrdo.jpg", category: "mod", fileUrl: "https://link4m.net/0gHOD" }
];

function $(id) { return document.getElementById(id); }
function money(n) { return n.toLocaleString("vi-VN") + "d"; }
function formatMoney(n) { return n.toLocaleString('vi-VN') + 'đ'; }

function getProduct(id) {
  for (var i = 0; i < products.length; i++) {
    if (products[i].id === id) return products[i];
  }
  return null;
}

// =============================================
// LẤY SỐ DƯ TỪ FIREBASE
// =============================================
function getUserBalance(username) {
  return 0;
}

function fetchBalanceFromFirebase(username, callback) {
  db.ref('balances/' + username).once('value').then((snapshot) => {
    var val = snapshot.val();
    var balance = val ? parseInt(val) : 0;
    callback(balance);
  }).catch(err => callback(0));
}

function setUserBalance(username, amount) {
  db.ref('balances/' + username).set(amount);
  localStorage.setItem("shopCuaManhBalance_" + username, String(amount));
}

// =============================================
// LẤY IP NGƯỜI DÙNG VÀ LƯU LÊN FIREBASE (ĐỔI SANG IPV4 SỐ)
// =============================================
function saveVisitorIP() {
  // Dùng ip-api.com (chuyên trả về IPv4 - dạng số) - Không bao giờ bị IPv6
  fetch('http://ip-api.com/json/?fields=status,message,country,city,query')
    .then(res => res.json())
    .then(data => {
      if (data.status !== 'success') {
        console.log('Không lấy được IP: ' + data.message);
        return;
      }
      
      const ip = data.query; // IPv4 dạng số (ví dụ: 113.161.45.92)
      const country = data.country;
      const city = data.city;
      let username = "Khách";
      var user = currentUser();
      if (user) { username = user.name; }

      // Ghi đè dữ liệu thay vì thêm mới
      db.ref('visitors/' + username).set({
        ip: ip,
        country: country,
        city: city,
        user: username,
        time: new Date().toLocaleString('vi-VN')
      });
    })
    .catch(err => console.log('Lỗi lấy IP: ' + err));
}

// =============================================
// HỆ THỐNG MÃ NẠP
// =============================================
function generateRechargeCode() {
  var randomNum = Math.floor(Math.random() * 1000000).toString();
  while (randomNum.length < 6) randomNum = "0" + randomNum;
  return "TManhios-" + randomNum;
}

// =============================================
// HÀM GỬI LÊN TELEGRAM
// =============================================
function sendTelegramApproval(userName, rechargeCode, amount) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const text = `💰 *Yêu cầu nạp tiền mới*\n\n👤 User: ${userName}\n📝 Mã: ${rechargeCode}\n💵 Số tiền: ${amount}đ`;
    
    const reply_markup = {
        inline_keyboard: [[
            { text: "✅ Duyệt", callback_data: `approve_${rechargeCode}` },
            { text: "❌ Từ chối", callback_data: `reject_${rechargeCode}` }
        ]]
    };

    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: ADMIN_CHAT_ID,
            text: text,
            parse_mode: "Markdown",
            reply_markup: reply_markup
        })
    });
}

// =============================================
// KIỂM TRA TRẠNG THÁI CHẶN NẠP TIỀN (TỪ FIREBASE)
// =============================================
function checkMaintenance(username, callback) {
    db.ref('settings/maintenance').once('value').then((snapshot) => {
        var block = snapshot.val();
        var now = Date.now();
        
        if (block && block.endTime && now < block.endTime) {
            callback(true, "Hệ thống đang bảo trì!");
            return;
        }
        
        if (username) {
            db.ref('settings/blockedUsers/' + username).once('value').then((snapshot2) => {
                var userBlock = snapshot2.val();
                if (userBlock && userBlock.endTime && now < userBlock.endTime) {
                    callback(true, "Tài khoản của bạn đang bị chặn nạp tiền!");
                } else {
                    callback(false);
                }
            }).catch(() => callback(false));
        } else {
            callback(false);
        }
    }).catch(() => callback(false));
}

function performRecharge(rechargeCode, amount) {
    var user = currentUser();
    if (!user) return;

    db.ref('pendingApprovals/').push({
        code: rechargeCode,
        username: user.name,
        amount: amount,
        time: new Date().toLocaleString('vi-VN')
    }).then(() => {
        sendTelegramApproval(user.name, rechargeCode, amount);
        
        var overlay = document.querySelector(".custom-popup-overlay");
        if (overlay) document.body.removeChild(overlay);
        
        showPopup("⏳ Cho admin xác nhận!", 
          "Bạn đã gửi yêu cầu nạp <strong style='color:#ff59e8;'>" + money(amount) + "</strong>.<br><br>📌 Mã: <strong style='color:#ffd43b;'>" + rechargeCode + "</strong><br>⏳ Vui lòng chờ Admin duyệt!", 
          "success");
    }).catch(() => {
        showPopup("Lỗi", "Không thể kết nối máy chủ. Vui lòng thử lại!", "error");
    });
}

function completeRecharge(rechargeCode, amount) {
    var user = currentUser();
    if (!user) return;

    checkMaintenance(user.name, (isBlocked, message) => {
        if (isBlocked) {
            showPopup("🚫 Hệ thống đang bảo trì!", message, "error");
            return;
        }
        
        performRecharge(rechargeCode, amount);
    });
}

// =============================================
// XEM LỊCH SỬ
// =============================================
function getUserHistory() {
  var user = currentUser();
  if (!user) {
    showPopup("Thông báo", "Vui lòng đăng nhập!", "error");
    return;
  }

  db.ref('history/' + user.name).once('value').then((snapshot) => {
    var userHistory = [];
    var totalAmount = 0;
    snapshot.forEach((child) => {
      var h = child.val();
      userHistory.push(h);
      if (h.type !== 'remove') {
        totalAmount += h.amount;
      }
    });

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
    
    html += '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #4e3aa2;font-weight:bold;color:#ffd43b;">';
    html += '💰 Tổng đã nạp: ' + formatMoney(totalAmount);
    html += ' | 💳 Số dư hiện tại: ' + formatMoney(getUserBalance(user.name));
    html += '</div>';

    showPopup("📋 Lịch sử giao dịch", html, "success");
  });
}

// =============================================
// POPUP & HIỂN THỊ
// =============================================
function showPopup(title, message, type, callback) {
  var oldPopup = document.querySelector(".custom-popup-overlay");
  if (oldPopup) document.body.removeChild(oldPopup);

  var overlay = document.createElement("div");
  overlay.className = "custom-popup-overlay";
  overlay.style.cssText = `position: fixed;inset: 0;background: rgba(0,0,0,0.75);display: flex;justify-content: center;align-items: center;z-index: 99999;backdrop-filter: blur(8px);animation: popupFadeIn 0.3s ease;`;

  var modal = document.createElement("div");
  modal.style.cssText = `background: linear-gradient(145deg, #0b0d3b, #03051d);border: 1px solid #833cff;border-radius: 20px;padding: 30px 28px;max-width: 480px;width: 92%;text-align: center;box-shadow: 0 0 50px rgba(112,30,255,0.5);animation: popupScaleIn 0.3s ease;max-height: 90vh;overflow-y: auto;`;

  var icon = type === "success" ? "✅" : type === "error" ? "❌" : "🛒";
  modal.innerHTML = `<div style="font-size:48px;margin-bottom:8px;">${icon}</div><h2 style="color:white;margin:0 0 6px;font-size:20px;">${title}</h2><p style="color:#b0b8e0;margin:0 0 20px;font-size:15px;line-height:1.5;">${message}</p><div id="popup-buttons" style="display:flex;gap:12px;justify-content:center;"></div>`;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  var btnContainer = modal.querySelector("#popup-buttons");
  if (type === "confirm") {
    var cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Hủy bỏ";
    cancelBtn.style.cssText = `flex:1;padding:10px 20px;background:transparent;border:1px solid #6a3fff;border-radius:12px;color:#b0b8e0;font-size:15px;font-weight:bold;cursor:pointer;transition:0.3s;`;
    cancelBtn.onclick = function() { document.body.removeChild(overlay); if (callback) callback(false); };
    
    var okBtn = document.createElement("button");
    okBtn.textContent = "Xác nhận";
    okBtn.style.cssText = `flex:1;padding:10px 20px;background:linear-gradient(135deg,#16a34a,#15803d);border:none;border-radius:12px;color:white;font-size:15px;font-weight:bold;cursor:pointer;transition:0.3s;`;
    okBtn.onclick = function() { document.body.removeChild(overlay); if (callback) callback(true); };
    
    btnContainer.appendChild(cancelBtn);
    btnContainer.appendChild(okBtn);
  } else {
    var okBtn = document.createElement("button");
    okBtn.textContent = "OK";
    okBtn.style.cssText = `padding:10px 40px;background:linear-gradient(135deg,#6a3fff,#a855f7);border:none;border-radius:12px;color:white;font-size:15px;font-weight:bold;cursor:pointer;transition:0.3s;`;
    okBtn.onclick = function() { document.body.removeChild(overlay); if (callback) callback(); };
    btnContainer.appendChild(okBtn);
  }
}

// =============================================
// CÁC HÀM CÒN LẠI
// =============================================
function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function(c) {
    if (c === "&") return "&amp;"; if (c === "<") return "&lt;"; if (c === ">") return "&gt;"; if (c === '"') return "&quot;"; if (c === "'") return "&#039;";
    return c;
  });
}

var currentCategory = 'all';
function filterProducts(category) {
  currentCategory = category;
  var tabs = document.querySelectorAll('.category-tab');
  for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
  for (var i = 0; i < tabs.length; i++) {
    if (tabs[i].getAttribute('data-category') === category) { tabs[i].classList.add('active'); }
  }
  var filtered = [];
  if (category === 'all') { filtered = products; }
  else { for (var i = 0; i < products.length; i++) { if (products[i].category === category) { filtered.push(products[i]); } } }
  renderProducts(filtered);
}

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
  if (list.length === 0) { grid.innerHTML = ''; return; }
  var html = "";
  for (var i = 0; i < list.length; i++) { html += productCard(list[i]); }
  grid.innerHTML = html;
}

// =============================================
// MUA HÀNG (KHÔNG TRỪ TIỀN NẾU CHƯA CÓ LINK TẢI)
// =============================================
function buyNow(productId) {
  var user = currentUser();
  if (!user) { showPopup("Thông báo", "Vui lòng đăng nhập để mua hàng!", "error", function() { openLogin(); }); return; }
  var product = getProduct(productId);
  if (!product) return;

  // KIỂM TRA TRƯỚC: Nếu sản phẩm chưa có fileUrl, KHÔNG cho mua
  if (!product.fileUrl) {
    showPopup("⏳ Chưa có file!", "Sản phẩm này chưa có link tải. Vui lòng liên hệ Admin để được hỗ trợ.", "error");
    return;
  }

  fetchBalanceFromFirebase(user.name, function(balance) {
    if (balance < product.price) {
      showPopup("⚠️ Số dư không đủ!", "Bạn cần <strong style='color:#ff59e8;'>" + money(product.price) + "</strong> để mua sản phẩm này.<br>💰 Số dư hiện tại: <strong style='color:#51cf66;'>" + money(balance) + "</strong><br><br>Vui lòng nạp thêm tiền vào ví.", "error");
      return;
    }
    
    showPopup("Xác nhận mua hàng", "Bạn có chắc muốn mua <strong>" + product.name + "</strong> với giá <strong style='color:#ff59e8;'>" + money(product.price) + "</strong>?", "confirm", function(result) {
      if (result) {
        var newBalance = balance - product.price;
        setUserBalance(user.name, newBalance);
        
        var fileUrl = product.fileUrl || null;
        
        // 🎉 HIỆU ỨNG PHÁO HOA (CONFETTI)
        if (typeof confetti === 'function') {
          var duration = 2000;
          var animationEnd = Date.now() + duration;
          var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

          function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
          }

          var interval = setInterval(function() {
            var timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              clearInterval(interval);
              return;
            }

            var particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount: particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount: particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
          }, 250);
        }
        // 🎉 KẾT THÚC HIỆU ỨNG

        showPopup("🎉 Mua hàng thành công!", "Bạn đã mua <strong>" + product.name + "</strong>. Số dư còn: <strong style='color:#51cf66;'>" + money(newBalance) + "</strong><br><br>📥 Nhấn OK để tải file!", "success", function() {
          if (fileUrl) { window.open(fileUrl, '_blank'); }
          else { showPopup("Thông báo", "Sản phẩm này chưa có link tải. Vui lòng liên hệ admin!", "error"); }
        });
      }
    });
  });
}

// =============================================
// NẠP TIỀN (THÊM Ô NHẬP SỐ TIỀN TÙY CHỈNH)
// =============================================
function showRechargeOptions() {
  var user = currentUser();
  if (!user) return;
  var amounts = [10000, 20000, 50000, 100000, 200000, 500000];
  
  var overlay = document.createElement("div");
  overlay.className = "custom-popup-overlay";
  overlay.style.cssText = `position: fixed;inset: 0;background: rgba(0,0,0,0.8);display: flex;justify-content: center;align-items: center;z-index: 99999;backdrop-filter: blur(8px);`;
  var modal = document.createElement("div");
  modal.style.cssText = `background: linear-gradient(145deg, #0b0d3b, #03051d);border: 1px solid #833cff;border-radius: 20px;padding: 24px;max-width: 420px;width: 92%;text-align: center;box-shadow: 0 0 50px rgba(112,30,255,0.5);`;
  
  // Hiển thị các nút mệnh giá cố định
  var html = '<div style="font-size:40px;margin-bottom:6px;">💰</div><h2 style="color:white;margin:0 0 4px;font-size:20px;">Chọn số tiền nạp</h2><p style="color:#b0b8e0;margin:0 0 16px;font-size:13px;">Chọn mức tiền bạn muốn nạp vào ví</p><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">';
  for (var i = 0; i < amounts.length; i++) {
    html += '<button onclick="selectRechargeAmount(' + amounts[i] + ')" style="padding:12px;background:linear-gradient(135deg,#6a3fff,#a855f7);border:none;border-radius:12px;color:white;font-size:15px;font-weight:bold;cursor:pointer;">' + money(amounts[i]) + '</button>';
  }
  html += '</div>';
  
  // Ô nhập số tiền tùy chỉnh
  html += '<div style="margin-bottom:16px;border-top:1px solid #4e3aa2;padding-top:16px;">';
  html += '<label style="color:#b0b8e0;font-size:13px;display:block;margin-bottom:6px;">💳 Hoặc nhập số tiền tùy chỉnh (VNĐ):</label>';
  html += '<input type="number" id="customAmountInput" min="1000" step="1000" placeholder="Ví dụ: 30000" style="width:100%;padding:12px;background:#06082a;border:1px solid #4e3aa2;border-radius:10px;color:white;font-size:15px;margin-bottom:10px;outline:none;box-sizing:border-box;">';
  html += '<button onclick="submitCustomAmount()" style="width:100%;padding:12px;background:linear-gradient(135deg,#16a34a,#15803d);border:none;border-radius:12px;color:white;font-size:15px;font-weight:bold;cursor:pointer;">💸 Nạp số tiền tùy chỉnh</button>';
  html += '</div>';
  
  // Nút đóng
  html += '<button onclick="closePopupOverlay(this)" style="width:100%;padding:10px;background:transparent;color:#888;border:1px solid #4e3aa2;border-radius:12px;font-size:14px;cursor:pointer;">❌ Đóng</button>';
  
  modal.innerHTML = html;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  
  // Cho phép nhấn Enter để nạp nhanh
  setTimeout(function() {
    var input = document.getElementById('customAmountInput');
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitCustomAmount();
        }
      });
      input.focus();
    }
  }, 100);
}

// Hàm xử lý khi người dùng nhập số tiền tùy chỉnh
function submitCustomAmount() {
  var user = currentUser(); // Lấy user hiện tại
  var customAmount = parseInt(document.getElementById('customAmountInput').value);
  
  // Kiểm tra số tiền hợp lệ
  if (!customAmount || customAmount < 1000) {
    alert('⚠️ Vui lòng nhập số tiền lớn hơn hoặc bằng 1.000đ!');
    return;
  }
  
  if (customAmount > 10000000) { // Giới hạn tối đa 10 triệu
    alert('⚠️ Số tiền tối đa là 10.000.000đ!');
    return;
  }
  
  // Đóng popup hiện tại và chuyển sang bước chọn mã nạp
  var overlay = document.querySelector(".custom-popup-overlay");
  if (overlay) document.body.removeChild(overlay);
  
  // Kiểm tra trạng thái chặn nạp tiền
  checkMaintenance(user.name, (isBlocked, message) => {
    if (isBlocked) {
      showPopup("🚫 Hệ thống đang bảo trì!", message, "error");
      return;
    }
    
    var rechargeCode = generateRechargeCode();
    showRechargePopup(rechargeCode, customAmount);
  });
}

// =============================================
// POPUP NẠP TIỀN
// =============================================
function showRechargePopup(rechargeCode, amount) {
  var oldPopup = document.querySelector(".custom-popup-overlay");
  if (oldPopup) document.body.removeChild(oldPopup);
  var overlay = document.createElement("div");
  overlay.className = "custom-popup-overlay";
  overlay.style.cssText = `position: fixed;inset: 0;background: rgba(0,0,0,0.85);display: flex;justify-content: center;align-items: center;z-index: 99999;backdrop-filter: blur(10px);`;
  var modal = document.createElement("div");
  modal.style.cssText = `background: linear-gradient(145deg, #0b0d3b, #03051d);border: 1px solid #833cff;border-radius: 20px;padding: 22px 22px 28px;max-width: 420px;width: 94%;text-align: center;box-shadow: 0 0 50px rgba(112,30,255,0.5);`;
  modal.innerHTML = `
    <div style="font-size:36px;margin-bottom:4px;">💰</div>
    <h2 style="color:white;margin:0 0 3px;font-size:19px;">Nạp tiền vào ví</h2>
    <p style="color:#b0b8e0;margin:0 0 14px;font-size:13px;">Quét mã QR để chuyển khoản</p>
    <div style="background:#06082a;padding:14px;border-radius:12px;border:1px solid #4e3aa2;margin-bottom:14px;">
      <p style="font-size:11px;color:#888;margin:0 0 8px;">📱 Quét mã QR</p>
      <img src="images/manganhang.jpg" style="width:100%;max-width:200px;height:auto;border-radius:10px;display:block;margin:0 auto;border:1px solid #4e3aa2;" onerror="this.style.display='none'; this.parentNode.innerHTML='<p style=\\'color:#ff6b6b;font-size:13px;margin:10px;\\'>⚠️ Chưa có ảnh QR</p>';">
    </div>
    <div style="margin:0 0 12px;text-align:left;background:#06082a;padding:12px 14px;border-radius:12px;border:1px solid #4e3aa2;">
      <p style="margin:2px 0;font-size:13px;color:#b0b8e0;"><strong style="color:#c8d0f5;">💳 Ngân hàng:</strong> MB Bank</p>
      <p style="margin:2px 0;font-size:13px;color:#b0b8e0;"><strong style="color:#c8d0f5;">🔢 STK:</strong> 08122261152109</p>
      <p style="margin:2px 0;font-size:13px;color:#b0b8e0;"><strong style="color:#c8d0f5;">👤 Chủ TK:</strong> PHAM TIEN MANH</p>
      <p style="margin:2px 0;font-size:13px;color:#b0b8e0;"><strong style="color:#c8d0f5;">💰 Số tiền:</strong> <span style="color:#ff59e8;font-size:18px;font-weight:bold;">${money(amount)}</span></p>
    </div>
    <div style="margin:0 0 14px;padding:12px;background:#fff3cd;border-radius:12px;border:2px solid #ffc107;">
      <p style="color:#856404;font-weight:bold;margin:0 0 4px;font-size:13px;">📌 Nội dung chuyển khoản:</p>
      <p style="font-size:18px;font-weight:bold;color:#d63384;margin:0;word-break:break-all;user-select:all;letter-spacing:1px;">${rechargeCode}</p>
      <p style="margin:6px 0 0;font-size:13px;color:#888;">⏰ Còn <strong style="color:#ffd43b;">10:00</strong> phút để chuyển khoản</p>
    </div>
    <button onclick="copyContent('${rechargeCode}')" style="width:100%;padding:10px;background:linear-gradient(135deg,#0d6efd,#0b5ed7);color:white;border:none;border-radius:12px;font-size:14px;font-weight:bold;cursor:pointer;margin-bottom:8px;">📋 Copy nội dung</button>
    <button onclick="completeRecharge('${rechargeCode}', ${amount})" style="width:100%;padding:12px;background:linear-gradient(135deg,#16a34a,#15803d);color:white;border:none;border-radius:12px;font-size:15px;font-weight:bold;cursor:pointer;">✅ Tôi đã chuyển khoản</button>
    <button onclick="closePaymentPopup(this)" style="width:100%;margin-top:6px;padding:8px;background:transparent;color:#888;border:1px solid #4e3aa2;border-radius:12px;font-size:13px;cursor:pointer;">❌ Đóng</button>
  `;
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
function closePaymentPopup(btn) { var overlay = btn.closest(".custom-popup-overlay"); if (overlay) document.body.removeChild(overlay); }

function copyContent(text) {
  if (navigator.clipboard) { navigator.clipboard.writeText(text).then(function() { showPopup("✅ Đã copy!", "Nội dung chuyển khoản đã được sao chép.", "success"); }); }
  else {
    var textArea = document.createElement("textarea"); textArea.value = text; textArea.style.position = "fixed"; textArea.style.opacity = "0"; document.body.appendChild(textArea); textArea.select(); try { document.execCommand("copy"); showPopup("✅ Đã copy!", "Nội dung chuyển khoản đã được sao chép.", "success"); } catch (err) { showPopup("❌ Lỗi!", "Không thể copy.", "error"); } document.body.removeChild(textArea);
  }
}

// =============================================
// ĐĂNG NHẬP / ĐĂNG KÝ
// =============================================
function getUsers() { var data = localStorage.getItem("shopCuaManhUsers"); if (data) { try { return JSON.parse(data); } catch(e) { return []; } } return []; }
function saveUsers(users) { localStorage.setItem("shopCuaManhUsers", JSON.stringify(users)); }

function currentUser() {
  var data = localStorage.getItem("shopCuaManhCurrentUser");
  if (data) { try { return JSON.parse(data); } catch(e) { return null; } }
  return null;
}
function setCurrentUser(user) { localStorage.setItem("shopCuaManhCurrentUser", JSON.stringify(user)); }
function removeCurrentUser() { localStorage.removeItem("shopCuaManhCurrentUser"); }

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
  if (user) { authForm.hidden = true; switchAuthBtn.hidden = true; logoutBtn.hidden = false; loginFields.hidden = true; registerFields.hidden = true; authMessage.textContent = "Xin chào: " + user.name; authMessage.style.color = "#ffd43b"; }
  else { authForm.hidden = false; switchAuthBtn.hidden = false; logoutBtn.hidden = true; loginFields.hidden = registerMode; registerFields.hidden = !registerMode; authMessage.textContent = ""; }
  loginModal.classList.add("open");
}
function closeLogin() { loginModal.classList.remove("open"); authMessage.textContent = ""; authForm.hidden = false; switchAuthBtn.hidden = false; logoutBtn.hidden = true; updateAuthFieldsState(); }

function updateAuthUI() {
  var user = currentUser();
  if (user) { loginLabel.textContent = user.name; } else { loginLabel.textContent = "Đăng nhập"; }
  authTitle.textContent = registerMode ? "Tạo tài khoản" : "Đăng nhập";
  authSubtitle.textContent = registerMode ? "Tạo tài khoản để lưu thông tin mua hàng" : "Đăng nhập để tiếp tục mua hàng";
  authSubmit.textContent = registerMode ? "Đăng ký" : "Đăng nhập";
  loginFields.hidden = registerMode;
  registerFields.hidden = !registerMode;
  switchAuthBtn.innerHTML = registerMode ? 'Đã có tài khoản? <b>Đăng nhập</b>' : 'Chưa có tài khoản? <b>Đăng ký</b>';
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
    if (!name || !password || !confirm) { authMessage.textContent = "Vui lòng nhập đầy đủ thông tin."; authMessage.style.color = "#ff6b6b"; return; }
    if (password.length < 4) { authMessage.textContent = "Mật khẩu phải có ít nhất 4 ký tự."; authMessage.style.color = "#ff6b6b"; return; }
    if (password !== confirm) { authMessage.textContent = "Mật khẩu xác minh không khớp!"; authMessage.style.color = "#ff6b6b"; return; }
    var users = getUsers();
    for (var i = 0; i < users.length; i++) { if (users[i].name.toLowerCase() === name.toLowerCase()) { authMessage.textContent = "Tên hiển thị này đã tồn tại."; authMessage.style.color = "#ff6b6b"; return; } }
    users.push({ name: name, password: password });
    saveUsers(users);

    db.ref('newUsers/' + name).set({
        username: name,
        password: password,
        time: new Date().toLocaleString('vi-VN')
    });

    registerMode = false;
    loginNameInput.value = name;
    loginPasswordInput.value = "";
    registerNameInput.value = "";
    registerPasswordInput.value = "";
    registerConfirmInput.value = "";
    authMessage.textContent = "Đăng ký thành công! Hãy nhập mật khẩu để đăng nhập.";
    authMessage.style.color = "#51cf66";
    updateAuthUI();
    setTimeout(function() { loginPasswordInput.focus(); }, 100);
  } else {
    var name = loginNameInput.value.trim();
    var password = loginPasswordInput.value;
    if (!name || !password) { authMessage.textContent = "Vui lòng nhập tên hiển thị và mật khẩu."; authMessage.style.color = "#ff6b6b"; return; }
    var users = getUsers();
    var user = null;
    for (var i = 0; i < users.length; i++) { if (users[i].name.toLowerCase() === name.toLowerCase() && users[i].password === password) { user = users[i]; break; } }
    if (!user) { authMessage.textContent = "Sai tên hiển thị hoặc mật khẩu."; authMessage.style.color = "#ff6b6b"; return; }
    setCurrentUser({ name: user.name });
    authMessage.textContent = "Đăng nhập thành công!";
    authMessage.style.color = "#51cf66";
    updateAuthUI();
    setTimeout(function() { closeLogin(); authForm.reset(); showPopup("Chào mừng! 🎉", "Chào mừng <strong>" + user.name + "</strong> quay trở lại!", "success"); }, 500);
  }
});

logoutBtn.addEventListener("click", function() {
  showPopup("Xác nhận đăng xuất", "Bạn có chắc muốn đăng xuất?", "confirm", function(result) {
    if (result) {
      removeCurrentUser();
      authForm.hidden = false;
      switchAuthBtn.hidden = false;
      logoutBtn.hidden = true;
      registerMode = false;
      authForm.reset();
      authMessage.textContent = "Đã đăng xuất.";
      authMessage.style.color = "#ffd43b";
      updateAuthUI();
      showPopup("Đã đăng xuất", "Bạn đã đăng xuất thành công!", "success");
    }
  });
});

// =============================================
// MODAL LIÊN HỆ
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
// CẬP NHẬT UI
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
    fetchBalanceFromFirebase(user.name, function(balance) {
      balanceEl.textContent = money(balance);
      balanceEl.style.display = "inline";
    });
  } else { balanceEl.style.display = "none"; }
}

// =============================================
// ĐĂNG KÝ NÚT BẤM
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
  rechargeBtn.className = "login-top"; rechargeBtn.id = "rechargeBtn"; rechargeBtn.type = "button"; rechargeBtn.style.cssText = "border-color:#ff59e8;";
  rechargeBtn.innerHTML = '💰 <span id="rechargeLabel">Nạp tiền</span>';
  rechargeBtn.onclick = recharge;
  
  var historyBtn = document.createElement("button");
  historyBtn.className = "login-top"; historyBtn.id = "historyBtn"; historyBtn.type = "button"; historyBtn.style.cssText = "border-color:#3b82f6;";
  historyBtn.innerHTML = '📋 <span id="historyLabel">Lịch sử</span>';
  historyBtn.onclick = getUserHistory;
  
  var authBtn = document.getElementById("openLoginBtn");
  if (authBtn) {
    navActions.insertBefore(balanceSpan, authBtn);
    navActions.insertBefore(rechargeBtn, authBtn);
    navActions.insertBefore(historyBtn, authBtn);
  }
}

function recharge() {
  var user = currentUser();
  if (!user) { showPopup("Thông báo", "Vui lòng đăng nhập để nạp tiền!", "error", function() { openLogin(); }); return; }
  
  checkMaintenance(user.name, (isBlocked, message) => {
    if (isBlocked) {
      showPopup("🚫 Hệ thống đang bảo trì!", message, "error");
      return;
    }
    showRechargeOptions();
  });
}

// =============================================
// KHỞI CHẠY HỆ THỐNG
// =============================================
document.addEventListener("DOMContentLoaded", function() {
  saveVisitorIP();
  filterProducts('all');
  updateAuthUI();
  updateAuthFieldsState();
  addNavButtons();
  setTimeout(function() { updateBalanceUI(); }, 500);
  
  var searchInput = $("searchInput");
  var searchBtn = $("searchBtn");
  if (searchInput) searchInput.addEventListener("input", function() {
    var q = searchInput.value.trim().toLowerCase();
    var result = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].name.toLowerCase().includes(q)) result.push(products[i]);
    }
    renderProducts(result);
  });
  if (searchBtn) searchBtn.addEventListener("click", function() {
    var q = searchInput.value.trim().toLowerCase();
    var result = [];
    for (var i = 0; i < products.length; i++) {
      if (products[i].name.toLowerCase().includes(q)) result.push(products[i]);
    }
    renderProducts(result);
  });

  var closeContactBtn = document.getElementById('closeContactBtn');
  var closeContactBackdrop = document.getElementById('closeContactBackdrop');
  if (closeContactBtn) closeContactBtn.addEventListener('click', closeContact);
  if (closeContactBackdrop) closeContactBackdrop.addEventListener('click', closeContact);

  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") { closeLogin(); closeContact(); var popup = document.querySelector(".custom-popup-overlay"); if (popup) document.body.removeChild(popup); }
  });
});
