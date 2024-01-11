"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}


function navSubmitStoryClick(e) {
  console.debug('navSubmitStoryClick', e);
  hidePageComponents();
  $navSubmitStory.show();
  $allStoriesList.show();
  $submitForm.attr('style', 'display: flex')
}
$navSubmitStory.on('click', navSubmitStoryClick);

function navFavsClick(e) {
  console.debug('navFavsClick', e);
  console.log(e.target.id);
  hidePageComponents();
  favStoriesOnPage();
}
$navFavs.on('click', navFavsClick);

function navMyStoriesClick(e) {
  console.debug('navMyStoriesClick', e);
  console.log(e.target.id);
  hidePageComponents();
  myStoriesOnPage();
}
$navMyStories.on('click', navMyStoriesClick);