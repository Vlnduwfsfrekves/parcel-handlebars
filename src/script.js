// import axios from "axios"
import postTpl from './posts.handlebars'
const BASE_URL = 'http://localhost:3000/'
let postBoxEl = document.getElementById("postsContainer")
const formEl = document.getElementById('createPostForm')
async function getPosts(){
  try{
    let posts=await fetch(`http://localhost:3000/posts`).then(resp => resp.json())
    return posts
  }catch(error){
    throw new Error(error)
  }
}
async function createPost(title, text) {
  try {
    let post = {
        title: title,
        text: text,
        comments: [
          {
            comments: "text"
          }
        ]
      }
    return await fetch(`${BASE_URL}posts`,{method:'POST',body:JSON.stringify(post),headers:{"Content-Type": "application/json; charset=UTF-8"}})
  } catch (error) {
    console.error(error);
  }
}
async function updatePost(id, title, text) {
  try {
      let post = {
        title:title,
        text:text
      }  
      return await fetch(`${BASE_URL}posts/${id}`,{method:'PATCH',body:JSON.stringify(post),headers:{"Content-Type": "application/json; charset=UTF-8"}})
    } catch (error) {
    console.error(error);
  }
}
async function deletePost(id) {
  try {
    return await fetch(`${BASE_URL}posts/${id}`,{method:'DELETE',headers:{"Content-Type": "application/json; charset=UTF-8"}})
  } catch (error) {
    console.error(error);
  }
}
async function createComment(id, comment) {
  try {
    let comments = await fetch(`${BASE_URL}posts/${id}`).then(resp=>resp.json())
    comments = comments['comments'][0]['comments']
    comments = [...comments,comment]
    let post = {
      comments:[
        {comments:comments}
      ]
    }  
    return await fetch(`${BASE_URL}posts/${id}`,{method:'PATCH',body:JSON.stringify(post),headers:{"Content-Type": "application/json; charset=UTF-8"}})
  } catch (error) {
    console.error(error);
  }
}
function renderPosts(posts) {
  postBoxEl.innerHTML=postTpl(posts)
}
async function startApp() {
  const posts = await getPosts();
  renderPosts(posts);
}
formEl.querySelector('button').addEventListener('submit', formEl.addEventListener('submit',async (event)=>{;event.preventDefault();let title=event.currentTarget.elements.title.value;let text=event.currentTarget.elements.text.value;createPost(title,text);startApp()}));
postBoxEl.addEventListener('click',async (e)=>{if(e.target.classList.contains('deletePostButton')){const id = e.target.getAttribute('data-id');await deletePost(id);await startApp()}})
postBoxEl.addEventListener('click',async (e)=>{if(e.target.classList.contains('editPostButton') && document.querySelector('#titleInput').value!=='' && !document.querySelector('#contentInput').value!==''){const id = e.target.getAttribute('data-id');await updatePost(id, document.querySelector('#titleInput').value,document.querySelector('#contentInput').value);await startApp()}})
postBoxEl.addEventListener('click', async (e) => {if (e.target.classList.contains('buttcomm')) {e.preventDefault();const id = e.target.getAttribute('data-id');const commentInput = e.target.parentElement.querySelector('.commentInput');const comment = commentInput.value;if (comment.trim() !== '') {await createComment(id, comment);await startApp();}}});
startApp()