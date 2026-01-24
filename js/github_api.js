const apiBaseUrl = `https://api.github.com/users/kampert-it`;
const apiRepoUrl = '/repos?sort=updated&per_page=100'

async function retrieveRepos() {
    const getUrl = apiBaseUrl + apiRepoUrl;

    try {
        const response = await fetch(getUrl);
        if (!response.ok) {
            setDefaultInformation();
        }

        const repos = await response.json();

        displayRepos(repos);
    } catch (exception) {
        console.error(exception);
        setDefaultInformation();
    }
}

function setDefaultInformation() {
    const repoDiv = document.getElementsByClassName('projectsGrid')[0];
    repoDiv.innerHTML = '';
    //Create the container
    const containerLink = document.createElement('a');
    containerLink.className = 'repoContainer';
    containerLink.href = 'https://github.com/kampert-it';
    containerLink.target = '_blank';
    //Title
    const elementTitle = document.createElement('h1');
    elementTitle.textContent = 'Whoa';
    //Information
    const elementText = document.createElement('p');
    elementText.textContent = 'I can\'t connect to the GitHub API right now. Click this card to view my projects on GitHub.com';
    //Add all the elements
    containerLink.append(elementTitle);
    containerLink.append(elementText);
    repoDiv.append(containerLink);
}

function displayRepos(repos) {
    const repoDiv = document.getElementsByClassName('projectsGrid')[0];

    if (repos.length < 1) {
        setDefaultInformation();
        return;
    }

    repos.forEach(repo => {
        repoDiv.innerHTML = '';
        //Create the container
        const containerLink = document.createElement('a');
        containerLink.className = 'repoContainer';
        containerLink.href = repo.html_url;
        containerLink.target = '_blank';
        //Title
        const elementTitle = document.createElement('h1');
        elementTitle.textContent = repo.name;
        //Information
        const elementText = document.createElement('p');
        elementText.textContent = repo.description;
        //Metadata
        const elementMeta = document.createElement('p');
        elementMeta.className = 'repoMeta';
        elementMeta.textContent = `Created: ${new Date(repo.created_at).toLocaleDateString()} | Updated: ${new Date(repo.updated_at).toLocaleDateString()}`;
        //Add all the elements
        containerLink.append(elementTitle);
        containerLink.append(elementText);
        containerLink.append(elementMeta);
        repoDiv.append(containerLink);
    });
}

retrieveRepos();