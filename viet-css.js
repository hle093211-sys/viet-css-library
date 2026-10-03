(function () {
  // Từ điển ánh xạ thuộc tính tiếng Việt -> CSS chuẩn
  const CSS_MAP = {
    'màu-chữ': 'color',
    'mau-chu': 'color',
    'màu-nền': 'background-color',
    'mau-nen': 'background-color',
    'kích-thước-chữ': 'font-size',
    'kich-thuoc-chu': 'font-size',
    'độ-dày-chữ': 'font-weight',
    'do-day-chu': 'font-weight',
    'căn-chữ': 'text-align',
    'can-chu': 'text-align',
    'rộng': 'width',
    'rong': 'width',
    'cao': 'height',
    'bo-góc': 'border-radius',
    'bo-goc': 'border-radius',
    'lề-ngoài': 'margin',
    'le-ngoai': 'margin',
    'khoảng-đệm': 'padding',
    'khoang-dem': 'padding',
    'hiển-thị': 'display',
    'hien-thi': 'display'
  };

  // Từ điển ánh xạ giá trị tiếng Việt -> Giá trị CSS chuẩn
  const VALUE_MAP = {
    'đỏ': 'red',
    'do': 'red',
    'xanh-lá': 'green',
    'xanh-la': 'green',
    'xanh-dương': 'blue',
    'xanh-duong': 'blue',
    'vàng': 'yellow',
    'vang': 'yellow',
    'đen': 'black',
    'den': 'black',
    'trắng': 'white',
    'trang': 'white',
    'căn-giữa': 'center',
    'can-giua': 'center',
    'đậm': 'bold',
    'dam': 'bold'
  };

  function parseVietnameseCSS(viCssText) {
    let convertedCss = viCssText;

    // Xử lý hàm bo-4-góc(...) hoặc bo-góc(...) có ngoặc/ngoặc kép
    convertedCss = convertedCss.replace(/bo-4-góc\s*\(?\s*["']?([^"'\)]+)["']?\s*\)?/gi, 'border-radius: $1');

    // Chuyển đổi các thuộc tính tiếng Việt
    for (const [viAttr, enAttr] of Object.entries(CSS_MAP)) {
      const regex = new RegExp(`\\b${viAttr}\\b`, 'gi');
      convertedCss = convertedCss.replace(regex, enAttr);
    }

    // Chuyển đổi các giá trị tiếng Việt
    for (const [viVal, enVal] of Object.entries(VALUE_MAP)) {
      const regex = new RegExp(`:\\s*${viVal}\\b`, 'gi');
      convertedCss = convertedCss.replace(regex, `: ${enVal}`);
    }

    return convertedCss;
  }

  async function loadCustomStyles() {
    // Tìm tất cả các thẻ <link rel="viet-css" href="...">
    const links = document.querySelectorAll('link[rel="viet-css"]');

    for (const link of links) {
      const url = link.getAttribute('href');
      if (!url) continue;

      try {
        const response = await fetch(url);
        const text = await response.text();

        // Chuyển mã tiếng Việt sang CSS chuẩn
        const compiledCss = parseVietnameseCSS(text);

        // Chèn trực tiếp vào thẻ <style> trên trang
        const styleTag = document.createElement('style');
        styleTag.textContent = compiledCss;
        document.head.appendChild(styleTag);
      } catch (err) {
        console.error('Lỗi khi tải VietCSS từ ' + url, err);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCustomStyles);
  } else {
    loadCustomStyles();
  }
})();