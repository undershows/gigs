(function(){let e=`https://shows.undershows.com.br`;async function t(t){let n=t.dataset.title,r=t.dataset.date,i=t.dataset.city,a=t.dataset.state,o=t.dataset.shareUrl||e,s=`${n}
${r} - ${i}/${a}

via Undershows: ${o}`;try{if(navigator.share)await navigator.share({text:s});else if(navigator.clipboard){let t=`${n}
${r} - ${i}/${a}

Cartaz: ${o}

via Undershows: ${e}`;await navigator.clipboard.writeText(t),alert(`Link copiado! Cole no WhatsApp/Instagram 🤘`)}else alert(`Copie e cole:

`+s+`

Cartaz: `+o)}catch(e){console.error(`Erro ao compartilhar`,e)}}document.addEventListener(`click`,function(e){let n=e.target.closest(`[data-share-show]`);n&&(e.preventDefault(),t(n))})})();