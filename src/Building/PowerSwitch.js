import Modal                                    from '../Modal.js';

export default class Building_PowerSwitch
{
    static isOn(baseLayout, currentObject)
    {
        let mIsSwitchOn = baseLayout.getObjectProperty(currentObject, 'mIsSwitchOn');
            if(mIsSwitchOn !== null && mIsSwitchOn === 1)
            {
                return true;
            }

        return false;
    }

    static getSign(baseLayout, currentObject)
    {
        let mBuildingTag = baseLayout.getObjectProperty(currentObject, 'mBuildingTag');
            if(mBuildingTag !== null && mBuildingTag !== '')
            {
                return mBuildingTag;
            }

        return null;
    }

    /**
     * CONTEXT MENU
     */
    static addContextMenu(baseLayout, currentObject, contextMenu)
    {
        let buildingData = baseLayout.getBuildingDataFromClassName(currentObject.className);

        contextMenu.push({
            text: 'Turn "' + buildingData.name + '" ' + ((Building_PowerSwitch.isOn(baseLayout, currentObject) === false) ? '<strong class="text-success">On' : '<strong class="text-danger">Off</strong>'),
            callback: Building_PowerSwitch.updateState
        });

        contextMenu.push({
            text: 'Update "' + buildingData.name + '" sign',
            callback: Building_PowerSwitch.updateSign
        });
        contextMenu.push({separator: true});

        return contextMenu;
    }

    /**
     * MODALS
     */
    static updateSign(marker)
    {
        let baseLayout      = marker.baseLayout;
            baseLayout.pauseMap();
        let currentObject   = baseLayout.saveGameParser.getTargetObject(marker.relatedTarget.options.pathName);
        let buildingData    = baseLayout.getBuildingDataFromClassName(currentObject.className);
        let currentSign     = Building_PowerSwitch.getSign(baseLayout, currentObject);

            Modal.form({
                title       : 'Update "<strong>' + buildingData.name + '</strong>" sign',
                container   : '#leafletMap',
                inputs      : [{
                    name        : 'mBuildingTag',
                    inputType   : 'text',
                    value       : currentSign
                }],
                callback    : function(values)
                {
                    this.unpauseMap();

                    if(values === null)
                    {
                        return;
                    }

                    if(values.mBuildingTag !== '')
                    {
                        this.setObjectProperty(currentObject, 'mHasBuildingTag', 1, 'BoolProperty');
                        this.setObjectProperty(currentObject, 'mBuildingTag', values.mBuildingTag, 'StrProperty');
                    }
                    else
                    {
                        this.deleteObjectProperty(currentObject, 'mHasBuildingTag');
                        this.deleteObjectProperty(currentObject, 'mBuildingTag');
                    }
                }.bind(baseLayout)
            });
    }

    static updateState(marker)
    {
        let baseLayout      = marker.baseLayout;
        let currentObject   = baseLayout.saveGameParser.getTargetObject(marker.relatedTarget.options.pathName);
        let isOn            = Building_PowerSwitch.isOn(baseLayout, currentObject);

            if(isOn === true)
            {
                baseLayout.deleteObjectProperty(currentObject, 'mIsSwitchOn');
            }
            else
            {
                baseLayout.setObjectProperty(currentObject, 'mIsSwitchOn', 1, 'BoolProperty');
            }
    }
}