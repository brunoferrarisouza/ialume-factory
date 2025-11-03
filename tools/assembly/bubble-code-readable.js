/**
 * 🎯 BUBBLE CODE NODE - VERSÃO LEGÍVEL (DESENVOLVIMENTO)
 * 
 * ✅ COM quebras de linha (mais fácil de ler)
 * ✅ HTML formatado e indentado
 * ✅ Use para desenvolvimento e debug
 * ✅ Para produção, use a versão minificada
 */

const config = $json.game_config;
const analyzer = $json.analyzer_output;
const paginaId = $json.pagina_id;

const CDN_BASE = "https://brunoferrarisouza.github.io/ialume-factory/cdn/1.0.0/";

// ✅ Tratamento de analyzer undefined
const safeAnalyzer = analyzer || null;

// ✅ HTML FORMATADO - COM QUEBRAS DE LINHA
const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${config.narrative.theme}</title>
  
  <!-- CDN Foundation -->
  <link rel="stylesheet" href="${CDN_BASE}base.css">
  <script src="${CDN_BASE}base.js"></script>
  <script src="${CDN_BASE}game-engine.js"></script>
  <script src="${CDN_BASE}bubble-integration.js"></script>
  
  <!-- Mechanic & Modality específicos -->
  <script src="${CDN_BASE}mechanics/${config.mechanic.name}.js"></script>
  <script src="${CDN_BASE}modalities/${config.modality.name}.js"></script>
</head>
<body>
  <div id="game-container"></div>
  
  <script>
    // Configuração do jogo
    window.GAME_CONFIG = ${JSON.stringify(config, null, 2)};
    window.ANALYZER_DATA = ${JSON.stringify(safeAnalyzer, null, 2)};
    
    // Inicializar quando carregar
    window.addEventListener('DOMContentLoaded', function() {
      console.log('🎮 Inicializando iAlumeFactory...');
      console.log('📋 Config:', window.GAME_CONFIG);
      console.log('📊 Analyzer:', window.ANALYZER_DATA);
      
      try {
        if (typeof iAlumeFactory !== 'undefined') {
          iAlumeFactory.init(window.GAME_CONFIG);
          console.log('✅ Jogo inicializado com sucesso!');
        } else {
          throw new Error('iAlumeFactory não está definido');
        }
      } catch (error) {
        console.error('❌ Erro ao inicializar:', error);
        document.getElementById('game-container').innerHTML = 
          '<div style="text-align:center;padding:40px;color:#e74c3c;">' +
          '<h2>Erro ao carregar jogo</h2>' +
          '<p>' + error.message + '</p>' +
          '</div>';
      }
    });
  </script>
</body>
</html>`;

// ✅ Logs de debug detalhados
console.log('========================================');
console.log('✅ HTML GERADO (VERSÃO DESENVOLVIMENTO)');
console.log('========================================');
console.log('📏 Tamanho:', html.length, 'caracteres');
console.log('🔗 CDN Base:', CDN_BASE);
console.log('🎮 Mechanic:', config.mechanic.name);
console.log('🎯 Modality:', config.modality.name);
console.log('👤 Character:', config.character.name);
console.log('❓ Questions:', config.questions.length);
console.log('⏱️ Duration:', config.metadata.estimated_duration);
console.log('📊 Analyzer:', safeAnalyzer ? 'Presente' : 'Null');
console.log('========================================');

// ✅ Retornar JSON estruturado
return {
  json: {
    game_html: html,
    pagina_id: paginaId,
    metadata: {
      mechanic: config.mechanic.name,
      modality: config.modality.name,
      character: config.character.name,
      total_questions: config.questions.length,
      estimated_duration: config.metadata.estimated_duration,
      cdn_base: CDN_BASE,
      has_analyzer: safeAnalyzer !== null,
      html_size: html.length
    }
  }
};
