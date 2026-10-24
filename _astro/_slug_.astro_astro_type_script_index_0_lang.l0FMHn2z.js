(function(){async function e(e){let t=e.dataset.title,n=e.dataset.date,r=e.dataset.city,i=e.dataset.state,a=e.dataset.shareUrl||`https://shows.undershows.com.br`,o=`${t}
${n} - ${r}/${i}

via Undershows: ${a}`;try{if(navigator.share)await navigator.share({text:o});else if(navigator.clipboard){let e=`${t}
${n} - ${r}/${i}

Cartaz: ${a}

via Undershows: https://shows.undershows.com.br`;await navigator.clipboard.writeText(e),alert(`Link copiado! Cole no WhatsApp/Instagram 🤘`)}else alert(`Copie e cole:

`+o+`

Cartaz: `+a)}catch(e){console.error(`Erro ao compartilhar`,e)}}async function t(e){let t=e.dataset.text||``;if(t)try{navigator.share?await navigator.share({text:t}):navigator.clipboard?(await navigator.clipboard.writeText(t),alert(`Agenda copiada! Cole no WhatsApp/Instagram 🤘`)):alert(`Copie e cole:

`+t)}catch(e){console.error(`Erro ao compartilhar agenda`,e)}}async function n(e){let t=e.dataset.url||window.location.href,n=e.querySelector(`.copy-label`);try{if(navigator.clipboard)await navigator.clipboard.writeText(t);else{let e=document.createElement(`input`);e.value=t,document.body.appendChild(e),e.select(),document.execCommand(`copy`),e.remove()}}catch(e){console.error(`Erro ao copiar link`,e),alert(`Copie o link:

`+t);return}if(!n)return;let r=n.dataset.original||n.textContent;n.dataset.original=r,n.textContent=`Link copiado!`,e.classList.add(`copiado`),clearTimeout(e.copyTimeout),e.copyTimeout=setTimeout(function(){n.textContent=r,e.classList.remove(`copiado`)},1800)}document.addEventListener(`click`,function(r){let i=r.target.closest(`[data-copy-link]`);if(i){r.preventDefault(),n(i);return}let a=r.target.closest(`[data-share-agenda]`);if(a){r.preventDefault(),t(a);return}let o=r.target.closest(`[data-share-show]`);o&&(r.preventDefault(),e(o))})})();