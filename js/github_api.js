const apiBaseUrl = `https://api.github.com/users/kampert-it`;
const apiRepoUrl = '/repos?sort=updated&per_page=100'

async function retrieveRepos() {
    const getUrl = apiBaseUrl + apiRepoUrl;

    try {
        const response = await fetch(getUrl);
        if (!response.ok) {
            //TODO: Throw error
        }

        const repos = await response.json();

        displayRepos(repos);
    } catch (exception) {
        console.error(exception);
        //TODO: Display message on page
    }
}

function displayRepos(repos) {
    const repoDiv = document.getElementById('github-repos');
    repoDiv.innerHTML = '';

    if (repos.length < 1) {
        repoDiv.innerHTML = 'No (public) repositories available.';
        return;
    }

    repos.forEach(repo => {
        const div = document.createElement('div');

        //Title
        const title = document.createElement('h1');
        const link = document.createElement('a');
        link.href = repo.html_url;
        link.textContent = repo.name;
        title.append(link);
        div.append(title);

        //Description
        if (repo.description) {
            const description = document.createElement('p');
            description.textContent = repo.description;
            div.appendChild(description);
        }

        //Metadata
        const metadata = document.createElement('p');
        metadata.textContent = `Created: ${new Date(repo.created_at).toLocaleDateString()} | Updated: ${new Date(repo.updated_at).toLocaleDateString()}`;
        div.append(metadata);

        repoDiv.append(div);
    });
}

retrieveRepos();