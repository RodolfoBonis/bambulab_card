# Bambulab Card

Monitor sua impressora Bambulab 3D com este card customizado para Home Assistant!

## Recursos Principais

- 📊 Monitoramento em tempo real do progresso da impressão
- 📷 Feed da câmera ao vivo com opção de tela cheia  
- 🌡️ Temperaturas do bico e mesa com valores atuais/alvo
- 🎨 Visualização completa do sistema AMS Lite (4 bandejas)
- ⏸️ Controles de impressão (pausar/retomar/parar)
- 📱 Design responsivo para desktop e mobile

## Compatibilidade

- **Impressoras suportadas**: Todas as impressoras Bambulab (otimizado para A1 Combo com AMS Lite)
- **Home Assistant**: 2023.1.0+
- **Requer**: Integração Bambulab (greghesp/ha-bambulab)

## Configuração Rápida

```yaml
type: custom:bambulab-card
entity: sensor.bambu_a1_print_status
camera_entity: camera.bambu_a1_camera
name: Minha Bambulab A1
```

## Links

- [Documentação completa](https://github.com/seu-usuario/bambulab-card)
- [Reportar problemas](https://github.com/seu-usuario/bambulab-card/issues)
- [Changelog](https://github.com/seu-usuario/bambulab-card/releases)