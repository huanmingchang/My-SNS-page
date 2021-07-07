const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const users = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
let filteredUser = []
const users_per_page = 12
const paginator = document.querySelector('#paginator')

function renderUserList(data) {
  let htmlContent = ''
  data.forEach((user) => {
    htmlContent += `
        <div class="col-lg-2 col-sm-3">
          <div class="mb-2">
            <div class="card rounded-3">
              <img
                class="card-img-top"
                src="${user.avatar}"
                alt="User avatar" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${user.id}"
              />
              <div class="card-body" style="height: 4rem;">
                <h6 class="card-title">${user.name} ${user.surname}</h6>
              </div>
							<div class="d-flex justify-content-end mx-3 my-2">
							  <button class="btn btn-outline-danger btn-add-friend" data-bs-id="${user.id}"><i class="far fa-heart"></i></button>
							</div>
            </div>
          </div>
        </div>
    `
  })
  dataPanel.innerHTML = htmlContent
}

function renderUserModal(id) {
  const modalTile = document.querySelector('#user-modal-title')
  const modalImage = document.querySelector('#user-modal-image')
  const modalEmail = document.querySelector('#user-modal-email')
  const modalGender = document.querySelector('#user-modal-gender')
  const modalAge = document.querySelector('#user-modal-age')
  const modalBirthday = document.querySelector('#user-modal-birthday')
  const modalRegion = document.querySelector('#user-modal-region')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    modalTile.innerText = data.name + ' ' + data.surname
    modalImage.innerHTML = `
    <img src="${data.avatar}" alt="avatar" class="img-fluid rounded-circle w-75"/>
    `
    modalEmail.innerText = 'Email: ' + data.email
    modalGender.innerText = 'Gender: ' + data.gender
    modalAge.innerText = 'Age: ' + data.age
    modalBirthday.innerText = 'Birthday: ' + data.birthday
    modalRegion.innerText = 'Region: ' + data.region
  })
}

// function renderPaginator(amount) {
//   const numberOfPages = Math.ceil(amount / users_per_page)
//   let htmlContent = ''
//   for (page = 1; page <= numberOfPages; page++) {
//     htmlContent += `
//      <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
//     `
//     paginator.innerHTML = htmlContent
//   }
// }

// function addToFavorite(id) {
//   const list = JSON.parse(localStorage.getItem('bestFriends')) || []
//   const user = users.find((user) => user.id === id)

//   if (list.some((user) => user.id === id)) {
//     return alert('You are already best friends!')
//   }
//   list.push(user)
//   localStorage.setItem('bestFriends', JSON.stringify(list))
// }

dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.card-img-top')) {
    renderUserModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-friend')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()
  filteredUser = users.filter(
    (user) =>
      user.name.toLowerCase().includes(keyword) ||
      user.surname.toLowerCase().includes(keyword)
  )
  if (filteredUser.length === 0) {
    return alert(`Opps! There is no peron named "${keyword}"!`)
  }
  renderUserList(filteredUser)
})

axios
  .get(INDEX_URL)
  .then((response) => {
    users.push(...response.data.results)
    renderUserList(users)
  })
  .catch((error) => console.log(error))
