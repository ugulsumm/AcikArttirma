var firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
firebase.initializeApp(firebaseConfig);  // Initialize Firebase

var db = firebase.firestore();
class Arttirma {
  constructor (ad, deger, kategori, ozellik, son, sonFiyat, kullanici) {
      this.ad = ad;
      this.deger = deger;
      this.kategori = kategori;
      this.ozellik = ozellik;
      this.son = son;
      this.sonFiyat=sonFiyat;
      this.kullanici=kullanici;
  }
  toString() {
      return this.ad + ', ' + this.deger + ', ' + this.kategori + ', ' + this.ozellik + ', ' + this.son + ', '+ this.sonFiyat + ', ' + this.kullanici;
  }
}

// Firestore data converter
var arttirmaConverter = {
  toFirestore: function(artt) {
      return {
          ad: artt.ad,
          deger: artt.deger,
          kategori: artt.kategori,
          ozellik: artt.ozellik,
          son: artt.son,
          sonFiyat: artt.sonFiyat,
          kullanici: artt.kullanici
          }
  },
  fromFirestore: function(snapshot, options){
      const data = snapshot.data(options);
      return new Arttirma(data.ad, data.deger, data.kategori, data.ozellik, data.son, data.sonFiyat, data.kullanici)
  }
}

  db.collection("arttirmalar").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {    
          db.collection("arttirmalar").doc(doc.id)
            .withConverter(arttirmaConverter)
            .get().then(function(doc) {
            if (doc.exists){              
              console.log(`${doc.id}`);
              var art = doc.data();
              console.log(art.toString());

              arttirmaSil(doc.data().son,doc.id);

            } else {
            console.log("No such document!")
            }}).catch(function(error) {
            console.log("Error getting document:", error);
          });
      });
  });

  
  function arttirmaSil(sonTarih,id){//Son zamanı gelen arttırmları sil
    var sonT=Date.parse(sonTarih); console.log(sonT);
    console.log(id);

    var timer=setInterval(function(){
      var an = new Date().getTime();
      console.log("Şimdi: " +an );
      console.log("Bitiş tarihi: "+sonT);
      var t=sonT-an;
      console.log("Bitmesine kalan süre:  "+t);

          if((sonT-an)<=59999){//1 dakikadan az bir süre varsa

            //sil(verilen id'yi databaseden sil):
            db.collection("arttirmalar").doc(id).delete().then(function() {
              console.log("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });
            //verilen id'nin storagedeki tüm dosyalarını sil 
            fileRef=storageRef.ref(id+'/');
            fileRef.listAll().then(function(res){
              res.items.forEach(function(imageRef){
                imageRef.delete().then(function() {
                 console.log("Folder successfully deleted!");
                }).catch(function(error) {
                   console.log(error);
                });
              });
           });

            console.log("süre doldu, arttırma sonlandı");
            clearInterval(timer);
          }           
    },60000);

  }


  //STORAGE ÇEKMEK

var storageRef=firebase.storage();

var listRef=storageRef.ref('/');
listRef.listAll().then(function(res) {
  res.prefixes.forEach(function(folderRef) {
    console.log(folderRef);console.log(folderRef.location);console.log(folderRef.location.path);
    var fileRef=storageRef.ref(folderRef.location.path+'/');
    console.log("fileRef:"+fileRef);
    fileRef.listAll().then(function(res){
      res.items[0].getDownloadURL().then(function(url){//Bütün dosyhaların ilk elemanlarını aldık

         resimAyarla(url,fileRef);
         console.log(url);       
      });
    });  
 
  });
}).catch(function(error) {
  console.log(error);
});



function resimAyarla(url,ustFolder){
  //Fotoğrafın şeklini yapıyoruz//taslak oluşturuyoruz
var row=document.getElementById("row");
var div1=document.createElement("div");
div1.setAttribute("class", "col-md-4");
row.appendChild(div1);
var div2=document.createElement("div");
div2.setAttribute("class","card mb-4");
div1.appendChild(div2);
var im=document.createElement("img");
im.setAttribute("class", "card-img-top img-thumbnail");
im.setAttribute("src", url);
div2.appendChild(im);
var div3=document.createElement("div");
div3.setAttribute("class", "card-body");
div2.appendChild(div3);
var h= document.createElement("h4");
h.setAttribute("class","card-title");
div3.appendChild(h);
var p= document.createElement("p");
p.setAttribute("class","card-text");
div3.appendChild(p);
var buttonDetay=document.createElement("button");
buttonDetay.setAttribute("class", "btn btn-primary");
buttonDetay.setAttribute("type", "button");
buttonDetay.innerText="Ayrıntılar";
div3.appendChild(buttonDetay);
var div4=document.createElement("div");
div4.setAttribute("class","card-footer text-muted");
div2.appendChild(div4);



//FireBase den resimler ile aynı id ye sahip özellikleri anasayfada ilgili resme aktarıyoruz.
db.collection("arttirmalar").get().then((querySnapshot) => {
  querySnapshot.forEach((doc) => {            
      db.collection("arttirmalar").doc(doc.id)
        .withConverter(arttirmaConverter)
        .get().then(function(doc) {
        if (doc.exists){
          console.log(`${doc.id}`);
          console.log("ustFolder:"+ustFolder);
          var folderRef=ustFolder;
          console.log(folderRef.location.path);
          var art=doc.data();
          if(folderRef.location.path==doc.id){//resim ile aynı database e eriştik,özelliklerini resme aktardık.
            console.log("id ve bulunduğu klasör aynı, aynı arttırma");
            h.innerText=art.ad;
                if(art.sonFiyat==null){
                  p.innerText=("Arrtırma Bitiş Tarihi:"+art.son +'\n'+"Deger: "+art.deger);          
                }else{
                  p.innerText=("Arrtırma Bitiş Tarihi:"+art.son +'\n'+"Deger: "+art.sonFiyat);          
                }
          }           
        } else {
        console.log("No such document!")
        }}).catch(function(error) {
        console.log("Error getting document:", error);
      });
  });
});


buttonDetay.addEventListener("click", function(){//detay sayfası için

  var folderRef=ustFolder;
  console.log("Bulunduğu dosya:"+folderRef);

  var fileRef=storageRef.ref(folderRef.location.path+'/');
  var idd=folderRef.location.path;
  fileRef.listAll().then(function(res){
    console.log(res.items.length);//her dosyanın içinde kaç resim olduğu
    res.items.forEach(function(imageRef){//her resim için
        imageRef.getDownloadURL().then(function(url) {//url yi al detay sayfasında yerleştir

          sliderSayfa(url,res.items.length,idd);
 
        });
    });

  });
  

  function sliderSayfa(url,icerikUzunlugu,idd){/////fotoğrafları deteyları ile yeni bir sayfa gibi gösteriyoruz.
    var container=document.getElementById("container");
    container.style.opacity = 0;     
    var yeniEkran=document.getElementById("yeniEkran");
    yeniEkran.style.opacity = 1;
    $(function(){//sayfayı en üstten başlatıyoruz
      var pos=($("#bas").position().top);
      $("body").animate({scrollTop : pos},0);
    });
    var div1=document.createElement("div");
    div1.setAttribute("id", "carouselExampleIndicators");
    div1.setAttribute("class","carousel slide");
    div1.setAttribute("data-ride","carousel");
    yeniEkran.appendChild(div1);
    var ol=document.createElement("ol");
    ol.setAttribute("class","carousel-indicators");
    div1.appendChild(ol);
      for(i=0;i<icerikUzunlugu;i++){
        var li=document.createElement("li");
        li.setAttribute("data-target","#carouselExampleIndicators");
        li.setAttribute("data-slide-to",i.toString());
        if(i==0){
          li.setAttribute("class","active");
        }
        ol.appendChild(li);
      }
    var div2=document.createElement("div");
    div2.setAttribute("class","carousel-inner");
    div1.appendChild(div2);

      for(i=0;i<icerikUzunlugu;i++){
        var div3=document.createElement("div");
        if(i==0){
          div3.setAttribute("class","carousel-item active");
        }else{
          div3.setAttribute("class","carousel-item");
        }
        div2.appendChild(div3);
        var img=document.createElement("img");
        img.setAttribute("class","d-block w-100");
        img.setAttribute("src",url);
        div3.appendChild(img);

        console.log(url);
      }


      //Ayrıntı divi oluşturma:
      var divAyrinti=document.createElement("div");
      divAyrinti.setAttribute("id", "ayrinti");
      divAyrinti.setAttribute("class", "my-4");
      yeniEkran.appendChild(divAyrinti);
      var pAyrinti=document.createElement("p");
      //pAyrinti.setAttribute("innerText");
      divAyrinti.appendChild(pAyrinti);
      var artUr = db.collection('arttirmalar').doc(idd);
      artUr.get().then(function(doc){//verilen  en yüksek teklifi firebase den çekip labelde gösteriyor
        if(doc.exists){
            pAyrinti.innerText=("Arttırmayı Başlatan Kişi: "+ doc.data().kullanici+ '\n' + "Arttırmanın Özellikleri: "+' \n' + doc.data().ozellik);         
        }
        else{
          console.log("Teklif yok");
        }
      }).catch(function(error){
        console.log(error);
      });


      

    
      //TEKLİF VERMEK
    var guncelFiyat=document.createElement("input");
    yeniEkran.appendChild(guncelFiyat);
    var buttonTeklif = document.createElement("button");
    buttonTeklif.setAttribute("class", "btn btn-primary");  
    buttonTeklif.setAttribute("type", "button");
    buttonTeklif.innerText="Teklif ver";
    yeniEkran.appendChild(buttonTeklif);
    var br =document.createElement("br");
    yeniEkran.appendChild(br);
    var enYuksekDeger=document.createElement("label");
    yeniEkran.appendChild(enYuksekDeger);
    var artUr = db.collection('arttirmalar').doc(idd);
    artUr.get().then(function(doc){//verilen  en yüksek teklifi firebase den çekip labelde gösteriyor
      if(doc.exists){
        if(doc.data().sonFiyat==null){
          enYuksekDeger.innerText=("Başlangıç Değeri: \n"+doc.data().deger);          
        }else{
          console.log("data:"+ doc.data().ad);
          enYuksekDeger.innerText=("En Yüksek Teklif: \n"+doc.data().sonFiyat);          
        }
      }
      else{
        console.log("Teklif yok");
      }
    }).catch(function(error){
      console.log(error);
    });

    buttonTeklif.addEventListener("click", function(){
      var degerFiyat=guncelFiyat.value;
      console.log(idd);
      var artUr = db.collection('arttirmalar').doc(idd);//verilen teklifi firebase ye yükle
      artUr.get().then(function(doc){//verilen  en yüksek teklifi firebase den çekip şimdiki verilen taklif ile karşılaştırıyor.
        if(doc.exists){
          console.log("data:"+ doc.data().sonFiyat);
          //var baslangicDegeri=null;
          if(doc.data().sonFiyat==null){//hiç teklif verilmemişse başlangıç değerini en düşük değer kabul et
            var baslangicDegeri=doc.data().deger;
            console.log(baslangicDegeri);
          }
          console.log(baslangicDegeri); 
          console.log(guncelFiyat.innerText);  

          console.log(Number(doc.data().deger));
          console.log(Number(degerFiyat));
          console.log(Number(doc.data().sonFiyat));  
          console.log(Number(baslangicDegeri));                              
          if(Number(degerFiyat)>Number(baslangicDegeri)||Number(degerFiyat)>Number(doc.data().sonFiyat)){
            
            artUr.update({ 
              capital: true,
              sonFiyat: degerFiyat                
            },{ merge: true })
            .then(function(docRef) {
              //console.log("Document written with ID: ", docRef.id);
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });
          }  
          
        }
        else{
          console.log("Dosya yok");
        }
      }).then(function(){//yüklenen son değeri(en yüksek değer) firebaseden çekip labelde gösteriyoruz.
        artUr.get().then(function(doc){
          if(doc.exists){
            console.log("data:"+ doc.data().ad);
              if(doc.data().sonFiyat==null){
                enYuksekDeger.innerText=("Henüz teklif verilmedi");
              }else{
              enYuksekDeger.innerText=("En Yüksek Teklif: \n"+doc.data().sonFiyat);      
              }
          }
          else{
            console.log("no document");          
          }
        }).catch(function(error){
          console.log(error);
        });
      }).catch(function(error){
        console.log(error);
      });  
    
    });
  

  }


});


}

