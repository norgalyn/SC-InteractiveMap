import Modal                                    from '../Modal.js';

import BaseLayout_CircuitSubsystem              from '../BaseLayout/CircuitSubsystem.js';

export default class Building_PowerStorage
{
    static capacityCharge(baseLayout, currentObject)
    {
        return 100;
    }

    static storedCharge(baseLayout, currentObject)
    {
        return baseLayout.getObjectProperty(currentObject, 'mPowerStore', 0);
    }

    static timeUntilFull(baseLayout, currentObject)
    {
        let circuitSubsystem    = new BaseLayout_CircuitSubsystem({baseLayout: baseLayout});
        let objectCircuit       = circuitSubsystem.getObjectCircuit(currentObject);
        let circuitStatistics   = circuitSubsystem.getStatistics(objectCircuit.circuitId);

            if(circuitStatistics.powerStorageChargeRate > 0)
            {
                let storedCharge    = Building_PowerStorage.storedCharge(baseLayout, currentObject);
                let capacityCharge  = Building_PowerStorage.capacityCharge(baseLayout, currentObject);

                    return (3600 * (capacityCharge / circuitStatistics.powerStorageChargeRate)) - (3600 * (capacityCharge / circuitStatistics.powerStorageChargeRate) * (storedCharge / capacityCharge));
            }

        return null;
    }

    static updatePowerStored(marker)
    {
        let baseLayout      = marker.baseLayout;
        let currentObject   = baseLayout.saveGameParser.getTargetObject(marker.relatedTarget.options.pathName);
        let buildingData    = baseLayout.getBuildingDataFromClassName(currentObject.className);
        let storedCharge    = Building_PowerStorage.storedCharge(baseLayout, currentObject);

            Modal.form({
                title       : 'Update "<strong>' + buildingData.name + '</strong>" stored power',
                container   : '#leafletMap',
                inputs      : [{
                    name        : 'mPowerStore',
                    inputType   : 'number',
                    min         : 0,
                    max         : 100,
                    value       : Math.round(storedCharge)
                }],
                callback    : function(values)
                {
                    if(values === null)
                    {
                        return;
                    }

                    baseLayout.setObjectProperty(currentObject, 'mPowerStore', parseFloat(values.mPowerStore), 'FloatProperty');
                }.bind(baseLayout)
            });
    }
}