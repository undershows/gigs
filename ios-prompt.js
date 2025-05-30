function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
}

if (isIos() && !isInStandaloneMode()) {
  const div = document.createElement("div");
  div.style.position = "fixed";
  div.style.bottom = "0";
  div.style.left = "0";
  div.style.right = "0";
  div.style.background = "#000";
  div.style.color = "#fff";
  div.style.padding = "10px";
  div.style.textAlign = "center";
  div.style.zIndex = "9999";
  div.innerHTML = `
    📲 <strong>Instale o app!</strong><br />
    Toque no botão <strong>compartilhar</strong> no Safari
    e depois em <strong>“Adicionar à Tela de Início”</strong>.
  `;
  document.body.appendChild(div);

  setTimeout(() => div.remove(), 5000);
}
