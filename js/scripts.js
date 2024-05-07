// https://github.com/nhn/tui.editor/issues/1637
// https://github.com/nhn/tui.editor/issues/360

// ----------------------------------------------------
// MOCKED DATA

const title = 'This is an idea of what we can do...';
const initialValue = `
 ${title}

## Chapter 1 - What do I do?

> Hello everyone, concerned Christian Father here.
> Recently my 11 year old son downloaded the video game Fortnite after playing it at a friend’s house.
> While I didn’t mind it at first, it soon began affect his character.
> Within a week he had taken up semi-pro Fortnite dancing competitions.
> When asked to do his homework, he called me a “default” and did a strange pose with his arms extended outwards.
> His grades have been dropping heavily ever since that day and when I confront him about it he threatens to “one pump” me.
> He refuses to eat his favourite foods anymore and constantly demands a “chug jug”.
> Now he has dyed his hair the colour blue as a way to “promote” his idol “Ninja” and refers to me and my wife as “little craps”.
> I try to get him to go to bible studies now but he just tells me to jump out of the “battle bus” without a glider.

> **Please help!!!**
`;

const percentage = 1.25;
const trimContent = (c) => ` ${c.split('.').join('').slice(1, c.length / percentage)} `;

const content4 = initialValue;
const content3 = trimContent(content4);
const content2 = trimContent(content3);
const content1 = trimContent(content2);

// TODO: Add date to title
const jsonResponse = [
    { id: 4, title: `${title} - ver. 4`, content: content4 },
    { id: 3, title: `${title} - ver. 3`, content: content3 },
    { id: 2, title: `${title} - ver. 2`, content: content2 },
    { id: 1, title: `${title} - ver. 1 `, content: content1 },
];

// ----------------------------------------------------
// CONSTANTS

const dropdownId = 'dropdown';
const filenameId = 'doc-title';
const saveFileId = 'save-local';
const optionId = 'option';
const overlayId = 'loading-overlay';
const loadingMessageId = 'loading-message';
const loadingSpannerId = 'loading-spanner';

const commitsKey = 'wrigitCommits';

const saveCommitMessage = 'Saving commit...';
const loadCommitsMessage = 'Loading commits...';

// ----------------------------------------------------
// EDITOR

const rule = /\[(@\S+)\]\((\S+)\)/;
const widgetRules = [
    {
        rule,
        toDOM(text) {
            const span = document.createElement('span');
            const i = text.match(rule);

            span.innerHTML = `<a class="widget-anchor" href="${i[2]}">${i[1]}</a>`;
            return span;
        },
    },
];

const config = {
    el: document.querySelector('#editor'),
    // initialValue,
    widgetRules,
    initialEditType: 'wysiwyg',
    height: '500px',
    previewStyle: 'vertical',
    hideModeSwitch: true,
};

const editor = new toastui.Editor({ ...config });

// ----------------------------------------------------
// UTILS

const saveLocalCommits = () => {
    localStorage.setItem(commitsKey, JSON.stringify(jsonResponse));
};

const getLocalCommits = () => {
    const commit = JSON.parse(localStorage.getItem(commitsKey));
    return commit;
};

const clearLocalCommits = () => {
    localStorage.removeItem(commitsKey);
}

const loadLocalCommits = (commits) => {
    jsonResponse.length = 0;
    for (let i = 0; i < commits.length; i += 1) {
        jsonResponse.push(commits[i]);
    }
    populateDropdown();
    return jsonResponse;
};

// https://stackoverflow.com/a/30832210
// TODO: save into a .zip file, containing also git changes of that file
// So we can load from that point... We could also save snapshots of the diffs and create
// the commits from there? idk...
const saveLocalFile = (blob, filename) => {
    const file = blob;
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
    return file;
};

const populateDropdown = (opts = jsonResponse) => {
    const dropdown = document.getElementById(dropdownId);
    dropdown.children = [];
    dropdown.innerHTML = '';
    for (let i = 0; i < opts.length; i += 1) {
        const option = document.createElement(optionId);
        option.text = opts[i].title;
        option.value = opts[i].title;
        option.id = opts[i].id;
        option.selected = !!(i === opts.length);
        dropdown.add(option);
    }
    return dropdown;
};

// TODO: rename arguments
const saveCommit = (numId, bodyContent, commitName) => {
    const commit = {
        id: numId,
        content: bodyContent,
        title: commitName,
    };

    // if no changes, don't commit!
    if (jsonResponse[0].content.trim() === commit.content) {
        return ;
    }
    jsonResponse.push(commit);
    const sorted = jsonResponse.sort(({ id: a }, { id: b }) => b - a);
    populateDropdown(sorted, saveCommitMessage);
    saveLocalCommits(sorted);
    return commit;
};

// Fake loaders
const displayLoader = (message) => {
    const fakeLoader = (msg) => {
        const overlay = document.getElementById(overlayId);
        const loadingSpanner = document.getElementById(loadingSpannerId)
        const loadingMessage = document.getElementById(loadingMessageId);
        overlay.classList.add('show');
        loadingSpanner.classList.add('show');
        loadingMessage.innerHTML = msg;
    
        const loadingTime = 4242 / 2;
        setTimeout(() => {
            overlay.classList.remove('show');
            loadingSpanner.classList.remove('show');
            loadingMessage.innerHTML = '';
        }, loadingTime);
        return loadingTime;
    };

    fakeLoader(message);
};

const onSave = (event) => {
    event.preventDefault();
    const bodyContent = editor.getMarkdown();
    const file = document.getElementById(filenameId).value;
    const blob = new Blob([bodyContent], {type: 'text/plain;charset=utf-8'});
    
    // TODO: removed mocked logic
    const numId = jsonResponse.length + 1;
    const commitName = `${title} - ver. ${numId}`;
    const commit = saveCommit(numId, bodyContent, commitName);
    if (commit) {
        displayLoader(saveCommitMessage);
    }

    // TODO: Implement function to save file -> sendToBackend(blob, filename, ...);
    const saveLocal = document.getElementById(saveFileId).checked;
    const extension = '.md';
    const filename = `${commitName || file || 'filename'}${extension}`;
    if (saveLocal) {
        saveLocalFile(blob, filename);
    }
    return blob;
};

const onSelectOption = () => {
    const optionValue = document.getElementById(dropdownId).value;

    for (let i = 0; i < jsonResponse.length; i += 1) {
        const titleValue = jsonResponse[i] && jsonResponse[i].title;
        if (optionValue === titleValue) {
            const data = jsonResponse[i].content;
            editor.setMarkdown(data, true);
        }
    }
    return optionValue;
};

const onDelete = (event) => {
    console.log({ event });
    event.preventDefault();
    event.stopPropagation();

    const confirmLabel = 'Are you sure you want to delete all your commits?';
    const confirmAcceptLabel = 'Your commits have been deleted.';
    const confirmDeclineLabel = 'Good choice! 👍';
    if (confirm(confirmLabel)) {
        // TODO: we should repopulate dropdown from with default commit history (initial JSON.response value)
        clearLocalCommits();
        window.alert(confirmAcceptLabel);
        window.location.reload();
    } else {
        window.alert(confirmDeclineLabel);
    }
}

// ----------------------------------------------------
// MAIN

const setTitle = () => {
    const titleInput = document.getElementById(filenameId);
    titleInput.value = title;
    return titleInput;
};

const runOnLoad = () => {
    // setTitle();
    // ^
    // The idea is that the title entered, is also being entered into the editor
    // so when the user types the title, it will modify the text on the editor
    // I won't implement this in vainilla javascript, because I am lazy
    // but at least here is the idea of the functionality :)
    const commits = getLocalCommits();
    if (commits) {
        // note: timeout to simulate request
        setTimeout(() => {
            loadLocalCommits(commits);
        }, 1000);
    }
};

document.onload = runOnLoad();
