class BambulabCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._config = {};
    this._hass = null;
  }

  static getStubConfig() {
    return {
      entity: 'sensor.bambu_a1_print_status',
      camera_entity: 'camera.bambu_a1_camera',
      name: 'Bambulab A1',
      show_ams: true,
      show_controls: true,
      show_temperature_graph: false,
      show_camera: true,
      camera_position: 'right'
    };
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('Please define a print status entity');
    }
    this._config = {
      name: 'Bambulab Printer',
      show_ams: true,
      show_controls: true,
      show_temperature_graph: false,
      show_camera: true,
      camera_position: 'right',
      ...config
    };
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    this.updateCard();
  }

  render() {
    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          --bambu-primary: var(--primary-color, #03a9f4);
          --bambu-success: var(--success-color, #4caf50);
          --bambu-warning: var(--warning-color, #ff9800);
          --bambu-error: var(--error-color, #f44336);
          --bambu-info: var(--info-color, #2196f3);
        }

        .card {
          background: var(--ha-card-background, var(--card-background-color, white));
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14));
          color: var(--primary-text-color);
          display: flex;
          flex-direction: column;
          padding: 16px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .printer-name {
          font-size: 1.5em;
          font-weight: 500;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.9em;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-idle {
          background: var(--bambu-info);
          color: white;
        }

        .status-printing {
          background: var(--bambu-success);
          color: white;
        }

        .status-paused {
          background: var(--bambu-warning);
          color: white;
        }

        .status-error {
          background: var(--bambu-error);
          color: white;
        }

        .main-content {
          display: flex;
          gap: 16px;
        }

        .main-content.camera-right {
          flex-direction: row;
        }

        .main-content.camera-top {
          flex-direction: column;
        }

        .info-section {
          flex: 1;
        }

        .camera-section {
          flex: 0 0 40%;
          min-width: 300px;
        }

        .camera-container {
          position: relative;
          background: #000;
          border-radius: 8px;
          overflow: hidden;
          aspect-ratio: 16/9;
        }

        .camera-container img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .camera-fullscreen {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          cursor: pointer;
          z-index: 10;
        }

        .preview-image {
          width: 100%;
          max-width: 200px;
          height: auto;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .progress-section {
          margin-bottom: 20px;
        }

        .progress-bar-container {
          background: var(--divider-color);
          border-radius: 8px;
          height: 30px;
          position: relative;
          overflow: hidden;
          margin: 8px 0;
        }

        .progress-bar {
          background: linear-gradient(90deg, var(--bambu-primary), var(--bambu-success));
          height: 100%;
          transition: width 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .progress-text {
          color: white;
          font-weight: bold;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
          mix-blend-mode: difference;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 20px;
        }

        .info-item {
          background: var(--secondary-background-color);
          padding: 8px 12px;
          border-radius: 8px;
        }

        .info-label {
          font-size: 0.8em;
          color: var(--secondary-text-color);
          margin-bottom: 4px;
        }

        .info-value {
          font-size: 1.1em;
          font-weight: 500;
        }

        .temperature-section {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
        }

        .temp-card {
          flex: 1;
          background: var(--secondary-background-color);
          padding: 12px;
          border-radius: 8px;
        }

        .temp-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .temp-icon {
          width: 24px;
          height: 24px;
        }

        .temp-values {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .temp-current {
          font-size: 1.5em;
          font-weight: bold;
        }

        .temp-target {
          color: var(--secondary-text-color);
        }

        .ams-section {
          margin-bottom: 20px;
        }

        .ams-title {
          font-size: 1.1em;
          font-weight: 500;
          margin-bottom: 12px;
        }

        .ams-trays {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .ams-tray {
          background: var(--secondary-background-color);
          border-radius: 8px;
          padding: 12px;
          text-align: center;
          position: relative;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .ams-tray.active {
          border-color: var(--bambu-primary);
          box-shadow: 0 0 8px rgba(3, 169, 244, 0.3);
        }

        .ams-tray-number {
          position: absolute;
          top: 4px;
          left: 8px;
          font-size: 0.8em;
          font-weight: bold;
          color: var(--secondary-text-color);
        }

        .filament-color {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          margin: 8px auto;
          border: 2px solid var(--divider-color);
        }

        .filament-type {
          font-size: 0.9em;
          font-weight: 500;
          margin-bottom: 4px;
        }

        .filament-remaining {
          font-size: 0.8em;
          color: var(--secondary-text-color);
        }

        .filament-humidity {
          font-size: 0.7em;
          color: var(--secondary-text-color);
          margin-top: 4px;
        }

        .controls-section {
          display: flex;
          gap: 8px;
          margin-top: 16px;
        }

        .control-btn {
          flex: 1;
          padding: 12px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1em;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .control-btn:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .control-btn.pause {
          background: var(--bambu-warning);
        }

        .control-btn.stop {
          background: var(--bambu-error);
        }

        .control-btn.resume {
          background: var(--bambu-success);
        }

        .control-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-section {
          background: var(--error-color);
          color: white;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .error-title {
          font-weight: bold;
          margin-bottom: 4px;
        }

        @media (max-width: 768px) {
          .main-content {
            flex-direction: column;
          }
          
          .camera-section {
            flex: 1;
            min-width: 100%;
          }

          .ams-trays {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      </style>

      <ha-card class="card">
        <div class="header">
          <div class="printer-name">${this._config.name}</div>
          <div class="status-badge" id="status-badge">Offline</div>
        </div>

        <div id="error-section" class="error-section" style="display: none;">
          <div class="error-title">Erro HMS</div>
          <div id="error-message"></div>
        </div>

        <div class="main-content camera-${this._config.camera_position}">
          <div class="info-section">
            <div class="progress-section" id="progress-section" style="display: none;">
              <img id="preview-image" class="preview-image" style="display: none;">
              <div class="progress-bar-container">
                <div class="progress-bar" id="progress-bar" style="width: 0%">
                  <span class="progress-text" id="progress-text">0%</span>
                </div>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Camada</div>
                  <div class="info-value" id="layer-info">-/-</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Tempo Restante</div>
                  <div class="info-value" id="time-remaining">--:--</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Tempo Decorrido</div>
                  <div class="info-value" id="time-elapsed">--:--</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Filamento Usado</div>
                  <div class="info-value" id="filament-used">0g</div>
                </div>
              </div>
            </div>

            <div class="temperature-section">
              <div class="temp-card">
                <div class="temp-header">
                  <svg class="temp-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,2A2,2 0 0,1 14,4V14.5A4,4 0 0,1 12,18A4,4 0 0,1 10,14.5V4A2,2 0 0,1 12,2M12,4A1,1 0 0,0 11,5V15.5A3,3 0 0,0 12,17A3,3 0 0,0 13,15.5V5A1,1 0 0,0 12,4Z"/>
                  </svg>
                  <span>Bico</span>
                </div>
                <div class="temp-values">
                  <span class="temp-current" id="nozzle-temp">0°C</span>
                  <span class="temp-target" id="nozzle-target">/ 0°C</span>
                </div>
              </div>

              <div class="temp-card">
                <div class="temp-header">
                  <svg class="temp-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4,4H20V7H4V4M4,9H20V12H4V9M4,14H20V17H4V14M4,19H20V22H4V19Z"/>
                  </svg>
                  <span>Mesa</span>
                </div>
                <div class="temp-values">
                  <span class="temp-current" id="bed-temp">0°C</span>
                  <span class="temp-target" id="bed-target">/ 0°C</span>
                </div>
              </div>
            </div>

            <div class="ams-section" id="ams-section" style="display: ${this._config.show_ams ? 'block' : 'none'};">
              <div class="ams-title">AMS Lite</div>
              <div class="ams-trays" id="ams-trays">
                <!-- AMS trays will be generated dynamically -->
              </div>
            </div>

            <div class="controls-section" id="controls-section" style="display: ${this._config.show_controls ? 'flex' : 'none'};">
              <button class="control-btn pause" id="btn-pause">Pausar</button>
              <button class="control-btn resume" id="btn-resume" style="display: none;">Retomar</button>
              <button class="control-btn stop" id="btn-stop">Parar</button>
            </div>
          </div>

          ${this._config.show_camera && this._config.camera_entity ? `
            <div class="camera-section">
              <div class="camera-container">
                <img id="camera-feed" src="" alt="Camera Feed">
                <button class="camera-fullscreen" id="btn-fullscreen">⛶</button>
              </div>
            </div>
          ` : ''}
        </div>
      </ha-card>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const pauseBtn = this.shadowRoot.getElementById('btn-pause');
    const resumeBtn = this.shadowRoot.getElementById('btn-resume');
    const stopBtn = this.shadowRoot.getElementById('btn-stop');
    const fullscreenBtn = this.shadowRoot.getElementById('btn-fullscreen');

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.callService('pause'));
    }

    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => this.callService('resume'));
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja parar a impressão?')) {
          this.callService('stop');
        }
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }
  }

  callService(action) {
    if (!this._hass) return;

    const service = action === 'pause' ? 'pause_print' : 
                   action === 'resume' ? 'resume_print' : 
                   'stop_print';

    this._hass.callService('button', 'press', {
      entity_id: `button.${this._config.entity.split('.')[1]}_${service}`
    });
  }

  toggleFullscreen() {
    const cameraImg = this.shadowRoot.getElementById('camera-feed');
    if (!cameraImg) return;

    if (!document.fullscreenElement) {
      cameraImg.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  updateCard() {
    if (!this._hass || !this.shadowRoot) return;

    const mainEntity = this._hass.states[this._config.entity];
    if (!mainEntity) return;

    // Update status
    const statusBadge = this.shadowRoot.getElementById('status-badge');
    const status = mainEntity.state;
    if (statusBadge) {
      statusBadge.textContent = this.translateStatus(status);
      statusBadge.className = `status-badge status-${status.toLowerCase()}`;
    }

    // Update camera
    if (this._config.show_camera && this._config.camera_entity) {
      this.updateCamera();
    }

    // Update temperatures
    this.updateTemperatures();

    // Update progress
    this.updateProgress();

    // Update AMS
    if (this._config.show_ams) {
      this.updateAMS();
    }

    // Update controls
    this.updateControls(status);

    // Update errors
    this.updateErrors();
  }

  updateCamera() {
    const cameraEntity = this._hass.states[this._config.camera_entity];
    if (!cameraEntity) return;

    const cameraImg = this.shadowRoot.getElementById('camera-feed');
    if (cameraImg) {
      const token = cameraEntity.attributes.access_token;
      const baseUrl = `${window.location.origin}`;
      cameraImg.src = `${baseUrl}/api/camera_proxy_stream/${this._config.camera_entity}?token=${token}&t=${Date.now()}`;
    }
  }

  updateTemperatures() {
    const entityPrefix = this._config.entity.split('_')[0] + '_' + this._config.entity.split('_')[1];
    
    // Nozzle temperature
    const nozzleTemp = this._hass.states[`sensor.${entityPrefix}_nozzle_temperature`];
    const nozzleTarget = this._hass.states[`number.${entityPrefix}_nozzle_target_temperature`];
    
    if (nozzleTemp) {
      this.shadowRoot.getElementById('nozzle-temp').textContent = `${Math.round(nozzleTemp.state)}°C`;
    }
    if (nozzleTarget) {
      this.shadowRoot.getElementById('nozzle-target').textContent = `/ ${Math.round(nozzleTarget.state)}°C`;
    }

    // Bed temperature
    const bedTemp = this._hass.states[`sensor.${entityPrefix}_bed_temperature`];
    const bedTarget = this._hass.states[`number.${entityPrefix}_bed_target_temperature`];
    
    if (bedTemp) {
      this.shadowRoot.getElementById('bed-temp').textContent = `${Math.round(bedTemp.state)}°C`;
    }
    if (bedTarget) {
      this.shadowRoot.getElementById('bed-target').textContent = `/ ${Math.round(bedTarget.state)}°C`;
    }
  }

  updateProgress() {
    const entityPrefix = this._config.entity.split('_')[0] + '_' + this._config.entity.split('_')[1];
    
    const progressEntity = this._hass.states[`sensor.${entityPrefix}_print_progress`];
    const layerEntity = this._hass.states[`sensor.${entityPrefix}_current_layer`];
    const totalLayersEntity = this._hass.states[`sensor.${entityPrefix}_total_layer_count`];
    const remainingEntity = this._hass.states[`sensor.${entityPrefix}_remaining_time`];
    const startTimeEntity = this._hass.states[`sensor.${entityPrefix}_start_time`];
    const printWeightEntity = this._hass.states[`sensor.${entityPrefix}_print_weight`];
    const coverImageEntity = this._hass.states[`image.${entityPrefix}_cover_image`];

    const progressSection = this.shadowRoot.getElementById('progress-section');
    const isPrinting = progressEntity && progressEntity.state !== 'unknown' && parseFloat(progressEntity.state) > 0;

    if (progressSection) {
      progressSection.style.display = isPrinting ? 'block' : 'none';
    }

    if (!isPrinting) return;

    // Update progress bar
    if (progressEntity) {
      const progress = parseFloat(progressEntity.state);
      const progressBar = this.shadowRoot.getElementById('progress-bar');
      const progressText = this.shadowRoot.getElementById('progress-text');
      
      if (progressBar) {
        progressBar.style.width = `${progress}%`;
      }
      if (progressText) {
        progressText.textContent = `${Math.round(progress)}%`;
      }
    }

    // Update layer info
    if (layerEntity && totalLayersEntity) {
      const layerInfo = this.shadowRoot.getElementById('layer-info');
      if (layerInfo) {
        layerInfo.textContent = `${layerEntity.state}/${totalLayersEntity.state}`;
      }
    }

    // Update time remaining
    if (remainingEntity) {
      const timeRemaining = this.shadowRoot.getElementById('time-remaining');
      if (timeRemaining) {
        timeRemaining.textContent = this.formatTime(parseInt(remainingEntity.state));
      }
    }

    // Update elapsed time
    if (startTimeEntity) {
      const timeElapsed = this.shadowRoot.getElementById('time-elapsed');
      if (timeElapsed) {
        const startTime = new Date(startTimeEntity.state);
        const now = new Date();
        const elapsedMinutes = Math.floor((now - startTime) / 60000);
        timeElapsed.textContent = this.formatTime(elapsedMinutes);
      }
    }

    // Update filament used
    if (printWeightEntity) {
      const filamentUsed = this.shadowRoot.getElementById('filament-used');
      if (filamentUsed) {
        filamentUsed.textContent = `${Math.round(parseFloat(printWeightEntity.state))}g`;
      }
    }

    // Update preview image
    if (coverImageEntity && coverImageEntity.attributes.entity_picture) {
      const previewImage = this.shadowRoot.getElementById('preview-image');
      if (previewImage) {
        previewImage.src = coverImageEntity.attributes.entity_picture;
        previewImage.style.display = 'block';
      }
    }
  }

  updateAMS() {
    const entityPrefix = this._config.entity.split('_')[0] + '_' + this._config.entity.split('_')[1];
    const amsTraysContainer = this.shadowRoot.getElementById('ams-trays');
    const activeTrayEntity = this._hass.states[`sensor.${entityPrefix}_active_tray`];
    
    if (!amsTraysContainer) return;

    amsTraysContainer.innerHTML = '';

    for (let i = 1; i <= 4; i++) {
      const trayEntity = this._hass.states[`sensor.${entityPrefix}_ams_tray_${i}`];
      
      const trayDiv = document.createElement('div');
      trayDiv.className = 'ams-tray';
      
      if (activeTrayEntity && parseInt(activeTrayEntity.state) === i) {
        trayDiv.classList.add('active');
      }

      if (trayEntity && trayEntity.state !== 'Empty') {
        const color = trayEntity.attributes.color || '#808080';
        const type = trayEntity.attributes.type || 'Unknown';
        const remaining = trayEntity.attributes.remaining || 0;
        const humidity = trayEntity.attributes.humidity || 0;

        trayDiv.innerHTML = `
          <div class="ams-tray-number">${i}</div>
          <div class="filament-color" style="background-color: #${color}"></div>
          <div class="filament-type">${type}</div>
          <div class="filament-remaining">${remaining}%</div>
          <div class="filament-humidity">💧 ${humidity}%</div>
        `;
      } else {
        trayDiv.innerHTML = `
          <div class="ams-tray-number">${i}</div>
          <div class="filament-color" style="background-color: #e0e0e0"></div>
          <div class="filament-type">Vazio</div>
        `;
      }

      amsTraysContainer.appendChild(trayDiv);
    }
  }

  updateControls(status) {
    const pauseBtn = this.shadowRoot.getElementById('btn-pause');
    const resumeBtn = this.shadowRoot.getElementById('btn-resume');
    const stopBtn = this.shadowRoot.getElementById('btn-stop');

    if (!pauseBtn || !resumeBtn || !stopBtn) return;

    if (status === 'printing') {
      pauseBtn.style.display = 'flex';
      resumeBtn.style.display = 'none';
      pauseBtn.disabled = false;
      stopBtn.disabled = false;
    } else if (status === 'paused') {
      pauseBtn.style.display = 'none';
      resumeBtn.style.display = 'flex';
      resumeBtn.disabled = false;
      stopBtn.disabled = false;
    } else {
      pauseBtn.style.display = 'flex';
      resumeBtn.style.display = 'none';
      pauseBtn.disabled = true;
      stopBtn.disabled = true;
    }
  }

  updateErrors() {
    const entityPrefix = this._config.entity.split('_')[0] + '_' + this._config.entity.split('_')[1];
    const errorEntity = this._hass.states[`sensor.${entityPrefix}_hms_errors`];
    
    const errorSection = this.shadowRoot.getElementById('error-section');
    const errorMessage = this.shadowRoot.getElementById('error-message');

    if (!errorSection || !errorMessage) return;

    if (errorEntity && errorEntity.state && errorEntity.state !== 'unknown' && errorEntity.state !== '') {
      errorSection.style.display = 'block';
      errorMessage.textContent = errorEntity.state;
    } else {
      errorSection.style.display = 'none';
    }
  }

  formatTime(minutes) {
    if (!minutes || minutes < 0) return '--:--';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  translateStatus(status) {
    const translations = {
      'idle': 'Inativo',
      'printing': 'Imprimindo',
      'paused': 'Pausado',
      'error': 'Erro',
      'offline': 'Offline',
      'unknown': 'Desconhecido'
    };
    return translations[status.toLowerCase()] || status;
  }

  getCardSize() {
    return this._config.show_camera ? 5 : 3;
  }

  static getConfigElement() {
    return document.createElement('bambulab-card-editor');
  }
}

// Editor for the card
class BambulabCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this.render();
  }

  render() {
    if (!this.innerHTML) {
      this.innerHTML = `
        <div class="card-config">
          <paper-input
            label="Entity (required)"
            value="${this._config.entity || ''}"
            @value-changed="${this._valueChanged}"
            .configValue="${'entity'}"
          ></paper-input>
          <paper-input
            label="Camera Entity"
            value="${this._config.camera_entity || ''}"
            @value-changed="${this._valueChanged}"
            .configValue="${'camera_entity'}"
          ></paper-input>
          <paper-input
            label="Name"
            value="${this._config.name || ''}"
            @value-changed="${this._valueChanged}"
            .configValue="${'name'}"
          ></paper-input>
          <ha-switch
            ?checked=${this._config.show_ams !== false}
            .configValue="${'show_ams'}"
            @change="${this._valueChanged}"
          >Show AMS</ha-switch>
          <ha-switch
            ?checked=${this._config.show_controls !== false}
            .configValue="${'show_controls'}"
            @change="${this._valueChanged}"
          >Show Controls</ha-switch>
          <ha-switch
            ?checked=${this._config.show_camera !== false}
            .configValue="${'show_camera'}"
            @change="${this._valueChanged}"
          >Show Camera</ha-switch>
        </div>
      `;
    }
  }

  _valueChanged(ev) {
    if (!this._config || !this.hass) return;

    const target = ev.target;
    const configValue = target.configValue;

    if (configValue) {
      if (target.checked !== undefined) {
        this._config[configValue] = target.checked;
      } else {
        this._config[configValue] = target.value;
      }
    }

    const event = new CustomEvent('config-changed', {
      detail: { config: this._config },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  set hass(hass) {
    this._hass = hass;
  }
}

// Register the card and editor
customElements.define('bambulab-card', BambulabCard);
customElements.define('bambulab-card-editor', BambulabCardEditor);

// Add to HACS
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'bambulab-card',
  name: 'Bambulab Card',
  description: 'Monitor your Bambulab 3D printer',
  preview: true,
  documentationURL: 'https://github.com/yourusername/bambulab-card'
});

console.info(
  `%c BAMBULAB-CARD %c Version 1.0.0 `,
  'color: white; font-weight: bold; background: #03a9f4',
  'color: #03a9f4; font-weight: bold; background: white'
);