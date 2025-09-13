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

### Configuração Básica

```yaml
type: custom:bambulab-card
entity: sensor.bambu_a1_print_status
camera_entity: camera.bambu_a1_camera
name: Minha Bambulab A1
```

### Configuração Completa

```yaml
type: custom:bambulab-card
entity: sensor.bambu_a1_print_status        # Entidade principal (obrigatório)
camera_entity: camera.bambu_a1_camera       # Entidade da câmera
name: Bambulab A1 Combo                     # Nome exibido no card
show_ams: true                               # Mostrar seção AMS (padrão: true)
show_controls: true                          # Mostrar botões de controle (padrão: true)
show_temperature_graph: false               # Mostrar gráfico de temperatura (padrão: false)
show_camera: true                            # Mostrar feed da câmera (padrão: true)
camera_position: right                       # Posição da câmera: 'right', 'top', 'left' (padrão: right)
```

### Opções de Configuração

| Opção | Tipo | Padrão | Descrição |
|-------|------|---------|-----------|
| `entity` | string | **obrigatório** | Entidade do sensor de status da impressora |
| `camera_entity` | string | - | Entidade da câmera da impressora |
| `name` | string | Bambulab Printer | Nome exibido no cabeçalho do card |
| `show_ams` | boolean | true | Exibir seção do AMS Lite |
| `show_controls` | boolean | true | Exibir botões de controle |
| `show_temperature_graph` | boolean | false | Exibir gráfico de temperatura (futuro) |
| `show_camera` | boolean | true | Exibir feed da câmera |
| `camera_position` | string | right | Posição da câmera no layout |

## Entidades Utilizadas

O card utiliza automaticamente as seguintes entidades baseadas no prefixo da entidade principal:

### Sensores
- `sensor.bambu_a1_print_status` - Status da impressão
- `sensor.bambu_a1_print_progress` - Progresso em %
- `sensor.bambu_a1_current_layer` - Camada atual
- `sensor.bambu_a1_total_layer_count` - Total de camadas
- `sensor.bambu_a1_remaining_time` - Tempo restante
- `sensor.bambu_a1_start_time` - Hora de início
- `sensor.bambu_a1_print_weight` - Peso do filamento usado
- `sensor.bambu_a1_nozzle_temperature` - Temperatura do bico
- `sensor.bambu_a1_bed_temperature` - Temperatura da mesa
- `sensor.bambu_a1_active_tray` - Bandeja ativa do AMS
- `sensor.bambu_a1_ams_tray_1` até `_4` - Status das bandejas
- `sensor.bambu_a1_hms_errors` - Erros HMS

### Controles
- `number.bambu_a1_nozzle_target_temperature` - Temperatura alvo do bico
- `number.bambu_a1_bed_target_temperature` - Temperatura alvo da mesa
- `button.bambu_a1_pause_print` - Pausar impressão
- `button.bambu_a1_resume_print` - Retomar impressão
- `button.bambu_a1_stop_print` - Parar impressão

### Mídia
- `camera.bambu_a1_camera` - Feed da câmera
- `image.bambu_a1_cover_image` - Imagem de preview

## Exemplos de Uso

### Card Simples (sem câmera)
```yaml
type: custom:bambulab-card
entity: sensor.bambu_a1_print_status
name: Impressora do Escritório
show_camera: false
```

### Card com Câmera no Topo
```yaml
type: custom:bambulab-card
entity: sensor.bambu_a1_print_status
camera_entity: camera.bambu_a1_camera
camera_position: top
name: Bambulab A1
```

### Card Minimalista
```yaml
type: custom:bambulab-card
entity: sensor.bambu_a1_print_status
show_ams: false
show_controls: false
show_camera: false
name: Status Rápido
```

## Solução de Problemas

### O card não aparece
1. Verifique se o recurso foi adicionado corretamente
2. Limpe o cache do navegador (Ctrl+F5)
3. Verifique o console do navegador para erros (F12)

### Câmera não funciona
1. Verifique se a entidade da câmera está correta
2. Confirme que a integração Bambulab está configurada com suporte a câmera
3. Verifique se a impressora está em modo LAN

### Temperaturas não atualizam
1. Verifique se a impressora está em modo LAN-Only para controle total
2. Confirme que as entidades de temperatura existem

### AMS não mostra informações
1. Verifique se o AMS Lite está conectado e configurado
2. Confirme que as entidades `sensor.bambu_a1_ams_tray_*` existem

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

### v1.0.0 (2024-01-13)
- Lançamento inicial
- Suporte completo para Bambulab A1 Combo com AMS Lite
- Feed de câmera ao vivo
- Controles de impressão
- Monitoramento de temperatura
- Sistema AMS com 4 bandejas
- Design responsivo