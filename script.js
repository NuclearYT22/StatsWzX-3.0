// ====== Referências ======
const conteudo = document.getElementById('conteudo');
const btnArmas = document.getElementById('btnArmas');
const btnAtualizacoes = document.getElementById('btnAtualizacoes');
const btnNoticias = document.getElementById('btnNoticias');
const btnStats = document.getElementById('btnStats');

// ====== Som ======
const clickSound = new Audio('assets/sounds/menu-click.mp3');
clickSound.volume = 0.4;

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
}

btnArmas.addEventListener("click", () => { playClick(); mostrarArmas(); });
btnAtualizacoes.addEventListener("click", () => { playClick(); mostrarAtualizacoes(); });
btnNoticias.addEventListener("click", () => { playClick(); mostrarNoticias(); });
btnStats.addEventListener("click", () => { playClick(); mostrarStats(); });

// ====== Cache ======
let armasCache = null;
let filtroCriado = false;

// ====== FUNÇÃO PRINCIPAL ======
function mostrarArmas() {

  if (!filtroCriado) {
    conteudo.innerHTML = `
      <div class="filtro-container">
        <label for="filtroTipo">Filtrar por tipo:</label>
        <select id="filtroTipo">
          <option value="todos">Todos</option>
          <option value="Assault Rifle">Rifle de Assalto</option>
          <option value="SMG">Submetralhadora</option>
          <option value="Sniper">Fuzil de Precisão</option>
          <option value="LMG">Metralhadora Leve</option>
          <option value="Shotgun">Escopeta</option>
        </select>
      </div>
      <div id="listaArmas" class="lista-armas"></div>
    `;
    filtroCriado = true;
  }

  const filtro = document.getElementById("filtroTipo");
  const container = document.getElementById("listaArmas");

  function renderArmas(tipo) {
    container.innerHTML = "";

    armasCache.forEach(arma => {
      if (tipo === "todos" || arma.category === tipo) {

        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
          <img src="${arma.image}" class="arma-img">

          <h3>${arma.name}</h3>
          <p><strong>Categoria:</strong> ${arma.category}</p>
          <p><strong>Tier:</strong> <span class="tier-${arma.tier}">${arma.tier}</span></p>

          <div class="meta-block">
            <p>📈 <strong>Uso:</strong> ${arma.stats.usage}</p>
            <p>🎯 <strong>K/D:</strong> ${arma.stats.kd}</p>
            <p>🏆 <strong>Winrate:</strong> ${arma.stats.winrate}</p>
            <p>⚡ <strong>TTK médio:</strong> ${arma.stats.ttk}</p>
          </div>

          <details>
            <summary>🔧 Attachments recomendados</summary>
            <ul class="attachments">
              ${arma.attachments.map(att => `
                <li>
                  <i class="fa-solid fa-screwdriver-wrench"></i>
                  <strong>${att.nome}</strong>
                  <span> — Slot: ${att.slot}</span>
                </li>
              `).join("")}
            </ul>
          </details>
        `;

        container.appendChild(div);
      }
    });
  }

  if (!armasCache) {
    fetch("dados.json")
      .then(r => r.json())
      .then(json => {
        armasCache = json.armas;
        renderArmas("todos");
      });
  } else {
    renderArmas(filtro.value);
  }

  filtro.onchange = () => renderArmas(filtro.value);
}

// ============ Outras seções ============
function mostrarAtualizacoes() {
  conteudo.innerHTML = `
    <div class="card">
      <h3>🛠 Atualizações</h3>
      <p>Os dados são atualizados automaticamente pelo sistema.</p>
    </div>
  `;
  filtroCriado = false;
}

function mostrarNoticias() {
  conteudo.innerHTML = `
    <div class="card">
      <h3>📰 Notícias</h3>
      <p>Em breve.</p>
    </div>
  `;
  filtroCriado = false;
}

function mostrarStats() {
  conteudo.innerHTML = `
    <div class="card">
      <h3>📊 Estatísticas</h3>
      <p>Em breve.</p>
    </div>
  `;
  filtroCriado = false;
}
