// function loadContent(url) {
//     fetch(url, {
//         headers: {
//             'X-Requested-With': 'XMLHttpRequest'
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         return response.text(); // Call the text method to get the response body
//     })
//     .then(text => {
//         console.log(text); // Log the response text
//         document.querySelector(".content-min").innerHTML = text; // Update the content
//     })
//     .catch(error => {
//         console.error('There has been a problem with your fetch operation:', error);
//     });
// }




// document.querySelectorAll(".nav-link").forEach(link => {
//     link.addEventListener('click', event => {
//         event.preventDefault();
//         const url = event.target.getAttribute('data-url'); // Get the data-url attribute
//         loadContent(url); // Load the content for the URL
//     });
// });

// document.addEventListener('DOMContentLoaded', () => {
//     loadContent(window.location.pathname); // Load the initial content based on the current path
// });

document.addEventListener('DOMContentLoaded', function() {
    const contentDiv = document.querySelector('.content-min');

    function loadContent(url) {
        fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Get the response body as text
        })
        .then(text => {
            contentDiv.innerHTML = text; // Update the content
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            contentDiv.innerHTML = `<p>Error loading content.</p>`;
        });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const url = event.target.getAttribute('data-url'); // Get the data-url attribute
            // history.pushState(null, '', url); // Change the URL without reloading the page
            console.log(url)
            loadContent(url); // Load the content for the URL


            // Update active state of navigation links
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            event.target.classList.add('active');
        });
    });

    window.addEventListener('popstate', () => {
        loadContent(window.location.pathname); // Handle back/forward button
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-url') === window.location.pathname) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });

    // Load initial content based on the current path
    loadContent(window.location.pathname);
});
