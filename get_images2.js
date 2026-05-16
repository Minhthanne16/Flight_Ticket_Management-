const titles = ['Hội An', 'Bến Thành Market', 'Hoàn Kiếm Lake', 'Da Nang', 'Sapa, Vietnam', 'Phu Quoc'];
async function getImages() {
  for (const title of titles) {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1000`);
    const data = await res.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    if (pages[pageId].thumbnail) {
      console.log(title + ': ' + pages[pageId].thumbnail.source);
    } else {
      console.log(title + ': NO IMAGE');
    }
  }
}
getImages();
