// 1 create header which includes the user account,
// 2 create a filter and form on the aside
// 3 render in the main section, in this way we only render main section which is easier to read

// some css is already added, feel free to change it

//GENERAL VARIABLES:
const headerEl = document.querySelector("header");
const asideEl = document.querySelector(".aside");
const mainEl = document.querySelector(".main");
const mainRenderSection = document.querySelector(".main-render-section");
const journaUlList = document.querySelector(".journal-Ul-List");
const checkboxSection = document.querySelector(".checkbox-section");
const accountDivision = document.querySelector(".user-accounts");
console.log(accountDivision);

//STATE:
let state = {
  users: [],
  posts: [],
  people: [],
  niceFilmsFromAPI: [],
  activeUser: {
    id: null,
    name: null,
  },
  checkedGenre: [],
  currentMainCharactors: [],
};
renderCheckbox();
renderAside();

//RENDER FUNCTION:
function renderAside() {
  //users section
  getUserInfo().then(function (accounts) {
    console.log(`fetch users: `, accounts);
    state.users = accounts;
    renderUserAccounts(accounts);
  });

  //films-form section
  getFilmInfo().then(function () {
    createForm(state.niceFilmsFromAPI);
  });
}

//FILM DATA
function getFilmInfo() {
  let uglyFilmsData = {};

  return fetch(`https://ghibliapi.herokuapp.com/films/`)
    .then(function (resp) {
      return resp.json();
    })
    .then(function (filmsFromAPI) {
      uglyFilmsData = filmsFromAPI;
      console.log(`Ugly Films Data from API: `, uglyFilmsData);
      state.niceFilmsFromAPI = uglyFilmsData.map(function (element) {
        return transformUglyFilmAPI(element);
      });
      console.log(`state.niceFilmsFromAPI: `, state.niceFilmsFromAPI);
    });
}

//takes ugly-data from API and organise it in better way.
function transformUglyFilmAPI(uglyFilmAPI) {
  let nicelyTransformedFilm = {
    id: uglyFilmAPI.id,
    title: uglyFilmAPI.title,
    originalTitle: uglyFilmAPI.original_title,
    characters: uglyFilmAPI.people,
    releaseDate: uglyFilmAPI.release_date,
    description: uglyFilmAPI.description,
    director: uglyFilmAPI.director,
    people: uglyFilmAPI.people[0],
  };

  return nicelyTransformedFilm;
}

function postToServer(post) {
  return fetch("http://localhost:3000/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  }).then(function (resp) {
    return resp.json();
  });
}

function getPostsFromServer() {
  return fetch("http://localhost:3000/posts").then(function (resp) {
    return resp.json();
  });
}

getPostsFromServer().then(function (posts) {
  state.posts = posts;
  console.log(state.posts);
  renderCards(posts);
});

//ASIDE FORM FUNCTION:
function createForm(films) {
  //FORM TITLE:
  let formTitle = document.createElement(`h2`);
  formTitle.setAttribute(`class`, `form-title`);
  formTitle.innerText = "Create Your Own Journal:";

  //FORM:
  let formEl = document.createElement(`form`);
  formEl.setAttribute(`class`, `form`);
  formEl.setAttribute(`id`, `form`);
  // formEl.setAttribute(`autocomplete`, `off`);

  //FILM TITLE:
  let filmTitleLabelEl = document.createElement(`label`);
  filmTitleLabelEl.setAttribute(`for`, `post-title`);
  let filmTitleLabelH3 = document.createElement(`h3`);
  filmTitleLabelH3.setAttribute(`class`, `pick-a-title`);
  filmTitleLabelH3.innerText = "Pick a film title: ";

  let filmTitleSelectEl = document.createElement(`select`);
  filmTitleSelectEl.setAttribute(`name`, `post-title`);
  filmTitleSelectEl.setAttribute(`id`, `post-title`);

  for (const film of films) {
    let title = film.title;
    let filmTitleType = document.createElement(`option`);
    filmTitleType.setAttribute(`value`, title);
    filmTitleType.innerText = title;
    filmTitleType.required = true;

    filmTitleSelectEl.append(filmTitleType);
  }

  //FILM GENRE
  let genreLabel = document.createElement(`label`);
  genreLabel.setAttribute(`for`, `genre`);
  let genreLabelH3 = document.createElement(`h3`);
  genreLabelH3.setAttribute(`class`, `genre-title`);
  genreLabelH3.innerText = "Select genre: ";

  // 📌
  let genreSelectEl = document.createElement(`select`);
  genreSelectEl.setAttribute(`name`, `genre`);
  genreSelectEl.setAttribute(`id`, `genre`);

  let genreArray = [`Romance`, `Action`, `Comedy`, `Magic`];

  genreArray.map(function (selectedGenre) {
    let genreRomanceOption = document.createElement(`option`);
    genreRomanceOption.setAttribute(`value`, selectedGenre);
    genreRomanceOption.innerText = selectedGenre;
    genreSelectEl.append(genreRomanceOption);
  });

  //IMAGE:
  let imageLabel = document.createElement(`label`);
  imageLabel.setAttribute(`for`, `form-image`);
  let imageLabelH3 = document.createElement(`h3`);
  imageLabelH3.setAttribute(`class`, `form-image`);
  imageLabelH3.innerText = "Comment:";
  imageLabelH3.innerText = "Image: ";

  let imageInput = document.createElement(`input`);
  imageInput.setAttribute(`id`, `form-image`);
  imageInput.setAttribute(`name`, `form-image`);
  imageInput.setAttribute(`type`, `url`);
  imageInput.required = true;
  imageInput.setAttribute(`placeholder`, `Image URL`);

  //rating
  let ratingLabel = document.createElement(`label`);
  ratingLabel.className = "rating-lable";

  ratingLabel.innerText = "Rate a Score: ";

  let ratingSelectEl = document.createElement(`select`);
  ratingSelectEl.setAttribute(`name`, `rating`);
  ratingSelectEl.setAttribute(`class`, `ratinng`);

  let ratingArray = [1, 2, 3, 4, 5];

  ratingArray.forEach(function (score) {
    let scoreOption = document.createElement("option");
    scoreOption.setAttribute(`value`, score);
    scoreOption.innerText = score;

    ratingSelectEl.append(scoreOption);
  });
  ratingLabel.append(ratingSelectEl);

  //CONTENT:
  let labelComment = document.createElement(`label`);
  labelComment.setAttribute(`class`, `form-comment`);
  labelComment.setAttribute(`for`, `form-comment`);
  let labelCommentH3 = document.createElement(`h3`);
  labelCommentH3.setAttribute(`class`, `form-comment`);
  labelCommentH3.innerText = "Body:";

  let inputComment = document.createElement(`textarea`);
  inputComment.setAttribute(`id`, `form-comment`);
  inputComment.setAttribute(`name`, `form-comment`);
  inputComment.setAttribute(`type`, `text`);
  inputComment.setAttribute(`placeholder`, `write content here..`);
  inputComment.setAttribute(`rows`, `4`);
  inputComment.setAttribute(`cols`, `20`);
  inputComment.required = true;

  //CREATE POST BUTTON
  let formBtn = document.createElement(`button`);
  formBtn.setAttribute(`class`, `form-btn`);
  formBtn.innerText = "CREATE";

  asideEl.append(formEl);

  formEl.addEventListener(`submit`, function (e) {
    e.preventDefault();
    if (state.activeUser.id === null) {
      alert("Sign in First");
      return;
    }

    let foundFilm = state.niceFilmsFromAPI.find(
      (film) => film.title === filmTitleSelectEl.value
    );

    let newPost = {
      orginalId: foundFilm.id,
      userId: state.activeUser.id,
      userName: state.activeUser.name,
      image: imageInput.value,
      genre: genreSelectEl.value,
      content: inputComment.value,
      rating: ratingSelectEl.value,
      peopleUrl: foundFilm.people,
      animeInfo: {
        title: foundFilm.title,
        originalTitle: foundFilm.originalTitle,
        director: foundFilm.director,
        description: foundFilm.description,
      },
    };
    console.log(newPost);
    postToServer(newPost).then(function (postFromServer) {
      state.posts.push(postFromServer);
      console.log(postFromServer);
      // renderCard(newPost);
      renderCards(state.posts);
      formEl.reset();
    });
  });

  filmTitleLabelEl.append(filmTitleLabelH3);

  genreLabel.append(genreLabelH3);

  labelComment.append(labelCommentH3);
  imageLabel.append(imageLabelH3);

  formEl.append(
    formTitle,
    filmTitleLabelEl,
    filmTitleSelectEl,
    genreLabel,
    genreSelectEl,

    imageLabel,
    imageInput,

    ratingLabel,

    labelCommentH3,
    inputComment,

    formBtn
  );
  asideEl.append(formEl);
}

// form(data from server) inside the form we can get the nicefilmapi, genre, title, etc then post to server/ state.posts/ then renderposts

// posts should be state.posts and film should from the form
// or we dont need to renderposts in here, can just render one card based on the form
// use filter to find the data we look for

function renderCards(posts) {
  journaUlList.innerHTML = "";
  posts.map(renderCard);
}

//   post this post to our own server

function renderCard(post) {
  let journalList = document.createElement("li");
  journalList.className = "journallist";

  let userDiv = document.createElement("div");
  userDiv.className = "account-div";

  let userProfile = document.createElement("img");
  userProfile.className = "user-profile";

  let userName = document.createElement("span");
  userName.innerText = post.userName;

  if (post.userId === 1) {
    userProfile.setAttribute(
      "src",
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    );
  } else {
    userProfile.setAttribute(
      "src",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBn75PNFGZU7zbLgyVsUhlDEWyBQxLea3GCA&usqp=CAU"
    );
  }

  userDiv.append(userProfile, userName);

  let journalReviewTitle = document.createElement("h3");
  journalReviewTitle.innerText = `Review of `;

  let spanFilmName = document.createElement("span");
  spanFilmName.className = "filmname";
  //need to change
  spanFilmName.innerText = post.animeInfo.title;

  let originalTitle = document.createElement("p");
  originalTitle.innerText = post.animeInfo.originalTitle;

  journalReviewTitle.append(spanFilmName, originalTitle);

  let ratingSection = document.createElement("div");
  ratingSection.className = "ratediv";

  let ratingPara = document.createElement("p");

  ratingPara.className = "ratingPara";
  ratingPara.innerText = `Rating:  `;

  let ratingScore = document.createElement("span");
  ratingScore.className = "ratingscore";

  ratingScore.innerText = `${post.rating} `;

  if (ratingScore.innerText >= 3) {
    ratingScore.className = "high-rating-score";
  }

  ratingPara.append(ratingScore);

  let svgel = document.createElement("img");
  svgel.setAttribute("class", "ratingstar");

  //put how may stars
  if (post.rating >= 3) {
    svgel.setAttribute("src", "image/rate.svg");

    ratingPara.append(svgel);
  }

  let genre = document.createElement("span");
  genre.className = "ratingGenre";
  genre.innerText = post.genre;

  ratingSection.append(ratingPara, genre);

  let journalBtns = document.createElement("div");
  journalBtns.className = "buttonsection";

  let deleteBTn = document.createElement("button");
  deleteBTn.className = "deleteBTn";
  deleteBTn.innerText = "DELETE";

  deleteBTn.addEventListener("click", function () {
    deleteDatatoServer(post).then(function () {
      let filteredPosts = state.posts.filter(function (targetPost) {
        return targetPost.id !== post.id;
      });
      state.posts = filteredPosts;
      renderCards(state.posts);
    });
  });

  let editBTn = document.createElement("button");
  editBTn.innerText = "Edit";

  editBTn.addEventListener("click", function () {
    if (state.activeUser.id == null) {
      alert("Sign in First");
      return;
    }

    if (state.activeUser.id !== post.userId) {
      alert("you are not the creator");
      return;
    }

    let editForm = createEditForm(post);
    journalContent.innerHTML = "";
    journalContent.append(editForm);
  });

  journalBtns.append(editBTn, deleteBTn);
  //todo create a form to edit then update to server then update to the state then rendercards

  let journalContent = document.createElement("p");
  journalContent.className = "journalContent";

  //need to change

  journalContent.innerText = post.content;

  let filmPicture = document.createElement("img");
  filmPicture.setAttribute("class", "filmpicture");
  filmPicture.setAttribute("src", post.image);

  let filmDescription = document.createElement("p");
  filmDescription.innerText = "Description";
  filmDescription.className = " filmDescription";
  filmDescription.innerText = "Description: ";

  let spanDescription = document.createElement("span");
  spanDescription.innerText = post.animeInfo.description;

  filmDescription.append(spanDescription);

  let readMoreBtn = document.createElement("button");
  readMoreBtn.className = "read-more-button";
  readMoreBtn.innerText = "Main Charactors";

  readMoreBtn.addEventListener("click", () => {
    getCharactorsInfo(post).then((allPeopleFromServer) => {
      console.log(allPeopleFromServer);
      state.people = [...allPeopleFromServer];
      console.log(state.people);
      let filteredPeople = state.people.filter((peopleFromState) => {
        return peopleFromState.films[0].includes(post.orginalId);
      });

      if (filteredPeople.length >= 4) {
        filteredPeople = filteredPeople.slice(0, 4);
      }
      state.currentMainCharactors = filteredPeople;

      if (state.currentMainCharactors.length === 0) {
        alert("No available data from API");
        return;
      }

      let imageSource = [
        "image/onlyyesterday.jpeg",
        "image/onlyyesterdaytwo.jpeg",
        "image/pompoko.jpeg",
        "image/spiritedAway.jpeg",
      ];
      console.log(state.currentMainCharactors);
      let mainCharactorsDiv = renderProfile(imageSource);

      let myModal = document.createElement("div");
      myModal.className = "my-modal";
      myModal.append(mainCharactorsDiv);
      console.log(myModal);
      console.log(mainRenderSection);
      mainRenderSection.append(myModal);
    });
  });

  journalList.append(
    userDiv,
    journalReviewTitle,
    ratingSection,
    journalContent,
    journalBtns,
    filmPicture,
    filmDescription,
    readMoreBtn
  );

  journaUlList.append(journalList);
}

//render charactors
function renderProfile(imageSource) {
  let mainCharactorsDiv = document.createElement("div");
  mainCharactorsDiv.className = "main-charactor-div";

  for (let i = 0; i < state.currentMainCharactors.length; i++) {
    let charactorDiv = document.createElement("div");
    charactorDiv.className = "charactor-div";

    let charactorProfile = document.createElement("img");
    charactorProfile.className = "charactor-profile";
    charactorProfile.setAttribute("src", imageSource[i]);

    let charactorDetails = {
      Name: state.currentMainCharactors[i].name,
      Gender: state.currentMainCharactors[i].gender,
      Age: state.currentMainCharactors[i].age,
    };

    let charactorDetailsDiv = document.createElement("div");
    charactorDetailsDiv.className = "charactor-details-div";

    for (const key in charactorDetails) {
      let charactorInfo = document.createElement("p");
      charactorInfo.innerText = `${key}: ${charactorDetails[key]}`;
      charactorDetailsDiv.append(charactorInfo);
    }

    charactorDiv.append(charactorProfile, charactorDetailsDiv);

    mainCharactorsDiv.append(charactorDiv);
  }

  let closeBtn = document.createElement("button");
  closeBtn.innerText = "close";
  mainCharactorsDiv.append(closeBtn);
  closeBtn.addEventListener("click", () => {
    mainCharactorsDiv.remove();
    let modal = document.querySelector(".my-modal");
    modal.remove();
  });

  return mainCharactorsDiv;
}

//Fetch people

let getCharactorsInfo = (post) => {
  let peopleUrl = post.peopleUrl;
  return fetch(peopleUrl).then((peopleFromServer) => {
    return peopleFromServer.json();
  });
};

//FETCH USERS
function getUserInfo() {
  return fetch("http://localhost:3000/users").then(function (resp) {
    return resp.json();
  });
}

//USERS ACCOUNT FUNCTIONS:
function renderUserAccounts(accounts) {
  accountDivision.innerHTML = "";
  accounts.forEach(function (account) {
    let userAccountdivEl = createUserAccount(account);
    accountDivision.append(userAccountdivEl);
  });
}

function createUserAccount(account) {
  let userAccountdivEl = document.createElement("div");
  userAccountdivEl.className = "user-div";

  if (state.activeUser.name === account.name) {
    userAccountdivEl.classList.add("active-user");
  }

  let userSpanName = document.createElement("span");
  userSpanName.innerText = account.name;

  userAccountdivEl.append(userSpanName);

  userAccountdivEl.addEventListener("click", function () {
    let editForm = document.querySelector(".edit-form");
    if (state.activeUser.id === account.id) {
      state.activeUser = {
        id: null,
        name: null,
      };
      console.log("You just signed off");

      renderCards(state.posts);
      renderUserAccounts(state.users);
      return;
    }

    state.activeUser = account;

    renderUserAccounts(state.users);

    if (editForm !== null) {
      renderCards(state.posts);
      return;
    }

    renderCards(state.posts);
    console.log(state.activeUser);
  });
  return userAccountdivEl;
}

function createEditForm(post) {
  let editForm = document.createElement("form");
  editForm.className = "edit-form";
  let contentInput = document.createElement("textarea");
  contentInput.setAttribute("id", "edit-textarea");
  contentInput.setAttribute("type", "text");
  contentInput.setAttribute("name", "contentEdit");
  contentInput.setAttribute("rows", "3");
  contentInput.setAttribute("class", "content-edit ");
  contentInput.value = post.content;

  let submitBtn = document.createElement("button");
  submitBtn.innerText = "Submit";
  submitBtn.className = "edit_submitBTn";

  let discardBtn = document.createElement("button");
  discardBtn.innerText = "Discard";
  discardBtn.className = "discard_submitBTn";

  editForm.append(contentInput, submitBtn, discardBtn);

  discardBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editForm.remove();
    renderCards(state.posts);
  });

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let textAreaText = document.getElementById("edit-textarea").value;
    if (textAreaText === "") {
      alert(
        "content can not be empty, please choose discard or delete your journal"
      );
    }

    if (state.activeUser.id !== post.userId) {
      editForm.remove();
      alert("you are not the creator");
      return;
    }
    updateContentToServer(editForm, post).then(function (
      updatedPostFromServer
    ) {
      let updatePostToStateIndex = state.posts.findIndex(function (targetPost) {
        return targetPost.id === updatedPostFromServer.id;
      });
      state.posts[updatePostToStateIndex] = updatedPostFromServer;
      renderCards(state.posts);
      editForm.remove();
    });
  });
  return editForm;
}

function updateContentToServer(form, post) {
  let updatePost = state.posts.find(function (targetPost) {
    return targetPost.id === post.id;
  });
  let updateID = updatePost.id;
  return fetch(`http://localhost:3000/posts/${updateID}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: form.contentEdit.value,
    }),
  }).then(function (resp) {
    return resp.json();
  });
}

function deleteDatatoServer(post) {
  let deletePost = state.posts.find(function (targetPost) {
    return targetPost.id === post.id;
  });
  let deleteID = deletePost.id;
  return fetch(`http://localhost:3000/posts/${deleteID}`, {
    method: "DELETE",
  });
}

function renderCheckedGenreList() {
  let genreArray = state.checkedGenre.map(function (checkGenre) {
    return checkGenre;
  });
  console.log(genreArray);
  let filteredPosts = state.posts.filter(function (targetPost) {
    return genreArray.includes(targetPost.genre);
  });
  console.log(state);
  console.log(filteredPosts);
  renderCards(filteredPosts);
}

function renderCheckbox() {
  let checkboxValueArray = ["Action", "Romance", "Comedy", "Magic"];
  checkboxValueArray.forEach(function (value) {
    let checkboxLabel = document.createElement("label");
    checkboxLabel.innerText = ` ${value}`;
    let checkboxInput = document.createElement("input");
    checkboxInput.className = "checkbox";
    checkboxInput.setAttribute("type", "checkbox");
    checkboxInput.setAttribute("value", value);
    checkboxLabel.prepend(checkboxInput);
    checkboxSection.append(checkboxLabel);

    checkboxInput.addEventListener("click", function () {
      if (checkboxInput.checked) {
        state.checkedGenre.push(checkboxInput.value);
        // console.log(state.checkedGenre);
        renderCheckedGenreList();
      } else {
        let uncheckedGenre = checkboxInput.value;
        state.checkedGenre = state.checkedGenre.filter(function (targetGenre) {
          return targetGenre !== uncheckedGenre;
        });
        // console.log(state.checkedGenre);
        state.genre = [];
        renderCheckedGenreList();
        let checkNodelists = document.querySelectorAll(".checkbox");
        let checkStatusArray = [];

        for (const checkboxInList of checkNodelists) {
          checkStatusArray.push(checkboxInList.checked);
        }

        // console.log(checkStatusArray);
        if (!checkStatusArray.includes(true)) {
          renderCards(state.posts);
        }
      }
    });
  });
  let clearAllBtn = document.createElement("button");
  clearAllBtn.className = "clear_btn";
  clearAllBtn.innerText = "Reset All";

  checkboxSection.append(clearAllBtn);

  let checkNodelists = document.querySelectorAll(".checkbox");

  clearAllBtn.addEventListener("click", function () {
    for (const checkboxInList of checkNodelists) {
      checkboxInList.checked = false;
    }
    renderCards(state.posts);
  });
}
