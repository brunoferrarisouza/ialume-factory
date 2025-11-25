#!/usr/bin/env node

/**
 * GERADOR DE LAYERS PARALLAX COM COESAO VISUAL TOTAL
 *
 * Este script gera todos os 4 layers de um cenario com identidade visual consistente.
 * Usa DALL-E 3 API com prompts que garantem coesao entre layers.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Verificar API Key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY nao encontrada no ambiente!');
    console.error('Execute: source .env.openai');
    process.exit(1);
}

/**
 * Fazer request para DALL-E 3 API
 */
async function generateImage(prompt, size = '1792x1024') {
    console.log('\n🎨 Gerando imagem via DALL-E 3...');
    console.log(`📝 Prompt (${prompt.length} chars):`, prompt.substring(0, 200) + '...');

    const requestBody = JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: size,
        quality: 'hd',
        style: 'vivid'
    });

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.openai.com',
            port: 443,
            path: '/v1/images/generations',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Length': Buffer.byteLength(requestBody)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    const response = JSON.parse(data);
                    const imageUrl = response.data[0].url;
                    console.log('✅ Imagem gerada com sucesso!');
                    console.log('🔗 URL:', imageUrl);
                    resolve(imageUrl);
                } else {
                    console.error('❌ Erro na API:', res.statusCode);
                    console.error(data);
                    reject(new Error(`API Error: ${res.statusCode}`));
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Erro na request:', error);
            reject(error);
        });

        req.write(requestBody);
        req.end();
    });
}

/**
 * Baixar imagem de URL e salvar localmente
 */
async function downloadImage(url, outputPath) {
    console.log(`\n📥 Baixando imagem para: ${outputPath}`);

    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(new Error(`Download failed: ${res.statusCode}`));
                return;
            }

            const fileStream = fs.createWriteStream(outputPath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
                fileStream.close();
                console.log('✅ Download completo!');
                resolve(outputPath);
            });

            fileStream.on('error', (err) => {
                fs.unlink(outputPath, () => {});
                reject(err);
            });
        }).on('error', reject);
    });
}

/**
 * Aguardar N segundos (para rate limiting)
 */
function sleep(seconds) {
    console.log(`\n⏳ Aguardando ${seconds}s (rate limiting)...`);
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

/**
 * DEFINICOES DE CENARIOS
 */
const SCENARIOS = {
    'torre-livros': {
        name: 'Torre de Livros Magicos',
        visualIdentity: {
            style: 'Studio Ghibli inspired whimsical flat design',
            palette: ['Deep Purple #6A0DAD', 'Midnight Blue #191970', 'Gold #FFD700', 'Warm Brown #8B4513', 'Soft Cream #FFF8DC'],
            lighting: 'Magical twilight with aurora, soft golden glow',
            atmosphere: 'Mystical enchanted night, floating magical particles',
            lineStyle: 'Soft watercolor edges, clean shapes',
            texture: 'Slightly grainy, hand-painted magical feel'
        },
        layers: [
            {
                number: 1,
                name: 'Sky',
                description: 'Ceu mistico com aurora',
                prompt: `IMPORTANT: This is LAYER 1 (SKY) of a 4-layer magical library tower parallax set.

SHARED VISUAL IDENTITY (MANDATORY):
- Art Style: Studio Ghibli inspired whimsical flat design
- Color Palette: EXACTLY Deep Purple #6A0DAD, Midnight Blue #191970, Gold #FFD700
- Lighting: Magical twilight with aurora, soft golden glow
- Atmosphere: Mystical enchanted night, floating magical particles
- Line Style: Soft watercolor edges, clean shapes
- Texture: Slightly grainy, hand-painted magical feel

LAYER 1 ELEMENTS:
- Twilight sky gradient (deep purple to midnight blue)
- Soft aurora borealis in purple, blue, green
- Twinkling stars and golden magical sparkles
- Crescent moon with soft glow
- Ethereal light rays
- NO ground, NO structures (pure magical sky)

CRITICAL: Layers 2, 3, 4 will show book towers in front - maintain EXACT same color palette and magical atmosphere!

Resolution: 1792x1024, cartoon style, educational game aesthetic`
            },
            {
                number: 2,
                name: 'Distant Towers',
                description: 'Torres de livros distantes',
                prompt: `IMPORTANT: This is LAYER 2 (DISTANT TOWERS) of a 4-layer magical library tower parallax set.

SHARED VISUAL IDENTITY (MANDATORY - MUST MATCH LAYER 1):
- Art Style: Studio Ghibli inspired whimsical flat design
- Color Palette: EXACTLY Deep Purple #6A0DAD, Midnight Blue #191970, Gold #FFD700, Warm Brown #8B4513
- Lighting: Same magical twilight as layer 1, golden glow from windows
- Atmosphere: Same mystical enchanted night, magical particles
- Line Style: Same soft watercolor edges, clean shapes
- Texture: Same slightly grainy, hand-painted feel

LAYER 2 ELEMENTS:
- Distant silhouettes of book tower spires in background
- Dark brown/purple tones (atmospheric perspective)
- Small glowing windows (golden light #FFD700)
- Floating book silhouettes far away
- Maintains same sky colors as layer 1 in background
- Simplified shapes (distant)

CRITICAL: This MUST look like it's in front of Layer 1 sky but part of SAME scene!
Same color palette, same lighting, same magical atmosphere!

Resolution: 1792x1024, cartoon style`
            },
            {
                number: 3,
                name: 'Main Tower',
                description: 'Torre principal de livros',
                prompt: `IMPORTANT: This is LAYER 3 (MAIN TOWER) of a 4-layer magical library tower parallax set.

SHARED VISUAL IDENTITY (MANDATORY - MUST MATCH LAYERS 1 & 2):
- Art Style: Studio Ghibli inspired whimsical flat design
- Color Palette: EXACTLY Deep Purple #6A0DAD, Gold #FFD700, Warm Brown #8B4513, Soft Cream #FFF8DC
- Lighting: Same magical twilight, glowing windows and books
- Atmosphere: Same mystical enchanted library
- Line Style: Same soft watercolor edges, clean shapes
- Texture: Same hand-painted magical feel

LAYER 3 ELEMENTS:
- Vertical stack of books forming climbable tower
- Book spines in warm brown #8B4513 with gold lettering #FFD700
- Glowing magical runes on book covers
- Windows between books with golden light
- Visible book pages in cream #FFF8DC
- Center clear for climbing
- Magical sparkles matching layer 1's atmosphere

CRITICAL: This is the MAIN climbing surface - MUST seamlessly integrate with layers 1 & 2!
Same twilight colors, same magical glow, looks like ONE cohesive scene!

Resolution: 1792x1024, cartoon style, suitable for vertical climbing`
            },
            {
                number: 4,
                name: 'Foreground',
                description: 'Elementos em primeiro plano',
                prompt: `IMPORTANT: This is LAYER 4 (FOREGROUND) of a 4-layer magical library tower parallax set.

SHARED VISUAL IDENTITY (MANDATORY - MUST MATCH LAYERS 1, 2 & 3):
- Art Style: Studio Ghibli inspired whimsical flat design
- Color Palette: EXACTLY Gold #FFD700, Deep Purple #6A0DAD, Warm Brown #8B4513
- Lighting: Same magical twilight glow
- Atmosphere: Same mystical particles
- Line Style: Same soft watercolor edges
- Texture: Same hand-painted magical feel

LAYER 4 ELEMENTS:
- Close-up floating open books (very near camera)
- Large golden magical particles #FFD700
- Quill feathers in foreground
- Glowing runes close to camera
- Edges only (center clear for gameplay)
- Same purple magical mist as layers 1-3

CRITICAL: Final overlay layer - MUST complete the cohesive scene!
Uses EXACT same colors, lighting, and magical atmosphere as other 3 layers!

Resolution: 1792x1024, cartoon style, foreground overlay`
            }
        ]
    }
};

/**
 * Gerar todos os layers de um cenario
 */
async function generateScenario(scenarioKey) {
    const scenario = SCENARIOS[scenarioKey];
    if (!scenario) {
        console.error(`❌ Cenario '${scenarioKey}' nao encontrado!`);
        return;
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log(`🎨 GERANDO CENARIO: ${scenario.name}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📋 IDENTIDADE VISUAL:');
    console.log(`   Estilo: ${scenario.visualIdentity.style}`);
    console.log(`   Paleta: ${scenario.visualIdentity.palette.join(', ')}`);
    console.log(`   Iluminacao: ${scenario.visualIdentity.lighting}`);
    console.log(`   Atmosfera: ${scenario.visualIdentity.atmosphere}`);

    const outputDir = path.join(__dirname, '..', 'assets', 'backgrounds', scenarioKey);

    // Garantir que diretorio existe
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const results = {
        scenario: scenarioKey,
        name: scenario.name,
        visualIdentity: scenario.visualIdentity,
        layers: [],
        timestamp: new Date().toISOString()
    };

    // Gerar cada layer sequencialmente
    for (let i = 0; i < scenario.layers.length; i++) {
        const layer = scenario.layers[i];

        console.log('\n───────────────────────────────────────────────────────');
        console.log(`🎯 LAYER ${layer.number}: ${layer.name}`);
        console.log(`📝 ${layer.description}`);
        console.log('───────────────────────────────────────────────────────');

        try {
            // Gerar imagem via DALL-E 3
            const imageUrl = await generateImage(layer.prompt);

            // Baixar imagem
            const outputPath = path.join(outputDir, `${scenarioKey}-layer-${layer.number}.png`);
            await downloadImage(imageUrl, outputPath);

            // Registrar resultado
            results.layers.push({
                number: layer.number,
                name: layer.name,
                description: layer.description,
                url: imageUrl,
                localPath: outputPath,
                generatedAt: new Date().toISOString()
            });

            console.log(`✅ Layer ${layer.number} concluido!`);

            // Aguardar 60s entre layers (exceto no ultimo)
            if (i < scenario.layers.length - 1) {
                await sleep(60);
            }

        } catch (error) {
            console.error(`❌ Erro ao gerar Layer ${layer.number}:`, error.message);
            results.layers.push({
                number: layer.number,
                name: layer.name,
                error: error.message,
                failedAt: new Date().toISOString()
            });
        }
    }

    // Salvar log JSON
    const logPath = path.join(outputDir, 'generation-log.json');
    fs.writeFileSync(logPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Log salvo em: ${logPath}`);

    return results;
}

/**
 * MAIN
 */
async function main() {
    const scenarioKey = process.argv[2] || 'torre-livros';

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║  GERADOR DE ASSETS PARALLAX COM COESAO VISUAL TOTAL   ║');
    console.log('╚═══════════════════════════════════════════════════════╝');

    try {
        const results = await generateScenario(scenarioKey);

        console.log('\n═══════════════════════════════════════════════════════');
        console.log('✅ GERACAO COMPLETA!');
        console.log('═══════════════════════════════════════════════════════');
        console.log(`\n📊 RESUMO:`);
        console.log(`   Cenario: ${results.name}`);
        console.log(`   Layers gerados: ${results.layers.filter(l => !l.error).length}/${results.layers.length}`);
        console.log(`   Timestamp: ${results.timestamp}`);

        const failed = results.layers.filter(l => l.error);
        if (failed.length > 0) {
            console.log(`\n⚠️  Layers com erro: ${failed.length}`);
            failed.forEach(l => {
                console.log(`   - Layer ${l.number}: ${l.error}`);
            });
        }

    } catch (error) {
        console.error('\n❌ ERRO FATAL:', error);
        process.exit(1);
    }
}

// Executar
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { generateScenario, generateImage, downloadImage };
