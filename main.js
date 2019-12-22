/*
Author: Scarlett Hwang
Date: September 2019
This JS file manipulates the front-end properties of a book search and
recommendation webpage.
*/

(function() {
  "use strict";
  window.addEventListener("load", init);
  const URL = "https://www.googleapis.com/books/v1/volumes";
  const SIZE = 5;
  let final = "";
  let buttonCount = 0;

  function init() {
    id("search").addEventListener("click", function() {
      id("query").disabled = true;
      id("search").disabled = true;
      queryDB(id("query").value);
    });
  }

   function queryDB(keyword) {
     if(id("book").hasChildNodes()) {
       while(id("book").firstChild) {
         id("book").removeChild(id("book").firstChild);
       }
     }

     fetch(URL + "?q=" + keyword)
      .then(checkStatus)
      .then(JSON.parse)
      .then(askInterest)
      .catch(function() {
        id("error-text").classList.remove("hidden");
        id("error-text").innerText =
           "Something went wrong with the request. Please try again later.";
      });
    }

    function askInterest(json) {
      if (buttonCount < 3) {
        id("guide").innerText = "What keywords interest you the most?";
        id("query-div").classList.add("hidden");

        for (let i = 0; i < SIZE; i++) {
          //console.log(json.items[i].volumeInfo.title);
          let button = document.createElement("p");
          let strArr = str2nounArr(json.items[i].volumeInfo.title);
          let string = "";
          for (let j = 0; j < strArr.length; j++) {
            string = string + " " + strArr[j];
          }
          button.innerText = string;

          button.addEventListener("click", function() {
            buttonCount++;
            final = this.innerText;
            queryDB(this.innerText);
          })

          button.classList.add("choose-button");
          id("book").appendChild(button);
        }
      } else {
        fetchBook(final)
      }
    }

    function fetchBook(info) {
      fetch(URL + "?q=" + info)
       .then(checkStatus)
       .then(JSON.parse)
       .then(function(json) {
         displayBook(json.items[0]);
       })
       .catch(function() {
         id("error-text").classList.remove("hidden");
         id("error-text").innerText =
            "Something went wrong with the request. Please try again later.";
       });
    }

    function displayBook(json) {
      console.log(json);
    }

/* ------------------------------ Helper Functions ------------------------------ */

    // Helper function that takes in a string, splice it, and returns an array of
    // only nouns and useful words for querying
    function str2nounArr(str) {
      let nounArr = [];
      let temp = str.split(" ");

      for (let i = 0; i < temp.length; i++) {
        if (!isStopWord(temp[i])) {
          nounArr.push(temp[i].toLowerCase());
        }
      }
      return nounArr;
    }

    // Helper function that takes in a word and returns a boolean value of whether
    // the word is a noun or a userful word for querying(false) or not(true)
    function isStopWord(word) {
      let stopwords = ["is", "are", "the", "a", "an", "of", "in", "on", "to", "and"];

      if (stopwords.includes(word.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise rejected
   *                     Promise result
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300 || response.status === 0) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  function qs(className) {
    return document.querySelector(className);
  }
})();


/**----------------------------garbage codes------------------------------------
    function showBooks(json) {
      // TEST
      //console.log(json.items);

      let count = json.items.length;

      // Create one big div of first book
      let smalljson = json.items;
      let bookDiv = document.createElement("div");

      let imageLinks = smalljson[0].volumeInfo.imageLinks;
      if (typeof(imageLinks) !== "undefined") {
        let image = document.createElement("img");
        image.classList.add("thumbnail");
        image.src = imageLinks.smallThumbnail;
        bookDiv.appendChild(image);
      }

      console.log(smalljson[0].volumeInfo.title);
      console.log(str2nounArr(smalljson[0].volumeInfo.title));

      // let title = document.createElement("h2");
      // title.classList.add("book-title");
      // title.innerText = smalljson[0].volumeInfo.title;
      // bookDiv.appendChild(title);

      if (smalljson[0].volumeInfo.description) {
        let description = document.createElement("p");
        description.classList.add("book-desc");
        description.innerText = "Category: " + smalljson[0].volumeInfo.categories + "\n" +
                                smalljson[0].volumeInfo.description;
        bookDiv.appendChild(description);
      }

      id("book").appendChild(bookDiv);

      // Add small thumbnails for other search results
      let size = smalljson.length;
      if (size > SIZE) {
        size = SIZE;
      }

      for (let i = 1; i < size; i++) {
        console.log(smalljson[i].volumeInfo.title);
        let imageLinks = smalljson[i].volumeInfo.imageLinks;
        if (typeof(imageLinks) !== "undefined") {
          let image = document.createElement("img");
          image.classList.add("smallThumbnail");
          image.src = imageLinks.smallThumbnail;
          bookDiv.appendChild(image);
        } else {
          //default image
        }

        id("book").appendChild(bookDiv);
      }
    }
-------------------------------------------------------------------------------**/
