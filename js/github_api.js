const apiBaseUrl = `https://api.github.com/users/kampert-it`;
const apiRepoUrl = '/repos?sort=updated&per_page=100';

/** Full GitHub repo page URLs; metadata is loaded via GET /repos/{owner}/{repo}. */
const EXTRA_REPO_URLS = [
    'https://github.com/VillagerCraft/ot-suggestions',
    'https://github.com/VillagerCraft/ot-transcript-control'
];

function parseGithubOwnerRepo(htmlUrl) {
    try {
        const url = new URL(htmlUrl);
        const host = url.hostname.replace(/^www\./, '');
        if (host !== 'github.com') {
            return null;
        }
        const segments = url.pathname.split('/').filter(Boolean);
        if (segments.length !== 2) {
            return null;
        }
        const [owner, repo] = segments;
        return { owner, repo };
    } catch {
        return null;
    }
}

async function fetchRepoMeta(owner, repo) {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!response.ok) {
            return null;
        }
        return await response.json();
    } catch {
        return null;
    }
}

async function fetchRepoByHtmlUrl(htmlUrl) {
    const parsed = parseGithubOwnerRepo(htmlUrl);
    if (!parsed) {
        return null;
    }
    return fetchRepoMeta(parsed.owner, parsed.repo);
}

function mergeDedupeSort(userRepos, extraRepos) {
    const seen = new Set();
    const merged = [];
    for (const repo of userRepos) {
        const key = repo.full_name || repo.html_url;
        if (key && !seen.has(key)) {
            seen.add(key);
            merged.push(repo);
        }
    }
    for (const repo of extraRepos) {
        const key = repo.full_name || repo.html_url;
        if (key && !seen.has(key)) {
            seen.add(key);
            merged.push(repo);
        }
    }
    merged.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return merged;
}

async function retrieveRepos() {
    const getUrl = apiBaseUrl + apiRepoUrl;

    try {
        const response = await fetch(getUrl);
        if (!response.ok) {
            setDefaultInformation();
            return;
        }

        const repos = await response.json();
        if (!Array.isArray(repos)) {
            setDefaultInformation();
            return;
        }

        const extraResults = await Promise.all(
            EXTRA_REPO_URLS.map((url) => fetchRepoByHtmlUrl(url))
        );
        const extraRepos = extraResults.filter(Boolean);
        const merged = mergeDedupeSort(repos, extraRepos);

        displayRepos(merged);
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

    repoDiv.innerHTML = '';
    repos.forEach(repo => {
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
        elementText.textContent = repo.description ?? '';
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
