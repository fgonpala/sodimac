var pictureSource;   // picture source
var destinationType; // sets the format of returned value     

    function iniciarCamara() {   
        
        pictureSource=navigator.camera.PictureSourceType;      
        destinationType=navigator.camera.DestinationType; 
        //console.log("2-Iniciando Camara");
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64 encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI 
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
        
      console.log = "imageURI:" + imageURI;  
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      //navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50,
        //destinationType: destinationType.DATA_URL });
        
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50,
        destinationType: destinationType.FILE_URI});  
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.FILE_URI });
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,sourceType: source,targetWidth: 300,targetHeight: 300 });
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('Failed because: ' + message);
    }

function capturePopover(){
    try{
        console.log("PASO 1");
        var popover = new CameraPopoverOptions(300,300,100,100,Camera.PopoverArrowDirection.ARROW_ANY);
        
        console.log("Camera.DestinationType.DATA_URL:" + Camera.DestinationType.DATA_URL);    
        console.log("Camera.DestinationType.DATA_URL:" + pictureSource.SAVEDPHOTOALBUM);    
        console.log("popover:" + popover); 
        
        var options = { quality: 50, destinationType: Camera.DestinationType.DATA_URL,sourceType: pictureSource.SAVEDPHOTOALBUM, popoverOptions : popover };
        
        console.log("PASO 3");
            navigator.camera.getPicture(onSuccess, onFail, options);
        console.log("PASO 4");
    }catch(err){
        console.log("error popover:" + err.message);
    }
}    

function onSuccess(imageData) {
    var image = document.getElementById('myImage');
    image.src = "data:image/jpeg;base64," + imageData;
}

function onFail(message) {
    alert('Failed because: ' + message);
}
