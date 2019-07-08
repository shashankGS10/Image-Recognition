const accessKeyId = '45786f4cd5a7d3e24de15b47874faa56';
const happy = '../bin/happy.png';
const sad='../bin/sad.png';
const angry='../bin/angry.png';
const surprised='../bin/surprised.png';
const disgusted= '../bin/disgusted.png';
const neutral= '../bin/neutral.png';
const fearful= '../bin/fearful.png';
const emoji_obj ={
    'happy' : happy,
    'sad':sad,
    'angry':angry,
    'disgusted':disgusted,
    'fearful':fearful,
    'neutral':neutral,
    'surprised':surprised
}

function previewFile(){
    var canvas = document.querySelector('canvas');
    var img = document.querySelector('img'); //selects the query named img
    var loader = document.getElementById('loader');
    var file    = document.querySelector('input[type=file]').files[0]; //sames as here
    var reader  = new FileReader();
    img.style.display="block";
    canvas.style.display="none";
    loader.style.display = "block";
    
    reader.onloadend = function () {
        loader.style.display = "none";
        img.src = event.target.result;
    }

    if (file) {
        reader.readAsDataURL(file); //reads the data as a URL
    } 
}

async function predict_img(){
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');
    var img =document.querySelector('img');
    var loader = document.getElementById('loader');
    loader.style.display = "block";
    await stackml.init({'accessKeyId': accessKeyId});
    const model = await stackml.faceExpression(callbackLoad);
    // make prediction with the image
   model.detect(img ,callbackPredict);

    function callbackLoad() {
        console.log('callback after image classification model is loaded!');
    }
    function callbackPredict(err, results) {
        console.log(results);
        loader.style.display = "none";
        model.draw(canvas, img , results);
        img.style.display="none";
        canvas.style.display="block";
        
        // ctx.drawImage(img, 10, 10);
        results.outputs.forEach(element => {
          var x_axis=  element.detection.box.x;
          var y_axis= element.detection.box.y;
          var width = element.detection.box.width;
          var height= element.detection.box.height;
          
          var newImg = new Image();
          newImg.onload = function () {
            ctx.drawImage(newImg, x_axis, y_axis,width,height);
          }
        var max=0;
        var expression ;
        newImg.src = happy;
        element.expressions.forEach(element => {
            var prob = element.probability;
            var exp = element.expression;
            if(prob>max){
                max = prob;
                expression= exp;
            }
        });
        console.log(expression);
        newImg.src= emoji_obj[expression];
        
        
        
          
        });
    }

}

// callback after prediction


