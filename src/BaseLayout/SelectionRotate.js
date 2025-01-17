/* global gtag */
import BaseLayout_Math from '../BaseLayout/Math.js';

export default class BaseLayout_Selection_Rotate
{
    constructor(options)
    {
        this.baseLayout             = options.baseLayout;
        this.markersSelected        = options.markersSelected;

        this.angle                  = parseFloat(Math.max(0, Math.min(360, options.angle)));

        this.selectionBoundaries    = (options.selectionBoundaries !== undefined) ? options.selectionBoundaries : null;
        this.useHistory             = (options.history !== undefined) ? options.history : true;

        if(typeof gtag === 'function')
        {
            gtag('event', 'Rotate', {event_category: 'Selection'});
        }

        return this.rotate();
    }

    rotate()
    {
        if(this.markersSelected && isNaN(this.angle) === false)
        {
            console.time('rotateMultipleMarkers');

            if(this.selectionBoundaries === null)
            {
                this.selectionBoundaries = this.baseLayout.getSelectionBoundaries(this.markersSelected);
            }

            let wires           = [];
            let historyPathName = [];

            for(let i = 0; i < this.markersSelected.length; i++)
            {
                if(this.markersSelected[i].options.pathName !== undefined)
                {
                    let currentObject                       = this.baseLayout.saveGameParser.getTargetObject(this.markersSelected[i].options.pathName);

                    if(currentObject !== null)
                    {
                        if(this.useHistory === true && this.baseLayout.history !== null)
                        {
                            let currentObjectData   = this.baseLayout.getBuildingDataFromClassName(currentObject.className);
                                if(currentObjectData !== null && currentObjectData.mapLayer !== undefined)
                                {
                                    historyPathName.push([this.markersSelected[i].options.pathName, currentObjectData.mapLayer]);
                                }
                                else
                                {
                                    historyPathName.push(this.markersSelected[i].options.pathName);
                                }
                        }

                        if(currentObject.className === '/Game/FactoryGame/Character/Player/BP_PlayerState.BP_PlayerState_C')
                        {
                            // Find target
                            let currentObjectTarget = null;
                            for(let j = 0; j < currentObject.properties.length; j++)
                            {
                                if(currentObject.properties[j].name === 'mOwnedPawn')
                                {
                                    currentObjectTarget = this.baseLayout.saveGameParser.getTargetObject(currentObject.properties[j].value.pathName);
                                    break;
                                }
                            }

                            if(currentObjectTarget !== null)
                            {
                                let translationRotation = BaseLayout_Math.getPointRotation(
                                    currentObjectTarget.transform.translation,
                                    [this.selectionBoundaries.centerX, this.selectionBoundaries.centerY],
                                    BaseLayout_Math.getNewQuaternionRotate([0, 0, 0, 1], this.angle)
                                );
                                currentObjectTarget.transform.translation[0]  = translationRotation[0];
                                currentObjectTarget.transform.translation[1]  = translationRotation[1];
                                currentObjectTarget.transform.rotation        = BaseLayout_Math.getNewQuaternionRotate(currentObjectTarget.transform.rotation, this.angle);
                            }
                        }
                        else
                        {
                            let translationRotation = BaseLayout_Math.getPointRotation(
                                    currentObject.transform.translation,
                                    [this.selectionBoundaries.centerX, this.selectionBoundaries.centerY],
                                    BaseLayout_Math.getNewQuaternionRotate([0, 0, 0, 1], this.angle)
                                );
                                currentObject.transform.translation[0]  = translationRotation[0];
                                currentObject.transform.translation[1]  = translationRotation[1];

                            // Rotate all spline data and tangeant!
                            let mSplineData                      = this.baseLayout.getObjectProperty(currentObject, 'mSplineData');
                            if(mSplineData !== null)
                            {
                                for(let j = 0; j < mSplineData.values.length; j++)
                                {
                                    for(let k = 0; k < mSplineData.values[j].length; k++)
                                    {
                                        let currentValue    = mSplineData.values[j][k];
                                        let splineRotation  = BaseLayout_Math.getPointRotation(
                                            [currentValue.value.values.x, currentValue.value.values.y],
                                            [0, 0],
                                            BaseLayout_Math.getNewQuaternionRotate([0, 0, 0, 1], this.angle)
                                        );

                                        currentValue.value.values.x = splineRotation[0];
                                        currentValue.value.values.y = splineRotation[1];
                                    }
                                }
                            }
                            else
                            {
                                currentObject.transform.rotation        = BaseLayout_Math.getNewQuaternionRotate(currentObject.transform.rotation, this.angle);
                            }
                        }

                        if(currentObject.children !== undefined)
                        {
                            for(let j = 0; j < currentObject.children.length; j++)
                            {
                                let currentObjectChildren = this.baseLayout.saveGameParser.getTargetObject(currentObject.children[j].pathName);

                                // Grab wires for redraw...
                                for(let k = 0; k < this.baseLayout.availablePowerConnection.length; k++)
                                {
                                    if(currentObjectChildren.pathName.endsWith(this.baseLayout.availablePowerConnection[k]))
                                    {
                                        for(let m = 0; m < currentObjectChildren.properties.length; m++)
                                        {
                                            if(currentObjectChildren.properties[m].name === 'mWires')
                                            {
                                                for(let n = 0; n < currentObjectChildren.properties[m].value.values.length; n++)
                                                {
                                                    if(wires.includes(currentObjectChildren.properties[m].value.values[n].pathName) === false)
                                                    {
                                                        wires.push(currentObjectChildren.properties[m].value.values[n].pathName);
                                                    }
                                                }

                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        // Delete and add again!
                        let result = this.baseLayout.parseObject(currentObject);
                            this.baseLayout.deleteMarkerFromElements(result.layer, this.markersSelected[i], true);
                            this.baseLayout.addElementToLayer(result.layer, result.marker);
                    }
                }
            }

            for(let i = 0; i < wires.length; i++)
            {
                let currentObject   = this.baseLayout.saveGameParser.getTargetObject(wires[i]);
                let result          = this.baseLayout.parseObject(currentObject);
                let oldMarker       = this.baseLayout.getMarkerFromPathName(currentObject.pathName, result.layer);
                    this.baseLayout.deleteMarkerFromElements(result.layer, oldMarker, true);
                    this.baseLayout.addElementToLayer(result.layer, result.marker);
            }

            if(this.useHistory === true && this.baseLayout.history !== null)
            {
                this.baseLayout.history.add({
                    name: 'Undo: Rotate selection by ' + this.angle + '°',
                    values: [{
                        pathNameArray: historyPathName,
                        callback: 'BaseLayout_Selection_Rotate',
                        properties: {angle: (360 - this.angle), selectionBoundaries: this.selectionBoundaries}
                    }]
                });
            }

            console.timeEnd('rotateMultipleMarkers');
            this.baseLayout.updateRadioactivityLayer();
        }

        this.baseLayout.cancelSelectMultipleMarkers();
    }
}