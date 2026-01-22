function faviconURL(u) {
    const url = new URL(chrome.runtime.getURL('/_favicon/'));
    url.searchParams.set('pageUrl', u); // this encodes the URL as well
    url.searchParams.set('size', '32');
    return url.toString();
}

document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('bookmarks-list');

  try {
    const bookmarksBar = await chrome.bookmarks.getChildren('1'); // ID панели закладок

    if (!bookmarksBar) {
      list.innerHTML = '<li>Панель закладок пуста</li>';
      return;
    }

    bookmarksBar.forEach(item => {
      if (item.url) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.title || item.url;

		// Создаём иконку
		const img = document.createElement('img');
		img.src = faviconURL(item.url);
		img.alt = '';
		img.style.width = '32px';
		img.style.height = '32px';
		img.style.marginRight = '6px';
		img.style.verticalAlign = 'middle';
		img.onerror = () => {
			// img.src = `https://www.google.com/s2/favicons?sz=16&domain_url=${encodeURIComponent(item.url)}`;
	  		img.style.display = 'none'; // или подставьте заглушку
		};
        
		a.prepend(img);
        li.appendChild(a);
        list.appendChild(li);
      }
    });
  } catch (err) {
    list.innerHTML = `<li>Ошибка: ${err.message}</li>`;
  }
});