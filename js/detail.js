detailBuyBtn.onclick = () => {
  const comprado = addToCart(p.id);

  if (comprado) {
    showDetail(p.id);
  }
};