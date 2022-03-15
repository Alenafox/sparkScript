const Scene = require('Scene');
const {picker} = require('NativeUI');
const Textures = require('Textures');
const Diagnostics = require('Diagnostics');
const Patches = require('Patches');
const Reactive = require('Reactive');
const FaceTracking = require('FaceTracking');
const { findUsingPattern } = require('Textures');
const face0 = FaceTracking.face(0);

Promise.all([
  Scene.root.findFirst('bustA'),
  Scene.root.findFirst('bustB'),
  Scene.root.findFirst('bustC'),
]).then(onReady);

function onReady(assets) {

  const bustA = assets[0];
  const bustB = assets[1];
  const bustC = assets[2];

  const bustAtra = bustA.transform.toSignal();
  const bustBtra = bustB.transform.toSignal();
  const bustCtra = bustC.transform.toSignal();

  const faceTra = face0.cameraTransform.applyTo(bustAtra).applyTo(bustBtra).applyTo(bustCtra);

  const FaceOffset = Reactive.point(0,0,0.535);

  const neckPos = faceTra.position.add(FaceOffset).expSmooth(70);

  Patches.inputs.setVector('neck', neckPos);
}

(async function () {
  Promise.all([
    Textures.findUsingPattern('picker0_*'), //0
    Scene.root.findByPath('**/earringR*'), //1
    Scene.root.findByPath('**/earringL*'), //2
    Scene.root.findByPath('**/brooche*') //3
    ]).then(function(results){

      let earringR = results[1];
      let earringL = results[2];
      let brooche = results[3];

      for(let i = 0; i < 6; i++){
          earringR[i].hidden = true;
          earringL[i].hidden = true;
          brooche[i].hidden = true;
        }

      let textures = [];

      textures.push(results[0].map(texture => {
        return {image_texture: texture}
      }))

      picker.configure ({
        selectedIndex: 0,
        items: textures[0]
      })

      picker.visible = true;

      picker.selectedIndex.monitor().subscribe(function(val) {
        Patches.inputs.setScalar('picker', picker.selectedIndex);
        Patches.inputs.setBoolean('tap', true);
        switch(val.newValue) {
          case 0: {
            for(let i = 0; i < 6; i++){
              earringR[i].hidden = true;
              earringL[i].hidden = true;
              brooche[i].hidden = true;
              }
            Patches.inputs.setBoolean('tap', false);
            break;
         }
          case 1:
          case 2:
          case 3:
          case 4:
          case 5:
          case 6: {
            for(let i = 0; i < 6; i++){
              if (i == val.newValue-1){
                earringR[i].hidden = false;
                earringL[i].hidden = false;
                }
              else {
                earringR[i].hidden = true;
                earringL[i].hidden = true;
                }
              }
            break;
            }
          case 7:
          case 8:
          case 9:
          case 10:
          case 11:
          case 12: {
            for(let i = 0; i < 6; i++){
              if (i + 6 == val.newValue-1)
                brooche[i].hidden = false;
              else 
                 brooche[i].hidden = true;
              }
            break;
            }
      }
    });
  });
})();
