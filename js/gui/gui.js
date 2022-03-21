import { GUI } from '../../node_modules/three/examples/jsm/libs/lil-gui.module.min.js';

let panelSettings
const baseActions = {
    idle: { weight: 1 },
    moveForward: { weight: 0 },
    turnLeft: { weight: 0 },
    turnRight: { weight: 0 }
};
let currentBaseAction = 'idle'
const crossFadeControls = [];
const additiveActions = {
    sneak_pose: { weight: 0 },
    sad_pose: { weight: 0 },
    agree: { weight: 0 },
    headShake: { weight: 0 }
};

function createPanel() {

    const panel = new GUI( { width: 310 } );

    const folder1 = panel.addFolder( 'first model' );
    const folder2 = panel.addFolder( 'second model' );

    panelSettings = {
        'modify time scale': 1.0
    };

    const baseNames = [ ...Object.keys( baseActions ) ];

    for ( let i = 0, l = baseNames.length; i !== l; ++ i ) {
        const name = baseNames[ i ];
        const settings = baseActions[ name ];
        panelSettings[ name ] = function () {
            const currentSettings = baseActions[ currentBaseAction ];
            const currentAction = currentSettings ? currentSettings.action : null;
            const action = settings ? settings.action : null;
            prepareCrossFade( currentAction, action, 0.35 );
        };

        crossFadeControls.push( folder1.add( panelSettings, name ) );
    }

    for ( const name of Object.keys( additiveActions ) ) {
        const settings = additiveActions[ name ];

        panelSettings[ name ] = settings.weight;
        folder2.add( panelSettings, name, 0.0, 1.0, 0.01 ).listen().onChange( function ( weight ) {
            setWeight( settings.action, weight );
            settings.weight = weight;
        });
    }

    folder1.open();
    folder2.open();

    crossFadeControls.forEach( function ( control ) {
        control.setInactive = function () {
            control.domElement.classList.add( 'control-inactive' );
        };

        control.setActive = function () {
            control.domElement.classList.remove( 'control-inactive' );
        };

        const settings = baseActions[ control.property ];

        if ( ! settings || ! settings.weight ) {
            control.setInactive();
        }
    });

}

function setWeight( action, weight ) {
    action.enabled = true;
    action.setEffectiveTimeScale( 1 );
    action.setEffectiveWeight( weight );
}

export default createPanel