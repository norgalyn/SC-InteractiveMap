/* global L, Intl */

export default class Map
{
    constructor(options)
    {
        this.build                      = options.build;
        this.version                    = options.version;
        this.startCallback              = (options.startCallback !== undefined) ? options.startCallback : null;

        this.svgIconMarker              = '<svg viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><line x1="25" y1="40" x2="47" y2="77" stroke="{outsideColor}" stroke-width="2" /><circle cx="47" cy="77" r="3" fill="{outsideColor}" /><circle cx="25" cy="25" r="24" fill="{insideColor}" stroke="{outsideColor}" stroke-width="2" /><image x="7" y="7" width="36" height="36" xlink:href="{iconImage}" /></g></svg>';
        this.svgExtraIconMarker         = '<svg viewBox="0 0 50 80" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><line x1="25" y1="40" x2="47" y2="77" stroke="{outsideColor}" stroke-width="2" /><circle cx="47" cy="77" r="3" fill="{outsideColor}" /><circle cx="25" cy="25" r="24" fill="{insideColor}" stroke="{outsideColor}" stroke-width="2" /><image x="7" y="7" width="36" height="36" xlink:href="{iconImage}" /><image x="30" y="30" width="24" height="24" xlink:href="{extraImage}" /></g></svg>';

        this.collectedOpacity           = options.collectedOpacity;

        this.staticUrl                  = options.staticUrl;
        this.dataUrl                    = options.dataUrl;

        this.language                   = options.language;

        this.backgroundSize             = 16384;
        this.extraBackgroundSize        = 2048; //20480 (#dddddd)
        this.tileSize                   = 256;

        // The generating actor is located at (X=50301.832031,Y=0.000000,Z=47479.000000)
        this.mappingBoundWest           = -324698.832031;
        this.mappingBoundEast           = 425301.832031;
        this.mappingBoundNorth          = -375000;
        this.mappingBoundSouth          = 375000;

        this.biomes                     = {
            1: {
                1: 'No Man\'s Land',
                2: 'No Man\'s Land',
                2: 'No Man\'s Land',
                4: 'Grass Fields',
                5: 'Grass Fields',
                6: 'Grass Fields',
                8: 'Blue Crater',
                9: 'Blue Crater'
            },
            2: {
                3: 'Grass Fields',
                4: 'Grass Fields',
                5: 'Grass Fields',
                6: 'Southern Forest',
                7: 'Southern Forest',
                8: 'Blue Crater',
                9: 'Blue Crater',
                10: 'Abyss Cliffs'
            },
            3: {
                2: 'Dangle Spires',
                3: 'Dangle Spires',
                4: 'Snaketree Forest',
                5: 'Snaketree Forest',
                6: 'Grass Fields',
                7: 'Southern Forest',
                8: 'Blue Crater',
                9: 'Blue Crater',
                10: 'Abyss Cliffs'
            },
            4: {
                1: 'Islands',
                2: 'Dangle Spires',
                3: 'Dangle Spires',
                4: 'Western Dune Forest',
                5: 'Western Dune Forest',
                6: 'Western Dune Forest',
                7: 'Western Dune Forest',
                8: 'Western Dune Forest',
                9: 'Western Dune Forest',
                10: 'Abyss Cliffs'
            },
            5: {
                1: 'Islands',
                2: 'Dangle Spires',
                3: 'Western Dune Forest',
                4: 'Red Jungle',
                5: 'Red Bamboo Fields',
                6: 'Red Bamboo Fields',
                7: 'Eastern Dune Forest',
                8: 'Titan Forest',
                9: 'Eastern Dune Forest',
                10: 'Swamp',
                11: 'Swamp'
            },
            6: {
                1: 'Red Jungle',
                2: 'Red Jungle',
                3: 'Red Jungle',
                4: 'Red Jungle',
                5: 'Red Bamboo Fields',
                6: 'Red Bamboo Fields',
                7: 'Titan Forest',
                8: 'Titan Forest',
                9: 'Titan Forest',
                10: 'Swamp',
                11: 'Swamp'
            },
            7: {
                0: 'Rocky Desert',
                1: 'Rocky Desert',
                2: 'Rocky Desert',
                3: 'Rocky Desert',
                4: 'Crater Lake',
                5: 'Crater Lake',
                6: 'Lake Forest',
                7: 'Lake Forest',
                8: 'Maze Canyon',
                9: 'Titan Forest',
                10: 'Titan Forest',
                11: 'Titan Forest',
                12: 'Swamp',
                13: 'Dune Desert'
            },
            8: {
                0: 'Rocky Desert',
                1: 'Rocky Desert',
                2: 'Rocky Desert',
                3: 'Rocky Desert',
                4: 'Crater Lake',
                5: 'Crater Lake',
                6: 'Northern Forest',
                7: 'Northern Forest',
                8: 'Maze Canyon',
                9: 'Desert Canyons',
                10: 'Dune Desert',
                11: 'Dune Desert',
                12: 'Dune Desert',
                13: 'Dune Desert'
            },
            9: {
                0: 'Rocky Desert',
                1: 'Rocky Desert',
                2: 'Rocky Desert',
                3: 'Rocky Desert',
                4: 'Rocky Desert',
                5: 'Northern Forest',
                6: 'Northern Forest',
                7: 'Northern Forest',
                8: 'Desert Canyons',
                9: 'Desert Canyons',
                10: 'Dune Desert',
                11: 'Dune Desert',
                12: 'Dune Desert',
                13: 'Dune Desert'
            },
            10: {
                0: 'Rocky Desert',
                1: 'Rocky Desert',
                2: 'Rocky Desert',
                3: 'Rocky Desert',
                4: 'Rocky Desert',
                5: 'Desert Canyons',
                6: 'Spire Coast',
                7: 'Spire Coast',
                8: 'Spire Coast',
                9: 'Spire Coast',
                10: 'Spire Coast',
                11: 'Dune Desert',
                12: 'Dune Desert',
                13: 'Dune Desert'
            },
            11: {
                8: 'Spire Coast',
                9: 'Spire Coast',
                10: 'Spire Coast',
                11: 'Dune Desert',
                12: 'Dune Desert',
                13: 'Dune Desert'
            },
            12: {
                9: 'Spire Coast',
                10: 'Spire Coast',
                11: 'Dune Desert',
                12: 'Dune Desert',
                13: 'Dune Desert'
            }
        };

        this.leafletMap                 = L.map('leafletMap', {
            crs                             : L.CRS.Simple,
            minZoom                         : 2,
            maxZoom                         : 10,
            zoomDelta                       : 0.25,
            zoomSnap                        : 0.25,
            attributionControl              : false,
            preferCanvas                    : true,
            fullscreenControl               : true
        });

        this.baseLayers                 = {};
        this.availableLayers            = {};
        this.availableIcons             = {};

        this.collectableMarkers         = {};
        this.collectedHardDrives        = null; //TODO: Rename as it is some locale storage stuff to keep track of things ^^
        this.mapOptions                 = null;
        this.activeLayers               = null;

        this.start();
    }

    start()
    {
        // Add extra background size!
        // Mainly because the in-game map doesn't cover the whole world map
        let westEastLength              = Math.abs(this.mappingBoundWest) + Math.abs(this.mappingBoundEast);
        let westEastRatio               = westEastLength / this.backgroundSize;
        let northSouthLength            = Math.abs(this.mappingBoundNorth) + Math.abs(this.mappingBoundSouth);
        let northSouthRatio             = northSouthLength / this.backgroundSize;

            this.westOffset             = westEastRatio * this.extraBackgroundSize;
            this.northOffset            = northSouthRatio * this.extraBackgroundSize;

            this.mappingBoundWest      -= this.westOffset;
            this.mappingBoundEast      += this.westOffset;
            this.mappingBoundNorth     -= this.northOffset;
            this.mappingBoundSouth     += this.northOffset;
            this.backgroundSize        += this.extraBackgroundSize * 2;
            this.zoom                   = this.zoomLevel(); //TODO: Rename to zoomRatio, not realted at a ll to zoom...

        // Add the base layers
        let baseLayersOptions = {
            crs                 : L.CRS.Simple,
            noWrap              : true,
            bounds              : this.getBounds(),
            maxZoom             : 10,
            maxNativeZoom       : 7
        };

        this.baseLayer                  = 'gameLayer';
        this.baseLayers.gameLayer       = L.tileLayer(this.staticUrl + '/imgMap/gameLayer/' + ( (this.build === '') ? 'Stable' : 'Experimental' ) + '/{z}/{x}/{y}.png?v=' + this.version, baseLayersOptions);
        this.baseLayers.realisticLayer  = L.tileLayer(this.staticUrl + '/imgMap/realisticLayer/{z}/{x}/{y}.png?v=' + this.version, baseLayersOptions);

        // Constrain map
        this.leafletMap.setMaxBounds(this.getBounds());
        this.leafletMap.fitBounds(this.getBounds());

        // Dynamic hash
        this.hash                       = new L.Hash(this);

        // Dynamic coordinates
        this.leafletMap.on('mousemove', this._throttle(function(e){
            let coordinates = this.project([e.latlng.lat, e.latlng.lng], this.zoom);
                coordinates = this.convertToGameCoordinates([coordinates.x, coordinates.y]);

            $('.mouseMoveCoordinates').html(new Intl.NumberFormat(this.language).format(Math.round(coordinates[0])) + ' / ' + new Intl.NumberFormat(this.language).format(Math.round(coordinates[1])));

            let biomeX      = Math.round(((coordinates[0] - this.mappingBoundWest - (67800 * 2)) / 100) / 512);
            let biomeY      = Math.round(((-coordinates[1] - this.mappingBoundNorth - (67800 * 2)) / 100) / 512);
            let biome       = '-';
                if(this.biomes[biomeY] !== undefined && this.biomes[biomeY][biomeX] !== undefined)
                {
                    biome = this.biomes[biomeY][biomeX];
                }

            $('.mouseMoveBiome').html(biome);
        }, 50, {leading: true, trailing: true}), this);

        this.loadInitialData();
    }

    loadInitialData()
    {
        $.getJSON(this.dataUrl, function(data){
            if(data !== undefined)
            {
                this.mapOptions     = data.options;
                let isLastVersion   = window.SCIM.checkVersion(data.version);

                if(isLastVersion === true)
                {
                    for(let i = 0; i < this.mapOptions.length; i++)
                    {
                        let mainCategory = this.mapOptions[i];

                        for(let j = 0; j < mainCategory.options.length; j++)
                        {
                            let options = mainCategory.options[j];

                            for(let k = 0; k < options.options.length; k++)
                            {
                                let option                                  = options.options[k];
                                    this.availableLayers[option.layerId]    = L.layerGroup();

                                if(mainCategory.button === undefined || mainCategory.button === false)
                                {
                                    this.availableIcons[option.layerId] = L.divIcon({
                                        className   : "leaflet-data-marker",
                                        html        : this.svgIconMarker.replace(/{outsideColor}/g, option.outsideColor)
                                                                        .replace(/{insideColor}/g, option.insideColor)
                                                                        .replace(/{iconImage}/g, option.icon),
                                        iconAnchor  : [48, 78],
                                        iconSize    : [50, 80]
                                    });
                                }

                                if(option.layerId === 'worldBorder')
                                {
                                    let borderPosition = [];
                                        for(let m = 0; m < option.polygon.length; m++)
                                        {
                                            borderPosition.push(this.unproject(option.polygon[m]));
                                        }
                                        L.polyline(borderPosition, {color: 'red', weight: 3, interactive: false})
                                                 .addTo(this.availableLayers[option.layerId]);

                                    continue;
                                }

                                if(option.layerId === 'caves')
                                {
                                    for(let caveId in option.markers)
                                    {
                                        let cavePosition = option.markers[caveId].points.map(function(value){
                                                return this.unproject(value);
                                            }.bind(this));
                                            L.polygon(cavePosition, {color: 'yellow', weight: 1, interactive: false})
                                             .addTo(this.availableLayers[option.layerId]);

                                        if(option.markers[caveId].entrances !== undefined)
                                        {
                                            for(let l = 0; l < option.markers[caveId].entrances.length; l++)
                                            {
                                                let currentEntrance     = L.polyline(option.markers[caveId].entrances[l].map(function(value){
                                                                              return this.unproject(value);
                                                                          }.bind(this)), {color: 'yellow', weight: 3, dashArray: '10 10'});
                                                let entranceHeight      = 0;
                                                let haveEntranceHeight  = false;

                                                for(let m = 0; m < option.markers[caveId].entrances[l].length; m++)
                                                {
                                                    if(option.markers[caveId].entrances[l][m].length > 2)
                                                    {
                                                        haveEntranceHeight = true;
                                                        entranceHeight += option.markers[caveId].entrances[l][m][2];
                                                    }
                                                }

                                                if(haveEntranceHeight !== false)
                                                {
                                                    entranceHeight = entranceHeight / option.markers[caveId].entrances[l].length;
                                                    currentEntrance.bindTooltip('<div class="d-flex" style="border: 25px solid #7f7f7f;border-image: url(https://static.satisfactory-calculator.com/js/InteractiveMap/img/genericTooltipBackground.png) 25 repeat;background: #7f7f7f;margin: -7px;color: #FFFFFF;text-shadow: 1px 1px 1px #000000;line-height: 16px;font-size: 12px;">\
                                                        <div class="justify-content-center align-self-center w-100 text-center" style="margin: -10px 0;">\
                                                            Entrance height: ' + new Intl.NumberFormat(this.language).format(Math.round(entranceHeight / 100)) + 'm\
                                                        </div>\
                                                    </div>');
                                                }

                                                currentEntrance.addTo(this.availableLayers[option.layerId]);
                                            }
                                        }
                                    }

                                    continue;
                                }

                                if(option.layerId === 'roads')
                                {
                                    for(let roadId in option.markers)
                                    {
                                        let roadPosition = option.markers[roadId].points.map(function(value){
                                                return this.unproject(value);
                                            }.bind(this));
                                        let road = L.corridor(roadPosition, {
                                                corridor: ((option.markers[roadId].corridor !== undefined) ? option.markers[roadId].corridor : 2500),
                                                color: 'purple'
                                            });

                                            if(option.markers[roadId].name !== undefined)
                                            {
                                                road.bindTooltip(option.markers[roadId].name)
                                            }

                                            road.addTo(this.availableLayers[option.layerId]);
                                    }

                                    continue;
                                }

                                if(option.layerId === 'hardDrives')
                                {
                                    this.availableIcons.hardDrivesUnavailable = L.divIcon({
                                        className   : "leaflet-data-marker",
                                        html        : this.svgIconMarker.replace(/{outsideColor}/g, option.outsideColor)
                                                                        .replace(/{insideColor}/g, '#d9534f')
                                                                        .replace(/{iconImage}/g, option.icon),
                                        iconAnchor  : [48, 78],
                                        iconSize    : [50, 80]
                                    });

                                    this.availableIcons.poweredHardDrives = L.divIcon({
                                        className   : "leaflet-data-marker",
                                        html        : this.svgExtraIconMarker.replace(/{outsideColor}/g, option.outsideColor)
                                                                             .replace(/{insideColor}/g, option.insideColor)
                                                                             .replace(/{iconImage}/g, option.icon)
                                                                             .replace(/{extraImage}/g, 'https://static.satisfactory-calculator.com/img/bolt.png'),
                                        iconAnchor  : [48, 78],
                                        iconSize    : [50, 80]
                                    });
                                    this.availableIcons.poweredHardDrivesUnavailable = L.divIcon({
                                        className   : "leaflet-data-marker",
                                        html        : this.svgExtraIconMarker.replace(/{outsideColor}/g, option.outsideColor)
                                                                             .replace(/{insideColor}/g, '#d9534f')
                                                                             .replace(/{iconImage}/g, option.icon)
                                                                             .replace(/{extraImage}/g, 'https://static.satisfactory-calculator.com/img/bolt.png'),
                                        iconAnchor  : [48, 78],
                                        iconSize    : [50, 80]
                                    });

                                    this.collectedHardDrives = new HardDrives({ hardDrivesData: option.markers, language: this.language });
                                }

                                for(let l = 0; l < option.markers.length; l++)
                                {
                                    let marker                  = option.markers[l];

                                    if(option.layerId === 'spawn')
                                    {
                                        L.circle(this.unproject([marker.x, marker.y]), {radius: marker.radius})
                                         .addTo(this.availableLayers[option.layerId]);
                                        continue;
                                    }

                                    if(option.layerId === 'spore')
                                    {
                                        L.circle(
                                            this.unproject([marker.x, marker.y]),
                                            {radius: 0.6, color: ((option.type === 'pillars') ? '#bee597' : '#9cbc7d')}
                                        ).addTo(this.availableLayers[option.layerId]);
                                        continue;
                                    }

                                    if(option.layerId === 'rock')
                                    {
                                        L.circle(
                                            this.unproject([marker.x, marker.y]),
                                            {radius: ((option.type === 'largeRocks') ? 0.3 : 0.1), color: '#555555'}
                                        ).addTo(this.availableLayers[option.layerId]);
                                        continue;
                                    }

                                    let currentMarkerOptions    = { icon: this.availableIcons[option.layerId], riseOnHover: true };
                                    let tooltip                 = new Array();

                                    if(option.layerId === 'hardDrives')
                                    {
                                        let explodedPathName = marker.pathName.split('.');
                                            tooltip.push('<strong>' + option.name + ' (' + explodedPathName.pop() + ')</strong><br />');

                                        let isCollected = this.collectedHardDrives.isCollected(marker.pathName);
                                            if(isCollected === true)
                                            {
                                                currentMarkerOptions.opacity = this.collectedOpacity;
                                            }

                                        if(marker.powerNeeded !== undefined && marker.powerNeeded !== false)
                                        {
                                            tooltip.push('Power needed: ' + new Intl.NumberFormat(this.language).format(marker.powerNeeded) + ' MW<br />');

                                            currentMarkerOptions.icon = this.availableIcons.poweredHardDrives;
                                        }

                                        if(marker.itemName !== undefined && marker.itemName !== null)
                                        {
                                            tooltip.push(new Intl.NumberFormat(this.language).format(marker.itemQuantity) + 'x ' + marker.itemName + '<br />');

                                            if(marker.itemId === undefined && marker.toolId === undefined)
                                            {
                                                if(marker.powerNeeded !== undefined && marker.powerNeeded !== false)
                                                {
                                                    currentMarkerOptions.icon = this.availableIcons.poweredHardDrivesUnavailable;
                                                }
                                                else
                                                {
                                                    currentMarkerOptions.icon = this.availableIcons.hardDrivesUnavailable;
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if(marker.powerNeeded === undefined || marker.powerNeeded === false)
                                            {
                                                tooltip.push('No requirements<br />');
                                            }
                                        }
                                    }
                                    else
                                    {
                                        tooltip.push('<strong>' + option.name + '</strong><br />');
                                    }

                                    tooltip.push('<br />');
                                    tooltip.push('Coordinates: ' + new Intl.NumberFormat(this.language).format(Math.round(marker.x)) + ' / ' + new Intl.NumberFormat(this.language).format(Math.round(marker.y)));
                                    tooltip.push('<br />');
                                    tooltip.push('Altitude: ' + new Intl.NumberFormat(this.language).format(Math.round(marker.z / 100)) + 'm');

                                    if(marker.obstructed !== undefined && marker.obstructed === true)
                                    {
                                        tooltip.push('<br /><br /><strong>Obstructed in the last checked build</strong>');
                                    }
                                    if(marker.lastCheck !== undefined)
                                    {
                                        tooltip.push('<br /><br /><em><small>Verified in Build #' + marker.lastCheck + '</small></em>');
                                    }

                                    if(option.type !== undefined){ currentMarkerOptions.type = option.type; }
                                    else{ if(options.type !== undefined){ currentMarkerOptions.type = options.type; } }

                                    if(option.purity !== undefined){ currentMarkerOptions.purity = option.purity; }
                                    if(marker.core !== undefined){ currentMarkerOptions.core = marker.core; }

                                    tooltip = '<div class="d-flex" style="border: 25px solid #7f7f7f;border-image: url(https://static.satisfactory-calculator.com/js/InteractiveMap/img/genericTooltipBackground.png) 25 repeat;background: #7f7f7f;margin: -7px;color: #FFFFFF;text-shadow: 1px 1px 1px #000000;line-height: 16px;font-size: 12px;">\
                                                    <div class="justify-content-center align-self-center w-100 text-center" style="margin: -10px 0;">\
                                                        ' + tooltip.join('') + '\
                                                    </div>\
                                                </div>';

                                    let currentMarker = L.marker(this.unproject([marker.x, marker.y]), currentMarkerOptions)
                                                         .bindTooltip(tooltip)
                                                         .addTo(this.availableLayers[option.layerId]);

                                    if(marker.pathName !== undefined)
                                    {
                                        this.collectableMarkers[marker.pathName] = currentMarker;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }.bind(this)).done(function(){
            // Hash Default
            this.leafletMap.addLayer(this.baseLayers[this.baseLayer]);
            $('.setBaseLayer[data-id=' + this.baseLayer + ']').addClass(window.SCIM.outlineClass);

            for(let index in this.activeLayers)
            {
                let layerId = this.activeLayers[index];
                    if(this.availableLayers[layerId] !== undefined)
                    {
                        this.leafletMap.addLayer(this.availableLayers[layerId]);
                        $('.updateLayerState[data-id=' + layerId + ']').addClass(window.SCIM.outlineClass);
                    }
            }

            if(this.startCallback !== null)
            {
                this.startCallback();
            }
            else
            {
                window.SCIM.hideLoader();
            }

           this.setupEvents();
        }.bind(this));
    }

    setupEvents()
    {
        $('.setBaseLayer').click(function(e){
            let layerId     = $(e.currentTarget).attr('data-id');
                if(this.baseLayer !== 'greyLayer')
                {
                    this.leafletMap.removeLayer(this.baseLayers[this.baseLayer]);
                }

            $('.setBaseLayer').removeClass(window.SCIM.outlineClass);
            this.baseLayer = layerId;

            if(layerId !== 'greyLayer')
            {
                this.leafletMap.addLayer(this.baseLayers[layerId]);
            }

            $(e.currentTarget).addClass(window.SCIM.outlineClass);

            if(layerId === 'greyLayer')
            {
                this.hash.updateHash();
            }
        }.bind(this));

        $('.updateLayerState').click(function(e){
            let layerId     = $(e.currentTarget).attr('data-id');

            if(this.leafletMap.hasLayer(this.availableLayers[layerId]))
            {
                this.removeActiveLayer(layerId);
                this.leafletMap.removeLayer(this.availableLayers[layerId]);
                $(e.currentTarget).removeClass(window.SCIM.outlineClass);
            }
            else
            {
                this.addActiveLayer(layerId);
                this.leafletMap.addLayer(this.availableLayers[layerId]);
                $(e.currentTarget).addClass(window.SCIM.outlineClass);
            }
        }.bind(this));

        $('#unselectAll').click(function(){
            for(let layerId in this.availableLayers)
            {
                if(this.availableLayers.hasOwnProperty(layerId))
                {
                    if(this.leafletMap.hasLayer(this.availableLayers[layerId]))
                    {
                        this.removeActiveLayer(layerId);
                        this.leafletMap.removeLayer(this.availableLayers[layerId]);
                        $('.updateLayerState[data-id=' + layerId + ']').removeClass(window.SCIM.outlineClass);
                    }
                }
            }
        }.bind(this));

        $('.selectPurity').click(function(e){
            let neededPurity    = $(e.currentTarget).attr('data-purity');

            $('.updateLayerState').each(function(key, el){
                let havePurity  = $(el).attr('data-purity');
                let layerId     = $(el).attr('data-id');
                let hide        = true;

                if(havePurity !== undefined && neededPurity === havePurity)
                {
                    hide = false;
                }

                if(this.leafletMap.hasLayer(this.availableLayers[layerId]))
                {
                    if(hide === true)
                    {
                        this.removeActiveLayer(layerId);
                        this.leafletMap.removeLayer(this.availableLayers[layerId]);
                        $(el).removeClass(window.SCIM.outlineClass);
                    }
                }
                else
                {
                    if(hide === false)
                    {
                        this.addActiveLayer(layerId);
                        this.leafletMap.addLayer(this.availableLayers[layerId]);
                        $(el).addClass(window.SCIM.outlineClass);
                    }
                }
            }.bind(this));
        }.bind(this));

        $('.togglePurity').click(function(e){
            let neededPurity    = $(e.currentTarget).attr('data-purity');

            $('.updateLayerState').each(function(key, el){
                let havePurity  = $(el).attr('data-purity');
                let layerId     = $(el).attr('data-id');

                if(havePurity !== undefined && neededPurity === havePurity)
                {
                    if(this.leafletMap.hasLayer(this.availableLayers[layerId]))
                    {
                        this.removeActiveLayer(layerId);
                        this.leafletMap.removeLayer(this.availableLayers[layerId]);
                        $(el).removeClass(window.SCIM.outlineClass);
                    }
                    else
                    {
                        this.addActiveLayer(layerId);
                        this.leafletMap.addLayer(this.availableLayers[layerId]);
                        $(el).addClass(window.SCIM.outlineClass);
                    }
                }
            }.bind(this));
        }.bind(this));

        $('.toggleType').click(function(e){
            let neededType    = $(e.currentTarget).attr('data-type');

            $('.updateLayerState').each(function(key, el){
                let haveType    = $(el).attr('data-type');
                let layerId     = $(el).attr('data-id');

                if(haveType !== undefined && neededType === haveType)
                {
                    if(this.leafletMap.hasLayer(this.availableLayers[layerId]))
                    {
                        this.removeActiveLayer(layerId);
                        this.leafletMap.removeLayer(this.availableLayers[layerId]);
                        $(el).removeClass(window.SCIM.outlineClass);
                    }
                    else
                    {
                        this.addActiveLayer(layerId);
                        this.leafletMap.addLayer(this.availableLayers[layerId]);
                        $(el).addClass(window.SCIM.outlineClass);
                    }
                }
            }.bind(this));
        }.bind(this));
    }

    addActiveLayer(layerId)
    {
        this.activeLayers.push(layerId);
    }

    removeActiveLayer(layerId)
    {
        if(this.activeLayers !== null)
        {
            var index = this.activeLayers.indexOf(layerId);

            if(index > -1)
            {
               this.activeLayers.splice(index, 1);
            }
        }
    }

    /*
     * MAP PROJECTIONS
     */
    zoomLevel()
    {
        return Math.ceil(Math.log(Math.max(this.backgroundSize, this.backgroundSize) / this.tileSize) / Math.log(2));
    }

    unproject(coordinates)
    {
        return this.leafletMap.unproject(this.convertToRasterCoordinates(coordinates), this.zoom);
    }

    project(coordinates)
    {
        return this.leafletMap.project(coordinates, this.zoom);
    }

    getBounds()
    {
        let southWest = this.leafletMap.unproject([0, this.backgroundSize], this.zoom);
        let northEast = this.leafletMap.unproject([this.backgroundSize, 0], this.zoom);

        return new L.LatLngBounds(southWest, northEast);
    }

    getCenter()
    {
        return this.leafletMap.unproject([this.backgroundSize / 2, this.backgroundSize / 2], this.zoom);
    }

    /*
     * LEFLET/GAME COORDINATES CONVERSIONS
     */
    convertToRasterCoordinates(coordinates)
    {
        let x               = parseFloat(coordinates[0]) || 0;
        let y               = parseFloat(coordinates[1]) || 0;

        let xMax            = Math.abs(this.mappingBoundWest) + Math.abs(this.mappingBoundEast);
        let yMax            = Math.abs(this.mappingBoundNorth) + Math.abs(this.mappingBoundSouth);

        let xRatio          = Math.abs(this.backgroundSize) / xMax;
        let yRatio          = Math.abs(this.backgroundSize) / yMax;

            x = ((xMax - this.mappingBoundEast) + x) * xRatio;
            y = (((yMax - this.mappingBoundNorth) + y) * yRatio) - this.backgroundSize;

        return [x, y];
    }

    convertToGameCoordinates(coordinates)
    {
        let x               = parseFloat(coordinates[0]) || 0;
        let y               = parseFloat(coordinates[1]) || 0;

        let xMax            = Math.abs(this.mappingBoundWest) + Math.abs(this.mappingBoundEast);
        let yMax            = Math.abs(this.mappingBoundNorth) + Math.abs(this.mappingBoundSouth);

        let xRatio          = xMax / Math.abs(this.backgroundSize);
        let yRatio          = yMax / Math.abs(this.backgroundSize);

            x = (x * xRatio) - (xMax - this.mappingBoundEast);
            y = (y * yRatio) - (yMax - this.mappingBoundNorth) + yMax;

        return [x, y];
    }

    /**
     * Pinched from underscore
     * @param func
     * @param wait
     * @param options
     * @returns {Function}
     * @private
    **/
   _throttle(func, wait, options)
   {
       var context, args, result;
       var timeout = null;
       var previous = 0;
       if (!options) options = {};
       var later = function() {
               previous = options.leading === false ? 0 : Date.now();
               timeout = null;
               result = func.apply(context, args);
               if (!timeout) context = args = null;
       };
       return function() {
               var now = Date.now();
               if (!previous && options.leading === false) previous = now;
               var remaining = wait - (now - previous);
               context = this;
               args = arguments;
               if (remaining <= 0 || remaining > wait) {
                       if (timeout) {
                               clearTimeout(timeout);
                               timeout = null;
                       }
                       previous = now;
                       result = func.apply(context, args);
                       if (!timeout) context = args = null;
               } else if (!timeout && options.trailing !== false) {
                       timeout = setTimeout(later, remaining);
               }
               return result;
       };
    }
}