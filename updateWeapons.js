import fetch from "node-fetch";
import fs from "fs";

// API REAL com proxy para evitar bloqueio do GitHub Actions
const API_URL = "https://corsproxy.io/?https://wzranked.io/api/weapons";

async function atualizarArmas() {
  console.log("📡 Buscando dados reais do WZRanked via Proxy...");

  try {
    const resposta = await fetch(API_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0" // Engana algumas proteções extras
      }
    });

    const json = await resposta.json();

    // Caso o proxy retorne erro
    if (!json || !json.weapons) {
      console.error("❌ Erro ao ler dados: Estrutura inesperada");
      console.log("Resposta recebida:", json);
      return;
    }

    console.log(`📦 Armas recebidas: ${json.weapons.length}`);

    const armasConvertidas = json.weapons.map(arma => {

      const nomeSeguro = arma.name || "Unknown";

      return {
        name: nomeSeguro,
        category: arma.category || "Unknown",
        tier: arma.tier || "B",
        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(nomeSeguro)}&background=00000000&color=fff`,
        stats: {
          usage: arma.popularity ? arma.popularity + "%" : "0%",
          kd: arma.kdRatio || "0.00",
          winrate: arma.winRate ? arma.winRate + "%" : "0%",
          ttk: arma.avgTTK || "N/A"
        },
        attachments: arma.bestAttachments?.map(att => ({
          slot: att.slot || "Unknown",
          nome: att.name || "Unknown"
        })) || []
      };
    });

    const finalJSON = {
      atualizado: new Date().toISOString(),
      armas: armasConvertidas
    };

    fs.writeFileSync("dados.json", JSON.stringify(finalJSON, null, 2));

    console.log("✅ dados.json atualizado com sucesso!");

  } catch (erro) {
    console.error("❌ Erro geral na atualização:", erro);
  }
}

atualizarArmas();
