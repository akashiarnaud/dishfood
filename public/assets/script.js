const searchForm = document.querySelector("#vocal");
const searchFormInput = searchForm.querySelector("input");
let idPlat;
let liste;
let envoyer;
let noty;
let produit;
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if(SpeechRecognition){
    searchForm.insertAdjacentHTML("beforeend",'<button type="button"><i class="fa fa-microphone" aria-hidden="true"></i></button>');
    const micBtn = searchForm.querySelector("button");
    const micIcn = searchForm.querySelector("i");
    const recognition = new SpeechRecognition();
    micBtn.addEventListener("click",micBtnClick);
    function micBtnClick(){
        if(micIcn.classList.contains("fa-microphone")){
            recognition.start();
        }
        else{
            recognition.stop();
        }
    }
    recognition.addEventListener("start",startSpeechRecognition);
    function startSpeechRecognition(){
        console.log("speech recognition active");
        micIcn.classList.remove("fa-microphone");
        micIcn.classList.add("fa-microphone-slash");
        searchFormInput.focus();
    }
    recognition.addEventListener("end",endSpeechRecognition);
    function endSpeechRecognition(){
        console.log("speech recognition disconnected");
        micIcn.classList.remove("fa-microphone-slash");
        micIcn.classList.add("fa-microphone");
        searchFormInput.focus();
    }
    recognition.addEventListener("result",resultOfSpeechRecognition);
    function resultOfSpeechRecognition(event){
        const mot = event.results[0][0].transcript;
        searchFormInput.value = mot;
    }
}
else{
    console.log("fail");
}
searchForm.addEventListener("submit", event => {
    event.preventDefault();
    //const specialite = document.querySelector("input").value;
    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=2a7678ac832440449a925c5a0e21fe41&cuisine=${searchFormInput.value}`)
    .then(request => {
        return request.json();
    })
    .then(data => {
        liste = document.querySelector('ul');
        liste.innerHTML = null;
        let li;
        let image;
        let a;
        
        for(let i=0;i<data.results.length;i++){
            li = document.createElement("li");
            produit = document.querySelector("produit");
            a = document.createElement("button");
            a.textContent = "recipe";
            a.addEventListener("click",afficherRecette);
            a.setAttribute("class","m-2 btn-primary");
            image = document.createElement("img");
            image.src = data.results[i].image;
            image.setAttribute("class","w-25 p-3");
            li.textContent = data.results[i].title;
            liste.appendChild(li);
            li.appendChild(a);
            liste.appendChild(image);
            idPlat = data.results[i].id;
            }
          
        }
    
        
    );
});
const afficherRecette = () => {
    console.log(idPlat);    
    
    fetch(`https://api.spoonacular.com/recipes/${idPlat}/information?apiKey=2a7678ac832440449a925c5a0e21fe41&includeNutrition=false`)
    .then(request => {
        return request.json();
    })
    .then(data => {
        liste.innerHTML = null;
        const ingredient = document.querySelector("ingredient ul");
        ingredient.setAttribute("class","list-group");
        const user = document.querySelector("user");
        const note = document.querySelector("note");
        const comment = document.querySelector("comment");
        const commentaire = document.querySelector("#commentaire");
        let lis;
       for(let i=0;i<data.extendedIngredients.length;i++){
            const h3 = document.querySelector("h3");
            h3.textContent = "Ingrédient";
            
            if(data.extendedIngredients[i].aisle!="Produce"){
                lis = document.createElement("li");
                lis.setAttribute("class","border border-primary list-group-item");
                lis.textContent = data.extendedIngredients[i].aisle+" // Préparation: "+data.extendedIngredients[i].original;
            }
            ingredient.appendChild(lis);
            
       }
       //partie commentaire
       user.querySelector("p").textContent = "Veuillez entrer votre nom";
       const userInput = document.createElement("input");
       userInput.setAttribute("type","text");
       user.appendChild(userInput);
       note.querySelector("p").textContent = "A quelle point vous avez aimer la recette d'une echelle de 1 à 5";
       const noteInput = document.createElement("input");
       noteInput.setAttribute("type","text");
       note.appendChild(noteInput);
       comment.querySelector("p").textContent = "Un petit mot pour les autres utilisateurs";
       const commentInput = document.createElement("input");
       commentInput.setAttribute("type","text");
       comment.appendChild(commentInput);
        envoyer = document.createElement("button");
       envoyer.textContent = "envoyer"; 
       commentaire.appendChild(envoyer);
       
       noty = {
        id : idPlat,
        nom : '',
        note: '',
        comment : ''
       }
       userInput.addEventListener("keydown", () => {
            noty.nom = userInput.value;
       });
       noteInput.addEventListener("keydown",() => {
           noty.note = noteInput.value;
       });
       commentInput.addEventListener("keydown",()=>{
            noty.comment = commentInput.value;
       });

      
       envoyer.addEventListener("click",initApp);
    });
};
firebase.initializeApp({
    apiKey: 'AIzaSyACVkBWc7VZGzvi0GqHA5RBUPf4wKWePNw',
    projectId: 'food-ed76a'
  });

const db = firebase.firestore();
async function initApp(){
    const res = await db.collection('commentaire').doc().set(noty);
    console.log("data envoyer: "+noty.id+""+noty.nom);
}
//test
async function getStore() {
    db.collection("commentaire").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data().id}`);
    console.log(`${doc.id} => ${doc.data().user}`);
    console.log(`${doc.id} => ${doc.data().note}`);
    console.log(`${doc.id} => ${doc.data().comment}`);
    
    });
    });
   }
    
   getStore();
