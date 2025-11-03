# 🎨 Sistema de Assets Kenney - Especificação

## 1. Visão Geral

Sistema automatizado que baixa, cataloga e disponibiliza assets do Kenney para que a IA possa reconhecê-los e selecioná-los de forma consistente e coerente na montagem de jogos.

## 2. Kenney.nl - Estrutura

### 2.1 O que é Kenney?
- **Site**: https://kenney.nl
- **Licença**: CC0 (domínio público) - uso comercial permitido
- **Conteúdo**: 40.000+ assets gratuitos organizados em ~200 packs
- **Formatos**: PNG, SVG, Sprites, Tilesets, Sons, Músicas

### 2.2 Categorias de Assets
```
VISUAL:
├── characters/          # Personagens (humanos, animais, fantasias)
├── backgrounds/         # Fundos e cenários
├── ui/                 # Interface (botões, barras, ícones)
├── objects/            # Objetos interativos
├── platforms/          # Plataformas e tiles
├── effects/            # Efeitos visuais (explosões, partículas)
└── decorations/        # Elementos decorativos

AUDIO:
├── sounds/             # Efeitos sonoros
└── music/              # Músicas de fundo
```

## 3. Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    KENNEY ASSETS SYSTEM                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │   1. DOWNLOADER (kenney-downloader.js)  │
        │   • Baixa packs selecionados            │
        │   • Descompacta ZIPs                    │
        │   • Organiza por categoria              │
        └─────────────────┬───────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────────┐
        │   2. CATALOGER (kenney-cataloger.js)    │
        │   • Analisa cada asset                  │
        │   • Gera metadados                      │
        │   • Cria catalog.json                   │
        └─────────────────┬───────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────────┐
        │   3. SELECTOR (asset-selector.js)       │
        │   • Recebe contexto do jogo             │
        │   • Seleciona assets coerentes          │
        │   • Garante consistência visual         │
        └─────────────────┬───────────────────────┘
                          │
                          ▼
        ┌─────────────────────────────────────────┐
        │   4. GAME_DESIGNER INTEGRATION          │
        │   • Usa catalog.json como tool          │
        │   • Seleciona assets via asset-selector │
        │   • Injeta no config do jogo            │
        └─────────────────────────────────────────┘
```

## 4. Estrutura de Dados

### 4.1 Catalog.json Schema
```json
{
  "version": "1.0.0",
  "generated": "2025-10-31T10:00:00Z",
  "total_assets": 1523,
  "packs": [
    {
      "id": "platformer-characters",
      "name": "Platformer Characters",
      "url": "https://kenney.nl/assets/platformer-characters-1",
      "license": "CC0",
      "categories": ["characters", "platformer"]
    }
  ],
  "assets": {
    "backgrounds": [
      {
        "id": "bg_blue_sky_01",
        "pack": "platformer-characters",
        "path": "cdn/assets/backgrounds/blue_sky_01.png",
        "cdn_url": "https://brunoferrarisouza.github.io/ialume-factory/assets/backgrounds/blue_sky_01.png",
        "type": "background",
        "theme": "sky",
        "colors": ["blue", "white"],
        "dimensions": {"width": 1920, "height": 1080},
        "tags": ["céu", "nuvens", "dia", "outdoor"],
        "compatible_mechanics": ["escalada", "voo", "mergulho"],
        "mood": "alegre"
      }
    ],
    "characters": [
      {
        "id": "char_astronaut_01",
        "pack": "platformer-characters",
        "path": "cdn/assets/characters/astronaut_01.png",
        "cdn_url": "https://brunoferrarisouza.github.io/ialume-factory/assets/characters/astronaut_01.png",
        "type": "character",
        "category": "human",
        "theme": "space",
        "colors": ["white", "gray"],
        "dimensions": {"width": 128, "height": 128},
        "tags": ["astronauta", "espaço", "ciência", "aventura"],
        "compatible_mechanics": ["escalada", "voo", "construção"],
        "mood": "aventureiro"
      }
    ],
    "ui": [
      {
        "id": "ui_button_green",
        "pack": "ui-pack",
        "path": "cdn/assets/ui/button_green.png",
        "cdn_url": "https://brunoferrarisouza.github.io/ialume-factory/assets/ui/button_green.png",
        "type": "ui",
        "element": "button",
        "colors": ["green"],
        "dimensions": {"width": 190, "height": 49},
        "tags": ["botão", "ui", "interface"],
        "states": ["normal", "hover", "pressed"]
      }
    ],
    "sounds": [
      {
        "id": "sfx_jump_01",
        "pack": "interface-sounds",
        "path": "cdn/assets/sounds/jump_01.ogg",
        "cdn_url": "https://brunoferrarisouza.github.io/ialume-factory/assets/sounds/jump_01.ogg",
        "type": "sound",
        "category": "action",
        "duration": 0.3,
        "tags": ["pulo", "ação", "movimento"]
      }
    ]
  },
  "themes": {
    "space": {
      "characters": ["char_astronaut_01", "char_alien_01"],
      "backgrounds": ["bg_space_01", "bg_stars_01"],
      "objects": ["obj_rocket_01", "obj_planet_01"]
    },
    "forest": {
      "characters": ["char_explorer_01", "char_animal_01"],
      "backgrounds": ["bg_forest_01", "bg_trees_01"],
      "objects": ["obj_tree_01", "obj_rock_01"]
    }
  },
  "mechanics_defaults": {
    "escalada": {
      "recommended_backgrounds": ["bg_mountain_01", "bg_cliff_01"],
      "recommended_characters": ["char_climber_01", "char_adventurer_01"],
      "recommended_objects": ["obj_rock_01", "obj_flag_01"]
    },
    "perseguicao": {
      "recommended_backgrounds": ["bg_road_01", "bg_city_01"],
      "recommended_characters": ["char_runner_01", "char_chaser_01"],
      "recommended_objects": ["obj_obstacle_01", "obj_coin_01"]
    }
  }
}
```

### 4.2 Game Config com Assets
```json
{
  "tema": "Matemática Espacial",
  "mechanic": "escalada",
  "assets": {
    "theme": "space",
    "background": "bg_space_01",
    "character": "char_astronaut_01",
    "ui_set": "ui_blue_theme",
    "sounds": {
      "correct": "sfx_success_01",
      "wrong": "sfx_error_01",
      "complete": "sfx_victory_01"
    },
    "objects": {
      "collectible": "obj_star_01",
      "obstacle": "obj_meteor_01"
    }
  },
  "fases": [...]
}
```

## 5. Fluxo de Operação

### 5.1 Setup Inicial (Uma vez)
```bash
# 1. Baixar assets
npm run kenney:download

# 2. Catalogar
npm run kenney:catalog

# 3. Deploy para CDN
npm run kenney:deploy
```

### 5.2 Uso no GAME_DESIGNER
```
1. GAME_DESIGNER recebe pedagogical_analysis
2. Identifica tema do jogo (ex: "espaço", "floresta")
3. Chama asset-selector.selectAssets(tema, mechanic)
4. Recebe asset_config coerente
5. Injeta no game_config
6. COMPOSITOR gera HTML com referencias aos assets
```

## 6. Seleção Inteligente de Assets

### 6.1 Regras de Coerência
```javascript
// Exemplo de regra
const coherenceRules = {
  // Se tema é "espaço", não usar assets de "floresta"
  themeExclusions: {
    "space": ["forest", "ocean", "desert"],
    "forest": ["space", "city", "ocean"]
  },

  // Cores devem ser compatíveis
  colorHarmony: {
    "blue": ["white", "cyan", "purple"],
    "green": ["brown", "yellow", "blue"]
  },

  // Mechanics requerem assets específicos
  mechanicRequirements: {
    "escalada": {
      required: ["background_vertical", "character", "collectible"],
      optional: ["obstacles"]
    }
  }
};
```

### 6.2 Scoring System
Cada combinação de assets recebe um score:
```javascript
score = (
  themeMatch * 0.4 +        // 40% - tema coerente
  colorHarmony * 0.3 +       // 30% - cores harmoniosas
  mechanicFit * 0.2 +        // 20% - adequado à mecânica
  moodConsistency * 0.1      // 10% - mood consistente
)
```

## 7. Packs Prioritários

### 7.1 Essenciais (Fase 1)
```
1. Platformer Characters 1
2. Platformer Art Complete Pack
3. UI Pack
4. UI Pack - Space Expansion
5. Interface Sounds
6. Digital Audio
```

### 7.2 Expansão (Fase 2)
```
7. Animal Pack
8. Voxel Pack
9. Particle Pack
10. Isometric Miniature Pack
```

## 8. Integração com N8N

```
┌─────────────────┐
│  GAME_DESIGNER  │
│     (Sonnet)    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  TOOL: asset_selector           │
│  {                              │
│    "tema": "espaço",            │
│    "mechanic": "escalada",      │
│    "mood": "aventureiro"        │
│  }                              │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  OUTPUT: asset_config           │
│  {                              │
│    "background": "bg_space_01", │
│    "character": "char_astro_01",│
│    "ui_set": "ui_blue",         │
│    "sounds": {...}              │
│  }                              │
└─────────────────────────────────┘
```

## 9. Benefícios

✅ **Consistência visual**: Todos os jogos têm assets profissionais e coerentes
✅ **Rapidez**: Assets já catalogados, seleção instantânea
✅ **Variedade**: 40.000+ assets disponíveis
✅ **Licenciamento**: CC0 = sem problemas legais
✅ **Escalabilidade**: Fácil adicionar novos packs
✅ **IA-friendly**: Catalog estruturado permite seleção inteligente

## 10. Próximos Passos

1. ✅ Criar especificação (este documento)
2. 🔄 Implementar kenney-downloader.js
3. 🔄 Implementar kenney-cataloger.js
4. 🔄 Implementar asset-selector.js
5. 🔄 Integrar com GAME_DESIGNER
6. 🔄 Testar end-to-end
7. 🔄 Deploy assets para CDN
