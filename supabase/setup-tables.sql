-- ========================================
-- SETUP TABLES - iAlume Factory Supabase
-- ========================================
-- Data: 2025-11-07
-- Autor: Claude Code
-- ========================================

-- ========================================
-- 1. TABELA: scenery_assets
-- ========================================
-- Armazena cenários de fundo (backgrounds parallax)

CREATE TABLE IF NOT EXISTS public.scenery_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scenery_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    layer_1_sky TEXT, -- URL da imagem
    layer_2_far TEXT,
    layer_3_mid TEXT,
    layer_4_near TEXT,
    layer_5_ground TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index para buscas rápidas
CREATE INDEX IF NOT EXISTS idx_scenery_id ON public.scenery_assets(scenery_id);
CREATE INDEX IF NOT EXISTS idx_active ON public.scenery_assets(is_active);

-- Comentários
COMMENT ON TABLE public.scenery_assets IS 'Cenários de fundo com layers parallax para mecânicas visuais';
COMMENT ON COLUMN public.scenery_assets.scenery_id IS 'Identificador único (montanha-nevada, deserto-canyon, etc)';
COMMENT ON COLUMN public.scenery_assets.layer_1_sky IS 'URL da camada 1 - céu/fundo distante';
COMMENT ON COLUMN public.scenery_assets.layer_2_far IS 'URL da camada 2 - elementos distantes';
COMMENT ON COLUMN public.scenery_assets.layer_3_mid IS 'URL da camada 3 - elementos médios';

-- ========================================
-- 2. TABELA: scenery_decorations
-- ========================================
-- Armazena decorações animadas (nuvens, pássaros, etc)

CREATE TABLE IF NOT EXISTS public.scenery_decorations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scenery_id TEXT NOT NULL, -- Qual cenário usa esta decoração
    decoration_type TEXT NOT NULL, -- 'cloud', 'bird', etc
    decoration_name TEXT NOT NULL, -- 'cloud-1', 'bird-eagle', etc
    image_url TEXT NOT NULL,
    animation_type TEXT DEFAULT 'float-horizontal', -- tipo de animação
    speed_multiplier DECIMAL(3,1) DEFAULT 1.0, -- 0.5 = lento, 2.0 = rápido
    spawn_frequency INTEGER DEFAULT 5000, -- milissegundos entre spawns
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_decoration_scenery ON public.scenery_decorations(scenery_id);
CREATE INDEX IF NOT EXISTS idx_decoration_type ON public.scenery_decorations(decoration_type);
CREATE INDEX IF NOT EXISTS idx_decoration_active ON public.scenery_decorations(is_active);

-- Comentários
COMMENT ON TABLE public.scenery_decorations IS 'Decorações animadas para adicionar vida aos cenários';
COMMENT ON COLUMN public.scenery_decorations.animation_type IS 'Tipo de movimento: float-horizontal, fly-diagonal, drift, etc';
COMMENT ON COLUMN public.scenery_decorations.speed_multiplier IS 'Multiplicador de velocidade (1.0 = normal)';
COMMENT ON COLUMN public.scenery_decorations.spawn_frequency IS 'Frequência de spawn em milissegundos';

-- ========================================
-- 3. TABELA: media_assets (áudio)
-- ========================================
-- Armazena arquivos de áudio do jogo

CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    media_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    media_type TEXT NOT NULL, -- 'music', 'sfx', 'ambient'
    volume DECIMAL(3,2) DEFAULT 1.0, -- 0.0 a 1.0
    loop BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_media_id ON public.media_assets(media_id);
CREATE INDEX IF NOT EXISTS idx_media_type ON public.media_assets(media_type);

-- Comentários
COMMENT ON TABLE public.media_assets IS 'Assets de áudio do jogo (música, efeitos sonoros, ambiente)';
COMMENT ON COLUMN public.media_assets.media_id IS 'Identificador único (musica-principal, som-moeda, etc)';
COMMENT ON COLUMN public.media_assets.media_type IS 'Tipo: music (trilha), sfx (efeito), ambient (vento)';

-- ========================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- ========================================

ALTER TABLE public.scenery_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenery_decorations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. POLICIES (Acesso Público de Leitura)
-- ========================================

-- scenery_assets: Leitura pública
CREATE POLICY "Permitir leitura pública de scenery_assets"
ON public.scenery_assets FOR SELECT
USING (is_active = true);

-- scenery_decorations: Leitura pública
CREATE POLICY "Permitir leitura pública de scenery_decorations"
ON public.scenery_decorations FOR SELECT
USING (is_active = true);

-- media_assets: Leitura pública
CREATE POLICY "Permitir leitura pública de media_assets"
ON public.media_assets FOR SELECT
USING (is_active = true);

-- ========================================
-- 6. FUNCTIONS (Úteis)
-- ========================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_scenery_assets_updated_at
    BEFORE UPDATE ON public.scenery_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scenery_decorations_updated_at
    BEFORE UPDATE ON public.scenery_decorations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_assets_updated_at
    BEFORE UPDATE ON public.media_assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- SETUP COMPLETO! ✅
-- ========================================
-- Próximo passo: Criar buckets de storage
-- Comando: npm run supabase:setup-storage
