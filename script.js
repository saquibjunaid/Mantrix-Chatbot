let prompt = document.querySelector("#prompt");
let submit = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input");

function createChatBox(html,classes){
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBZXPLyXp4z56AdCk_lYWN9YDiDgmDMvsM"
let user = {
  message:null,
  file:{
    data: null,        //Base64 (also known as tetrasexagesimal) is a group of binary-to-text encoding schemes that transforms binary data into a sequence of printable characters, limited to a set of 64 unique characters. More specifically, the source binary data is taken 6 bits at a time, then this group of 6 bits is mapped to one of 64 unique characters.
    mimeType: null,
  }
}
async function generateResponse(aiChatBox){
  let text = aiChatBox.querySelector(".ai-chat-area");
  let RequestOption = {
    method: "POST", 
    headers:{'Content-Type': 'application/json' },
    body:JSON.stringify(
      {
        "contents": [{
          "parts":[{"text": user.message},(user.file.data?[{"inlineData":user.file}]:[])

          ]
        }]
      }
    )
  }
  try{
    let response =await fetch(Api_Url,RequestOption);  //fetch always in a try block
    let data = await response.json(); // convert a JavaScript object or value into a JSON string, making it suitable for data transmission or storage. 
    let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim(); /*{candidates: Array(1), usageMetadata: {…}, modelVersion: 'gemini-2.0-flash'}
    candidates
    : 
    Array(1)
    0
    : 
    avgLogprobs
    : 
    -0.0040245767344128
    content
    : 
    parts
    : 
    Array(1)
    0
    : 
    {text: 'Hi there! How can I help you today?\n'}
    */
    //console.log(apiResponse);
    text.innerHTML = apiResponse;
    
  }
  catch(error){
    console.log(error);
  }

  finally{
    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"}); // it help us to scroll the final page after final rsponse
    image.src=`img.svg`;
    image.classList.remove("choose"); 
    user.file={};
  } 

}

function handlechatResponse(userMessage){
      
      user.message = userMessage; // user is a object and our data present inside the user
      let html = `<img src="user.png" alt="" id="user-image" width="8%">
      <div class="user-chat-area">
        ${user.message}
        ${user.file.data?`<img src="data:${user.file.mimeType};base64,${user.file.data}" class="choosingimg" />` : ""} 
      </div>` // it can show the image below the user input
      prompt.value = "";
      let userChatBox = createChatBox(html,"user-chat-box");
      chatContainer.appendChild(userChatBox);

      chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"}); //it help us to scroll the final page after user request

      setTimeout(() =>{

        let html = `<img src="ai.png" alt="" id="ai-image"  width="10%">
      <div class="ai-chat-area">
            <img src="loading.webp" alt="" class="load" width="50px">

      </div>`
      let aiChatBox = createChatBox(html,"ai-chat-box");
      chatContainer.appendChild(aiChatBox);
      generateResponse(aiChatBox);
      },600)

}

prompt.addEventListener("keydown", (e) =>{
    if(e.key == "Enter"){
      handlechatResponse(prompt.value);
    }
});
 submit.addEventListener("click",()=>{
        handlechatResponse(prompt.value);
 })
// image input
imageinput.addEventListener("change",()=>{

  const file = imageinput.files[0];
  if(!file) return

  let reader = new FileReader();
  reader.onload = (e) =>{
   // console.log(e);
   let base64string = e.target.result.split(",")[1];
   user.file={
    data: base64string,        //Base64 (also known as tetrasexagesimal) is a group of binary-to-text encoding schemes that transforms binary data into a sequence of printable characters, limited to a set of 64 unique characters. More specifically, the source binary data is taken 6 bits at a time, then this group of 6 bits is mapped to one of 64 unique characters.
    mimeType: file.type,
  }
  image.src=`data:${user.file.mimeType};base64,${user.file.data}`;
  image.classList.add("choose"); 
  }
  reader.readAsDataURL(file); // it can help to read the file
  
})
imagebtn.addEventListener("click",()=>{
   imagebtn.querySelector("input").click();
}) 