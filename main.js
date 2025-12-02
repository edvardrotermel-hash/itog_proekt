
// Основная функция создания карты
function initMainMap() {
    // Базовые слои
    const osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true
    });

    const googleSatellite = new ol.layer.Tile({
        source: new ol.source.XYZ({
            url: 'https://mt1.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}'
        }),
        visible: false
    });

    // Создаем источники для векторных данных
    const treeSource = new ol.source.Vector({
        url: 'Dревостой Верещагинского МО.geojson',
        format: new ol.format.GeoJSON()
    });

    const hbrSource = new ol.source.Vector({
        url: 'Xвойные лесные насаждения.geojson',
        format: new ol.format.GeoJSON()
    });

    // Слой пород деревьев
    const treeLayer = new ol.layer.Vector({
        source: treeSource,
        style: function(feature) {
            const type = feature.get('VMR');
            let color;
            
            // Простая проверка типа дерева и назначение цвета
            if (type === 'Береза') color = '#0016ff';
            else if (type === 'Ель') color = ' #a000ff';
            else if (type === 'Клен') color = '#ff0600';
            else if (type === 'Лиственница') color = '#ffac28';
            else if (type === 'Липа') color = '#faff00';
            else if (type === 'Ольха Серая') color = '#00a04f';
            else if (type === 'Осина') color = '#00ff4e';
            else if (type === 'Пихта') color = '#5400f8';
            else if (type === 'Сосна') color = '#ff6f00';
            else color = '#999999'; // Цвет по умолчанию
            
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: color
                }),
                stroke: new ol.style.Stroke({
                    color: '#34495e',
                    width: 1
                })
            });
        },
        visible: true
    });

    // Слой индекса HBR
    const hbrLayer = new ol.layer.Vector({
        source: hbrSource,
        style: function(feature) {
            const value = parseFloat(feature.get('hbr_index') || feature.get('Среднее начение индекса') || 0);
            let color;
            
            // Проверяем диапазон значений HBR
            if (value >= 0.52 && value < 0.56) color = '#00ff00';
            else if (value >= 0.56 && value < 0.59) color = '#66ff00';
            else if (value >= 0.59 && value < 0.63) color = '#ccff00';
            else if (value >= 0.63 && value < 0.67) color = '#ffcc00';
            else if (value >= 0.67 && value < 0.71) color = '#ff6600';
            else if (value >= 0.71 && value <= 0.75) color = '#ff0000';
            else color = '#BDC3C7'; // Цвет по умолчанию
            
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: color
                }),
                stroke: new ol.style.Stroke({
                    color: '#2c3e50',
                    width: 1
                })
            });
        },
        visible: true
    });

    // Создание карты
    const map = new ol.Map({
        target: 'mainMap',
        layers: [osmLayer, googleSatellite, treeLayer, hbrLayer],
        view: new ol.View({
            center: ol.proj.fromLonLat([54.661956984221604, 58.06831565495865]),
            zoom: 13
        })
    });

    // Управление слоями
    setupLayerControls(osmLayer, googleSatellite, hbrLayer, treeLayer);

    return map;
}

// Настройка переключателей слоев
function setupLayerControls(osmLayer, googleLayer, hbrLayer, treesLayer) {
    const osmCheckbox = document.getElementById('osm-layer');
    const googleCheckbox = document.getElementById('google-layer');
    const hbrCheckbox = document.getElementById('hbr-layer');
    const treesCheckbox = document.getElementById('trees-layer');

    // Обработчики для базовых слоев
    osmCheckbox.addEventListener('change', function() {
        if (this.checked) {
            osmLayer.setVisible(true);
            googleLayer.setVisible(false);
        }
    });

    googleCheckbox.addEventListener('change', function() {
        if (this.checked) {
            osmLayer.setVisible(false);
            googleLayer.setVisible(true);
        }
    });

    // Обработчики для векторных слоев
    hbrCheckbox.addEventListener('change', function() {
        hbrLayer.setVisible(this.checked);
    });

    treesCheckbox.addEventListener('change', function() {
        treesLayer.setVisible(this.checked);
    });
}

// Заполнение легенды
function populateLegends() {
    const treeLegend = document.getElementById('tree-legend');
    const hbrLegend = document.getElementById('hbr-legend');

    // Легенда для деревьев
    const treeItems = [
        {name: 'Береза', color: '#0016ff'},
        {name: 'Ель', color: '#a000ff'},
        {name: 'Клен', color: '#ff0600'},
        {name: 'Лиственница', color: '#ffac28'},
        {name: 'Липа', color: '#faff00'},
        {name: 'Ольха Серая', color: '#00a04f'},
        {name: 'Осина', color: '#00ff4e'},
        {name: 'Пихта', color: '#5400f8'},
        {name: 'Сосна', color: '#ff6f00'},
        {name: 'Нет данных', color: '#999999'}
    ];

    treeItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'legend-item';
        div.innerHTML = `<div class="legend-color" style="background-color: ${item.color}"></div><span class="legend-label">${item.name}</span>`;
        treeLegend.appendChild(div);
    });

    // Легенда для HBR
    const hbrItems = [
        {range: '0.52 - 0.56', color: '#00ff00'},
        {range: '0.56 - 0.59', color: '#66ff00'},
        {range: '0.59 - 0.63', color: '#ccff00'},
        {range: '0.63 - 0.67', color: '#ffcc00'},
        {range: '0.67 - 0.71', color: '#ff6600'},
        {range: '0.71 - 0.75', color: '#ff0000'}
    ];

    hbrItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'legend-item';
        div.innerHTML = `<div class="legend-color" style="background-color: ${item.color}"></div><span class="legend-label">${item.range}</span>`;
        hbrLegend.appendChild(div);
    });
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.mainMap = initMainMap();
    populateLegends();
});