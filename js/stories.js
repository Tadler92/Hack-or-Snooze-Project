"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */
let showBtn = false;
function generateStoryMarkup(story, showBtn) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      ${showBtn ? deleteBtn() : ''}
      ${starFavOrUnfav(currentUser, story)}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <hr>
      </li>
    `);
}

function deleteBtn() {
  if (showBtn === true) {
    return `<span class="trash">
                <i class="fas fa-trash-alt"></i>
              </span>`
  }
}

function starFavOrUnfav(user, story) {
  if (currentUser) {
    let starType = '';
    if (user.isFavorite(story)) {
      starType = 'fas';
      return `<span class="star">
              <i class="${starType} fa-star"></i>
            </span>`
    }
    else if (!user.isFavorite(story)) {
      starType = 'far';
      return `<span class="star">
              <i class="${starType} fa-star"></i>
            </span>`
    }
  }
  else {
    return '';
  }
}

async function toggleStarredFav(e) {
  console.debug('toggleStarredFav');

  console.log(e);
  console.log(e.target);
  console.log(e.target.parentElement.parentElement);
  console.log(e.target.parentElement.parentElement.id);
  const $target = $(e.target);
  const storyId = e.target.parentElement.parentElement.id;
  const story = storyList.stories.find(favStory => favStory.storyId === storyId);

  if ($target.hasClass('fas')) {
    await currentUser.deleteFav(story);
    $target.toggleClass('fas far');
  }
  else {
    await currentUser.addFav(story);
    $target.toggleClass('fas far');
  }

}
$storyListsAll.on('click', '.star', toggleStarredFav);


/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}


async function submitStory() {
  const $author = $('#create-author');
  const $title = $('#create-title');
  const $url = $('#create-url');
  const username = currentUser.username;

  let newStory = await storyList.addStory(currentUser, {
    title: `${$title.val()}`,
    author: `${$author.val()}`,
    url: `${$url.val()}`,
    username
  });

  $allStoriesList.prepend(generateStoryMarkup(newStory));
  $author.val('');
  $title.val('');
  $url.val('');
  $submitForm.attr('style', 'display: none')
}
$submitFormButton.on('click', submitStory);

async function deleteStory(e) {
  console.debug('deleteStory');
  console.log("from deleteStory", e.target);
  console.log("from deleteStory", e.target.parentElement);
  console.log("from deleteStory", e.target.parentElement.parentElement.id);
  const storyId = e.target.parentElement.parentElement.id;

  await storyList.removeStory(currentUser, storyId);

  await myStoriesOnPage();
}

$storyListsAll.on('click', '.trash', deleteStory);

function favStoriesOnPage() {
  console.debug('favStoriesOnPage');

  $favoritedStoriesList.empty();
  if (currentUser.favorites.length === 0) {
    $favoritedStoriesList.append('<h5>No favorites added!</h5>')
  }
  else {
    for (let story of currentUser.favorites) {
      $favoritedStoriesList.append(generateStoryMarkup(story));
    }
  }

  $favoritedStoriesList.show()
}

function myStoriesOnPage() {
  console.debug('myStoriesOnPage');

  $myStoriesList.empty();
  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append('<h5>No stories added by user yet!</h5>')
  }
  else {
    for (let story of currentUser.ownStories) {
      $myStoriesList.append(generateStoryMarkup(story, showBtn = true));
    }
  }
  console.log($myStoriesList);
  $myStoriesList.show()
}