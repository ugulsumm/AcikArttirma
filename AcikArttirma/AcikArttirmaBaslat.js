// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

/////FOTOĞRAF SEÇMEK
var input = document.getElementById('image_uploads');
var preview = document.querySelector('.preview');
input.style.opacity = 0;
input.addEventListener('change', updateImageDisplay);
function updateImageDisplay() {
    while(preview.firstChild) {
      preview.removeChild(preview.firstChild);
    }  
    var curFiles = input.files;
    if(curFiles.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'No files currently selected for upload';
      preview.appendChild(para);
    } else {
      var list = document.createElement('ol');
      preview.appendChild(list);
      for(var i = 0; i < curFiles.length; i++) {
        var listItem = document.createElement('li');
        var para = document.createElement('p');
        if(validFileType(curFiles[i])) {
          para.textContent = 'File name ' + curFiles[i].name + ', file size ' + returnFileSize(curFiles[i].size) + '.';
          var image = document.createElement('img');
          image.src = window.URL.createObjectURL(curFiles[i]);
          image.height=240;          
          listItem.appendChild(image);
          listItem.appendChild(para);  
        } else {
          para.textContent = 'File name ' + curFiles[i].name + ': Not a valid file type. Update your selection.';
          listItem.appendChild(para);
        }  
        list.appendChild(listItem);
      }
    }
}

var fileTypes = [
  'image/jpeg',
  'image/pjpeg',
  'image/png'
]
function validFileType(file) {
  for(var i = 0; i < fileTypes.length; i++) {
    if(file.type === fileTypes[i]) {
      return true;
    }
  }
  return false;
}
function returnFileSize(number) {
    if(number < 1024) {
      return number + 'bytes';
    } else if(number > 1024 && number < 1048576) {
      return (number/1024).toFixed(1) + 'KB';
    } else if(number > 1048576) {
      return (number/1048576).toFixed(1) + 'MB';
    }
}


/////////Fırebase kaydetmek 
var arttirmaTamamla=document.getElementById("arttirmaTamamla");
arttirmaTamamla.addEventListener("click",function(){
    var parcaAd=document.getElementById("nesneAd").value;
    var parcaOzellik=document.getElementById("nesneOzellik").value;
    var parcaKategori=document.getElementById("nesneKategori").value;
    var arttirmaSon=document.getElementById("arttirmaSon").value;
    var parcaDeger = document.getElementById("nesneFiyat").value;
    var arttirmaBaslatan = document.getElementById("kullaniciAd").value;

    var sonT=Date.parse(arttirmaSon); console.log(arttirmaSon);
    var an = new Date().getTime();
    if((sonT-an)>=300000){////5 dakikadan çok varsa firebase ye kaydet

            //FireBaseKaydet
            var db = firebase.firestore();
            db.collection("arttirmalar").add({
              ad: parcaAd,
              ozellik: parcaOzellik,
              kategori: parcaKategori,
              son: arttirmaSon,
              deger: parcaDeger,
              kullanici: arttirmaBaslatan
            })
            .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
              //doysa oluştur(stotage de):
              var file = document.getElementById("image_uploads").files;
              for(var i=0;i<file.length;i++){
              console.log(file[i]);
              var fil=file[i];
              var storageRef = firebase.storage().ref(docRef.id+'/'+fil.name);
              storageRef.put(fil).then(function(snapshot) {
                alert("File Uploaded");
                console.log('Uploaded a blob or file!');
             });
            }
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });

    }else{
      alert("Zaman aralığı 5 dakikadan fazla olmak üzere bir bitiş süresi giriniz.");
    }

    function arttirma(ad,ozellik,kategori,son,deger,kullanici){
        this.ad=ad;
        this.ozellik=ozellik;
        this.kategori=kategori;
        this.son=son;
        this.deger=deger;
        this.kullanici=kullanici;
    }

    arttirma.prototype.jsonaCevir=function(){
      var satilacakNesne={
        ad: this.ad,
        ozellik: this.ozellik,
        kategori: this.kategori,
        son: this.son,
        deger: this.deger,
        kullanici: this.kullanici
      };
      var jsonSatilacakNesne=JSON.stringify(satilacakNesne);
      console.log("JSONSatilacakNesne: "+ jsonSatilacakNesne);
      //localStorage.setItem("satis", jsonSatilacakNesne);
      //localStorage.removeItem(document.getElementById("isim").value);//kayıt silme
      //localStorage.clear(); //bütün local storage i silme
    }
    
    var art1=new arttirma(parcaAd,parcaOzellik,parcaKategori,arttirmaSon,parcaDeger,arttirmaBaslatan);
    console.log("art1:"+  art1);//[object Object]
    console.log("art1.ad: "+ art1.ad);
    console.log("art1.ozellik: "+ art1.ozellik);
    console.log("art1.kategori: "+ art1.kategori);
    console.log("art1.son: "+ art1.son);
    console.log("art1.deger: "+ art1.deger);
    console.log("art1.baslatan: "+ art1.kullanici);

    art1.jsonaCevir();


    var gecis=document.getElementById('nesne');  
    gecis.setAttribute("action", "Anasayfa.html");


});



  



  


