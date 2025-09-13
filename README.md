# Bambulab Card para Home Assistant

Um card customizado para monitorar impressoras Bambulab no Home Assistant, com suporte especial para A1 Combo com AMS Lite.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![HACS](https://img.shields.io/badge/HACS-Custom-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## Recursos

### Monitoramento Completo
- 📊 **Status em tempo real** - Visualize o progresso da impressão com barra de progresso animada
- 📷 **Feed da câmera ao vivo** - Veja sua impressão em tempo real com opção de tela cheia
- 🌡️ **Temperaturas** - Monitore temperaturas do bico e da mesa com valores atuais e alvos
- 🎨 **Sistema AMS Lite** - Visualização completa das 4 bandejas com cores, tipos e quantidade de filamento
- ⏱️ **Informações de tempo** - Tempo restante, tempo decorrido e estimativas precisas
- 🖼️ **Preview da impressão** - Visualize a imagem do modelo sendo impresso

### Controles
- ⏸️ Pausar impressão
- ▶️ Retomar impressão
- ⏹️ Parar impressão (com confirmação)
- 🔄 Atualização automática em tempo real

### Interface
- 🎨 Suporte a temas claro e escuro
- 📱 Design responsivo (desktop e mobile)
- ⚙️ Configuração via interface do Home Assistant
- 🔧 Múltiplas opções de layout para a câmera

## Pré-requisitos

1. **Home Assistant** 2023.1.0 ou superior
2. **Integração Bambulab** instalada via HACS ([greghesp/ha-bambulab](https://github.com/greghesp/ha-bambulab))
3. **HACS** (Home Assistant Community Store) instalado

## Instalação

### Via HACS (Recomendado)

1. Abra o HACS no seu Home Assistant
2. Clique em "Frontend"
3. Clique no menu de 3 pontos no canto superior direito
4. Selecione "Repositórios customizados"
5. Adicione a URL: `https://github.com/seu-usuario/bambulab-card`
6. Selecione a categoria: `Lovelace`
7. Clique em "Adicionar"
8. Procure por "Bambulab Card" e instale
9. Recarregue o navegador (Ctrl+F5)

### Instalação Manual

1. Baixe o arquivo `bambulab-card.js`
2. Copie para `/config/www/bambulab-card/`
3. Adicione o recurso no Lovelace:
   - Vá para Configurações → Dashboards
   - Clique no menu de 3 pontos → Recursos
   - Adicione novo recurso:
     - URL: `/local/bambulab-card/bambulab-card.js`
     - Tipo: `JavaScript Module`
4. Recarregue o navegador

## Configuração

### 🆕 Nova Configuração (Recomendada) - Entidades Individuais

A partir da versão 2.0, você pode configurar cada entidade individualmente para máximo controle:

```yaml
type: custom:bambulab-card
name: Bambulab A1 Combo
entities:
  # Status e Progresso
  print_status: sensor.bambu_a1_print_status
  print_progress: sensor.bambu_a1_print_progress
  current_layer: sensor.bambu_a1_current_layer
  total_layers: sensor.bambu_a1_total_layer_count
  remaining_time: sensor.bambu_a1_remaining_time
  start_time: sensor.bambu_a1_start_time
  print_weight: sensor.bambu_a1_print_weight
  
  # Temperaturas
  nozzle_temp: sensor.bambu_a1_nozzle_temperature
  bed_temp: sensor.bambu_a1_bed_temperature
  nozzle_target: number.bambu_a1_nozzle_target_temperature
  bed_target: number.bambu_a1_bed_target_temperature
  
  # Sistema AMS
  active_tray: sensor.bambu_a1_active_tray
  ams_tray_1: sensor.bambu_a1_ams_tray_1
  ams_tray_2: sensor.bambu_a1_ams_tray_2
  ams_tray_3: sensor.bambu_a1_ams_tray_3
  ams_tray_4: sensor.bambu_a1_ams_tray_4
  
  # Mídia
  camera: camera.bambu_a1_camera
  cover_image: image.bambu_a1_cover_image
  
  # Controles
  pause_button: button.bambu_a1_pause_print
  resume_button: button.bambu_a1_resume_print
  stop_button: button.bambu_a1_stop_print
  
  # Erros
  hms_errors: sensor.bambu_a1_hms_errors

# Opções de exibição
show_ams: true
show_controls: true
show_camera: true
camera_position: right
```

### 📱 Configuração via Interface

Você pode configurar todas as entidades facilmente usando a interface visual do Home Assistant:

1. Adicione o card ao dashboard
2. Clique em "Configurar"
3. Preencha apenas as entidades que você possui
4. Use os placeholders como exemplo

### 📋 Configuração Básica (Mínima)

```yaml
type: custom:bambulab-card
name: Minha Bambulab A1
entities:
  print_status: sensor.bambu_a1_print_status
  camera: camera.bambu_a1_camera
```

### 🔄 Configuração Legado (Compatibilidade)

Ainda suportamos a configuração antiga para compatibilidade:

```yaml
type: custom:bambulab-card
entity: sensor.bambu_a1_print_status        # ⚠️ Modo legado
camera_entity: camera.bambu_a1_camera       # ⚠️ Modo legado
name: Bambulab A1 Combo
show_ams: true
show_controls: true
show_camera: true
camera_position: right
```

### 📖 Opções de Configuração

| Opção | Tipo | Padrão | Descrição |
|-------|------|---------|-----------|
| `name` | string | Bambulab Printer | Nome exibido no cabeçalho do card |
| `entities` | object | - | **Configuração individual de entidades (recomendado)** |
| `entity` | string | - | Entidade principal (modo legado) |
| `camera_entity` | string | - | Entidade da câmera (modo legado) |
| `show_ams` | boolean | true | Exibir seção do AMS Lite |
| `show_controls` | boolean | true | Exibir botões de controle |
| `show_temperature_graph` | boolean | false | Exibir gráfico de temperatura (futuro) |
| `show_camera` | boolean | true | Exibir feed da câmera |
| `camera_position` | string | right | Posição da câmera no layout |

### 🎯 Entidades Disponíveis

#### Status e Progresso
- `print_status` - Status atual da impressão
- `print_progress` - Progresso em porcentagem
- `current_layer` - Camada sendo impressa
- `total_layers` - Total de camadas do modelo
- `remaining_time` - Tempo restante estimado
- `start_time` - Hora de início da impressão
- `print_weight` - Peso do filamento usado

#### Temperaturas
- `nozzle_temp` - Temperatura atual do bico
- `bed_temp` - Temperatura atual da mesa
- `nozzle_target` - Temperatura alvo do bico
- `bed_target` - Temperatura alvo da mesa

#### Sistema AMS
- `active_tray` - Bandeja ativa no momento
- `ams_tray_1` até `ams_tray_4` - Status de cada bandeja

#### Mídia
- `camera` - Feed da câmera ao vivo
- `cover_image` - Imagem de preview do modelo

#### Controles
- `pause_button` - Botão para pausar impressão
- `resume_button` - Botão para retomar impressão
- `stop_button` - Botão para parar impressão

#### Diagnóstico
- `hms_errors` - Erros do sistema HMS

## Como Encontrar Suas Entidades

### 🔍 Método 1: Ferramentas de Desenvolvedor

1. Vá para **Ferramentas de Desenvolvedor** → **Estados**
2. Procure por `bambu` ou o nome da sua impressora
3. Copie os nomes das entidades para a configuração

### 🔍 Método 2: Integração Bambulab

As entidades típicas seguem este padrão (substitua `bambu_a1` pelo seu prefixo):

#### Sensores Comuns
```
sensor.bambu_a1_print_status
sensor.bambu_a1_print_progress
sensor.bambu_a1_current_layer
sensor.bambu_a1_total_layer_count
sensor.bambu_a1_remaining_time
sensor.bambu_a1_start_time
sensor.bambu_a1_print_weight
sensor.bambu_a1_nozzle_temperature
sensor.bambu_a1_bed_temperature
sensor.bambu_a1_active_tray
sensor.bambu_a1_ams_tray_1
sensor.bambu_a1_ams_tray_2
sensor.bambu_a1_ams_tray_3
sensor.bambu_a1_ams_tray_4
sensor.bambu_a1_hms_errors
```

#### Controles Comuns
```
number.bambu_a1_nozzle_target_temperature
number.bambu_a1_bed_target_temperature
button.bambu_a1_pause_print
button.bambu_a1_resume_print
button.bambu_a1_stop_print
```

#### Mídia Comum
```
camera.bambu_a1_camera
image.bambu_a1_cover_image
```

### 💡 Dica
Você não precisa configurar todas as entidades! Configure apenas as que você possui e deseja exibir.

## Exemplos de Uso

### 🎨 Card Completo (Recomendado)
```yaml
type: custom:bambulab-card
name: Bambulab A1 Combo
entities:
  print_status: sensor.bambu_a1_print_status
  print_progress: sensor.bambu_a1_print_progress
  current_layer: sensor.bambu_a1_current_layer
  total_layers: sensor.bambu_a1_total_layer_count
  remaining_time: sensor.bambu_a1_remaining_time
  nozzle_temp: sensor.bambu_a1_nozzle_temperature
  bed_temp: sensor.bambu_a1_bed_temperature
  nozzle_target: number.bambu_a1_nozzle_target_temperature
  bed_target: number.bambu_a1_bed_target_temperature
  active_tray: sensor.bambu_a1_active_tray
  ams_tray_1: sensor.bambu_a1_ams_tray_1
  ams_tray_2: sensor.bambu_a1_ams_tray_2
  ams_tray_3: sensor.bambu_a1_ams_tray_3
  ams_tray_4: sensor.bambu_a1_ams_tray_4
  camera: camera.bambu_a1_camera
  cover_image: image.bambu_a1_cover_image
  pause_button: button.bambu_a1_pause_print
  resume_button: button.bambu_a1_resume_print
  stop_button: button.bambu_a1_stop_print
show_ams: true
show_controls: true
show_camera: true
camera_position: right
```

### 📱 Card Simples (Apenas Status)
```yaml
type: custom:bambulab-card
name: Status Rápido
entities:
  print_status: sensor.bambu_a1_print_status
  print_progress: sensor.bambu_a1_print_progress
show_ams: false
show_controls: false
show_camera: false
```

### 📷 Card com Câmera no Topo
```yaml
type: custom:bambulab-card
name: Bambulab A1
entities:
  print_status: sensor.bambu_a1_print_status
  camera: camera.bambu_a1_camera
show_camera: true
camera_position: top
```

### 🎨 Card sem AMS (Para impressoras sem AMS)
```yaml
type: custom:bambulab-card
name: Bambulab A1 Mini
entities:
  print_status: sensor.bambu_a1_mini_print_status
  print_progress: sensor.bambu_a1_mini_print_progress
  nozzle_temp: sensor.bambu_a1_mini_nozzle_temperature
  bed_temp: sensor.bambu_a1_mini_bed_temperature
  camera: camera.bambu_a1_mini_camera
show_ams: false
show_controls: true
show_camera: true
```

### 🔄 Configuração Legado (Para Compatibilidade)
```yaml
type: custom:bambulab-card
entity: sensor.bambu_a1_print_status
camera_entity: camera.bambu_a1_camera
name: Impressora do Escritório
show_camera: false
```

## Solução de Problemas

### 🚫 O card não aparece
1. Verifique se o recurso foi adicionado corretamente no Lovelace
2. Limpe o cache do navegador (Ctrl+F5)
3. Verifique o console do navegador para erros (F12)
4. Confirme que o HACS instalou o card corretamente

### 📷 Câmera não funciona
1. Verifique se a entidade da câmera está correta na configuração
2. Confirme que a integração Bambulab está configurada com suporte a câmera
3. Verifique se a impressora está em modo LAN ou conectada à nuvem
4. Teste a entidade da câmera diretamente no Home Assistant

### 🌡️ Temperaturas não atualizam
1. Verifique se a impressora está em modo LAN-Only para controle total
2. Confirme que as entidades de temperatura existem em **Ferramentas de Desenvolvedor** → **Estados**
3. Verifique se os nomes das entidades estão corretos na configuração

### 🎨 AMS não mostra informações
1. Verifique se o AMS Lite está conectado fisicamente e configurado na impressora
2. Confirme que as entidades `sensor.bambu_*_ams_tray_*` existem
3. Configure manualmente cada entidade AMS na nova interface
4. Certifique-se de que `show_ams: true` está na configuração

### ⚠️ Card mostra "OFFLINE"
1. Verifique se a entidade `print_status` está configurada corretamente
2. Confirme que a impressora está ligada e conectada ao Home Assistant
3. Teste a entidade de status diretamente no Home Assistant
4. Use a nova configuração individual de entidades para melhor controle

### 🔄 Migrando da Configuração Legado
1. Substitua `entity:` por `entities:` na configuração
2. Use a interface visual para configurar cada entidade
3. Mantenha a configuração antiga se estiver funcionando (suporte legado mantido)

### 🔍 Como encontrar nomes das entidades
1. Vá para **Ferramentas de Desenvolvedor** → **Estados**
2. Procure por "bambu" ou o nome da sua impressora
3. Copie os nomes exatos das entidades
4. Use placeholders do editor como referência

## Desenvolvimento

### Estrutura do Projeto
```
bambulab-card/
├── bambulab-card.js    # Código principal do card
├── hacs.json           # Configuração HACS
├── README.md           # Documentação
└── info.md            # Informações para HACS
```

### Contribuindo
1. Fork o projeto
2. Crie sua branch de feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

## Licença

MIT License - veja o arquivo LICENSE para detalhes

## Créditos

- Desenvolvido para a comunidade Home Assistant
- Baseado na integração [greghesp/ha-bambulab](https://github.com/greghesp/ha-bambulab)
- Inspirado em outros cards da comunidade HACS

## Suporte

- 🐛 [Reportar Bug](https://github.com/seu-usuario/bambulab-card/issues)
- 💡 [Solicitar Feature](https://github.com/seu-usuario/bambulab-card/issues)
- 💬 [Discussões](https://github.com/seu-usuario/bambulab-card/discussions)

## Changelog

### v2.0.0 (2024-01-13)
- 🆕 **NOVA**: Configuração individual de entidades
- 🎮 **NOVA**: Interface visual melhorada para configuração
- 🔄 **MELHORIA**: Compatibilidade com configuração legado
- 📱 **MELHORIA**: Editor mais intuitivo com seções organizadas
- 🔧 **MELHORIA**: Melhor tratamento de entidades ausentes
- 📚 **MELHORIA**: Documentação completamente atualizada

### v1.0.0 (2024-01-13)

### v1.0.0 (2024-01-13)
- Lançamento inicial
- Suporte completo para Bambulab A1 Combo com AMS Lite
- Feed de câmera ao vivo
- Controles de impressão
- Monitoramento de temperatura
- Sistema AMS com 4 bandejas
- Design responsivo