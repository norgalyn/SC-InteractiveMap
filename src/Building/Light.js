/* global L */

import BaseLayout_Math                          from '../BaseLayout/Math.js';
import Modal                                    from '../Modal.js';

import SubSystem_Buildable                      from '../SubSystem/Buildable.js';

export default class Building_Light
{
    /**
     * STATE
     */
    static getControlData(baseLayout, currentObject)
    {
        let mLightControlData = baseLayout.getObjectProperty(currentObject, 'mLightControlData');
            if(mLightControlData === null)
            {
                currentObject.properties.push({
                    name    : "mLightControlData",
                    type    : "StructProperty",
                    value   : { type: "LightSourceControlData", values: [] }
                });

                mLightControlData = baseLayout.getObjectProperty(currentObject, 'mLightControlData');
            }

            return mLightControlData;
    }

    static getColorSlotIndex(baseLayout, currentObject)
    {
        let mLightControlData = Building_Light.getControlData(baseLayout, currentObject);
            if(mLightControlData !== null)
            {
                for(let i = 0; i < mLightControlData.values.length; i++)
                {
                    if(mLightControlData.values[i].name === 'ColorSlotIndex')
                    {
                        return mLightControlData.values[i].value;
                    }
                }
            }


        return 0;
    }

    static getIntensity(baseLayout, currentObject)
    {
        let mLightControlData = Building_Light.getControlData(baseLayout, currentObject);
            if(mLightControlData !== null)
            {
                for(let i = 0; i < mLightControlData.values.length; i++)
                {
                    if(mLightControlData.values[i].name === 'Intensity')
                    {
                        return Math.round(mLightControlData.values[i].value * 5);
                    }
                }
            }

        return 50;
    }

    static getIsTimeOfDayAware(baseLayout, currentObject)
    {
        let mLightControlData = Building_Light.getControlData(baseLayout, currentObject);
            if(mLightControlData !== null)
            {
                for(let i = 0; i < mLightControlData.values.length; i++)
                {
                    if(mLightControlData.values[i].name === 'IsTimeOfDayAware' && mLightControlData.values[i].value === 1)
                    {
                        return true;
                    }
                }
            }

        return false;
    }

    /*
     * SWITCH
     */
    static getConnectedLights(baseLayout, currentObject)
    {
        let controlledLights        = [];
        let downstreamConnection    = baseLayout.saveGameParser.getTargetObject(currentObject.pathName + '.DownstreamConnection');
            if(downstreamConnection !== null)
            {
                let followedPowerConnections = Building_Light.followPowerConnections(baseLayout, downstreamConnection, [downstreamConnection.pathName]);
                    if(followedPowerConnections.length > 0)
                    {
                        for(let i = 0; i < followedPowerConnections.length; i++)
                        {
                            let currentTestedObject = baseLayout.saveGameParser.getTargetObject(followedPowerConnections[i]);
                                if(currentTestedObject !== null && currentTestedObject.outerPathName !== undefined)
                                {
                                    let currentOuterObject = baseLayout.saveGameParser.getTargetObject(currentTestedObject.outerPathName);
                                        if(currentOuterObject !== null)
                                        {
                                            let buildingData = baseLayout.getBuildingDataFromClassName(currentOuterObject.className);
                                                if(buildingData !== null && buildingData.category === 'light')
                                                {
                                                    controlledLights.push(currentOuterObject);
                                                }
                                        }
                                }
                        }
                    }
            }

        return controlledLights;
    }
    static followPowerConnections(baseLayout, currentPowerConnection, followedPowerConnections, stopAtSwitches = true)
    {
        let mWires = baseLayout.getObjectProperty(currentPowerConnection, 'mWires');
            if(mWires !== null)
            {
                for(let i = 0; i < mWires.values.length; i++)
                {
                    if(followedPowerConnections.includes(mWires.values[i].pathName) === false)
                    {
                        let currentObject = baseLayout.saveGameParser.getTargetObject(mWires.values[i].pathName);
                            followedPowerConnections.push(currentObject.pathName);

                            if(currentObject.className === '/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C')
                            {
                                if(currentObject.extra !== undefined)
                                {
                                    if(currentObject.extra.sourcePathName !== undefined)
                                    {
                                        if(followedPowerConnections.includes(currentObject.extra.sourcePathName) === false)
                                        {
                                            let usePowerConnection = true
                                                if(stopAtSwitches === true && Building_Light.isSwitch(currentObject.extra.sourcePathName) === true)
                                                {
                                                    usePowerConnection = false;
                                                }

                                            if(usePowerConnection === true)
                                            {
                                                let sourcePowerConnection = baseLayout.saveGameParser.getTargetObject(currentObject.extra.sourcePathName);
                                                    if(sourcePowerConnection !== null)
                                                    {
                                                        followedPowerConnections.push(currentObject.extra.sourcePathName);
                                                        followedPowerConnections = Building_Light.followPowerConnections(baseLayout, sourcePowerConnection, followedPowerConnections, stopAtSwitches);
                                                    }
                                            }
                                        }
                                    }
                                    if(currentObject.extra.targetPathName !== undefined)
                                    {
                                        if(followedPowerConnections.includes(currentObject.extra.targetPathName) === false)
                                        {
                                            let usePowerConnection = true
                                                if(stopAtSwitches === true && Building_Light.isSwitch(currentObject.extra.targetPathName) === true)
                                                {
                                                    usePowerConnection = false;
                                                }

                                            if(usePowerConnection === true)
                                            {
                                                let targetPowerConnection = baseLayout.saveGameParser.getTargetObject(currentObject.extra.targetPathName);
                                                    if(targetPowerConnection !== null)
                                                    {
                                                        followedPowerConnections.push(currentObject.extra.targetPathName);
                                                        followedPowerConnections = Building_Light.followPowerConnections(baseLayout, targetPowerConnection, followedPowerConnections, stopAtSwitches);
                                                    }
                                            }
                                        }
                                    }
                                }
                            }
                            else
                            {
                                console.log('currentObjectToFollow?', currentObject);
                            }
                    }
                }
            }

        return followedPowerConnections;
    }

    static isSwitch(pathName)
    {
        if(pathName.startsWith('Persistent_Level:PersistentLevel.Build_LightsControlPanel_C_') === true)
        {
            return true;
        }
        if(pathName.startsWith('Persistent_Level:PersistentLevel.Build_PowerSwitch_C_') === true)
        {
            return true;
        }

        return false;
    }

    /**
     * HALO MARKER
     */
    static hasHalo(baseLayout, currentObject)
    {
        if(baseLayout.getBuildingIsOn(currentObject) === false)
        {
            return false;
        }

        return true;
    }

    static getHaloRadius(currentObject)
    {
        switch(currentObject.className)
        {
            case '/Game/FactoryGame/Buildable/Factory/Floodlight/Build_FloodlightPole.Build_FloodlightPole_C':
                return 0.4;
            case '/Game/FactoryGame/Buildable/Factory/CeilingLight/Build_CeilingLight.Build_CeilingLight_C':
            case '/Game/FactoryGame/Buildable/Factory/Floodlight/Build_FloodlightWall.Build_FloodlightWall_C':
                return 0.25;
        }

        return 0.12;
    }

    static getHaloCoordinates(baseLayout, currentObject)
    {
        let xOffset     = 0;
        let yOffset     = 0;
            if(currentObject.className === '/Game/FactoryGame/Buildable/Factory/StreetLight/Build_StreetLight.Build_StreetLight_C')
            {
                yOffset = 600;
            }
            if(currentObject.className === '/Game/FactoryGame/Buildable/Factory/Floodlight/Build_FloodlightWall.Build_FloodlightWall_C')
            {
                xOffset = 600;
            }
            if(currentObject.className === '/Game/FactoryGame/Buildable/Factory/Floodlight/Build_FloodlightPole.Build_FloodlightPole_C')
            {
                xOffset = 1600;
            }

            if(xOffset !== 0 || yOffset !== 0)
            {
                return baseLayout.satisfactoryMap.unproject(BaseLayout_Math.getPointRotation(
                        [
                            currentObject.transform.translation[0] + xOffset,
                            currentObject.transform.translation[1] + yOffset
                        ],
                        currentObject.transform.translation,
                        currentObject.transform.rotation
                    ));
            }

        return baseLayout.satisfactoryMap.unproject([currentObject.transform.translation[0], currentObject.transform.translation[1]]);
    }

    static getHaloGradient(baseLayout, currentObject)
    {
        let gradientStops                   = {};
        let intensity                       = Building_Light.getIntensity(baseLayout, currentObject);

        let buildableSubSystem              = new SubSystem_Buildable({baseLayout: baseLayout});
        let color                           = buildableSubSystem.getObjectLightColor(currentObject);

            gradientStops[0]              = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 1)';

            if(intensity < 100)
            {
                gradientStops[intensity / 100]  = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 0.2)';
            }

            gradientStops[1]            = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 0)';

        return gradientStops;
    }

    /**
     * CONTEXT MENU
     */
    static addContextMenu(baseLayout, currentObject, contextMenu)
    {
        let buildingData = baseLayout.getBuildingDataFromClassName(currentObject.className);

            contextMenu.push({
                text: 'Update "' + buildingData.name + '" light color slot',
                callback: Building_Light.updateLightColorSlot
            });
            contextMenu.push({
                text: 'Update "' + buildingData.name + '" intensity',
                callback: Building_Light.updateIntensity
            });
            contextMenu.push({
                text: 'Turn "' + buildingData.name + '" night mode ' + ((Building_Light.getIsTimeOfDayAware(baseLayout, currentObject) === false) ? '<strong class="text-success">On' : '<strong class="text-danger">Off</strong>'),
                callback: Building_Light.updateState
            });
            contextMenu.push({separator: true});

        return contextMenu;
    }

    /**
     * TOOLTIP
     */

    /**
     * MODALS
     */
    static updateLightColorSlot(marker)
    {
        let baseLayout          = marker.baseLayout;
        let currentObject       = baseLayout.saveGameParser.getTargetObject(marker.relatedTarget.options.pathName);
        let buildingData        = baseLayout.getBuildingDataFromClassName(currentObject.className);

        let buildableSubSystem  = new SubSystem_Buildable({baseLayout: baseLayout});
        let slotIndex           = Building_Light.getColorSlotIndex(baseLayout, currentObject);
        let playerColors        = buildableSubSystem.getPlayerLightColorSlots();
        let selectOptions       = [];

        for(let slotIndex = 0; slotIndex < SubSystem_Buildable.totalLightColorSlots; slotIndex++)
        {
            selectOptions.push({
                primaryColor    : 'rgb(' + playerColors[slotIndex].r + ', ' + playerColors[slotIndex].g + ', ' + playerColors[slotIndex].b + ')',
                value           : slotIndex,
                text            : '#' + (slotIndex + 1)
            });
        }

        Modal.form({
            title       : 'Update "<strong>' + buildingData.name + '</strong>" light color slot',
            container   : '#leafletMap',
            inputs      : [{
                name            : 'slotIndex',
                inputType       : 'colorSlots',
                inputOptions    : selectOptions,
                value           : slotIndex
            }],
            callback    : function(values)
            {
                if(values === null)
                {
                    return;
                }
                let connectedLights     = [];
                    if(currentObject.className === '/Game/FactoryGame/Buildable/Factory/LightsControlPanel/Build_LightsControlPanel.Build_LightsControlPanel_C')
                    {
                        connectedLights = Building_Light.getConnectedLights(baseLayout, currentObject);
                    }
                    else
                    {
                        connectedLights.push(currentObject);
                    }

                    for(let i = 0; i < connectedLights.length; i++)
                    {
                        let currentLight        = connectedLights[i];
                        let currentLightMarker  = baseLayout.getMarkerFromPathName(currentLight.pathName, 'playerLightsLayer');
                        let mLightControlData   = Building_Light.getControlData(this, currentLight);
                            if(mLightControlData !== null)
                            {
                                let newSlotIndex = parseInt(values.slotIndex);

                                if(slotIndex === 0)
                                {
                                    mLightControlData.values.push({name: "ColorSlotIndex", type: "IntProperty", value: newSlotIndex});
                                }
                                else
                                {
                                    for(let i = 0; i < mLightControlData.values.length; i++)
                                    {
                                        if(mLightControlData.values[i].name === 'ColorSlotIndex')
                                        {
                                            if(newSlotIndex === 0)
                                            {
                                                mLightControlData.values.splice(i, 1);
                                            }
                                            else
                                            {
                                                mLightControlData.values[i].value = newSlotIndex;
                                            }
                                        }
                                    }
                                }

                                if(currentLightMarker.options.haloMarker !== undefined)
                                {
                                    this.playerLayers.playerLightsHaloLayer.subLayer.removeLayer(currentLightMarker.options.haloMarker);
                                }
                                this.refreshMarkerPosition({marker: currentLightMarker, transform: currentLight.transform, object: currentLight});
                            }
                    }
            }.bind(baseLayout)
        });
    }

    static updateIntensity(marker)
    {
        let baseLayout      = marker.baseLayout;
            baseLayout.pauseMap();
        let currentObject   = baseLayout.saveGameParser.getTargetObject(marker.relatedTarget.options.pathName);
        let buildingData    = baseLayout.getBuildingDataFromClassName(currentObject.className);
        let intensity       = Building_Light.getIntensity(baseLayout, currentObject);

            Modal.form({
                title       : 'Update "<strong>' + buildingData.name + '</strong>" intensity',
                container   : '#leafletMap',
                inputs      : [{
                    name        : 'intensity',
                    inputType   : 'number',
                    min         : 0,
                    max         : 100,
                    value       : Math.round(intensity)
                }],
                callback    : function(values)
                {
                    this.unpauseMap();

                    if(values === null)
                    {
                        return;
                    }
                    let connectedLights     = [];
                        if(currentObject.className === '/Game/FactoryGame/Buildable/Factory/LightsControlPanel/Build_LightsControlPanel.Build_LightsControlPanel_C')
                        {
                            connectedLights = Building_Light.getConnectedLights(baseLayout, currentObject);
                        }
                        else
                        {
                            connectedLights.push(currentObject);
                        }

                        for(let i = 0; i < connectedLights.length; i++)
                        {
                            let currentLight        = connectedLights[i];
                            let currentLightMarker  = baseLayout.getMarkerFromPathName(currentLight.pathName, 'playerLightsLayer');
                            let mLightControlData   = Building_Light.getControlData(this, currentLight);
                                if(mLightControlData !== null)
                                {
                                    let newIntensity = parseFloat(values.intensity);

                                    if(intensity === 50)
                                    {
                                        mLightControlData.values.push({name: "Intensity", type: "FloatProperty", value: (newIntensity / 5)});
                                    }
                                    else
                                    {
                                        for(let i = 0; i < mLightControlData.values.length; i++)
                                        {
                                            if(mLightControlData.values[i].name === 'Intensity')
                                            {
                                                if(newIntensity === 50)
                                                {
                                                    mLightControlData.values.splice(i, 1);
                                                }
                                                else
                                                {
                                                    mLightControlData.values[i].value = (newIntensity / 5);
                                                }
                                            }
                                        }
                                    }

                                    if(currentLightMarker.options.haloMarker !== undefined)
                                    {
                                        this.playerLayers.playerLightsHaloLayer.subLayer.removeLayer(currentLightMarker.options.haloMarker);
                                    }
                                    this.refreshMarkerPosition({marker: currentLightMarker, transform: currentLight.transform, object: currentLight});
                                }
                        }
                }.bind(baseLayout)
            });
    }

    static updateState(marker)
    {
        let baseLayout          = marker.baseLayout;
        let currentObject       = baseLayout.saveGameParser.getTargetObject(marker.relatedTarget.options.pathName);
        let isTimeOfDayAware    = Building_Light.getIsTimeOfDayAware(baseLayout, currentObject);
        let connectedLights     = [];
            if(currentObject.className === '/Game/FactoryGame/Buildable/Factory/LightsControlPanel/Build_LightsControlPanel.Build_LightsControlPanel_C')
            {
                connectedLights = Building_Light.getConnectedLights(baseLayout, currentObject);
            }
            else
            {
                connectedLights.push(currentObject);
            }

            for(let i = 0; i < connectedLights.length; i++)
            {
                let currentLight        = connectedLights[i];
                let currentLightMarker  = baseLayout.getMarkerFromPathName(currentLight.pathName, 'playerLightsLayer');
                let mLightControlData   = Building_Light.getControlData(baseLayout, currentLight);
                    if(mLightControlData !== null)
                    {
                        if(isTimeOfDayAware === false)
                        {
                            mLightControlData.values.push({name: "IsTimeOfDayAware", type: "BoolProperty", value: 1});
                        }
                        else
                        {
                            for(let i = 0; i < mLightControlData.values.length; i++)
                            {
                                if(mLightControlData.values[i].name === 'IsTimeOfDayAware')
                                {
                                    mLightControlData.values.splice(i, 1);
                                }
                            }
                        }

                        if(currentLightMarker.options.haloMarker !== undefined)
                        {
                            baseLayout.playerLayers.playerLightsHaloLayer.subLayer.removeLayer(currentLightMarker.options.haloMarker);
                        }
                        baseLayout.refreshMarkerPosition({marker: currentLightMarker, transform: currentLight.transform, object: currentLight});
                    }
            }
    }
}

L.Canvas.include({
    _updateGradientCircle: function(layer)
    {
        if (!this._drawing || layer._empty()) { return; }

        var p   = layer._point,
            ctx = this._ctx,
            r   = Math.max(Math.round(layer._radius), 1);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2, false);

        let gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
            if(layer.options.gradient !== undefined)
            {
                for(let stop in layer.options.gradient)
                {
                    gradient.addColorStop(stop, layer.options.gradient[stop]);
                }
            }
            else
            {
                gradient.addColorStop(0, 'white');
                gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            }
        ctx.fillStyle = gradient;
        ctx.fill();
    }
});
L.HaloCircle = L.Circle.extend({
    _updatePath: function()
    {
        this._renderer._updateGradientCircle(this);
    }
});
L.haloCircle = function (latlng, options) {
    return new L.HaloCircle(latlng, options);
};