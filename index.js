// 1 create header which includes the user account,
// 2 create a filter and form on the aside
// 3 render in the main section, in this way we only render main section which is easier to read

// some css is already added, feel free to change it

//GENERAL VARIABLES:
const headerEl = document.querySelector("header");
const asideEl = document.querySelector(".aside");
const mainEl = document.querySelector(".main");
const mainRenderSection = document.querySelector(".mainrendersection");
const journaUlList = document.querySelector(".journal-Ul-List");
const checkboxSection = document.querySelector(".checkbox-section");
//STATE:
let state = {
  users: [
    {
      id: 1,
      name: "Valentina",
    },
    {
      id: 2,
      name: "Linlin",
    },
  ],
  posts: [],

  niceFilmsFromAPI: [],

  activeUser: {
    id: "",
    name: "",
  },
  checkedGenre: [],
};
renderCheckbox();
renderAside();

//RENDER FUNCTION:
function renderAside() {
  //users section
  getUserInfo().then(function (accounts) {
    console.log(`fetch users: `, accounts);
    renderUserAccount(accounts);
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
  formTitle.innerText = "Create your journal entry:";

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

  let genreRomanceOption = document.createElement(`option`);
  genreRomanceOption.setAttribute(`value`, `romance`);
  genreRomanceOption.innerText = "Romance";

  let genreActionOption = document.createElement(`option`);
  genreActionOption.setAttribute(`value`, `action`);
  genreActionOption.innerText = "Action";

  let genreComedyOption = document.createElement(`option`);
  genreComedyOption.setAttribute(`value`, `comedy`);
  genreComedyOption.innerText = "Comedy";

  let genreMagicOption = document.createElement(`option`);
  genreMagicOption.setAttribute(`value`, `magic`);
  genreMagicOption.innerText = "Magic";

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

  //CONTENT:
  let labelComment = document.createElement(`label`);
  labelComment.setAttribute(`class`, `form-comment`);
  labelComment.setAttribute(`for`, `form-comment`);
  let labelCommentH3 = document.createElement(`h3`);
  labelCommentH3.setAttribute(`class`, `form-comment`);
  labelCommentH3.innerText = "Comment:";

  let inputComment = document.createElement(`textarea`);
  inputComment.setAttribute(`id`, `form-comment`);
  inputComment.setAttribute(`name`, `form-comment`);
  inputComment.setAttribute(`type`, `text`);
  inputComment.setAttribute(`placeholder`, `write comment here..`);
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

    let foundFilm = state.niceFilmsFromAPI.find(
      (film) => film.title === filmTitleSelectEl.value
    );

    let newPost = {
      orginalId: foundFilm.id,
      userId: "", //we need to figure our how to make this the selected User Id
      image: imageInput.value,
      genre: genreSelectEl.value,
      content: inputComment.value,
      rating: 4,
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
  genreSelectEl.append(
    genreRomanceOption,
    genreActionOption,
    genreComedyOption,
    genreMagicOption
  );
  labelComment.append(labelCommentH3);
  imageLabel.append(imageLabelH3);

  formEl.append(
    filmTitleLabelEl,
    filmTitleSelectEl,
    genreLabel,
    genreSelectEl,

    imageLabel,
    imageInput,

    labelCommentH3,
    inputComment,

    formBtn
  );
  asideEl.append(formTitle, formEl);
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

  let ratingScore = document.createElement("p");

  ratingScore.className = "ratingScore";
  ratingScore.innerText = `Rating: ${post.rating} `;

  let svgel = document.createElement("img");
  svgel.setAttribute("class", "ratingstar");

  //put how may stars
  if (post.rating >= 3) {
    svgel.setAttribute("src", "image/rate.svg");

    ratingScore.append(svgel);
  }

  let genre = document.createElement("span");
  genre.innerText = post.genre;

  ratingSection.append(ratingScore, genre);

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

  journalList.append(
    journalReviewTitle,
    ratingSection,
    journalContent,
    journalBtns,
    filmPicture,
    filmDescription
  );

  journaUlList.append(journalList);
}

//FETCH USERS
function getUserInfo() {
  return fetch("http://localhost:3000/users").then(function (resp) {
    return resp.json();
  });
}

//USERS ACCOUNT FUNCTIONS:
function renderUserAccount(accounts) {
  accounts.map(function (account) {
    createUserAccount(account.name);
  });
}

function createUserAccount(name) {
  let userAccountdivEl = document.createElement("div");
  userAccountdivEl.className = "user-div";

  let userSpanName = document.createElement("span");
  userSpanName.innerText = name;

  userAccountdivEl.append(userSpanName);
  headerEl.append(userAccountdivEl);
}

function createEditForm(post) {
  let editForm = document.createElement("form");
  let contentInput = document.createElement("textarea");
  contentInput.setAttribute("type", "text");
  contentInput.setAttribute("rows", "3");
  contentInput.value = post.content;
  let submitBtn = document.createElement("button");
  submitBtn.innerText = "Submit";
  submitBtn.className = "edit_submitBTn";
  editForm.append(contentInput, submitBtn);
  return editForm;
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
    return checkGenre.toLowerCase();
  });
  console.log(genreArray);
  let filteredPosts = state.posts.filter(function (targetPost) {
    return genreArray.includes(targetPost.genre);
  });
  renderCards(filteredPosts);
}

function renderCheckbox() {
  let checkboxValueArray = ["Action", "Romamce", "Comedy", "Magic"];
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

function filterGenre() {}
